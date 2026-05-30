# TinyStudio.io Intercom-Parity Redesign Build Brief

Date: 2026-05-30

## Business Truth

TinyStudio sells a 7-day Tangible Revenue Leak Sprint + Search Trust Layer for founder-led businesses with an existing website and real customer context. The page must keep explicit pricing, timeline, guarantee/refund terms, FAQ, and proof-safe language. It must not promise revenue, ROAS, SEO rankings, AI visibility, conversion lift, or sales lift.

## Chosen Direction

Intercom product-system hero, translated to TinyStudio.

Selected ingredients:

- Black announcement strip above the page.
- Floating pill navigation inside the hero.
- Huge heavy white headline over a dark atmospheric grid.
- Compact two-button CTA cluster.
- Product UI panels rising from the lower hero, built in CSS rather than copied screenshots.
- Pricing/product cards with tabbed audience selector and thin colored top rails.
- Dark proof-safe/example sections to preserve commercial seriousness.

Rejected ingredients:

- Generated scenic hero image. It looked weak and was removed.
- Exact Intercom logos, copy, screenshots, product UI, or proprietary visual assets.
- 1:1 counterfeit replication of protected trade dress.
- Stock-like decorative imagery.

## Reference Lock

Primary Mobbin references:

- Intercom full-bleed AI-first hero: `d8c1cfee-8f82-4c0c-98c4-1e1dfa3c911e`
- Intercom dark product-suite hero: `9f775dc5-41ab-4bd9-8f57-f66dc83ea760`
- Intercom product card split: `7c2003c3-d242-428f-910f-8c6396018e7e`
- Intercom pricing tabs and cards: `c71cdec3-ca82-4a3d-b44a-acb3ee7b57c0`, `38741f9a-3a10-49f2-acdc-2b454b873038`

Anti-reference:

- Generated scenic bitmap hero previously deployed in `bbb47c5`; removed because it did not meet the Intercom quality bar.

## Build Rules

- Preserve truthful TinyStudio offer language.
- Use TinyStudio colors: ink, paper, green, gold, red.
- Use CSS-built product visuals only; no copied Intercom screenshots.
- Keep mobile first viewport coherent with no horizontal overflow.
- Verify with page checks, dry-run deploy, rendered desktop/mobile screenshots, and live domain checks.
