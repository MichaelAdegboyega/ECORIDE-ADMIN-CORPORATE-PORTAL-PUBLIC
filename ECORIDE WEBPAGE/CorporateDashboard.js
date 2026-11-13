const MOCK_DATA = {
  stats: [
    {
      icon: "ph-user",
      iconClass: "green",
      label: "Active Employees",
      value: "1,248",
      deltaHighlight: "12.6%",
      deltaText: "vs last 7 days",
    },
    {
      icon: "ph-car-profile",
      iconFill: true,
      iconClass: "blue",
      label: "Today's Trips",
      value: "356",
      deltaHighlight: "10.2%",
      deltaText: "vs last 7 days",
    },
    {
      icon: "ph-coins",
      iconFill: true,
      iconClass: "green",
      label: "Monthly Transport Spend",
      value: "N4,568,890",
      deltaHighlight: "4.3%",
      deltaText: "vs last month",
    },
    {
      icon: "ph-calendar-check",
      iconClass: "dark-green",
      label: "Pending Ride Requests",
      value: "18",
      deltaText: "View and approve requests",
      action: true,
    },
  ],

  bookings: [
    { date: "July 21, 2026.  8:00 AM", from: "Lekki Phase 1", to: "Victoria Island", seats: 12, more: 7 },
    { date: "July 21, 2026.  1:45 PM", from: "Ikeja", to: "Victoria Island", seats: 8, more: 3 },
    { date: "July 22, 2026.  8:45 AM", from: "Ikeja", to: "Lekki Phase 1", seats: 10, more: 6 },
    { date: "July 22, 2026.  9:00 PM", from: "Victoria Island", to: "Ikeja", seats: 6, more: 2 },
  ],

  requests: [
    { id: "r1", name: "Sarah Johnson", from: "Ikeja", to: "VI", date: "July 22, 2026.  8:45 AM", seats: 10, avatar: "Assets/Review.jpg" },
    { id: "r2", name: "Michael Ade", from: "Ikeja", to: "Surulere", date: "July 22, 2026.  7:15 AM", seats: 6, avatar: "Assets/Review.jpg" },
    { id: "r3", name: "Linda Chukwu", from: "Lekki", to: "VI", date: "July 22, 2026.  6:30 PM", seats: 4, avatar: "Assets/Review.jpg" },
  ],

  quickActions: [
    { icon: "ph-car", iconType: "ph", iconClass: "green", title: "Create Ride", sub: "Schedule a ride" },
    { icon: "ph-user", iconType: "ph-fill", iconClass: "green", title: "Invite Employee", sub: "Add team member" },
    { icon: "ph-file-text", iconType: "ph-fill", iconClass: "blue", title: "Download Report", sub: "Get insights" },
  ],

  chart: [
    { label: "Jan", value: 140000 },
    { label: "Feb", value: 400000 },
    { label: "Mar", value: 300000 },
    { label: "Apr", value: 370000 },
    { label: "May", value: 500000 },
  ],

  wallet: { balance: "₦ 2,335,600.00" },

  routes: [
    { from: "Lekki Phase 1", to: "Victoria Island", trips: 142 },
    { from: "Ikeja", to: "Victoria Island", trips: 98 },
    { from: "Surulere", to: "Lekki Phase", trips: 62 },
    { from: "Victoria Island", to: "Ikeja", trips: 54 },
    { from: "Yaba", to: "Victoria Island", trips: 42 },
  ],
};

const BOOKING_AVATARS = [
  "Assets/Driver.jpg",
  "Assets/Admin 2.jpg",
  "Assets/Review.jpg",
];

