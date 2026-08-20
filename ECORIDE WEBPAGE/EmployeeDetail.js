// EmployeeDetail.js
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/corporate/employees/:id endpoint
// yet. This reads ?id=EMP-2026-XXX from the URL (set by Employees.js when
// linking here) and generates matching mock data deterministically from
// that id, so clicking different employees actually shows different
// details instead of always the same hardcoded person. Once a real
// endpoint exists, replace getEmployeeById() below with a fetch() call —
// everything else (render functions) already expects this same shape.

const FIRST_NAMES = ["Sarah", "Michael", "Linda", "James", "Tolu", "Esther", "David", "Grace", "Peter", "Amaka", "Chidi", "Blessing"];
const LAST_NAMES = ["Johnson", "Ade", "Mo", "Okafor", "Bamidele", "Bright", "Wilson", "Eze", "Obi", "Adewale", "Okoro", "Nwosu"];
const DEPARTMENTS = ["Marketing", "Operations", "Finance", "Sales", "HR", "Support"];
const TITLES = {
  Marketing: "Marketing Manager", Operations: "Operations Associate", Finance: "Finance Analyst",
  Sales: "Sales Executive", HR: "HR Officer", Support: "Support Specialist",
};
const MANAGERS = ["David Wilson", "Grace Eze", "Peter Obi", "Amaka Adewale"];
const OFFICES = ["Victoria Island", "Ikeja", "Lekki Phase 1", "Surulere"];
const WORK_MODES = ["Hybrid", "Remote", "On-site"];

function getEmployeeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "EMP-2026-004"; // fallback to the design's original example
}

function getEmployeeById(id) {
  // parse the numeric suffix so the same id always maps to the same
  // generated person (matches the generation logic in Employees.js)
  const match = id.match(/(\d+)$/);
  const i = match ? Math.max(0, parseInt(match[1], 10) - 1) : 0;

  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[(i + 3) % LAST_NAMES.length];
  const department = DEPARTMENTS[i % DEPARTMENTS.length];
  const status = i % 6 === 5 ? "inactive" : "active";

  return {
    name: `${first} ${last}`,
    title: TITLES[department],
    department: `${department} Department`,
    status,
    employeeId: id,
    joined: "May 12, 2024",
    type: i % 4 === 0 ? "Part-time" : "Full-time",
    email: `${first.toLowerCase()}.${last.toLowerCase()}@acme.com`,
    manager: MANAGERS[i % MANAGERS.length],
    workMode: WORK_MODES[i % WORK_MODES.length],
    phone: `+234 8${String(10000000 + i * 137).slice(0, 8)}`,
    office: OFFICES[i % OFFICES.length],

    summary: [
      { icon: "ph-car", label: "Total Trips", value: String(10 + (i * 3) % 40), delta: "+12.6% vs last 7 days" },
      { icon: "ph-coins", label: "Total Spend", value: `₦${(100000 + i * 4300).toLocaleString()}`, delta: "+8% vs last 7 days" },
      { icon: "ph-wallet", label: "This Month Spend", value: `₦${(60000 + i * 1900).toLocaleString()}`, delta: "+5% vs last 7 days" },
      { icon: "ph-star", label: "Average rating", value: (4.2 + (i % 8) * 0.1).toFixed(1), delta: "+0.3% vs last 7 days" },
    ],

    preferredRoutes: [
      { from: "Lekki Phase 1", to: "Victoria Island" },
      { from: "Ikeja", to: "Victoria Island" },
      { from: "Surulere", to: "Lekki Phase 1" },
    ],

    emergencyContact: { name: "Michael Johnson", relationship: "Brother", phone: "+234 803 467 7985" },

    activity: [
      { icon: "ph-car", title: "Booked morning commute", sub: "Lekki Phase 1 → Victoria Island", time: "July 21, 2026, 8:00 AM" },
      { icon: "ph-check-circle", title: "Completed ride", sub: "Lekki Phase 1 → Victoria Island", time: "July 21, 2026, 8:45 AM" },
      { icon: "ph-calendar-check", title: "Booking approved", sub: "Monthly recurring booking", time: "July 20, 2026, 4:45 PM" },
      { icon: "ph-wallet", title: "Transport allowance updated", sub: "July 2026 allowance credited", time: "July 20, 2026, 2:30 PM" },
      { icon: "ph-file-text", title: "Submitted reimbursement", sub: "Client meeting transport", time: "July 18, 2026, 7:30 AM" },
      { icon: "ph-arrows-left-right", title: "Route changed", sub: "Surulere → Victoria Island", time: "July 17, 2026, 9:45 AM" },
    ],
  };
}

