# Workflow: Summon (global hotkey access)

**Objective:** Reach the assistant from anywhere on the Mac with a single hotkey —
"always available" without a background daemon.

## Chosen approach: Second Brain Electron app (⌥Space)
The summon mechanism is the custom **Second Brain Electron app** (`app/second-brain/`) — see
[[second-brain]]. It registers a global **⌥Space** hotkey (via Electron `globalShortcut` + a tray
icon) that drops a frameless glass window from the top of the screen. Inside the glass runs an
embedded xterm.js + node-pty terminal that boots **Claude Code** pointed at this `Personal
Assistant` folder, so `CLAUDE.md` + `context/` + the wiki all load on start.

### Run it
```bash
cd app/second-brain && npm start
```
The app sits in the tray; ⌥Space toggles the glass panel from anywhere. ⌥Space again (or the red
window button) hides it while keeping the Claude session alive.

### Daily use
- Press **⌥Space** anywhere → the glass panel drops in with your live Claude session.
- Voice: hold **`fn`** ([[wispr-flow]]) to dictate straight into the terminal.
- The window persists the session — hiding doesn't kill Claude, so context carries across summons.

## How this maps to the stack
- **Summon** = ⌥Space → Second Brain app (this file).
- **Brain** = Claude Code embedded in the app (loads memory + workflows on start).
- **Senses** = Computer Use (`workflows/onscreen_help.md`).
- **Hands** = Gmail/Calendar/Drive MCP (`workflows/daily_planning.md`).

## History / superseded approaches (not in use)
- **Ghostty quick-terminal** — earlier interface; replaced by the Electron app (more control over
  the glass UI, embedded terminal, and tray behaviour). Ghostty + its boot/statusline scripts
  were removed 2026-06-08.
- **Raycast + ClaudeCast** — original plan; ClaudeCast couldn't decode the space in the folder
  path. Abandoned in favour of a purpose-built app.

## Notes / learnings
- True wake-word voice ("Hey Claude") is NOT set up — deferred (see `assistant_setup.md` Phase 5).
  The ⌥Space hotkey + Wispr Flow dictation is the summon mechanism for now.
