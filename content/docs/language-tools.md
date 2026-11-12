---
title: Language tools
description: Language servers, diagnostics, formatters, and adding a language in a few lines of YAML.
section: Editor
order: 2
---

## Language servers

Hm speaks the Language Server Protocol: diagnostics, hover, completion, go to definition and implementation, find references, rename, document symbols and formatting. The **Problems** panel lists every diagnostic, and the footer shows the server a file uses.

When a server or formatter is missing, Hm offers to install it with one click (`go install`, `brew`, `npm`, ...).

## Formatters

Formatters are set per language and run on save, on demand or after paste. A formatter either reads the buffer on standard input and writes the result, or rewrites the file in place (`{file}` is its path):

```yaml
languages:
  go:
    formatters:
      - { command: gofmt, args: ["-w", "{file}"], on: [save, manual] }
```

## Adding a language

Adding a language, server or formatter is a few lines of YAML under `languages:`. **View defaults** in Settings shows how the built-in languages are set up, which is the best template for a new one.

## Inline completions

AI completions show ghost text at the caret; `Tab` accepts and `Esc` dismisses. They use a small, fast model of your choice:

```yaml
completion:
  enabled: true
  provider: ""      # a name under agent.providers; empty = agent.default_provider
  model: ""         # a small, fast model; empty = off
  delay: 300ms      # pause in typing before asking
  max_tokens: 256
```
