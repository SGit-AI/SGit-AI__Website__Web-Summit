#!/usr/bin/env node
// The token guide: one landscape infographic, in plain words, on spending fewer tokens and getting
// Opus-like work from Sonnet 5.5. Writes guide/token-guide.png and guide/token-guide.pdf beside this file.
// Usage: node people/indi/accountant/guide.mjs   (needs Playwright with Chromium). By accountant@web-summit.indi.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const here = path.dirname(new URL(import.meta.url).pathname), dir = path.join(here, 'guide')
fs.mkdirSync(dir, { recursive: true })
const PAL = ['#cdefe3', '#e3ddf7', '#ffe1d0', '#d6ecfa', '#fff3c4', '#f9d9e3', '#e2f0d9'], EDGE = ['#7cc9ad', '#a99be0', '#f0a37f', '#86bde6', '#e5c75c', '#e597b0', '#9cc98a']

const save = [
  ['Start fresh', 'A new session for each job. A long chat re-reads its whole history at every step.'],
  ['Point, do not dump', 'Name the file and the lines. Never "read the whole repo".'],
  ['Say what done looks like', 'A clear finish line stops the agent wandering and re-checking.'],
  ['Ask for short answers', 'A fixed form, no narration, no restating the task.'],
  ['Fewer helpers', 'One helper with a tight brief beats five reading the same pages.'],
  ['Right size of model', 'Small model to sort, read or summarise. Big model to judge and decide.'],
]
const sonnet = [
  ['Hand it a plan', 'Let Opus 5.5 (or you) write the steps. Sonnet 5.5 follows them well.'],
  ['Let it think first', 'Ask it to plan before it answers, or raise its effort setting.'],
  ['Show a good example', 'One sample of the answer you want is worth a page of rules.'],
  ['Give it a checklist', 'Ask it to check its own work against the list before it stops.'],
  ['One job at a time', 'Split a big task into small, clear ones.'],
  ['Opus checks the end', 'A short final review by Opus costs little and catches the misses.'],
]
const list = (items, off) => items.map(([t, d], i) => `<li style="background:${PAL[(i + off) % 7]};border-color:${EDGE[(i + off) % 7]}"><span class="n" style="background:${EDGE[(i + off) % 7]}">${i + 1}</span><div><b>${t}</b><br>${d}</div></li>`).join('')

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Token guide</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&family=Nunito:wght@700;800&display=swap">
<style>
@page { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { width: 1600px; height: 1130px; padding: 36px 44px; font-family: Lexend, sans-serif; color: #3b3a4a; background: #fbfaf7; }
h1, h2, h3 { font-family: Nunito, sans-serif; margin: 0; color: #2f2d45; }
.head { display: flex; justify-content: space-between; align-items: flex-end; }
h1 { font-size: 46px; } .sub { font-size: 20px; color: #6d6a85; margin-top: 4px; }
.tag { font-size: 15px; color: #6d6a85; text-align: right; }
.grid { display: grid; grid-template-columns: 330px 1fr 1fr; gap: 26px; margin-top: 24px; }
.panel { border-radius: 26px; padding: 22px 22px; }
h2 { font-size: 27px; margin-bottom: 12px; }
.what { background: linear-gradient(160deg, #e3ddf7, #d6ecfa); }
.what p { font-size: 17px; line-height: 1.5; margin: 0 0 12px; }
.meter { display: grid; gap: 10px; margin-top: 6px; }
.m { background: #fff; border-radius: 16px; padding: 10px 14px; font-size: 15.5px; line-height: 1.4; }
.m b { font-family: Nunito; font-size: 19px; display: block; }
ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 11px; }
li { display: flex; gap: 14px; align-items: flex-start; border: 2px solid; border-radius: 18px; padding: 11px 15px; font-size: 16.5px; line-height: 1.4; }
li b { font-family: Nunito; font-size: 20px; color: #2f2d45; }
.n { flex: none; width: 36px; height: 36px; border-radius: 50%; color: #fff; font-family: Nunito; font-weight: 800; font-size: 19px; display: grid; place-items: center; }
.save { background: #f3faf6; } .son { background: #f6f3fc; }
.foot { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 26px; margin-top: 22px; }
.box { border-radius: 22px; padding: 16px 20px; font-size: 17px; line-height: 1.45; }
.box b { font-family: Nunito; font-size: 21px; display: block; color: #2f2d45; margin-bottom: 2px; }
</style></head><body>
<div class="head"><div><h1>Fewer tokens, better answers</h1><div class="sub">A plain guide for Indi's agents, and for anyone briefing one</div></div>
<div class="tag">Web Summit 2026 · token accountant<br>accountant@web-summit.indi · 4 November 2026</div></div>
<div class="grid">
<div class="panel what"><h2>What is a token?</h2>
<p>A small piece of text, about four letters. Every word an agent reads or writes is counted in tokens, like a taxi meter.</p>
<div class="meter">
<div class="m" style="border-left:8px solid #7cc9ad"><b>Reading</b>Your brief, files, pages. Paid in full.</div>
<div class="m" style="border-left:8px solid #f0a37f"><b>Writing</b>Its answers and its thinking. Paid in full.</div>
<div class="m" style="border-left:8px solid #a99be0"><b>Re-reading</b>The chat so far, read again at every step. About a tenth of the price, but in a long session it is the biggest pile.</div>
</div></div>
<div class="panel save"><h2>Six habits that save tokens</h2><ul>${list(save, 0)}</ul></div>
<div class="panel son"><h2>Get Opus-like work from Sonnet 5.5</h2><ul>${list(sonnet, 1)}</ul></div>
</div>
<div class="foot">
<div class="box" style="background:#fff3c4"><b>The simple rule</b>Sonnet 5.5 for doing. Opus 5.5 for deciding. Brief Sonnet like a new colleague: the goal, the steps, an example and a checklist.</div>
<div class="box" style="background:#cdefe3"><b>Test, do not guess</b>Run the same task on both models. Keep the cheaper one if it meets the bar.</div>
<div class="box" style="background:#f9d9e3"><b>Be honest about the gap</b>On clear, well-briefed tasks Sonnet comes close. On hard judgement calls, keep Opus.</div>
</div>
</body></html>`

const tmp = path.join(dir, 'token-guide.tmp.html')
fs.writeFileSync(tmp, html)
const { chromium } = createRequire(process.cwd() + '/')('playwright')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1130 }, deviceScaleFactor: 2 })
await page.goto('file://' + tmp, { waitUntil: 'networkidle' })
await page.screenshot({ path: path.join(dir, 'token-guide.png') })
await page.pdf({ path: path.join(dir, 'token-guide.pdf'), width: '1600px', height: '1130px', printBackground: true, pageRanges: '1' })
await browser.close(); fs.unlinkSync(tmp)
console.log('guide: ' + dir + '/token-guide.png and .pdf')
