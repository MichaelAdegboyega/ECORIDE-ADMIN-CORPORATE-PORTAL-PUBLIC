// PassengerDetail.js
//
// ⚠️ No design reference for this page — built to mirror DriverDetail.js's
// structure but swaps documents/vehicle for ride history and payment
// history, since those fields don't apply to a passenger.
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/admin/passengers/:id endpoint.
// Reads ?name= from the URL (set by AdminUserDashboard.js row clicks).

function getPassengerNameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name") || "Yemi Soyinka";
  }
  
  function getPassengerData(name) {
    const seed = name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
    const statuses = ["pending", "flagged", "flagged-red"];
    const statusLabels = { pending: "Pending", flagged: "Verified", "flagged-red": "Suspended" };
    const status = statuses[seed % statuses.length];
    const paymentMethods = ["Card (Visa •••• 4821)", "Bank Transfer", "Wallet"];
    const drivers = ["Kelechi Obi", "Yemi Soyinka", "Tunde Fashola", "Ngozi Adeyemi"];
  
    return {
      name,
      id: `USR-${1100 + (seed % 900)}`,
      status,
      statusLabel: statusLabels[status],
      phone: `+234 8${String(10000000 + seed * 733).slice(0, 8)}`,
      email: `${name.split(" ")[0].toLowerCase()}.${name.split(" ")[1].toLowerCase()}@email.com`,
      joined: "2026-05-15",
      rides: 100 + (seed % 60),
      rating: (4.2 + (seed % 8) * 0.1).toFixed(1),
      paymentMethod: paymentMethods[seed % paymentMethods.length],
  
      rideHistory: [
        { rideId: `R${10091 + seed % 100}`, route: "Ikeja → VI", driver: drivers[seed % drivers.length], date: "July 22, 2026", fare: "₦4,200", status: "completed" },
        { rideId: `R${10092 + seed % 100}`, route: "Lekki Phase 1 → VI", driver: drivers[(seed + 1) % drivers.length], date: "July 21, 2026", fare: "₦3,150", status: "completed" },
        { rideId: `R${10093 + seed % 100}`, route: "Surulere → Ikeja", driver: drivers[(seed + 2) % drivers.length], date: "July 20, 2026", fare: "₦1,900", status: "cancelled" },
      ],
  
      payments: [
        { txnId: `TXN-${5000 + seed % 500}`, date: "July 22, 2026", method: paymentMethods[seed % paymentMethods.length], amount: "₦4,200", status: "confirmed" },
        { txnId: `TXN-${5001 + seed % 500}`, date: "July 21, 2026", method: paymentMethods[seed % paymentMethods.length], amount: "₦3,150", status: "confirmed" },
        { txnId: `TXN-${5002 + seed % 500}`, date: "July 20, 2026", method: paymentMethods[seed % paymentMethods.length], amount: "₦1,900", status: "denied" },
      ],
    };
  }
  
  // ---------------------------------------------------------------
  // Render profile
  // ---------------------------------------------------------------
  function renderProfile(passenger) {
    document.getElementById("passenger-name").textContent = passenger.name;
    document.getElementById("passenger-id").textContent = passenger.id;
  
    const statusEl = document.getElementById("passenger-status");
    statusEl.textContent = passenger.statusLabel;
    statusEl.className = `status ${passenger.status}`;
  
    document.getElementById("passenger-phone").textContent = passenger.phone;
    document.getElementById("passenger-email").textContent = passenger.email;
    document.getElementById("passenger-joined").textContent = passenger.joined;
    document.getElementById("passenger-rides").textContent = passenger.rides;
    document.getElementById("passenger-rating").textContent = `★ ${passenger.rating}`;
    document.getElementById("passenger-payment").textContent = passenger.paymentMethod;
  }
  
  // ---------------------------------------------------------------
  // Render ride history
  // ---------------------------------------------------------------
  function renderRideHistory(rides) {
    document.getElementById("passenger-rides-body").innerHTML = rides.map((r) => `
      <tr>
        <td>${r.rideId}</td>
        <td>${r.route}</td>
        <td>${r.driver}</td>
        <td>${r.date}</td>
        <td>${r.fare}</td>
        <td><span class="${r.status === "completed" ? "status-badge-confirmed" : "status-badge-denied"}">${r.status === "completed" ? "Completed" : "Cancelled"}</span></td>
      </tr>
    `).join("");
  }
  
  // ---------------------------------------------------------------
  // Render payment history
  // ---------------------------------------------------------------
  function renderPayments(payments) {
    const statusClass = { confirmed: "status-badge-confirmed", pending: "status-badge-pending", denied: "status-badge-denied" };
    const statusLabel = { confirmed: "Confirmed", pending: "Pending", denied: "Denied" };
  
    document.getElementById("passenger-payments-body").innerHTML = payments.map((p) => `
      <tr>
        <td>${p.txnId}</td>
        <td>${p.date}</td>
        <td>${p.method}</td>
        <td>${p.amount}</td>
        <td><span class="${statusClass[p.status]}">${statusLabel[p.status]}</span></td>
      </tr>
    `).join("");
  }
  
  // ---------------------------------------------------------------
  // Verify / Suspend actions
  // ---------------------------------------------------------------
  function setupProfileActions(passenger) {
    document.getElementById("verify-passenger-btn").addEventListener("click", () => {
      // TODO: replace with a real PATCH .../admin/passengers/:id/verify call.
      const statusEl = document.getElementById("passenger-status");
      statusEl.textContent = "Verified";
      statusEl.className = "status flagged";
      alert(`${passenger.name} verified (mock — no backend call made yet).`);
    });
  
    document.getElementById("suspend-passenger-btn").addEventListener("click", () => {
      if (!confirm(`Suspend ${passenger.name}?`)) return;
      // TODO: replace with a real PATCH .../admin/passengers/:id/suspend call.
      const statusEl = document.getElementById("passenger-status");
      statusEl.textContent = "Suspended";
      statusEl.className = "status flagged-red";
      alert(`${passenger.name} suspended (mock — no backend call made yet).`);
    });
  
    document.getElementById("add-passenger-note-btn").addEventListener("click", () => {
      alert("Add Note is coming soon.");
    });
  }
  
  // ---------------------------------------------------------------
  // Notification bell + profile dropdown (same shared pattern)
  // ---------------------------------------------------------------
  const MOCK_NOTIFICATIONS = [
    { icon: "ph-bell", title: "New driver verification submitted", time: "10 mins ago" },
    { icon: "ph-warning", title: "Payment dispute flagged", time: "1 hour ago" },
  ];
  
  function setupNotifications() {
    const bell = document.getElementById("notif-bell");
    const panel = document.getElementById("notif-panel");
    const dot = document.getElementById("notif-dot");
    const list = document.getElementById("notif-panel-list");
  
    list.innerHTML = MOCK_NOTIFICATIONS.map((n) => `
      <li class="notif-panel-item">
        <i class="ph-fill ${n.icon}"></i>
        <div><div class="notif-panel-item-title">${n.title}</div><div class="notif-panel-item-time">${n.time}</div></div>
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
  const currentPassenger = getPassengerData(getPassengerNameFromUrl());
  
  renderProfile(currentPassenger);
  renderRideHistory(currentPassenger.rideHistory);
  renderPayments(currentPassenger.payments);
  setupProfileActions(currentPassenger);
  setupNotifications();
  setupProfileDropdown();
  setupMiscControls();