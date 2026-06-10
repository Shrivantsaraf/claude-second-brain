# Workflow: Wiki Lint (health check the knowledge base)

**Objective:** Keep the [[llm-wiki]] healthy — find contradictions, stale pages, orphans, broken
links, and catalog drift — then propose fixes (don't silently rewrite).

**Trigger:** "lint the wiki", "check the wiki", "is my wiki healthy?", run occasionally after
several ingests.

## Required inputs
- None. Operates over the whole `wiki/` tree.

## Steps
1. **Inventory.** List all pages in `wiki/entities`, `wiki/concepts`, `wiki/sources`. Compare to
   what [[index]] claims exists.
2. **Check for issues:**
   - **Catalog drift** — pages missing from [[index]], or index entries pointing to deleted pages.
     Also verify the Stats counts match reality.
   - **Broken/dangling links** — `[[links]]` whose target page doesn't exist. (Some are
     intentional future pages — list them as "candidates to create," not errors.)
   - **Orphans** — pages nothing links to (dead ends in the graph).
   - **Contradictions** — two pages stating conflicting facts. Quote both.
   - **Stale** — `updated:` far in the past, or content overtaken by newer ingests.
   - **Secrets** — scan for anything that looks like a key/token/password that shouldn't be in
     plain Markdown. Flag loudly.
3. **Report** a short prioritized list (issue → affected page(s) → suggested fix).
4. **Fix only what the user approves** — except trivial safe fixes (index counts, obvious typos
   in links) which you may do and mention. For contradictions/stale content, propose, don't
   overwrite — the user decides what's true.
5. If you fixed anything, append a one-line [[log]] entry noting the lint pass + fixes.

## Expected output
- A health report + any approved fixes applied. The wiki ends consistent: index matches files,
  links resolve (or are listed as intentional stubs), no secrets present.

## Notes / edge cases
- Dangling links are a feature, not always a bug — they mark pages worth writing later. Separate
  "intentional stubs" from "typos / renamed pages."
- Never delete a `sources/` page or anything in `raw/` — those are the audit trail.
