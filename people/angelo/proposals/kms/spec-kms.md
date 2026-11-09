---
title: "sharness.kms for Angelo's agents: what it would take"
by: vault@PrompTugal.angelo
written: 2026-11-07
for: Angelo (decision), desk.conductor@PrompTugal.angelo, policy@PrompTugal.angelo
issue: 4c285114 (Angelo, 6 November: "analyse the work necessary to implement the sharness.kms and report back an overview")
---

**Recommendation: leave the changeset until after the summit.** Nothing of sharness.kms is built yet, and its design does not yet cover our two biggest needs (signing, and tokens). Meanwhile take four small steps now, in our own repository, that get most of the benefit (section e).

## What and why: what sharness.kms must do for us (a)

sharness.kms is designed to "open a sealed message addressed to its identity, check it, derive the keys the caller needs, and re-seal them to a key the caller made for this one request. It never returns a clear key" [1]. For Angelo's agents that would mean:

| Need | Today | With a kms |
|---|---|---|
| **Unseal** (a vault key, lane credentials, the CRM key) | each agent's session key, plain in `~/.sg-send/keys` [8] | the kms opens it; the agent gets only the derived keys, for one request [1][2] |
| **Push to a vault without holding its key** | sgit keeps the vault key and token in clear in `.sg_vault/local/` [9] | "sealed clones": `vault_key.sealed`, `show-key` refused [2] |
| **Sign** (articles' `.sig`, run logs) | `pki-agent.mjs sign`, `agent-log.mjs` with the session key [8][10] | **not in the design**: signing is a later roadmap step [3] |
| **Tokens** (one SG/Send token per agent) | sealed to the agent, then an environment variable [9] | only "same treatment" is mentioned; there is no op for it [2] |
| **Per-agent policy** | separate environments plus the ABPs, prose not enforcement [11] | a policy hash and "policy allows op for vault_id"; **no per-agent schema yet** [2] |
| **A log line per use** | one signed record per run (`agent-log.mjs`) [10] | one audit line per request, no secrets [2] |

```
 agent ──x──> kms          (by design the agent can never call it: only net and llm can [1][4])
 agent ──> sharness.net ──mTLS──> sharness.kms ──> derived keys, sealed to a one-time key
                                       │
                                       └─ holds the session identity's private key (never exported)
```

## Out of scope

Building anything; changing SHarness's or sgit's code; any change to a vault or key. This is analysis only (tier 1).

## Design choices left open, with my recommendation (b)

1. **Where it runs and who hosts it.** Five topologies are designed (one VM, Docker, Kubernetes, a remote cloud KMS, platform-provided), and "only A was measured" [4]. SHarness says the right owner is the agent execution environment [3]. *Recommend:* local per session (A) first. A remote kms needs an owner and an account that nobody has named.
2. **How a fresh session proves which agent it is.** Today a role certificate proves the role within one session, not which agent the session is [5]. The design's options are a session auth key, a grant signed by the person ("session X may unwrap vault V read-only, 20 times, until 18:00"), or platform workload identity [2]. *Recommend:* the person-signed grant. It matches our protocol (Angelo's go for tier 3) and our person keys.
3. **Fit with the launcher and policy hash.** `run --expect-hash` exists [6]. The session launcher that would start the kms is designed only [7]. Whether pki.sgit.ai's operator policy hash is the same as SHarness's manifest hash is not stated anywhere [12]. *Recommend:* make them one hash, and ask SHarness to say so.
4. **Keys that outlive a session.** A session identity "dies with the session", so every restart needs a new handover unless a lasting identity is added [2]. Our sessions restart often. *Recommend:* decide this before building. It is the part that would cost us most every day.

## The work: the pieces, sized (c)

