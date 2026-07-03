# eLibAP — Andhra Pradesh & Telangana Digital Library

**AITS Tirupati Community Project**

A free digital library portal for students and communities in Andhra Pradesh and Telangana. Provides access to AP/TS Board educational resources, daily newspapers, novels, and community events — by linking to open external platforms (YouTube, DIKSHA, Open Library, Internet Archive) rather than hosting content directly.

---

## Architecture

```
Browser (HTML + CSS + JS)
        │
        │  fetch("data/videos.json"), fetch("data/educational.json"), ...
        ▼
data/  (static JSON files — no database, no backend)
  videos.json        YouTube video IDs (curated lessons)
  newspapers.json    e-paper links (Eenadu, Sakshi, etc.)
  books.json         Open Library / Archive.org links
  events.json        Upcoming workshops and events
  educational.json   Board/stage metadata, textbooks, competitive exam resources

External Platforms (content lives here, we just link/embed)
  ├── YouTube                 Video lessons (Telugu/English)
  ├── DIKSHA (diksha.gov.in)  AP/TS Board resources
  ├── Open Library            Novels and books (openlibrary.org)
  ├── Internet Archive        Press archives, old books (archive.org)
  └── Newspaper e-papers      Eenadu, Sakshi, Deccan Chronicle, etc.
```

### Why this design?
- **No database, no backend** — the site is 100% static HTML/CSS/JS + JSON. Every page's script does `fetch('data/whatever.json')` directly, same-origin, no server or API layer in between.
- **No hosting cost** — deployable to Netlify, GitHub Pages, or any static host for free. Content itself is served by YouTube, DIKSHA, and government portals; we only serve JSON.
- **Easy to extend** — add a new resource by editing a JSON file. No server restart, no build step.

> **Legacy note:** `server/` contains a small Java HTTP server (`Main.java`) from an earlier version of this project, when pages fetched `http://localhost:8080/api/...` instead of the JSON files directly. It's no longer required to run or deploy the site and is kept only in case a future feature needs real backend logic (the JSON files have no computed data today, so it was pure overhead).

---

## Project Structure

```
AITS-community-project/
│
├── index.html            Homepage — hero search, video grid, events preview
├── educational.html      AP/TS Board resources + embedded YouTube videos
├── newspaper.html        Daily e-papers + press archive search
├── novels.html           Books from Open Library + Archive.org
├── events.html           Workshops, book clubs, community board
│
├── css/
│   └── styles.css        All styles (teal design system, cards, nav, grid)
│
├── data/                 JSON content — edit these to add/remove resources
│   ├── videos.json
│   ├── newspapers.json
│   ├── books.json
│   ├── events.json
│   └── educational.json
│
└── server/               Core Java HTTP server
    ├── Main.java         Registers API routes, starts server on port 8080
    ├── JsonFileHandler.java  Reads JSON file → HTTP response with CORS
    └── run.sh            Compile + run script
```

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Any web browser | Chrome / Firefox / Safari | — |

No Java, no Maven, no Gradle, no npm, no frameworks, no build step needed.

---

## How to Run

Serve the project root with any static file server, then open `index.html`.

**Option A — Python (simplest):**
```bash
python3 -m http.server 3000
# then open http://localhost:3000
```

**Option B — VS Code Live Server:**
Right-click `index.html` → "Open with Live Server"

**Option C — File open:**
Double-click `index.html`. Works in most browsers since data is fetched via relative paths, but some browsers restrict `fetch()` over `file://` — if content doesn't load, use Option A or B instead.

---

## Deploying to Netlify

Since the site is fully static, Netlify needs no build command — just point it at the repo root.

