# Workflow: Career (stub — leads + brag doc; resume deferred)

**Objective:** Keep career momentum without prematurely touching the resume. Two jobs for now:
(1) track internship/recruiter leads, (2) maintain a "brag doc" of wins as freelance + intern
evidence. A dedicated high-quality **resume agent** will be built LATER as its own project —
do NOT auto-build or edit a resume here.

**Trigger:** "track this lead", "add to my brag doc", "career check-in", "/career".

## Required inputs
- For a lead: the source (recruiter email, posting, contact). For a win: what was accomplished.

## Steps
1. **Leads:** Maintain `context/career/leads.md` — a simple table: company, role, source,
   status, next action, date. Ties into the **Gmail Analyzer** project, which already digests
   CS-career mail (internships/recruiters) → so a lead may come from there. (Don't read that
   project's secrets; read its outputs/code only.)
2. **Brag doc:** Maintain `context/career/brag_doc.md` — running list of concrete wins (agents
   built, what they do, impact, the skill it demonstrates). Pull from `context/build_log.md`.
   This is the raw material the future resume agent + freelance pitches will draw on.
3. **Resume (DEFERRED):** If the user asks to work on the resume, remind the user of the plan: build the
   dedicated resume agent first (separate project, high quality), and that small daily agents
   won't be listed individually — the internship gets ONE strong summary line. Offer to start
   scoping that resume agent via [[agent_build_coach]] when ready.

## Expected output
- Updated `context/career/leads.md` and/or `context/career/brag_doc.md`.

## Notes
- Zero cost; read-only on other projects; never touch secrets (hooks enforce).
- Freelance angle: the brag doc + brand posts ([[content_post]]) are the funnel — keep them in
  sync.
