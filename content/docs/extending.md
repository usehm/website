---
title: Instructions, prompts and skills
description: AGENTS.md, SYSTEM.md, prompt templates, skills, MCP servers and your own command tools.
section: Agent
order: 5
---

## Instruction files

Hm reads the instruction files other agents use: `AGENTS.md`, or `CLAUDE.md` when there is none, from `~/.config/hm` and from each folder between your home folder and the workspace, outer folders first.

A `SYSTEM.md` (`.hm/SYSTEM.md`, else `~/.config/hm/SYSTEM.md`) replaces the base prompt, or adds to it when its first line is `<!-- append -->`.

The book icon in the session header and `/context` list the files a session uses. A session reads them once when it starts, so its prompt stays cached.

```yaml
agent:
  context:
    enabled: true
    files: [AGENTS.md, CLAUDE.md]   # first one found per folder wins
    max_bytes: 65536                # larger files are skipped with a warning
```

## Prompt templates

Each `.md` file in `~/.config/hm/prompts`, `.hm/prompts`, `.claude/commands` or `.pi/prompts` is a `/name` command in the message box, listed in its completions with its description. Claude Code commands work as they are.

```markdown
---
description: Review the staged change
argument-hint: "[focus]"
mode: rubber-duck
---
Review the staged diff. Focus on $ARGUMENTS.

@CONTRIBUTING.md
```

- `$ARGUMENTS` is what you type after the command; `$1`, `$2` … its words (quotes group them).
- A line `@path` inlines a workspace file (`guard.yaml` rules apply).
- Front matter can set `description`, `argument-hint`, `mode` and `model`.
- Built-in commands win over a template of the same name.

## Skills

Skills are read from `~/.config/hm/skills`, `.hm/skills`, `.cursor/skills` and `.claude/skills`.

## MCP servers

```yaml
tools:
  mcp:
    github:
      transport: stdio            # stdio | http
      command: github-mcp-server
      args: [stdio]
      env: { GITHUB_TOKEN: "${GITHUB_TOKEN}" }
      approval: ask               # auto | ask | deny, for all its tools
    docs:
      transport: http
      url: https://mcp.example.com/mcp
      headers: { Authorization: "Bearer ${DOCS_TOKEN}" }
```

## Command tools

Turn any command-line program into a tool. Parameters are passed as separate arguments, never through a shell, so a value can't inject another command.

```yaml
tools:
  commands:
    run_migrations:
      description: Apply database migrations up to a version
      command: ./scripts/migrate up {version}
      timeout: 2m
      approval: ask
      params:
        version: { type: string, description: Target version, required: true }
```

## Web search

```yaml
tools:
  web:
    search: { provider: duckduckgo }   # duckduckgo | searxng | brave | tavily | exa
```
