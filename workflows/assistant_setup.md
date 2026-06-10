# Workflow: Assistant Setup (stand up the "actual AI Assistant")

**Objective:** Turn the documented design into a working, always-available assistant on the Mac:
global hotkey summon + push-to-talk voice + on-screen senses, all booting with this project's
memory. This is a **sequenced execution checklist** — most pieces are already designed in
`workflows/summon.md` and `workflows/onscreen_help.md`; this file is the order + verification gates.

**Approved scope (2026-06-06):** Hotkey + voice + screen.
- **Voice = push-to-talk** via Claude Code's built-in `/voice` (zero-cost, native). NOT wake-word.
- Wake-word ("Hey Claude") is **deferred** (Phase 5) — needs a $0 feasibility check first; STOP
  and ask before doing anything there.

**The stack (mental model):**
`Summon` (⌥Space → Second Brain app) → `Brain` (Claude Code embedded in the glass, loads memory) →
`Voice` (Wispr Flow `fn` dictation) → `Senses` (computer-use sees the screen) → `Hands`
(Gmail/Cal/Drive MCP). Build bottom-up: verify each layer before stacking the next.

**Cost:** $0 throughout. The Electron app, Wispr Flow, and computer-use are all free on Pro/Max.

---

## Phase 0 — Foundation (verify prereqs)
1. `claude --version` → must be ≥ 2.1.85 (confirmed 2.1.167 ✓ as of 2026-06-06).
2. `/status` → confirm **Pro/Max plan** AND authenticated via **claude.ai** (computer-use needs both;
   Bedrock/Vertex/Foundry-only won't expose it).
3. `/hooks` once → load guardrail hooks (money_guard + block_secrets) into the session.
4. **Restart Claude Code** → loads the superpowers + ui-ux-pro-max plugins.
- **Gate:** all four green before Phase 1. (Restart kills the session — the next agent resumes
  from `context/SESSION_STATE.md`, which points back here.)

## Phase 1 — Summon: the global hotkey ✅ DONE (see `workflows/summon.md`)
Built as the **Second Brain Electron app** (`app/second-brain/`) — see [[second-brain]].
1. `cd app/second-brain && npm start` to launch; it lives in the tray.
2. The app registers a global **⌥Space** hotkey that drops a frameless glass window.
3. Inside the glass, an embedded xterm.js + node-pty terminal boots **Claude Code** pointed at
   this `Personal Assistant` folder, so `CLAUDE.md` + `context/` + wiki load on start.
4. **Test:** press ⌥Space anywhere → the glass drops in with the live Claude session. ✓
- **Gate:** ⌥Space opens the assistant WITH this project's context loaded. ✓ MET.
- (Superseded approaches — Ghostty, Raycast+ClaudeCast — see History in `summon.md`.)

## Phase 2 — Voice: dictation ✅ DONE (Wispr Flow)
1. **Wispr Flow** (`fn` hotkey) provides system-wide dictation straight into the glass terminal.
2. Grant **Microphone** permission when macOS prompts.
3. **Test:** hold `fn`, speak a request, confirm it types into the panel. ✓
- **Cost:** $0. Built-in `/voice` was push-to-talk only (no auto-start), so Wispr is the better UX.

## Phase 3 — Senses: see the screen (see `workflows/onscreen_help.md`)
1. `/mcp` → find **computer-use** (ships disabled) → **Enable** (persists per project).
2. First use triggers macOS prompts — grant **Accessibility** + **Screen Recording**; restart if asked.
3. **Test:** "what am I looking at?" on an app.
- **Safety (baked in):** `Esc` aborts instantly · per-app approval each session · browsers view-only ·
  terminals/IDEs click-only · Finder/System Settings flagged · your terminal excluded from screenshots.

## Phase 4 — Wire it together + record
1. End-to-end test: hotkey → voice ask → "look at my screen and help."
2. Mark Phases 0–4 done in `context/SESSION_STATE.md`; log in `context/build_log.md`.
3. Leave a one-line daily-use cheat sheet (which key does what).

## Phase 5 — Deferred (optional, NOT now)
Wake-word "Hey Claude" (always-listening, hands-free). Parked: likely needs paid speech APIs →
run a **$0 feasibility check first** and STOP to ask the user before building anything.

---

## Notes / learnings
- (Append here as phases are executed — e.g. which hotkey stuck, permission gotchas, version quirks.)
- **2026-06-06 — Raycast installed** via `brew install --cask raycast` (v1.104.19, $0). ✓
- **2026-06-06 — ClaudeCast "project path no longer available" GOTCHA (Phase 1).** The folder name
  `Personal Assistant` has a SPACE. Claude Code encodes its project history dir by turning both `/`
  and spaces into `-` (`-Users-…-Projects-Personal-Assistant`). ClaudeCast decodes every `-` back to
  `/`, guessing `…/Projects/Personal/Assistant` — which doesn't exist → the error. **Fix used:**
  symlink `…/Projects/Personal/Assistant` → `…/Projects/Personal Assistant` (chosen over renaming;
  $0, reversible, no restart, same encoded key so memory/history preserved). Created with
  `ln -sfn`. Long-term clean fix would be a space-free folder name (e.g. `PersonalAssistant`).
- **2026-06-06 — ClaudeCast "Usage" $$ scare.** Its Usage view multiplies local token logs by
  pay-as-you-go API rates to show an *equivalent* cost (e.g. "$242 today"). On a subscription plan
  this is NOT a charge — flat monthly fee, usage included. It's a vanity metric; safe to ignore.
