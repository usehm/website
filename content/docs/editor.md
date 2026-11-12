---
title: Editing
description: Tabs, splits, Tree-sitter highlighting, multiple cursors, folding, Vim keys and more.
section: Editor
order: 1
---

## Tabs, groups and files

- Tabs, split editor groups, back/forward navigation and session restore.
- File explorer with file-type icons, git status colors, drag and drop, filter, and collapse all.
- Quick open (`cmd+p`), go to symbol, go to tab and a command palette (`cmd+shift+p`).
- Auto save on focus change or after a delay.
- Whole-window zoom with `cmd+=`, `cmd+-` and `cmd+0`.

## Syntax highlighting

Hm highlights with Tree-sitter for Go, TypeScript/JavaScript, Python, Rust, Java, C, C++, C#, Zig, Lua, Ruby, PHP, Protobuf, YAML, TOML, JSON, Bash, Make, Dockerfile, CSS, HTML, Markdown, SQL and common config files.

## Editing

- Multiple cursors and column selection: `alt+click` adds a cursor, `alt+shift+drag` selects a column, `cmd+d` adds the next occurrence.
- Find and replace with regex, in the file or in a selection.
- Code folding, soft wrap, indent guides, auto-closing brackets and quotes.
- Auto indent (`none`, `keep` or `advanced`), tabs or spaces, and trimming trailing whitespace on save.
- Markdown preview.
- An optional Vim keymap.

```yaml
editor:
  auto_indent: advanced   # none | keep | advanced
  tab_width: 4
  insert_spaces: true
```

## Themes

Themes include Tokyo Night, and Hm can follow the system's light or dark setting.
