// compose the private vault app the way `crm.mjs app` does (appFiles), for the test vault
const fs = require('fs'), path = require('path')
const W = process.argv[2], OUT = path.join(__dirname, 'vault', 'index.html')
const tpl = fs.readFileSync(path.join(W, 'admin/tools/crm_app.html.tpl'), 'utf8'), mail = fs.readFileSync(path.join(W, 'assets/crm-mail.js'), 'utf8')
fs.writeFileSync(OUT, tpl.replace('/*__MAIL__*/', () => mail).replace("const WHICH = /*__WHICH__*/''", 'const WHICH = /*__WHICH__*/"private"'))
console.log('composed', OUT, fs.readFileSync(OUT, 'utf8').includes('window.WSCrmMail = {'))
