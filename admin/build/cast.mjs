// The cast: every agent and every person on the team, drawn from one construction, from data/cast.json.
// Ported from The Ultimate Insider's lab/characters/make_cast.py (designer@book.the-ultimate-insider,
// SGit-AI/SGit-AI__Website__Book__The-Ultimate-Insider, Apache-2.0): the same small robot, one colour, one
// thing on the head and one in the hand, four moods carried by the face. Additions here:
//   - an agent wears a lanyard in its person's colour: dev@web-summit.dinis carries Dinis's colour, so whose
//     agent it is reads at a glance (the naming rule <agent>@web-summit.<person>, drawn);
//   - a person is not a robot. Four ways to draw one (HUMAN_STYLES), for Dinis to choose; the book's rule
//     holds in all of them: no likeness guessed, no photograph, face, hair or skin invented.
// One SVG unit is a millimetre at scale 1; a figure is a 40 x 50 box. No text inside a figure.

export const INK = '#1f2933', MUTED = '#5b6670', FILL = '#eef2f6', FILL2 = '#d5dce4', ACCENT = '#b0481a', PAPER = '#ffffff'
const SW = 0.7
export const MOODS = ['happy', 'worried', 'stressed', 'unhappy']

const f2 = n => (+n).toFixed(2)
const line = (x1, y1, x2, y2, c = INK, w = SW) => `<line x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`
const path = (d, fill = 'none', c = INK, w = SW) => `<path d="${d}" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`
const rect = (x, y, w, h, rx, fill, c = INK, sw = SW) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${c}" stroke-width="${sw}"/>`
const circle = (cx, cy, r, fill, c = INK, sw = SW) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${c}" stroke-width="${sw}"/>`

// the face on a screen (or a round head), centred on (20, 18)
function face(mood) {
    const dot = (x, y) => `<circle cx="${x}" cy="${y}" r=".9" fill="${INK}"/>`
    if (mood === 'happy') return dot(17, 18) + dot(23, 18) + path('M17.4 21.3 Q20 23.9 22.6 21.3')
    if (mood === 'worried') return dot(17, 18.3) + dot(23, 18.3) + path('M15.6 16.2 L18.2 15.2') + path('M24.4 16.2 L21.8 15.2') + path('M17.4 22.2 q1.3 -1 2.6 0 t2.6 0')
    if (mood === 'stressed') return [17, 23].map(x => circle(x, 18.2, 1.35, PAPER, INK, .45) + `<circle cx="${x}" cy="18.2" r=".5" fill="${INK}"/>`).join('')
        + path('M15.6 15.2 L18.3 16.1') + path('M24.4 15.2 L21.7 16.1') + path('M16.8 22.3 l1.1 -.8 l1.1 .8 l1.1 -.8 l1.1 .8 l1.1 -.8')
    return path('M16.1 18.4 h1.8') + path('M22.1 18.4 h1.8') + path('M17.4 22.7 Q20 20.6 22.6 22.7')
}
const hand = (cx, cy, len, deg, c, w) => { const a = (deg - 90) * Math.PI / 180; return line(cx, cy, cx + len * Math.cos(a), cy + len * Math.sin(a), c, w) }
const CLOCK = { happy: [-60, 60], worried: [240, 120], stressed: [180, 175], unhappy: [210, 150] }
function clockFace(mood) {
    const [h, m] = CLOCK[mood]
    const ticks = [0, 90, 180, 270].map(a => `<circle cx="${f2(20 + 4.9 * Math.cos(a * Math.PI / 180))}" cy="${f2(18 + 4.9 * Math.sin(a * Math.PI / 180))}" r=".35" fill="${INK}"/>`).join('')
    return circle(20, 18, 6, PAPER, INK, .6) + ticks + hand(20, 18, 3.2, h, INK, .9) + hand(20, 18, 4.6, m, ACCENT, .7)
}

