---
type: concept
status: seed
updated: 2026-06-06
tags: [mcp, model-context-protocol, tools, integrations]
---

# MCP (Model Context Protocol)

**One-liner:** The open standard for how an AI agent reaches real-world services — the "USB port"
that lets [[claude-code]] use Gmail, Calendar, Drive, and tools like [[n8n]].

## What it is
A protocol where external capabilities run as **MCP servers** that expose tools/resources, and
the agent (the client) calls them. It standardizes integrations so any compliant tool plugs into
any compliant agent — instead of bespoke glue for each one.

## Why it matters to me
It's how my agents actually *do things* in the world:
- Gmail / Calendar / Drive MCP → the "hands" of the assistant (see daily planning, Gmail Analyzer).
- **n8n-MCP** → lets [[claude-code]] build [[n8n]] workflows for me.
- More MCP = more real capability. Lean into it (per [[tool_radar]]).

## Watch-outs
- Some MCP servers are paid or need keys — respect the zero-cost + no-secrets rules; ask first.
- The exposed mcpmarket token (`sk_user_...`) still needs rotating (open security loop).

## Related
- [[claude-code]] · [[agentic-ai]] · [[n8n]]
