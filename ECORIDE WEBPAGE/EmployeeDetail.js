const EMPLOYEES_MAP = {
  "EMP-2026-004": {
    name: "Sarah Johnson",
    title: "Marketing Manager",
    department: "Marketing Department",
    status: "active",
    employeeId: "EMP-2026-004",
    joined: "May 12, 2024",
    type: "Full-time",
    email: "sarah.johnson@acme.com",
    manager: "David Wilson",
    workMode: "Hybrid",
    phone: "+234 812 345 6789",
    office: "Victoria Island",
  },
  "EMP-2026-002": {
    name: "Michael Ade",
    title: "Operations Manager",
    department: "Operations Department",
    status: "active",
    employeeId: "EMP-2026-002",
    joined: "May 21, 2025",
    type: "Full-time",
    email: "michael.ade@acme.com",
    manager: "David Wilson",
    workMode: "Hybrid",
    phone: "+234 812 345 6789",
    office: "Victoria Island",
  },
  "EMP-2026-003": {
    name: "Linda Mo",
    title: "Finance Analyst",
    department: "Finance Department",
    status: "active",
    employeeId: "EMP-2026-003",
    joined: "June 16, 2025",
    type: "Full-time",
    email: "linda.mo@acme.com",
    manager: "David Wilson",
    workMode: "Hybrid",
    phone: "+234 812 345 6789",
    office: "Victoria Island",
  },
};

function getEmployeeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "EMP-2026-004";
}

function getEmployeeById(id) {
  const base = EMPLOYEES_MAP[id] || EMPLOYEES_MAP["EMP-2026-004"];

  return {
    ...base,
    summary: [
      { icon: "ph-car", iconType: "ph", label: "Total Trips", value: "24", deltaHighlight: "+12.6%", deltaText: "vs last 7 days" },
      { icon: "ph-credit-card", iconType: "ph", label: "Total Spend", value: "N156,800", deltaHighlight: "+8%", deltaText: "vs last 7 days" },
      { icon: "ph-credit-card", iconType: "ph", label: "This Month Spend", value: "N99,400", deltaHighlight: "+5%", deltaText: "vs last 7 days" },
      { icon: "ph-star", iconType: "ph-fill", iconClass: "star", label: "Average rating", value: "4.8", deltaHighlight: "+0.3%", deltaText: "vs last 7 days" },
    ],
    preferredRoutes: [
      { from: "Lekki Phase 1", to: "Victoria Island" },
      { from: "Ikeja", to: "Victoria Island" },
      { from: "Surulere", to: "Lekki Phase 1" },
    ],
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Brother",
      phone: "+234 803 467 7985",
    },
    activity: [
      { icon: "ph-car", title: "Booked morning commute", routeFrom: "Lekki Phase 1", routeTo: "Victoria Island", time: "July 21, 2026.  8:00 AM" },
      { icon: "ph-check-circle", title: "Completed ride", routeFrom: "Lekki Phase 1", routeTo: "Victoria Island", time: "July 21, 2026.  8:45 AM" },
      { icon: "ph-calendar-blank", title: "Booking approved", sub: "Monthly recurring booking", time: "July 20, 2026.  4:45 PM" },
      { icon: "ph-wallet", title: "Transport allowance updated", sub: "July 2026 allowance credited", time: "July 20, 2026.  2:30 PM" },
      { icon: "ph-file-text", title: "Submitted reimbursement", sub: "Client meeting transport", time: "July 18, 2026.  7:30 AM" },
      { icon: "ph-git-branch", title: "Route changed", routeFrom: "Surulere", routeTo: "Victoria Island", time: "July 17, 2026.  9:45 AM" },
    ],
  };
}

function renderProfile(emp) {
  document.getElementById("profile-name").textContent = emp.name;
  document.getElementById("profile-title").textContent = emp.title;
  document.getElementById("profile-dept").textContent = emp.department;

  const statusEl = document.getElementById("profile-status");
  statusEl.textContent = emp.status === "active" ? "Active" : "Inactive";
  statusEl.className = `profile-status-pill ${emp.status}`;

  document.getElementById("detail-empid").textContent = emp.employeeId;
  document.getElementById("detail-joined").textContent = emp.joined;
  document.getElementById("detail-type").textContent = emp.type;
  document.getElementById("detail-email").textContent = emp.email;
  document.getElementById("detail-manager").textContent = emp.manager;
  document.getElementById("detail-workmode").textContent = emp.workMode;
  document.getElementById("detail-phone").textContent = emp.phone;
  document.getElementById("detail-office").textContent = emp.office;
}

function renderSummary(summary) {
  const grid = document.getElementById("summary-grid");
  grid.innerHTML = summary.map((s) => `
    <div class="summary-item">
      <div class="summary-icon ${s.iconClass || ""}"><i class="${s.iconType} ${s.icon}"></i></div>
      <div class="summary-text">
        <span class="summary-label">${s.label}</span>
        <span class="summary-value">${s.value}</span>
        <span class="summary-delta"><em>${s.deltaHighlight}</em> ${s.deltaText}</span>
      </div>
    </div>
  `).join("");
}

function renderPreferredRoutes(routes) {
  const list = document.getElementById("preferred-routes");
  list.innerHTML = routes.map((r) => `
    <li class="preferred-route-item">
      <span class="preferred-route-icon"><i class="ph ph-git-branch"></i></span>
      <span class="preferred-route-text">${r.from} <i class="ph ph-arrow-right"></i> ${r.to}</span>
      <span class="preferred-tag">Preferred</span>
    </li>
  `).join("");
}

function renderEmergencyContact(ec) {
  document.getElementById("emergency-contact").innerHTML = `
    <div><span class="ec-label">Name</span><span class="ec-value">${ec.name}</span></div>
    <div><span class="ec-label">Relationship</span><span class="ec-value">${ec.relationship}</span></div>
    <div><span class="ec-label">Phone</span><span class="ec-value">${ec.phone}</span></div>
  `;
}

function renderActivity(activity) {
  const list = document.getElementById("activity-list");
  list.innerHTML = activity.map((a) => {
    const subHtml = a.routeFrom
      ? `<div class="activity-sub">${a.routeFrom} <i class="ph ph-arrow-right"></i> ${a.routeTo}</div>`
      : `<div class="activity-sub">${a.sub}</div>`;

    return `
      <li class="activity-item">
        <div class="activity-row">
          <div class="activity-text-row">
            <span class="activity-icon"><i class="ph ${a.icon}"></i></span>
            <div>
              <div class="activity-title">${a.title}</div>
              ${subHtml}
            </div>
          </div>
          <span class="activity-time">${a.time}</span>
        </div>
      </li>
    `;
  }).join("");
}

function setupActivityFilter(activity) {
  const select = document.getElementById("activity-filter");
  const categoryMap = {
    Trips: ["ph-car", "ph-check-circle", "ph-git-branch"],
    Bookings: ["ph-calendar-blank"],
    Payments: ["ph-wallet", "ph-file-text"],
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
        otherLabel.textContent = `${tab.textContent.trim()} view is coming soon.`;
      }
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
  document.getElementById("edit-employee-btn").addEventListener("click", () => {
    alert("Edit Employee form is coming soon.");
  });
  document.getElementById("more-actions-btn").addEventListener("click", () => {
    alert("More actions menu is coming soon.");
  });
  document.getElementById("view-all-activity").addEventListener("click", () => {
    alert("Full activity history is coming soon.");
  });
  document.getElementById("preferred-view-all").addEventListener("click", (e) => {
    e.preventDefault();
    alert("All preferred routes coming soon.");
  });
}

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
