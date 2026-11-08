// The Live AI Office's pixel art, drawn by code: one 16x24 character sheet per agent of Vicky's and one furniture sheet.
// Original work by dev@PrompTugal.vicky (8 November 2026), for people/vicky/office/; no third-party art, no copied
// code. Node standard library only (zlib for the PNG). Run from the repository root to redraw every PNG:
//   node people/vicky/office/make-sprites.mjs
// The output is the same on every run (no randomness, no clock), so a redraw changes nothing unless this file does.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sprites')

// ---- PNG (RGBA, 8 bits, no interlace) ----
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
const crc32 = b => { let c = 0xffffffff; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
const chunk = (type, data) => { const len = Buffer.alloc(4), crc = Buffer.alloc(4), td = Buffer.concat([Buffer.from(type), data]); len.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]) }
function png(w, h, px) {
    const raw = Buffer.alloc((w * 4 + 1) * h)
    for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4) }
    const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6
    return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}
class Img {
    constructor(w, h) { this.w = w; this.h = h; this.px = Buffer.alloc(w * h * 4) }
    set(x, y, c) { if (!c || x < 0 || y < 0 || x >= this.w || y >= this.h) return; const i = (y * this.w + x) * 4, v = parseInt(c.slice(1), 16); this.px[i] = v >> 16; this.px[i + 1] = (v >> 8) & 255; this.px[i + 2] = v & 255; this.px[i + 3] = 255 }
    get(x, y) { return x < 0 || y < 0 || x >= this.w || y >= this.h ? 0 : this.px[(y * this.w + x) * 4 + 3] }
    rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c) }
    // a dark outline around every opaque pixel, inside the frame [x0, x0 + fw), so a figure reads on light and dark floors
    outline(x0, fw, c = '#1d1b26') {
        const add = []
        for (let y = 0; y < this.h; y++) for (let x = x0; x < x0 + fw; x++) if (!this.get(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => x + dx >= x0 && x + dx < x0 + fw && this.get(x + dx, y + dy))) add.push([x, y])
        for (const [x, y] of add) this.set(x, y, c)
    }
    save(name) { fs.writeFileSync(path.join(OUT, name), png(this.w, this.h, this.px)) }
}

