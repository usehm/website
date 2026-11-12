// The landing page. `hl(code, lang)` returns highlighted HTML.
import { head, nav, footer, searchDialog, scripts, icon, site } from './layout.mjs';

const providers = [
  'Anthropic', 'Google Gemini', 'Vertex AI', 'OpenAI', 'Azure OpenAI', 'OpenRouter', 'Groq', 'Cerebras',
  'Mistral', 'xAI', 'DeepSeek', 'Together', 'Fireworks', 'Hugging Face', 'Ollama', 'LM Studio',
];

const languages = ['Go', 'TypeScript', 'Python', 'Rust', 'Java', 'C', 'C++', 'C#', 'Zig', 'Lua', 'Ruby', 'PHP', 'SQL', 'YAML', 'Markdown', '+8 more'];

const configYaml = `agent:
  default_provider: anthropic
  default_mode: rubber-duck
  providers:
    anthropic: { type: anthropic, api_key: "keychain:anthropic" }
    openrouter: { type: openrouter, api_key: "\${OPENROUTER_API_KEY}" }
    local: { type: ollama, model: qwen3, context_window: 32768 }
  favorite_models: [anthropic/claude-opus-5-5, local/qwen3]
  compaction: { enabled: true, threshold: 0.85 }
  subagents: { max_depth: 1, max_concurrent: 4 }`;

const guardYaml = `paths:
  deny: [".env", "*.pem", "~/.ssh", "~/.aws"]
  read_only: ["migrations/**"]

commands:
  deny: ["rm -rf /*", "sudo *", "re:curl .*\\\\| *(ba)?sh"]
  ask: ["git push*", "git reset --hard*"]

network:
  allow_hosts: ["pkg.go.dev", "github.com"]`;

const cliSh = `# Review a diff in CI, no window needed
git diff origin/main... | hm agent -p "review this"

# Resume the newest session and let it edit files
hm agent --continue --approve edits -p "now fix the tests"

# Every event as JSON lines, for scripts and jq
hm agent -p --output json "list the packages" \\
  | jq -c 'select(.type == "tool_call")'`;

const rpcJson = `{"id":"1","type":"prompt","text":"fix the failing test"}
{"id":"2","type":"steer","text":"only touch the parser"}
{"id":"3","type":"approve","call_id":"toolu_01","allow":true}
{"id":"4","type":"set_model","provider":"anthropic","model":"claude-opus-5-5"}
{"id":"5","type":"export","format":"html"}`;

const goCode = `r, err := agent.New(agent.Options{Root: ".", Approver: myApprover{}})
if err != nil {
	return err
}
defer r.Close()

go func() {
	for e := range r.Events() {
		log.Println(e.Kind)
	}
}()

err = r.Prompt(ctx, "what is wrong here?", agent.Image{Data: png})
fmt.Println(r.Answer())`;

