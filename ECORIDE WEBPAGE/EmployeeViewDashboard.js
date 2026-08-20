// Employees.js
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/corporate/employees endpoint yet
// (same situation as the Overview dashboard). MOCK_EMPLOYEES below stands
// in for that response. Swapping to a real fetch() later only means
// replacing how `state.employees` is populated — everything else (render,
// filter, paginate) already works off that array.

const PAGE_SIZE = 7;
const TOTAL_MOCK_COUNT = 48; // matches "Showing 1 to 7 of 48 employees" in the design

const FIRST_NAMES = ["Sarah", "Michael", "Linda", "James", "Tolu", "Esther", "David", "Grace", "Peter", "Amaka", "Chidi", "Blessing"];
const LAST_NAMES = ["Johnson", "Ade", "Mo", "Okafor", "Bamidele", "Bright", "Wilson", "Eze", "Obi", "Adewale", "Okoro", "Nwosu"];
const DEPARTMENTS = ["Marketing", "Operations", "Finance", "Sales", "HR", "Support"];

function generateMockEmployees(count) {
  const employees = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i + 3) % LAST_NAMES.length];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    employees.push({
      id: `EMP-2026-${String(i + 1).padStart(3, "0")}`,
      name: `${first} ${last}`,
      department: dept,
      email: `${first.toLowerCase()}${i}@acme.com`,
      status: i % 6 === 5 ? "inactive" : "active",
      joined: mockJoinDate(i),
    });
  }
  return employees;
}

function mockJoinDate(i) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[i % 12];
  const day = (i % 28) + 1;
  const year = i % 3 === 0 ? 2026 : 2025;
  return `${month} ${day}, ${year}`;
}

const state = {
  employees: generateMockEmployees(TOTAL_MOCK_COUNT),
  filtered: [],
  currentPage: 1,
  searchTerm: "",
  departmentFilter: "All",
  statusFilter: "All",
};

// ---------------------------------------------------------------
// Filtering + pagination
// ---------------------------------------------------------------
function applyFilters() {
  state.filtered = state.employees.filter((emp) => {
    const matchesSearch = state.searchTerm === "" ||
      emp.name.toLowerCase().includes(state.searchTerm) ||
      emp.email.toLowerCase().includes(state.searchTerm);
    const matchesDept = state.departmentFilter === "All" || emp.department === state.departmentFilter;
    const matchesStatus = state.statusFilter === "All" || emp.status === state.statusFilter.toLowerCase();
    return matchesSearch && matchesDept && matchesStatus;
  });
  state.currentPage = 1;
  renderTable();
}

function getPageItems() {
  const start = (state.currentPage - 1) * PAGE_SIZE;
  return state.filtered.slice(start, start + PAGE_SIZE);
}

// ---------------------------------------------------------------
// Render: table body
// ---------------------------------------------------------------
function renderTable() {
  const tbody = document.getElementById("employees-table-body");
  const pageItems = getPageItems();

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="ph ph-users"></i><p>No employees match your search.</p></div></td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map((emp) => `
      <tr data-id="${emp.id}">
        <td>
          <div class="emp-name-cell">
            <img src="Assets/avatar-placeholder.png" alt="">
            ${emp.name}
          </div>
        </td>
        <td>${emp.department}</td>
        <td class="emp-email">${emp.email}</td>
        <td><span class="status-badge ${emp.status}">${emp.status === "active" ? "Active" : "Inactive"}</span></td>
        <td>${emp.joined}</td>
        <td><button class="row-actions-btn" data-id="${emp.id}"><i class="ph ph-dots-three"></i></button></td>
      </tr>
    `).join("");
  }

  document.querySelectorAll(".row-actions-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => openRowMenu(e.currentTarget, btn.dataset.id));
  });

  renderPagination();
}

// ---------------------------------------------------------------
// Render: pagination
// ---------------------------------------------------------------
function renderPagination() {
  const container = document.getElementById("employees-pagination");
  const total = state.filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = total === 0 ? 0 : (state.currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(state.currentPage * PAGE_SIZE, total);

  const pageButtons = [];
  const maxVisible = 3;
  for (let p = 1; p <= Math.min(maxVisible, totalPages); p++) {
    pageButtons.push(p);
  }

  container.innerHTML = `
    <span>Showing ${start} to ${end} of ${total} employees</span>
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
// Row-action menu (View Details / Edit / Deactivate)
// ---------------------------------------------------------------
function openRowMenu(anchorEl, employeeId) {
  const menu = document.getElementById("row-menu");
  const rect = anchorEl.getBoundingClientRect();
  menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
  menu.style.left = `${rect.left + window.scrollX - 130}px`;
  menu.classList.add("open");
  menu.dataset.employeeId = employeeId;
}

function closeRowMenu() {
  document.getElementById("row-menu").classList.remove("open");
}

function setupRowMenuActions() {
  const menu = document.getElementById("row-menu");
  menu.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const employeeId = menu.dataset.employeeId;
      const action = btn.dataset.action;
      closeRowMenu();

      if (action === "view") {
        window.location.href = `EmployeeDetail.html?id=${encodeURIComponent(employeeId)}`;
      } else if (action === "edit") {
        alert(`Edit Employee (${employeeId}) is coming soon.`);
      } else if (action === "deactivate") {
        const emp = state.employees.find((e) => e.id === employeeId);
        if (emp && confirm(`Deactivate ${emp.name}?`)) {
          // TODO: replace with real PATCH /api/v1/corporate/employees/:id
          emp.status = "inactive";
          applyFilters();
        }
      }
    });
  });

  // close menu on outside click
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !e.target.closest(".row-actions-btn")) {
      closeRowMenu();
    }
  });
}

// ---------------------------------------------------------------
// Filter dropdowns (Department / Status)
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
// Tabs (All Employees / Invitations)
// ---------------------------------------------------------------
function setupTabs() {
  const tabs = document.querySelectorAll(".emp-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const isAll = tab.dataset.tab === "all";
      document.getElementById("all-employees-view").style.display = isAll ? "block" : "none";
      document.getElementById("invitations-view").style.display = isAll ? "none" : "block";
    });
  });
}

// ---------------------------------------------------------------
// Sidebar nav (shared pattern — active state + real page links this
// time, since these pages now actually exist)
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
  document.getElementById("add-employee-btn").addEventListener("click", () => {
    alert("Add Employee form is coming soon.");
  });
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
document.getElementById("employee-search").addEventListener("input", (e) => {
  state.searchTerm = e.target.value.trim().toLowerCase();
  applyFilters();
});

setupFilterDropdown("department-filter", ["All", ...DEPARTMENTS], (value) => {
  state.departmentFilter = value;
  applyFilters();
});
setupFilterDropdown("status-filter", ["All", "Active", "Inactive"], (value) => {
  state.statusFilter = value;
  applyFilters();
});

setupRowMenuActions();
setupTabs();
setupSidebarNav();
setupMiscControls();
applyFilters();