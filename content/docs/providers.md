---
title: Providers and models
description: Bring your own key for Anthropic, Gemini, OpenAI, Azure OpenAI or any OpenAI-compatible endpoint.
section: Agent
order: 2
---

Hm talks to model providers directly with your own key. Nothing leaves your machine except the calls you configure.

## Supported providers

| Type | Notes |
|---|---|
| `anthropic` | Claude models, with an API key |
| `google` | Gemini, with an API key or on Vertex AI with your gcloud sign-in. Thinking streams, and thought signatures go back with the history as the API requires. |
| `openai` | OpenAI, or any OpenAI-compatible `base_url` |
| `azure` | Azure OpenAI: a deployment with `api_version`, or the v1 API |
| `openrouter`, `groq`, `cerebras`, `mistral`, `xai`, `deepseek`, `together`, `fireworks`, `huggingface`, `ollama`, `lmstudio` | Presets: the `base_url` is filled in, so Settings → Agent → **Add a provider** only asks for a key |

```yaml
agent:
  default_provider: anthropic
  providers:
    openrouter: { type: openrouter, api_key: "${OPENROUTER_API_KEY}" }
    ollama: { type: ollama, model: qwen3, context_window: 32768 }
    gemini: { type: google, api_key: "keychain:gemini", model: gemini-2.5-pro }
    vertex: { type: google, project: "${GOOGLE_CLOUD_PROJECT}", location: us-central1, model: gemini-2.5-pro }
    azure: { type: azure, base_url: "https://my-resource.openai.azure.com", api_key: "keychain:azure", api_version: "2024-10-21", model: my-gpt-5 }
    work: { type: openai, base_url: "https://llm.example.com/v1", api_key: "keychain:work" }
```

For Vertex AI, sign in once with `gcloud auth application-default login`. For Azure, `model` is the deployment's name.

## Switching models

- `ctrl+l`, or the composer's model menu → **All models…**, searches every provider's models.
- `/model <name>` picks one by `provider/model`, model id or part of one.
- `ctrl+p` steps through `agent.favorite_models`.

The history goes along when you switch; thinking written by another provider is left out. A reopened session goes on with the model and thinking it last ran.

## Thinking

`/think off|low|medium|high|xhigh|max` sets how hard the model thinks for the session, and `/think default` goes back to the provider's. On OpenAI and Azure it sets `reasoning_effort` on the reasoning models (o-series, gpt-5).

## The model registry

`models.json`, beside `config.yaml` in `~/.config/hm` or `.hm`, adds models or changes what hm knows of them: context window, max output, prices, what they support and their effort levels. The workspace's file wins. The context meter, compaction and the cost of each reply use it, and changes apply as soon as you save.

```json
[
  { "id": "qwen3", "provider": "ollama", "name": "Qwen 3", "context_window": 32768, "max_output": 8192,
    "supports": { "tools": true, "images": false, "thinking": true } },
  { "id": "claude-opus-5-5", "price": { "input": 4, "output": 20, "cache_read": 0.2, "cache_write": 5 },
    "efforts": ["low", "medium", "high", "xhigh", "max"] }
]
```

Every field but `id` is optional; one you leave out comes from hm's own table or a shorter id that matches (`claude-opus-5` covers `claude-opus-5-20261101`). `provider` limits an entry to one name under `agent.providers`. Prices are USD per million tokens and fill in the cost when the API does not report one.

## Subscriptions

Hm uses API keys and cloud credentials, not consumer subscriptions: most providers' terms don't allow a third-party tool to use a subscription. The [notes in the repository](https://github.com/mirzakhany/hm/blob/main/docs/subscription-sign-in.md) list what each provider allows.
