const header = document.querySelector(".site-header");

window.addEventListener(
  "scroll",
  () => {
    header?.toggleAttribute("data-scrolled", window.scrollY > 12);
  },
  { passive: true }
);

const signupForm = document.querySelector("[data-signup-form]");
const signupStatus = document.querySelector("[data-signup-status]");

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(signupForm);
  const email = String(formData.get("email") || "").trim();
  const button = signupForm.querySelector("button");

  if (!email) return;

  signupForm.dataset.state = "loading";
  button.disabled = true;
  signupStatus.textContent = "Opening the signal...";

  try {
    const response = await fetch("/api/signups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    signupForm.dataset.state = "saved";
    signupStatus.textContent = "You're on the leak list. Watch your inbox.";
    signupForm.reset();
  } catch {
    signupForm.dataset.state = "error";
    signupStatus.textContent = "That did not save. Try again in a moment.";
  } finally {
    button.disabled = false;
  }
});

const pipelineIntakeForm = document.querySelector("[data-pipeline-intake-form]");
const pipelineIntakeStatus = document.querySelector("[data-pipeline-intake-status]");
const pipelineAuditOutput = document.querySelector("[data-pipeline-audit-output]");
const pipelineAuditText = document.querySelector("[data-pipeline-audit-text]");
const pipelineAuditEmail = document.querySelector("[data-pipeline-audit-email]");

const compactValue = (formData, key) => String(formData.get(key) || "").trim();

pipelineIntakeForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(pipelineIntakeForm);
  const business = compactValue(formData, "business");
  const offer = compactValue(formData, "offer");
  const funnel = compactValue(formData, "funnel");
  const market = compactValue(formData, "market");
  const followup = compactValue(formData, "followup");
  const proof = compactValue(formData, "proof");
  const competitors = compactValue(formData, "competitors");

  if (!business || !offer) {
    pipelineIntakeStatus.textContent = "Add at least the business and offer context first.";
    return;
  }

  const brief = [
    "TinyStudio Pipeline Audit request",
    "",
    "Business and website:",
    business || "Not provided",
    "",
    "High-ticket offer:",
    offer || "Not provided",
    "",
    "Lead source and funnel today:",
    funnel || "Not provided",
    "",
    "Market and test plan preference:",
    market || "Not provided",
    "",
    "Follow-up and CRM today:",
    followup || "Not provided",
    "",
    "Proof and constraints:",
    proof || "Not provided",
    "",
    "Competitors to watch:",
    competitors || "Not provided",
    "",
    "Requested audit outputs:",
    "- Offer score",
    "- Cold-traffic readiness diagnosis",
    "- Recommended funnel path",
    "- Competitor watchlist and angle map",
    "- Ad hooks, scripts, and creative briefs",
    "- Lead qualification questions",
    "- Follow-up sequence map",
    "- Booking, CRM, tracking, and weekly fix checklist",
    "",
    "India High-Ticket Test Plan Generator:",
    "- Test window: draft either 7 days or 15 days.",
    "- India test budget: INR 500-INR 1,000/day for message and funnel validation.",
    "- First creative batch: 4 creatives = 2 audiences x 2 pain points.",
    "- Creative format: raw founder video, plain Canva, or simple captioned video first.",
    "- Script structure: audience callout, problem, pain, proof, CTA.",
    "- Hook rule: iterate first 5-second hooks before rewriting the full body.",
    "",
    "Hook matrix draft:",
    "- Broad audience pass: founders, coaches, consultants, agencies.",
    "- Niche variants after a pain works: SEO agency, IT agency, personal branding agency, bookkeeping firm, fitness coach.",
    "- Keep the body mostly stable while testing pain-point hooks.",
    "",
    "Funnel recommendation:",
    "- India-first: test WhatsApp message ads or Meta lead forms before landing pages.",
    "- Use WhatsApp when direct conversation and fast follow-up matter.",
    "- Use lead forms when structured goal, budget, urgency, and availability data are needed before calls.",
    "- Use profile/traffic campaigns alongside lead gen only when the founder profile is a strong trust asset.",
    "- International: validate channel preference instead of assuming WhatsApp.",
    "",
    "Lead form questions:",
    "- What goal are you trying to solve now?",
    "- What budget range is already realistic for this problem?",
    "- How urgent is the problem?",
    "- Which call time works best: morning, afternoon, or evening?",
    "- Guardrail: the lowest budget choice should still be qualified for the actual offer.",
    "",
    "Setter and closer workflow:",
    "- Lead enters CRM or sheet.",
    "- Setter calls fast, qualifies business model, sends booking link, and confirms the call.",
    "- Prospect watches a short pre-sales video before the closer call where appropriate.",
    "- Closer handles qualified calls only.",
    "- Reminder flow: WhatsApp booking link, day-before or same-day confirmation, reschedule if unavailable, no-show recovery.",
    "",
    "Lead-to-call metric ladder:",
    "- Track spend, raw leads, qualified leads, booked calls, showed calls, closed deals, cash collected, and revenue.",
    "- Derive cost per raw lead, cost per qualified lead, cost per booked call, cost per showed call, CAC, revenue per client, and cash collected.",
    "- Decision rules should separate message failure, lead-quality failure, follow-up failure, booking failure, show-up failure, and close-feedback failure.",
    "- Advanced tracking stays guided until booked-call, meeting-done, closed-won, Pixel/CAPI permissions, consent, and implementation are verified.",
    "",
    "Safety notes:",
    "- No ROAS, revenue, or booked-call guarantee requested",
    "- No ad spend or campaign publishing requested",
    "- No private credentials included"
  ].join("\n");

  pipelineAuditText.textContent = brief;
  pipelineAuditOutput.hidden = false;
  pipelineAuditEmail.href = `mailto:hello@tinystudio.io?subject=${encodeURIComponent("TinyStudio Pipeline Audit")}&body=${encodeURIComponent(brief)}`;
  pipelineIntakeStatus.textContent = "Audit brief built. Review it below, then email it when ready.";
});
