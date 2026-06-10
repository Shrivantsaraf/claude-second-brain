# Workflow: Agent Build Coach (the "one agent a day" habit)

**Objective:** Help the user pick, scope, and build today's agent — right-sized for a
beginner — then log it so the streak, brand content, and brag doc all stay fed. This is the
meta-agent that helps build the other agents.

**Trigger:** "let's build today's agent", "what should I build today?", "/build".

## Required inputs
- Optional: an idea the user already has. If none, propose 2–3 (see step 1).

## Steps
1. **Pick (if needed).** Suggest 2–3 build ideas, each scoped to ~1 focused session. Bias
   toward: (a) something that teaches a concept you're learning, (b) reuses a pattern from an
   existing project (read [[projects_registry]] + live-read the relevant sibling folder for
   the real code), (c) is *trending/teachable* for brand content (check [[tool_radar]]).
   State the learning goal for each. Let the user choose.
2. **Scope it small.** Define: objective, inputs, which tools, expected output, 1–2 edge cases.
   Write it WAT-style (this folder's CLAUDE.md). If it's a new project, scaffold a sibling
   folder with `CLAUDE.md`, `workflows/`, `tools/`. Reuse existing tools/patterns before
   writing new code (check the sibling `tools/` first — house rule).
3. **Build it together.** Implement step by step, explaining new concepts simply (the user is a
   beginner). Test as you go. **Respect hard rules:** zero cost, never read secrets, never
   call a paid API without asking (hooks enforce this).
4. **Log it.** Append an entry to `context/build_log.md` (date, what was built, what was
   learned, key snippet/decision, status). Update [[projects_registry]] if it's a new/changed
   project. Note the streak count.
5. **Offer next moves.** Ask if the user wants to (a) turn it into a post now (run
   [[content_post]]), and/or (b) add the win to the brag doc ([[career]]).

## Expected output
- A working (or meaningfully progressed) agent + a build_log entry + updated registry.

## Notes / edge cases
- If an idea would cost money (paid API, hosting), say so up front and offer a free path.
- Keep scope honest — better to finish a small agent daily than stall on a big one. The habit
  is the point.
- If the user is stuck on-screen with something, [[onscreen_help]] (Computer Use) is available.
