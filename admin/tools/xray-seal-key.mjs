#!/usr/bin/env node
// X-Ray: seal the demo OpenRouter key with three words (dashboard@web-summit.silvio, at Dinis's word, 11 November 2026).
//   OPEN_ROUTER_KEY=... node admin/tools/xray-seal-key.mjs
// Reads the key from the environment only, picks three words from assets/cc/words-en.txt (BIP-39 English, 2048 words),
// derives an AES-256-GCM key with PBKDF2-SHA-256 (600,000 rounds) and writes data/xray/key.sealed.json. The words are
// printed once, to this terminal: give them to the team by voice or in person, never in a commit, a page or a message
// that also carries the sealed file. The command centre's X-Ray (assets/cc/xray.js, CHAVE) opens it with the words.
// The same sealing is in the page (CHAVE → "Criar três palavras") for a device that already holds the key.
import fs from 'node:fs'; import path from 'node:path'; import { webcrypto as crypto } from 'node:crypto'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..'), ROUNDS = 600000
const key = process.env.OPEN_ROUTER_KEY
if (!key) { console.error('xray-seal-key: OPEN_ROUTER_KEY is not set in this session'); process.exit(1) }
const list = fs.readFileSync(path.join(ROOT, 'assets/cc/words-en.txt'), 'utf8').split(/\s+/).filter(Boolean)
if (list.length !== 2048) { console.error('xray-seal-key: the word list should have 2048 words'); process.exit(1) }
// XRAY_PHRASE (optional): the team's own phrase, normalised as the page does (lower case, spaces collapsed); else three random words
const own = String(process.env.XRAY_PHRASE || '').toLowerCase().normalize('NFKC').trim().split(/\s+/).filter(Boolean).join(' ')
const pick = () => list[crypto.getRandomValues(new Uint32Array(1))[0] % list.length], words = own || [pick(), pick(), pick()].join(' ')
const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12))
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(words), 'PBKDF2', false, ['deriveKey'])
const k = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ROUNDS }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt'])
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(key)))
const b64 = u => Buffer.from(u).toString('base64')
const out = { v: 1, what: 'the X-Ray demo OpenRouter key, sealed with the team phrase', kdf: 'PBKDF2-SHA-256', rounds: ROUNDS, cipher: 'AES-256-GCM', phrase: own ? 'chosen by the team' : 'three BIP-39 English words (assets/cc/words-en.txt)', made: new Date().toISOString().slice(0, 10), salt: b64(salt), iv: b64(iv), ct: b64(ct) }
fs.mkdirSync(path.join(ROOT, 'data/xray'), { recursive: true }); fs.writeFileSync(path.join(ROOT, 'data/xray/key.sealed.json'), JSON.stringify(out, null, 1) + '\n')
console.log(own ? 'wrote data/xray/key.sealed.json, sealed with XRAY_PHRASE' : 'wrote data/xray/key.sealed.json\nthe three words (shown once, give them in person):\n\n    ' + words + '\n')
