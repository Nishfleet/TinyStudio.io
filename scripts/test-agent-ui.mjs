import assert from "node:assert/strict";
import test from "node:test";

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

function aiRowHtml(html, checkId) {
  const rows = html.split('<div class="row"');
  const row = rows.find((chunk) => chunk.includes(`data-check="${checkId}"`));
  assert.ok(row, `rendered output must include a row for ${checkId}`);
  return `<div class="row"${row}`;
}

async function loadAuditScript() {
  return await import(new URL("../public/audit.js", import.meta.url).href);
}

test("AI-search pass defines exactly the four states, with absent distinct from not-tested", async () => {
  const audit = await loadAuditScript();
  assert.deepEqual(Object.keys(audit.AI_STATES), ["found", "wrong", "absent", "not-tested"]);
  assert.equal(audit.AI_STATES.absent.label, "Absent");
  assert.equal(audit.AI_STATES["not-tested"].label, "Not tested");
  assert.notEqual(audit.AI_STATES.absent.meaning, audit.AI_STATES["not-tested"].meaning);
  assert.match(audit.AI_STATES.absent.meaning, /answer is not on the page/);
  assert.match(audit.AI_STATES["not-tested"].meaning, /never read/);
  for (const state of Object.keys(audit.AI_STATES)) {
    assert.ok(audit.AI_CHECKS.some((check) => check.outcome === state), `sample must exercise ${state}`);
  }
});

test("AI-search pass renders every check row with its outcome state and label", async () => {
  const audit = await loadAuditScript();
  const html = audit.aiPassHtml();
  assert.match(html, /class="row"/);
  for (const check of audit.AI_CHECKS) {
    const row = aiRowHtml(html, check.id);
    assert.match(row, new RegExp(`data-state="${check.outcome}"`));
    assert.match(row, new RegExp(`>${audit.AI_STATES[check.outcome].label}</div>`));
    assert.match(row, new RegExp(check.prompt));
  }
});

test("AI-search pass renders absent with a fix and not-tested with none", async () => {
  const audit = await loadAuditScript();
  const html = audit.aiPassHtml();
  const notTested = audit.AI_CHECKS.filter((check) => check.outcome === "not-tested");
  const absent = audit.AI_CHECKS.filter((check) => check.outcome === "absent");
  assert.ok(notTested.length >= 2);
  assert.ok(absent.length >= 2);
  for (const check of notTested) {
    assert.equal(check.fix, "");
    const row = aiRowHtml(html, check.id);
    assert.doesNotMatch(row, /Fix: /);
    assert.match(row, /do not recommend changes to a page we could not read/);
    assert.match(row, /HTTP 403/);
  }
  for (const check of absent) {
    assert.ok(check.fix.length > 0);
    assert.match(aiRowHtml(html, check.id), /Fix: /);
  }
});

test("AI-search pass binds every check to named fixture evidence with a working link", async () => {
  const audit = await loadAuditScript();
  const html = audit.aiPassHtml();
  for (const check of audit.AI_CHECKS) {
    assert.ok(check.prompt.length > 0, `${check.id} must name its question`);
    assert.ok(check.quotes.length > 0, `${check.id} must carry source quotes`);
    assert.match(html, new RegExp(`id="ev-${check.id}"`));
    assert.match(html, new RegExp(`href="#ev-${check.id}"`));
    assert.match(html, new RegExp(`>${check.fixture}</a>`));
    const row = aiRowHtml(html, check.id);
    assert.match(row, new RegExp(check.fixture));
    assert.match(row, new RegExp(check.quotes[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("AI-search pass renders into its mount and escapes quotes", async () => {
  const audit = await loadAuditScript();
  assert.equal(audit.esc('<b>&"'), "&lt;b&gt;&amp;&quot;");
  const container = new FakeElement();
  const html = audit.renderAiPass(container);
  assert.equal(container.innerHTML, html);
  assert.ok(html.includes("&ldquo;") && html.includes("&rdquo;"));
  assert.doesNotMatch(html, /<script/);
});
