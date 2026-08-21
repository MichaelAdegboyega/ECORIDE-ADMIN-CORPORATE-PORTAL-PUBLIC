// AdminMainDashboard.js
//
// ⚠️ MOCK DATA — no confirmed admin API endpoints yet (this is the
// separate standalone admin portal, not the corporate one — same
// situation applies: nothing here has been verified against a real
// backend). Everything below reads from mock arrays; swap for real
// fetch() calls once those endpoints exist.

const MOCK_NOTIFICATIONS = [
    { icon: "ph-bell", title: "New driver verification submitted", time: "10 mins ago" },
    { icon: "ph-warning", title: "Payment dispute flagged", time: "1 hour ago" },
    { icon: "ph-user-plus", title: "42 new user signups today", time: "3 hours ago" },
  ];
  
  const MOCK_ACTIVITY_FEED = [
    {
      icon: "ph-bell", title: "Pending Review", sub: "Adaeze Okonkwo Nm verification",
      badge: "Passenger", status: "pending", statusLabel: "Pending",
      date: "May 21, 2024", time: "10:30 AM", admin: "Admin User",
      linkTo: "AdminVerificationPage.html",
    },
    {
      icon: "ph-car", title: "Weekend Ride Discount!", sub: "Enjoy up to 20% off on all Economy ride...",
      badge: "All Users", status: "sent", statusLabel: "Sent",
      date: "May 21, 2024", time: "10:30 AM", admin: "Admin User",
      linkTo: "AdminUserDashboard.html",
    },
    {
      icon: "ph-gift", title: "Weekend Ride Discount!", sub: "Enjoy up to 20% off on all Economy ride...",
      badge: "All Users", status: "scheduled", statusLabel: "Schedule",
      date: "May 21, 2024", time: "10:30 AM", admin: "Admin User",
      linkTo: "AdminUserDashboard.html",
    },
    {
      icon: "ph-wrench", title: "Weekend Ride Discount!", sub: "Enjoy up to 20% off on all Economy ride...",
      badge: "All Users", status: "sent", statusLabel: "Sent",
      date: "May 21, 2024", time: "10:30 AM", admin: "Admin User",
      linkTo: "AdminUserDashboard.html",
    },
    {
      icon: "ph-warning", title: "Failed Verification", sub: "Olatunji Kanu drivers license verification",
      badge: "Driver", status: "flagged", statusLabel: "Flagged",
      date: "May 21, 2024", time: "10:30 AM", admin: "Admin User",
      linkTo: "AdminVerificationPage.html",
    },
    {
      icon: "ph-wallet", title: "Weekend Ride Discount!", sub: "Enjoy up to 20% off on all Economy ride...",
      badge: "All Users", status: "sent", statusLabel: "Sent",
      date: "May 21, 2024", time: "10:30 AM", admin: "Admin User",
      linkTo: "AdminPaymentPage.html",
    },
  ];
  
  const MOCK_REVENUE = [
    { label: "Jan", value: 200000 },
    { label: "Feb", value: 375000 },
    { label: "Mar", value: 300000 },
    { label: "Apr", value: 400000 },
    { label: "May", value: 475000 },
  ];
  
  const MOCK_USER_BREAKDOWN = [
    { label: "Passengers", value: 129, color: "#f1c40f" },
    { label: "Drivers", value: 70, color: "#f39c12" },
    { label: "Corporate", value: 10, color: "#bdc3c7" },
  ];
  
  // ---------------------------------------------------------------
  // Notification bell + panel
  // ---------------------------------------------------------------
  function setupNotifications() {
    const bell = document.getElementById("notif-bell");
    const panel = document.getElementById("notif-panel");
    const dot = document.getElementById("notif-dot");
    const list = document.getElementById("notif-panel-list");
  
    list.innerHTML = MOCK_NOTIFICATIONS.map((n) => `
      <li class="notif-panel-item">
        <i class="ph-fill ${n.icon}"></i>
        <div>
          <div class="notif-panel-item-title">${n.title}</div>
          <div class="notif-panel-item-time">${n.time}</div>
        </div>
      </li>
    `).join("");
  
    if (MOCK_NOTIFICATIONS.length > 0) dot.classList.add("visible");
  
    bell.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("admin-dropdown").classList.remove("open");
      panel.classList.toggle("open");
    });
  
    document.getElementById("mark-all-read-btn").addEventListener("click", () => {
      dot.classList.remove("visible");
      panel.classList.remove("open");
    });
  
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !bell.contains(e.target)) {
        panel.classList.remove("open");
      }
    });
  }
  
  // ---------------------------------------------------------------
  // Admin profile dropdown
  // ---------------------------------------------------------------
  function setupProfileDropdown() {
    const toggle = document.getElementById("admin-profile-toggle");
    const dropdown = document.getElementById("admin-dropdown");
  
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("notif-panel").classList.remove("open");
      dropdown.classList.toggle("open");
    });
  
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
  }
  
  // ---------------------------------------------------------------
  // Activity feed table
  // ---------------------------------------------------------------
  function renderActivityFeed(items) {
    const tbody = document.getElementById("feed-table-body");
    tbody.innerHTML = items.map((item, i) => `
      <tr data-index="${i}">
        <td>
          <div class="feed-desc">
            <div><i class="ph-fill ${item.icon}"></i></div>
            <div><strong>${item.title}</strong><br><small>${item.sub}</small></div>
          </div>
        </td>
        <td><span class="badge purple-bg">${item.badge}</span></td>
        <td>
          <button class="feed-icon-btn" data-action="email" data-index="${i}" aria-label="Email"><i class="ph ph-envelope-simple"></i></button>
          <button class="feed-icon-btn" data-action="notify" data-index="${i}" aria-label="Notify"><i class="ph ph-bell"></i></button>
          <button class="feed-icon-btn" data-action="message" data-index="${i}" aria-label="Message"><i class="ph ph-chat-circle-dots"></i></button>
        </td>
        <td><span class="status-lbl ${item.status}">${item.statusLabel}</span></td>
        <td><small>${item.date}<br>${item.time}</small></td>
        <td>
          <div class="img"><img src="Assets/Driver.jpg">
          <strong class="name">${item.admin}</strong>
          </div>
        </td>
        <td><button class="feed-more-btn" data-index="${i}">•••</button></td>
      </tr>
    `).join("");
  
    tbody.querySelectorAll(".feed-icon-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = items[btn.dataset.index];
        const action = btn.dataset.action;
        // TODO: replace with real send-email / push-notification / message
        // API calls once those endpoints exist.
        alert(`${capitalize(action)} action for "${item.title}" is coming soon.`);
      });
    });
  
    tbody.querySelectorAll(".feed-more-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => openRowMenu(e.currentTarget, Number(btn.dataset.index)));
    });
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // ---------------------------------------------------------------
  // Row-action menu (View Details / Dismiss)
  // ---------------------------------------------------------------
  function setupRowMenu(items) {
    const menu = document.getElementById("feed-row-menu");
  
    menu.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(menu.dataset.index);
        const item = items[index];
        const action = btn.dataset.action;
        closeRowMenu();
  
        if (action === "view") {
          // Link to whichever existing admin page is actually relevant
          // to this feed item, rather than a generic placeholder.
          window.location.href = item.linkTo;
        } else if (action === "dismiss") {
          const row = document.querySelector(`#feed-table-body tr[data-index="${index}"]`);
          if (row) row.style.opacity = "0.4";
        }
      });
    });
  
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !e.target.closest(".feed-more-btn")) {
        closeRowMenu();
      }
    });
  }
  
  function openRowMenu(anchorEl, index) {
    const menu = document.getElementById("feed-row-menu");
    const rect = anchorEl.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
    menu.style.left = `${rect.left + window.scrollX - 110}px`;
    menu.classList.add("open");
    menu.dataset.index = index;
  }
  
  function closeRowMenu() {
    document.getElementById("feed-row-menu").classList.remove("open");
  }
  
  // ---------------------------------------------------------------
  // Revenue bar chart (built dynamically + hover tooltip)
  // ---------------------------------------------------------------
  function renderRevenueChart(data) {
    const container = document.getElementById("revenue-bar-chart");
    const tooltip = document.getElementById("bar-tooltip");
    const maxValue = 500000; // matches the fixed y-axis scale (500k/300k/100k/0)
  
    data.forEach((d) => {
      const col = document.createElement("div");
      col.className = "bar-container";
      const heightPct = Math.round((d.value / maxValue) * 100);
      col.innerHTML = `<div class="bar" style="height: ${heightPct}%"></div><span>${d.label}</span>`;
  
      col.addEventListener("mouseenter", () => {
        tooltip.textContent = `${d.label}: $${d.value.toLocaleString()}`;
        tooltip.classList.add("visible");
      });
      col.addEventListener("mouseleave", () => {
        tooltip.classList.remove("visible");
      });
  
      container.appendChild(col);
    });
  }
  
  // ---------------------------------------------------------------
  // Donut chart hover tooltip (chart itself stays CSS conic-gradient;
  // this just adds a hover readout since segments aren't individually
  // targetable in pure CSS)
  // ---------------------------------------------------------------
  function setupDonutTooltip(breakdown) {
    const donut = document.getElementById("donut-chart");
    const tooltip = document.getElementById("donut-tooltip");
    const total = breakdown.reduce((sum, b) => sum + b.value, 0);
  
    donut.addEventListener("mouseenter", () => {
      tooltip.innerHTML = breakdown.map((b) => `${b.label}: ${b.value} (${Math.round((b.value / total) * 100)}%)`).join("<br>");
      tooltip.classList.add("visible");
    });
    donut.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  }
  
  // ---------------------------------------------------------------
  // Misc controls
  // ---------------------------------------------------------------
  function setupMiscControls() {
    document.getElementById("contact-support-btn").addEventListener("click", () => {
      alert("Contact Support is coming soon.");
    });
  }
  
  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  setupNotifications();
  setupProfileDropdown();
  renderActivityFeed(MOCK_ACTIVITY_FEED);
  setupRowMenu(MOCK_ACTIVITY_FEED);
  renderRevenueChart(MOCK_REVENUE);
  setupDonutTooltip(MOCK_USER_BREAKDOWN);
  setupMiscControls();