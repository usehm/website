// A docs page: sidebar, article, table of contents and prev/next links.
import { esc, icon, site } from './layout.mjs';

export function docPage({ doc, nav, prev, next, layout }) {
  const sidebar = nav.map((group) => `<div class="side-group">
      <h5>${esc(group.title)}</h5>
      <ul>${group.items.map((d) => `<li><a href="${d.url}"${d.url === doc.url ? ' aria-current="page"' : ''}>${esc(d.title)}</a></li>`).join('')}</ul>
    </div>`).join('\n');

  const toc = doc.toc.length > 1
    ? `<aside class="docs-toc" aria-label="On this page"><h5>On this page</h5><ul>${doc.toc
      .map((h) => `<li><a href="#${h.id}"${h.depth === 3 ? ' class="sub"' : ''}>${esc(h.text)}</a></li>`).join('')}</ul></aside>`
    : '<aside class="docs-toc"></aside>';

  const pager = `<nav class="pager" aria-label="Pages">
      ${prev ? `<a class="prev" href="${prev.url}"><small>← Previous</small><span>${esc(prev.title)}</span></a>` : ''}
      ${next ? `<a class="next" href="${next.url}"><small>Next →</small><span>${esc(next.title)}</span></a>` : ''}
    </nav>`;

  // Synced pages are edited in the hm repository, the rest here.
  const synced = /^(rpc|events)\.md$/.test(doc.file);
  const editUrl = synced
    ? `${site.repo}/blob/main/docs/${doc.file}`
    : `https://github.com/usehm/website/edit/main/content/docs/${doc.file}`;

  return `${layout.head({ title: doc.title, description: doc.description, path: doc.url, type: 'article' })}
<body class="docs-body">
${layout.nav('docs')}
<div class="docs-layout">
  <aside class="docs-sidebar" aria-label="Documentation">
    <button class="search-trigger" type="button" data-search>${icon('search')}Search docs<kbd>⌘K</kbd></button>
    ${sidebar}
  </aside>
  <main class="docs-main">
    <button class="docs-menu-btn" type="button" aria-expanded="false">${icon('menu')}Menu</button>
    <article class="prose">
      <div class="breadcrumbs">Docs / ${esc(doc.section)}</div>
      <h1>${esc(doc.title)}</h1>
      ${doc.description ? `<p class="desc">${esc(doc.description)}</p>` : ''}
      ${doc.html}
      <a class="edit-link" href="${editUrl}" rel="noopener">${icon('edit')}Edit this page on GitHub</a>
    </article>
    ${pager}
  </main>
  ${toc}
</div>
${layout.searchDialog()}
${layout.scripts()}
</body>
</html>`;
}