// ---------------------------------------------------------------
// Render: profile card
// ---------------------------------------------------------------
function renderProfile(emp) {
  document.getElementById("profile-name").textContent = emp.name;
  document.getElementById("profile-title").textContent = `${emp.title}`;
  document.getElementById("profile-dept").textContent = emp.department;

  const statusEl = document.getElementById("profile-status");
  statusEl.textContent = emp.status === "active" ? "Active" : "Inactive";
  statusEl.className = `status-badge ${emp.status}`;

  document.getElementById("detail-empid").textContent = emp.employeeId;
  document.getElementById("detail-joined").textContent = emp.joined;
  document.getElementById("detail-type").textContent = emp.type;
  document.getElementById("detail-email").textContent = emp.email;
  document.getElementById("detail-manager").textContent = emp.manager;
  document.getElementById("detail-workmode").textContent = emp.workMode;
  document.getElementById("detail-phone").textContent = emp.phone;
  document.getElementById("detail-office").textContent = emp.office;
}

// ---------------------------------------------------------------
// Render: summary stat grid
// ---------------------------------------------------------------
function renderSummary(summary) {
  const grid = document.getElementById("summary-grid");
  grid.innerHTML = summary.map((s) => `
    <div class="summary-item">
      <div class="summary-icon"><i class="ph-fill ${s.icon}"></i></div>
      <div class="summary-value">${s.value}</div>
      <div class="summary-label">${s.label}</div>
      <div class="summary-delta">${s.delta}</div>
    </div>
  `).join("");
}

// ---------------------------------------------------------------
// Render: preferred routes
// ---------------------------------------------------------------
function renderPreferredRoutes(routes) {
  const list = document.getElementById("preferred-routes");
  list.innerHTML = routes.map((r) => `
    <li class="preferred-route-item">
      <span class="preferred-route-icon"><i class="ph-fill ph-map-pin"></i></span>
      <span class="preferred-route-text">${r.from} <i class="ph ph-arrow-right"></i> ${r.to}</span>
      <span class="preferred-tag">Preferred</span>
    </li>
  `).join("");
}

// ---------------------------------------------------------------
// Render: emergency contact
// ---------------------------------------------------------------
function renderEmergencyContact(ec) {
  document.getElementById("emergency-contact").innerHTML = `
    <div><span class="ec-label">Name</span><span class="ec-value">${ec.name}</span></div>
    <div><span class="ec-label">Relationship</span><span class="ec-value">${ec.relationship}</span></div>
    <div><span class="ec-label">Phone</span><span class="ec-value">${ec.phone}</span></div>
  `;
}

// ---------------------------------------------------------------
// Render + interact: Activity list (with filter dropdown)
// ---------------------------------------------------------------
function renderActivity(activity) {
  const list = document.getElementById("activity-list");
  list.innerHTML = activity.map((a) => `
    <li class="activity-item">
      <div class="activity-row">
        <div class="activity-text-row">
          <span class="activity-icon"><i class="ph-fill ${a.icon}"></i></span>
          <div>
            <div class="activity-title">${a.title}</div>
            <div class="activity-sub">${a.sub}</div>
          </div>
        </div>
        <span class="activity-time">${a.time}</span>
      </div>
    </li>
  `).join("");
}

function setupActivityFilter(activity) {
  const select = document.getElementById("activity-filter");
  const categoryMap = {
    "Trips": ["ph-car", "ph-check-circle"],
    "Bookings": ["ph-calendar-check"],
    "Payments": ["ph-wallet", "ph-file-text"],
  };

  select.addEventListener("change", () => {
    const value = select.value;
    if (value === "All Activity") {
      renderActivity(activity);
      return;
    }
    const icons = categoryMap[value] || [];
    renderActivity(activity.filter((a) => icons.includes(a.icon)));
  });
}

// ---------------------------------------------------------------
// Detail tabs (Activity / Bookings / Trips / Expenses / Documents)
// ---------------------------------------------------------------
function setupDetailTabs() {
  const tabs = document.querySelectorAll(".detail-tab");
  const activityPanel = document.getElementById("activity-panel");
  const otherPanel = document.getElementById("other-tab-panel");
  const otherLabel = document.getElementById("other-tab-label");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (tab.dataset.tab === "activity") {
        activityPanel.style.display = "block";
        otherPanel.style.display = "none";
      } else {
        activityPanel.style.display = "none";
        otherPanel.style.display = "block";
        // TODO: each of these needs its own real data view once the
        // corresponding endpoint exists (employee-scoped bookings,
        // trips, expenses, documents).
        otherLabel.textContent = `${tab.textContent.trim()} view is coming soon.`;
      }
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
  document.getElementById("edit-employee-btn").addEventListener("click", () => {
    alert("Edit Employee form is coming soon.");
  });
  document.getElementById("more-actions-btn").addEventListener("click", () => {
    alert("More actions menu is coming soon.");
  });
  document.getElementById("view-all-activity").addEventListener("click", () => {
    alert("Full activity history is coming soon.");
  });
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
const currentEmployee = getEmployeeById(getEmployeeIdFromUrl());

renderProfile(currentEmployee);
renderSummary(currentEmployee.summary);
renderPreferredRoutes(currentEmployee.preferredRoutes);
renderEmergencyContact(currentEmployee.emergencyContact);
renderActivity(currentEmployee.activity);
setupActivityFilter(currentEmployee.activity);
setupDetailTabs();
setupSidebarNav();
setupMiscControls();