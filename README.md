# eLibAP — Andhra Pradesh & Telangana Digital Library

**AITS Tirupati Community Project**

A free digital library portal for students and communities in Andhra Pradesh and Telangana. Provides access to AP/TS Board educational resources, daily newspapers, novels, and community events — by linking to open external platforms (YouTube, DIKSHA, Open Library, Internet Archive) rather than hosting content directly.

---

## Architecture

```
Browser (HTML + CSS + JS)
        │
        │  fetch("http://localhost:8080/api/...")
        ▼
Core Java HTTP Server  ──────────────────────────────────
  Main.java                 com.sun.net.httpserver.HttpServer
  JsonFileHandler.java      reads JSON files, returns with CORS headers
        │
        │  reads from disk
        ▼
data/  (JSON files — no database)
  videos.json        YouTube video IDs (curated lessons)
  newspapers.json    e-paper links (Eenadu, Sakshi, etc.)
  books.json         Open Library / Archive.org links
  events.json        Upcoming workshops and events
  educational.json   DIKSHA board/stage metadata

External Platforms (content lives here, we just link/embed)
  ├── YouTube                 Video lessons (Telugu/English)
  ├── DIKSHA (diksha.gov.in)  AP/TS Board textbooks — official govt API
  ├── Open Library            Novels and books (openlibrary.org)
  ├── Internet Archive        Press archives, old books (archive.org)
  └── Newspaper e-papers      Eenadu, Sakshi, Deccan Chronicle, etc.
```

### Why this design?
- **No database** — all content metadata lives in JSON files. Easy to edit.
- **No framework** — core Java only. JDK's built-in `HttpServer` handles HTTP.
- **No hosting cost** — content is served by YouTube, DIKSHA, and Archive.org. We only serve JSON.
- **Easy to extend** — add a new resource by editing a JSON file.

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
| Java JDK | 11 or higher | `java -version` |
| Any web browser | Chrome / Firefox / Safari | — |

No Maven, no Gradle, no npm, no frameworks needed.

---

## How to Run

### Step 1 — Start the Java server

Open a terminal and run from the project root:

```bash
bash server/run.sh
```

You should see:
```
=== eLibAP Java Server ===
Compiling...
Starting server on http://localhost:8080
API endpoints:
  http://localhost:8080/api/videos
  http://localhost:8080/api/newspapers
  http://localhost:8080/api/books
  http://localhost:8080/api/events
  http://localhost:8080/api/educational
```

Leave this terminal open. The server runs until you press `Ctrl+C`.

### Step 2 — Open the website

Open `index.html` in your browser. You can do this by:

**Option A — File open (simplest):**
Double-click `index.html` in Finder, or drag it into your browser.

**Option B — Local HTTP server (recommended, avoids CORS on some browsers):**
```bash
# Python 3
python3 -m http.server 3000
# then open http://localhost:3000
```

**Option C — VS Code Live Server:**
Right-click `index.html` → "Open with Live Server"

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

## API Endpoints

All endpoints return JSON with CORS headers (works from any origin).

| Endpoint | Data file | Returns |
|----------|-----------|---------|
| `GET /api/videos` | `data/videos.json` | Array of video objects |
| `GET /api/newspapers` | `data/newspapers.json` | Array of newspaper objects |
| `GET /api/books` | `data/books.json` | Array of book objects |
| `GET /api/events` | `data/events.json` | Array of event objects |
| `GET /api/educational` | `data/educational.json` | Object with boards + competitive |

Test any endpoint in your browser or terminal:
```bash
curl http://localhost:8080/api/videos
curl http://localhost:8080/api/events
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

No server restart needed for data changes — the server reads the file fresh on every request.

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

**Videos/events not loading (shows "Start the Java server")**
→ Run `bash server/run.sh` in a terminal and keep it open.

**`java: command not found`**
→ Install JDK: `brew install openjdk` (Mac) or download from adoptium.net.

**Port 8080 already in use**
→ Change `8080` in `Main.java` line 10, recompile, and update the `API` constant in each HTML file.

**CORS error in browser console when opening HTML directly**
→ Use `python3 -m http.server 3000` to serve the files and open `http://localhost:3000`.

**YouTube videos not loading**
→ Check internet connection. YouTube embeds require internet access.