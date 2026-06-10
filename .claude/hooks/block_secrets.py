#!/usr/bin/env python3
"""PreToolUse hook: block shell-based reads of secret files.

Closes the gap left by permissions.deny (which only covers the Read tool).
Catches Bash commands that try to read .env / credentials / token / key files
via cat, less, head, tail, grep, cp, etc.

Exit code 2 => block the tool call and feed `reason` back to Claude.
Exit code 0 => allow.
"""
import json
import re
import sys

# Files we never want exposed, matched anywhere in the command string.
SECRET_PATTERNS = [
    r"\.env(\.[\w-]+)?\b",      # .env, .env.local, .env.production
    r"credentials\.json",
    r"\btoken\.json",
    r"\b[\w./-]*\.key\b",        # *.key
    r"\bsecrets?\b[\w./-]*",     # secrets, secret_*, secrets.yaml
    r"\bid_rsa\b",
    r"\.pem\b",
]

# Commands that read/exfiltrate file contents.
READERS = r"\b(cat|bat|less|more|head|tail|grep|egrep|rg|awk|sed|cp|scp|rsync|xxd|od|strings|nl|tac|open|code|pbcopy)\b"


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)  # can't parse -> don't block

    cmd = (data.get("tool_input") or {}).get("command", "") or ""
    if not cmd:
        sys.exit(0)

    has_secret = any(re.search(p, cmd, re.IGNORECASE) for p in SECRET_PATTERNS)
    has_reader = re.search(READERS, cmd, re.IGNORECASE)

    if has_secret and has_reader:
        print(
            "BLOCKED: this command appears to read a secrets file "
            "(.env / credentials / token / *.key). Reading secrets is forbidden. "
            "If you genuinely need a config VALUE, ask the user to provide it directly "
            "instead of reading the file.",
            file=sys.stderr,
        )
        sys.exit(2)

    sys.exit(0)


if __name__ == "__main__":
    main()
