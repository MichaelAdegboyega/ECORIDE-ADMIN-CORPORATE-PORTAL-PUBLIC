// AdminBookingDashboard.js
//
// ⚠️ MOCK DATA — no confirmed admin API endpoints. Swap
// generateMockBookings() for a real fetch() once
// GET /api/v1/admin/bookings (or similar) exists.

const DRIVERS = ["Kelechi Obi", "Yemi Soyinka", "Tunde Fashola", "Ngozi Adeyemi"];
const PASSENGERS = ["Chioma Dike", "Adaeze Okonkwo", "Seun Adeyemi", "Emeka Nwosu", "Halima Sani"];
const ROUTES = [
  { from: "Lekki Phase 1", to: "V.I. (Eko Hotel)", distance: "12.4 km", duration: "34 min" },
  { from: "Ajah", to: "Marina", distance: "22.1 km", duration: "62 min" },
  { from: "Surulere", to: "Ikeja GRA", distance: "8.7 km", duration: "25 min" },
  { from: "Ikoyi", to: "Oniru", distance: "5.2 km", duration: "18 min" },
  { from: "Oshodi", to: "Apapa", distance: "9.8 km", duration: "41 min" },
];
const STATUSES = ["completed", "completed", "completed", "active", "cancelled"];
const FARES = [2800, 4200, 1900, 1400, 2110];

function generateMockBookings(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const route = ROUTES[i % ROUTES.length];
    rows.push({
      rideId: `R${10091 + i}`,
      driver: DRIVERS[i % DRIVERS.length],
      passenger: PASSENGERS[i % PASSENGERS.length],
      route,
      fare: FARES[i % FARES.length],
      status: STATUSES[i % STATUSES.length],
    });
  }
  return rows;
}

const state = {
  bookings: generateMockBookings(20),
  activeFilter: "all",
  searchTerm: "",
};

// ---------------------------------------------------------------
// Render table
// ---------------------------------------------------------------
function renderTable() {
  const tbody = document.getElementById("bookings-table-body");

  const filtered = state.bookings.filter((b) => {
    const matchesFilter = state.activeFilter === "all" || b.status === state.activeFilter;
    const matchesSearch = state.searchTerm === "" ||
      b.driver.toLowerCase().includes(state.searchTerm) ||
      b.passenger.toLowerCase().includes(state.searchTerm) ||
      b.rideId.toLowerCase().includes(state.searchTerm);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No bookings match this view.</td></tr>`;
    return;
  }

  const statusClass = { completed: "status-badge-completed", active: "status-badge-active", cancelled: "status-badge-cancelled" };
  const statusLabel = { completed: "Completed", active: "Active", cancelled: "Cancelled" };

  tbody.innerHTML = filtered.map((b) => `
    <tr data-ride-id="${b.rideId}">
      <td>${b.rideId}</td>
      <td><strong>${b.driver}</strong></td>
      <td>${b.passenger}</td>
      <td><p class="route">${b.route.from}</p><span class="text-muted">- ${b.route.to}</span></td>
      <td><strong>₦${b.fare.toLocaleString()}</strong></td>
      <td><p class="route">${b.route.distance}</p><span class="text-muted">${b.route.duration}</span></td>
      <td><span class="${statusClass[b.status]}">${statusLabel[b.status]}</span></td>
    </tr>
  `).join("");

  tbody.querySelectorAll("tr[data-ride-id]").forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = `BookingDetail.html?id=${encodeURIComponent(row.dataset.rideId)}`;
    });
  });
}

// ---------------------------------------------------------------
// Filters + search
// ---------------------------------------------------------------
function setupFilters() {
  const buttons = document.querySelectorAll("#booking-filters .filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeFilter = btn.dataset.filter;
      renderTable();
    });
  });
}

function setupSearch() {
  document.getElementById("booking-search").addEventListener("input", (e) => {
    state.searchTerm = e.target.value.trim().toLowerCase();
    renderTable();
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
setupSearch();
setupNotifications();
setupProfileDropdown();
setupMiscControls();
renderTable();