// on the head: the book's seven, and the summit team's own
const HEAD = {
    none: () => '',
    antenna: () => line(20, 10, 20, 6.4) + `<circle cx="20" cy="5.2" r="1.6" fill="${ACCENT}"/>`,
    'wavy-hair': c => path('M10.6 11.6 q2.4 -4.4 4.8 -.6 q2.4 -4.2 4.8 -.4 q2.4 -4.2 4.8 -.4 q2.2 -3.4 4.4 .8', c, INK, .5),
    'hard-hat': c => path('M11.2 11.4 a8.8 6.4 0 0 1 17.6 0 z', c, INK, .5) + line(8.6, 11.4, 31.4, 11.4, INK, 1.1),
    beret: c => `<ellipse cx="18.6" cy="9.9" rx="8.6" ry="2.7" fill="${c}" stroke="${INK}" stroke-width=".5"/>` + line(18.6, 7.2, 18.9, 5.9, INK, .9),
    'cap-backwards': c => path('M11.4 11.2 a8.6 5.6 0 0 1 17.2 0 z', c, INK, .5) + path('M11.6 11.2 h-4.6 q-.6 -1.4 .8 -1.4 h3.8', c, INK, .5),
    headband: c => rect(9.6, 12.2, 20.8, 1.9, 0, c, INK, .4) + path('M30.4 13.2 l2.4 -1.6 M30.4 13.4 l2.6 .8', 'none', c, .7),
    headphones: c => path('M9.4 16.4 Q9.4 5.6 20 5.6 Q30.6 5.6 30.6 16.4', 'none', INK, .9) + rect(7.2, 14.2, 3.2, 6.6, 1.2, c, INK, .5) + rect(29.6, 14.2, 3.2, 6.6, 1.2, c, INK, .5),
    // the summit's own
    fedora: c => path('M13 10.6 q0 -4.6 7 -4.6 q7 0 7 4.6 z', c, INK, .5) + line(8.8, 10.8, 31.2, 10.8, INK, 1.1) + rect(22.4, 6.8, 3.4, 2.4, .3, PAPER, INK, .35),
    'heart-antenna': () => line(20, 10, 20, 6.8) + path('M20 6.6 l-1.9 -1.9 a1.1 1.1 0 0 1 1.9 -1.4 a1.1 1.1 0 0 1 1.9 1.4 z', ACCENT, INK, .4),
    helmet: c => path('M10.4 13 a9.6 7.6 0 0 1 19.2 0 z', c, INK, .5) + line(20, 5.4, 20, 13, INK, .5),
    'mortarboard': c => path('M10 8.4 L20 5 L30 8.4 L20 11.8 z', c, INK, .45) + line(27.6, 8, 28.4, 12, INK, .5),
    crown: c => path('M12.4 10.6 l1 -4.4 l3.2 2.6 l3.4 -3.6 l3.4 3.6 l3.2 -2.6 l1 4.4 z', c, INK, .45),
    'visor': c => rect(10.4, 10.6, 19.2, 2.2, 1, c, INK, .45) + path('M10.4 12.4 q9.6 3.2 19.2 0', 'none', INK, .4),
    'glasses-on-head': c => [16.4, 23.6].map(x => circle(x, 9.2, 2, 'none', c, .7)).join('') + line(18.4, 9.2, 21.6, 9.2, c, .6),
}
// in the right hand (about 32, 34), a few in the left
const HAND = {
    none: () => '',
    baton: () => line(32, 34, 36.2, 27.4) + line(36.2, 27.4, 38.6, 23.6, ACCENT, .9),
    book: () => path('M2.6 33.6 l3.6 -1.2 l3.6 1.2 v4.6 l-3.6 -1.2 l-3.6 1.2 z', PAPER, INK, .5) + line(6.2, 32.4, 6.2, 37, INK, .4),
    magnifier: () => line(32, 34, 34.4, 30.8, INK, 1) + circle(35.9, 28.6, 2.7, FILL, INK, .7),
    slide: c => line(32, 34, 34.4, 26.6, INK, .6) + rect(30.4, 19.8, 8.6, 6.8, .6, PAPER, INK, .55) + `<rect x="31.6" y="21.2" width="5.4" height="1.2" fill="${c}"/>` + line(31.6, 23.6, 37.6, 23.6, MUTED, .5) + line(31.6, 25, 36, 25, MUTED, .5),
    spanner: () => line(32, 34, 36.6, 28.2, INK, 1.1) + path('M35.4 27.2 a1.9 1.9 0 1 1 2.6 2.2 l-.9 -.9 l.8 -.8 z', FILL2, INK, .5),
    pencil: c => `<g transform="rotate(-38 32 34)">${rect(31.2, 24.6, 1.8, 9.4, 0, c, INK, .4)}${path('M31.2 24.6 L32.1 22.4 L33 24.6 z', '#e8c9a0', INK, .4)}</g>`,
    stopwatch: c => circle(35.4, 31.4, 2.9, PAPER, INK, .6) + `<rect x="34.8" y="27.4" width="1.2" height="1.1" fill="${INK}"/>` + line(35.4, 31.4, 36.6, 29.9, c, .6),
    // the summit's own
    notepad: () => rect(31, 27.6, 6.6, 8.4, .5, PAPER, INK, .5) + line(31, 28.8, 37.6, 28.8, INK, .5) + line(32.2, 31, 36.4, 31, MUTED, .4) + line(32.2, 32.6, 36.4, 32.6, MUTED, .4) + line(32.2, 34.2, 35, 34.2, MUTED, .4),
    clipboard: c => rect(30.8, 27, 7.4, 9.4, .6, FILL2, INK, .5) + rect(32.8, 26.2, 3.4, 1.6, .4, c, INK, .35) + path('M32.4 30.6 l1 1 l1.8 -2', 'none', INK, .45) + line(32.4, 33.6, 36.6, 33.6, MUTED, .4),
    shield: c => path('M35 26.4 l4 1.4 v3.4 q0 3.4 -4 5.2 q-4 -1.8 -4 -5.2 v-3.4 z', c, INK, .5) + path('M33.4 31.2 l1.2 1.2 l2.2 -2.4', 'none', PAPER, .6),
    map: () => rect(30.6, 22.4, 8.8, 7.4, .4, PAPER, INK, .5) + path('M31.6 28.6 L34 26 L35.6 27 L38.4 23.6', 'none', ACCENT, .5) + line(32, 34, 33.4, 29.8, INK, .6),
    chart: c => rect(30.4, 24.4, 8.8, 7.6, .5, PAPER, INK, .5) + `<rect x="31.6" y="28.4" width="1.6" height="2.8" fill="${c}"/><rect x="34" y="26.6" width="1.6" height="4.6" fill="${c}"/><rect x="36.4" y="25.4" width="1.6" height="5.8" fill="${ACCENT}"/>` + line(32, 34, 33, 32, INK, .6),
    envelope: c => rect(30.6, 28.4, 8, 5.6, .4, PAPER, INK, .5) + path('M30.8 28.6 L34.6 31.6 L38.4 28.6', 'none', c, .5),
    scroll: c => rect(31.2, 25.6, 6.4, 9, .4, PAPER, INK, .5) + rect(30.4, 24.8, 8, 1.6, .8, FILL2, INK, .4) + rect(30.4, 34.2, 8, 1.6, .8, FILL2, INK, .4) + path('M32.4 29.6 l1.2 1.2 l2.6 -2.6', 'none', c, .6),
    quill: c => path('M32 34 Q36 28 39.2 21.6 Q35 25 32 34 z', c, INK, .45) + line(32, 34, 31.2, 35.6, INK, .6),
    vault: c => rect(30.6, 27, 8, 8, 1, FILL2, INK, .55) + circle(34.6, 31, 2, PAPER, INK, .45) + line(34.6, 31, 35.8, 29.8, c, .6),
    key: c => circle(36.4, 27.6, 1.9, 'none', c, .9) + line(35.2, 29.2, 32.6, 33.2, c, .9) + line(33.4, 32, 34.6, 32.8, c, .7),
}