// Terminal demo scripts: [delay before the line, html].
const termScripts = {
  review: {
    title: 'hm agent -p — review a change',
    cmd: 'git diff main | hm agent -p <span class="w">"review this"</span> -v',
    out: [
      [500, '<span class="d">› read</span> internal/search/engine.go'],
      [350, '<span class="d">› grep</span> <span class="v">"func (e \\*Engine) Replace"</span> internal/'],
      [350, '<span class="d">› lsp_diagnostics</span> internal/search <span class="ok">0 problems</span>'],
      [650, ''],
      [120, '<span class="c">Two things before this merges:</span>'],
      [220, ''],
      [120, '<span class="c">1. ReplaceAll keeps the old offsets after the first edit,</span>'],
      [120, '<span class="c">   so a second match on the same line lands in the wrong place.</span>'],
      [120, '<span class="c">   Apply the edits from the end of the file backwards.</span>'],
      [220, '<span class="c">2. The new regex is compiled on every call; hoist it.</span>'],
      [400, ''],
      [120, '<span class="d">12.4k in · 610 out · $0.04</span>'],
    ],
  },
  ci: {
    title: 'hm agent -p — in CI',
    cmd: 'hm agent -p --approve edits --max-steps 40 <span class="w">"make go vet pass"</span> -v',
    out: [
      [500, '<span class="d">› shell</span> go vet ./... <span class="w">exit 1</span>'],
      [400, '<span class="d">› read</span> internal/config/load.go'],
      [400, '<span class="d">› edit</span> internal/config/load.go <span class="ok">+3 −2</span>'],
      [450, '<span class="d">› shell</span> <span class="w">refused:</span> needs approval <span class="d">(--approve edits allows file edits only)</span>'],
      [500, ''],
      [120, '<span class="c">Fixed the vet error: Sprintf was given a %d for a string.</span>'],
      [120, '<span class="c">I could not rerun go vet without approval; rerun with --approve all.</span>'],
      [400, ''],
      [120, '<span class="d">exit 3 · a call was refused for want of approval</span>'],
    ],
  },
  json: {
    title: 'hm agent --output json',
    cmd: 'hm agent -p --output json <span class="w">"run the tests"</span> | jq -c .type',
    out: [
      [400, '<span class="ok">"session_start"</span>'],
      [160, '<span class="ok">"message_end"</span>'],
      [160, '<span class="ok">"message_start"</span>'],
      [220, '<span class="ok">"tool_start"</span>'],
      [160, '<span class="ok">"usage"</span>'],
      [160, '<span class="ok">"message_end"</span>'],
      [220, '<span class="ok">"tool_call"</span>'],
      [450, '<span class="ok">"tool_result"</span>'],
      [160, '<span class="ok">"message_end"</span>'],
      [160, '<span class="ok">"message_start"</span>'],
      [220, '<span class="ok">"text_delta"</span>'],
      [160, '<span class="ok">"usage"</span>'],
      [160, '<span class="ok">"message_end"</span>'],
      [160, '<span class="ok">"turn_end"</span>'],
      [160, '<span class="ok">"session_end"</span>'],
    ],
  },
};

