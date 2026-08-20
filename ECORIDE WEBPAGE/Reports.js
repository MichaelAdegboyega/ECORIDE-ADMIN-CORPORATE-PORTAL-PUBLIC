// Reports.js
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/corporate/reports endpoint yet
// (same situation as every other page in this app). Everything below
// reads from MOCK_DATA; swap for a real fetch() later.

const MOCK_DATA = {
    reportTypes: [
      { icon: "ph-chart-bar", iconBg: "#eef6f0", iconColor: "#34a853", title: "Trips Reports", sub: "View trips analytics" },
      { icon: "ph-coins", iconBg: "#fff6e5", iconColor: "#b7791f", title: "Spend Report", sub: "Track spending" },
      { icon: "ph-users-three", iconBg: "#eaf1fb", iconColor: "#2563eb", title: "Employee Report", sub: "Employee insights" },
      { icon: "ph-file-text", iconBg: "#f3eafb", iconColor: "#8e44ad", title: "Custom Report", sub: "Build custom report" },
    ],
  
    recentReports: [
      { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024, 10:30 AM" },
      { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024, 10:30 AM" },
      { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024, 10:30 AM" },
      { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024, 10:30 AM" },
      { title: "Trip Report - May 2024", generated: "Generated on May 21, 2024, 10:30 AM" },
    ],
  
    summaryPeriod: "May 1 – May 21, 2024",
  
    summary: [
      { icon: "ph-car", label: "Total Trips", value: "642", delta: "+12.5% vs last period" },
      { icon: "ph-coins", label: "Total Spent", value: "₦2,568,890", delta: "+8.4% vs last period" },
      { icon: "ph-users-three", label: "Active Employees", value: "124", delta: "+3.2% vs last period" },
      { icon: "ph-bookmark-simple", label: "Total Bookings", value: "318", delta: "+10.6% vs last period" },
      { icon: "ph-star", label: "Average Rating", value: "4.8", delta: "+0.2% vs last period" },
    ],
  };
  
  // ---------------------------------------------------------------
  // Render: Report type cards
  // ---------------------------------------------------------------
  function renderReportTypeCards(types) {
    const container = document.getElementById("report-type-cards");
    container.innerHTML = types.map((t) => `
      <button class="report-type-card" data-title="${t.title}">
        <span class="report-type-icon" style="background-color:${t.iconBg}; color:${t.iconColor};">
          <i class="ph-fill ${t.icon}"></i>
        </span>
        <span>
          <span class="report-type-title">${t.title}</span><br>
          <span class="report-type-sub">${t.sub}</span>
        </span>
      </button>
    `).join("");
  
    container.querySelectorAll(".report-type-card").forEach((card) => {
      card.addEventListener("click", () => {
        // TODO: each card should open its own report builder/view once
        // those flows exist. Placeholder for now.
        alert(`${card.dataset.title} is coming soon.`);
      });
    });
  }
  
  // ---------------------------------------------------------------
  // Render: Recent reports list
  // ---------------------------------------------------------------
  function renderRecentReports(reports) {
    const list = document.getElementById("recent-reports-list");
    list.innerHTML = reports.map((r, i) => `
      <li class="recent-report-item">
        <span class="recent-report-icon"><i class="ph-fill ph-file-text"></i></span>
        <div class="recent-report-meta">
          <div class="recent-report-title">${r.title}</div>
          <div class="recent-report-sub">${r.generated}</div>
        </div>
        <div class="report-download-group">
          <button class="report-pdf-btn" data-index="${i}">PDF</button>
          <button class="report-more-btn" data-index="${i}"><i class="ph ph-caret-down"></i></button>
        </div>
      </li>
    `).join("");
  
    list.querySelectorAll(".report-pdf-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        // TODO: replace with a real download link once reports are
        // actually generated/stored server-side.
        alert("Downloading this report is coming soon.");
      });
    });
    list.querySelectorAll(".report-more-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        alert("More export options are coming soon.");
      });
    });
  }
  
  // ---------------------------------------------------------------
  // Render: Reports summary
  // ---------------------------------------------------------------
  function renderSummary(data) {
    document.getElementById("reports-summary-title").textContent = `Reports Summary (${data.summaryPeriod})`;
  
    const grid = document.getElementById("reports-summary-grid");
    grid.innerHTML = data.summary.map((s) => `
      <div class="reports-stat">
        <span class="reports-stat-icon"><i class="ph-fill ${s.icon}"></i></span>
        <div class="reports-stat-value">${s.value}</div>
        <div class="reports-stat-label">${s.label}</div>
        <div class="reports-stat-delta">${s.delta}</div>
      </div>
    `).join("");
  }
  
  // ---------------------------------------------------------------
  // Quick Filters / Generate Report
  // ---------------------------------------------------------------
  function setupGenerateReport() {
    document.getElementById("generate-report-btn").addEventListener("click", () => {
      const department = document.getElementById("filter-department").value;
      const reportType = document.getElementById("filter-report-type").value;
      const dateRange = document.getElementById("filter-date-range").value;
  
      // TODO: replace with a real POST /api/v1/corporate/reports/generate
      // call (or similar) once that endpoint exists.
      alert(`Generating "${reportType}" for ${department}, ${dateRange} — coming soon.`);
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
    document.getElementById("view-all-reports-btn").addEventListener("click", () => {
      alert("Full reports archive is coming soon.");
    });
    document.getElementById("view-all-reports-bottom-btn").addEventListener("click", () => {
      alert("Full reports archive is coming soon.");
    });
  }
  
  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  renderReportTypeCards(MOCK_DATA.reportTypes);
  renderRecentReports(MOCK_DATA.recentReports);
  renderSummary(MOCK_DATA);
  setupGenerateReport();
  setupSidebarNav();
  setupMiscControls();