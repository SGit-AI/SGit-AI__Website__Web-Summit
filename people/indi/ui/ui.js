// Indi's pages (WS-06, ux@web-summit.indi): turn every <time data-rel> into "3 hours ago" in the reader's browser,
// and keep it current each minute. The page already says it in words from the build, so it reads without this file.
(function () {
    function ago(t) {
        var s = Math.round((Date.now() - t) / 1000), f = s < 0, a = Math.abs(s), n, u
        if (a < 60) return f ? 'in under a minute' : 'just now'
        if (a < 3600) { n = Math.round(a / 60); u = 'minute' }
        else if (a < 86400) { n = Math.round(a / 3600); u = 'hour' }
        else { n = Math.round(a / 86400); u = 'day' }
        if (!f && u === 'day' && n === 1) return 'yesterday'
        if (f && u === 'day' && n === 1) return 'tomorrow'
        var w = n + ' ' + u + (n === 1 ? '' : 's')
        return f ? 'in ' + w : w + ' ago'
    }
    function tick() {
        var els = document.querySelectorAll('time[data-rel]')
        for (var i = 0; i < els.length; i++) { var t = Date.parse(els[i].getAttribute('datetime')); if (!isNaN(t)) els[i].textContent = ago(t) }
    }
    // the colour filters on "What changed": show only the items with that topic
    function filters() {
        var bs = document.querySelectorAll('[data-filter]')
        for (var i = 0; i < bs.length; i++) bs[i].addEventListener('click', function (e) {
            var k = e.currentTarget.getAttribute('data-filter'), items = document.querySelectorAll('[data-feed] > li'), more = document.querySelector('details.more')
            for (var j = 0; j < bs.length; j++) bs[j].setAttribute('aria-pressed', String(bs[j] === e.currentTarget))
            for (var j = 0; j < items.length; j++) items[j].hidden = k !== 'all' && (' ' + items[j].getAttribute('data-tags') + ' ').indexOf(' ' + k + ' ') < 0
            if (more && k !== 'all') more.open = true
        })
    }
    function start() { tick(); filters() }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start()
    setInterval(tick, 60000)
})()
