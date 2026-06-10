# raw/ — the wiki's inbox

This is where you drop **messy source material** for the wiki to digest:
video notes, article dumps, pasted threads, half-formed thoughts — anything.

Rules:
- **Immutable** — the assistant never edits files in here. It reads them and distills them
  into clean `wiki/` pages.
- One file per source. Name it something findable.

How to use:
1. Drop a file here (e.g. `some-video-notes.md`).
2. Tell the assistant: **"ingest this"**.
3. It runs `workflows/wiki_ingest.md` → creates/updates linked wiki pages + a summary page in
   `wiki/sources/` + a log entry.
