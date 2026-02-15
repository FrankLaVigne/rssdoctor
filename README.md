# RSS Doctor

A small web app for inspecting RSS/Atom feed content.

## Features

- Enter any HTTP(S) feed URL.
- Parse RSS and Atom XML server-side.
- View channel metadata and item summaries.
- Open item links directly from the UI.

## Run locally

Requirements: Node.js 18+

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Usage

1. Paste an RSS/Atom feed URL into the `Feed URL` field and click `Inspect`.
2. Save useful URLs with `Save current URL`, then quickly reselect them from `Saved feeds`.
3. Narrow entries using filters:
   - `Filter by title or text`
   - `Filter by author`
   - `From/To` publish date range
4. Review the `Raw XML` panel to inspect the original feed content.

## API

`GET /api/feed?url=<feed-url>`

Example:

`/api/feed?url=https%3A%2F%2Fxkcd.com%2Fatom.xml`