const ARMS_LEGS = line(12, 31, 7, 36.6) + line(28, 31, 32, 34) + line(16, 42, 15.4, 47.4) + line(24, 42, 24.6, 47.4) + line(13.6, 47.8, 17, 47.8) + line(23, 47.8, 26.4, 47.8)

// an agent: the book's robot, its colour, its head and hand, and a lanyard in its person's colour
export function agentFigure(a, personColour, mood = 'happy') {
    const screen = a.head === 'clock' ? clockFace(mood) : face(mood)
    const head = a.head === 'clock' ? HEAD.antenna() : (HEAD[a.head] || HEAD.none)(a.colour)
    const glasses = a.glasses ? [17, 23].map(x => circle(x, 18.2, 2.3, 'none', INK, .55)).join('') + line(19.3, 18, 20.7, 18, INK, .5) : ''
    const lanyard = personColour ? line(16, 28.2, 20, 33.4, personColour, .8) + line(24, 28.2, 20, 33.4, personColour, .8) + rect(18.2, 33.2, 3.6, 4.6, .5, personColour, INK, .4) + rect(18.9, 34.2, 2.2, 1, .2, PAPER, 'none', 0) : ''
    const sweat = mood === 'stressed' ? path('M30.6 9.6 q-1.5 2.2 0 3 q1.5 -.8 0 -3', '#bcd3e6', INK, .4) : ''
    return ARMS_LEGS + rect(12, 28, 16, 14, 3, a.colour) + lanyard + rect(10, 10, 20, 16, 3.2, FILL) + screen + glasses + head + (HAND[a.hand] || HAND.none)(a.colour) + sweat
}

