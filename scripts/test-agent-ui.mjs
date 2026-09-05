import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const AI_SEARCH_FIXTURE = JSON.parse(
  readFileSync(new URL("../evidence-fixtures/ai-search/visibility-check.json", import.meta.url), "utf8")
);

const SAMPLE_SECTIONS = {
  pipelineBrief: "# Pipeline Brief\n\n## Assumptions\n- **Offer**: <script>alert(1)</script>\n\nBrief body",
  implementationChecklist: "# Implementation Checklist\n\n- Checklist body",
  weeklyFixReport: "# Weekly Fix Report\n\n| Metric | Current week |\n| --- | --- |\n| Spend | INR 7,000 |\n\nWeekly body"
};

class FakeElement {
  constructor({ textContent = "", dataset = {}, disabled = false, hidden = false, value = "" } = {}) {
    this.textContent = textContent;
    this.dataset = dataset;
    this.disabled = disabled;
    this.hidden = hidden;
    this.value = value;
    this.tabIndex = 0;
    this.attributes = new Map();
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  async dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) || []) {
      await listener(event);
    }
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    if (name.startsWith("data-")) {
      const key = name
        .slice(5)
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      return this.dataset[key];
    }
    return this.attributes.get(name) ?? null;
  }

  focus() {
    globalThis.document.activeElement = this;
  }
}

class FakeForm extends FakeElement {
  constructor(values, submitButton) {
    super();
    this.values = values;
    this.submitButton = submitButton;
  }

  querySelector(selector) {
    if (selector === "button[type='submit']") return this.submitButton;
    return null;
  }
}

class FakeFormData {
  constructor(form) {
    this.form = form;
  }

  entries() {
    return Object.entries(this.form.values);
  }
}

function setupDom() {
  const submitButton = new FakeElement();
  const elements = {
    agentStatus: new FakeElement(),
    agentOutput: new FakeElement({ hidden: true }),
    outputEmpty: new FakeElement({ textContent: "empty" }),
    outputTitle: new FakeElement({ textContent: "Pipeline Brief" }),
    copyButton: new FakeElement({ disabled: true }),
    submitButton
  };

  const formValues = {
    email: "nish+ui-test@tinystudio.io",
    business: "B2B growth consultant",
    weeklySpend: "INR 7000"
  };
  elements.agentForm = new FakeForm(formValues, submitButton);

  const tabs = [
    new FakeElement({ textContent: "Brief", dataset: { outputTab: "pipelineBrief" } }),
    new FakeElement({ textContent: "Checklist", dataset: { outputTab: "implementationChecklist" } }),
    new FakeElement({ textContent: "Weekly Report", dataset: { outputTab: "weeklyFixReport" } })
  ];

  const selectorMap = new Map([
    ["[data-agent-form]", elements.agentForm],
    ["[data-agent-status]", elements.agentStatus],
    ["[data-agent-output]", elements.agentOutput],
    ["[data-output-empty]", elements.outputEmpty],
    ["[data-output-title]", elements.outputTitle],
    ["[data-copy-output]", elements.copyButton]
  ]);

  globalThis.document = {
    activeElement: null,
    querySelector(selector) {
      return selectorMap.get(selector) || null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-output-tab]") return tabs;
      return [];
    }
  };
  globalThis.FormData = FakeFormData;

  let clipboardText = "";
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      clipboard: {
        async writeText(text) {
          clipboardText = text;
        }
      }
    }
  });

  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/agent-audit");
    const payload = JSON.parse(options.body);
    assert.equal(payload.business, "B2B growth consultant");
    assert.equal(payload.offer, undefined);
    assert.equal(payload.audience, undefined);
    assert.equal(payload.weeklySpend, "INR 7000");
    return Response.json({ ok: true, sections: SAMPLE_SECTIONS });
  };

  return {
    ...elements,
    tabs,
    clipboardText: () => clipboardText
  };
}

async function loadScript() {
  const url = new URL("../public/script.js", import.meta.url);
  url.searchParams.set("testRun", crypto.randomUUID());
  await import(url.href);
}