// ---- the characters: 8 frames of 16x24 (0-1 idle, 2-5 walk, 6-7 typing) ----
const SKIN = { a: ['#f6d2b8', '#e2b394'], b: ['#e3b48c', '#c9956b'], c: ['#b97d52', '#9c6440'], d: ['#7b4f32', '#643d25'] }
const darker = (c, f = 0.72) => '#' + [1, 3, 5].map(i => Math.round(parseInt(c.slice(i, i + 2), 16) * f).toString(16).padStart(2, '0')).join('')
// one row per agent of Vicky's (people/vicky/agents.json), each a different person: skin, hair (colour, style), clothes, a prop
const PEOPLE = {
    conductor:                { skin: 'b', hair: '#3b2a20', style: 'short', shirt: '#2f5d9c', legs: '#2b2d3a', prop: 'baton' },
    dashboard:                { skin: 'a', hair: '#c8873a', style: 'bob', shirt: '#2f8f83', legs: '#3a3346', prop: 'tablet' },
    pm:                       { skin: 'c', hair: '#1f1a17', style: 'bun', shirt: '#8a4fb0', legs: '#2b2d3a', prop: 'clipboard' },
    scout:                    { skin: 'a', hair: '#7a4b2a', style: 'cap', shirt: '#5f7d3a', legs: '#4a3a2a', prop: 'binoculars', cap: '#c9762e' },
    logistics:                { skin: 'd', hair: '#141210', style: 'short', shirt: '#c9762e', legs: '#33363f', prop: 'box' },
    researcher:               { skin: 'b', hair: '#5a3a26', style: 'long', shirt: '#3f6fb5', legs: '#2b2d3a', prop: 'magnifier', glasses: true },
    curator:                  { skin: 'c', hair: '#2a211c', style: 'curly', shirt: '#b5486a', legs: '#2f3140', prop: 'cards' },
    programme:                { skin: 'a', hair: '#e2c26b', style: 'pony', shirt: '#3d8f5a', legs: '#2b2d3a', prop: 'calendar' },
    journalist:               { skin: 'b', hair: '#241c18', style: 'short', shirt: '#d1d3d8', legs: '#2b3a5a', prop: 'notebook', tie: '#b23a3a' },
    'journalist-portugal':    { skin: 'c', hair: '#3a2418', style: 'long', shirt: '#2e7d4f', legs: '#5a2a2a', prop: 'notebook', scarf: '#c23b2f' },
    'journalist-europe':      { skin: 'a', hair: '#9b5a2e', style: 'spiky', shirt: '#2a4c9e', legs: '#2b2d3a', prop: 'notebook', badge: '#f2c230' },
    'journalist-ai':          { skin: 'd', hair: '#101010', style: 'afro', shirt: '#5b5f6b', legs: '#262833', prop: 'notebook', headset: true },
    'journalist-connections': { skin: 'b', hair: '#6b2e4a', style: 'bob', shirt: '#e0a23a', legs: '#2f3140', prop: 'notebook', glasses: true },
    reviewer:                 { skin: 'a', hair: '#b9b4ab', style: 'short', shirt: '#6d4c9f', legs: '#2b2d3a', prop: 'pen', glasses: true },
    checker:                  { skin: 'c', hair: '#1b1512', style: 'bun', shirt: '#1f7a8c', legs: '#3a3346', prop: 'magnifier' },
    designer:                 { skin: 'b', hair: '#d0567a', style: 'pony', shirt: '#2b2b2b', legs: '#4a4f63', prop: 'brush', beret: '#c23b2f' },
    dev:                      { skin: 'a', hair: '#2b2018', style: 'spiky', shirt: '#3b3f4a', legs: '#2b4a6a', prop: 'laptop', hoodie: true },
    inbox:                    { skin: 'd', hair: '#2a1b12', style: 'curly', shirt: '#4d7fc4', legs: '#2b2d3a', prop: 'letter' },
    vault:                    { skin: 'b', hair: '#3a3a3a', style: 'cap', shirt: '#7a6a3a', legs: '#2b2d3a', prop: 'key', cap: '#4a4f63' },
}

