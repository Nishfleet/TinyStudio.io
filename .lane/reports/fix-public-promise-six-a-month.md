# Lane 1 report — public-promise "Six a month" copy drift

## Item

the self-directed public-promise/UX copy-drift fix

## Branch

`fix-public-promise-six-a-month`

## Finding

`public/agents.html` and `public/pricing.html` used the non-canonical "Six audits a month" / "Why only six audits a month?" while the product truth in `public/index.html`, `public/audit.html`, `public/msp.html`, `public/offer.md` and `public/llms.txt` use the canonical "Six a month" / "Six appraisals a month".

Open PRs at start (#268, #266, #253) are docs/evidence-only and do not cover this gap.

## Files touched

`public/agents.html`, `public/pricing.html`, `scripts/check-site.mjs`, `.lane/reports/fix-public-promise-six-a-month.md`

## Source checks

1. `npm run check`

```
TinyStudio.io checks passed.
```

2. `npm test`

Exit 0. Subtests: headings 6/6, sitemap 7/7, worker 83/83, ui 16/16, contract 8/8, study 2/2, viewport 4/4, narrow-pages PASS, narrow viewport PASS. No failing subtests.

3. `node --test scripts/test-product-contract.mjs`

Exit 0. 8 pass, 0 fail.

4. `node --test scripts/test-agent-ui.mjs`

Exit 0. 16 pass, 0 fail.

5. `grep -Rin 'Six audits a month\|Why only six audits a month' public/`

No matches.

6. `grep -Rin 'Six a month' public/agents.html public/pricing.html public/index.html public/audit.html public/msp.html`

At least one match in each of the five files:

```
public/agents.html:80:    ...<b>Six a month.</b>...
public/pricing.html:123:    <div class="q"><h3>Why only six a month?</h3>
public/index.html:83:      ...<b class="xi4">Six a month.</b>...
public/audit.html:86:    ...<b>Six a month.</b>...
public/msp.html:86:    ...<b>Six a month.</b>...
```

7. `grep -Rin 'Six appraisals a month' public/offer.md public/llms.txt`

At least one match in both files:

```
public/offer.md:31:Six appraisals a month, done by hand. When the sixth is taken, the intake closes until the next.
public/llms.txt:67:Six appraisals a month, done by hand. When the sixth is taken, the intake
```

8. `git diff --check`

Clean (no whitespace errors).

9. `git status --short`

First coherent commit (`02a9c6d`) landed `public/agents.html`, `public/pricing.html`, and `scripts/check-site.mjs` early. After this report file is written, status shows:

```
?? .lane/reports/fix-public-promise-six-a-month.md
```

`.fleet-spec/` if present is left untracked and not committed.

## Conclusion

Fixed on branch fix-public-promise-six-a-month; PR opened.
