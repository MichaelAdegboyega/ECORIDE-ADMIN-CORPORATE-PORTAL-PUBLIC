// DriverDetail.js
//
// ⚠️ No design reference for this page — built from fields already
// present in AdminUserDashboard.html (contact, rides, rating, status)
// and AdminVerificationPage.html (documents, license, expiry).
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/admin/drivers/:id endpoint.
// Reads ?name= from the URL (set by Verification/Users row clicks) and
// generates matching mock data deterministically, same pattern as
// EmployeeDetail.js / TripDetail.js in the corporate portal.

function getDriverNameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name") || "Kelechi Obi";
  }
  
  function getDriverData(name) {
    const seed = name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
    const statuses = ["pending", "flagged", "flagged-red"];
    const statusLabels = { pending: "Pending", flagged: "Verified", "flagged-red": "Suspended" };
    const status = statuses[seed % statuses.length];
  
    return {
      name,
      id: `USR-${1000 + (seed % 900)}`,
      status,
      statusLabel: statusLabels[status],
      phone: `+234 8${String(10000000 + seed * 733).slice(0, 8)}`,
      email: `${name.split(" ")[0].toLowerCase()}.${name.split(" ")[1].toLowerCase()}@email.com`,
      joined: "2026-05-15",
      rides: 100 + (seed % 60),
      rating: (4.2 + (seed % 8) * 0.1).toFixed(1),
      vehicle: `Toyota Camry . LND ${100 + (seed % 900)} AB`,
  
      documents: [
        { document: "Driver's license", submitted: "May 21, 2026", expiry: "14/4/2030", licenseId: `DL-${2000 + seed % 500}-${name.split(" ").map(w => w[0]).join("")}`, status },
        { document: "National ID", submitted: "May 21, 2026", expiry: "—", licenseId: `NID-${3000 + seed % 500}`, status: "confirmed" },
        { document: "Vehicle Insurance", submitted: "May 22, 2026", expiry: "25/9/2029", licenseId: `INS-${4000 + seed % 500}`, status: "confirmed" },
      ],
  
      trips: [
        { rideId: `R${10091 + seed % 100}`, route: "Ikeja → VI", date: "July 22, 2026", fare: "₦4,200", status: "completed" },
        { rideId: `R${10092 + seed % 100}`, route: "Lekki Phase 1 → VI", date: "July 21, 2026", fare: "₦3,150", status: "completed" },
        { rideId: `R${10093 + seed % 100}`, route: "Surulere → Ikeja", date: "July 20, 2026", fare: "₦1,900", status: "cancelled" },
      ],
    };
  }
  
  // ---------------------------------------------------------------
  // Render profile
  // ---------------------------------------------------------------
  function renderProfile(driver) {
    document.getElementById("driver-name").textContent = driver.name;
    document.getElementById("driver-id").textContent = driver.id;
  
    const statusEl = document.getElementById("driver-status");
    statusEl.textContent = driver.statusLabel;
    statusEl.className = `status ${driver.status}`;
  
    document.getElementById("driver-phone").textContent = driver.phone;
    document.getElementById("driver-email").textContent = driver.email;
    document.getElementById("driver-joined").textContent = driver.joined;
    document.getElementById("driver-rides").textContent = driver.rides;
    document.getElementById("driver-rating").textContent = `★ ${driver.rating}`;
    document.getElementById("driver-vehicle").textContent = driver.vehicle;
  }
  
  // ---------------------------------------------------------------
  // Render documents table
  // ---------------------------------------------------------------
  function renderDocuments(documents) {
    const statusClass = { pending: "status-badge-pending", confirmed: "status-badge-confirmed", denied: "status-badge-denied", flagged: "status-badge-confirmed", "flagged-red": "status-badge-denied" };
    const statusLabel = { pending: "Pending", confirmed: "Confirmed", denied: "Denied", flagged: "Confirmed", "flagged-red": "Denied" };
  
    document.getElementById("driver-documents-body").innerHTML = documents.map((d) => `
      <tr>
        <td>${d.document}</td>
        <td>${d.submitted}</td>
        <td>${d.expiry}</td>
        <td>${d.licenseId}</td>
        <td><span class="${statusClass[d.status]}">${statusLabel[d.status]}</span></td>
      </tr>
    `).join("");
  }
  
  // ---------------------------------------------------------------
  // Render trips table
  // ---------------------------------------------------------------
  function renderTrips(trips) {
    document.getElementById("driver-trips-body").innerHTML = trips.map((t) => `
      <tr>
        <td>${t.rideId}</td>
        <td>${t.route}</td>
        <td>${t.date}</td>
        <td>${t.fare}</td>
        <td><span class="${t.status === "completed" ? "status-badge-confirmed" : "status-badge-denied"}">${t.status === "completed" ? "Completed" : "Cancelled"}</span></td>
      </tr>
    `).join("");
  }
  
  // ---------------------------------------------------------------
  // Approve / Suspend actions
  // ---------------------------------------------------------------
  function setupProfileActions(driver) {
    document.getElementById("approve-driver-btn").addEventListener("click", () => {
      // TODO: replace with a real PATCH .../admin/drivers/:id/verify call.
      const statusEl = document.getElementById("driver-status");
      statusEl.textContent = "Verified";
      statusEl.className = "status flagged";
      alert(`${driver.name} approved (mock — no backend call made yet).`);
    });
  
    document.getElementById("suspend-driver-btn").addEventListener("click", () => {
      if (!confirm(`Suspend ${driver.name}?`)) return;
      // TODO: replace with a real PATCH .../admin/drivers/:id/suspend call.
      const statusEl = document.getElementById("driver-status");
      statusEl.textContent = "Suspended";
      statusEl.className = "status flagged-red";
      alert(`${driver.name} suspended (mock — no backend call made yet).`);
    });
  
    document.getElementById("add-driver-note-btn").addEventListener("click", () => {
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
  const currentDriver = getDriverData(getDriverNameFromUrl());
  
  renderProfile(currentDriver);
  renderDocuments(currentDriver.documents);
  renderTrips(currentDriver.trips);
  setupProfileActions(currentDriver);
  setupNotifications();
  setupProfileDropdown();
  setupMiscControls();