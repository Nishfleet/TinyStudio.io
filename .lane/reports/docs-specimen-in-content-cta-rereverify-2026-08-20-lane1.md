# Lane report — docs/specimen-in-content-cta-rereverify-2026-08-20-lane1

## Item

"[unreviewed-by-opus] The /specimen proof page contains no in-content
conversion CTA — the page the homepage routes" (review item `94ec723c9e`,
lane 1).

## Outcome

**Already fixed on main and live; re-verified on the current head and
closed out. No code change was needed.**

The requested change landed as PR #155 (`b81281f`, "fix(public): add
in-content conversion CTA to the /specimen proof page", merged 2026-08-13):
`public/specimen.html` carries an in-content `.band` conversion CTA
(`<a class="cta" href="/#start">Request the appraisal</a>`) between the
report and the footer, with the >=44px tap target in `public/specimen.css`
and a static source guard in `scripts/check-site.mjs` (the "Specimen
in-content conversion CTA" block) that fails CI on regression. This lane's
work was to re-verify the item against the current `origin/main` head
(`92d55c3`, 2026-08-20) and live, and record the closeout so the item cannot
be re-opened by tracker drift.

Evidence: `docs/evidence/specimen-in-content-cta-rereverify-2026-08-20-lane1.md`

## Verification performed

1. `public/specimen.html` on current `origin/main` (`92d55c3`) carries the
   `.band` block (lines 134-139) with the `/#start` CTA labelled "Request
   the appraisal" and the no-guarantees note, immediately before the footer.
2. The homepage routes its "Read the specimen" call-out to this page:
   `public/index.html` line 250, `<a href="/specimen">Read the specimen
   &rarr;</a>`.
3. The guard still enforces the shape: `scripts/check-site.mjs` (lines
   2020-2047) fails the build if the band, its CTA to `/#start`, the
   no-guarantees note, `.band .cta` styling, or the 16px/24px padding
   regress.
4. `git merge-base --is-ancestor b81281f origin/main` → true: the fix
   commit is on the current head.
5. `npm run check` passes on the current head (exit 0).
6. Live: `GET https://tinystudio.io/specimen` → HTTP 200 (2026-08-20); the
   served HTML carries `class="band"`, `class="cta" href="/#start"`, and
   "Request the appraisal" appears twice (nav CTA + band CTA).

## Delivery

- Branch: `docs/specimen-in-content-cta-rereverify-2026-08-20-lane1`
- Evidence: `docs/evidence/specimen-in-content-cta-rereverify-2026-08-20-lane1.md`
- PR: opened against origin/main.