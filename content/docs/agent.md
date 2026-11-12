---
title: The agent
description: Chat beside the editor or full screen, sessions in tabs, steering, images and the context meter.
section: Agent
order: 1
---

The agent works in the folder you have open. Chat with it beside the editor or full screen (`cmd+l` toggles it), or select some code and press `cmd+alt+l` to ask about the selection.

## Sessions in tabs

Several sessions can work at once. `cmd+t` opens one, `ctrl+tab` / `ctrl+shift+tab` switch between them, and a spinner or a dot marks a tab that is working, waiting for you or was interrupted.

Full screen, a sidebar replaces the explorer: **New chat**, **Projects**, **Artifacts**, a filterable history of every session (across all your folders, with sub-agents and forks nested under the session they came from) and **Agent Settings**.

## Steer while it works

You can type while the agent works:

- `Enter` **steers**: the running tool call finishes, the rest of the batch is skipped and the model reads your message.
- `Alt+Enter` sends a **follow-up** that waits for the turn to end.

Queued messages show above the message box with their kind, and can be edited or removed before they are sent.

## Images

Paste a screenshot into the message box (`cmd+v`), drop picture files on the window, or mention one as `@shot.png`. They wait in the box as thumbnails and show in the chat once sent. `read` on a PNG, JPEG, GIF or WebP file gives the model the picture. Pictures over 1568 pixels on the long side or 5 MB are scaled down first; a model without vision gets a placeholder instead, and you are told once.

## Projects

A project has a title, description and context that the agent is given before every task in the project's sessions. Pick one in the composer.

## Context and compaction

A meter in the composer shows how much of the model's window the conversation fills ("42k / 200k"), in the warning colour from 80%.

When the conversation nears 85% of the window, or the API says the prompt is too long, older messages are summarised (goal, decisions, files touched, open tasks, unsolved errors, next step) and the model sees the summary plus the latest messages. `/compact [focus]` does it by hand, keeping what you name. A divider in the chat ("Compacted 148k → 12k tokens") opens to show the summary; the saved session keeps every message.

```yaml
agent:
  compaction:
    enabled: true          # by itself; /compact works either way
    threshold: 0.85        # fraction of the window that starts it
    reserve_tokens: 16384  # room kept for the answer
    keep_tokens: 20000     # latest history kept as it is
    model: ""              # e.g. a smaller, cheaper model; "" = the provider's
```

## Retries

Rate limits, an overloaded API and dropped connections don't end the turn: the call is retried with growing waits (or as long as the API asks), and the chat says so ("Rate limited, retrying in 8s (2/5)"). `Esc` stops the wait. A call is never retried once its answer has started to stream.

## Sub-agents

The `task` tool hands work to an agent in a session of its own, in the foreground or the background, read-only unless allowed to write. Several run at once. Agents message each other with `send_message`, `wait_message` and `list_agents`; a background task's report arrives as a follow-up.

```yaml
agent:
  subagents: { max_depth: 1, max_concurrent: 4 }   # max_depth: 0 turns the task tool off
```

## Tools

Read, write, edit and multi-edit files, grep, list, run shell commands, LSP diagnostics and rename, format, project search, todos, web search and fetch, and asking you questions. Add your own with [MCP servers, command tools and skills](/docs/extending/).
