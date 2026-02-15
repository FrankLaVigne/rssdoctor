const form = document.getElementById('feed-form');
const input = document.getElementById('feed-url');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const channelDetailsEl = document.getElementById('channel-details');
const itemsListEl = document.getElementById('items-list');
const itemCountEl = document.getElementById('item-count');
const rawXmlEl = document.getElementById('raw-xml');
const favoritesSelectEl = document.getElementById('favorites-select');
const saveFavoriteButton = document.getElementById('save-favorite');
const removeFavoriteButton = document.getElementById('remove-favorite');
const filterQueryEl = document.getElementById('filter-query');
const filterAuthorEl = document.getElementById('filter-author');
const filterDateFromEl = document.getElementById('filter-date-from');
const filterDateToEl = document.getElementById('filter-date-to');
const clearFiltersButton = document.getElementById('clear-filters');

const FAVORITES_STORAGE_KEY = 'rssdoctor:favorites';

let currentFeed = null;

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function field(label, value) {
  return `<dt>${label}</dt><dd>${value || 'n/a'}</dd>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => typeof entry === 'string');
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(list));
}

function renderFavorites() {
  const favorites = loadFavorites();
  favoritesSelectEl.innerHTML = ['<option value="">Select a saved feed</option>']
    .concat(
      favorites.map((url) => {
        const safe = escapeHtml(url);
        return `<option value="${safe}">${safe}</option>`;
      })
    )
    .join('');
}

function normalizeDate(dateValue) {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function renderChannel(channel, format, sourceUrl) {
  channelDetailsEl.innerHTML = [
    field('Format', escapeHtml(format)),
    field('Title', escapeHtml(channel.title)),
    field('Link', channel.link ? `<a href="${escapeHtml(channel.link)}" target="_blank" rel="noreferrer">${escapeHtml(channel.link)}</a>` : 'n/a'),
    field('Description', escapeHtml(channel.description)),
    field('Language', escapeHtml(channel.language)),
    field('Published', escapeHtml(channel.pubDate)),
    field('Updated', escapeHtml(channel.lastBuildDate)),
    field('Source URL', `<code>${escapeHtml(sourceUrl)}</code>`)
  ].join('');
}

function pickText(item) {
  const text = item.description || item.content || '';
  const clean = text.replace(/<[^>]+>/g, '').trim();
  return clean.length > 280 ? `${clean.slice(0, 280)}...` : clean;
}

function applyFilters(items) {
  const query = filterQueryEl.value.trim().toLowerCase();
  const author = filterAuthorEl.value.trim().toLowerCase();
  const dateFrom = filterDateFromEl.value ? new Date(`${filterDateFromEl.value}T00:00:00`) : null;
  const dateTo = filterDateToEl.value ? new Date(`${filterDateToEl.value}T23:59:59`) : null;

  return items.filter((item) => {
    const title = (item.title || '').toLowerCase();
    const body = (item.description || item.content || '').replace(/<[^>]+>/g, '').toLowerCase();
    const byline = (item.author || item.creator || '').toLowerCase();
    const pubDate = normalizeDate(item.pubDate);

    if (query && !title.includes(query) && !body.includes(query)) return false;
    if (author && !byline.includes(author)) return false;
    if (dateFrom && (!pubDate || pubDate < dateFrom)) return false;
    if (dateTo && (!pubDate || pubDate > dateTo)) return false;
    return true;
  });
}

function renderItems(items) {
  itemsListEl.innerHTML = items
    .map((item) => {
      const title = escapeHtml(item.title || '(untitled)');
      const link = item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">${title}</a>` : title;
      const meta = [item.pubDate, item.author || item.creator, item.guid].filter(Boolean).map(escapeHtml).join(' | ');
      const desc = pickText(item);

      return `
        <li class="item">
          <p class="item-title">${link}</p>
          <div class="item-meta">${meta || 'No metadata'}</div>
          <p class="item-desc">${escapeHtml(desc || 'No description')}</p>
        </li>
      `;
    })
    .join('');
}

function rerenderFilteredItems() {
  if (!currentFeed) return;
  const filtered = applyFilters(currentFeed.items);
  renderItems(filtered);
  itemCountEl.textContent = `${filtered.length} / ${currentFeed.itemCount} items`;
}

async function inspectFeed(url) {
  setStatus('Loading feed...');
  resultsEl.classList.add('hidden');

  const response = await fetch(`/api/feed?url=${encodeURIComponent(url)}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  currentFeed = payload;
  renderChannel(payload.channel, payload.format, payload.sourceUrl);
  rawXmlEl.textContent = payload.rawXml || '';
  rerenderFilteredItems();
  resultsEl.classList.remove('hidden');
  setStatus('Feed loaded successfully.', 'success');
}

function addCurrentToFavorites() {
  const url = input.value.trim();
  if (!url) return;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    setStatus('Cannot save favorite: invalid URL.', 'error');
    return;
  }

  const normalized = parsed.toString();
  const favorites = loadFavorites();

  if (!favorites.includes(normalized)) {
    favorites.unshift(normalized);
    saveFavorites(favorites.slice(0, 30));
    renderFavorites();
  }

  favoritesSelectEl.value = normalized;
  setStatus('Saved feed URL.', 'success');
}

function removeSelectedFavorite() {
  const selected = favoritesSelectEl.value;
  if (!selected) return;

  const next = loadFavorites().filter((url) => url !== selected);
  saveFavorites(next);
  renderFavorites();
  setStatus('Removed saved feed URL.', 'success');
}

function clearFilters() {
  filterQueryEl.value = '';
  filterAuthorEl.value = '';
  filterDateFromEl.value = '';
  filterDateToEl.value = '';
  rerenderFilteredItems();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = input.value.trim();
  if (!url) return;

  try {
    await inspectFeed(url);
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

favoritesSelectEl.addEventListener('change', () => {
  const selected = favoritesSelectEl.value;
  if (selected) input.value = selected;
});

saveFavoriteButton.addEventListener('click', addCurrentToFavorites);
removeFavoriteButton.addEventListener('click', removeSelectedFavorite);

[filterQueryEl, filterAuthorEl, filterDateFromEl, filterDateToEl].forEach((inputEl) => {
  inputEl.addEventListener('input', rerenderFilteredItems);
});

clearFiltersButton.addEventListener('click', clearFilters);

renderFavorites();