function renderStatCards(stats) {
  const container = document.getElementById("stat-cards");
  container.innerHTML = stats.map((stat) => {
    const iconPrefix = stat.iconFill ? "ph-fill" : "ph";
    const footerHtml = stat.action
      ? `<span class="stat-action" data-action="pending-requests">${stat.deltaText}</span>`
      : `<span class="stat-delta"><em>${stat.deltaHighlight}</em> ${stat.deltaText}</span>`;

    return `
      <div class="stat-card">
        <div class="stat-card-main">
          <span class="stat-icon ${stat.iconClass || "green"}">
            <i class="${iconPrefix} ${stat.icon}"></i>
          </span>
          <div class="stat-card-info">
            <span class="stat-label">${stat.label}</span>
            <div class="stat-value">${stat.value}</div>
          </div>
        </div>
        ${footerHtml}
      </div>
    `;
  }).join("");

  const pendingAction = container.querySelector('[data-action="pending-requests"]');
  if (pendingAction) {
    pendingAction.addEventListener("click", () => {
      document.getElementById("requests-list").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
}

function renderBookings(bookings) {
  const list = document.getElementById("bookings-list");
  list.innerHTML = bookings.map((b) => `
    <li class="booking-item">
      <div class="booking-icon"><i class="ph ph-calendar-plus"></i></div>
      <div class="booking-meta">
        <div class="booking-date">${b.date}</div>
        <div class="booking-route">${b.from} <i class="ph ph-arrow-right"></i> ${b.to}</div>
      </div>
      <span class="seats-pill">${b.seats} Seats</span>
      <div class="avatars-stack">
        ${BOOKING_AVATARS.map((src) => `<img src="${src}" alt="Passenger">`).join("")}
        ${b.more ? `<span class="avatars-more">+${b.more}</span>` : ""}
      </div>
    </li>
  `).join("");
}

function renderRequests(requests) {
  const list = document.getElementById("requests-list");

  list.innerHTML = requests.map((r) => `
    <li class="request-item" data-id="${r.id}">
      <img src="${r.avatar}" alt="${r.name}" class="request-avatar">
      <div class="request-meta">
        <div class="request-name">${r.name}</div>
        <div class="request-route">${r.from} <i class="ph ph-arrow-right"></i> ${r.to}</div>
      </div>
      <div class="request-datetime">
        <i class="ph ph-calendar-blank"></i>
        <span>${r.date}</span>
      </div>
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
  const item = document.querySelector(`.request-item[data-id="${id}"]`);
  if (!item) return;

  const actions = item.querySelector(".request-actions");
  actions.innerHTML = `<span class="request-status-label ${decision}">
    ${decision === "approved" ? "Approved" : "Declined"}
  </span>`;
  item.classList.add("resolved");
}

function renderQuickActions(actions) {
  const container = document.getElementById("quick-actions");
  container.innerHTML = actions.map((a) => `
    <button class="quick-action-btn" data-action="${a.title}">
      <span class="quick-action-icon ${a.iconClass || "green"}">
        <i class="${a.iconType} ${a.icon}"></i>
      </span>
      <span class="quick-action-text">
        <span class="quick-action-title">${a.title}</span>
        <span class="quick-action-sub">${a.sub}</span>
      </span>
      <i class="ph ph-caret-right quick-action-arrow"></i>
    </button>
  `).join("");

  container.querySelectorAll(".quick-action-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(`"${btn.dataset.action}" is coming soon.`);
    });
  });
}

function renderChart(data) {
  const barsContainer = document.getElementById("chart-bars");
  const tooltip = document.getElementById("chart-tooltip");
  const maxValue = 500000;

  barsContainer.innerHTML = data.map((d, i) => {
    const heightPct = Math.round((d.value / maxValue) * 100);
    return `
      <div class="chart-bar-col" data-index="${i}">
        <div class="chart-bar-wrap">
          <div class="chart-bar" style="height: ${heightPct}%"></div>
        </div>
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
      tooltip.innerHTML = `<span>${d.label}</span><strong>₦ ${d.value.toLocaleString()}</strong>`;
    });
    col.addEventListener("mouseleave", () => {
      col.classList.remove("active");
      tooltip.innerHTML = `<span>July</span><strong>₦ 4,568,890</strong>`;
    });
  });
}

function renderWallet(wallet) {
  document.getElementById("wallet-balance").textContent = wallet.balance;
}

function renderRoutes(routes) {
  const list = document.getElementById("routes-list");
  const maxTrips = Math.max(...routes.map((r) => r.trips));

  list.innerHTML = routes.map((r, i) => `
    <li class="route-item">
      <span class="route-rank">${i + 1}</span>
      <div class="route-meta">
        <div class="route-name">${r.from} <i class="ph ph-arrow-right"></i> ${r.to}</div>
        <div class="route-bar-track">
          <div class="route-bar-fill" style="width: ${(r.trips / maxTrips) * 90}%"></div>
        </div>
      </div>
      <span class="route-count">${r.trips}</span>
    </li>
  `).join("");
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

  document.getElementById("top-up-btn").addEventListener("click", () => {
    window.location.href = "Wallet.html";
  });

  document.getElementById("contact-support-btn").addEventListener("click", () => {
    alert("Contact Support is coming soon.");
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
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
