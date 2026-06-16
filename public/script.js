const signupForm = document.querySelector("[data-signup-form]");
const signupStatus = document.querySelector("[data-signup-status]");

const statusFromUrl = new URLSearchParams(window.location.search).get("signal");
if (signupStatus && statusFromUrl === "saved") {
  signupStatus.textContent = "Signal saved. We will write when the door opens.";
}
if (signupStatus && statusFromUrl === "invalid") {
  signupStatus.textContent = "That email did not look right. Try once more.";
}

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(signupForm);
  const email = String(formData.get("email") || "").trim();
  const button = signupForm.querySelector("button");

  if (!email || !button) return;

  signupForm.dataset.state = "loading";
  button.disabled = true;
  signupStatus.textContent = "Saving the signal...";

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
    signupStatus.textContent = "Signal saved. We will write when the door opens.";
    signupForm.reset();
  } catch {
    signupForm.dataset.state = "error";
    signupStatus.textContent = "That did not save. Try again in a moment.";
  } finally {
    button.disabled = false;
  }
});
