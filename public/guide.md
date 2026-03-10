# The Podcast RSS Field Guide

From a single `<enclosure>` tag to 30+ namespace extensions — how podcast RSS evolved, where it stands today, and where it's headed.

[← Back to RSS Doctor](/)

## Contents

1. [The Origins (2000–2005)](#era-1-the-origins-20002005)
2. [The iTunes Era (2005–2019)](#era-2-the-itunes-era-20052019)
3. [Podcasting 2.0 — The Open Revolt (2020–Present)](#era-3-podcasting-20--the-open-revolt-2020present)
4. [Apple Podcasts vs Spotify](#apple-podcasts-vs-spotify)
5. [The Full Directory Landscape](#the-full-podcast-directory-landscape)
6. [Hosting Platforms & Tag Support](#most-hosting-platforms-handle-this-for-you)
7. [Where It's Headed](#where-its-headed)

---

## Era 1: The Origins (2000–2005)

Podcasting started with a simple idea: what if RSS feeds could carry audio files?

- **2000** — Tristan Louis proposes attaching media files to RSS feeds.
- **2003** — Dave Winer builds the first audio RSS feed for journalist Christopher Lydon.
- **2004** — RSS 2.0's `<enclosure>` tag becomes the foundation of podcasting — just a URL, file size, and MIME type.
- **2005** — Apple adds podcast support to iTunes, changing everything.

### Base RSS 2.0 Tags

These are the standard tags that existed before any podcast-specific extensions:

| Tag | Level | Purpose |
|-----|-------|---------|
| `<title>` | Channel / Item | Show or episode name |
| `<link>` | Channel / Item | URL to the show or episode page |
| `<description>` | Channel / Item | Show or episode summary |
| `<pubDate>` | Channel / Item | Publication date (RFC 822) |
| `<guid>` | Item | Unique identifier for the episode |
| `<enclosure>` | Item | The media file (URL, size, MIME type) |
| `<author>` | Item | Episode author email |
| `<category>` | Channel | Feed categories |
| `<language>` | Channel | Feed language (ISO 639) |
| `<lastBuildDate>` | Channel | When the feed was last updated |

---

## Era 2: The iTunes Era (2005–2019)

When Apple launched podcast support in iTunes in 2005, they introduced their own XML namespace: `xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"`. Because Apple was the dominant podcast directory, every other platform adopted these tags. They became the de facto standard.

### Channel-Level iTunes Tags

| Tag | Purpose | Status |
|-----|---------|--------|
| `<itunes:author>` | Show author name | Current |
| `<itunes:owner>` | Owner name and email (not public-facing) | Current |
| `<itunes:image>` | Show artwork (min 1400×1400, rec 3000×3000) | Current |
| `<itunes:category>` | Apple Podcasts category & subcategory | Current |
| `<itunes:explicit>` | Explicit content flag (true/false) | Current |
| `<itunes:type>` | Show type: episodic or serial | Current |
| `<itunes:complete>` | Signals no more episodes will be published | Current |
| `<itunes:block>` | Prevent the show from appearing in Apple Podcasts | Current |
| `<itunes:new-feed-url>` | Redirect to a new feed URL | Current |

### Item-Level iTunes Tags

| Tag | Purpose | Status |
|-----|---------|--------|
| `<itunes:title>` | Episode title (clean, no episode numbers) | Current |
| `<itunes:episode>` | Episode number | Current |
| `<itunes:season>` | Season number | Current |
| `<itunes:episodeType>` | full, trailer, or bonus | Current |
| `<itunes:duration>` | Episode length (seconds or HH:MM:SS) | Current |
| `<itunes:image>` | Episode-specific artwork | Current |
| `<itunes:explicit>` | Episode-level explicit flag | Current |
| `<itunes:block>` | Hide specific episode from Apple Podcasts | Current |
| `<itunes:summary>` | Episode summary (now often replaced by `<description>`) | Deprecated |

Also commonly used during this era: `<content:encoded>` for rich HTML show notes, `<dc:creator>` for author names, and `<atom:link rel="self">` for feed self-referencing.

---

## Era 3: Podcasting 2.0 — The Open Revolt (2020–Present)

In 2020, Adam Curry and Dave Jones launched the **Podcast Index** to wrest control of podcast standards away from Apple and Spotify. The result: a new open namespace with 30+ tags that any app or host can implement.

Namespace: `xmlns:podcast="https://podcastindex.org/namespace/1.0"`

| Tag | What It Enables |
|-----|-----------------|
| `<podcast:transcript>` | Captions and transcripts (SRT, VTT, JSON) |
| `<podcast:chapters>` | Independently editable chapter markers |
| `<podcast:person>` | Credit hosts, guests, and producers with roles |
| `<podcast:soundbite>` | Suggest short clips for promotional use |
| `<podcast:trailer>` | Season-specific trailers |
| `<podcast:funding>` | Donation and funding links |
| `<podcast:value>` | Payment layer (Value4Value / streaming sats) |
| `<podcast:liveItem>` | Live show delivery to podcast apps |
| `<podcast:alternateEnclosure>` | Multiple bitrates, video versions, FLAC |
| `<podcast:guid>` | Global unique podcast identifier (platform-independent) |
| `<podcast:medium>` | Content type: podcast, music, audiobook, video, newsletter |
| `<podcast:socialInteract>` | Episode comments and discussion threads |
| `<podcast:location>` | Geographic tagging for content |
| `<podcast:locked>` | Prevent unauthorized feed imports |
| `<podcast:podroll>` | Cross-promote other podcasts |
| `<podcast:publisher>` | Publisher/network attribution |
| `<podcast:license>` | Content licensing terms |
| `<podcast:season>` | Named seasons and series |
| `<podcast:episode>` | Episode numbering with display text |
| `<podcast:chat>` | Chat integration for live and recorded episodes |
| `<podcast:contentLink>` | Related content and resource links |
| `<podcast:updateFrequency>` | Publishing schedule hints for apps |
| `<podcast:block>` | Per-directory exclusion control |
| `<podcast:txt>` | Verification and metadata text records |
| `<podcast:remoteItem>` | Reference episodes from other feeds |
| `<podcast:source>` | Alternate feed sources for redundancy |
| `<podcast:integrity>` | File integrity verification (hash) |
| `<podcast:images>` | Multiple image resources (deprecated in favor of `<podcast:image>`) |

---

## Apple Podcasts vs Spotify

### Philosophy: Open vs Closed

**Apple Podcasts** leans into the open RSS ecosystem. You host your feed anywhere, submit the RSS URL, and Apple indexes it. Your feed remains yours — Apple is a directory, not a host.

**Spotify** pulls in the opposite direction. If you host on Spotify for Creators, your RSS feed is hidden by default — you have to manually enable it to distribute elsewhere. Spotify wants to own the relationship.

### Monetization Comparison

| | Apple Podcasts | Spotify |
|--|----------------|---------|
| **Subscription cut** | 30% year 1, 15% after | 5.5% transaction fee |
| **Ad revenue** | N/A (you sell your own) | 50% via Partner Program |
| **Minimum audience** | None for subscriptions | 1,000 listeners + 2,000 hrs/month for ads |
| **Barrier to entry** | Low | Higher for ad monetization |

### Creator Tools

**Spotify offers:** customizable show pages, social links, episode recommendations, video podcasts, Q&A and polls (proprietary — not in RSS), built-in analytics.

**Apple offers:** Apple Podcasts Subscriptions, delegated delivery, and as of 2026 — native video support via HLS (bypasses RSS, uses a separate API).

### RSS Feed Differences

- **Apple** reads your RSS feed faithfully — iTunes namespace tags directly control how your show appears.
- **Spotify** reads RSS but layers on proprietary features (Q&A, polls, video) that live outside the feed.
- Spotify limits episode files to **200 MB**.
- Apple's new video support uses HLS, not RSS enclosures.

### How to Leverage Both

1. **Host independently** — don't host on Spotify directly, or you lose control of your RSS feed.
2. **Optimize your iTunes tags** — they're the lingua franca both platforms understand.
3. **Use Podcasting 2.0 tags** — transcripts, chapters, and person credits light up on open apps and future-proof your feed.
4. **Treat Spotify as a distribution channel**, not your home base — keep RSS as the source of truth.
5. **Use platform-specific features strategically** — Spotify's Q&A, Apple's subscriptions — but don't depend on what locks you in.
6. **Monitor your feed on both** — use [RSS Doctor](/) to inspect what each platform actually sees.

---

## The Full Podcast Directory Landscape

Apple and Spotify get the most attention, but they're not the whole market. Smart creators distribute everywhere.

| Platform | Reach | Notes |
|----------|-------|-------|
| **Apple Podcasts** | ~37% audio share | Largest audio directory, 2M+ shows |
| **Spotify** | ~32% audio share | 7M+ titles, strong in younger demographics |
| **YouTube / YouTube Music** | #1 globally (~39%) | 77M subscribers, dominant for video podcasts |
| **Amazon Music / Audible** | 55M+ listeners | Bundled with Prime, growing fast |
| **iHeartRadio** | Major (US) | Largest US radio company, strong spoken-word |
| **Podcast Addict** | #1 Android app | 10M+ downloads, power-user favorite |
| **PocketCasts** | Significant | Partially owned by NPR, cross-platform |
| **Overcast** | Significant (iOS) | Popular iOS app, indie-developed |
| **Acast** | 60M+ MAU | Network + host + directory |
| **Podchaser** | Niche | "IMDB of podcasts" — discovery and reviews |
| **Player FM** | Growing | 20M+ free podcasts, strong search/discovery |
| **Fountain** | Niche | Podcasting 2.0 native, Value4Value payments |
| **CastoPod** | Niche | Open-source, full Podcasting 2.0 support |

### Why This Matters

- **YouTube is the global #1** — many creators ignore it, but 39% of worldwide listeners prefer it.
- **Amazon/Audible is underrated** — 55M+ listeners and bundled with Prime.
- **Open apps** (Podcast Addict, PocketCasts, Fountain) are where Podcasting 2.0 tags actually render — transcripts, chapters, Value4Value.
- **Your RSS feed is the universal key** — one feed, distributed to all of these. That's the power of open RSS.

---

## Most Hosting Platforms Handle This For You

Most podcasters never write RSS XML by hand. Your hosting platform generates and manages your feed, including namespace tags. But **not all platforms support the same tags** — and that determines what listeners see in their apps.

### Podcasting 2.0 Tag Support by Host

| Platform | Transcript | Chapters | Funding | Person | Value | Live | Podroll | Soundbite | GUID |
|----------|:----------:|:--------:|:-------:|:------:|:-----:|:----:|:-------:|:---------:|:----:|
| **Blubrry** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **TrueFans** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Podhome** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **RSS.com** | Yes | Yes | Yes | — | Yes | Yes | Yes | Yes | Yes |
| **Castopod** | Yes | Yes | Yes | Yes | — | — | — | Yes | Yes |
| **Castos** | Yes | Yes | Yes | — | — | — | — | — | — |
| **Buzzsprout** | Yes | Yes | Yes | — | — | — | — | — | — |
| **Captivate** | Yes | — | Yes | — | Yes | — | — | — | Yes |
| **Transistor** | Yes | — | — | — | — | — | — | — | — |
| **Libsyn** | Yes | — | — | — | — | — | — | — | — |
| **Spotify for Creators** | — | — | — | — | — | — | — | — | — |

### What This Means For Creators

- **Your host determines your RSS capabilities.** If your host doesn't support `<podcast:transcript>`, your transcript won't appear in apps that look for it — even if you have one.
- **The big names lag behind.** Buzzsprout and Libsyn support the basics but miss advanced Podcasting 2.0 tags. Smaller hosts like Blubrry, TrueFans, and Podhome are leading.
- **Spotify for Creators is the most closed.** It doesn't even expose an RSS feed by default and supports zero Podcasting 2.0 tags.
- **Use [RSS Doctor](/) to check.** Inspect your feed to see exactly which tags your host is generating — and what you're missing.

---

## Where It's Headed

- **Video podcasting via RSS** — `<podcast:alternateEnclosure>` enables video alongside audio in a single feed. YouTube dominates video podcasts today, but open RSS is catching up.
- **AI-ready feeds** — transcripts are becoming standard, enabling AI-powered search, summarization, and discovery. Your feed becomes a structured data source, not just a media delivery mechanism.
- **Monetization built into RSS** — Value4Value and streaming payments let listeners pay creators directly, with no platform taking a cut.
- **Interactivity** — live shows, comments, and chat, all delivered through the RSS feed itself.
- **Decentralization** — `<podcast:guid>` and Podping reduce dependency on any single directory or platform. Your podcast identity is portable.
- **619M+ global listeners by 2026** — the audience is growing. The question is whether the open ecosystem or the walled gardens will serve them.

---

Built by [RSS Doctor](/) — inspect your feed to see these tags in action.
