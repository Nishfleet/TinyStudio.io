const STATE_LABELS = { found: "Found", wrong: "Wrong", absent: "Absent", "not-tested": "Not tested" };
const EVIDENCE_STATES = ["found", "wrong", "absent"];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function recordToNodes(record) {
  const state = String(record.state || "");
  const label = STATE_LABELS[state] || state;
  const hasEvidence = EVIDENCE_STATES.includes(state);

  const row = el("div", "row");
  row.dataset.aiState = state;
  const title = el("span", "t");
  title.appendChild(el("span", "", hasEvidence ? record.prompt || "" : record.surface || ""));
  title.appendChild(document.createElement("br"));
  const surfaceLine = el("span", "sc");
  surfaceLine.textContent = hasEvidence
    ? `${record.surface || ""} · ${record.tested_at || ""}`
    : record.tested_at || "";
  title.appendChild(surfaceLine);
  row.appendChild(title);
  row.appendChild(el("span", "v", label));

  const detail = el("p", "micro");
  if (state === "not-tested") {
    detail.textContent = `Not tested — ${record.reason || "this surface was not run."}`;
  } else {
    const evidence = record.evidence || {};
    detail.textContent = `Evidence — “${evidence.quote || ""}” — ${evidence.source || "no source recorded"}`;
    if (record.fix) detail.textContent += ` Fix — ${record.fix}`;
  }

  return [row, detail];
}

export function renderAiSearchReport(container, records) {
  if (!container) return 0;
  container.replaceChildren();
  let count = 0;
  for (const record of Array.isArray(records) ? records : []) {
    for (const node of recordToNodes(record)) {
      container.appendChild(node);
    }
    count += 1;
  }
  return count;
}

function renderEvidenceReport() {
  if (typeof document === "undefined") return;
  const script = document.querySelector("#ai-search-evidence");
  const container = document.querySelector("#ai-search-report");
  if (!script || !container) return;
  try {
    const fixture = JSON.parse(script.textContent);
    renderAiSearchReport(container, fixture && fixture.records);
  } catch (error) {
    // A malformed fixture leaves the section quiet; the prose above still stands.
  }
}

const REVEAL_SELECTOR = ".phead h1,.phead .sub,form.lead,.micro,.urg,.band,section h2,section .lede,.check,.row";

function runReveal() {
  var elements = [].slice.call(document.querySelectorAll(REVEAL_SELECTOR));
  elements.forEach(function (element) { element.setAttribute("data-r", ""); });
  if (typeof IntersectionObserver === "undefined") {
    elements.forEach(function (element) { element.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var siblings = [].slice.call(entry.target.parentNode.children)
        .filter(function (node) { return node.hasAttribute && node.hasAttribute("data-r"); });
      entry.target.style.transitionDelay = Math.min(Math.max(0, siblings.indexOf(entry.target)), 6) * 90 + "ms";
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
  elements.forEach(function (element) { io.observe(element); });
  setTimeout(function () {
    document.querySelectorAll("[data-r]").forEach(function (element) { element.classList.add("in"); });
  }, 1600);
}

function boot() {
  runReveal();
  renderEvidenceReport();
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", boot)
  : boot();