export function home({ hl, hasVideo }) {
  const marquee = [...providers, ...providers].map((p) => `<span>${p}</span>`).join('');
  return `${head({ path: '/' })}
<body>
${nav()}
<main>

<section class="hero">
  <div class="container">
    <div class="hero-copy">
      <a class="eyebrow" href="/docs/headless/"><span class="pill">New</span>Headless mode, RPC and a Go package for the agent ${icon('arrow', 'width="14" height="14"')}</a>
      <h1>The editor for when<br>you pause to <span class="serif">think.</span></h1>
      <p class="lede">Hm is a native code editor with an AI coding agent built in. The agent writes fast; the decision about what lands in your codebase stays with you.</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="/docs/install/">${icon('download')}Get Hm</a>
        <a class="btn btn-ghost" href="${site.repo}" rel="noopener">${icon('github')}View on GitHub</a>
      </div>
      <div class="hero-meta">
        <span>${icon('check')}macOS, Linux &amp; Windows</span>
        <span>${icon('check')}No browser engine</span>
        <span>${icon('check')}Bring your own key</span>
        <span>${icon('check')}Plain YAML config</span>
      </div>
    </div>
    <div class="hero-shot">
      <div class="window"><img src="/img/editor.png" alt="Hm editing a Go file, with the file explorer, breadcrumbs, gopls status and git branch in the footer" width="2560" height="1640" fetchpriority="high"></div>
    </div>
  </div>
</section>

<section class="providers" aria-label="Supported providers">
  <div class="container">
    <p>Talks directly to the models you already pay for</p>
    <div class="marquee"><div class="marquee-track">${marquee}</div></div>
  </div>
</section>

<section class="section" id="why">
  <div class="container">
    <div class="section-head reveal">
      <span class="kicker">Why “Hm”</span>
      <h2>Built around the <span class="serif">pause</span> before you merge.</h2>
      <p><em>Hm</em> is the sound you make when you read a diff, a stack trace or a suggestion, and decide whether it is right. Everything in Hm is built to make that moment count.</p>
    </div>
    <div class="pillars reveal">
      <div class="pillar"><span class="num">01</span><h3>A real editor, right there</h3><p>Every change lands in a full editor with the language server, diagnostics and git diff beside it, not a chat bubble.</p></div>
      <div class="pillar"><span class="num">02</span><h3>Modes that slow down</h3><p><strong>rubber-duck</strong> plans and pushes back before touching code. <strong>lazy</strong> changes only what is necessary.</p></div>
      <div class="pillar"><span class="num">03</span><h3>Asks before it acts</h3><p>Shell commands and deletes need your OK by default, and <code>guard.yaml</code> rules always win.</p></div>
      <div class="pillar"><span class="num">04</span><h3>Nothing is final</h3><p>Undo the last turn and its file changes, or go back to any message and try again. Every branch is kept.</p></div>
    </div>
  </div>
</section>

<section class="section" id="demo" style="padding-top:0">
  <div class="container">
    <div class="section-head center reveal">
      <span class="kicker">See it work</span>
      <h2>Fast where it can be,<br>quiet when you need to <span class="serif">think.</span></h2>
    </div>
    ${hasVideo ? `<div class="video-frame reveal" style="margin-bottom:56px"><video src="/media/demo.mp4" poster="/img/editor.png" controls playsinline preload="metadata" aria-label="Hm demo video"></video></div>` : ''}
    <div class="demo reveal">
      <div class="demo-tabs" data-tabs role="tablist" aria-label="Terminal demos">
        <button role="tab" aria-selected="true" data-key="review" aria-controls="term">Review a diff</button>
        <button role="tab" aria-selected="false" data-key="ci" tabindex="-1" aria-controls="term">Fix in CI</button>
        <button role="tab" aria-selected="false" data-key="json" tabindex="-1" aria-controls="term">Stream JSON</button>
      </div>
      <div class="term" id="term" data-term role="tabpanel" aria-live="off">
        <div class="panel-bar"><span class="lights"><i></i><i></i><i></i></span><span class="term-title">hm agent</span></div>
        <div class="term-body"><span class="p">$</span> <span class="cursor"></span></div>
      </div>
      <script type="application/json" id="term-scripts">${JSON.stringify(termScripts)}</script>
    </div>
  </div>
</section>

<section class="section" id="features" style="padding-top:0">
  <div class="container">
    <div class="section-head reveal">
      <span class="kicker">The editor</span>
      <h2>Everything you reach for,<br><span class="serif">nothing</span> you wait on.</h2>
      <p>Written in Go and drawn on the GPU with WebGPU, Hm starts quickly and stays light, with the tools you expect from a modern editor.</p>
    </div>
    <div class="bento">
      <div class="card span-4 reveal">
        <div class="icon">${icon('code')}</div>
        <h3>Tree-sitter highlighting for 20+ languages</h3>
        <p>Multiple cursors and column selection, regex find and replace, folding, soft wrap, indent guides, auto-closing pairs, Markdown preview and an optional Vim keymap.</p>
        <div class="chips">${languages.map((l) => `<span class="chip">${l}</span>`).join('')}</div>
      </div>
      <div class="card span-2 reveal">
        <div class="icon">${icon('zap')}</div>
        <h3>Native, GPU-rendered</h3>
        <p>No Electron, no browser engine. A Go binary drawing its own UI with <a href="https://github.com/mirzakhany/yoga" style="text-decoration:underline;text-underline-offset:3px">Yoga</a>.</p>
        <div class="stat"><b>0</b><span>browser engines shipped</span></div>
      </div>
      <div class="card span-2 reveal">
        <div class="icon">${icon('braces')}</div>
        <h3>Language servers</h3>
        <p>Diagnostics, hover, completion, definitions, references, rename and formatting. Missing servers install in one click.</p>
      </div>
      <div class="card span-2 reveal">
        <div class="icon">${icon('search')}</div>
        <h3>Search with ripgrep</h3>
        <p>Project-wide regex search and replace, with results on the left and an editable preview on the right.</p>
      </div>
      <div class="card span-2 reveal">
        <div class="icon">${icon('git')}</div>
        <h3>Git, built in</h3>
        <p>Stage, commit, branch, merge with conflict tracking, fetch, pull and push. Tokens stay in your keychain.</p>
      </div>
      <div class="card span-3 reveal">
        <div class="icon">${icon('file')}</div>
        <h3>Quick open &amp; command palette</h3>
        <p><kbd>⌘</kbd> <kbd>P</kbd> for files, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> for every command, go to symbol and go to tab.</p>
        <div class="card-shot" style="aspect-ratio: 16/8.5"><img src="/img/quick-open.png" alt="Hm's quick open listing files that match runner.go" loading="lazy" width="1360" height="900"></div>
      </div>
      <div class="card span-3 reveal">
        <div class="icon">${icon('sliders')}</div>
        <h3>Settings that are just YAML</h3>
        <p>A settings page on top of <code>config.yaml</code>, user and project level, applied live on save with errors shown at their line.</p>
        <div class="card-shot" style="aspect-ratio: 16/8.5"><img src="/img/agent-settings.png" alt="Hm's agent settings: default provider, default mode, layout and provider keys" loading="lazy" width="1540" height="1140"></div>
      </div>
      <div class="card span-2 reveal">
        <div class="icon">${icon('terminal')}</div>
        <h3>Integrated terminal</h3>
        <p>Multiple sessions, opened from the footer.</p>
      </div>
      <div class="card span-2 reveal">
        <div class="icon">${icon('sparkles')}</div>
        <h3>Inline completions</h3>
        <p>Ghost text at the caret from a small, fast model you pick. <kbd>Tab</kbd> accepts.</p>
      </div>
      <div class="card span-2 reveal">
        <div class="icon">${icon('layers')}</div>
        <h3>Splits, tabs, sessions</h3>
        <p>Split editor groups, back and forward, and your session restored on launch.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="agent">
  <div class="container">
    <div class="section-head reveal">
      <span class="kicker">The agent</span>
      <h2>An agent that works <span class="serif">with</span> you,<br>not around you.</h2>
      <p>Bring your own key, keep your code on your machine, and stay in control of every step.</p>
    </div>

    <div class="feature-row reveal">
      <div>
        <h3>Any model, switched mid-session.</h3>
        <p>Anthropic, Gemini (API key or Vertex AI), OpenAI, Azure OpenAI and any OpenAI-compatible endpoint. Presets for OpenRouter, Groq, Mistral, xAI, DeepSeek, Ollama, LM Studio and more only ask for a key.</p>
        <ul class="checks">
          <li><kbd>Ctrl</kbd> <kbd>L</kbd> searches every provider's models; the history goes along.</li>
          <li><code>/think off…max</code> sets how hard the model thinks, per session.</li>
          <li>A <code>models.json</code> registry drives the context meter, compaction and the cost of every reply.</li>
          <li>Keys live in the OS keychain or come from environment variables.</li>
        </ul>
      </div>
      <div class="panel">
        <div class="panel-bar"><span class="lights"><i></i><i></i><i></i></span>~/.config/hm/config.yaml</div>
        <div class="panel-body">${hl(configYaml, 'yaml')}</div>
      </div>
    </div>

    <div class="feature-row flip reveal">
      <div>
        <h3>Sessions are trees. Nothing is lost.</h3>
        <p>Edit and resend any message to start a branch, or branch from the end of any turn. The old branch stays. Undo puts back the agent's last turn <em>and</em> the files it changed.</p>
        <ul class="checks">
          <li><code>/tree</code> to search and jump between branches, <code>/fork</code> to split a session off.</li>
          <li>Saved after every step; an interrupted task reopens with a <strong>Resume</strong> button.</li>
          <li><code>/export</code> to one offline HTML page, secrets redacted; <code>/share</code> as a secret gist.</li>
        </ul>
      </div>
      <div class="panel">
        <div class="panel-bar"><span class="lights"><i></i><i></i><i></i></span>/tree</div>
        <div class="panel-body">
          <ul class="tree-list">
            <li><span class="g">●</span><span class="who">user</span>Add retries to the HTTP client</li>
            <li><span class="g">│</span><span class="who">assistant</span>Plan: wrap Do() with backoff…</li>
            <li><span class="g">├─</span><span class="who">user</span>Use the stdlib only, no deps</li>
            <li><span class="g">│ │</span><span class="who">tools</span>edit client.go +42 −6</li>
            <li><span class="g">│ └</span><span class="who">assistant</span>Done. Retries 5× with jitter <span class="label">v1</span></li>
            <li class="cur"><span class="g">└─</span><span class="who">user</span>Respect Retry-After headers too</li>
            <li class="cur"><span class="g">  │</span><span class="who">tools</span>edit client.go +18 −3</li>
            <li class="cur"><span class="g">  └</span><span class="who">assistant</span>Waits as long as the API asks…</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="feature-row reveal">
      <div>
        <h3>Guardrails you write, not hope for.</h3>
        <p>Approval per tool and per mode, plus a <code>guard.yaml</code> of deny, read-only and ask rules checked before anything runs. A cloned project's rules can only tighten yours, never loosen them.</p>
        <ul class="checks">
          <li>Modes: <strong>lazy</strong>, <strong>rubber-duck</strong>, <strong>auto</strong>, <strong>fullstack</strong>, or your own.</li>
          <li>Type while it works: <kbd>Enter</kbd> steers, <kbd>Alt</kbd> <kbd>Enter</kbd> queues a follow-up.</li>
          <li>Sub-agents run in parallel, in the foreground or background, read-only unless allowed.</li>
        </ul>
      </div>
      <div class="panel">
        <div class="panel-bar"><span class="lights"><i></i><i></i><i></i></span>.hm/guard.yaml</div>
        <div class="panel-body">${hl(guardYaml, 'yaml')}</div>
      </div>
    </div>

    <div class="bento" style="margin-top: clamp(72px, 10vw, 120px)">
      <div class="card span-2 reveal"><div class="icon">${icon('file')}</div><h3>Reads your AGENTS.md</h3><p>And <code>CLAUDE.md</code>, from every folder between home and the workspace. <code>SYSTEM.md</code> replaces or extends the base prompt.</p></div>
      <div class="card span-2 reveal"><div class="icon">${icon('edit')}</div><h3>Prompt templates</h3><p>Every <code>.md</code> in <code>.hm/prompts</code> or <code>.claude/commands</code> becomes a <code>/command</code>, with arguments and file includes.</p></div>
      <div class="card span-2 reveal"><div class="icon">${icon('layers')}</div><h3>MCP, skills &amp; your tools</h3><p>Add MCP servers, skills, or wrap any CLI as a tool. Arguments never go through a shell.</p></div>
      <div class="card span-2 reveal"><div class="icon">${icon('monitor')}</div><h3>Images in, too</h3><p>Paste a screenshot, drop a file, or mention <code>@shot.png</code>. Large pictures are scaled down first.</p></div>
      <div class="card span-2 reveal"><div class="icon">${icon('sliders')}</div><h3>Long sessions keep going</h3><p>Near the window's limit, older messages are summarised. A context meter shows how full it is.</p></div>
      <div class="card span-2 reveal"><div class="icon">${icon('shield')}</div><h3>Survives flaky APIs</h3><p>Rate limits and dropped connections are retried with backoff, and the chat tells you so.</p></div>
    </div>
  </div>
</section>

<section class="section" id="automation">
  <div class="container">
    <div class="section-head center reveal">
      <span class="kicker">Automation</span>
      <h2>The same agent, <span class="serif">without</span> the window.</h2>
      <p>Run it in scripts and CI, drive it from another program, or embed it in your own Go code. Same config, same <code>guard.yaml</code>, same sessions.</p>
    </div>
    <div class="panel code-tabs reveal" style="max-width: 900px; margin: 0 auto">
      <div class="panel-bar" data-tabs role="tablist" aria-label="Automation examples">
        <button role="tab" aria-selected="true" aria-controls="auto-cli">hm agent -p</button>
        <button role="tab" aria-selected="false" tabindex="-1" aria-controls="auto-rpc">--rpc</button>
        <button role="tab" aria-selected="false" tabindex="-1" aria-controls="auto-go">Go package</button>
      </div>
      <div class="panel-body" id="auto-cli" role="tabpanel">${hl(cliSh, 'sh')}</div>
      <div class="panel-body" id="auto-rpc" role="tabpanel" hidden>${hl(rpcJson, 'json')}</div>
      <div class="panel-body" id="auto-go" role="tabpanel" hidden>${hl(goCode, 'go')}</div>
    </div>
    <p style="text-align:center;margin-top:28px"><a class="btn btn-ghost btn-sm" href="/docs/headless/">Read the automation docs ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section section-tight" id="keys">
  <div class="container">
    <div class="section-head reveal">
      <span class="kicker">Keyboard first</span>
      <h2>Hands stay on the <span class="serif">keys.</span></h2>
      <p>Every binding can be changed in Settings or YAML, with two-chord sequences and VS Code-style <code>when</code> conditions.</p>
    </div>
    <div class="keys reveal">
      <div class="key-row"><span>Command palette</span><span><kbd>⌘</kbd><kbd>⇧</kbd><kbd>P</kbd></span></div>
      <div class="key-row"><span>Go to file</span><span><kbd>⌘</kbd><kbd>P</kbd></span></div>
      <div class="key-row"><span>Toggle agent</span><span><kbd>⌘</kbd><kbd>L</kbd></span></div>
      <div class="key-row"><span>Ask about selection</span><span><kbd>⌘</kbd><kbd>⌥</kbd><kbd>L</kbd></span></div>
      <div class="key-row"><span>Pick a model</span><span><kbd>⌃</kbd><kbd>L</kbd></span></div>
      <div class="key-row"><span>New agent tab</span><span><kbd>⌘</kbd><kbd>T</kbd></span></div>
      <div class="key-row"><span>Search in project</span><span><kbd>⌘</kbd><kbd>⇧</kbd><kbd>F</kbd></span></div>
      <div class="key-row"><span>Add next occurrence</span><span><kbd>⌘</kbd><kbd>D</kbd></span></div>
    </div>
    <p style="margin-top:24px"><a class="btn btn-ghost btn-sm" href="/docs/shortcuts/">All shortcuts ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cta reveal">
      <img src="/img/appicon.png" alt="" width="88" height="88" loading="lazy">
      <h2>Take a moment. <span class="serif">Hm.</span></h2>
      <p>Build it from source today. Signed releases for macOS, Linux and Windows are on the way.</p>
      <div class="install-cmd"><span class="p">$</span><code>git clone ${site.repo}.git &amp;&amp; cd hm &amp;&amp; make install</code><button class="copy-btn" type="button" aria-label="Copy command" data-copy="git clone ${site.repo}.git && cd hm && make install"></button></div>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="/docs/install/">${icon('book')}Installation guide</a>
        <a class="btn btn-ghost" href="${site.repo}" rel="noopener">${icon('github')}Star on GitHub</a>
      </div>
    </div>
  </div>
</section>

</main>
${footer()}
${searchDialog()}
${scripts()}
</body>
</html>`;
}
