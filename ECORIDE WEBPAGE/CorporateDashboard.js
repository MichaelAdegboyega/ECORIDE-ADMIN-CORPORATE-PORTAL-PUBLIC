// CorporateDashboard.js
//
// ⚠️ MOCK DATA — GET /api/v1/corporate/dashboard isn't confirmed yet
// (flagged earlier: the corporate flow doc shows a sample response shape,
// but the actual endpoint hasn't been verified against the deployed
// backend). Everything below reads from the MOCK_DATA object so that
// swapping in a real fetch() later only means replacing renderDashboard's
// data source — the render functions themselves don't need to change if
// the real response matches this shape.

const MOCK_DATA = {
    stats: [
      { icon: "ph-users-three", label: "Active Employees", value: "1,248", delta: "+12.6% vs last 7 days", deltaType: "up" },
      { icon: "ph-car", label: "Today's Trips", value: "356", delta: "+10.2% vs last 7 days", deltaType: "up" },
      { icon: "ph-coins", label: "Monthly Transport Spend", value: "₦4,568,890", delta: "+4.3% vs last month", deltaType: "up" },
      { icon: "ph-calendar-check", label: "Pending Ride Requests", value: "18", delta: "View and approve requests", deltaType: "neutral", action: true },
    ],
  
    bookings: [
      { date: "July 21, 2026, 8:00 AM", from: "Lekki Phase 1", to: "Victoria Island", seats: 12, avatars: 3, more: 7 },
      { date: "July 21, 2026, 1:45 PM", from: "Ikeja", to: "Victoria Island", seats: 8, avatars: 3, more: 3 },
      { date: "July 22, 2026, 8:45 AM", from: "Ikeja", to: "Lekki Phase 1", seats: 10, avatars: 3, more: 6 },
      { date: "July 22, 2026, 9:00 PM", from: "Victoria Island", to: "Ikeja", seats: 6, avatars: 3, more: 2 },
    ],
  
    requests: [
      { id: "r1", name: "Sarah Johnson", from: "Ikeja", to: "VI", date: "July 22, 2026, 8:45 AM", seats: 10 },
      { id: "r2", name: "Michael Ade", from: "Ikeja", to: "Surulere", date: "July 22, 2026, 7:15 AM", seats: 6 },
      { id: "r3", name: "Linda Chukwu", from: "Lekki", to: "VI", date: "July 22, 2026, 6:30 PM", seats: 4 },
    ],
  
    quickActions: [
      { icon: "ph-plus-circle", title: "Create Ride", sub: "Schedule a ride" },
      { icon: "ph-user-plus", title: "Invite Employee", sub: "Add team member" },
      { icon: "ph-download-simple", title: "Download Report", sub: "Get insights" },
    ],
  
    chart: [
      { label: "Jan", value: 210000 },
      { label: "Feb", value: 390000 },
      { label: "Mar", value: 260000 },
      { label: "Apr", value: 310000 },
      { label: "May", value: 460000 },
    ],
  
    wallet: { balance: "₦2,335,600.00" },
  
    routes: [
      { from: "Lekki Phase 1", to: "Victoria Island", trips: 142 },
      { from: "Ikeja", to: "Victoria Island", trips: 98 },
      { from: "Surulere", to: "Lekki Phase", trips: 62 },
      { from: "Victoria Island", to: "Ikeja", trips: 54 },
      { from: "Yaba", to: "Victoria Island", trips: 42 },
    ],
  };
  
  // ---------------------------------------------------------------
  // Render: Stat cards
  // ---------------------------------------------------------------
  function renderStatCards(stats) {
    const container = document.getElementById("stat-cards");
    container.innerHTML = stats.map((stat) => `
      <div class="stat-card">
        <div class="stat-card-top">
          <span class="stat-icon"><i class="ph-fill ${stat.icon}"></i></span>
          ${stat.label}
        </div>
        <div class="stat-value">${stat.value}</div>
        ${stat.action
          ? `<span class="stat-action" data-action="pending-requests">${stat.delta}</span>`
          : `<span class="stat-delta ${stat.deltaType === "neutral" ? "neutral" : ""}">${stat.delta}</span>`
        }
      </div>
    `).join("");
  
    const pendingAction = container.querySelector('[data-action="pending-requests"]');
    if (pendingAction) {
      pendingAction.addEventListener("click", () => {
        document.getElementById("requests-list").scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }
  
  // ---------------------------------------------------------------
  // Render: Upcoming bookings
  // ---------------------------------------------------------------
  function renderBookings(bookings) {
    const list = document.getElementById("bookings-list");
    list.innerHTML = bookings.map((b) => `
      <li class="booking-item">
        <div class="booking-icon"><i class="ph-fill ph-calendar-blank"></i></div>
        <div class="booking-meta">
          <div class="booking-date">${b.date}</div>
          <div class="booking-route">${b.from} <i class="ph ph-arrow-right"></i> ${b.to}</div>
        </div>
        <span class="seats-pill">${b.seats} Seats</span>
        <div class="avatars-stack">
          ${Array.from({ length: b.avatars }).map(() => `<img src="Assets/avatar-placeholder.png" alt="">`).join("")}
          ${b.more ? `<span class="avatars-more">+${b.more}</span>` : ""}
        </div>
      </li>
    `).join("");
  }
  
  // ---------------------------------------------------------------
  // Render + interact: Recent ride requests (approve / decline)
  // ---------------------------------------------------------------
  function renderRequests(requests) {
    const list = document.getElementById("requests-list");
  
    list.innerHTML = requests.map((r) => `
      <li class="request-item" data-id="${r.id}">
        <img src="Assets/avatar-placeholder.png" alt="" class="request-avatar">
        <div class="booking-meta">
          <div class="request-name">${r.name}</div>
          <div class="request-route">${r.from} <i class="ph ph-arrow-right"></i> ${r.to}</div>
        </div>
        <div class="request-datetime">${r.date}</div>
        <span class="request-seats">${r.seats} Seats</span>
        <div class="request-actions">
          <button class="approve-btn" data-id="${r.id}" data-decision="approved">Approve</button>
          <button class="decline-btn" data-id="${r.id}" data-decision="declined">Decline</button>
        </div>
      </li>
    `).join("");
  
    list.querySelectorAll(".approve-btn, .decline-btn").forEach((btn) => {
      btn.addEventListener("click", () => handleRequestDecision(btn.dataset.id, btn.dataset.decision));
    });
  }
  
  function handleRequestDecision(id, decision) {
    // TODO: replace with the real approve/decline API call once that
    // endpoint is confirmed, e.g.:
    //   PATCH /api/v1/corporate/ride-requests/:id  { status: decision }
    const item = document.querySelector(`.request-item[data-id="${id}"]`);
    if (!item) return;
  
    const actions = item.querySelector(".request-actions");
    actions.innerHTML = `<span class="request-status-label ${decision}">
      ${decision === "approved" ? "Approved" : "Declined"}
    </span>`;
    item.classList.add("resolved");
  }
  
  // ---------------------------------------------------------------
  // Render: Quick actions
  // ---------------------------------------------------------------
  function renderQuickActions(actions) {
    const container = document.getElementById("quick-actions");
    container.innerHTML = actions.map((a) => `
      <button class="quick-action-btn" data-action="${a.title}">
        <span class="quick-action-icon"><i class="ph ${a.icon}"></i></span>
        <span>
          <span class="quick-action-title">${a.title}</span><br>
          <span class="quick-action-sub">${a.sub}</span>
        </span>
      </button>
    `).join("");
  
    container.querySelectorAll(".quick-action-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Placeholder — each of these should route to a real page/modal
        // once those flows exist (create ride form, invite modal, report export).
        alert(`"${btn.dataset.action}" is coming soon.`);
      });
    });
  }
  
  // ---------------------------------------------------------------
  // Render + interact: Monthly spend chart (hover for tooltip)
  // ---------------------------------------------------------------
  function renderChart(data) {
    const barsContainer = document.getElementById("chart-bars");
    const tooltip = document.getElementById("chart-tooltip");
    const maxValue = Math.max(...data.map((d) => d.value));
  
    barsContainer.innerHTML = data.map((d, i) => {
      const heightPct = Math.round((d.value / maxValue) * 100);
      return `
        <div class="chart-bar-col" data-index="${i}">
          <div class="chart-bar" style="height: ${heightPct}%"></div>
          <span class="chart-bar-label">${d.label}</span>
        </div>
      `;
    }).join("");
  
    const cols = barsContainer.querySelectorAll(".chart-bar-col");
    cols.forEach((col) => {
      col.addEventListener("mouseenter", () => {
        cols.forEach((c) => c.classList.remove("active"));
        col.classList.add("active");
        const d = data[col.dataset.index];
        tooltip.innerHTML = `${d.label}<strong>₦${d.value.toLocaleString()}</strong>`;
        tooltip.classList.add("visible");
      });
      col.addEventListener("mouseleave", () => {
        col.classList.remove("active");
        tooltip.classList.remove("visible");
      });
    });
  }
  
  // ---------------------------------------------------------------
  // Render: Wallet
  // ---------------------------------------------------------------
  function renderWallet(wallet) {
    document.getElementById("wallet-balance").textContent = wallet.balance;
  }
  
  // ---------------------------------------------------------------
  // Render: Top routes
  // ---------------------------------------------------------------
  function renderRoutes(routes) {
    const list = document.getElementById("routes-list");
    const maxTrips = Math.max(...routes.map((r) => r.trips));
  
    list.innerHTML = routes.map((r, i) => `
      <li class="route-item">
        <span class="route-rank">${i + 1}</span>
        <div class="route-meta">
          <div class="route-name">${r.from} <i class="ph ph-arrow-right"></i> ${r.to}</div>
          <div class="route-bar-track">
            <div class="route-bar-fill" style="width: ${(r.trips / maxTrips) * 100}%"></div>
          </div>
        </div>
        <span class="route-count">${r.trips}</span>
      </li>
    `).join("");
  }
  
  // ---------------------------------------------------------------
  // Sidebar nav — active state (no page routing yet, just visual state
  // plus a placeholder for wiring real navigation later)
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
  // Misc top-bar / panel controls
  // ---------------------------------------------------------------
  function setupMiscControls() {
    document.getElementById("top-up-btn").addEventListener("click", () => {
      alert("Top Up Wallet is coming soon.");
    });
  
    document.getElementById("contact-support-btn").addEventListener("click", () => {
      alert("Contact Support is coming soon.");
    });
  
    document.getElementById("logout-btn").addEventListener("click", () => {
      // TODO: call the real logout endpoint / clear the httpOnly session
      // cookie server-side once that flow exists, then redirect.
      window.location.href = "Login.html";
    });
  
    document.getElementById("view-all-requests").addEventListener("click", (e) => {
      e.preventDefault();
      alert("Full ride request list is coming soon.");
    });
  
    document.getElementById("date-range-btn").addEventListener("click", () => {
      alert("Date range picker is coming soon.");
    });
  }
  
  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  function renderDashboard(data) {
    renderStatCards(data.stats);
    renderBookings(data.bookings);
    renderRequests(data.requests);
    renderQuickActions(data.quickActions);
    renderChart(data.chart);
    renderWallet(data.wallet);
    renderRoutes(data.routes);
    setupSidebarNav();
    setupMiscControls();
  }
  
  renderDashboard(MOCK_DATA);