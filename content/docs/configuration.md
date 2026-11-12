---
title: Configuration
description: User and project YAML files, applied live on save, with a settings page on top.
section: Getting started
order: 3
---

Open **Settings** (`cmd+,`) for a form, or **Edit as YAML** for the file behind it. **View defaults** shows the built-in config with comments for every key.

| File | Scope |
|---|---|
| `~/.config/hm/config.yaml` | Your settings, for every folder |
| `.hm/config.yaml` | The project's settings, layered on top of yours |
| `~/.config/hm/guard.yaml`, `.hm/guard.yaml` | What the agent may do; see [Safety](/docs/safety/) |
| `~/.config/hm/models.json`, `.hm/models.json` | Models hm knows about; see [Providers and models](/docs/providers/) |

Changes apply as soon as you save, and errors are shown at their line.

## An example

```yaml
editor:
  theme: tokyo-night
  font_size: 14
  tab_width: 4
  auto_indent: advanced
  zoom: 1

languages:
  yaml:
    editor: { tab_width: 2, insert_spaces: true }
  go:
    formatters:
      - { command: gofmt, args: ["-w", "{file}"], on: [save, manual] }

agent:
  default_provider: anthropic
  providers:
    openrouter: { type: openrouter, api_key: "${OPENROUTER_API_KEY}" }
    ollama: { type: ollama, model: qwen3, context_window: 32768 }
  favorite_models: [anthropic/claude-opus-5-5, openrouter/openai/gpt-5]

keybindings:   # swap Enter and Alt+Enter while the agent works
  - { key: enter, command: agent.followUp, when: "agentFocus && agentRunning" }
  - { command: -agent.followUp }
  - { key: alt+enter, command: agent.steer, when: agentFocus }
```

## Per-language settings

Tab width, indentation, auto indent, soft wrap, format on save and trimming can be set per language, in YAML under `languages:` or from the language picker in Settings.

## Secrets

API keys live in the OS keychain (`api_key: "keychain:gemini"`) or come from environment variables (`api_key: "${OPENROUTER_API_KEY}"`). Settings → Agent → **Add key** stores a key in the keychain for you.

## Keyboard shortcuts

Every key can be changed in **Settings → Keyboard Shortcuts** or under `keybindings:`, with two-chord sequences and VS Code-style `when` conditions. A binding whose command starts with `-` removes a default one. See [Keyboard shortcuts](/docs/shortcuts/) for the defaults.
