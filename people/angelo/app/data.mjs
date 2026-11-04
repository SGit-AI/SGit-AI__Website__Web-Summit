// Angelo's command centre, data layer (dev@web-summit.angelo, 4 November 2026; brief: people/angelo/app/BRIEF.md).
// It extends the shared one (admin/build/commandcentre.mjs), never copies it: everything the shared build returns
// is kept as it is, so every fix to the shared app reaches this one, and what is added here can move back.
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const CC = await import(path.join(ROOT, 'admin/build/commandcentre.mjs'))

export const frontMatter = CC.frontMatter
export const dueAt = CC.dueAt

export function build(root, person, now = new Date()) {
    return CC.build(root, person, now)
}

export function summaryMd(d, now = new Date()) {
    return CC.summaryMd(d, now)
}
