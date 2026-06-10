---
type: concept
status: seed
updated: 2026-06-06
tags: [llm-wiki, second-brain, knowledge-management, meta]
---

# LLM Wiki

**One-liner:** The knowledge-base pattern this whole `wiki/` folder *is* — a personal,
linked encyclopedia (Karpathy-style) that an LLM builds and reads to stay smart about your world.

## What it is
A structured second brain made of small, atomic Markdown pages:
- **entities** (people/orgs/tools/products) + **concepts** (ideas) + **sources** (digested raw items),
- connected by `[[wikilinks]]`, cataloged in [[index]], with an append-only [[log]],
- fed by an immutable `raw/` dropbox via the [[wiki_ingest]] recipe.

The point: instead of re-explaining context every session, the assistant *reads its own wiki* and
gets sharper over time. Notes stop being one-off; they accumulate and interlink.

## The pattern's rules (house style)
- One idea per page; link liberally (dangling links = future pages, that's fine).
- Distill, don't dump — pages are clean syntheses, `raw/` holds the mess.
- **PRIVATE to the Personal Assistant.** It helps build other agents but is never auto-poured
  into them. (See the `## LLM Wiki` section of `CLAUDE.md`.)

## Recipes
- [[wiki_ingest]] (raw → pages) · [[wiki_query]] (answer from pages) · [[wiki_lint]] (health
  check) · [[wiki_setup]] (one-time skeleton).

## Related
- [[agentic-ai]] · [[claude-code]] · [[wat-framework]]
