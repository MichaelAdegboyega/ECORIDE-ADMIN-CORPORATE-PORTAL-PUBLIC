// Trips.js
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/corporate/trips endpoint yet
// (same pattern as Employees/Overview). MOCK_TRIPS below stands in for
// that response; swap generateMockTrips() for a real fetch() later —
// render/filter/paginate logic doesn't need to change.

const PAGE_SIZE = 7;
const TOTAL_MOCK_COUNT = 124; // matches "Showing 7 of 124 trips" in the design

const EMPLOYEES = ["Sarah Johnson", "Michael Ade", "Linda Mo", "James Okafor", "Tolu Bamidele", "Esther Bright", "David Wilson"];
const STATUSES = ["completed", "completed", "completed", "completed", "completed", "cancelled", "upcoming", "ongoing"];
const AMOUNTS = [4200, 3150, 1900, 2000, 3200, 0, 1600, 2750];

function generateMockTrips(count) {
  const trips = [];
  for (let i = 0; i < count; i++) {
    const status = STATUSES[i % STATUSES.length];
    trips.push({
      id: `TRP-2026-${String(i + 1).padStart(4, "0")}`,
      date: "July 22, 2026",
      time: mockTime(i),
      from: "Ikeja",
      to: "VI",
      employee: EMPLOYEES[i % EMPLOYEES.length],
      status,
      amount: status === "cancelled" ? 0 : AMOUNTS[i % AMOUNTS.length],
    });
  }
  return trips;
}

function mockTime(i) {
  const hours = [7, 8, 9];
  const mins = ["00", "15", "25", "30", "45"];
  const h = hours[i % hours.length];
  const m = mins[i % mins.length];
  const period = h < 12 ? "AM" : "PM";
  return `${h}:${m} ${period}`;
}

const state = {
  trips: generateMockTrips(TOTAL_MOCK_COUNT),
  filtered: [],
  currentPage: 1,
  activeTab: "all",
  searchTerm: "",
};

// ---------------------------------------------------------------
// Filtering + pagination
// ---------------------------------------------------------------
function applyFilters() {
  state.filtered = state.trips.filter((trip) => {
    const matchesTab = state.activeTab === "all" || trip.status === state.activeTab;
    const matchesSearch = state.searchTerm === "" ||
      trip.employee.toLowerCase().includes(state.searchTerm) ||
      trip.id.toLowerCase().includes(state.searchTerm);
    return matchesTab && matchesSearch;
  });
  state.currentPage = 1;
  renderTable();
}

function getPageItems() {
  const start = (state.currentPage - 1) * PAGE_SIZE;
  return state.filtered.slice(start, start + PAGE_SIZE);
}

// ---------------------------------------------------------------
// Render: table
// ---------------------------------------------------------------
function renderTable() {
  const tbody = document.getElementById("trips-table-body");
  const pageItems = getPageItems();

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="ph ph-car"></i><p>No trips match this view.</p></div></td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map((trip) => `
      <tr data-id="${trip.id}">
        <td>${trip.date}. &nbsp;${trip.time}</td>
        <td><span class="route-cell">${trip.from} <i class="ph ph-arrow-right"></i> ${trip.to}</span></td>
        <td>
          <div class="trip-employee-cell">
            <img src="Assets/avatar-placeholder.png" alt="">
            ${trip.employee}
          </div>
        </td>
        <td><span class="status-badge ${trip.status}">${capitalize(trip.status)}</span></td>
        <td class="trip-amount">${trip.amount === 0 ? "₦0" : `₦${trip.amount.toLocaleString()}`}</td>
      </tr>
    `).join("");
  }

  document.querySelectorAll("#trips-table-body tr[data-id]").forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = `TripDetail.html?id=${encodeURIComponent(row.dataset.id)}`;
    });
  });

  renderPagination();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---------------------------------------------------------------
// Render: pagination
// ---------------------------------------------------------------
function renderPagination() {
  const container = document.getElementById("trips-pagination");
  const total = state.filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const shown = Math.min(PAGE_SIZE, total - (state.currentPage - 1) * PAGE_SIZE);

  const pageButtons = [];
  const maxVisible = 3;
  for (let p = 1; p <= Math.min(maxVisible, totalPages); p++) {
    pageButtons.push(p);
  }

  container.innerHTML = `
    <span>Showing ${Math.max(0, shown)} of ${total} trips</span>
    <div class="pagination-controls">
      <button class="page-btn" id="prev-page" ${state.currentPage === 1 ? "disabled" : ""}><i class="ph ph-caret-left"></i></button>
      ${pageButtons.map((p) => `<button class="page-btn ${p === state.currentPage ? "active" : ""}" data-page="${p}">${p}</button>`).join("")}
      ${totalPages > maxVisible ? `<span>...</span><button class="page-btn" data-page="${totalPages}">${totalPages}</button>` : ""}
      <button class="page-btn" id="next-page" ${state.currentPage === totalPages ? "disabled" : ""}><i class="ph ph-caret-right"></i></button>
    </div>
  `;

  container.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.currentPage = Number(btn.dataset.page);
      renderTable();
    });
  });
  document.getElementById("prev-page").addEventListener("click", () => {
    if (state.currentPage > 1) { state.currentPage--; renderTable(); }
  });
  document.getElementById("next-page").addEventListener("click", () => {
    if (state.currentPage < totalPages) { state.currentPage++; renderTable(); }
  });
}

// ---------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------
function setupTabs() {
  const tabs = document.querySelectorAll("#trip-tabs .emp-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.activeTab = tab.dataset.tab;
      applyFilters();
    });
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
  document.getElementById("trip-search").addEventListener("input", (e) => {
    state.searchTerm = e.target.value.trim().toLowerCase();
    applyFilters();
  });
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
setupTabs();
setupSidebarNav();
setupMiscControls();
applyFilters();