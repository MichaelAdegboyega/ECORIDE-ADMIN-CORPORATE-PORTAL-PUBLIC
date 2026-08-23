// AdminPaymentPage.js
//
// ⚠️ MOCK DATA — no confirmed admin API endpoints. Swap
// generateMockFareLog()/generateMockCommissions() for real fetch() calls
// once GET /api/v1/admin/payments (or similar) exists.
//
// Note: Ride Fare Log rows link to BookingDetail.html using the same
// R#### ride ID scheme as the Bookings page, and Commission rows link
// to DriverDetail.html using the same driver names as Users/Verification.
// Since each page generates its own independent mock dataset, the
// specific details won't match across pages yet (e.g. rider name here
// vs. passenger name on the Bookings mock) — that's expected until a
// real backend provides one consistent source of truth.

const RIDERS = ["Tola Adeyemi", "James Okafor", "Michael Anthony", "Bisi Adekunle", "Ijeoma Eze"];
const DRIVERS = ["Kelechi Obi", "Yemi Soyinka", "Tunde Fashola", "Ngozi Adeyemi"];
const METHODS = ["Wallet", "Bank Transfer", "Card"];
const FARE_STATUSES = ["completed", "completed", "completed", "disputed"];
const CONFIRMED_BY = ["both", "both", "both", "rider"];
const AMOUNTS = [4200, 3150, 1900, 2800, 1400];

function generateMockFareLog(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      rideId: `R${10091 + i}`,
      rider: RIDERS[i % RIDERS.length],
      driver: DRIVERS[i % DRIVERS.length],
      amount: AMOUNTS[i % AMOUNTS.length],
      method: METHODS[i % METHODS.length],
      confirmedBy: CONFIRMED_BY[i % CONFIRMED_BY.length],
      status: FARE_STATUSES[i % FARE_STATUSES.length],
    });
  }
  return rows;
}

const COMMISSION_STATUSES = ["duesoon", "paid", "overdue"];

function generateMockCommissions(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const status = COMMISSION_STATUSES[i % COMMISSION_STATUSES.length];
    rows.push({
      driver: DRIVERS[i % DRIVERS.length],
      ridesCompleted: 25 + (i * 3) % 20,
      rate: "15%",
      amountOwed: status === "paid" ? 0 : 15000 + (i * 3700) % 30000,
      dueDate: status === "paid" ? "—" : `${["May 17", "May 24", "May 31"][i % 3]}, 2026`,
      status,
    });
  }
  return rows;
}

const state = {
  fareLog: generateMockFareLog(9),
  commissions: generateMockCommissions(9),
  fareFilter: "all",
  commissionFilter: "all",
};

// ---------------------------------------------------------------
// Render: Ride Fare Log
// ---------------------------------------------------------------
const fareStatusClass = { completed: "status-badge-completed", disputed: "status-badge-disputed" };
const fareStatusLabel = { completed: "Completed", disputed: "Disputed" };
const confirmedByClass = { both: "span-by", rider: "span-by-rider" };
const confirmedByLabel = { both: "Both Parties", rider: "Rider Only" };

function renderFareLog() {
  const tbody = document.getElementById("fare-log-table-body");
  const filtered = state.fareFilter === "all"
    ? state.fareLog
    : state.fareLog.filter((r) => r.status === state.fareFilter);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No fares match this view.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((r) => `
    <tr data-ride-id="${r.rideId}">
      <td>${r.rideId}</td>
      <td><strong>${r.rider}</strong></td>
      <td><strong>${r.driver}</strong></td>
      <td><strong>₦${r.amount.toLocaleString()}</strong></td>
      <td>${r.method}</td>
      <td><span class="${confirmedByClass[r.confirmedBy]}">${confirmedByLabel[r.confirmedBy]}</span></td>
      <td><span class="${fareStatusClass[r.status]}">${fareStatusLabel[r.status]}</span></td>
    </tr>
  `).join("");

  tbody.querySelectorAll("tr[data-ride-id]").forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = `BookingDetail.html?id=${encodeURIComponent(row.dataset.rideId)}`;
    });
  });
}

// ---------------------------------------------------------------
// Render: Driver Commission Balances
// ---------------------------------------------------------------
const commissionStatusClass = { duesoon: "status-badge-duesoon", paid: "status-badge-paid", overdue: "status-badge-overdue" };
const commissionStatusLabel = { duesoon: "Due Soon", paid: "Paid", overdue: "Overdue" };

function renderCommissions() {
  const tbody = document.getElementById("commission-table-body");
  const filtered = state.commissionFilter === "all"
    ? state.commissions
    : state.commissions.filter((r) => r.status === state.commissionFilter);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No commission records match this view.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((r) => `
    <tr data-driver="${r.driver}">
      <td><strong>${r.driver}</strong></td>
      <td><strong>${r.ridesCompleted}</strong></td>
      <td><strong>${r.rate}</strong></td>
      <td><strong>₦${r.amountOwed.toLocaleString()}</strong></td>
      <td>${r.dueDate}</td>
      <td><span class="${commissionStatusClass[r.status]}">${commissionStatusLabel[r.status]}</span></td>
    </tr>
  `).join("");

  tbody.querySelectorAll("tr[data-driver]").forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = `DriverDetail.html?name=${encodeURIComponent(row.dataset.driver)}`;
    });
  });
}

// ---------------------------------------------------------------
// Filters (independent per table)
// ---------------------------------------------------------------
function setupFilters() {
  document.querySelectorAll("#fare-log-filters .filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#fare-log-filters .filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.fareFilter = btn.dataset.filter;
      renderFareLog();
    });
  });

  document.querySelectorAll("#commission-filters .filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#commission-filters .filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.commissionFilter = btn.dataset.filter;
      renderCommissions();
    });
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
setupFilters();
setupNotifications();
setupProfileDropdown();
setupMiscControls();
renderFareLog();
renderCommissions();