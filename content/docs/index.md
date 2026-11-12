---
title: Introduction
description: Hm is a native desktop code editor with a bring-your-own-key AI coding agent built in.
section: Getting started
order: 1
---

Hm is a desktop code editor with an AI coding agent built in. It is written in Go and draws its UI with [Yoga](https://github.com/mirzakhany/yoga), a GPU-rendered (WebGPU) UI toolkit, so it starts quickly, stays light, and runs natively on macOS, Linux and Windows without a browser engine.

Everything is configured in plain YAML, with a settings page on top. The agent is bring-your-own-key: Anthropic, Google Gemini, OpenAI, Azure OpenAI or any OpenAI-compatible endpoint (OpenRouter, Groq, Mistral, xAI, Ollama, LM Studio, ...), and nothing leaves your machine except the calls you configure.

## Why "Hm"?

*Hm* is the sound you make when you are evaluating a solution: the short pause after reading a diff, a stack trace or a suggestion, before you decide whether it is right.

That pause is what Hm is built around. The agent can write code quickly, but the decision about whether it belongs in your codebase stays with you. That is why Hm:

- shows every change in a real editor, with the language server, diagnostics and git diff right next to it;
- has modes that slow the agent down when you want them to: **rubber-duck** plans and pushes back before touching code, and **lazy** changes only what is necessary;
- by default asks before it runs shell commands or deletes files, and always follows your `guard.yaml` rules;
- lets you undo the agent's last turn, or go back to any earlier message and try again, keeping every branch.

Fast where it can be, and quiet when you need to think.

## Where to go next

- [Installation](/docs/install/): build Hm from source and put the `hm` command on your path.
- [Configuration](/docs/configuration/): the YAML files behind the settings page.
- [The agent](/docs/agent/): chat, sessions, modes and what the agent can do.
- [Providers and models](/docs/providers/): connect Anthropic, Gemini, OpenAI, Azure or a local model.
- [Headless CLI](/docs/headless/): run the agent in scripts and CI with `hm agent -p`.

## License

Hm is open source under the [GNU Affero General Public License v3.0](https://github.com/usehm/hm/blob/main/LICENSE). Contributions are welcome under a [Contributor License Agreement](https://github.com/usehm/hm/blob/main/CLA.md); the name and logo are covered by the [trademark policy](https://github.com/usehm/hm/blob/main/TRADEMARKS.md).
