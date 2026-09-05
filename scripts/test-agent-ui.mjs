import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const SAMPLE_SECTIONS = {
  pipelineBrief: "# Pipeline Brief\n\n## Assumptions\n- **Offer**: <script>alert(1)</script>\n\nBrief body",
  implementationChecklist: "# Implementation Checklist\n\n- Checklist body",
  weeklyFixReport: "# Weekly Fix Report\n\n| Metric | Current week |\n| --- | --- |\n| Spend | INR 7,000 |\n\nWeekly body"
};

class FakeElement {
  constructor({ textContent = "", dataset = {}, disabled = false, hidden = false, value = "", tag = "", isText = false, isFragment = false } = {}) {
    this.textContent = textContent;
    this.dataset = dataset;
    this.disabled = disabled;
    this.hidden = hidden;
    this.value = value;
    this.tag = tag;
    this.isText = isText;
    this.isFragment = isFragment;
    this.children = [];
    this.tabIndex = 0;
    this.attributes = new Map();
    this.listeners = new Map();
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...nodes) {
    const flat = [];
    for (const node of nodes) {
      if (node && node.isFragment) flat.push(...node.children);
      else flat.push(node);
    }
    this.children = flat;
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

// --- AI-search visibility pass (audit page ledger) ---

const AI_SEARCH_FIXTURE = JSON.parse(
  readFileSync(new URL("../evidence-fixtures/ai-search/ledger.json", import.meta.url), "utf8")
);

function setupAuditDom() {
  const rowsHost = new FakeElement({ tag: "div" });
  const selectorMap = new Map([["[data-ai-search-rows]", rowsHost]]);

  globalThis.document = {
    readyState: "complete",
    activeElement: null,
    createElement(tag) {
      return new FakeElement({ tag });
    },
    createTextNode(text) {
      return new FakeElement({ textContent: text, isText: true });
    },
    createDocumentFragment() {
      return new FakeElement({ tag: "fragment", isFragment: true });
    },
    querySelector(selector) {
      return selectorMap.get(selector) || null;
    },
    querySelectorAll() {
      return [];
    }
  };
  globalThis.window = globalThis;

  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error("audit.js must not fetch");
  };

  return { rowsHost, fetchCalls: () => fetchCalls };
}

async function loadAuditScript() {
  const url = new URL("../public/audit.js", import.meta.url);
  url.searchParams.set("testRun", crypto.randomUUID());
  await import(url.href);
}

function auditTextOf(element) {
  if (Array.isArray(element)) return element.map(auditTextOf).join("");
  if (element.isText) return element.textContent;
  if (element.children.length) return element.children.map(auditTextOf).join("");
  return element.textContent || "";
}

function auditRowParts(row) {
  const t = row.children[0];
  const state = row.children[1].textContent;
  const head = auditTextOf(t.children[0]);
  const fixElement = t.children.find((child) => child.tag === "i");
  return {
    state,
    head,
    body: auditTextOf(t.children.slice(2)),
    fix: fixElement ? auditTextOf(fixElement.children) : null
  };
}

test("audit page ledger renders every captured question with a state label, evidence, and a fix only where supported", async () => {
  const dom = setupAuditDom();
  await loadAuditScript();

  assert.equal(dom.rowsHost.children.length, AI_SEARCH_FIXTURE.questions.length);
  assert.equal(dom.fetchCalls(), 0);

  AI_SEARCH_FIXTURE.questions.forEach((question, index) => {
    const row = auditRowParts(dom.rowsHost.children[index]);
    assert.ok(row.head.includes(question.question), `row ${question.id} must show the named question`);
    if (question.state === "not-tested") {
      assert.equal(row.state, "not tested");
      assert.ok(row.body.includes("Not run in this pass."), `row ${question.id} must say the question was not run`);
      assert.equal(row.fix, null, `not-tested row ${question.id} must not carry a fix`);
    } else {
      assert.ok(row.body.includes(question.answer), `row ${question.id} must quote the captured answer`);
      if (question.fix) {
        assert.ok(row.fix.startsWith("Fix \u2014 "), `row ${question.id} fix must be labeled`);
      } else {
        assert.equal(row.fix, null, `row ${question.id} must not invent a fix`);
      }
    }
  });

  const expectedStates = AI_SEARCH_FIXTURE.questions.map((question) =>
    question.state === "not-tested" ? "not tested" : question.state
  );
  const renderedStates = dom.rowsHost.children.map((row) => row.children[1].textContent);
  assert.deepEqual(renderedStates, expectedStates);
});

test("audit page embedded ledger matches the captured-evidence fixture", async () => {
  const dom = setupAuditDom();
  await loadAuditScript();

  assert.deepEqual(globalThis.AI_SEARCH_LEDGER, AI_SEARCH_FIXTURE);
  assert.equal(dom.fetchCalls(), 0);
});