| Piece | Size | Builds on | Whose |
|---|---|---|---|
| kms door v0 (unwrap, seal_to, identity, policy, audit) in Python (E08, "planned") | L | the door base class, the session CA with a `kms` role and edges already there [5][6] | SHarness (Dinis's side) |
| Add `sign` and `unseal_secret` (tokens) to the protocol | M | the envelope as designed [2] | SHarness: a protocol decision |
| Per-agent policy rows (agent, vault ids, ops, counts, expiry) | M | policy v0 hash, `refuse_secrets` rows [6] | We can draft it; SHarness adopts it |
| A way for our tools (pki-agent, seal.mjs, feedback_drain) to use it, given that agents cannot call kms | M | net's `/v0/vault/pull` (not built) [4] | Design change on SHarness's side, client on ours |
| Sealed clones in sgit (`vault_key.sealed`, no `show-key`) | L | sgit's key handling | sgit (Dinis's side) |
| A lasting identity across sessions | M–L | nothing yet | Open |
| Audit lines into our agents' lane (WS-160) | S | `agent-log.mjs` [10] | Ours |
| Hosting a remote kms (if not A) | L | nothing, no owner named [4] | Dinis or a platform |

In total, about two large and three medium pieces on Dinis's side before we would gain anything, and SHarness's own order puts E08 after work still in progress [6].

## Risks, and what breaks if it is down (d)

- **If the kms is down, nothing sealed opens:** no vault reads or pushes, no lanes drained. A local kms dies with its session, so every restart is a fresh handover by a person [2].
- **New parts during the summit week:** more moving pieces exactly when the team has least time to debug them.
- **It does not stop root** in the container from reading the key while it sits in memory ("not claimed") [2]. Our sessions run as root.
- **Unproven in our environment:** the design assumes useradd, network namespaces, memfd_secret and a cgroup freezer. These were measured in one SHarness workspace [6], not in our team's environments.
- **Risk of doing nothing:** keys and tokens stay in clear on disk in each agent's session. Today that is limited by one environment per agent, sealed handovers and short sessions.

## Recommendation, and how we will know it works (e)

**After the summit, not now, and not "leave it".** Then send Dinis's agents a changeset limited to what we can own: the per-agent policy rows and the audit-to-agent-log piece, plus a short note asking for `sign` and `unseal_secret` ops and a lasting identity. That is tier 3 (handing work to Dinis's agents), so Angelo decides.

**Now, in our own repository, small and worth it** (each tier 3 where it touches keys or tokens):
1. Take copies of Angelo's token out of the agents' vault clones (`.sg_vault/local/`), and push only with each agent's own token.
2. Pass credentials to tools over a pipe, never a file (vault@ does this already for its lane).
3. Encrypt each agent's `~/.sg-send/keys` with `SG_SEND_PASSPHRASE`, held in that agent's own environment [8].
4. Never run `sgit vault info` or `show-key` where output is kept (the lesson of 3 November).

**We will know it works** when no clear vault key or token sits on an agent's disk, and every key use is one line in the agents' lane.

## Sources (all read 7 November 2026)

[1] https://sharness.ai/components/kms/index.md · [2] https://sharness.ai/design/keys/index.md · [3] https://sharness.ai/design/roadmap/index.md · [4] https://sharness.ai/design/architecture/index.md and /components/net/index.md · [5] https://github.com/SHarness-AI/SHarness-AI__CLI `sharness_ai/door/Session.py`, `Door.py` (dev at 05e5290) · [6] https://sharness.ai/code/index.md, /evidence/status/index.md, the repository's `policy.py`, `run.py`, `cli/CLI__Components.py` ("kms" exits 69) · [7] https://sharness.ai/components/launcher/index.md · [8] pki-agent.mjs `help`, https://pki.sgit.ai/llms.txt · [9] this repository's `content/vault-agent.md` (step 1, step 3) and https://sgit.ai/docs/key-management.md · [10] `admin/tools/agent-log.mjs` · [11] `people/angelo/kit/README.md` · [12] https://sharness.ai/design/levels/index.md, https://pki.sgit.ai/llms.txt

## Reviews

- policy@PrompTugal.angelo: (findings here)
- security@web-summit.dinis: (findings here, since it touches keys)
- Angelo: (decision)
