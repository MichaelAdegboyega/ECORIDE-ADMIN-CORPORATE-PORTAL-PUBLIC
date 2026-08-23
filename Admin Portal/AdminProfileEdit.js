// AdminProfileEdit.js
//
// ⚠️ Built from a screenshot only — no design HTML/CSS was provided.
//
// ⚠️ MOCK DATA — no confirmed PATCH /api/v1/admin/profile endpoint.
// Reads/writes localStorage as a stand-in for real persistence, so
// Save Changes here actually reflects back on AdminProfileView.html —
// but this is a placeholder, not a real backend save. Change Photo
// only previews a local file; it isn't uploaded anywhere.

const DEFAULT_PROFILE = {
    firstName: "Ezekiel",
    lastName: "Ajibade",
    dob: "1986-06-17",
    email: "ezekiel@gmail.com",
    phone: "08056410359",
    role: "Super Admin",
    country: "Nigeria",
    city: "Lagos",
    postalCode: "100001",
  };
  
  function getProfile() {
    try {
      const stored = localStorage.getItem("adminProfile");
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }
  
  function saveProfile(profile) {
    localStorage.setItem("adminProfile", JSON.stringify(profile));
  }
  
  // ---------------------------------------------------------------
  // Populate form from current profile
  // ---------------------------------------------------------------
  function populateForm() {
    const p = getProfile();
    document.getElementById("full-name").value = `${p.firstName} ${p.lastName}`;
    document.getElementById("email").value = p.email;
    document.getElementById("phone").value = p.phone;
    document.getElementById("role").value = p.role;
    document.getElementById("dob").value = p.dob;
    document.getElementById("country").value = p.country;
    document.getElementById("city").value = p.city;
    document.getElementById("postal-code").value = p.postalCode;
  }
  
  // ---------------------------------------------------------------
  // Change Photo (preview only — not actually uploaded anywhere)
  // ---------------------------------------------------------------
  function setupChangePhoto() {
    const btn = document.getElementById("change-photo-btn");
    const fileInput = document.getElementById("photo-file-input");
    const preview = document.getElementById("edit-avatar-preview");
  
    btn.addEventListener("click", () => fileInput.click());
  
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => { preview.src = e.target.result; };
      reader.readAsDataURL(file);
      // TODO: replace with a real upload call once an endpoint exists —
      // this only previews the image locally, it isn't saved anywhere.
    });
  }
  
  // ---------------------------------------------------------------
  // Two-Factor Authentication toggle
  // ---------------------------------------------------------------
  function setupTwoFAToggle() {
    document.getElementById("twofa-toggle").addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("on");
    });
  }
  
  // ---------------------------------------------------------------
  // Change Password modal (same pattern as Settings page)
  // ---------------------------------------------------------------
  function setupPasswordModal() {
    const overlay = document.getElementById("password-modal-overlay");
    document.getElementById("update-password-btn").addEventListener("click", () => {
      document.getElementById("current-password").value = "";
      document.getElementById("new-password").value = "";
      document.getElementById("confirm-password").value = "";
      overlay.classList.add("open");
    });
    document.getElementById("password-modal-close").addEventListener("click", () => overlay.classList.remove("open"));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
  
    document.getElementById("password-save-btn").addEventListener("click", () => {
      const current = document.getElementById("current-password").value;
      const next = document.getElementById("new-password").value;
      const confirm = document.getElementById("confirm-password").value;
  
      if (!current || !next || !confirm) {
        alert("Please fill in all fields.");
        return;
      }
      if (next !== confirm) {
        alert("New password and confirmation don't match.");
        return;
      }
      if (next.length < 8) {
        alert("New password should be at least 8 characters.");
        return;
      }
      // TODO: replace with a real PATCH .../admin/change-password call.
      document.getElementById("password-last-changed").textContent = "Last changed just now";
      alert("Password updated (mock — no backend call made yet).");
      overlay.classList.remove("open");
    });
  }
  
  // ---------------------------------------------------------------
  // Form submit (Save Changes) + Cancel
  // ---------------------------------------------------------------
  function setupForm() {
    document.getElementById("edit-profile-form").addEventListener("submit", (e) => {
      e.preventDefault();
  
      const fullName = document.getElementById("full-name").value.trim();
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
  
      if (!firstName || !lastName) {
        alert("Please enter your full name (first and last).");
        return;
      }
  
      const updatedProfile = {
        firstName,
        lastName,
        dob: document.getElementById("dob").value,
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        role: document.getElementById("role").value,
        country: document.getElementById("country").value.trim(),
        city: document.getElementById("city").value.trim(),
        postalCode: document.getElementById("postal-code").value.trim(),
      };
  
      // TODO: replace with a real PATCH /api/v1/admin/profile call.
      saveProfile(updatedProfile);
      window.location.href = "AdminProfileView.html";
    });
  
    document.getElementById("cancel-edit-btn").addEventListener("click", () => {
      window.location.href = "AdminProfileView.html";
    });
  }
  
  // ---------------------------------------------------------------
  // Notification bell + profile dropdown (same shared pattern)
  // ---------------------------------------------------------------
  const MOCK_NOTIFICATIONS = [
    { icon: "ph-bell", title: "New driver verification submitted", time: "10 mins ago" },
    { icon: "ph-warning", title: "Payment dispute flagged", time: "1 hour ago" },
  ];
  
  function setupNotifications() {
    const bell = document.getElementById("notif-bell");
    const panel = document.getElementById("notif-panel");
    const dot = document.getElementById("notif-dot");
    const list = document.getElementById("notif-panel-list");
  
    list.innerHTML = MOCK_NOTIFICATIONS.map((n) => `
      <li class="notif-panel-item">
        <i class="ph-fill ${n.icon}"></i>
        <div><div class="notif-panel-item-title">${n.title}</div><div class="notif-panel-item-time">${n.time}</div></div>
      </li>
    `).join("");
    if (MOCK_NOTIFICATIONS.length > 0) dot.classList.add("visible");
  
    bell.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("admin-dropdown").classList.remove("open");
      panel.classList.toggle("open");
    });
    document.getElementById("mark-all-read-btn").addEventListener("click", () => {
      dot.classList.remove("visible");
      panel.classList.remove("open");
    });
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !bell.contains(e.target)) panel.classList.remove("open");
    });
  }
  
  function setupProfileDropdown() {
    const toggle = document.getElementById("admin-profile-toggle");
    const dropdown = document.getElementById("admin-dropdown");
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("notif-panel").classList.remove("open");
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !toggle.contains(e.target)) dropdown.classList.remove("open");
    });
  }
  
  function setupMiscControls() {
    document.getElementById("contact-support-btn").addEventListener("click", () => {
      alert("Contact Support is coming soon.");
    });
  }
  
  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  populateForm();
  setupChangePhoto();
  setupTwoFAToggle();
  setupPasswordModal();
  setupForm();
  setupNotifications();
  setupProfileDropdown();
  setupMiscControls();