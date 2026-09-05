// Deterministic regression guard: heading levels in the five public pages must
// never skip a level. Effective level is `aria-level` when present (the
// accessible outline a screen reader and axe-core report), otherwise the
// heading tag number.
//
// Guarded pages: index, agents, pricing, specimen. The dogfood finding
// "Heading hierarchy needs cleanup on home" was three h2 -> h4 skips on
// index.html (method stops, identity questions, FAQ questions); the same
// skipped-level shape also existed on agents.html (h1 -> h3 roster, h2 -> h4
// gatebox), pricing.html (h2 -> h4 track and FAQ) and specimen.html (h1 -> h3
// findings, h2 -> h4 not-run note).
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const PAGES = ['index.html', 'agents.html', 'pricing.html', 'specimen.html'];

/** Strip comments, then return [{ level, tag, text }] for every heading. */
function headings(html) {
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
  const out = [];
  const re = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g;
  let m;
  while ((m = re.exec(withoutComments)) !== null) {
    const tag = Number(m[1]);
    const attrs = m[2];
    const ariaLevel = /aria-level="([1-6])"/.exec(attrs);
    const level = ariaLevel ? Number(ariaLevel[1]) : tag;
    out.push({ level, tag, text: m[3].replace(/<[^>]+>/g, '').trim() });
  }
  return out;
}

for (const page of PAGES) {
  test(`${page} — no skipped heading levels`, async () => {
    const html = await readFile(join(publicDir, page), 'utf8');
    const levels = headings(html).map((h) => h.level);

    assert.ok(levels.length > 0, `${page} should contain at least one heading`);
    assert.equal(
      levels[0],
      1,
      `${page} should open the outline at an h1 (first effective level was ${levels[0]})`,
    );
    assert.equal(
      levels.filter((l) => l === 1).length,
      1,
      `${page} should have exactly one h1`,
    );

    // A heading level may drop by any amount (returning up the outline) but
    // may only rise by one at a time; a rise of 2+ is a skipped level.
    for (let i = 1; i < levels.length; i += 1) {
      assert.ok(
        levels[i] <= levels[i - 1] + 1,
        `${page} heading #${i + 1} skips a level: ${levels[i - 1]} -> ${levels[i]}`,
      );
    }
  });
}
