# Claude Second Brain

Press ⌥Space. A glass terminal drops down from the top of your screen, running Claude Code as your personal AI assistant. Press again to dismiss. The session keeps running in the background.

This is the full system: the Electron app plus the "second brain" framework underneath it (tiered memory, a personal knowledge wiki, daily logs, and a workflow architecture called WAT).

I also posted a short video on Twitter if you want to see what it can do: [x.com/Shrivantsaraf](https://x.com/Shrivantsaraf)

---

## What it does

### The glass terminal

⌥Space summons a frameless transparent window from the top of your screen, like Spotlight but it's a real terminal running Claude Code. The session lives in your menu bar (a small ◈ icon) so it doesn't die when you close the window. There's a short particle-cloud animation on summon, then the terminal.

### Voice

Pair it with [Wispr Flow](https://wisprflow.ai). Press `fn`, speak, and your words land directly in the terminal.

### Computer use and browser control

Because it's Claude Code running inside the terminal, you get everything Claude Code supports:

- Computer use: take screenshots, see your screen, click, type, scroll. You can ask "what am I looking at?" or have it operate native macOS apps.
- Browser control via MCP browser tools.
- Gmail and Google Calendar through MCP connectors.
- Any other MCP server you connect.

### The LLM wiki

The memory system is based on Andrej Karpathy's "LLM wiki" idea: a folder of linked Markdown pages that the assistant writes and reads on demand, so you don't have to re-explain your context every session.

Three page types:

- `wiki/entities/` for people, companies, tools, and projects
- `wiki/concepts/` for ideas you're learning
- `wiki/sources/` for summaries of things you've read or watched

Pages link to each other with `[[wikilinks]]`, forming a graph. Open it in Obsidian and you can browse it visually.

Memory is tiered so startup stays fast. A few small "hot" files load every session (identity card, session resume point, today's daily log, wiki index). Everything else is fetched only when the assistant needs it. The startup cost stays flat no matter how big the wiki gets.

To add something, drop a file in `raw/` and say "ingest this." The assistant distills the relevant parts into linked wiki pages. Ask "what do I know about X?" and it answers from what it has accumulated.

### Obsidian

The `wiki/` folder is a valid Obsidian vault out of the box. Open the repo root in Obsidian and you get a graph view of everything the assistant knows. The `.gitignore` excludes Obsidian's per-machine state files so the actual knowledge commits and syncs fine.

### Daily logs and productivity scoring

Every day gets a file with sections for focus, plan, open loops, decisions, done items, and an end-of-day score out of 10. Ask "what's the plan today?" for a morning briefing. Ask "what did I do yesterday?" and it has the answer.

### Session continuity

The assistant writes its current state to `context/SESSION_STATE.md` as you work. The next session, even on a different Claude account, picks up from exactly where it left off.

### The WAT framework

The reliability architecture is three layers: Workflows (Markdown SOPs in `workflows/`), Agent (Claude Code reads and executes them), Tools (Python scripts in `tools/` for deterministic work). The idea is to separate LLM judgment from deterministic execution. Chaining LLM steps loses accuracy fast (five steps at 90% each gets you to about 59%). The workflows and tools handle structure; the LLM handles the judgment calls.

### Guardrails

Two hooks run on every tool call: one blocks the assistant from reading any `.env`, credential, or key file; the other flags commands that look like paid API calls and makes it ask before spending money.

---

## What's in the repo

```
app/second-brain/   # the Electron app (⌥Space, terminal embed, intro animation)
CLAUDE.md           # the assistant's instructions, loaded every session
context/            # identity card, session state, daily log templates
wiki/               # entities / concepts / sources + index (seeded with examples)
workflows/          # SOPs: wiki ingest/query/lint, daily planning, coaching, more
raw/                # drop source material here for the wiki to digest
tools/              # deterministic Python scripts (yours to fill in)
.claude/            # Claude Code permissions + guardrail hooks
```

---

## Prerequisites

- macOS (the global hotkey, tray app, and window styling are macOS-specific)
- Node.js 20+
- Python 3 (for the hooks and any tools you build)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code), installed and authenticated:
  ```bash
  npm install -g @anthropic-ai/claude-code
  claude   # run once to log in
  ```
- [Obsidian](https://obsidian.md) (optional, for browsing the wiki visually)
- [Wispr Flow](https://wisprflow.ai) (optional, for voice)

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/Shrivantsaraf/claude-second-brain.git
cd claude-second-brain/app/second-brain
npm install
```

`node-pty` compiles a native module. If it fails, you probably need the Xcode command-line tools: `xcode-select --install`

### 2. Fill in the templates

The assistant ships with placeholder memory files. Fill these in:

1. `context/about_me.md`: who you are, your goals, how you like to work
2. `wiki/entities/me.md`: same but with more depth (the more honest, the better it works)
3. `CLAUDE.md`: replace the `[YOUR ...]` placeholders at the top

The quickest way to do this: open the repo in Claude Code (`claude` in the root) and say "help me set up my second brain, interview me and fill in the templates." It will walk you through it.

You can also delete the example pages (`wiki/entities/example-company.md`) and update `wiki/index.md` to reflect your actual world.

### 3. Launch

```bash
cd app/second-brain
npm start
```

A ◈ appears in your menu bar. Press ⌥Space and the glass drops down, Claude Code boots inside it, reads your memory files, and greets you. Press ⌥Space again to dismiss; the session stays alive in the background.

If ⌥Space is already taken by something else, the tray icon shows ◈!, so either free the shortcut or change `Alt+Space` in `app/second-brain/main.js`.

macOS will ask for Accessibility permissions the first time. If you plan to use computer use, you'll also need Screen Recording. Both are in System Settings > Privacy & Security.

### 4. Voice (optional)

Install Wispr Flow, set its hotkey to `fn`, summon the glass with ⌥Space, hold `fn`, and speak. The words go straight to the terminal.

### 5. Obsidian (optional)

Open Obsidian, choose "Open folder as vault," and select the repo root. Graph view shows everything the assistant knows, connected. The `.gitignore` already handles Obsidian's local state files.

Full walkthrough in `workflows/obsidian_setup.md`.

---

## Usage

| Say | What happens |
|---|---|
| "What's the plan today?" | Morning briefing from your daily log |
| "ingest this" (after dropping a file in `raw/`) | Distills it into linked wiki pages |
| "What do I know about X?" | Answers from your wiki |
| "What did I do yesterday?" | Reads yesterday's daily log |
| "lint the wiki" | Checks for broken links and orphan pages |
| "What am I looking at?" | Screenshots your screen and explains it (computer use) |

The assistant keeps `SESSION_STATE.md` and the daily file updated as you work, scores your day when you close out, and adds things it learns to the wiki.

---

## Customizing

To add a workflow, drop a Markdown file in `workflows/` with the objective, inputs, steps, and expected outputs. The assistant reads and follows it.

To add a tool, put a Python script in `tools/` and reference it from a workflow.

To connect MCPs (Gmail, Calendar, browser, computer use, or anything else), add the server to Claude Code. The assistant picks it up automatically.

The glass UI is in `app/second-brain/renderer/`. The hotkey is in `app/second-brain/main.js` at `globalShortcut.register('Alt+Space', summon)`.

---

## Credits

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) by Anthropic
- Andrej Karpathy's LLM wiki concept, which is the basis for the memory architecture
- [Obsidian](https://obsidian.md)
- [Electron](https://electronjs.org), [xterm.js](https://xtermjs.org), [node-pty](https://github.com/microsoft/node-pty), [Three.js](https://threejs.org)
- [Wispr Flow](https://wisprflow.ai)

Built by [@Shrivantsaraf](https://x.com/Shrivantsaraf), 18, CS @ UW-Madison.

## License

[MIT](LICENSE)
