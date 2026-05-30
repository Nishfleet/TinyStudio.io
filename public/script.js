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
