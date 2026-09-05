export const AI_STATES = {
  found: { label: "Found", meaning: "the page answers the question" },
  wrong: { label: "Wrong", meaning: "the page answers it, badly" },
  absent: { label: "Absent", meaning: "read; the answer is not on the page" },
  "not-tested": { label: "Not tested", meaning: "the page was never read" }
};

export const AI_PASS = {
  reviewed: true,
  reviewedOn: "2026-08-06"
};

export const AI_CHECKS = [
  {
    id: "hw-price",
    fixture: "harley-wells.html",
    prompt: "What does a consultation at Harley Wells cost?",
    outcome: "absent",
    readOn: "2026-08-06",
    read: "The services section lists three treatments, each with a booking button; no figure appears beside any of them.",
    quotes: ["Every treatment begins with a consultation — Book a consultation"],
    fix: "Name a figure, or a \"from\" line, beside each treatment — an AI answer has nothing to cite on cost, so it cites nothing."
  },
  {
    id: "hw-hours",
    fixture: "harley-wells.html",
    prompt: "Does Harley Wells open on Sundays?",
    outcome: "found",
    readOn: "2026-08-06",
    read: "The hours block answers the question directly.",
    quotes: ["Open Mon–Sat, 9:00–19:00", "Sundays by arrangement"],
    fix: "None needed — the page already answers this, and an answer can cite it."
  },
  {
    id: "hw-location",
    fixture: "harley-wells.html",
    prompt: "Where is Harley Wells Clinic?",
    outcome: "found",
    readOn: "2026-08-06",
    read: "The address block carries a full street address.",
    quotes: ["12 St James's Walk, London EC1A 1BB"],
    fix: "None needed — the page answers this directly."
  },
  {
    id: "bm-longevity",
    fixture: "beaumont-yachts.html",
    prompt: "How long has Beaumont Yachts been in business?",
    outcome: "wrong",
    readOn: "2026-08-06",
    read: "Two pages of the site disagree about the founding year, so any cited answer contradicts the other page.",
    quotes: ["Founded in 1992", "Over 25 years of experience"],
    fix: "Reconcile the two claims into one dated line an answer can cite."
  },
  {
    id: "bm-44price",
    fixture: "beaumont-yachts.html",
    prompt: "What does a Beaumont 44 cost?",
    outcome: "found",
    readOn: "2026-08-06",
    read: "The inventory page lists a firm figure.",
    quotes: ["Beaumont 44 — €2,450,000"],
    fix: "None needed — the figure is on the page."
  },
  {
    id: "vm-chrono",
    fixture: "vermillon-watches.html",
    prompt: "What does a Vermillon Chrono cost?",
    outcome: "absent",
    readOn: "2026-08-06",
    read: "The collection page answers with discretion instead of a figure.",
    quotes: ["The Chrono — price on request"],
    fix: "None — the page says \"price on request\" deliberately. Discretion is the strategy; we mark the absence as a choice, not a leak."
  },
  {
    id: "as-membership",
    fixture: "aurelia-spa-fetch.txt",
    prompt: "What does a membership at Aurelia Spa cost?",
    outcome: "not-tested",
    readOn: "2026-08-06",
    read: "The fetch log is the evidence: the request returned a challenge page and no text was readable.",
    quotes: ["HTTP 403 — challenge page returned; no page text readable"],
    fix: ""
  },
  {
    id: "as-couples",
    fixture: "aurelia-spa-fetch.txt",
    prompt: "Does Aurelia Spa offer couples' treatments?",
    outcome: "not-tested",
    readOn: "2026-08-06",
    read: "The fetch log is the evidence: the request returned a challenge page and no text was readable.",
    quotes: ["HTTP 403 — challenge page returned; no page text readable"],
    fix: ""
  }
];

export function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function aiOutcomeLabel(outcome) {
  const state = AI_STATES[outcome];
  return state ? state.label : String(outcome);
}

export function aiPassHtml() {
  return AI_CHECKS.map((check) => {
    const state = AI_STATES[check.outcome];
    const quotes = check.quotes
      .map((quote) => `&ldquo;${esc(quote)}&rdquo;`)
      .join(" · ");
    const evidence =
      `Evidence: <a class="xa1" href="#ev-${check.id}">${esc(check.fixture)}</a>` +
      ` · read ${check.readOn}. ${esc(check.read)}` +
      `${quotes ? ` Quotes on file: ${quotes}.` : ""}`;
    const fix =
      check.outcome === "not-tested"
        ? "No fix — we do not recommend changes to a page we could not read."
        : `Fix: ${esc(check.fix)}`;
    return (
      `<div class="row" id="ev-${check.id}" data-check="${check.id}" data-state="${check.outcome}">` +
      `<div class="t">` +
      `<div class="ai-q">${esc(check.prompt)}</div>` +
      `<div class="micro">${evidence}</div>` +
      `<div class="micro">${fix}</div>` +
      `</div>` +
      `<div class="v">${esc(state.label)}</div>` +
      `</div>`
    );
  }).join("");
}

export function renderAiPass(container) {
  if (!container) return "";
  const html = aiPassHtml();
  container.innerHTML = html;
  return html;
}

function reveal() {
  var S = ".phead h1,.phead .sub,form.lead,.micro,.urg,.band,section h2,section .lede,.check,.row";
  function r() {
    var e = [].slice.call(document.querySelectorAll(S));
    e.forEach(function (x) { x.setAttribute("data-r", ""); });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (v) {
        if (!v.isIntersecting) return;
        var s = [].slice.call(v.target.parentNode.children).filter(function (n) { return n.hasAttribute && n.hasAttribute("data-r"); });
        v.target.style.transitionDelay = Math.min(Math.max(0, s.indexOf(v.target)), 6) * 90 + "ms";
        v.target.classList.add("in");
        io.unobserve(v.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    e.forEach(function (x) { io.observe(x); });
    setTimeout(function () { document.querySelectorAll("[data-r]").forEach(function (x) { x.classList.add("in"); }); }, 1600);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", r);
  else r();
}

function init() {
  reveal();
  renderAiPass(document.getElementById("ai-pass"));
}

if (
  typeof document !== "undefined" &&
  typeof document.getElementById === "function" &&
  typeof IntersectionObserver !== "undefined"
) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}
