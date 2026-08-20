// Bookings.js
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/corporate/bookings endpoint yet
// (same pattern as every other page). MOCK bookings generated below;
// swap generateMockBookings() for a real fetch() later — render/filter/
// paginate logic doesn't need to change.

const PAGE_SIZE = 6;
const TOTAL_MOCK_COUNT = 18; // matches "Showing 6 of 18 bookings" in the design

const REQUESTERS = ["Sarah Johnson", "Michael Ade", "Linda Mo", "James Okafor", "Tolu Bamidele", "Esther Bright", "David Wilson"];
const STATUSES = ["approved", "approved", "approved", "approved", "approved", "cancelled", "pending"];
const SEATS = [3, 1, 4, 2, 1, 2, 3];

function generateMockBookings(count) {
  const bookings = [];
  for (let i = 0; i < count; i++) {
    bookings.push({
      id: `BK-2026-${String(561 + i).padStart(4, "0")}`,
      from: "Ikeja",
      to: "VI",
      date: "July 22, 2026",
      time: mockTime(i),
      requestedBy: REQUESTERS[i % REQUESTERS.length],
      seats: SEATS[i % SEATS.length],
      status: STATUSES[i % STATUSES.length],
    });
  }
  return bookings;
}

function mockTime(i) {
  const hours = [7, 8, 9];
  const mins = ["00", "15", "25", "30", "45"];
  const h = hours[i % hours.length];
  const m = mins[i % mins.length];
  return `${h}:${m} AM`;
}

const state = {
  bookings: generateMockBookings(TOTAL_MOCK_COUNT),
  filtered: [],
  currentPage: 1,
  activeTab: "all",
  searchTerm: "",
};

// ---------------------------------------------------------------
// Filtering + pagination
// ---------------------------------------------------------------
function applyFilters() {
  state.filtered = state.bookings.filter((b) => {
    const matchesTab = state.activeTab === "all" || b.status === state.activeTab;
    const matchesSearch = state.searchTerm === "" ||
      b.requestedBy.toLowerCase().includes(state.searchTerm) ||
      b.id.toLowerCase().includes(state.searchTerm);
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
  const tbody = document.getElementById("bookings-table-body");
  const pageItems = getPageItems();

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="ph ph-bookmark-simple"></i><p>No bookings match this view.</p></div></td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map((b) => `
      <tr>
        <td class="booking-id-cell">${b.id}</td>
        <td><span class="route-cell">${b.from} <i class="ph ph-arrow-right"></i> ${b.to}</span></td>
        <td>${b.date}. &nbsp;${b.time}</td>
        <td>
          <div class="requested-by-cell">
            <img src="Assets/avatar-placeholder.png" alt="">
            ${b.requestedBy}
          </div>
        </td>
        <td>${b.seats}</td>
        <td><span class="status-badge ${b.status}">${capitalize(b.status)}</span></td>
      </tr>
    `).join("");
  }

  renderPagination();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---------------------------------------------------------------
// Render: pagination
// ---------------------------------------------------------------
function renderPagination() {
  const container = document.getElementById("bookings-pagination");
  const total = state.filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const shown = Math.min(PAGE_SIZE, total - (state.currentPage - 1) * PAGE_SIZE);

  const pageButtons = [];
  const maxVisible = 3;
  for (let p = 1; p <= Math.min(maxVisible, totalPages); p++) {
    pageButtons.push(p);
  }

  container.innerHTML = `
    <span>Showing ${Math.max(0, shown)} of ${total} bookings</span>
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
  const tabs = document.querySelectorAll("#booking-tabs .emp-tab");
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
// Filter dropdowns (Date Range / Status) — same pattern as Employees.js
// ---------------------------------------------------------------
function setupFilterDropdown(containerId, options, onSelect) {
  const container = document.getElementById(containerId);
  const btn = container.querySelector(".filter-btn");

  const menu = document.createElement("div");
  menu.className = "filter-menu";
  menu.innerHTML = options.map((opt) => `<button data-value="${opt}" class="${opt === "All" ? "selected" : ""}">${opt}</button>`).join("");
  container.appendChild(menu);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".filter-dropdown.open").forEach((el) => {
      if (el !== container) el.classList.remove("open");
    });
    container.classList.toggle("open");
  });

  menu.querySelectorAll("button").forEach((optBtn) => {
    optBtn.addEventListener("click", () => {
      menu.querySelectorAll("button").forEach((b) => b.classList.remove("selected"));
      optBtn.classList.add("selected");
      container.classList.remove("open");
      onSelect(optBtn.dataset.value);
    });
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) container.classList.remove("open");
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
  document.getElementById("booking-search").addEventListener("input", (e) => {
    state.searchTerm = e.target.value.trim().toLowerCase();
    applyFilters();
  });
  document.getElementById("create-booking-btn").addEventListener("click", () => {
    window.location.href = "CreateBooking.html";
  });
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
setupFilterDropdown("date-range-filter", ["All", "This Week", "This Month", "Last Month"], () => applyFilters());
setupFilterDropdown("booking-status-filter", ["All", "Pending", "Approved", "Cancelled"], (value) => {
  const tabMap = { All: "all", Pending: "pending", Approved: "approved", Cancelled: "cancelled" };
  state.activeTab = tabMap[value];
  document.querySelectorAll("#booking-tabs .emp-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === state.activeTab);
  });
  applyFilters();
});

setupTabs();
setupSidebarNav();
setupMiscControls();
applyFilters();