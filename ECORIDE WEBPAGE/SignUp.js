// SignUp.js
// Connects the signup form to POST /api/v1/auth/register
// (Note: the corporate onboarding doc lists this as /auth/register,
// but testing confirmed the real deployed path is /api/v1/auth/register.
// Flagged to backend — update this if they change it back.)

const API_BASE = "https://ecoride-backend-0ll4.onrender.com";

// grab the form itself, not just the button — this lets us catch
// Enter-key submits too, not only clicks
const form = document.querySelector(".reg-con");
const errorBox = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop the default page reload on submit

  errorBox.textContent = ""; // clear any old error before trying again

  // read values straight from the inputs by id
  const companyName = document.getElementById("companyName").value.trim();
  const rcNumber = document.getElementById("rcNumber").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const countryCode = document.getElementById("countryCode").value;
  const phoneNumberRaw = document.getElementById("phoneNumber").value.trim();

  // basic front-end validation before even hitting the API
  if (password !== confirmPassword) {
    errorBox.textContent = "Passwords do not match.";
    return;
  }

  // combine country code + local number into one string, e.g. "+2348012345678"
  const phoneNumber = countryCode + phoneNumberRaw;

  // hold onto rcNumber for the later "create corporate profile" step —
  // register only wants firstName/lastName, not company details
  localStorage.setItem("pendingRcNumber", rcNumber);
  localStorage.setItem("pendingCompanyName", companyName);
  localStorage.setItem("pendingEmail", email);

  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: companyName, // per the flow doc's example
        lastName: "",
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        confirmPassword: confirmPassword,
      }),
    });

    const data = await res.json();

    // check data.success rather than just res.ok — confirmed via curl
    // testing that this API always returns a "success" boolean alongside
    // its own message, which is more explicit than relying on status code alone
    if (!res.ok || !data.success) {
      errorBox.textContent = data.message || "Registration failed. Please try again.";
      return;
    }

    // success shape confirmed via curl:
    // { success: true, message: "...", email: "...", role: "UNASSIGNED" }
    console.log("Registered:", data);

    // use the email the server confirms back, not just what the user typed —
    // guards against any trimming/normalization the backend applies
    localStorage.setItem("pendingEmail", data.email);

    window.location.href = "VerifyEmail.html";

  } catch (err) {
    // network failure, server down, CORS issue, etc.
    console.error("Registration error:", err);
    errorBox.textContent = "Something went wrong. Check your connection and try again.";
  }
});