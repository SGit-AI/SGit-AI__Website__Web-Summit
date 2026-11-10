// One line on the stand's pages turns the offline copy on (on Silvio's yes): the worker at the site root, scoped to it.
if ('serviceWorker' in navigator) navigator.serviceWorker.register((document.body.dataset.up || '') + 'stand-sw.js').catch(() => {})
