// AdminProfileView.js
//
// ⚠️ Built from a screenshot only — no design HTML/CSS was provided.
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/admin/profile endpoint.
// Reads from localStorage (written by AdminProfileEdit.js on save) so
// edits persist across a page visit; falls back to the screenshot's
// values on first load. Replace with a real fetch() once an endpoint
// exists — localStorage is a stand-in, not real persistence.

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
  
  function formatDob(iso) {
    const d = new Date(iso + "T00:00:00");
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }
  
  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------
  function renderProfile() {
    const p = getProfile();
  
    document.getElementById("profile-summary-name").textContent = `${p.firstName} ${p.lastName}`;
    document.getElementById("profile-summary-role").textContent = p.role;
    document.getElementById("profile-summary-location").textContent = `Ecoride, ${p.city}, ${p.country}`;
  
    document.getElementById("view-first-name").textContent = p.firstName;
    document.getElementById("view-last-name").textContent = p.lastName;
    document.getElementById("view-dob").textContent = formatDob(p.dob);
    document.getElementById("view-email").textContent = p.email;
    document.getElementById("view-phone").textContent = p.phone;
    document.getElementById("view-role").textContent = p.role;
  
    document.getElementById("view-country").textContent = p.country;
    document.getElementById("view-city").textContent = p.city;
    document.getElementById("view-postal").textContent = p.postalCode;
  }
  
  // ---------------------------------------------------------------
  // Edit buttons — both go to the same edit page (personal info and
  // address are one form there, matching the second screenshot).
  // ---------------------------------------------------------------
  function setupEditButtons() {
    document.getElementById("edit-personal-btn").addEventListener("click", () => {
      window.location.href = "AdminProfileEdit.html";
    });
    document.getElementById("edit-address-btn").addEventListener("click", () => {
      window.location.href = "AdminProfileEdit.html";
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
  renderProfile();
  setupEditButtons();
  setupNotifications();
  setupProfileDropdown();
  setupMiscControls();