// Login.js
// Connects the login form to POST /api/v1/auth/login
//
// Note: the flow doc lists this as "POST /auth/login", but following the
// same pattern confirmed for register (real deployed path uses the
// /api/v1 prefix), this uses /api/v1/auth/login. Flag to backend if that
// turns out to be wrong.

const API_BASE = "https://ecoride-backend-0ll4.onrender.com";

const form = document.getElementById("login-form");
const errorBox = document.getElementById("error-message");
const googleButton = document.getElementById("google-login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorBox.textContent = ""; // clear any old error before trying again

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send/receive the httpOnly auth cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      errorBox.textContent = data.message || "Login failed. Please check your details and try again.";
      return;
    }

    // No token handling here on purpose — the backend sets the access
    // and refresh tokens as httpOnly cookies on the response, so the
    // browser stores and sends them automatically. JS never touches
    // them, which is the point (protects against XSS token theft).
    console.log("Logged in:", data);

    // role is already CORPORATE_ADMIN by this point in the flow, so we
    // skip select-role and go straight to the corporate dashboard
    window.location.href = "CorporateDashboard.html";

  } catch (err) {
    console.error("Login error:", err);
    errorBox.textContent = "Something went wrong. Check your connection and try again.";
  }
});

// ---------------------------------------------------------------
// Google sign-in — no OAuth endpoint documented yet, so this is a
// placeholder until there's a real flow to wire it to.
// ---------------------------------------------------------------
googleButton.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Google sign-in is coming soon.");
});