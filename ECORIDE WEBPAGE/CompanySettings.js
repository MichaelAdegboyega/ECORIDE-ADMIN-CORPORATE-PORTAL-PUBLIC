// CompanySettings.js
//
// ⚠️ No design screenshot for this page. Company Profile fields match
// what the corporate flow doc's Step 5 (Create Corporate Profile) says
// the backend expects: companyName, rcNumber, companyPhone,
// companyAddress, industry. Documents tab mirrors Step 6 (cacCertificate,
// taxCertificate, businessLicense). Notifications and Admins/Roles tabs
// have no reference at all — built as reasonable, generic defaults.
//
// ⚠️ MOCK DATA / no confirmed endpoints for saving any of this
// (PATCH .../corporate/profile, document upload, notification prefs,
// admin invites). Every save action below is a placeholder.

const MOCK_VERIFICATION_STATUS = "PENDING"; // matches the doc's initial state after profile creation

const MOCK_DOCUMENTS = [
  { key: "cacCertificate", name: "CAC Certificate", sub: "Not uploaded yet" },
  { key: "taxCertificate", name: "Tax Certificate", sub: "Not uploaded yet" },
  { key: "businessLicense", name: "Business License", sub: "Uploaded — pending review" },
];

const MOCK_NOTIFICATIONS = [
  { key: "ride-requests", title: "New Ride Requests", sub: "Get notified when employees request rides", on: true },
  { key: "low-balance", title: "Low Wallet Balance", sub: "Alert when wallet balance falls below threshold", on: true },
  { key: "weekly-report", title: "Weekly Summary Report", sub: "Receive a weekly activity digest by email", on: false },
  { key: "employee-invites", title: "Employee Invite Status", sub: "Notify when an invited employee joins", on: true },
];

const MOCK_ADMINS = [
  { name: "Tunde Adewale", email: "tunde@acme.com", role: "Super Admin" },
  { name: "Grace Eze", email: "grace@acme.com", role: "Admin" },
];

// ---------------------------------------------------------------
// Verification banner
// ---------------------------------------------------------------
function renderVerificationBanner(status) {
  const banner = document.getElementById("verification-banner");
  const isApproved = status === "APPROVED";
  banner.className = `settings-verification-banner ${isApproved ? "approved" : ""}`;
  banner.innerHTML = isApproved
    ? `<i class="ph-fill ph-check-circle"></i> Your company profile is verified.`
    : `<i class="ph-fill ph-clock"></i> Your company profile is pending verification. Some features may be limited until approved.`;
}

// ---------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------
function setupTabs() {
  const tabs = document.querySelectorAll(".settings-tab");
  const panels = {
    profile: document.getElementById("tab-profile"),
    documents: document.getElementById("tab-documents"),
    notifications: document.getElementById("tab-notifications"),
    team: document.getElementById("tab-team"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      Object.entries(panels).forEach(([key, el]) => {
        el.style.display = key === tab.dataset.tab ? "block" : "none";
      });
    });
  });
}

// ---------------------------------------------------------------
// Company Profile tab
// ---------------------------------------------------------------
function setupProfileSave() {
  document.getElementById("save-profile-btn").addEventListener("click", () => {
    const payload = {
      companyName: document.getElementById("settings-company-name").value.trim(),
      rcNumber: document.getElementById("settings-rc-number").value.trim(),
      industry: document.getElementById("settings-industry").value,
      companyPhone: document.getElementById("settings-company-phone").value.trim(),
      companyAddress: document.getElementById("settings-company-address").value.trim(),
      billingEmail: document.getElementById("settings-company-email").value.trim(),
    };
    // TODO: replace with a real PATCH /api/v1/corporate/profile call
    // once that endpoint is confirmed.
    console.log("Would save profile:", payload);
    alert("Company profile changes saved (mock — no backend call made yet).");
  });
}

// ---------------------------------------------------------------
// Documents tab
// ---------------------------------------------------------------
function renderDocuments(docs) {
  const container = document.getElementById("doc-rows");
  container.innerHTML = docs.map((d) => `
    <div class="doc-row">
      <div class="doc-row-left">
        <span class="doc-icon"><i class="ph-fill ph-file-text"></i></span>
        <div>
          <div class="doc-name">${d.name}</div>
          <div class="doc-sub">${d.sub}</div>
        </div>
      </div>
      <button class="doc-upload-btn" data-key="${d.key}">Upload</button>
    </div>
  `).join("");

  container.querySelectorAll(".doc-upload-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // TODO: replace with a real POST /api/v1/corporate/documents
      // multipart upload once that endpoint is confirmed.
      alert("Document upload is coming soon.");
    });
  });
}

// ---------------------------------------------------------------
// Notifications tab
// ---------------------------------------------------------------
function renderNotificationToggles(prefs) {
  const container = document.getElementById("toggle-rows");
  container.innerHTML = prefs.map((p) => `
    <div class="toggle-row">
      <div>
        <div class="toggle-row-title">${p.title}</div>
        <div class="toggle-row-sub">${p.sub}</div>
      </div>
      <button class="toggle-switch ${p.on ? "on" : ""}" data-key="${p.key}" aria-label="Toggle ${p.title}"></button>
    </div>
  `).join("");

  container.querySelectorAll(".toggle-switch").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("on");
    });
  });
}

function setupNotificationsSave() {
  document.getElementById("save-notifications-btn").addEventListener("click", () => {
    const states = {};
    document.querySelectorAll(".toggle-switch").forEach((btn) => {
      states[btn.dataset.key] = btn.classList.contains("on");
    });
    // TODO: replace with a real PATCH /api/v1/corporate/notification-preferences
    // call once that endpoint is confirmed.
    console.log("Would save notification prefs:", states);
    alert("Notification preferences saved (mock — no backend call made yet).");
  });
}

// ---------------------------------------------------------------
// Admins & Roles tab
// ---------------------------------------------------------------
function renderAdmins(admins) {
  const tbody = document.getElementById("admins-table-body");
  tbody.innerHTML = admins.map((a) => `
    <tr>
      <td>${a.name}</td>
      <td class="emp-email">${a.email}</td>
      <td><span class="role-badge ${a.role === "Super Admin" ? "admin" : ""}">${a.role}</span></td>
      <td><button class="row-actions-btn"><i class="ph ph-dots-three"></i></button></td>
    </tr>
  `).join("");
}

function setupInviteAdmin() {
  document.getElementById("invite-admin-btn").addEventListener("click", () => {
    alert("Invite Admin is coming soon.");
  });
}

// ---------------------------------------------------------------
// Sidebar nav + misc controls
// ---------------------------------------------------------------
function setupSidebarNav() {
  document.querySelectorAll("#sidebar-nav-list .nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const href = item.dataset.href;
      if (href) window.location.href = href;
    });
  });
}

function setupMiscControls() {
  document.getElementById("contact-support-btn").addEventListener("click", () => {
    alert("Contact Support is coming soon.");
  });
  document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.href = "Login.html";
  });
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
renderVerificationBanner(MOCK_VERIFICATION_STATUS);
renderDocuments(MOCK_DOCUMENTS);
renderNotificationToggles(MOCK_NOTIFICATIONS);
renderAdmins(MOCK_ADMINS);
setupTabs();
setupProfileSave();
setupNotificationsSave();
setupInviteAdmin();
setupSidebarNav();
setupMiscControls();