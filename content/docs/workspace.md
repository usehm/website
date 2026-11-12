---
title: Search, Git and terminal
description: Project-wide search with ripgrep, a git panel with branches and merges, and an integrated terminal.
section: Editor
order: 3
---

## Project search

`cmd+shift+f` searches the project with ripgrep, or a built-in engine when ripgrep is not installed. It takes regular expressions and can replace one match or all of them. Results are on the left and an editable preview on the right.

## Git

The git panel opens from the footer:

- stage, commit and discard;
- create and switch branches; fetch, pull and push;
- merge branches: files with conflicts are marked until every one is resolved;
- remotes over HTTPS, with tokens kept in the OS keychain.

The file explorer colors files by their git status, and the footer shows the branch and how many files changed.

## Terminal

An integrated terminal with multiple sessions opens from the footer, or with `` ctrl+` ``.
