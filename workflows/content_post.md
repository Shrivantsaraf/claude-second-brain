# Workflow: Content Post → HANDS OFF to the Social Media Agent

> ⚠️ The real content engine now lives in the **Social Media Agent** (sibling folder:
> `../Social Media Agent/`), which has dedicated per-platform guideline files
> (`guidelines/twitter.md`, `guidelines/linkedin.md`) and the `make_post.md` workflow.
> This hub workflow is just the **hand-off**: identify the build, then drive the Social Media
> Agent's `make_post` procedure (live-read `../Social Media Agent/` for its current rules and
> follow them). Don't duplicate the drafting logic here — keep the rules in one place to avoid
> drift. The summary below is the quick version for in-hub convenience.

**Objective:** Turn an agent the user built into authentic build-in-public content — a
**Twitter thread (primary)** and a **LinkedIn post (secondary)** — to grow their personal brand
and attract freelance interest.

**Trigger:** "post about today's build", "make content from this", "/post". → Prefer running
the Social Media Agent on the relevant folder; offer this after a build (see agent_build_coach
step 5).

## Voice (locked)
- **Twitter-first, technical/builder audience, thread-friendly.** Casual, authentic,
  beginner-on-a-journey tone — NOT corporate, NOT hype. Real: what was built, why, what broke,
  what was learned. Specific > generic. Show the actual thing (snippet, result, screenshot).
- LinkedIn: same substance, slightly more polished/professional, lighter on jargon.
- Run the **`humanizer` skill** on drafts — no AI tells, no "in today's fast-paced world."

## Required inputs
- Which build. Default to the latest `context/build_log.md` entry; confirm with the user.

## Steps
1. Read the relevant `context/build_log.md` entry (what was built, the learning, the snippet).
   Live-read the project if a concrete detail/screenshot reference helps.
2. Draft a **Twitter thread:** hook tweet (the result or the problem) → 3–6 tweets walking the
   build + the lesson → close with a takeaway and a soft "building one agent a day, follow
   along." Keep each tweet tight; thread should be skimmable.
3. Draft a **LinkedIn variant:** 1 post, same story, a bit more context, 1 clear takeaway.
4. Run `humanizer`. Suggest 1–2 visuals (code shot, before/after, short demo idea).
5. Show both for approval. **Do not post automatically** — the user publishes himself (no
   posting API wired; keeps it zero-cost and in the user's control). Save final text to
   `context/career/` or the build_log entry to copy-paste.

## Expected output
- A ready-to-paste Twitter thread + LinkedIn post in the user's voice, humanized, with visual ideas.

## Notes
- Tie topic choice to [[tool_radar]] when relevant — posting about a hot tool (n8n, Agent SDK)
  draws more eyes and freelance inbound.
- Never fabricate metrics or claims. If the user wants numbers, use real ones from the build.
