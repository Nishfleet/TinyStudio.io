const agentForm = document.querySelector("[data-agent-form]");
const agentStatus = document.querySelector("[data-agent-status]");
const agentOutput = document.querySelector("[data-agent-output]");
const outputEmpty = document.querySelector("[data-output-empty]");
const copyButton = document.querySelector("[data-copy-output]");

const EMPTY_OUTPUT_TEXT =
  "Your generated system will appear here: readiness diagnosis, funnel path, audience/pain map, four creative tests, lead form, follow-up, CRM, tracking, and decision rules.";
const ERROR_MESSAGES = {
  ai_unavailable: "The AI desk is not available right now. Try again shortly.",
  cross_site_blocked: "Open TinyStudio.io directly and run the agents from this page.",
  daily_email_limit: "That email has reached today's run limit. Try again tomorrow.",
  daily_ip_limit: "This connection has reached today's run limit. Try again tomorrow.",
  empty_agent_output: "The agents could not produce a useful brief. Try again in a moment.",
  invalid_email: "Add a valid email address.",
  invalid_input: "Add email, business, offer, and target buyer first.",
  method_not_allowed: "That request type is not supported.",
  request_too_large: "That intake is too long. Shorten it and run the agents again.",
  same_origin_required: "Open TinyStudio.io directly and run the agents from this page.",
  storage_unavailable: "The signup and run tracker is unavailable right now. Try again shortly.",
  unsupported_media_type: "Refresh the page and run the agents again."
};

let copyResetTimer;

function setStatus(message, state = "") {
  if (!agentStatus || !agentForm) return;
  agentStatus.textContent = message;
  if (state) {
    agentForm.dataset.state = state;
  } else {
    delete agentForm.dataset.state;
  }
}

function resetCopyButton() {
  if (!copyButton) return;
  if (copyResetTimer) {
    clearTimeout(copyResetTimer);
    copyResetTimer = undefined;
  }
  copyButton.textContent = "Copy brief";
  copyButton.disabled = true;
}

function showEmpty(message = EMPTY_OUTPUT_TEXT) {
  if (!agentOutput || !outputEmpty) return;
  agentOutput.textContent = "";
  agentOutput.hidden = true;
  outputEmpty.textContent = message;
  outputEmpty.hidden = false;
  resetCopyButton();
}

function showBrief(brief) {
  if (!agentOutput || !outputEmpty || !copyButton) return;
  agentOutput.textContent = brief;
  agentOutput.hidden = false;
  outputEmpty.hidden = true;
  copyButton.textContent = "Copy brief";
  copyButton.disabled = false;
}

agentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = agentForm.querySelector("button[type='submit']");
  const formData = new FormData(agentForm);
  const payload = Object.fromEntries(formData.entries());

  if (!payload.email || !payload.business || !payload.offer || !payload.audience) {
    showEmpty("Complete the required fields to generate a fresh pipeline brief.");
    setStatus("Add email, business, offer, and target buyer first.", "error");
    return;
  }

  submitButton.disabled = true;
  showEmpty("Agents are building a fresh pipeline brief...");
  setStatus("Agents are building the pipeline brief...");

  try {
    const response = await fetch("/api/agent-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.ok) {
      throw new Error(data.message || ERROR_MESSAGES[data.error] || "The agents could not finish.");
    }

    showBrief(data.brief);
    setStatus("Pipeline Brief generated. Review before using anything in campaigns.", "saved");
  } catch (error) {
    showEmpty("No current brief is available after that failed run. Fix the issue and run the agents again.");
    setStatus(error.message || "That did not work. Try again in a moment.", "error");
  } finally {
    submitButton.disabled = false;
  }
});

copyButton?.addEventListener("click", async () => {
  if (!agentOutput?.textContent) return;

  try {
    await navigator.clipboard.writeText(agentOutput.textContent);
    copyButton.textContent = "Copied";
    if (copyResetTimer) clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copyButton.textContent = "Copy brief";
      copyResetTimer = undefined;
    }, 1400);
  } catch {
    setStatus("Copy failed. Select the brief and copy manually.", "error");
  }
});
