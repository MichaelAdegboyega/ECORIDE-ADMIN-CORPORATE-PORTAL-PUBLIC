const PAGE_SIZE = 7;
const TOTAL_MOCK_COUNT = 48;

const INITIAL_EMPLOYEES = [
  { id: "EMP-2026-004", name: "Sarah Johnson", department: "Marketing", email: "sarahj@acme.com", status: "active", joined: "June 21, 2025" },
  { id: "EMP-2026-002", name: "Michael Ade", department: "Operations", email: "michael@acme.com", status: "active", joined: "May 21, 2025" },
  { id: "EMP-2026-003", name: "Linda Mo", department: "Finance", email: "linda@acme.com", status: "active", joined: "June 16, 2025" },
  { id: "EMP-2026-005", name: "James Okafor", department: "Sales", email: "james@acme.com", status: "active", joined: "May 10, 2026" },
  { id: "EMP-2026-006", name: "Tolu Bamidele", department: "HR", email: "tolu@acme.com", status: "active", joined: "May 01, 2026" },
  { id: "EMP-2026-007", name: "Esther Bright", department: "Support", email: "esther@acme.com", status: "inactive", joined: "June 06, 2025" },
  { id: "EMP-2026-008", name: "David Wilson", department: "Operations", email: "david@acme.com", status: "active", joined: "May 27, 2026" },
];

const FIRST_NAMES = ["Grace", "Peter", "Amaka", "Chidi", "Blessing", "Kunle", "Ngozi", "Samuel", "Fatima", "Emeka"];
const LAST_NAMES = ["Eze", "Obi", "Adewale", "Okoro", "Nwosu", "Bakare", "Ibrahim", "Ojo", "Bello", "Nwachukwu"];
const DEPARTMENTS = ["Marketing", "Operations", "Finance", "Sales", "HR", "Support"];

function generateMockEmployees(count) {
  const employees = [...INITIAL_EMPLOYEES];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = employees.length; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i + 2) % LAST_NAMES.length];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const day = String((i % 27) + 1).padStart(2, "0");
    const year = i % 2 === 0 ? 2025 : 2026;
    employees.push({
      id: `EMP-2026-${String(i + 2).padStart(3, "0")}`,
      name: `${first} ${last}`,
      department: dept,
      email: `${first.toLowerCase()}@acme.com`,
      status: i % 6 === 5 ? "inactive" : "active",
      joined: `${months[i % months.length]} ${day}, ${year}`,
    });
  }
  return employees;
}

const state = {
  employees: generateMockEmployees(TOTAL_MOCK_COUNT),
  filtered: [],
  currentPage: 1,
  searchTerm: "",
  departmentFilter: "All",
  statusFilter: "All",
};

function applyFilters() {
  state.filtered = state.employees.filter((emp) => {
    const matchesSearch =
      state.searchTerm === "" ||
      emp.name.toLowerCase().includes(state.searchTerm) ||
      emp.email.toLowerCase().includes(state.searchTerm) ||
      emp.department.toLowerCase().includes(state.searchTerm);
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
            <img src="Assets/Driver.jpg" alt="${emp.name}">
            <span>${emp.name}</span>
          </div>
        </td>
        <td class="emp-dept">${emp.department}</td>
        <td class="emp-email">${emp.email}</td>
        <td><span class="status-badge ${emp.status}">${emp.status === "active" ? "Active" : "Inactive"}</span></td>
        <td class="emp-joined">${emp.joined}</td>
        <td>
          <button class="row-actions-btn" data-id="${emp.id}" aria-label="Row actions">
            <span class="dots-outline"><span></span><span></span><span></span></span>
          </button>
        </td>
      </tr>
    `).join("");
  }

  tbody.querySelectorAll("tr[data-id]").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest(".row-actions-btn")) return;
      window.location.href = `EmployeeDetail.html?id=${encodeURIComponent(row.dataset.id)}`;
    });
  });

  tbody.querySelectorAll(".row-actions-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openRowMenu(e.currentTarget, btn.dataset.id);
    });
  });

  renderPagination();
}

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
  const lastLabel = totalPages > maxVisible ? 10 : totalPages;

  container.innerHTML = `
    <span>Showing ${start} to ${end} of ${total} employees</span>
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

function openRowMenu(anchorEl, employeeId) {
  const menu = document.getElementById("row-menu");
  const rect = anchorEl.getBoundingClientRect();
  menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
  menu.style.left = `${rect.left + window.scrollX - 115}px`;
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
          emp.status = "inactive";
          applyFilters();
        }
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !e.target.closest(".row-actions-btn")) {
      closeRowMenu();
    }
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
  document.getElementById("add-employee-btn").addEventListener("click", () => {
    alert("Add Employee form is coming soon.");
  });

  const topSearch = document.getElementById("search-input");
  if (topSearch) {
    topSearch.addEventListener("input", (e) => {
      state.searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

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
