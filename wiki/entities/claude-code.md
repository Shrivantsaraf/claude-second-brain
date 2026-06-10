---
type: entity
category: tool
status: seed
updated: 2026-06-06
tags: [claude-code, anthropic, agent-builder, primary-tool]
---

# Claude Code

**One-liner:** Anthropic's agentic coding tool — your **primary** tool: the brain that
runs this whole second brain and builds all all other agents.

## What it is
An interactive AI agent (CLI + desktop + IDE) that reads/writes files, runs tools, calls [[mcp]]
servers, and follows project instructions (`CLAUDE.md`). It's where you works every day.

## Why it matters to me
It IS the assistant. It loads my `context/` + workflows on start, enforces my guardrail hooks
(zero-cost + no-secrets), and is how I build one agent a day. On the Pro/Team plan (flat fee), so
using it doesn't break the zero-cost rule.

## Key features I rely on
- **Hooks** — shell scripts that gate tool calls (my `block_secrets` + `money_guard`). See [[hooks]].
- **MCP** — connects to Gmail / Calendar / Drive. See [[mcp]].
- **Skills & subagents** — e.g. the `humanizer` skill; Explore/Plan subagents.
- **Plugins** — superpowers, ui-ux-pro-max (installed).

## Related
- [[mcp]] · [[agentic-ai]] · [[wat-framework]] · [[n8n]] (via n8n-MCP)
