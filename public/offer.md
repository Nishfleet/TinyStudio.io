# TinyStudio — The Leak Audit And The Growth Desk

TinyStudio's current offer is human-reviewed: a free leak audit, and a desk that closes the leaks the audit finds. The self-serve Agent Desk at /agent-desk is legacy and is not the product TinyStudio sells.

Contact: hello@tinystudio.io

## The Leak Audit

Free, done by hand, and capped at six a month; when the sixth is taken, the intake closes until the next month.

- Findings inside five working days, as a written document
- Named leaks in the order they cost the business money, with the fix beside each one
- The deliverable is a document, not a call
- The audit is the client's to keep either way

## The Growth Desk

$2,500 a month on a three-month minimum.

- Month one: the leak audit, then the highest-leverage page rewritten or rebuilt
- A dev-ready handoff if the client's own team ships it
- Search-trust basics: the questions people ask before they commit, answered on the page
- Months two and three: weekly checks, one revision, and tracking that says whether the fix held

Delivery guarantee: if the month-one deliverables are not in the client's hands within fourteen working days of Day 0, month one is refunded in full. Day 0 begins only after payment, access, and both named owners are recorded; client delay pauses the clock.

## How The Work Runs

Seven specialist agents do the research, drafting, and checking: one job each, with fixed inputs and a checklist, on the current frontier model tier chosen per job. A person reads and signs every client-facing output; fit, claims, client-facing work, delivery, and renewal are human decisions. Automation never sends, publishes, spends, or approves.

TinyStudio does not publish client work: no logos, no case studies, no testimonials. The market study of high-ticket homepages is shared freely, industry by industry, while client work is never named.

## Not Promised

No revenue, ranking, ROAS, conversion, booked-call or sales-volume guarantees. The delivery guarantee is the only promise about outcomes, and it is a promise about the work, not the client's market.

## Legacy Self-Serve Agent Desk

The Agent Desk at /agent-desk is legacy and not the current offer. It is self-serve and Cloudflare Workers AI generates the Pipeline Brief, Implementation Checklist, and Weekly Fix Report server-side from an email and a business snapshot, with an optional detail pack. Client-side code does not call model providers, platform admin APIs, ad accounts, databases, or private credentials directly.

Its safety rails stay in force: no campaign publishing, no ad spend changes, no ad account connection, no prospect message sending, no CRM outcome syncing; claims, ad spend, campaign publishing, platform connections, and compliance-sensitive decisions are approval-gated.

## Data Handling

The public app stores email signup and lightweight usage metadata in Cloudflare D1, including daily rate-limit counters and a daily IP-derived rate-limit key. The business snapshot, optional details, weekly metrics, and generated artifacts are processed to generate the output and are not stored by this app.

There is no public endpoint for reading collected emails or usage metadata.
