---
type: concept
status: seed
updated: 2026-06-06
tags: [wat, workflows, agents, tools, house-style, architecture]
---

# WAT Framework (Workflows / Agents / Tools)

**One-liner:** your house architecture for building reliable agents — separate the
**instructions**, the **decision-maker**, and the **execution** into three clean layers.

## The three layers
1. **Workflows** — Markdown SOPs in `workflows/`. Plain-language instructions: objective, inputs,
   which tools to use, expected output, edge cases. (Like briefing a teammate.)
2. **Agents** — the assistant's job ([[claude-code]]). Reads the workflow, runs tools in order,
   handles failures, asks when unsure. Orchestration, not doing-everything-itself.
3. **Tools** — Python scripts in `tools/` that do deterministic work (API calls, transforms,
   file ops). Consistent, testable, fast.

## Why it works
Pure-LLM pipelines lose accuracy fast (90%^5 ≈ 59%). Offloading deterministic steps to tools
keeps the agent focused on judgment, where it's strong. This is the practical answer to the
compounding-error problem in [[agentic-ai]].

## The self-improvement loop
When something breaks: identify → fix the tool → verify → **update the workflow** so it never
breaks the same way → move on with a more robust system.

## Where it lives
Every project in [[projects_registry]] is WAT-structured — including this hub and the [[llm-wiki]]
recipes ([[wiki_ingest]], [[wiki_query]], [[wiki_lint]], [[wiki_setup]]).

## Related
- [[agentic-ai]] · [[claude-code]] · [[llm-wiki]]
