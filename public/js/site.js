// usehm.dev: small enhancements on top of static pages. Everything works
// without it; it adds the theme toggle, menus, tabs, copy buttons, the
// terminal demo and docs search.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme: follows the system until the toggle picks one.
  $$('.theme-toggle').forEach((btn) => btn.addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
  }));

  // Nav: a border once the page scrolls, and the mobile menu.
  const nav = $('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    $('.menu-btn', nav)?.addEventListener('click', (e) => {
      const open = nav.classList.toggle('open');
      e.currentTarget.setAttribute('aria-expanded', String(open));
    });
  }

  // Reveal sections as they scroll into view.
  const reveals = $$('.reveal, .hero-shot');
  if ('IntersectionObserver' in window && !reduced && !location.search.includes('static')) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Tabs: [data-tabs] holds buttons with aria-controls pointing at panels.
  $$('[data-tabs]').forEach((group) => {
    const buttons = $$('[role="tab"]', group);
    const select = (btn) => {
      buttons.forEach((b) => {
        const on = b === btn;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(b.getAttribute('aria-controls'));
        if (!panel) return;
        if (panel.tagName === 'FIGURE') panel.classList.toggle('active', on);
        else panel.hidden = !on;
      });
      group.dispatchEvent(new CustomEvent('tabchange', { detail: btn.dataset.key }));
    };
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => select(b));
      b.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        const next = buttons[(i + d + buttons.length) % buttons.length];
        next.focus();
        select(next);
      });
    });
  });

  // Copy buttons: data-copy holds the text, or the nearest pre is copied.
  const copyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const doneIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  $$('.prose pre').forEach((pre) => {
    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    pre.replaceWith(wrap);
    wrap.append(pre);
    if (pre.dataset.lang) {
      const lang = document.createElement('span');
      lang.className = 'lang';
      lang.textContent = pre.dataset.lang;
      wrap.append(lang);
    }
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    wrap.append(btn);
  });
  $$('.copy-btn').forEach((btn) => {
    if (!btn.innerHTML.trim()) btn.innerHTML = copyIcon;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy ?? btn.parentElement.querySelector('pre')?.innerText ?? '';
      try {
        await navigator.clipboard.writeText(text.trimEnd());
        btn.innerHTML = doneIcon;
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = copyIcon; btn.classList.remove('copied'); }, 1600);
      } catch {}
    });
  });

  // Terminal demo: types each script's command, then prints its output.
  const term = $('[data-term]');
  if (term) {
    const scripts = JSON.parse($('#term-scripts').textContent);
    const body = $('.term-body', term);
    const title = $('.term-title', term);
    let run = 0;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const play = async (key) => {
      const id = ++run;
      const s = scripts[key];
      title.textContent = s.title;
      if (reduced) {
        body.innerHTML = `<span class="p">$</span> <span class="c">${s.cmd}</span>\n${s.out.map((l) => l[1]).join('\n')}`;
        return;
      }
      body.innerHTML = '<span class="p">$</span> <span class="c"></span><span class="cursor"></span>';
      const cmd = $('.c', body);
      const plain = s.cmd.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
      for (let i = 1; i <= plain.length; i++) {
        if (id !== run) return;
        cmd.textContent = plain.slice(0, i);
        await sleep(plain[i - 1] === ' ' ? 40 : 22 + Math.random() * 30);
      }
      cmd.innerHTML = s.cmd;
      await sleep(350);
      $('.cursor', body)?.remove();
      for (const [delay, line] of s.out) {
        if (id !== run) return;
        await sleep(delay);
        body.insertAdjacentHTML('beforeend', '\n' + line);
      }
      body.insertAdjacentHTML('beforeend', '\n<span class="p">$</span> <span class="cursor"></span>');
    };
    const tabs = $('[data-tabs]', term.parentElement);
    tabs?.addEventListener('tabchange', (e) => play(e.detail));
    const first = $('[role="tab"]', tabs)?.dataset.key ?? Object.keys(scripts)[0];
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); play(first); }
      }, { threshold: 0.3 });
      io.observe(term);
    } else play(first);
  }

  // Docs: sidebar drawer on small screens.
  const sidebar = $('.docs-sidebar');
  $('.docs-menu-btn')?.addEventListener('click', (e) => {
    const open = sidebar.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });

  // Docs: highlight the section being read in the table of contents.
  const tocLinks = $$('.docs-toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const heads = tocLinks.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
      const current = heads.find((h) => visible.has(h));
      if (!current) return;
      tocLinks.forEach((a) => a.classList.toggle('active', a.hash === '#' + current.id));
    }, { rootMargin: `-${64}px 0px -70% 0px` });
    heads.forEach((h) => io.observe(h));
  }

  // Docs search: a dialog over /search.json, opened with the button, / or cmd+k.
  const dialog = $('.search-dialog');
  if (dialog) {
    const input = $('input', dialog);
    const list = $('.search-results', dialog);
    let index = null;
    let selected = 0;
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const mark = (s, terms) => {
      let out = esc(s);
      for (const t of terms) out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
      return out;
    };
    const render = () => {
      const q = input.value.trim().toLowerCase();
      if (!index) return;
      const terms = q.split(/\s+/).filter(Boolean);
      let hits;
      if (!terms.length) {
        hits = index.filter((d) => !d.anchor).slice(0, 8).map((d) => ({ d, snip: d.description }));
      } else {
        hits = [];
        for (const d of index) {
          const hay = (d.title + ' ' + d.page + ' ' + d.text).toLowerCase();
          if (!terms.every((t) => hay.includes(t))) continue;
          let score = 0;
          for (const t of terms) {
            if (d.title.toLowerCase().includes(t)) score += d.anchor ? 6 : 10;
            if (d.page.toLowerCase().includes(t)) score += 2;
          }
          const at = d.text.toLowerCase().indexOf(terms[0]);
          const snip = at < 0 ? d.text.slice(0, 120) : (at > 40 ? '…' : '') + d.text.slice(Math.max(0, at - 40), at + 100);
          hits.push({ d, snip, score });
        }
        hits.sort((a, b) => b.score - a.score);
        hits = hits.slice(0, 12);
      }
      selected = 0;
      if (!hits.length) { list.innerHTML = `<li class="search-empty">No results for “${esc(input.value)}”</li>`; return; }
      list.innerHTML = hits.map(({ d, snip }, i) => `<li><a href="${d.url}" aria-selected="${i === 0}">
        <div class="t">${d.anchor ? `<span style="color:var(--muted);font-weight:500">${esc(d.page)} › </span>` : ''}${mark(d.title, terms)}</div>
        <div class="s">${mark(snip ?? '', terms)}</div></a></li>`).join('');
    };
    const open = async () => {
      if (!dialog.open) dialog.showModal();
      input.select();
      if (!index) {
        try { index = await (await fetch('/search.json')).json(); } catch { index = []; }
      }
      render();
    };
    $$('[data-search]').forEach((b) => b.addEventListener('click', open));
    addEventListener('keydown', (e) => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); open(); }
    });
    input.addEventListener('input', render);
    input.addEventListener('keydown', (e) => {
      const links = $$('a', list);
      if (!links.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        selected = (selected + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links.forEach((a, i) => a.setAttribute('aria-selected', String(i === selected)));
        links[selected].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        location.href = links[selected].href;
        dialog.close();
      }
    });
    $('form', dialog).addEventListener('submit', (e) => e.preventDefault());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  }
})();
