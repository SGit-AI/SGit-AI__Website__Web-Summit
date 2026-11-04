// One list of secret shapes for the whole gate (WS-86): validate.js check 5 scans every file with it,
// admin/tools/comms_check.mjs adds the contact-detail rules on top. Change a shape here, once.
// FIXTURES prove each shape is caught: validate.js fails if one slips through, or if the public
// shapes in NOT_SECRETS are flagged. They are assembled at run time, so this file holds no key itself.

const KEY_RULES = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'a private key'],
    [/sgit_private_(vault|read)_[A-Za-z0-9]/, 'an sgit private key (vault or private read)'],
    // anchored at the start of a run: the same matches as unanchored, but linear on long runs
    // the third element is a prefilter: a necessary part of every match that starts with a literal, so the engine skips
    // to it at once; the full pattern runs only where it is found (36 MB scanned in 33 ms instead of 421, same answers)
    [/(?<![A-Za-z0-9_-])[A-Za-z0-9_-]{20,}:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/, 'a vault-key-shaped string', /:[0-9a-f]{8}-[0-9a-f]{4}-/],
    [/\b(sk-(ant-)?[A-Za-z0-9_-]{20,}|gh[pos]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|xox[abprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35})/, 'an API key or token'],
    // a JWK with a private member: "d" in the same object as "kty", either order
    [/"kty"\s*:[^{}]*"d"\s*:\s*"|"d"\s*:\s*"[^"]+"[^{}]*"kty"\s*:/, 'a private JWK'],
]

// files no one pastes a key into as text; the two videos alone were 14 MB of the gate's reading
const BINARY = /\.(png|jpg|jpeg|gif|webp|ico|woff2?|zip|pdf|mp4|webm|mov|mp3|m4a)$/

const keyHits = text => KEY_RULES.filter(([re, , pre]) => (!pre || pre.test(text)) && re.test(text)).map(([, what]) => what)

const r = (c, n) => c.repeat(n)
const FIXTURES = {
    'a private key': ['-----BEGIN ' + 'OPENSSH PRIVATE KEY-----', '-----BEGIN ' + 'ENCRYPTED PRIVATE KEY-----', '-----BEGIN ' + 'DSA PRIVATE KEY-----', '-----BEGIN ' + 'PRIVATE KEY-----'],
    'an sgit private key (vault or private read)': ['sgit_private_' + 'vault_Ab1', 'sgit_private_' + 'read_Zz9'],
    'a vault-key-shaped string': [r('A', 24) + ':' + '12345678-abcd-abcd-abcd-1234567890ab'],
    'an API key or token': ['sk-' + 'ant-api03-' + r('a', 30), 'sk-' + r('b', 24), 'ghp' + '_' + r('c', 36), 'gho' + '_' + r('d', 36), 'ghs' + '_' + r('e', 36), 'github' + '_pat_' + r('f', 30), 'AKIA' + r('G', 16), 'xox' + 'b-' + r('1', 12), 'AI' + 'za' + r('h', 35)],
    'a private JWK': ['{"kty' + '":"EC","crv":"P-256","x":"aa","y":"bb","d' + '":"cc"}', '{"d' + '":"cc","kty' + '":"OKP"}'],
}
const NOT_SECRETS = ['{"kty":"EC","crv":"P-256","x":"aa","y":"bb"}', 'the risk-mandate-gap video', 'sha256:db7f79fdd87e030a']

function selfTest() {
    const errors = []
    for (const [what, samples] of Object.entries(FIXTURES))
        for (const s of samples) if (!keyHits(s).includes(what)) errors.push(`secrets.cjs: ${what} not caught in fixture ${s.slice(0, 14)}…`)
    for (const s of NOT_SECRETS) if (keyHits(s).length) errors.push(`secrets.cjs: a public string is flagged: ${s.slice(0, 20)}`)
    return errors
}

module.exports = { KEY_RULES, BINARY, keyHits, selfTest }
