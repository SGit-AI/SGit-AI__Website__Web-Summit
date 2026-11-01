// Days to Web Summit, counted in the reader's browser so the page needs no rebuild each day.
(function () {
    var el = document.querySelector('[data-countdown]'); if (!el) return
    var open = new Date(el.getAttribute('data-countdown') + 'T09:00:00Z'), end = new Date('2026-11-12T23:59:00Z'), now = new Date()
    var days = Math.ceil((open - now) / 86400000)
    el.textContent = now > end ? 'Web Summit 2026 is over: the follow-up is the product.' : now >= open ? 'Web Summit is on now, in Lisbon, until 12 November.' : days + (days === 1 ? ' day' : ' days') + ' to Web Summit Lisbon (9 to 12 November 2026)'
})()
