# Workflow: Daily Planning ("plan my day")

**Objective:** Produce a prioritized plan for the day by combining who the user is (goals),
what's scheduled (calendar), and what needs attention (email) — then write it into today's
daily file.

## Required inputs
- None from the user beyond the trigger ("plan my day"). Optionally a focus override.

## Tools used (MCP — already connected, no build needed)
- **Google Calendar:** `list_events` (today's events), `suggest_time` (open blocks).
- **Gmail:** `search_threads` (unread / important since yesterday), `get_thread` for detail.
- Local memory: `context/about_me.md` (goals, preferences), today's `context/daily/*.md`.

## Steps
1. Read `context/about_me.md` → active focus + long-term goals + hard rules.
2. Ensure today's daily file exists (`context/daily/YYYY-MM-DD.md`); create from
   `_TEMPLATE.md` if missing. Carry over unfinished **Open loops** from yesterday's file.
3. Calendar: `list_events` for today → list meetings with times; note free blocks.
4. Gmail: `search_threads` for `is:unread` and `is:important newer_than:1d` → summarize what
   actually needs a reply or action (don't list everything).
5. Synthesize: map free blocks to the highest-leverage work against active goals. Flag
   conflicts (e.g. a goal with no time allocated today).
6. Write the result into today's daily file under **## Plan** and set **## Focus today**
   (top 1–3). Keep it short and prioritized, not a data dump.

## Expected output
- Updated `context/daily/YYYY-MM-DD.md` with Focus + Plan filled.
- A concise spoken-style summary in chat: "Top 3 today: … / 2 emails need replies / 1 goal
  has no time blocked."

## Rules / edge cases
- **Never send email or modify calendar events** as part of planning — read-only here. Any
  send/edit follows the hard rule in `about_me.md` (confirm first) and is a separate ask.
- If MCP auth fails on first call, prompt the user to re-authenticate (Gmail/Calendar/Drive).
- If `about_me.md` still has `<!-- FILL -->` placeholders for goals, say so and plan from
  calendar+email only, noting the plan will sharpen once goals are filled in.
