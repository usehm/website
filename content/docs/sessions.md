---
title: Sessions and branching
description: Sessions are trees you can edit, branch, fork, replay, undo, export and share.
section: Agent
order: 3
---

## Saved as you go

Sessions are saved after every step, as an append-only JSON Lines file. If hm stops mid-task, the session reopens marked as interrupted, with a **Resume** button. You can replay a session one message at a time, with when each one happened.

## Undo a turn

Undo puts back the agent's last turn: the conversation goes back to before your message, which returns to the message box, and the files the turn changed are restored. The undone turn stays in `/tree`.

## Sessions are trees

Hover a message you sent to **edit and resend** it, which starts a new branch from that point, or to **branch here** and go on from the end of that turn. The old branch stays.

| Command | What it does |
|---|---|
| `/tree` | Shows every branch. Search the text, filter by user, assistant, tools or labels; choose a message to edit it, or any other entry to go on from there. |
| `/fork [id]` | Opens a new session that starts from a point of this one. |
| `/label <text>` | Bookmarks the latest message so `/tree` can find it. |

With `agent.branch_summary` on, a branch you leave gets a few lines on what it did. Files on disk are not changed when you switch branches.

## Export and share

```text
/export [--md|--jsonl] [--all] [path]
/share [--all]
```

`/export` writes the session as one HTML page that opens offline: messages with Markdown and their pictures, folded thinking and tool calls, coloured edit diffs, compactions, labels, and model, tokens and cost per reply with totals at the top, in the theme's light and dark colours. `--all` adds the other branches. `--md` writes Markdown and `--jsonl` the raw session. It goes to `~/Downloads/hm-<title>-<date>.html` unless you give a path.

API keys, tokens and the secrets hm keeps are redacted first, and a notification lists what was taken out.

`/share` asks first, then uploads the page as a secret GitHub gist and puts its link on the clipboard. It uses the token you gave it, or git's saved github.com login.