function person(img, ox, p, frame) {
    const [sk, skd] = SKIN[p.skin], hair = p.hair, sh = p.shirt, shd = darker(sh), lg = p.legs, shoe = '#24212c'
    const bob = frame === 1 ? 1 : 0                               // idle: a breath, the upper body one pixel down
    const walk = frame >= 2 && frame <= 5 ? frame - 2 : -1
    const typing = frame >= 6
    const R = (x, y, w, h, c) => img.rect(ox + x, y, w, h, c), S = (x, y, c) => img.set(ox + x, y, c)
    // legs and shoes (walk: one leg lifted on frames 1 and 3)
    const lift = walk === 1 ? 'l' : walk === 3 ? 'r' : ''
    R(5, 18, 3, lift === 'l' ? 3 : 4, lg); R(8, 18, 3, lift === 'r' ? 3 : 4, lg)
    R(5, lift === 'l' ? 21 : 22, 3, 1, shoe); R(8, lift === 'r' ? 21 : 22, 3, 1, shoe)
    R(4, lift === 'l' ? 21 : 22, 1, 1, shoe); R(11, lift === 'r' ? 21 : 22, 1, 1, shoe)
    const y0 = bob
    // torso
    R(4, 11 + y0, 8, 7, sh); R(4, 17 + y0, 8, 1, shd)
    if (p.hoodie) { R(5, 11 + y0, 6, 1, shd); S(6, 13 + y0, '#d8d8d8'); S(9, 13 + y0, '#d8d8d8') }
    if (p.tie) { R(7, 11 + y0, 2, 5, p.tie); S(7, 16 + y0, darker(p.tie)) }
    if (p.scarf) R(5, 11 + y0, 6, 2, p.scarf)
    if (p.badge) R(9, 13 + y0, 2, 2, p.badge)
    // arms and hands: down and swinging when walking, forward on the keys when typing
    if (typing) {
        const up = frame === 7 ? 1 : 0
        R(3, 11 + y0, 1, 4, shd); R(12, 11 + y0, 1, 4, shd)
        R(4, 15 + y0 - up, 2, 1, sk); R(10, 15 + y0 - (1 - up), 2, 1, sk)
    } else {
        const sw = walk === 0 ? 1 : walk === 2 ? -1 : 0
        R(3, 11 + y0 + Math.max(0, sw), 1, 5, shd); R(12, 11 + y0 + Math.max(0, -sw), 1, 5, shd)
        S(3, 16 + y0 + Math.max(0, sw), sk); S(12, 16 + y0 + Math.max(0, -sw), sk)
        prop(img, ox, p, y0, sw)
    }
    // neck and head
    R(7, 10 + y0, 2, 1, skd)
    R(5, 3 + y0, 6, 7, sk); S(4, 6 + y0, sk); S(11, 6 + y0, sk)   // ears
    S(6, 6 + y0, '#1d1b26'); S(9, 6 + y0, '#1d1b26')             // eyes
    R(7, 8 + y0, 2, 1, skd)                                       // mouth
    if (p.glasses) { R(5, 6 + y0, 2, 1, '#1d1b26'); R(9, 6 + y0, 2, 1, '#1d1b26'); S(7, 6 + y0, '#1d1b26'); S(8, 6 + y0, '#1d1b26'); S(5, 6 + y0, '#9fd3e6'); S(10, 6 + y0, '#9fd3e6') }
    hairdo(img, ox, p, y0, hair)
    if (p.headset) { R(4, 4 + y0, 1, 4, '#3a3a3a'); R(11, 4 + y0, 1, 4, '#3a3a3a'); R(5, 2 + y0, 6, 1, '#3a3a3a'); S(10, 8 + y0, '#3a3a3a'); S(9, 8 + y0, '#e05a5a') }
}

function hairdo(img, ox, p, y0, h) {
    const R = (x, y, w, hh, c) => img.rect(ox + x, y + y0, w, hh, c), hd = darker(h, 0.8)
    switch (p.style) {
        case 'short': R(5, 2, 6, 2, h); R(4, 3, 1, 3, h); R(11, 3, 1, 3, h); R(5, 4, 2, 1, hd); break
        case 'bob': R(4, 2, 8, 3, h); R(4, 5, 1, 4, h); R(11, 5, 1, 4, h); R(6, 4, 4, 1, hd); break
        case 'long': R(5, 2, 6, 2, h); R(4, 3, 1, 9, h); R(11, 3, 1, 9, h); R(5, 4, 1, 1, h); R(10, 4, 1, 1, h); break
        case 'bun': R(6, 0, 4, 2, h); R(5, 2, 6, 2, h); R(4, 3, 1, 3, h); R(11, 3, 1, 3, h); R(7, 0, 2, 1, hd); break
        case 'pony': R(5, 2, 6, 2, h); R(4, 3, 1, 3, h); R(11, 3, 1, 4, h); R(12, 4, 2, 5, h); R(12, 4, 1, 1, hd); break
        case 'curly': for (let i = 0; i < 8; i++) R(4 + i, 1 + (i % 2), 1, 3, h); R(4, 4, 1, 3, h); R(11, 4, 1, 3, h); R(6, 3, 1, 1, hd); R(9, 3, 1, 1, hd); break
        case 'spiky': R(5, 2, 6, 2, h); R(5, 1, 1, 1, h); R(7, 0, 1, 2, h); R(9, 1, 1, 1, h); R(4, 3, 1, 2, h); R(11, 3, 1, 2, h); break
        case 'afro': R(3, 0, 10, 4, h); R(3, 4, 2, 4, h); R(11, 4, 2, 4, h); R(5, 1, 2, 1, hd); R(9, 2, 2, 1, hd); break
        case 'cap': { const c = p.cap || '#333'; R(4, 4, 1, 2, h); R(11, 4, 1, 2, h); R(5, 1, 6, 3, c); R(4, 3, 9, 1, darker(c)); break }
    }
    if (p.beret) { R(4, 1, 7, 2, p.beret); R(6, 0, 3, 1, p.beret); img.set(ox + 8, y0 - 1 < 0 ? 0 : y0, darker(p.beret)) }
}

