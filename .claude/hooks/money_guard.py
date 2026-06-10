#!/usr/bin/env python3
"""PreToolUse hook: stop before anything that could cost money.

Intercepts Bash commands that look like paid API calls or billable actions and
blocks them, forcing Claude to STOP and ask the user for explicit permission first.

Exit code 2 => block + feed reason back to Claude (it will then ask the user).
Exit code 0 => allow.
"""
import json
import re
import sys

# Endpoints / SDKs / actions that can incur cost.
PAID_PATTERNS = [
    r"api\.openai\.com",
    r"generativelanguage\.googleapis\.com",   # Gemini paid
    r"api\.anthropic\.com",                    # raw API = metered (vs. Claude Code on plan)
    r"api\.twilio\.com",
    r"api\.stripe\.com",
    r"\bstripe\b",
    r"\btwilio\b",
    r"\bopenai\b",
    r"replicate\.com",
    r"api\.elevenlabs\.io",
    r"\belevenlabs\b",
    r"huggingface.*inference",
    r"\bGEMINI_API_KEY\b",
    r"\bOPENAI_API_KEY\b",
    r"\b[A-Z_]*PAID[A-Z_]*_API_KEY\b",            # generic paid-API key names
    r"\b(pip|pip3|npm|yarn|brew)\s+(install|i)\b.*\b(openai|twilio|stripe|anthropic|replicate|elevenlabs)\b",
]


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    cmd = (data.get("tool_input") or {}).get("command", "") or ""
    if not cmd:
        sys.exit(0)

    for p in PAID_PATTERNS:
        if re.search(p, cmd, re.IGNORECASE):
            print(
                "BLOCKED: this command may incur a real cost (paid API / billable action: "
                f"matched '{p}'). Per the user's rule, STOP and ask for explicit permission "
                "before running anything that could spend money.",
                file=sys.stderr,
            )
            sys.exit(2)

    sys.exit(0)


if __name__ == "__main__":
    main()
