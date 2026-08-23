// AdminProfilePage.js
//
// ⚠️ No design reference for 7 of the 8 tabs (only "General" was
// provided) — those render a clear placeholder rather than a fabricated
// layout. Only the General tab's cards, status grid, quick settings,
// and danger zone are fully built.
//
// ⚠️ MOCK DATA / no confirmed endpoints for saving any of this
// (company info, localization, quick settings, password change, cache
// clear, etc). Every save/action below is a placeholder.

const SETTINGS_CARDS = [
    { icon: "ph-building-office", title: "Company Information", sub: "Manage your company name, address, and contact details." },
    { icon: "ph-globe", title: "Localization", sub: "Set your platform language, timezone, and regional preferences." },
    { icon: "ph-palette", title: "Appearance", sub: "Customize platform theme, colors and branding." },
    { icon: "ph-file", title: "Documents", sub: "Manage legal documents, terms of service and privacy policy." },
    { icon: "ph-envelope", title: "Email Settings", sub: "Configure email templates and sender preferences." },
    { icon: "ph-bell", title: "SMS settings", sub: "Configure SMS gateways and message templates." },
    { icon: "ph-cloud-arrow-down", title: "Storage Settings", sub: "Manage file storage, limits and upload preferences." },
    { icon: "ph-sliders", title: "System Preferences", sub: "Manage system behavior and administrative preferences." },
  ];
  
  const STATUS_CARDS = [
    { icon: "ph-shield-check", title: "Security", sub: "Manage admin access, roles, and security preferences", tab: "Security" },
    { icon: "ph-car", title: "Rides & Drivers", sub: "Manage ride types, pricing, cancellation and driver settings.", tab: "Rides & Drivers" },
    { icon: "ph-wallet", title: "Payment", sub: "Configure payment methods, commission and payouts.", tab: "Payment" },
    { icon: "ph-gear-six", title: "App Settings", sub: "Manage app content, features and version configurations.", tab: "App Settings" },
  ];
  
  const QUICK_SETTINGS = [
    { key: "timezone", icon: "ph-clock", label: "Timezone", value: "(GMT+1) West Africa Time" },
    { key: "language", icon: "ph-globe", label: "Language", value: "English (US)" },
    { key: "dateFormat", icon: "ph-calendar", label: "Date Format", value: "May 21, 2026" },
    { key: "timeFormat", icon: "ph-clock", label: "Time Format", value: "12 Hour (AM/PM)" },
    { key: "currency", icon: "ph-currency-ngn", label: "Currency", value: "NGN (₦)" },
  ];
  
  const MOCK_NOTIFICATIONS = [
    { icon: "ph-bell", title: "New driver verification submitted", time: "10 mins ago" },
    { icon: "ph-warning", title: "Payment dispute flagged", time: "1 hour ago" },
    { icon: "ph-user-plus", title: "42 new user signups today", time: "3 hours ago" },
  ];
  
  // ---------------------------------------------------------------
  // Render: Settings cards
  // ---------------------------------------------------------------
  function renderSettingsCards() {
    const container = document.getElementById("settings-cards");
    container.innerHTML = SETTINGS_CARDS.map((c) => `
      <div class="card" data-title="${c.title}">
        <div class="f-icon"><i class="ph-fill ${c.icon}"></i></div>
        <div class="details">
          <h3>${c.title}</h3>
          <p>${c.sub}</p>
        </div>
        <i class="ph ph-caret-right"></i>
      </div>
    `).join("");
  
    container.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => {
        // TODO: each of these opens its own dedicated settings screen
        // once those exist. Placeholder for now.
        alert(`${card.dataset.title} is coming soon.`);
      });
    });
  }
  
  // ---------------------------------------------------------------
  // Render: Status grid (Platform Modules) — clicking jumps to that tab
  // ---------------------------------------------------------------
  function renderStatusGrid() {
    const container = document.getElementById("status-grid");
    container.innerHTML = STATUS_CARDS.map((c) => `
      <div class="status-card" data-tab="${c.tab}">
        <div class="f-icon"><i class="ph-fill ${c.icon}"></i></div>
        <h3>${c.title}</h3>
        <p>${c.sub}</p>
        <span class="tag"><i class="ph-fill ph-check-circle"></i> Configured</span>
        <i class="ph ph-caret-right"></i>
      </div>
    `).join("");
  
    container.querySelectorAll(".status-card").forEach((card) => {
      card.addEventListener("click", () => switchTab(card.dataset.tab));
    });
  }
  
  // ---------------------------------------------------------------
  // Render: Quick Settings (each opens an edit modal)
  // ---------------------------------------------------------------
  function renderQuickSettings() {
    const container = document.getElementById("quick-settings-list");
    container.innerHTML = QUICK_SETTINGS.map((s) => `
      <div class="settings-item" data-key="${s.key}">
        <div class="item-left">
          <i class="ph ${s.icon}"></i>
          <span class="label">${s.label}</span>
        </div>
        <div class="item-right">
          <span class="value" id="quicksetting-value-${s.key}">${s.value}</span>
          <span><i class="ph ph-caret-right"></i></span>
        </div>
      </div>
    `).join("");
  
    container.querySelectorAll(".settings-item").forEach((item) => {
      item.addEventListener("click", () => openQuickSettingModal(item.dataset.key));
    });
  }
  
  function openQuickSettingModal(key) {
    const setting = QUICK_SETTINGS.find((s) => s.key === key);
    if (!setting) return;
  
    document.getElementById("quicksetting-modal-title").textContent = `Edit ${setting.label}`;
    document.getElementById("quicksetting-modal-label").textContent = setting.label;
    document.getElementById("quicksetting-input").value = setting.value;
    document.getElementById("quicksetting-modal-overlay").classList.add("open");
    document.getElementById("quicksetting-modal-overlay").dataset.key = key;
  }
  
  function setupQuickSettingModal() {
    const overlay = document.getElementById("quicksetting-modal-overlay");
    document.getElementById("quicksetting-modal-close").addEventListener("click", () => overlay.classList.remove("open"));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
  
    document.getElementById("quicksetting-save-btn").addEventListener("click", () => {
      const key = overlay.dataset.key;
      const newValue = document.getElementById("quicksetting-input").value.trim();
      if (!newValue) return;
  
      const setting = QUICK_SETTINGS.find((s) => s.key === key);
      if (setting) {
        setting.value = newValue;
        document.getElementById(`quicksetting-value-${key}`).textContent = newValue;
      }
      // TODO: replace with a real PATCH .../admin/settings call.
      overlay.classList.remove("open");
    });
  }
  
  // ---------------------------------------------------------------
  // Change Password modal
  // ---------------------------------------------------------------
  function setupPasswordModal() {
    const overlay = document.getElementById("password-modal-overlay");
    document.getElementById("change-password-btn").addEventListener("click", () => {
      document.getElementById("current-password").value = "";
      document.getElementById("new-password").value = "";
      document.getElementById("confirm-password").value = "";
      overlay.classList.add("open");
    });
    document.getElementById("password-modal-close").addEventListener("click", () => overlay.classList.remove("open"));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
  
    document.getElementById("password-save-btn").addEventListener("click", () => {
      const current = document.getElementById("current-password").value;
      const next = document.getElementById("new-password").value;
      const confirm = document.getElementById("confirm-password").value;
  
      if (!current || !next || !confirm) {
        alert("Please fill in all fields.");
        return;
      }
      if (next !== confirm) {
        alert("New password and confirmation don't match.");
        return;
      }
      if (next.length < 8) {
        alert("New password should be at least 8 characters.");
        return;
      }
      // TODO: replace with a real PATCH .../admin/change-password call.
      alert("Password updated (mock — no backend call made yet).");
      overlay.classList.remove("open");
    });
  }
  
  // ---------------------------------------------------------------
  // Danger Zone
  // ---------------------------------------------------------------
  function setupDangerZone() {
    document.getElementById("clear-cache-btn").addEventListener("click", () => {
      if (!confirm("Clear application cache and temporary files? This can't be undone.")) return;
      // TODO: replace with a real POST .../admin/clear-cache call.
      alert("Cache cleared (mock — no backend call made yet).");
    });
  
    document.getElementById("view-logs-btn").addEventListener("click", () => {
      // TODO: replace with a real download link once system logs are
      // actually exposed by the backend.
      alert("Downloading system logs is coming soon.");
    });
  }
  
  // ---------------------------------------------------------------
  // Tabs
  // ---------------------------------------------------------------
  function switchTab(tabName) {
    document.querySelectorAll("#settings-tabs span").forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === tabName);
    });
  
    const generalGrid = document.getElementById("tab-General");
    const otherGrid = document.getElementById("tab-other");
  
    if (tabName === "General") {
      generalGrid.style.display = "grid";
      otherGrid.style.display = "none";
    } else {
      generalGrid.style.display = "none";
      otherGrid.style.display = "grid";
      document.getElementById("placeholder-tab-label").textContent = `The "${tabName}" tab isn't built yet — no design reference was provided for it.`;
    }
  }
  
  function setupTabs() {
    document.querySelectorAll("#settings-tabs span").forEach((tab) => {
      tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });
  }
  
  // ---------------------------------------------------------------
  // Date range picker (header) — placeholder, no design reference for
  // what selecting a range should actually do here.
  // ---------------------------------------------------------------
  function setupDateRange() {
    document.getElementById("date-range-toggle").addEventListener("click", () => {
      alert("Date range picker is coming soon.");
    });
  }
  
  // ---------------------------------------------------------------
  // Notification bell + profile dropdown (same shared pattern as other
  // admin pages, adapted to this page's .bell/.user-badge markup)
  // ---------------------------------------------------------------
  function setupNotifications() {
    const bell = document.getElementById("notif-bell");
    const panel = document.getElementById("notif-panel");
    const countEl = document.getElementById("notif-count");
    const list = document.getElementById("notif-panel-list");
  
    list.innerHTML = MOCK_NOTIFICATIONS.map((n) => `
      <li class="notif-panel-item">
        <i class="ph-fill ${n.icon}"></i>
        <div><div class="notif-panel-item-title">${n.title}</div><div class="notif-panel-item-time">${n.time}</div></div>
      </li>
    `).join("");
  
    bell.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("admin-dropdown").classList.remove("open");
      panel.classList.toggle("open");
    });
    document.getElementById("mark-all-read-btn").addEventListener("click", () => {
      countEl.textContent = "0";
      countEl.style.display = "none";
      panel.classList.remove("open");
    });
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && !bell.contains(e.target)) panel.classList.remove("open");
    });
  }
  
  function setupProfileDropdown() {
    const toggle = document.getElementById("admin-profile-toggle");
    const dropdown = document.getElementById("admin-dropdown");
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("notif-panel").classList.remove("open");
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !toggle.contains(e.target)) dropdown.classList.remove("open");
    });
  }
  
  function setupMiscControls() {
    document.getElementById("contact-support-btn").addEventListener("click", () => {
      alert("Contact Support is coming soon.");
    });
  }
  
  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  renderSettingsCards();
  renderStatusGrid();
  renderQuickSettings();
  setupQuickSettingModal();
  setupPasswordModal();
  setupDangerZone();
  setupTabs();
  setupDateRange();
  setupNotifications();
  setupProfileDropdown();
  setupMiscControls();