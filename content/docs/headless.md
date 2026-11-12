---
title: Headless CLI
description: Run the agent with no window from scripts, git hooks and CI with hm agent -p.
section: Automation
order: 1
---

`hm agent -p "prompt"` runs the agent in the current folder, with no window or display, and prints its final answer. It uses the same config, `guard.yaml`, skills, MCP servers, instruction files and saved sessions as the app.

```sh
hm agent -p "list the packages"
git diff | hm agent -p "review this"         # piped input is added to the prompt
echo 'list the packages' | hm agent -p       # ...or is the prompt
```

## Flags

Flags go before or after the prompt.

| Flag | Meaning |
|---|---|
| `--mode`, `--provider`, `--model` | Pick what runs |
| `--cwd DIR` | The workspace |
| `--session ID`, `--continue` | Resume a saved session (`--continue`: the newest of the folder) |
| `--no-session` | Save nothing |
| `--max-steps N` | Bound the model calls of a turn (default 80) |
| `--approve never\|edits\|all` | Decide the calls the mode would ask about, since nobody is there to ask |
| `-v` | Show tool calls and retries on standard error |
| `--output json` | Write every event as a JSON line instead; see [JSON events](/docs/events/) |

With `--approve never` (the default), calls that need approval are refused and the model is told how to rerun; `edits` allows file edits only; `all` allows them all. `guard.yaml` deny rules always apply.

Warnings always go to standard error; standard output gets only the answer.

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Done |
| `1` | The agent failed: a model call, a missing key, out of steps |
| `2` | Bad usage |
| `3` | A call was refused for want of approval (the answer is still printed) |
| `130` | Interrupted |

## In CI

```sh
# Fail the job if the review finds a blocking issue.
git diff origin/main... \
  | hm agent -p --mode rubber-duck --no-session \
      "Review this change. End with BLOCK or OK on its own line." \
  | tee review.txt
tail -n1 review.txt | grep -qx OK
```

To drive a session from another program, with steering, approvals and questions, use the [RPC protocol](/docs/rpc/).