test("agent UI renders generated sections, switches tabs, supports keyboard tabs, and copies the active section", async () => {
  const dom = setupDom();
  await loadScript();

  await dom.agentForm.dispatch("submit", {
    preventDefault() {}
  });

  assert.equal(dom.agentStatus.textContent, "Pipeline loop generated. Review before using anything in campaigns.");
  assert.equal(dom.outputTitle.textContent, "Pipeline Brief");
  assert.match(dom.agentOutput.innerHTML, /<h3>Assumptions<\/h3>/);
  assert.match(dom.agentOutput.innerHTML, /<strong>Offer<\/strong>/);
  assert.match(dom.agentOutput.innerHTML, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(dom.agentOutput.innerHTML, /<script>/);
  assert.equal(dom.copyButton.disabled, false);
  assert.equal(dom.outputEmpty.hidden, true);

  await dom.tabs[1].dispatch("click");
  assert.equal(dom.outputTitle.textContent, "Implementation Checklist");
  assert.match(dom.agentOutput.innerHTML, /<ul><li>Checklist body<\/li><\/ul>/);
  assert.equal(dom.tabs[1].getAttribute("aria-selected"), "true");

  await dom.tabs[1].dispatch("keydown", {
    key: "ArrowRight",
    preventDefault() {
      this.prevented = true;
    }
  });
  assert.equal(dom.outputTitle.textContent, "Weekly Fix Report");
  assert.match(dom.agentOutput.innerHTML, /<table>/);
  assert.match(dom.agentOutput.innerHTML, /INR 7,000/);
  assert.equal(globalThis.document.activeElement, dom.tabs[2]);
  assert.equal(dom.tabs[2].tabIndex, 0);

  await dom.copyButton.dispatch("click");
  assert.equal(dom.clipboardText(), SAMPLE_SECTIONS.weeklyFixReport);
});

const AI_SEARCH_STATES = ["found", "wrong", "absent", "not-tested"];

test("AI-search evidence fixture satisfies the report record contract", () => {
  assert.equal(AI_SEARCH_FIXTURE.check_id, "ai-search-visibility");
  assert.equal(AI_SEARCH_FIXTURE.kind, "specimen");
  assert.ok(Array.isArray(AI_SEARCH_FIXTURE.records) && AI_SEARCH_FIXTURE.records.length > 0);

  const ids = new Set();
  for (const record of AI_SEARCH_FIXTURE.records) {
    assert.equal(typeof record.id, "string");
    assert.ok(!ids.has(record.id), `duplicate record id ${record.id}`);
    ids.add(record.id);

    assert.ok(AI_SEARCH_STATES.includes(record.state), `state must be one of ${AI_SEARCH_STATES}`);
    assert.equal(typeof record.surface, "string");
    assert.ok(record.surface.length > 0);

    if (record.state === "not-tested") {
      assert.equal(record.prompt, undefined, "not-tested records must not carry a prompt");
      assert.equal(record.evidence, undefined, "not-tested records must not carry evidence");
      assert.equal(record.fix, undefined, "not-tested records must not carry a fix");
      assert.equal(typeof record.reason, "string");
      assert.ok(record.reason.length > 0);
    } else {
      assert.equal(typeof record.prompt, "string");
      assert.ok(record.prompt.length > 0);
      assert.equal(typeof record.tested_at, "string");
      assert.ok(record.tested_at.length > 0);
      assert.equal(typeof record.evidence?.quote, "string");
      assert.ok(record.evidence.quote.length > 0);
      assert.equal(typeof record.evidence.source, "string");
      assert.ok(record.evidence.source.length > 0);
      if (record.fix !== undefined) {
        assert.ok(["wrong", "absent"].includes(record.state), "fixes require wrong or absent evidence");
      }
    }
  }
});

class FakeNode {
  constructor(tag = "") {
    this.tagName = tag;
    this.children = [];
    this.dataset = {};
    this.className = "";
    this.textContent = "";
    this.attributes = new Map();
  }

  appendChild(node) {
    this.children.push(node);
    return node;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    if (name.startsWith("data-")) {
      const key = name
        .slice(5)
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      return this.dataset[key];
    }
    return this.attributes.get(name) ?? null;
  }
}

class FakeContainer extends FakeNode {
  replaceChildren(...nodes) {
    this.children = [...nodes];
  }
}

function auditDom() {
  const container = new FakeContainer();
  const evidenceScript = new FakeElement({ textContent: JSON.stringify(AI_SEARCH_FIXTURE) });
  globalThis.document = {
    readyState: "complete",
    activeElement: null,
    createElement(tag) {
      return new FakeNode(tag);
    },
    querySelector(selector) {
      if (selector === "#ai-search-evidence") return evidenceScript;
      if (selector === "#ai-search-report") return container;
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {}
  };
  return container;
}

async function loadAuditScript() {
  const url = new URL("../public/audit.js", import.meta.url);
  url.searchParams.set("testRun", crypto.randomUUID());
  return import(url.href);
}

function walk(node, visit) {
  visit(node);
  for (const child of node.children || []) walk(child, visit);
}

test("audit page renders the specimen AI-search report with all four states", async () => {
  const container = auditDom();
  await loadAuditScript();

  const rows = container.children.filter((node) => node.className === "row");
  assert.equal(rows.length, 4);
  assert.deepEqual(rows.map((row) => row.dataset.aiState).sort(), ["absent", "found", "not-tested", "wrong"]);

  const found = rows.find((row) => row.dataset.aiState === "found");
  assert.match(found.children[0].children[0].textContent, /Which private GP practice in Mayfair is open in the evening\?/);
  assert.match(found.children[0].children[2].textContent, /ChatGPT with browsing · 2026-07-28/);
  assert.equal(found.children[1].textContent, "Found");

  const notTested = rows.find((row) => row.dataset.aiState === "not-tested");
  assert.equal(notTested.children[0].children[0].textContent, "Gemini");
  assert.equal(notTested.children[0].children[2].textContent, "2026-07-28");
  assert.equal(notTested.children[1].textContent, "Not tested");

  const micros = container.children.filter((node) => node.className === "micro");
  assert.equal(micros.length, 4);
  assert.equal(micros.filter((line) => line.textContent.startsWith("Evidence — “")).length, 3);
  assert.equal(micros.filter((line) => line.textContent.includes(" Fix — ")).length, 2);

  const foundEvidence = micros[0];
  assert.match(foundEvidence.textContent, /The Marlowe Clinic in Mayfair keeps evening hours/);
  assert.match(foundEvidence.textContent, /marlowe-clinic\.example/);
  assert.doesNotMatch(foundEvidence.textContent, /Fix —/);

  const wrongFix = micros[1];
  assert.match(wrongFix.textContent, /Fix — State the first-appointment price on the homepage/);

  const notTestedLine = micros[3];
  assert.equal(notTestedLine.textContent, "Not tested — The surface required a signed-in account during this audit window. The record is marked not tested rather than guessed.");
});

test("renderAiSearchReport writes fixture text as text, never as markup", async () => {
  const container = auditDom();
  const auditModule = await loadAuditScript();
  const hostile = [{
    id: "hostile-1",
    state: "wrong",
    prompt: "<script>alert(1)</script>",
    surface: "<b>Surface</b>",
    tested_at: "2026-01-01",
    evidence: {
      quote: "<img src=x onerror=alert(2)>",
      source: "https://example.com/?q=<i>"
    },
    fix: "<i>fix</i>"
  }];

  const count = auditModule.renderAiSearchReport(container, hostile);
  assert.equal(count, 1);

  const forbiddenTags = [];
  walk(container, (node) => {
    const tag = String(node.tagName || "").toLowerCase();
    if (["script", "img", "b", "i", "iframe"].includes(tag)) forbiddenTags.push(tag);
  });
  assert.deepEqual(forbiddenTags, []);

  const row = container.children[0];
  assert.equal(row.dataset.aiState, "wrong");
  assert.equal(row.children[0].children[0].textContent, "<script>alert(1)</script>");
  assert.match(row.children[0].children[2].textContent, /<b>Surface<\/b> · 2026-01-01/);
  assert.match(container.children[1].textContent, /<img src=x onerror=alert\(2\)>/);
  assert.match(container.children[1].textContent, /Fix — <i>fix<\/i>/);
});
