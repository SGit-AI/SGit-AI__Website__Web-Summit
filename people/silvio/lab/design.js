/* The design toggle for the PrompTugal.news lab (design@web-summit.silvio, at Silvio's word, 6 November 2026).
   Like the theme toggle, but for the whole design: the reader sees the default design, opens "Design" and picks
   another; the choice is kept in this browser (localStorage, key pt-lab-design) and every later visit to the lab's
   start page (people/silvio/lab/site.htm) opens it. Nothing leaves the browser. Loaded by front.htm and mocks/*.htm. */
(function () {
    'use strict';
    var BASE = 'https://web-summit.sgit.ai/people/silvio/lab/', KEY = 'pt-lab-design';
    // The default for a reader who never chose. Change this one word to change the default.
    var DEFAULT = 'original';
    var D = [
        { id: 'original', name: 'Today', note: 'The live site as it is', href: 'front.htm', img: 'mocks/shots/original-desktop.jpg' },
        { id: 'a', name: 'The Edition', note: 'A classic front page', href: 'mocks/a.htm', img: 'mocks/shots/a-desktop.jpg' },
        { id: 'b', name: 'Summit Live', note: 'Built for the four days', href: 'mocks/b.htm', img: 'mocks/shots/b-desktop.jpg' },
        { id: 'c', name: 'The Atlas', note: 'AI in Portugal, mapped', href: 'mocks/c.htm', img: 'mocks/shots/c-desktop.jpg' },
        { id: 'd', name: 'The Brief', note: 'Read it in two minutes', href: 'mocks/d.htm', img: 'mocks/shots/d-desktop.jpg' }
    ];
    var get = function () { try { return localStorage.getItem(KEY) } catch (e) { return null } };
    var put = function (v) { try { localStorage.setItem(KEY, v) } catch (e) { } };
    var find = function (id) { for (var i = 0; i < D.length; i++) if (D[i].id === id) return D[i]; return null };
    var chosen = function () { return find(get()) || find(DEFAULT) };
    window.PTLabDesign = { designs: D, chosen: chosen, go: function () { location.replace(BASE + chosen().href) } };

    var here = document.currentScript && document.currentScript.getAttribute('data-design');
    if (!here) return; // the start page only routes

    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e }
    function build() {
        var cur = find(here) || chosen();
        var btn = el('button', 'ptd-btn'); btn.type = 'button'; btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false');
        btn.appendChild(el('span', 'ptd-spark', '✦')); btn.appendChild(document.createTextNode(' Design: ')); btn.appendChild(el('b', '', cur.name));
        var sheet = el('div', 'ptd-sheet'); sheet.hidden = true; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'Choose a design');
        var box = el('div', 'ptd-box'); sheet.appendChild(box);
        var head = el('div', 'ptd-head'); head.appendChild(el('h2', '', 'Choose your design'));
        var x = el('button', 'ptd-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); head.appendChild(x); box.appendChild(head);
        box.appendChild(el('p', 'ptd-sub', 'Same news, five ways to read it. Your choice is remembered in this browser.'));
        var grid = el('div', 'ptd-grid'); box.appendChild(grid);
        D.forEach(function (d) {
            var a = el('a', 'ptd-card' + (d.id === cur.id ? ' on' : '')); a.href = BASE + d.href;
            if (d.id === cur.id) a.setAttribute('aria-current', 'true');
            var pic = el('span', 'ptd-pic');
            if (d.img) { var im = el('img'); im.alt = ''; im.loading = 'lazy'; im.setAttribute('data-src', BASE + d.img); pic.appendChild(im) } else pic.appendChild(el('span', 'ptd-today', 'Today'));
            a.appendChild(pic);
            var t = el('span', 'ptd-t'); t.appendChild(el('b', '', d.name + (d.id === DEFAULT ? ' · default' : ''))); t.appendChild(el('small', '', d.note)); a.appendChild(t);
            a.addEventListener('click', function () { put(d.id) });
            grid.appendChild(a);
        });
        function set(open) {
            sheet.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open) { sheet.querySelectorAll('img[data-src]').forEach(function (i) { i.src = i.getAttribute('data-src'); i.removeAttribute('data-src') }); x.focus() } else btn.focus();
        }
        btn.addEventListener('click', function () { set(sheet.hidden) });
        x.addEventListener('click', function () { set(false) });
        sheet.addEventListener('click', function (e) { if (e.target === sheet) set(false) });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) set(false) });
        document.body.appendChild(btn); document.body.appendChild(sheet);
        put(cur.id); // reaching a design (from the picker or a link) pins it
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
