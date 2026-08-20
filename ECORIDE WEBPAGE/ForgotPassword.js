// ForgotPassword.js
// Connects the "Reset Password" form to a forgot-password endpoint.
//
// ⚠️ PROVISIONAL — as of writing, the backend has no route for this at all.
// `sendResetEmail(email, resetToken)` exists in src/.../email.js but is never
// called from anywhere (no controller, no route). The endpoint paths below
// are a guess based on:
//   - the /api/v1 prefix pattern confirmed for register/login
//   - the URL shape hardcoded inside sendResetEmail:
//       http://localhost:3000/api/v1/auth/reset-password/${resetToken}
// CONFIRM WITH BACKEND before relying on this. Update FORGOT_PASSWORD_PATH
// below once the real route exists — that should be the only change needed.

const API_BASE = "https://ecoride-backend-0ll4.onrender.com";
const FORGOT_PASSWORD_PATH = "/api/v1/auth/forgot-password"; // unconfirmed

const form = document.getElementById("forgot-password-form");
const statusBox = document.getElementById("status-message");
const resendLink = document.getElementById("resend-reset-link");
const emailInput = document.getElementById("email");

// ---------------------------------------------------------------
// Cooldown so we don't spam the inbox with reset links — same
// pattern as EmailVerification.js, keyed per-email in localStorage.
// ---------------------------------------------------------------
const RESET_COOLDOWN_MS = 30 * 1000; // 30 seconds

function getCooldownRemaining(email) {
  const lastSent = Number(localStorage.getItem(`resetLastSent:${email}`)) || 0;
  const elapsed = Date.now() - lastSent;
  return Math.max(0, RESET_COOLDOWN_MS - elapsed);
}

function markResetSent(email) {
  localStorage.setItem(`resetLastSent:${email}`, String(Date.now()));
}

function showStatus(message, isError = true) {
  statusBox.textContent = message;
  statusBox.classList.toggle("status-error", isError);
  statusBox.classList.toggle("status-success", !isError);
}

// ---------------------------------------------------------------
// Request a reset link for the given email. Shared by the form
// submit and the "Resend" link.
// ---------------------------------------------------------------
async function requestReset(email, { isResend = false } = {}) {
  if (!email) {
    showStatus("Please enter your email address.");
    return;
  }

  const remaining = getCooldownRemaining(email);
  if (remaining > 0) {
    const seconds = Math.ceil(remaining / 1000);
    showStatus(`Please wait ${seconds}s before requesting another link.`);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}${FORGOT_PASSWORD_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showStatus(data.message || "Couldn't send the reset link. Please try again.");
      return;
    }

    markResetSent(email);
    showStatus(
      isResend
        ? "A new reset link has been sent to your email."
        : "If an account exists for that email, a reset link has been sent.",
      false
    );
  } catch (err) {
    console.error("Forgot password error:", err);
    showStatus("Something went wrong. Check your connection and try again.");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  requestReset(emailInput.value.trim(), { isResend: false });
});

resendLink.addEventListener("click", (e) => {
  e.preventDefault();
  requestReset(emailInput.value.trim(), { isResend: true });
});