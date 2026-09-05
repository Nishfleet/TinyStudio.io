import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const AI_FIXTURE = JSON.parse(
  readFileSync(new URL("../evidence-fixtures/ai-search/fixture.json", import.meta.url), "utf8")
);
const AUDIT_HTML = readFileSync(new URL("../public/audit.html", import.meta.url), "utf8").replace(/&amp;/g, "&");
const ALLOWED_STATES = ["found", "misrepresented", "absent", "not-tested"];

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

test("ai-search fixture is a controlled, fictional business with four distinct states", () => {
  assert.equal(AI_FIXTURE.business.fictional, true, "the fixture business must be fictional");
  assert.equal(AI_FIXTURE.runs.length, 4, "one run per state, four states");
  const states = AI_FIXTURE.runs.map((run) => run.state);
  assert.equal(new Set(states).size, 4, "the four states must be distinct");
  for (const state of states) {
    assert.ok(ALLOWED_STATES.includes(state), `unexpected state ${state}`);
  }
});

test("ai-search fixture: every tested run names prompt, engine, source, date and capture", () => {
  for (const run of AI_FIXTURE.runs) {
    assert.ok(run.id, "each run must carry an id");
    assert.ok(run.prompt, `${run.id} must state the prompt asked`);
    if (run.state === "not-tested") {
      assert.equal(run.capture, null, `${run.id} must carry no capture`);
      assert.equal(run.engine, null, `${run.id} must name no engine`);
      assert.ok(run.reason, `${run.id} must say why it was not tested`);
      continue;
    }
    assert.ok(run.engine, `${run.id} must name the engine checked`);
    assert.ok(run.source, `${run.id} must cite the source URL`);
    assert.match(run.date, /^\d{4}-\d{2}-\d{2}$/, `${run.id} date must be ISO`);
    assert.ok(run.capture, `${run.id} must carry the captured answer`);
    assert.ok(run.evidenceFile, `${run.id} must cite an evidence file`);
    const artifact = JSON.parse(readFileSync(new URL(`../${run.evidenceFile}`, import.meta.url), "utf8"));
    assert.equal(artifact.id, run.id, "evidence artifact id must match the fixture");
    assert.equal(artifact.state, run.state, "evidence artifact state must match the fixture");
    assert.equal(artifact.prompt, run.prompt, "evidence artifact prompt must match the fixture");
    assert.equal(artifact.capture, run.capture, "evidence artifact capture must match the fixture");
    assert.equal(artifact.engine, run.engine, "evidence artifact engine must match the fixture");
    assert.equal(artifact.date, run.date, "evidence artifact date must match the fixture");
    assert.equal(artifact.source, run.source, "evidence artifact source must match the fixture");
  }
});

test("ai-search evidence citations survive validation against the audit page", () => {
  for (const run of AI_FIXTURE.runs) {
    assert.ok(AUDIT_HTML.includes(run.prompt), `audit page must state the prompt for ${run.id}`);
    if (run.capture) {
      assert.ok(AUDIT_HTML.includes(run.capture), `audit page must cite the capture for ${run.id}`);
    }
    if (run.engine) {
      assert.ok(AUDIT_HTML.includes(run.engine), `audit page must name the engine for ${run.id}`);
    }
    if (run.evidenceFile) {
      assert.ok(AUDIT_HTML.includes(run.evidenceFile), `audit page must cite the evidence file for ${run.id}`);
    }
  }
  for (const label of ["found correctly", "misrepresented", "absent", "not tested"]) {
    assert.ok(AUDIT_HTML.includes(label), `audit page must state the ${label} state`);
  }
  for (const boundary of [
    "No ranking or lead guarantee",
    "page-level and evidence-bound",
    "publish anything on your behalf",
    "controlled fixture",
    "signup email"
  ]) {
    assert.ok(AUDIT_HTML.includes(boundary), `audit page must state: ${boundary}`);
  }
});
