import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

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

// ---- AI-search evidence artifact ---------------------------------------

const AI_QUESTIONS = JSON.parse(
  readFileSync(new URL("../evidence-fixtures/ai-search/controlled-questions.json", import.meta.url), "utf8")
);
const AI_EVIDENCE = JSON.parse(
  readFileSync(new URL("../evidence-fixtures/ai-search/evidence.json", import.meta.url), "utf8")
);

function auditDocumentStub({ mount = null, source = null } = {}) {
  return {
    readyState: "complete",
    querySelector(selector) {
      return selector === "[data-ai-search-evidence]" ? mount : null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById(id) {
      return id === "ai-search-evidence" ? source : null;
    }
  };
}

async function loadAuditScript() {
  const url = new URL("../public/audit.js", import.meta.url);
  url.searchParams.set("testRun", crypto.randomUUID());
  await import(url.href);
  return globalThis.TinyStudioAudit;
}

test("AI-search fixture runs carry the right structure for their states", () => {
  const states = [...new Set(AI_EVIDENCE.runs.map((run) => run.state))].sort();
  assert.deepEqual(states, ["absent", "not-tested", "wrong"]);

  const questionIds = new Set(AI_QUESTIONS.questions.map((question) => question.id));
  const engineIds = new Set(AI_EVIDENCE.engines.map((engine) => engine.id));

  for (const run of AI_EVIDENCE.runs) {
    assert.ok(questionIds.has(run.questionId), `known question for ${run.questionId}/${run.engine}`);
    assert.ok(engineIds.has(run.engine), `known engine for ${run.questionId}/${run.engine}`);
    if (run.state === "not-tested") {
      assert.ok(run.reason, `not-tested reason for ${run.questionId}/${run.engine}`);
      assert.equal(run.captured, undefined, `not-tested must not capture an answer for ${run.questionId}/${run.engine}`);
      assert.deepEqual(run.sources || [], [], `not-tested must not cite sources for ${run.questionId}/${run.engine}`);
    } else {
      assert.ok(run.captured, `captured observation for ${run.questionId}/${run.engine}`);
      if (run.state !== "absent") {
        assert.ok(run.sources.length, `cited sources for ${run.questionId}/${run.engine}`);
      }
    }
  }

  for (const question of AI_QUESTIONS.questions) {
    assert.ok(question.id && question.name && question.prompt && question.truth, `named question ${question.id}`);
  }
});

test("AI-search q5 wrong run under-claims instead of over-claiming its citation", () => {
  const run = AI_EVIDENCE.runs.find(
    (candidate) => candidate.questionId === "q5-what-is-tinystudio-io" && candidate.engine === "google"
  );
  assert.ok(run, "google/q5 run exists");
  assert.equal(run.state, "wrong");
  assert.ok(run.remediation, "q5 carries a remediation note");
  assert.equal(run.remediation.page, undefined, "q5 must not claim a page-specific fix");
  assert.match(run.remediation.text, /cited page is the homepage/);
  assert.doesNotMatch(
    run.remediation.text,
    /built from the homepage's own description/,
    "q5 must not claim the homepage's own description produced the answer"
  );
  assert.match(run.remediation.text, /no page-specific fix is claimed/);
});

test("AI-search renderer shows all four states and keeps not-tested distinct from absent", async () => {
  globalThis.document = auditDocumentStub();
  const api = await loadAuditScript();
  const data = {
    questions: { questions: [{ id: "q1", name: "Q", prompt: "p", truth: "t" }] },
    evidence: {
      testedOn: "2026-08-06",
      business: { name: "B", site: "https://tinystudio.io/" },
      engines: [{ id: "e1", name: "E" }],
      runs: [
        { questionId: "q1", engine: "e1", state: "found", captured: "x", sources: [{ title: "me", url: "https://tinystudio.io/" }] },
        { questionId: "q1", engine: "e1", state: "wrong", captured: "y", sources: [{ title: "other", url: "https://other.example/" }] },
        { questionId: "q1", engine: "e1", state: "absent", captured: "no AI answer came back" },
        { questionId: "q1", engine: "e1", state: "not-tested", reason: "sign-in required" }
      ]
    }
  };
  const html = api.renderArtifact(data);

  for (const state of ["found", "wrong", "absent", "not-tested"]) {
    assert.match(html, new RegExp(`data-state="${state}"`), `rendered state ${state}`);
  }
  assert.match(html, />Found</);
  assert.match(html, />Wrong</);
  assert.match(html, />Absent</);
  assert.match(html, />Not tested</);
  assert.match(html, /The questions, exactly as asked/);

  const chunks = html.split('<div class="row"').slice(1);
  assert.equal(chunks.length, 4, "all four states render as rows");
  for (const chunk of chunks) {
    const state = chunk.match(/data-state="([^"]+)"/)?.[1];
    assert.ok(state, "every row carries a state");
    if (state === "not-tested") {
      assert.match(chunk, /Not run &mdash;/);
      assert.doesNotMatch(chunk, /Answer \(verbatim\)|Sources:/);
    } else if (state === "absent") {
      assert.match(chunk, /Observed:/);
      assert.doesNotMatch(chunk, /Not run/);
    } else {
      assert.match(chunk, /Answer \(verbatim\):/);
      assert.match(chunk, /Sources:/);
    }
  }
});

