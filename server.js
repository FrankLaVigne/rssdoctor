const express = require('express');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function asText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    if (typeof value['#text'] === 'string') return value['#text'];
    if (typeof value['@_href'] === 'string') return value['@_href'];
    if (typeof value.href === 'string') return value.href;
  }
  return '';
}

function getLink(linkValue) {
  if (Array.isArray(linkValue)) {
    const atomAlt = linkValue.find((entry) => entry && entry['@_rel'] === 'alternate');
    return asText(atomAlt || linkValue[0]);
  }
  return asText(linkValue);
}

function parseFeedObject(root) {
  const rss = root.rss;
  if (rss && rss.channel) {
    const channel = first(rss.channel);
    const rawItems = channel.item ? (Array.isArray(channel.item) ? channel.item : [channel.item]) : [];

    return {
      format: 'RSS',
      channel: {
        title: asText(channel.title),
        link: getLink(channel.link),
        description: asText(channel.description),
        language: asText(channel.language),
        lastBuildDate: asText(channel.lastBuildDate),
        pubDate: asText(channel.pubDate)
      },
      items: rawItems.map((item) => {
        const enc = item.enclosure;
        const enclosure = enc ? {
          url: enc['@_url'] || '',
          type: enc['@_type'] || '',
          length: enc['@_length'] || ''
        } : null;

        const mapped = {
          title: asText(item.title),
          link: getLink(item.link),
          guid: asText(item.guid),
          pubDate: asText(item.pubDate),
          creator: asText(item['dc:creator']),
          author: asText(item.author),
          description: asText(item.description),
          content: asText(item['content:encoded']),
          enclosure
        };

        const fields = ['title', 'link', 'guid', 'pubDate', 'author', 'description', 'content']
          .filter((k) => mapped[k]);
        if (mapped.creator) fields.push('dc:creator');
        if (enclosure) fields.push('enclosure');
        mapped.fields = fields;

        return mapped;
      })
    };
  }

  const feed = root.feed;
  if (feed) {
    const rawEntries = feed.entry ? (Array.isArray(feed.entry) ? feed.entry : [feed.entry]) : [];

    return {
      format: 'Atom',
      channel: {
        title: asText(feed.title),
        link: getLink(feed.link),
        description: asText(feed.subtitle),
        language: asText(feed['@_xml:lang']),
        lastBuildDate: asText(feed.updated),
        pubDate: ''
      },
      items: rawEntries.map((entry) => {
        const links = Array.isArray(entry.link) ? entry.link : (entry.link ? [entry.link] : []);
        const encLink = links.find((l) => l && l['@_rel'] === 'enclosure');
        const enclosure = encLink ? {
          url: encLink['@_href'] || '',
          type: encLink['@_type'] || '',
          length: encLink['@_length'] || ''
        } : null;

        const mapped = {
          title: asText(entry.title),
          link: getLink(entry.link),
          guid: asText(entry.id),
          pubDate: asText(entry.updated || entry.published),
          creator: asText(entry.author && first(entry.author).name),
          author: asText(entry.author && first(entry.author).name),
          description: asText(entry.summary),
          content: asText(entry.content),
          enclosure
        };

        const fields = ['title', 'link', 'guid', 'pubDate', 'author', 'description', 'content']
          .filter((k) => mapped[k]);
        if (enclosure) fields.push('enclosure');
        mapped.fields = fields;

        return mapped;
      })
    };
  }

  throw new Error('Unsupported feed format. Expected RSS or Atom XML.');
}

app.get('/api/feed', async (req, res) => {
  const url = req.query.url;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing required query parameter: url' });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return res.status(400).json({ error: 'Only http and https URLs are supported.' });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'rssdoctor/0.1 (+https://local)'
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Failed to fetch feed (HTTP ${response.status}).` });
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: true,
      trimValues: true,
      processEntities: true
    });

    const parsed = parser.parse(xml);
    const feed = parseFeedObject(parsed);

    return res.json({
      sourceUrl: parsedUrl.toString(),
      itemCount: feed.items.length,
      rawXml: xml,
      ...feed
    });
  } catch (error) {
    return res.status(500).json({ error: `Unable to read feed: ${error.message}` });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`RSS Doctor running at http://localhost:${PORT}`);
});
