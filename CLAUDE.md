# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server (NODE_ENV=development, port 3000)
npm start            # Production server (port from PORT env or 3000)
```

No build step, test runner, or linter is configured.

## Architecture

RSS Doctor is a lightweight feed inspector: paste an RSS/Atom URL, view parsed channel info, filter items, and inspect raw XML.

**Backend** (`server.js`): Single Express server that serves static files from `public/` and exposes one API endpoint — `GET /api/feed?url=<feed-url>`. It fetches the remote XML, parses it with `fast-xml-parser`, detects RSS 2.0 vs Atom 1.0, and returns a normalized feed object (channel metadata + items array + raw XML).

**Frontend** (`public/`): Vanilla JS/HTML/CSS, no bundler. `app.js` manages all client logic — feed fetching, item rendering, multi-criteria filtering (text/author/date range), and a favorites system backed by localStorage (max 30). All user-visible content is escaped via `escapeHtml()` for XSS protection.

**Styling** (`public/styles.css`): Dark theme using CSS custom properties, glassmorphism panels, responsive grid (breakpoint at 720px).

## Key Conventions

- Only two production dependencies: `express` and `fast-xml-parser`
- Feed parsing helpers (`first()`, `asText()`, `getLink()`, `parseFeedObject()`) live in `server.js` — no separate modules
- The server sets User-Agent `rssdoctor/0.1` when fetching feeds
- SPA fallback: all unmatched routes serve `index.html`
