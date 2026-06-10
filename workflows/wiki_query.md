# Workflow: Wiki Query (answer from the wiki, with citations)

**Objective:** Answer a question using the [[llm-wiki]] as the source of truth, citing which
pages the answer came from — and, when the synthesis is valuable, file it back as a new/updated
page so the brain keeps compounding.

**Trigger:** "what do I know about X?", "what's in my wiki about X?", "according to my notes...",
"ask the wiki".

## Required inputs
- A question or topic.

## Steps
1. **Find relevant pages.** Read [[index]] to locate candidates, then open the matching pages in
   `wiki/entities/`, `wiki/concepts/`, `wiki/sources/`. Follow `[[links]]` one hop out for context.
2. **Answer from the pages.** Synthesize a direct answer grounded in what's written. **Cite the
   pages** used (e.g. "per [[mcp]] and [[claude-code]]…").
3. **Flag gaps honestly.** If the wiki doesn't cover it, say so plainly — don't invent. Offer to
   research it (web/other context) or to ingest a source that would fill the gap.
4. **File valuable syntheses back** (optional but encouraged): if the answer produced a useful new
   connection or fact, write/update the relevant page (house template in [[wiki_ingest]]), update
   [[index]], and append a short [[log]] note. This is how querying makes the wiki smarter.

## Expected output
- A cited answer grounded in wiki pages, an honest note on any gaps, and (when useful) a new/
  updated page so the knowledge persists.

## Notes / edge cases
- Distinguish **what the wiki says** from **what you're inferring** — label inferences.
- If two pages contradict, surface it and suggest running [[wiki_lint]].
- Don't pull in other sibling agents' content — the wiki is the scope (and it's PRIVATE; see
  `## LLM Wiki` in CLAUDE.md).
