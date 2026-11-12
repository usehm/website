// Builds the site into dist/: the landing page, the docs from
// content/docs/*.md, a search index, a sitemap and a 404 page.
// --watch rebuilds on change and serves dist/ on http://localhost:4321.
import { cp, mkdir, readdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { Marked } from 'marked';
import { createHighlighter } from 'shiki';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const contentDir = path.join(root, 'content/docs');
const sections = ['Getting started', 'Editor', 'Agent', 'Automation'];

const highlighter = await createHighlighter({
  themes: ['github-light', 'tokyo-night'],
  langs: ['go', 'yaml', 'json', 'shellscript', 'markdown', 'python', 'text'],
});
const langAlias = { sh: 'shellscript', bash: 'shellscript', shell: 'shellscript', zsh: 'shellscript', yml: 'yaml', md: 'markdown', jsonl: 'json', '': 'text' };

function hl(code, lang = 'text') {
  let l = langAlias[lang] ?? lang;
  if (!highlighter.getLoadedLanguages().includes(l)) l = 'text';
  return highlighter.codeToHtml(code, {
    lang: l,
    themes: { light: 'github-light', dark: 'tokyo-night' },
    defaultColor: false,
  }).replace('<pre ', `<pre data-lang="${lang || 'text'}" `);
}

const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function parseFront(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return [{}, src];
  const data = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) {
      const v = line.slice(i + 1).trim();
      data[line.slice(0, i).trim()] = /^\d+$/.test(v) ? Number(v) : v;
    }
  }
  return [data, src.slice(m[0].length)];
}

// Renders one Markdown page, returning its HTML and headings.
function renderMarkdown(md) {
  const toc = [];
  const used = new Map();
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        let id = slugify(strip(html)) || 'section';
        const n = used.get(id) ?? 0;
        used.set(id, n + 1);
        if (n) id += `-${n}`;
        if (depth === 2 || depth === 3) toc.push({ depth, id, text: strip(html) });
        return `<h${depth} id="${id}">${html}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`;
      },
      code({ text, lang }) {
        return hl(text, (lang ?? '').split(/\s/)[0]);
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const ext = /^https?:\/\//.test(href) && !href.startsWith('https://usehm.dev');
        return `<a href="${href}"${title ? ` title="${title}"` : ''}${ext ? ' rel="noopener"' : ''}>${text}</a>`;
      },
    },
  });
  const html = marked.parse(md)
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>');
  return { html, toc };
}

async function loadDocs() {
  const files = (await readdir(contentDir)).filter((f) => f.endsWith('.md'));
  const docs = [];
  for (const f of files) {
    const [front, body] = parseFront(await readFile(path.join(contentDir, f), 'utf8'));
    const slug = f === 'index.md' ? '' : f.replace(/\.md$/, '');
    const { html, toc } = renderMarkdown(body);
    docs.push({ ...front, file: f, slug, url: slug ? `/docs/${slug}/` : '/docs/', html, toc });
  }
  docs.sort((a, b) => sections.indexOf(a.section) - sections.indexOf(b.section) || a.order - b.order);
  return docs;
}

async function build() {
  const t0 = performance.now();
  globalThis.BUILD_ID = Date.now().toString(36);
  const layout = await import('../src/layout.mjs');
  const { home } = await import('../src/home.mjs');
  const { docPage } = await import('../src/docs.mjs');

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(path.join(root, 'public'), dist, { recursive: true });

  const write = async (rel, html) => {
    const file = path.join(dist, rel);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  };

  const hasVideo = existsSync(path.join(root, 'public/media/demo.mp4'));
  await write('index.html', home({ hl, hasVideo }));

  const docs = await loadDocs();
  const nav = sections.map((s) => ({ title: s, items: docs.filter((d) => d.section === s) }));
  for (const [i, d] of docs.entries()) {
    await write(path.join('docs', d.slug, 'index.html'), docPage({ doc: d, nav, prev: docs[i - 1], next: docs[i + 1], layout }));
  }

  // Search index: each page, and each of its sections.
  const index = [];
  for (const d of docs) {
    const parts = d.html.split(/(?=<h[23] id=")/);
    index.push({ title: d.title, page: d.section, url: d.url, description: d.description, text: strip(parts[0]).replace(/\s+/g, ' ').trim().slice(0, 400) });
    for (const part of parts.slice(1)) {
      const m = part.match(/^<h[23] id="([^"]+)">([\s\S]*?)<a class="anchor"/);
      if (!m) continue;
      const text = strip(part.replace(/^<h[23][\s\S]*?<\/h[23]>/, '')).replace(/\s+/g, ' ').trim();
      index.push({ title: strip(m[2]), page: d.title, url: `${d.url}#${m[1]}`, anchor: true, text: text.slice(0, 400) });
    }
  }
  await write('search.json', JSON.stringify(index));

  await write('404.html', `${layout.head({ title: 'Page not found', path: '/404' })}
<body>
${layout.nav()}
<main class="notfound"><div>
  <h1>Hm<span class="dot">?</span></h1>
  <p>That page took too long a pause. It may have moved.</p>
  <div class="hero-ctas"><a class="btn btn-primary" href="/">Back home</a><a class="btn btn-ghost" href="/docs/">Read the docs</a></div>
</div></main>
${layout.footer()}
${layout.searchDialog()}
${layout.scripts()}
</body>
</html>`);

  const today = new Date().toISOString().slice(0, 10);
  const urls = ['/', ...docs.map((d) => d.url)];
  await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${layout.site.url}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
  await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${layout.site.url}/sitemap.xml\n`);

  console.log(`built ${docs.length + 2} pages in ${Math.round(performance.now() - t0)} ms`);
}

await build();

if (process.argv.includes('--watch')) {
  let timer;
  for (const dir of ['src', 'content', 'public']) {
    watch(path.join(root, dir), { recursive: true }, () => {
      clearTimeout(timer);
      // A fresh process, so changes to the templates are picked up too.
      timer = setTimeout(() => spawn(process.execPath, [fileURLToPath(import.meta.url)], { stdio: 'inherit' }), 120);
    });
  }
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4', '.webp': 'image/webp' };
  createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(dist, p);
    if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
    try {
      if ((await stat(file)).isDirectory()) {
        if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }).end(); return; }
        file = path.join(file, 'index.html');
      }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'Content-Type': types['.html'] });
      res.end(await readFile(path.join(dist, '404.html')).catch(() => 'Not found'));
    }
  }).listen(4321, () => console.log('serving dist/ on http://localhost:4321'));
}
