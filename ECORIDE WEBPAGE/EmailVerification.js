// EmailVerification.js
// Connects the OTP form to POST /api/v1/otp/verify-email
// and the "Resend" link to POST /api/v1/otp/send-email
//
// Option B: this page owns the responsibility for making sure a code
// has actually been sent — it fires send-email automatically on load,
// and "Resend" just calls the same function again. This avoids relying
// on SignUp.js (or any other page) to have triggered it correctly.

const API_BASE = "https://ecoride-backend-0ll4.onrender.com";

const form = document.getElementById("otp-form");
const tokenInputs = document.querySelectorAll(".token");
const emailDisplay = document.getElementById("user-email");
const resendLink = document.querySelector(".no-code a");

// the email isn't known until registration happens — pull it from
// localStorage (saved in SignUp.js) instead of the hardcoded HTML value
const email = localStorage.getItem("pendingEmail");

if (email) {
  emailDisplay.textContent = email;
} else {
  // no email in storage means the user landed here without registering first
  emailDisplay.textContent = "your email";
  console.warn("No pending email found — did the user skip registration?");
}

// ---------------------------------------------------------------
// Cooldown so we don't spam the inbox — tracks the last send time
// per-email in localStorage, since a page refresh or back-nav would
// otherwise re-trigger the auto-send every time.
// ---------------------------------------------------------------
const OTP_COOLDOWN_MS = 30 * 1000; // 30 seconds

function getCooldownRemaining() {
  const lastSent = Number(localStorage.getItem(`otpLastSent:${email}`)) || 0;
  const elapsed = Date.now() - lastSent;
  return Math.max(0, OTP_COOLDOWN_MS - elapsed);
}

function markOtpSent() {
  localStorage.setItem(`otpLastSent:${email}`, String(Date.now()));
}

// ---------------------------------------------------------------
// Send (or resend) the OTP code. Shared by the auto-send-on-load
// call below and the "Resend" link click handler.
// ---------------------------------------------------------------
async function sendOtp({ isResend = false } = {}) {
  if (!email) {
    alert("Missing email — please register again.");
    return;
  }

  const remaining = getCooldownRemaining();
  if (remaining > 0) {
    // Auto-send on load should stay silent — a code was already sent
    // recently, so skip it quietly instead of alerting the user.
    if (isResend) {
      const seconds = Math.ceil(remaining / 1000);
      alert(`Please wait ${seconds}s before requesting another code.`);
    }
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/otp/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.message || "Couldn't send the code. Try again shortly.");
      return;
    }

    markOtpSent();

    if (isResend) {
      alert("A new code has been sent to your email.");
      // clear the boxes and refocus the first one for the new code
      tokenInputs.forEach((input) => (input.value = ""));
      tokenInputs[0].focus();
    } else {
      console.log("OTP sent on page load:", data);
    }
  } catch (err) {
    console.error("Send OTP error:", err);
    // Only alert on resend — an alert firing automatically on page load
    // for a background send would be a jarring first impression.
    if (isResend) {
      alert("Something went wrong. Check your connection and try again.");
    }
  }
}

// Fire the initial send as soon as the page loads, so the user doesn't
// have to click "Resend" just to get the first code.
sendOtp({ isResend: false });

// ---------------------------------------------------------------
// Auto-advance between the 4 digit boxes as the user types,
// and allow Backspace to jump back to the previous box when empty
// ---------------------------------------------------------------
tokenInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    // keep only the first typed character, in case of paste or fast typing
    input.value = input.value.replace(/[^0-9]/g, "").slice(0, 1);

    if (input.value && index < tokenInputs.length - 1) {
      tokenInputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && index > 0) {
      tokenInputs[index - 1].focus();
    }
  });
});

// ---------------------------------------------------------------
// Submit: combine the 4 boxes into one code, send to the API
// ---------------------------------------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const code = Array.from(tokenInputs).map((input) => input.value).join("");

  if (code.length !== 4) {
    alert("Please enter all 4 digits.");
    return;
  }

  if (!email) {
    alert("Missing email — please register again.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/otp/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.message || "Verification failed. Please check the code and try again.");
      return;
    }

    console.log("Verified:", data);

    // email is confirmed — clean up, then move to login per the flow doc
    localStorage.removeItem("pendingEmail");
    window.location.href = "Login.html";

  } catch (err) {
    console.error("Verification error:", err);
    alert("Something went wrong. Check your connection and try again.");
  }
});

// ---------------------------------------------------------------
// Resend code
// ---------------------------------------------------------------
resendLink.addEventListener("click", (e) => {
  e.preventDefault(); // stop the "#" link from jumping the page
  sendOtp({ isResend: true });
});