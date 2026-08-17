# Lane 1 report — appraisal-page canonicals/JSON-LD re-verification (2026-08-17)

Branch: `fix/audit-canonical-clean-url-reverify-2026-08-17`
Item: "Point appraisal-page canonicals and JSON-LD WebPage @ids at the clean
URLs that do not 307" (finding item f7a18209b7, `[unreviewed-by-opus]`).
Base: `origin/main` @ `f309dd45` (2026-08-17).
Prior receipt: `docs/evidence/audit-canonical-clean-url-reverify-2026-08-14.md`
on commit `60d045c`.

## Verdict

Already fixed and live; no code change needed on the finding's page. The fix
is commit `1cc7a4e` (PR #56 — "fix(public): point appraisal-page canonicals
and JSON-LD @ids at the clean /audit URL"), already on `origin/main`. This
lane's work was to re-verify the item against the current main and live and
record the closeout on 2026-08-17, resolving the `[unreviewed-by-opus]` tag.

Evidence: `docs/evidence/audit-canonical-clean-url-reverify-2026-08-17.md`.

## Verification performed

1. `public/audit.html` on current `origin/main` (`f309dd45`) carries
   `<link rel="canonical" href="https://tinystudio.io/audit">`,
   `<meta property="og:url" content="https://tinystudio.io/audit">`, and
   JSON-LD `WebPage` `@id` `https://tinystudio.io/audit#webpage` /
   `url` `https://tinystudio.io/audit` — all four fields name the clean
   extensionless `/audit` URL.
2. `git diff 60d045c..origin/main -- public/audit.html` is empty, so the
   canonical/og:url/JSON-LD lines on today's head are byte-identical to the
   ones the prior receipt measured. The only audit-page commit since then
   (`0e7373fe`) only added `autocomplete="email"` to the lead form input.
3. Live: `curl -sI https://tinystudio.io/audit` → `200`, no Location;
   `curl -sI https://tinystudio.io/audit.html` → `307` to
   `https://tinystudio.io/audit`. The served `/audit` head matches the
   committed source for all four fields.
4. `git merge-base --is-ancestor 1cc7a4e origin/main` → true; the
   canonical-guard expectation in `scripts/check-site.mjs` still names
   `https://tinystudio.io/audit` for the audit page.
5. `node scripts/check-site.mjs` → `TinyStudio.io checks passed.` (canonical
   guard and the rest of the static-source checks green).

## Delivery

- Branch: `fix/audit-canonical-clean-url-reverify-2026-08-17`
- Files: `docs/evidence/audit-canonical-clean-url-reverify-2026-08-17.md`,
  `.lane/reports/fix-audit-canonical-clean-url-reverify-2026-08-17.md`
- PR: opened against `origin/main`.