test("AI-search renderer escapes hostile text and only links safe http(s) URLs", async () => {
  globalThis.document = auditDocumentStub();
  const api = await loadAuditScript();
  const hostile = {
    questions: {
      questions: [{ id: "q1", name: "<script>steal()</script>", prompt: 'p"rompt', truth: "t" }]
    },
    evidence: {
      testedOn: "2026-08-06",
      business: { name: "<b>X</b>", site: "https://tinystudio.io/" },
      engines: [{ id: "e1", name: "Engine", surface: "Web" }],
      runs: [
        {
          questionId: "q1",
          engine: "e1",
          state: "found",
          captured: '<script>alert(1)</script> & "quoted"',
          sources: [
            { title: "<i>bad</i>", url: "javascript:alert(1)" },
            { title: "https://example.com/", url: "https://example.com/path" },
            { title: "spaced", url: "https://exa mple.com/" }
          ]
        },
        {
          questionId: "q1",
          engine: "e1",
          state: "not-tested",
          reason: "because <script> was blocked"
        }
      ]
    }
  };

  const html = api.renderArtifact(hostile);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<i>bad|javascript:/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /&lt;i&gt;bad&lt;\/i&gt;/);
  assert.match(html, /href="https:\/\/example.com\/path"/);
  assert.doesNotMatch(html, /href="https:\/\/exa mple/);
});

test("AI-search renderer shows remediation only when evidence supports it", async () => {
  globalThis.document = auditDocumentStub();
  const api = await loadAuditScript();
  const base = {
    questions: { questions: [{ id: "q1", name: "Q", prompt: "p", truth: "t" }] },
    evidence: {
      testedOn: "2026-08-06",
      business: { name: "B", site: "https://tinystudio.io/" },
      engines: [{ id: "e1", name: "E" }],
      runs: []
    }
  };

  const withoutRemediation = {
    ...base,
    evidence: {
      ...base.evidence,
      runs: [{ questionId: "q1", engine: "e1", state: "absent", captured: "nothing came back" }]
    }
  };
  assert.doesNotMatch(api.renderArtifact(withoutRemediation), /Remediation:/);

  const externalOnly = {
    ...base,
    evidence: {
      ...base.evidence,
      runs: [
        {
          questionId: "q1",
          engine: "e1",
          state: "wrong",
          captured: "x",
          sources: [{ title: "other", url: "https://other.example/" }],
          remediation: { page: "/", text: "fix it" }
        }
      ]
    }
  };
  const externalHtml = api.renderArtifact(externalOnly);
  assert.match(externalHtml, /Remediation: fix it/);
  assert.doesNotMatch(externalHtml, /href="https:\/\/tinystudio\.io\/"/);

  const ownSite = {
    ...base,
    evidence: {
      ...base.evidence,
      runs: [
        {
          questionId: "q1",
          engine: "e1",
          state: "found",
          captured: "x",
          sources: [{ title: "me", url: "https://tinystudio.io/" }],
          remediation: { page: "/pricing.html", text: "fix it" }
        }
      ]
    }
  };
  assert.match(api.renderArtifact(ownSite), /href="https:\/\/tinystudio\.io\/pricing\.html"/);
});

test("AI-search renderer boots from the JSON embedded on the audit page", async () => {
  const mount = { innerHTML: "" };
  const source = { textContent: JSON.stringify({ questions: AI_QUESTIONS, evidence: AI_EVIDENCE }) };
  globalThis.document = auditDocumentStub({ mount, source });
  const api = await loadAuditScript();
  assert.ok(api, "audit script exposes the renderer");
  assert.match(mount.innerHTML, /data-state="wrong"/);
  assert.match(mount.innerHTML, /data-state="not-tested"/);
});

test("AI-search remediation links resolve defensively and reject cross-host or invalid pages", async () => {
  globalThis.document = auditDocumentStub();
  const api = await loadAuditScript();
  const base = {
    questions: { questions: [{ id: "q1", name: "Q", prompt: "p", truth: "t" }] },
    evidence: {
      testedOn: "2026-08-06",
      business: { name: "B", site: "https://tinystudio.io/" },
      engines: [{ id: "e1", name: "E" }],
      runs: []
    }
  };

  const noBusiness = {
    ...base,
    evidence: {
      ...base.evidence,
      business: undefined,
      runs: [
        {
          questionId: "q1",
          engine: "e1",
          state: "wrong",
          captured: "x",
          sources: [{ title: "me", url: "https://tinystudio.io/" }],
          remediation: { page: "/pricing.html", text: "fix it" }
        }
      ]
    }
  };
  const noBusinessHtml = api.renderArtifact(noBusiness);
  assert.match(noBusinessHtml, /Remediation: fix it/);
  assert.doesNotMatch(noBusinessHtml, /href="https:\/\/tinystudio\.io\/pricing\.html"/);

  const crossHost = {
    ...base,
    evidence: {
      ...base.evidence,
      runs: [
        {
          questionId: "q1",
          engine: "e1",
          state: "found",
          captured: "x",
          sources: [{ title: "me", url: "https://tinystudio.io/" }],
          remediation: { page: "https://evil.example/pricing.html", text: "fix it" }
        }
      ]
    }
  };
  const crossHostHtml = api.renderArtifact(crossHost);
  assert.match(crossHostHtml, /Remediation: fix it/);
  assert.doesNotMatch(crossHostHtml, /href="https:\/\/evil\.example/);

  const invalid = {
    ...base,
    evidence: {
      ...base.evidence,
      runs: [
        {
          questionId: "q1",
          engine: "e1",
          state: "found",
          captured: "x",
          sources: [{ title: "me", url: "https://tinystudio.io/" }],
          remediation: { page: "javascript:alert(1)", text: "fix it" }
        }
      ]
    }
  };
  const invalidHtml = api.renderArtifact(invalid);
  assert.match(invalidHtml, /Remediation: fix it/);
  assert.doesNotMatch(invalidHtml, /javascript:/);
});
