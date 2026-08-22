# Lane 1 report — fix/offer-md-data-handling-lane1-20260823

**Date:** 2026-08-23  
**Item:** self-directed (tier 1 public-promise gap)  
**Branch:** `fix/offer-md-data-handling-lane1-20260823`

## Problem

`public/offer.md` is the machine-readable mirror of `public/llms.txt`. `llms.txt` already disclosed data-handling boundaries (Cloudflare D1 signup storage, rate-limit counters, no storage of submitted business context, no public read endpoint). `offer.md` lacked the `## Data Handling` section, so a machine reader consuming only `offer.md` would miss that promise.

Open PRs (#268, #266, #253) are docs/evidence-only and do not cover this gap.

## Fix

1. Inserted the `## Data Handling` section from `llms.txt` into `public/offer.md` (after `## Legacy Agent Desk`, before `## Contact`).
2. Extended the `offer facts are mirrored by llms.txt and offer.md` test in `scripts/test-agent-ui.mjs` to assert the section heading and three disclosure sentences in both files.

## Verification

```text
npm run check
# TinyStudio.io checks passed.

node --test scripts/test-agent-ui.mjs
# 16 tests, 0 failures (including new Data Handling mirror assertions)
```

## Files changed

- `public/offer.md`
- `scripts/test-agent-ui.mjs`
