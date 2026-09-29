// ResetPassword.js
// Connects the "Set New Password" form to the password reset endpoint.
//
// ⚠️ PROVISIONAL — same situation as ForgotPassword.js: the backend has
// no confirmed route for this yet. The URL shape hardcoded inside
// sendResetEmail() (src/.../email.js) is:
//   http://localhost:3000/api/v1/auth/reset-password/${resetToken}
// which is itself a bug (hardcoded localhost — will break in production),
// but it tells us the intended path shape: /api/v1/auth/reset-password/:token.
// CONFIRM WITH BACKEND before relying on this.

const API_BASE = "https://ecoride-backend-0ll4.onrender.com";
const RESET_PASSWORD_PATH = "/api/v1/auth/reset-password"; // + "/:token" appended below, unconfirmed

const form = document.getElementById("reset-password-form");
const statusBox = document.getElementById("status-message");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-new-password");

// ---------------------------------------------------------------
// Get the reset token from the URL. The email link (per sendResetEmail)
// puts it in the path: /reset-password/:token — but since this is a
// static HTML page, not a server route, we read it from the query
// string instead. Whoever finalizes the real reset-email link should
// point it at:
//   ResetPassword.html?token=<resetToken>
// rather than a path segment, since there's no server here to parse
// path params.
// ---------------------------------------------------------------
function getResetToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

const resetToken = getResetToken();

function showStatus(message, isError = true) {
  statusBox.textContent = message;
  statusBox.classList.toggle("status-error", isError);
  statusBox.classList.toggle("status-success", !isError);
}

if (!resetToken) {
  showStatus("This reset link is missing or invalid. Please request a new one.");
  form.querySelector("button[type='submit']").disabled = true;
}

// ---------------------------------------------------------------
// Show/hide password (two separate toggles, one per field)
// ---------------------------------------------------------------
function setupPasswordToggle(iconId, inputEl) {
  const icon = document.getElementById(iconId);
  icon.addEventListener("click", () => {
    const isHidden = inputEl.type === "password";
    inputEl.type = isHidden ? "text" : "password";
    icon.classList.toggle("ph-eye", !isHidden);
    icon.classList.toggle("ph-eye-slash", isHidden);
  });
}

setupPasswordToggle("show-new-password", newPasswordInput);
setupPasswordToggle("show-confirm-password", confirmPasswordInput);

// ---------------------------------------------------------------
// Submit
// ---------------------------------------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!resetToken) {
    showStatus("This reset link is missing or invalid. Please request a new one.");
    return;
  }

  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (newPassword.length < 8) {
    showStatus("Password should be at least 8 characters.");
    return;
  }
  if (newPassword !== confirmPassword) {
    showStatus("Passwords don't match.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}${RESET_PASSWORD_PATH}/${encodeURIComponent(resetToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showStatus(data.message || "Couldn't reset your password. The link may have expired — request a new one.");
      return;
    }

    showStatus("Password reset successfully. Redirecting to login...", false);
    setTimeout(() => {
      window.location.href = "Login.html";
    }, 2000);
  } catch (err) {
    console.error("Reset password error:", err);
    showStatus("Something went wrong. Check your connection and try again.");
  }
});