# Workflow: Wiki Ingest (raw source → linked wiki pages)

**Objective:** Turn a messy source in `raw/` into clean, atomic, cross-linked wiki pages, then
update the catalog and log. This is how the [[llm-wiki]] grows.

**Trigger:** "ingest this", "ingest <file>", "remember this in the wiki", "add this to the wiki".

## Required inputs
- A file in `raw/` (or text the user just pasted — if pasted and not yet saved, first save it to
  `raw/` with a descriptive kebab-case name + date, e.g. `raw/2026-06-07-nate-herk-mcp-video.md`).
- If ambiguous which source the user means, ask which file.

## Steps
1. **Read the raw source** (read-only — NEVER edit or delete anything in `raw/`).
2. **Read [[index]] first** to see what pages already exist — so you UPDATE existing pages rather
   than create duplicates. Open any pages the source clearly relates to.
3. **Extract**: identify the entities (people/orgs/tools/products), concepts (ideas), and the
   relationships between them. Note concrete facts, the user's own takes, and open questions.
4. **Write/update pages** in `wiki/entities/` and `wiki/concepts/` (one idea per page, house
   template below). Distill — don't paste the raw text. Add `[[links]]` between related pages
   (dangling links to not-yet-written pages are fine). Set `updated:` to today; bump `status:`
   from `seed` → `active` when a page gets real substance.
5. **Write a source summary page** in `wiki/sources/` named after the raw file
   (e.g. `wiki/sources/2026-06-07-nate-herk-mcp-video.md`): 3–6 line summary, the key takeaways,
   a link back to the raw filename, and `[[links]]` to every page this source touched.
6. **Update [[index]]**: add new pages under the right list with a one-line summary; refresh the
   Stats line (counts + last-ingest date). Add the new source under Sources.
7. **Append to [[log]]**: `## [YYYY-MM-DD] ingest | <source title>` + bullets of pages
   created/updated. Never edit past log entries.
8. **Report** to the user: what was created vs updated, and any contradictions found (if a new
   fact conflicts with an existing page, surface it — don't silently overwrite; see [[wiki_lint]]).

## Page template (house style)
```markdown
---
type: entity | concept | source
category: person | org | tool | product   # entities only
status: seed | active | stale
updated: YYYY-MM-DD
tags: [comma, separated]
---

# Title

**One-liner:** <one sentence anyone could understand>

## What it is
<plain-language explanation>

## Why it matters to me
<tie to the user's goals: learn agentic AI → brand → freelance>

## Related
- [[other-page]] · [[another-page]]
```

## Expected output
- 1+ new/updated wiki pages, a new `sources/` page, updated [[index]], a new [[log]] entry, and a
  short report to the user. The raw file is untouched.

## Notes / edge cases
- **Never store secrets in the wiki** — it's plain Markdown. If a raw source contains a key/token,
  do NOT copy it into a page; note "(secret redacted)" and tell the user to rotate it.
- Keep pages short and atomic. If a page grows two distinct ideas, split it and link them.
- This wiki is **PRIVATE** to the Personal Assistant — never auto-copy its pages into other
  sibling agents (see `## LLM Wiki` in CLAUDE.md).
