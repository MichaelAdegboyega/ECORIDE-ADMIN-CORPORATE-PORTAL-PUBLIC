// AdminVerificationPage.js
//
// ⚠️ MOCK DATA — no confirmed admin API endpoints. Swap
// generateMockVerifications() for a real fetch() once
// GET /api/v1/admin/verifications (or similar) exists.

const DRIVERS = ["Kelechi Obi", "Yemi Soyinka", "Tunde Fashola", "Ngozi Adeyemi", "Chuka Nwankwo"];
const DOCUMENTS = ["Driver's license", "National ID", "Birth Certificate", "Insurance", "Vehicle Registration"];
const STATUSES = ["pending", "confirmed", "denied"];

function generateMockVerifications(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      rideId: `R${10091 + i}`,
      driver: DRIVERS[i % DRIVERS.length],
      document: DOCUMENTS[i % DOCUMENTS.length],
      submitted: `May ${20 + (i % 8)}, 2026`,
      expiry: `${(i % 28) + 1}/${(i % 12) + 1}/${2027 + (i % 4)}`,
      licenseId: `${["DL","VR","SQ","GT","HW"][i % 5]}-${1000 + i * 37}-${["KO","YS","JL","KI","PF"][i % 5]}`,
      status: STATUSES[i % STATUSES.length],
    });
  }
  return rows;
}

const state = {
  verifications: generateMockVerifications(15),
  activeFilter: "all",
};

// ---------------------------------------------------------------
// Render table
// ---------------------------------------------------------------
function renderTable() {
  const tbody = document.getElementById("verification-table-body");
  const filtered = state.activeFilter === "all"
    ? state.verifications
    : state.verifications.filter((v) => v.status === state.activeFilter);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No verifications in this view.</td></tr>`;
    return;
  }

  const statusClass = { pending: "status-badge-pending", confirmed: "status-badge-confirmed", denied: "status-badge-denied" };
  const statusLabel = { pending: "Pending", confirmed: "Confirmed", denied: "Denied" };

  tbody.innerHTML = filtered.map((v) => `
    <tr data-driver="${v.driver}">
      <td>${v.rideId}</td>
      <td><strong>${v.driver}</strong></td>
      <td>${v.document}</td>
      <td>${v.submitted}</td>
      <td>${v.expiry}</td>
      <td>${v.licenseId}</td>
      <td><span class="${statusClass[v.status]}">${statusLabel[v.status]}</span></td>
    </tr>
  `).join("");

  tbody.querySelectorAll("tr[data-driver]").forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = `DriverDetail.html?name=${encodeURIComponent(row.dataset.driver)}`;
    });
  });
}

// ---------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------
function setupFilters() {
  const buttons = document.querySelectorAll("#verification-filters .filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeFilter = btn.dataset.filter;
      renderTable();
    });
  });
}

// ---------------------------------------------------------------
// Notification bell + profile dropdown (same pattern as other admin pages)
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
      <div>
        <div class="notif-panel-item-title">${n.title}</div>
        <div class="notif-panel-item-time">${n.time}</div>
      </div>
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
setupFilters();
setupNotifications();
setupProfileDropdown();
setupMiscControls();
renderTable();