function prop(img, ox, p, y0, sw) {
    const R = (x, y, w, h, c) => img.rect(ox + x, y + y0, w, h, c), hy = 15 + Math.max(0, -sw)   // the right hand's row
    switch (p.prop) {
        case 'baton': R(13, hy - 4, 1, 4, '#e8e2d0'); break
        case 'tablet': R(12, hy - 1, 3, 4, '#2a2d36'); R(13, hy, 1, 2, '#6fc3d8'); break
        case 'clipboard': R(12, hy - 1, 3, 4, '#a0743c'); R(13, hy, 1, 2, '#f4f1e6'); break
        case 'binoculars': R(12, hy - 1, 3, 2, '#2a2a2a'); break
        case 'box': R(12, hy - 1, 4, 3, '#b8874a'); R(12, hy - 1, 4, 1, '#9a6d36'); break
        case 'magnifier': R(13, hy - 3, 2, 2, '#9fd3e6'); img.set(ox + 13, hy + y0 - 1, '#7a5a3a'); break
        case 'cards': R(12, hy - 1, 3, 3, '#f4f1e6'); img.set(ox + 13, hy + y0, '#b5486a'); break
        case 'calendar': R(12, hy - 1, 3, 3, '#f4f1e6'); R(12, hy - 1, 3, 1, '#c23b2f'); break
        case 'notebook': R(12, hy - 1, 3, 3, '#f2c230'); R(12, hy - 1, 1, 3, '#a8841a'); break
        case 'pen': R(13, hy - 3, 1, 3, '#c23b2f'); break
        case 'brush': R(13, hy - 4, 1, 4, '#a0743c'); img.set(ox + 13, hy + y0 - 5, '#2f8f83'); break
        case 'laptop': R(11, hy - 1, 5, 3, '#9aa0aa'); R(12, hy, 3, 1, '#6fc3d8'); break
        case 'letter': R(12, hy - 1, 4, 3, '#f4f1e6'); img.set(ox + 13, hy + y0, '#c23b2f'); img.set(ox + 14, hy + y0, '#c23b2f'); break
        case 'key': R(13, hy - 2, 2, 2, '#f2c230'); img.set(ox + 13, hy + y0, '#f2c230'); break
    }
}

