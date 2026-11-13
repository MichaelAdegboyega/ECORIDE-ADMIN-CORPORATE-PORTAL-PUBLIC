const PAGE_SIZE = 7;
const TOTAL_MOCK_COUNT = 124;

const INITIAL_TRIPS = [
  { id: "TRP-2024-0647", date: "July 22, 2026", time: "8:45 AM", from: "Ikeja", to: "VI", employee: "Sarah Johnson", status: "completed", amount: 4200 },
  { id: "TRP-2024-0648", date: "July 22, 2026", time: "8:45 AM", from: "Ikeja", to: "VI", employee: "Michael Ade", status: "completed", amount: 3150 },
  { id: "TRP-2024-0649", date: "July 22, 2026", time: "7:15 AM", from: "Ikeja", to: "VI", employee: "Linda Mo", status: "completed", amount: 1900 },
  { id: "TRP-2024-0650", date: "July 22, 2026", time: "9:25 AM", from: "Ikeja", to: "VI", employee: "James Okafor", status: "completed", amount: 2000 },
  { id: "TRP-2024-0651", date: "July 22, 2026", time: "8:30 AM", from: "Ikeja", to: "VI", employee: "Tolu Bamidele", status: "completed", amount: 3200 },
  { id: "TRP-2024-0652", date: "July 22, 2026", time: "7:45 AM", from: "Ikeja", to: "VI", employee: "Esther Bright", status: "cancelled", amount: 0 },
  { id: "TRP-2024-0653", date: "July 22, 2026", time: "9:00 AM", from: "Ikeja", to: "VI", employee: "David Wilson", status: "completed", amount: 1600 },
];

const EMPLOYEES = ["Sarah Johnson", "Michael Ade", "Linda Mo", "James Okafor", "Tolu Bamidele", "Esther Bright", "David Wilson"];
const STATUSES = ["completed", "completed", "completed", "completed", "completed", "cancelled", "upcoming", "ongoing"];
const AMOUNTS = [4200, 3150, 1900, 2000, 3200, 0, 1600, 2750];

function generateMockTrips(count) {
  const trips = [...INITIAL_TRIPS];
  const times = ["8:45 AM", "7:15 AM", "9:25 AM", "8:30 AM", "7:45 AM", "9:00 AM"];

  for (let i = trips.length; i < count; i++) {
    const status = STATUSES[i % STATUSES.length];
    trips.push({
      id: `TRP-2024-${String(647 + i).padStart(4, "0")}`,
      date: "July 22, 2026",
      time: times[i % times.length],
      from: "Ikeja",
      to: "VI",
      employee: EMPLOYEES[i % EMPLOYEES.length],
      status,
      amount: status === "cancelled" ? 0 : AMOUNTS[i % AMOUNTS.length],
    });
  }
  return trips;
}

const state = {
  trips: generateMockTrips(TOTAL_MOCK_COUNT),
  filtered: [],
  currentPage: 1,
  activeTab: "all",
  searchTerm: "",
};

function applyFilters() {
  state.filtered = state.trips.filter((trip) => {
    const matchesTab = state.activeTab === "all" || trip.status === state.activeTab;
    const matchesSearch =
      state.searchTerm === "" ||
      trip.employee.toLowerCase().includes(state.searchTerm) ||
      trip.id.toLowerCase().includes(state.searchTerm) ||
      trip.from.toLowerCase().includes(state.searchTerm) ||
      trip.to.toLowerCase().includes(state.searchTerm);
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
  const tbody = document.getElementById("trips-table-body");
  const pageItems = getPageItems();

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="ph ph-car"></i><p>No trips match this view.</p></div></td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map((trip) => `
      <tr data-id="${trip.id}">
        <td class="trip-date-cell">${trip.date}. &nbsp;${trip.time}</td>
        <td><span class="route-cell">${trip.from} <i class="ph ph-arrow-right"></i> ${trip.to}</span></td>
        <td>
          <div class="trip-employee-cell">
            <img src="Assets/Driver.jpg" alt="${trip.employee}">
            <span>${trip.employee}</span>
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
  const lastLabel = totalPages > maxVisible ? 10 : totalPages;

  container.innerHTML = `
    <span>Showing ${Math.max(0, shown)} of ${total} trips</span>
    <div class="pagination-controls">
      <button class="page-btn" id="prev-page" ${state.currentPage === 1 ? "disabled" : ""}><i class="ph ph-caret-left"></i></button>
      ${pageButtons.map((p) => `<button class="page-btn ${p === state.currentPage ? "active" : ""}" data-page="${p}">${p}</button>`).join("")}
      ${totalPages > maxVisible ? `<span class="page-ellipsis">•••</span><button class="page-btn ${state.currentPage === totalPages ? "active" : ""}" data-page="${totalPages}">${lastLabel}</button>` : ""}
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
  document.getElementById("trip-search").addEventListener("input", (e) => {
    state.searchTerm = e.target.value.trim().toLowerCase();
    applyFilters();
  });
}

setupTabs();
setupSidebarNav();
setupMiscControls();
applyFilters();
