// Print QR codes for the design kit: an SVG (vector, black on white, error correction M, 4-module quiet zone) and a
// 1200 x 1200 PNG for checking, per code. Uses the QR encoder and reader inside pki.sgit.ai's agent tool, so nothing
// is installed; the tool is checked against its pinned sha256 before it is run.
//
//   node team/designer/qr/make-qr.mjs <path/to/pki-agent.mjs> [name=url ...]
//
// With no name=url pairs it makes the four codes that do not depend on people's names (flyer, banner, sticker, tee).
// A personal card later:  node team/designer/qr/make-qr.mjs <pki-agent.mjs> card-<id>=https://web-summit.sgit.ai/team/<id>/
// Get the tool with: curl -sO https://pki.sgit.ai/agents/pki-agent.mjs (check its sha256 matches PINNED below, or
// update PINNED knowingly). Writes into this folder. Every PNG is read back and must equal its URL, or nothing is written.
// Independent check: python verify-qr.py (zxing-cpp) in this folder. Apache-2.0.

import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const PINNED = 'fcb28a1cc40d05bf8ccc8fc61a2a907c934840cac7aa41d9d8283c1d461002ab'
const DEFAULT = {
    flyer:   'https://web-summit.sgit.ai/?src=flyer',
    banner:  'https://web-summit.sgit.ai/?src=banner',
    sticker: 'https://web-summit.sgit.ai/?src=sticker',
    tee:     'https://web-summit.sgit.ai/?src=tee',
}

const [toolPath, ...pairs] = process.argv.slice(2)
if (!toolPath) { console.error('usage: make-qr.mjs <pki-agent.mjs> [name=url ...]'); process.exit(2) }
const source = fs.readFileSync(toolPath, 'utf8')
const actual = crypto.createHash('sha256').update(source).digest('hex')
if (actual !== PINNED) { console.error(`make-qr: ${toolPath} sha256 ${actual} is not the pinned ${PINNED}: refusing`); process.exit(1) }

const codes = pairs.length ? Object.fromEntries(pairs.map(p => { const i = p.indexOf('='); return [p.slice(0, i), p.slice(i + 1)] })) : DEFAULT
for (const [name, url] of Object.entries(codes)) {
    if (!/^[a-z0-9-]+$/.test(name) || !/^https:\/\/web-summit\.sgit\.ai\//.test(url)) { console.error(`make-qr: bad pair ${name}=${url}`); process.exit(2) }
}

const dispatch = "if (!commands[cmd]) die(`unknown command ${cmd}: node pki-agent.mjs help`)\nawait commands[cmd]()"
if (!source.includes(dispatch)) { console.error("make-qr: the tool's dispatch has changed; update make-qr.mjs"); process.exit(1) }
const ours = `
{
    const { codes, outDir } = JSON.parse(process.env.MAKE_QR_ARGS)
    const EC = 'M', QZ = 4, PNG = 1200
    for (const [name, url] of Object.entries(codes)) {
        const q = qrcode(0, EC); q.addData(url, 'Byte'); q.make()
        const n = q.getModuleCount(), size = n + QZ * 2, version = (n - 17) / 4
        let d = ''
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { if (!q.isDark(r, c)) continue; let run = 1; while (c + run < n && q.isDark(r, c + run)) run++; d += 'M' + (c + QZ) + ' ' + (r + QZ) + 'h' + run + 'v1h-' + run + 'z'; c += run - 1 }
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" width="' + size * 10 + '" height="' + size * 10 + '" shape-rendering="crispEdges">'
            + '<title>' + url + '</title><desc>QR code, version ' + version + ', error correction ' + EC + ', ' + n + ' x ' + n + ' modules plus a ' + QZ + '-module quiet zone (' + size + ' x ' + size + ' in all). Black on white; place at 100%, do not recolour or rasterise.</desc>'
            + '<rect width="' + size + '" height="' + size + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>\\n'
        // PNG: whole pixels per module, centred on a 1200 x 1200 white square (the extra pixels only widen the quiet zone)
        const px = Math.floor(PNG / size), off = Math.floor((PNG - size * px) / 2), lum = new Uint8Array(PNG * PNG).fill(255)
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) for (let y = 0; y < px; y++) { const row = off + (r + QZ) * px + y; lum.fill(0, row * PNG + off + (c + QZ) * px, row * PNG + off + (c + QZ + 1) * px) }
        const png = await QR.encodePng(lum, PNG, PNG, b => zlib.deflateSync(b))
        const back = QR.readQr((await QR.decodePng(png, b => zlib.inflateSync(b))).lum, PNG, PNG)
        if (back !== url) die(name + ': the PNG reads back as ' + JSON.stringify(back) + ', not ' + url + ': not written')
        fs.writeFileSync(path.join(outDir, 'qr-' + name + '.svg'), svg)
        fs.writeFileSync(path.join(outDir, 'qr-' + name + '.png'), png)
        say(name + ': ' + url + ' -> qr-' + name + '.svg, qr-' + name + '.png (version ' + version + ', EC ' + EC + ', ' + n + ' modules + ' + QZ + ' quiet zone, PNG ' + px + ' px a module; read back OK)')
    }
}`
const outDir = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'make-qr-')), 'pki-agent-qr.mjs')
fs.writeFileSync(tmp, source.replace(dispatch, ours))
process.env.MAKE_QR_ARGS = JSON.stringify({ codes, outDir })
try { await import(pathToFileURL(tmp).href) } finally { fs.rmSync(path.dirname(tmp), { recursive: true, force: true }) }
