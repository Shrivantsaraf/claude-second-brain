# Workflow: Obsidian Setup (free visual viewer for the wiki)

**Objective:** Let the user browse the [[llm-wiki]] as a linked, visual graph in Obsidian — read,
search, and see how ideas connect. Obsidian is just a **viewer** here; the assistant still
edits the files. 100% free, local, no account, no cost.

**Trigger:** "set up Obsidian", "how do I view my wiki?".

## Why Obsidian fits
- An Obsidian **vault is literally just a folder of Markdown files** — exactly what this is.
- It renders `[[wikilinks]]`, YAML frontmatter (as Properties), and a **Graph View** of the whole
  brain. No import/export, no lock-in — it reads the files in place.
- Free for personal use; fully offline.

## Setup (one-time — the user does these GUI steps)
1. **Open the folder as a vault.** Obsidian → **"Open folder as vault"** → select:
   ```
   /path/to/your/claude-second-brain
   ```
   ⭐ **Open the WHOLE `Personal Assistant` folder, not just `wiki/`.** Reason: links like
   [[tool_radar]], [[projects_registry]], and the workflow links ([[wiki_ingest]]) live outside
   `wiki/`. Opening the top folder makes *every* link resolve and the whole second brain show up
   as one graph.
2. **Trust the vault** when prompted (it's your own files).
3. Obsidian creates a hidden `.obsidian/` config folder inside — that's normal. It's already
   **gitignored** (it's per-machine UI state, not knowledge), so it won't clutter version control.
4. **See the graph:** left sidebar → **Graph View** (the connected-dots icon). Each dot is a page;
   lines are `[[links]]`. Click [[index]] to start; it's the catalog/home page.
5. **(Optional) Tidy the view:** Settings → Files & Links → you can set `wiki/` as the default
   location for new notes. Folders starting with `.` (like `.claude`) are hidden automatically.

## Daily use
- **Read/explore** in Obsidian (graph, backlinks panel, search).
- **Add knowledge** by dropping sources in `raw/` and telling the assistant "ingest this"
  ([[wiki_ingest]]) — then refresh Obsidian to see the new pages/links appear.
- You *can* hand-edit pages in Obsidian too; the assistant will pick up your changes next session.

## ⚠️ Common mistake (the user hit this 2026-06-06)
Do **NOT** click "Create new vault" — that makes a fresh *empty* vault (only a `Welcome.md`) and
you won't see your wiki. Use **"Open folder as vault"** and pick the existing `Personal Assistant`
folder. (If you accidentally create an empty vault folder inside this repo, it's harmless
and safe to delete once the user opens PA as the vault.)

## Notes / edge cases
- **Don't install paid Obsidian add-ons / Sync** — the zero-cost rule stands. Core Obsidian is
  all you need; local files are already backed up by git.
- Obsidian and the assistant edit the same files — if you have a page open in Obsidian while the
  assistant edits it, just let Obsidian reload (it does automatically).
- Mobile/Sync not needed; this is a local desktop viewer.
