# Intake standard — what is allowed into the vault

Two pipelines feed the moat. Only the first is automated today.

| | Source | Status |
|---|---|---|
| **A. Market scan** | 99 sites, 13 industries, 8 geographies, read daily | **Live** — `study/scan.py`, cron `0 7 * * *` |
| **B. Practitioner knowledge** | What operators publish for free — teardowns, post-mortems, platform docs | **Specified, not automated.** The gate below is the reason. |

Pipeline A is safe to automate because it measures rather than believes: it reads
a page and counts what is on it. Pipeline B ingests *claims*, and a claim that
turns out to be wrong does not sit inertly in a file — it gets repeated to a
paying client in an audit. That is the failure that costs a client, so the gate
comes before the automation, not after.

---

## The gate — all five, or it does not enter

A candidate is a single claim about how something works, not an article.

**1. Mechanism, not outcome.** It must explain *why*, in a way that could be
   wrong. "Creative diversity is measured at the concept level, because hooks on
   one concept reach the same audience" passes. "Post more UGC, it works"
   does not — there is nothing there to test.

**2. Named, checkable source.** A person, company or document, with a URL.
   Anonymous, aggregated or "people are saying" does not enter. Screenshots
   without a traceable origin do not enter.

**3. Corroboration, or first-party status.** Either two independent sources that
   are not quoting each other, or one first-party source that owns the system
   (a platform's own documentation, an operator's own account). One confident
   stranger is not evidence.

**4. Falsifiable as written.** State the condition that would disprove it. A
   claim nothing could contradict is a slogan.

**5. It changes what we would do.** If knowing it alters no audit, no
   recommendation and no decision, it is trivia. Trivia is the most common
   rejection and the easiest to wave through.

**Automatic rejection**, regardless of the five: anything selling a course, a
template or a service; engagement bait; numbers with no method; screenshots of
dashboards with no account context; anything restating a platform's marketing
copy as insight.

---

## On entry

Every accepted claim carries, or it is not accepted:

- the claim in one sentence
- what would disprove it
- the source URL and date
- corroboration status: `first-party` · `two-source` · `single-source-pending`
- confidence: `verified` · `reported` · `contested`
- what it changes about the work

`single-source-pending` may be stored but **may never be used in client-facing
work** until it corroborates or is dropped. That distinction is the whole point:
the vault is allowed to hold uncertainty, an audit is not.

---

## Why B is not on a cron yet

An automated harvester with a model-judged gate will pass things the gate would
reject on a careful reading — it will find a claim plausible, well-argued and
wrong. Pipeline A can run unattended because being wrong means a miscounted
form field. Pipeline B being wrong means a confident, incorrect recommendation
in a document with a human signature on it.

The sequence: run B by hand at first, keep every rejection with its reason, and
once there are enough rejections to see the pattern, encode *that* as the
automated filter. Automating the gate before knowing what it rejects is how the
garbage gets in.

Worked example of a claim that passed all five: the Meta creative-diversity
audit — mechanism stated, named operators, corroborated by Meta's own
"Creative Diversity" framework, falsifiable (asset count rises while reach stays
flat), and it changed the media plan.
