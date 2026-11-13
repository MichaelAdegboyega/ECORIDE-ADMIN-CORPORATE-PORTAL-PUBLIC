const MOCK_DATA = {
  reportTypes: [
    { icon: "ph-chart-bar", iconType: "ph", iconBg: "#dcfce7", iconColor: "#16a34a", title: "Trips Reports", sub: "View trips analytics" },
    { icon: "ph-wallet", iconType: "ph-fill", iconBg: "#fef9c3", iconColor: "#eab308", title: "Spend Report", sub: "Track spending" },
    { icon: "ph-users", iconType: "ph-fill", iconBg: "#cffafe", iconColor: "#06b6d4", title: "Employee Report", sub: "Employee Insights" },
    { icon: "ph-file-text", iconType: "ph", iconBg: "#fae8ff", iconColor: "#d946ef", title: "Custom Report", sub: "Build custom report" },
  ],

  recentReports: [
    { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024 . 10:30 AM" },
    { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024 . 10:30 AM" },
    { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024 . 10:30 AM" },
    { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024 . 10:30 AM" },
    { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024 . 10:30 AM" },
  ],

  summaryPeriod: "May 1– May 21,2024",

  summary: [
    { icon: "ph-car", iconType: "ph", label: "Total Trips", value: "642", deltaHighlight: "+12.5%", deltaText: "vs last period" },
    { icon: "ph-wallet", iconType: "ph", label: "Total Spent", value: "N2,568,890", deltaHighlight: "+8.4%", deltaText: "vs last period" },
    { icon: "ph-users", iconType: "ph-fill", label: "Active Employees", value: "124", deltaHighlight: "+3.2%", deltaText: "vs last period" },
    { icon: "ph-file-text", iconType: "ph", label: "Total Bookings", value: "318", deltaHighlight: "+10.6%", deltaText: "vs last period" },
    { icon: "ph-star", iconType: "ph-fill", label: "Average Rating", value: "4.8", deltaHighlight: "+0.2%", deltaText: "vs last period" },
  ],
};

function renderReportTypeCards(types) {
  const container = document.getElementById("report-type-cards");
  container.innerHTML = types.map((t) => `
    <button class="report-type-card" data-title="${t.title}">
      <span class="report-type-icon" style="background-color:${t.iconBg}; color:${t.iconColor};">
        <i class="${t.iconType} ${t.icon}"></i>
      </span>
      <span class="report-type-text">
        <span class="report-type-title">${t.title}</span>
        <span class="report-type-sub">${t.sub}</span>
      </span>
    </button>
  `).join("");

  container.querySelectorAll(".report-type-card").forEach((card) => {
    card.addEventListener("click", () => {
      alert(`${card.dataset.title} is coming soon.`);
    });
  });
}

function renderRecentReports(reports) {
  const list = document.getElementById("recent-reports-list");
  list.innerHTML = reports.map((r, i) => `
    <li class="recent-report-item">
      <span class="recent-report-icon"><i class="ph ph-file-text"></i></span>
      <div class="recent-report-meta">
        <div class="recent-report-title">${r.title}</div>
        <div class="recent-report-sub">${r.generated}</div>
      </div>
      <div class="report-download-group">
        <button class="report-pdf-btn" data-index="${i}">PDF</button>
        <button class="report-more-btn" data-index="${i}" aria-label="Export options"><i class="ph-bold ph-caret-down"></i></button>
      </div>
    </li>
  `).join("");

  list.querySelectorAll(".report-pdf-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Downloading this report is coming soon.");
    });
  });
  list.querySelectorAll(".report-more-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("More export options are coming soon.");
    });
  });
}

function renderSummary(data) {
  document.getElementById("reports-summary-title").textContent = `Reports Summary (${data.summaryPeriod})`;

  const grid = document.getElementById("reports-summary-grid");
  grid.innerHTML = data.summary.map((s) => `
    <div class="reports-stat">
      <span class="reports-stat-icon"><i class="${s.iconType} ${s.icon}"></i></span>
      <div class="reports-stat-info">
        <span class="reports-stat-label">${s.label}</span>
        <span class="reports-stat-value">${s.value}</span>
        <span class="reports-stat-delta"><em>${s.deltaHighlight}</em> ${s.deltaText}</span>
      </div>
    </div>
  `).join("");
}

function setupGenerateReport() {
  document.getElementById("generate-report-btn").addEventListener("click", () => {
    const department = document.getElementById("filter-department").value;
    const reportType = document.getElementById("filter-report-type").value;
    const dateRange = document.getElementById("filter-date-range").value;
    alert(`Generating "${reportType}" for ${department}, ${dateRange} — coming soon.`);
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
  document.getElementById("view-all-reports-btn").addEventListener("click", () => {
    alert("Full reports archive is coming soon.");
  });
  document.getElementById("view-all-reports-bottom-btn").addEventListener("click", () => {
    alert("Full reports archive is coming soon.");
  });
}

renderReportTypeCards(MOCK_DATA.reportTypes);
renderRecentReports(MOCK_DATA.recentReports);
renderSummary(MOCK_DATA);
setupGenerateReport();
setupSidebarNav();
setupMiscControls();