// a person, in one of four styles; colour is theirs (the merch colour), hand is what they hold
export const HUMAN_STYLES = {
    round: 'A round head on the cast\'s body: the book\'s own rule for its one human (the editor). Agents have a screen, people have a face; same family, a different shape.',
    keyholder: 'The round head, holding the key: every agent\'s key is linked to its person\'s key, so the person is the one who holds it. No hand-prop of a job: the job belongs to the agents.',
    ring: 'Not drawn as a person at all: a ring in their colour, the agents\' heads around it. The human as the centre of their own team; it reads at 24 pixels, where a figure does not.',
    screen: 'One of the team: the same screen head as the agents, with their colour as the body and no lanyard (they are nobody\'s agent). The book\'s option F for its editor.',
}
export function humanFigure(p, style = 'round', mood = 'happy', agents = []) {
    if (style === 'ring') return ringBadge(p, agents)
    const collar = path('M17.2 28.2 L20 32.6 L22.8 28.2', PAPER, INK, .45)
    const body = rect(12, 28, 16, 14, 3, p.colour) + collar
    if (style === 'screen') return ARMS_LEGS + body + rect(10, 10, 20, 16, 3.2, FILL) + face(mood) + (HAND[p.hand] || HAND.none)(ACCENT)
    const head = circle(20, 18, 8.6, FILL) + `<g transform="translate(0 .2)">${face(mood)}</g>`
    const held = style === 'keyholder' ? HAND.key(ACCENT) : (HAND[p.hand] || HAND.none)(p.colour)
    return ARMS_LEGS + body + head + held
}
// the ring: the person's colour, their initial is left out on purpose (no text in a figure); their agents' heads around it
function ringBadge(p, agents) {
    const n = Math.max(agents.length, 1), out = [circle(20, 25, 9.4, p.colour, INK, .8), circle(20, 25, 5.6, PAPER, INK, .5), `<circle cx="20" cy="25" r="2.2" fill="${p.colour}"/>`]
    agents.slice(0, 8).forEach((a, i) => {
        const ang = -Math.PI / 2 + i * 2 * Math.PI / Math.min(n, 8), x = 20 + 15 * Math.cos(ang), y = 25 + 15 * Math.sin(ang)
        out.push(`<g transform="translate(${f2(x - 4)} ${f2(y - 3.6)}) scale(.4)">${rect(0, 0, 20, 16, 3.2, a.colour, INK, 1.4)}<circle cx="7" cy="8" r="1.4" fill="${INK}"/><circle cx="13" cy="8" r="1.4" fill="${INK}"/></g>`)
    })
    return out.join('')
}

export const svg = (body, label, w = 40, h = 50) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}" role="img" aria-label="${label.replace(/"/g, '&quot;')}">${body}</svg>\n`

// a small round icon: the head alone, for lists and the person bar (a 24 x 24 box)
export function headIcon(member, kind, personColour) {
    if (kind === 'human') return `<circle cx="12" cy="12" r="11" fill="${member.colour}"/>` + `<g transform="translate(-8 -6) scale(1)">${circle(20, 18, 7.2, FILL, INK, .7)}${face('happy')}</g>`
    const ring = personColour ? `<circle cx="12" cy="12" r="11" fill="${personColour}"/>` : `<circle cx="12" cy="12" r="11" fill="${FILL2}"/>`
    return ring + `<g transform="translate(4 5.6) scale(.8)">${rect(0, 0, 20, 16, 3.2, FILL, INK, .9)}<g transform="translate(-10 -10)">${member.head === 'clock' ? clockFace('happy') : face('happy')}</g></g>`
}
