// Shared page chrome: <head>, nav, footer and the search dialog.

export const site = {
  name: 'Hm',
  url: 'https://usehm.dev',
  repo: 'https://github.com/usehm/hm',
  tagline: 'The AI harness & editor for when you pause to think.',
  description:
    'Hm is a native desktop code editor with a bring-your-own-key AI coding agent built in. Written in Go, GPU-rendered, configured in YAML, for macOS, Linux and Windows.',
};

// Lucide-style 24px stroke icons.
const paths = {
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4M21 2l-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  braces: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
  git: '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>',
  terminal: '<path d="m4 17 6-6-6-6M12 19h8"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  feather: '<path d="M12.67 19a2 2 0 0 0 1.42-.59l6.31-6.33a5.5 5.5 0 0 0-7.78-7.78l-6.33 6.31A2 2 0 0 0 5.71 12V19h6.96z"/><path d="M16 8 2 22M17.5 15H9"/>',
  edit: '<path d="M12 20h9"/><path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.85.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.85z"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
};

export const icon = (name, attrs = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${attrs}>${paths[name]}</svg>`;

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function head({ title, description = site.description, path = '/', type = 'website' }) {
  const full = title ? `${title} · Hm` : `Hm — ${site.tagline}`;
  const url = site.url + path;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0b0e15" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f6f3ec" media="(prefers-color-scheme: light)">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Hm">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url}/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${site.url}/img/og.png">
<link rel="icon" type="image/png" sizes="512x512" href="/img/appicon.png">
<link rel="apple-touch-icon" href="/img/appicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/css/site.css?v=${globalThis.BUILD_ID}">
<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
</head>`;
}

export function nav(active = '') {
  const link = (href, label, key) =>
    `<a href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<header class="nav">
  <div class="container nav-inner">
    <a class="brand" href="/" aria-label="Hm home"><img src="/img/appicon.png" alt="" width="30" height="30"><span>Hm<span class="dot">.</span></span></a>
    <nav class="nav-links" aria-label="Main">
      ${link('/#features', 'Features', 'features')}
      ${link('/#agent', 'Agent', 'agent')}
      ${link('/#automation', 'Automation', 'automation')}
      ${link('/docs/', 'Docs', 'docs')}
      ${link(site.repo + '/releases', 'Changelog', 'changelog')}
    </nav>
    <div class="nav-actions">
      <button class="icon-btn" type="button" data-search aria-label="Search docs">${icon('search')}</button>
      <button class="icon-btn theme-toggle" type="button" aria-label="Toggle colour theme">${icon('moon', 'class="moon"')}${icon('sun', 'class="sun"')}</button>
      <a class="btn btn-ghost btn-sm gh-stars" href="${site.repo}" rel="noopener">${icon('github')}<span class="btn-label">GitHub</span></a>
      <a class="btn btn-primary btn-sm" href="/docs/install/">${icon('download')}<span class="btn-label">Get Hm</span></a>
      <button class="icon-btn menu-btn" type="button" aria-label="Menu" aria-expanded="false">${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

export function footer() {
  const year = new Date().getFullYear();
  return `<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="/"><img src="/img/appicon.png" alt="" width="30" height="30"><span>Hm<span class="dot">.</span></span></a>
        <p>The AI harness &amp; editor for when you pause to think. Native, open source (AGPL-3.0), and bring your own key.</p>
      </div>
      <div>
        <h4>Product</h4>
        <ul>
          <li><a href="/#features">Features</a></li>
          <li><a href="/#agent">The agent</a></li>
          <li><a href="/#automation">Automation</a></li>
          <li><a href="/docs/install/">Install</a></li>
        </ul>
      </div>
      <div>
        <h4>Docs</h4>
        <ul>
          <li><a href="/docs/">Introduction</a></li>
          <li><a href="/docs/configuration/">Configuration</a></li>
          <li><a href="/docs/providers/">Providers</a></li>
          <li><a href="/docs/shortcuts/">Shortcuts</a></li>
        </ul>
      </div>
      <div>
        <h4>Project</h4>
        <ul>
          <li><a href="${site.repo}" rel="noopener">GitHub</a></li>
          <li><a href="${site.repo}/issues" rel="noopener">Issues</a></li>
          <li><a href="${site.repo}/releases" rel="noopener">Releases</a></li>
          <li><a href="${site.repo}/blob/main/LICENSE" rel="noopener">License (AGPL-3.0)</a></li>
          <li><a href="https://github.com/mirzakhany/yoga" rel="noopener">Yoga UI toolkit</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${year} Mohsen Mirzakhani</span>
      <span>Built with Go and WebGPU · Made for the pause before the merge</span>
    </div>
  </div>
</footer>`;
}

export const searchDialog = () => `<dialog class="search-dialog" aria-label="Search the docs">
  <form method="dialog">${icon('search')}<input type="search" placeholder="Search the docs…" autocomplete="off" spellcheck="false" aria-label="Search"><kbd>esc</kbd></form>
  <ul class="search-results" role="listbox"></ul>
</dialog>`;

export const scripts = () => `<script src="/js/site.js?v=${globalThis.BUILD_ID}" defer></script>`;
