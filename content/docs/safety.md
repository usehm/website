---
title: Modes and safety
description: Agent modes, per-tool approval and guard.yaml rules that keep the decision with you.
section: Agent
order: 4
---

## Modes

Switch with `/mode`, or set `agent.default_mode`:

| Mode | Behaviour |
|---|---|
| **lazy** | Changes only what is necessary. Edits run on their own; shell commands ask. |
| **rubber-duck** | Plans and pushes back before touching code. Read-only tools: read, grep, LSP, git status/log/diff, web. |
| **auto** | Does what is best, with every tool. Asks before shell commands, deletes and `git push`. |
| **fullstack** | Builds apps from the ground up, with a full-stack skill. |

A mode is a prompt, a list of tools and an approval policy, so you can write your own:

```yaml
modes:
  review:
    prompt: "Review the change for bugs. Don't edit files."
    tools: [read, grep, glob, ls, lsp_*, git_diff]
  auto:
    prompt: builtin:auto
    tools: all
    approval: { shell: ask, delete: ask, git_push: ask }
```

## guard.yaml

`guard.yaml` rules are checked before any approval is asked for. A **deny** rule blocks a call outright, whatever the mode or your earlier answers; an **ask** rule makes you approve it every time; an **allow** rule lets a command run without asking.

Rules come from `~/.config/hm/guard.yaml` and the project's `.hm/guard.yaml`. A project can only tighten them: its deny and ask rules count, its allow rules and allowed hosts do not, since a cloned repository should not be able to loosen what the agent may do.

```yaml
paths:
  # No reading or writing. A name without a slash matches at any depth;
  # ** is any number of folders; ~ is your home folder.
  deny: [".env", "*.pem", "~/.ssh", "~/.aws"]
  # Read, but never change or delete.
  read_only: []

commands:
  # Matched against the whole command line and every command in it
  # (split at &&, ||, ;, | and in $(...)). * is any text;
  # start a pattern with re: for a regular expression.
  deny: ["rm -rf /*", "sudo *", "re:curl .*\\| *(ba)?sh"]
  ask: ["git push*", "git reset --hard*"]
  allow: []

network:
  # When set, the only hosts web fetches may reach.
  allow_hosts: []
  deny_hosts: []

tools:
  # Tool names; * is any text (mcp_*_delete_*).
  deny: []
  ask: []
```

Changes apply to the next message. A broken `guard.yaml` is an error: the agent does not run unguarded.

## Undo

Whatever the mode, you can undo the agent's last turn and its file changes, or branch from any earlier message. See [Sessions and branching](/docs/sessions/).