1. Push this repo to GitHub (already set up if you're reading this from the repo).
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
3. Connect your GitHub account and select this repository.
4. Build settings:
   - **Build command:** leave blank
   - **Publish directory:** `.` (the repo root)
5. Click **Deploy site**. Netlify picks up `netlify.toml` automatically (sets the publish directory and a short cache header for the JSON data files).
6. Every push to the connected branch auto-redeploys.

No environment variables, no server process, and no `server/` folder involved — Netlify is just serving the HTML/CSS/JS/JSON files as-is.

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Homepage | `index.html` | Hero search, browse collections, video lessons, events |
| Educational | `educational.html` | AP/TS Board stages + YouTube video lessons with filters |
| Newspaper | `newspaper.html` | Daily e-papers, language filters, press archive search |
| Novels | `novels.html` | Books list, language filters, Open Library search |
| Events | `events.html` | Workshops, book clubs, notices, community board |

---

## Data Files

Each page fetches its data directly from these static JSON files (relative path, no server):

| File | Fetched by | Returns |
|------|-----------|---------|
| `data/videos.json` | Homepage, Educational, all stage pages | Array of video objects |
| `data/newspapers.json` | Newspaper page | Array of newspaper objects |
| `data/books.json` | Novels page | Array of book objects |
| `data/events.json` | Homepage, Events page | Array of event objects |
| `data/educational.json` | Educational, all stage pages | Object with `boards`, `textbooks`, `competitive` |

Test any file directly in your browser or terminal:
```bash
curl http://localhost:3000/data/videos.json
curl http://localhost:3000/data/events.json
```

---

## Editing Content

### Add a new video lesson
Edit `data/videos.json` and add an entry:
```json
{
  "id": "v9",
  "title": "Class 10 Science — Light",
  "board": "AP Board",
  "class": "Class 10",
  "subject": "Science",
  "chapter": "Chapter 10",
  "youtubeId": "YOUTUBE_VIDEO_ID_HERE",
  "duration": "20 min",
  "language": "Telugu"
}
```
The `youtubeId` is the part after `?v=` in a YouTube URL.

### Add a newspaper
Edit `data/newspapers.json`:
```json
{
  "id": "n9",
  "name": "Prajasakti",
  "language": "Telugu",
  "city": "Hyderabad",
  "since": "1953",
  "type": "Regional daily",
  "epaperUrl": "https://epaper.prajasakti.com",
  "logo": "",
  "pages": 12
}
```

### Add an event
Edit `data/events.json`:
```json
{
  "id": "e6",
  "type": "WORKSHOP",
  "title": "How to use DIKSHA for Class 10 prep",
  "description": "A hands-on session on using the DIKSHA platform.",
  "date": "2026-08-02",
  "displayDate": "2 Aug 2026",
  "time": "11:00 AM IST",
  "mode": "Online",
  "isFree": true,
  "link": ""
}
```

No restart needed for data changes locally — just refresh the page. On Netlify, push the change and it redeploys automatically.

---

## External Platforms Used

| Platform | URL | What we use it for |
|----------|-----|--------------------|
| YouTube | youtube.com | Embedded video lessons (Telugu/English) |
| DIKSHA | diksha.gov.in | Official AP/TS Board textbooks and content |
| Open Library | openlibrary.org | Free novel metadata and reading links |
| Internet Archive | archive.org | Press archives, old newspapers, old books |
| Newspaper e-papers | Various | Direct links to publisher e-paper portals |

---

## Design System

The UI uses a teal-based color palette defined in `css/styles.css` as CSS variables:

| Token | Value | Use |
|-------|-------|-----|
| `--teal-400` | `#38b2ac` | Hover highlights |
| `--teal-600` | `#2c7a7b` | Primary buttons, active nav |
| `--teal-800` | `#1a4f50` | Hero bg, footer, hover |
| `--amber-400` | `#f6ad55` | Search button, CTA accent |
| `--coral-600` | `#e53e3e` | HOT badge |
| `--blue-600` | `#2b6cb0` | FREE badge |

---

## Troubleshooting

**Videos/events/textbooks show "Failed to load..."**
→ Usually means the page was opened via `file://`. Serve it with `python3 -m http.server 3000` (or deploy to Netlify) and reload.

**YouTube videos not loading**
→ Check internet connection. YouTube embeds require internet access.

See [help.html](help.html) for more, once the site is running.