// ---- the furniture: one sheet, 16 px tiles; the frames' places are in office.js (FURN) ----
function furniture() {
    const img = new Img(16 * 12, 24)
    const R = (x, y, w, h, c) => img.rect(x, y, w, h, c)
    // 0: desk, 24x14 at (0,10), seen from the front, a monitor's back and a keyboard edge on it
    R(0, 12, 24, 3, '#a8784a'); R(0, 15, 24, 1, '#8a5f38'); R(1, 16, 2, 8, '#7a522f'); R(21, 16, 2, 8, '#7a522f'); R(3, 16, 18, 4, '#946538')
    R(7, 4, 10, 7, '#3a3f4b'); R(8, 5, 8, 5, '#4a5160'); R(11, 11, 2, 1, '#3a3f4b'); R(9, 11, 6, 1, '#2e323c'); R(4, 11, 3, 1, '#d8d4c8')
    // 24: a chair back (24..39)
    R(27, 14, 10, 6, '#4a5a7a'); R(28, 15, 8, 4, '#5a6d93'); R(31, 20, 2, 3, '#2e323c'); R(28, 23, 8, 1, '#2e323c')
    // 40: a plant (40..55)
    R(44, 17, 8, 7, '#b5603a'); R(45, 17, 6, 1, '#cf7a50'); R(47, 8, 2, 9, '#2f7a3a'); R(43, 9, 4, 3, '#3d9a4a'); R(49, 7, 4, 3, '#3d9a4a'); R(44, 12, 3, 3, '#2f7a3a'); R(49, 12, 4, 3, '#3d9a4a'); R(46, 5, 3, 3, '#4fb05a')
    // 56: a sofa, 32 wide (56..87)
    R(56, 10, 32, 6, '#3f6f8f'); R(56, 16, 32, 6, '#4f84a8'); R(56, 12, 3, 10, '#355f7a'); R(85, 12, 3, 10, '#355f7a'); R(58, 22, 2, 2, '#2e323c'); R(84, 22, 2, 2, '#2e323c'); R(71, 16, 1, 6, '#3f6f8f')
    // 88: a coffee machine (88..103)
    R(90, 4, 12, 18, '#5a5f6b'); R(91, 5, 10, 5, '#3a3f4b'); R(92, 6, 3, 2, '#e05a5a'); R(96, 6, 4, 2, '#6fc3d8'); R(94, 12, 4, 2, '#2e323c'); R(94, 17, 4, 3, '#f4f1e6'); R(89, 22, 14, 2, '#3a3f4b')
    // 104: a bookshelf (104..119)
    R(104, 0, 16, 24, '#7a522f'); R(105, 1, 14, 22, '#5a3c22'); for (const y of [7, 15]) R(105, y, 14, 1, '#7a522f')
    ;[['#c23b2f', 106, 2], ['#2f5d9c', 108, 3], ['#f2c230', 111, 2], ['#3d8f5a', 114, 3], ['#8a4fb0', 106, 10], ['#c9762e', 109, 11], ['#2f8f83', 113, 9], ['#d1d3d8', 106, 17], ['#b5486a', 110, 18], ['#2f5d9c', 115, 17]].forEach(([c, x, y]) => R(x, y, 2, (y < 8 ? 7 : y < 16 ? 15 : 23) - y, c))
    // 120: a whiteboard, 32 wide (120..151)
    R(120, 2, 32, 18, '#8a8f99'); R(121, 3, 30, 16, '#f4f6f8'); R(124, 6, 12, 1, '#2f5d9c'); R(124, 9, 18, 1, '#c23b2f'); R(124, 12, 9, 1, '#2f8f83'); R(140, 13, 7, 4, '#f2c230'); R(126, 20, 2, 4, '#5a5f6b'); R(144, 20, 2, 4, '#5a5f6b')
    // 152: a stack of boxes (152..167)
    R(153, 12, 13, 12, '#b8874a'); R(153, 17, 13, 1, '#9a6d36'); R(155, 4, 10, 8, '#c99a5a'); R(159, 4, 2, 8, '#e0c08a'); R(159, 12, 2, 5, '#e0c08a')
    // 168: a mail tray and a door, the on-demand corner (168..191)
    R(170, 14, 12, 6, '#5a5f6b'); R(171, 12, 10, 3, '#f4f1e6'); R(172, 10, 8, 3, '#e8e2d0'); R(170, 20, 12, 1, '#3a3f4b'); R(184, 0, 8, 24, '#7a522f'); R(185, 1, 6, 22, '#946538'); img.set(189, 12, '#f2c230')
    img.outline(0, img.w, '#2a2530')
    img.save('furniture.png')
}

fs.mkdirSync(OUT, { recursive: true })
for (const [name, p] of Object.entries(PEOPLE)) {
    const img = new Img(16 * 8, 24)
    for (let f = 0; f < 8; f++) person(img, f * 16, p, f)
    for (let f = 0; f < 8; f++) img.outline(f * 16, 16)
    img.save(`${name}.png`)
}
furniture()
console.log(`drawn: ${Object.keys(PEOPLE).length} characters and the furniture, in ${path.relative(process.cwd(), OUT)}/`)
