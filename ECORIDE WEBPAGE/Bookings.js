const PAGE_SIZE = 7;
const TOTAL_MOCK_COUNT = 18;

const INITIAL_BOOKINGS = [
  { id: "BK-2026-0561", from: "Ikeja", to: "VI", date: "July 22, 2026", time: "8:45 AM", requestedBy: "Sarah Johnson", seats: 3, status: "approved" },
  { id: "BK-2026-0562", from: "Ikeja", to: "VI", date: "July 22, 2026", time: "8:45 AM", requestedBy: "Michael Ade", seats: 1, status: "approved" },
  { id: "BK-2026-0562", from: "Ikeja", to: "VI", date: "July 22, 2026", time: "7:15 AM", requestedBy: "Linda Mo", seats: 4, status: "approved" },
  { id: "BK-2026-0563", from: "Ikeja", to: "VI", date: "July 22, 2026", time: "9:25 AM", requestedBy: "James Okafor", seats: 2, status: "approved" },
  { id: "BK-2026-0564", from: "Ikeja", to: "VI", date: "July 22, 2026", time: "8:30 AM", requestedBy: "Tolu Bamidele", seats: 1, status: "approved" },
  { id: "BK-2026-0565", from: "Ikeja", to: "VI", date: "July 22, 2026", time: "7:45 AM", requestedBy: "Esther Bright", seats: 2, status: "cancelled" },
  { id: "BK-2026-05626", from: "Ikeja", to: "VI", date: "July 22, 2026", time: "9:00 AM", requestedBy: "David Wilson", seats: 3, status: "approved" },
];

const REQUESTERS = ["Sarah Johnson", "Michael Ade", "Linda Mo", "James Okafor", "Tolu Bamidele", "Esther Bright", "David Wilson"];
const STATUSES = ["approved", "approved", "approved", "approved", "approved", "cancelled", "pending"];
const SEATS = [3, 1, 4, 2, 1, 2, 3];

function generateMockBookings(count) {
  const bookings = [...INITIAL_BOOKINGS];
  const times = ["8:45 AM", "7:15 AM", "9:25 AM", "8:30 AM", "7:45 AM", "9:00 AM"];

  for (let i = bookings.length; i < count; i++) {
    bookings.push({
      id: `BK-2026-${String(561 + i).padStart(4, "0")}`,
      from: "Ikeja",
      to: "VI",
      date: "July 22, 2026",
      time: times[i % times.length],
      requestedBy: REQUESTERS[i % REQUESTERS.length],
      seats: SEATS[i % SEATS.length],
      status: STATUSES[i % STATUSES.length],
    });
  }
  return bookings;
}

const state = {
  bookings: generateMockBookings(TOTAL_MOCK_COUNT),
  filtered: [],
  currentPage: 1,
  activeTab: "all",
  searchTerm: "",
};

function applyFilters() {
  state.filtered = state.bookings.filter((b) => {
    const matchesTab = state.activeTab === "all" || b.status === state.activeTab;
    const matchesSearch =
      state.searchTerm === "" ||
      b.requestedBy.toLowerCase().includes(state.searchTerm) ||
      b.id.toLowerCase().includes(state.searchTerm) ||
      b.from.toLowerCase().includes(state.searchTerm) ||
      b.to.toLowerCase().includes(state.searchTerm);
    return matchesTab && matchesSearch;
  });
  state.currentPage = 1;
  renderTable();
}

function getPageItems() {
  const start = (state.currentPage - 1) * PAGE_SIZE;
  return state.filtered.slice(start, start + PAGE_SIZE);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderTable() {
  const tbody = document.getElementById("bookings-table-body");
  const pageItems = getPageItems();

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="ph ph-identification-card"></i><p>No bookings match this view.</p></div></td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map((b) => `
      <tr>
        <td class="booking-id-cell">${b.id}</td>
        <td><span class="route-cell">${b.from} <i class="ph ph-arrow-right"></i> ${b.to}</span></td>
        <td class="booking-date-cell">${b.date}. &nbsp;${b.time}</td>
        <td>
          <div class="requested-by-cell">
            <img src="Assets/Driver.jpg" alt="${b.requestedBy}">
            <span>${b.requestedBy}</span>
          </div>
        </td>
        <td class="booking-seats-cell">${b.seats}</td>
        <td><span class="status-badge ${b.status}">${capitalize(b.status)}</span></td>
      </tr>
    `).join("");
  }

  renderPagination();
}

function renderPagination() {
  const container = document.getElementById("bookings-pagination");
  const total = state.filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const shown = total === TOTAL_MOCK_COUNT && state.currentPage === 1 ? 6 : Math.min(PAGE_SIZE, total - (state.currentPage - 1) * PAGE_SIZE);

  const pageButtons = [];
  const maxVisible = 3;
  for (let p = 1; p <= Math.min(maxVisible, totalPages); p++) {
    pageButtons.push(p);
  }
  const lastLabel = 10;

  container.innerHTML = `
    <span>Showing ${Math.max(0, shown)} of ${total} bookings</span>
    <div class="pagination-controls">
      <button class="page-btn" id="prev-page" ${state.currentPage === 1 ? "disabled" : ""}><i class="ph ph-caret-left"></i></button>
      ${pageButtons.map((p) => `<button class="page-btn ${p === state.currentPage ? "active" : ""}" data-page="${p}">${p}</button>`).join("")}
      <span class="page-ellipsis">•••</span>
      <button class="page-btn ${state.currentPage === totalPages && totalPages > maxVisible ? "active" : ""}" data-page="${totalPages}">${lastLabel}</button>
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
    if (state.currentPage > 1) {
      state.currentPage--;
      renderTable();
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderTable();
    }
  });
}

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

function setupSidebarNav() {
  document.querySelectorAll("#sidebar-nav-list .nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const href = item.dataset.href;
      if (href) window.location.href = href;
    });
  });
}

function setupMiscControls() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("sidebar-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");

  if (toggleBtn && sidebar && backdrop) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("active");
    });
    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("active");
    });
  }

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
  const topbarSearch = document.getElementById("topbar-booking-search");
  if (topbarSearch) {
    topbarSearch.addEventListener("input", (e) => {
      state.searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
  document.getElementById("create-booking-btn").addEventListener("click", () => {
    window.location.href = "CreateBooking.html";
  });
}

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
