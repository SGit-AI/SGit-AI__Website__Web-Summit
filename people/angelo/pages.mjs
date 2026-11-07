// Angelo's own extra pages (the hook in admin/build/build.mjs: build(ROOT) -> [{rel, title, description, body, md, head?}]).
// Kept by writer@PrompTugal.angelo (WS-125, Angelo, 7 November 2026: "I want all interactivity to be back").
//
// people/angelo/guide/index.html: the agent setup guide, interactive (the audience switch, the two questionnaires, the
// dial, the product picker). Its one source is people/angelo/proposals/WS-125/agent-setup-guide.fragment (kept by
// dev@PrompTugal.angelo, re-synced with the published article); this file only places it in the site's page.
// The fragment's styles were written for a page of their own, so each selector is scoped to the wrapper .asg here,
// and the font stylesheet goes in the head. The text version, signed, is the article on PrompTugal.news.
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'people/angelo/proposals/WS-125/agent-setup-guide.fragment'
export const ARTICLE = 'https://promptugal.news/articles/agent-setup-guide.html'

// prefix every selector with .asg; :root and body become .asg itself; @media recurses; @keyframes is left alone
function scope(css) {
    css = css.replace(/\/\*[\s\S]*?\*\//g, '')
    let out = '', i = 0
    while (i < css.length) {
        const open = css.indexOf('{', i)
        if (open < 0) { out += css.slice(i); break }
        const head = css.slice(i, open).trim()
        let depth = 1, j = open + 1
        while (j < css.length && depth) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++ }
        const inner = css.slice(open + 1, j - 1)
        if (/^@media|^@supports/.test(head)) out += `${head}{${scope(inner)}}\n`
        else if (/^@/.test(head)) out += `${head}{${inner}}\n`
        else out += head.split(',').map(s => one(s.trim())).join(',') + `{${inner}}\n`
        i = j
    }
    return out
}
function one(s) {
    // :root, :root[data-theme=...], :root:not(...) keep their root part and then point at .asg
    const root = s.match(/^:root((?:\[[^\]]*\]|:not\([^)]*\))*)(.*)$/)
    if (root) return `:root${root[1]} .asg${root[2]}`.replace(/^:root \.asg$/, '.asg')
    const body = s.match(/^body((?:\[[^\]]*\])*)(::?[a-z-]+)?(.*)$/)
    if (body) return body[1] ? `body${body[1]} .asg${body[2] || ''}${body[3]}` : `.asg${body[2] || ''}${body[3]}`
    return `.asg ${s}`
}

export function build(ROOT) {
    const f = path.join(ROOT, SRC)
    if (!fs.existsSync(f)) return []
    const raw = fs.readFileSync(f, 'utf8')
    const style = (raw.match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1]
    const fonts = [...raw.matchAll(/<link [^>]*>/g)].map(m => m[0]).join('\n')
    const markup = raw.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta [^>]*>/g, '').replace(/<link [^>]*>/g, '').replace(/<style>[\s\S]*?<\/style>/, '').trim()
    const title = 'Set up your AI agents and decide what each may do: the interactive guide'
    const description = "Angelo's agent setup guide, interactive: read it as your role, answer two short questionnaires, turn the dial over five deployments. The text version is the signed article on PrompTugal.news."
    const note = `<p class="asg-note">The interactive version of Angelo's guide. The same text, signed, is the article on PrompTugal.news: <a href="${ARTICLE}">${ARTICLE.replace('https://', '')}</a>.</p>`
    const md = `This page is the interactive version of Angelo's agent setup guide: a "read this as" switch for seven audiences, two questionnaires that point to the right sections, and a dial that shows the level of control to start at for five kinds of deployment. Your answers stay in your browser; nothing is sent or saved.\n\nThe whole text, with every table, its sources and what it does not claim, is the signed article on PrompTugal.news: [Set up your AI agents and decide what each may do](${ARTICLE}).\n\nIts source here: [${SRC}](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/${SRC}).\n`
    return [{
        rel: 'people/angelo/guide/index.html', title, description, md,
        head: `${fonts}\n<style>\n${scope(style)}.asg-note{font-size:14px;margin:0 0 16px}\n</style>`,
        body: `${note}\n<div class="asg">\n${markup}\n</div>`,
    }]
}
