# Workflow: On-Screen Help (Computer Use)

**Objective:** Let the assistant look at what's on the user's screen and help with it —
"what am I looking at?", "help me with this", "click through this and tell me what's wrong."

## One-time setup (do this once per machine/project)
1. Confirm prereqs: `claude --version` ≥ 2.1.85 (currently 2.1.167 ✓), plan is Pro/Max
   (`/status`).
2. In an interactive Claude Code session, run `/mcp`, find `computer-use` (shows disabled),
   select it → **Enable**. Persists per project.
3. First use triggers macOS permission prompts — grant both:
   - **Accessibility** (click/type/scroll)
   - **Screen Recording** (see the screen)
   Restart Claude Code after granting Screen Recording if prompted.

## Required inputs
- A clear ask of what to look at / do.
- The app(s) involved (the user will get a per-app approval prompt the first time each is used).

## How it works (set expectations)
- **Turn-based, not ambient.** Computer Use takes a machine-wide lock and **hides other apps**
  while it works, then restores them when done. It is NOT watching passively in the background.
- Only one Claude session can control the machine at a time (lock file).
- Screenshots auto-downscale; no need to change display resolution. If text is too small for
  Claude to read, increase the font in the app, not the screen res.
- Your terminal window is excluded from screenshots (so Claude never reads its own output).

## Control tiers (what Claude is allowed to do per app)
- **Browsers, trading platforms:** view-only (read, no clicks).
- **Terminals, IDEs (VS Code, iTerm, Warp):** click-only — flagged "equivalent to shell access."
- **Finder:** flagged "can read/write any file." **System Settings:** "can change settings."
- **Everything else:** full control.

## Safety (always available)
- **Press `Esc` anywhere to abort** the current action immediately (also `Ctrl+C` in terminal).
  The Esc press is consumed so on-screen content can't dismiss it.
- Per-app approval each session: "Allow for this session" / "Deny."
- Claude flags suspected prompt-injection from on-screen content. Trust boundary is your real
  desktop — review what you approve.

## Expected output
- A screenshot-grounded answer or a completed GUI action, reported back in chat.

## Edge cases / learnings
- "Computer use is in use by another Claude session" → finish/exit that session first.
- `computer-use` missing from `/mcp` → check macOS, version, Pro/Max, and that you're
  authenticated via claude.ai (not Bedrock/Vertex/Foundry only), in an interactive session.
- Permission prompt keeps reappearing → fully quit Claude Code and restart after granting
  Screen Recording; confirm your terminal app is listed in System Settings › Privacy &
  Security › Screen Recording.
