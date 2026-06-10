# Workflow: Wiki Setup (one-time bootstrap)

**Objective:** Stand up the [[llm-wiki]] skeleton and seed it from existing `context/` files.
This is a **one-time** recipe — it already ran on 2026-06-06. Kept for reference / rebuild.

**Trigger:** "set up the wiki" (first time only). If `wiki/` already exists, do NOT re-run —
use [[wiki_ingest]] / [[wiki_query]] / [[wiki_lint]] instead.

## Steps (what was done)
1. **Create structure:**
   ```
   raw/README.md
   wiki/index.md
   wiki/log.md
   wiki/entities/   wiki/concepts/   wiki/sources/(.gitkeep)
   ```
2. **Seed pages** from existing context (`about_me`, `projects_registry`, `tool_radar`):
   - entities: [[your-company]], [[n8n]], [[claude-code]]
   - concepts: [[agentic-ai]], [[llm-wiki]], [[mcp]], [[wat-framework]]
   Each uses the house page template (see [[wiki_ingest]]).
3. **Catalog + log:** fill [[index]] with all seed pages + Stats; add the setup entry to [[log]].
4. **Wire into the system:** add the `## LLM Wiki` section to `CLAUDE.md` (schema, page types,
   `[[link]]` convention, triggers, and the **PRIVACY boundary**). Add `.obsidian/` to `.gitignore`.
5. **Viewer:** point the user to [[obsidian_setup]] to browse the wiki as a graph (optional, free).
6. **Register:** note the wiki in `context/projects_registry.md` + log it in `context/build_log.md`.

## Expected output
- A working, seeded, catalogued wiki wired into CLAUDE.md, ready for the first real ingest.

## Notes / edge cases
- Idempotency: if asked to "set up" again, detect existing `wiki/` and stop — re-seeding would
  duplicate/overwrite. Suggest [[wiki_lint]] instead.
- $0, no secrets, obeys the guardrail hooks.
