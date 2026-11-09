const { chromium } = require('playwright');
const OUT = process.argv[2];
const ICON = {
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};
const CSS = `
.pt-share{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .5rem;margin:.6rem 0 0;font:500 .82rem/1.2 system-ui,-apple-system,"Segoe UI",sans-serif}
.pt-share .lbl{color:var(--muted,#6b6b6b);margin-right:.15rem}
.pt-share a,.pt-share button{display:inline-flex;align-items:center;gap:.35rem;padding:.38rem .7rem;border:1px solid currentColor;border-radius:999px;color:inherit;background:transparent;text-decoration:none;font:inherit;cursor:pointer;opacity:.9}
.pt-share .pt-save-offline{margin:0}
.pt-share svg{width:15px;height:15px}
.pt-share .primary{background:#1d3f8f;border-color:#1d3f8f;color:#fff}
.pt-share-end{margin:2.2rem 0 1rem;padding:1rem 0;border-top:1px solid rgba(127,127,127,.35)}
.pt-share-end h2{font-size:1.05rem;margin:0 0 .5rem}
.pt-share-menu{margin:.5rem 0 0;padding:.6rem;border:1px solid rgba(127,127,127,.45);border-radius:10px;display:grid;gap:.4rem;max-width:260px;background:var(--paper,#fff)}
.pt-share-menu a,.pt-share-menu button{justify-content:flex-start;border-radius:8px}
.pt-note{font:500 .75rem/1.3 system-ui,sans-serif;color:#b3261e;border:1px dashed #b3261e;padding:.25rem .5rem;border-radius:6px;display:inline-block;margin-top:.4rem}
`;
const links = `<a href="#">LinkedIn</a><a href="#">X</a><a href="#">WhatsApp</a><a href="#">Email</a><button type="button">${ICON.link} Copy link</button>`;
(async () => {
  const b = await chromium.launch();
  const shot = async ({ url, w, h, dark, name, mode, scroll }) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, colorScheme: dark ? 'dark' : 'light' });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: CSS });
    await p.evaluate(({ mode, links, ICON }) => {
      document.querySelector('#nr-live')?.remove();
      const head = document.querySelector('.page-head');
      const off = head.querySelector('.pt-save-offline');
      const row = document.createElement('div'); row.className = 'pt-share';
      if (mode === 'desktop') row.innerHTML = `<span class="lbl">Share</span>${links}`;
      else row.innerHTML = `<button type="button" class="primary">${ICON.share} Share</button>`;
      head.appendChild(row);
      if (off) row.appendChild(off);
      if (mode === 'phone-menu') {
        const m = document.createElement('div'); m.className = 'pt-share pt-share-menu';
        m.innerHTML = links;
        row.after(m);
        const n = document.createElement('div'); n.className = 'pt-note'; n.textContent = 'Mock-up: a browser without its own share sheet gets this list';
        m.after(n);
      }
      if (mode === 'phone') { const n = document.createElement('div'); n.className = 'pt-note'; n.textContent = "Mock-up: on a phone, Share opens the phone's own share sheet"; row.after(n); }
      const body = document.querySelector('main .body');
      if (body && document.body.classList.contains('type-article')) {
        const end = document.createElement('section'); end.className = 'pt-share-end';
        end.innerHTML = `<h2>Share this article</h2><div class="pt-share">${mode === 'desktop' ? links : `<button type="button" class="primary">${ICON.share} Share</button>`}</div>`;
        body.appendChild(end);
      }
    }, { mode, links, ICON });
    if (scroll === 'end') { await p.evaluate(() => document.querySelector('.pt-share-end').scrollIntoView({ block: 'center' })); }
    else await p.evaluate(() => scrollTo(0, Math.max(0, document.querySelector('.page-head').getBoundingClientRect().top + scrollY - (innerWidth > 800 ? 150 : 70))));
    await p.screenshot({ path: `${OUT}/${name}.png` });
    await p.close();
  };
  const A = 'https://promptugal.news/articles/brazil-on-the-stages.html';
  await shot({ url: A, w: 1280, h: 720, name: 'mockup-desktop', mode: 'desktop' });
  await shot({ url: A, w: 390, h: 760, name: 'mockup-phone', mode: 'phone', dark: true });
  await shot({ url: A, w: 390, h: 760, name: 'mockup-phone-fallback', mode: 'phone-menu' });
  await shot({ url: 'https://promptugal.news/companies/aicep/index.html', w: 1280, h: 620, name: 'mockup-entity', mode: 'desktop', dark: true });
  await b.close();
})();
