// TripDetail.js
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/corporate/trips/:id endpoint
// yet. Reads ?id=TRP-2026-XXXX from the URL (set by Trips.js) and
// generates matching mock data deterministically from that id, same
// pattern as EmployeeDetail.js. Once a real endpoint exists, replace
// getTripById() with a fetch() call — render functions stay the same.

const EMPLOYEES = ["Sarah Johnson", "Michael Ade", "Linda Mo", "James Okafor", "Tolu Bamidele", "Esther Bright", "David Wilson"];
const STATUSES = ["completed", "completed", "completed", "completed", "completed", "cancelled", "upcoming", "ongoing"];
const AMOUNTS = [1200, 1200, 1200, 2000, 3200, 0, 1600, 2750];

function getTripIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "TRP-2024-0647"; // fallback matching the design's original example
}

function getTripById(id) {
  const match = id.match(/(\d+)$/);
  const i = match ? Math.max(0, parseInt(match[1], 10) - 1) : 0;

  const status = STATUSES[i % STATUSES.length];
  const employee = EMPLOYEES[i % EMPLOYEES.length];
  const amount = status === "cancelled" ? 0 : AMOUNTS[i % AMOUNTS.length];
  const passengerCount = 3;

  return {
    id,
    status,
    route: { from: "Lekki Phase 1", to: "Victoria Island" },
    date: "May 21, 2026, 8:00 AM",
    driver: { name: employee, phone: "+234 812 345 7843", vehicle: "Toyota Camry . LND 123 AB", email: `${employee.split(" ")[0].toLowerCase()}j@acme.com` },
    seats: `${passengerCount} Seats`,
    amount,
    tripIdLabel: id,
    paymentMethod: "Corporate Wallet",
    distance: "12.4km",
    duration: "24 mins",

    summary: {
      status,
      totalAmount: amount,
      paidBy: "Corporate Wallet",
      bookedBy: employee,
      passengerCount,
      seatsBooked: `${passengerCount} of ${passengerCount}`,
      tripType: "Regular Commute",
      createdAt: "May 20, 2026, 9:15 AM",
      completedAt: status === "completed" ? "May 21, 2026, 8:24 AM" : "—",
    },

    passengers: [
      { name: "Sarah Johnson", email: "srahj@acme.com", phone: "+234 812 324 6789", boarding: "Lekki Phase 1", dropoff: "Victoria Island", amount: 1200 },
      { name: "Micheal Ade", email: "mic@acme.com", phone: "+234 812 324 6789", boarding: "Lekki Phase 1", dropoff: "Victoria Island", amount: 1200 },
      { name: "Linda Mo", email: "linda@acme.com", phone: "+234 812 324 6789", boarding: "Lekki Phase 1", dropoff: "Victoria Island", amount: 1200 },
    ],

    timeline: [
      { title: "Trip Created", time: "May 20, 2026, 9:15 AM" },
      { title: "Driver assigned", time: "May 20, 2026, 9:17 AM" },
      { title: "Passengers notified", time: "May 20, 2026, 9:20 AM" },
      { title: "Trip started", time: "May 20, 2026, 8:00 AM" },
      { title: "Trip completed", time: "May 21, 2026, 8:24 AM" },
      { title: "Payment completed", time: "May 21, 2026, 8:25 AM" },
    ],
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function currency(amount) {
  return `₦${amount.toLocaleString()}`;
}

// ---------------------------------------------------------------
// Render: Trip Information panel
// ---------------------------------------------------------------
function renderTripInfo(trip) {
  const badge = document.getElementById("trip-status-badge");
  badge.textContent = capitalize(trip.status);
  badge.className = `status-badge ${trip.status}`;

  const rows = [
    { icon: "ph-map-pin", label: "Route", value: `<span class="info-row-value route">${trip.route.from} <i class="ph ph-arrow-right"></i> ${trip.route.to}</span>` },
    { icon: "ph-calendar-blank", label: "Date & Time", value: trip.date },
    { icon: "ph-user", label: "Driver", value: `<span class="driver-inline"><img src="Assets/avatar-placeholder.png" alt="">${trip.driver.name}</span>` },
    { icon: "ph-car", label: "Vehicle", value: trip.driver.vehicle },
    { icon: "ph-users", label: "Seats", value: trip.seats },
    { icon: "ph-coins", label: "Amount", value: currency(trip.amount) },
    { icon: "ph-hash", label: "Trip ID", value: trip.tripIdLabel },
    { icon: "ph-credit-card", label: "Payment Method", value: trip.paymentMethod },
  ];

  document.getElementById("trip-info-rows").innerHTML = rows.map((r) => `
    <li class="info-row">
      <span class="info-row-label"><span class="info-row-icon"><i class="ph ${r.icon}"></i></span>${r.label}</span>
      <span class="info-row-value">${r.value}</span>
    </li>
  `).join("");
}

// ---------------------------------------------------------------
// Render: Route Details panel
// ---------------------------------------------------------------
function renderRouteDetails(trip) {
  document.getElementById("route-distance").textContent = trip.distance;
  document.getElementById("route-duration").textContent = trip.duration;
}

// ---------------------------------------------------------------
// Render: Trip Summary panel
// ---------------------------------------------------------------
function renderTripSummary(trip) {
  const s = trip.summary;
  const rows = [
    { icon: "ph-check-circle", label: "Status", value: `<span class="status-badge ${s.status}">${capitalize(s.status)}</span>` },
    { icon: "ph-coins", label: "Total Amount", value: currency(s.totalAmount) },
    { icon: "ph-wallet", label: "Paid By", value: s.paidBy },
    { icon: "ph-user", label: "Booked By", value: s.bookedBy },
    { icon: "ph-users", label: "Passengers", value: `<span class="passengers-inline">${Array.from({length: s.passengerCount}).map(() => `<img src="Assets/avatar-placeholder.png" alt="">`).join("")}</span>` },
    { icon: "ph-seat", label: "Seats Booked", value: s.seatsBooked },
    { icon: "ph-tag", label: "Trip Type", value: s.tripType },
    { icon: "ph-clock", label: "Created At", value: s.createdAt },
    { icon: "ph-check", label: "Completed At", value: s.completedAt },
  ];

  document.getElementById("trip-summary-rows").innerHTML = rows.map((r) => `
    <li class="info-row">
      <span class="info-row-label"><span class="info-row-icon"><i class="ph ${r.icon}"></i></span>${r.label}</span>
      <span class="info-row-value">${r.value}</span>
    </li>
  `).join("");
}

// ---------------------------------------------------------------
// Render: Passenger list
// ---------------------------------------------------------------
function renderPassengers(trip) {
  const tbody = document.getElementById("passenger-table-body");
  tbody.innerHTML = trip.passengers.map((p) => `
    <tr>
      <td>${p.name}</td>
      <td class="emp-email">${p.email}</td>
      <td>${p.phone}</td>
      <td>${p.boarding}</td>
      <td>${p.dropoff}</td>
      <td>${currency(p.amount)}</td>
    </tr>
  `).join("");

  const total = trip.passengers.reduce((sum, p) => sum + p.amount, 0);
  document.getElementById("total-paid").textContent = currency(total);
}

// ---------------------------------------------------------------
// Render: Driver info
// ---------------------------------------------------------------
function renderDriverInfo(trip) {
  document.getElementById("driver-info").innerHTML = `
    <img src="Assets/avatar-placeholder.png" alt="">
    <div>
      <div class="driver-name">${trip.driver.name}</div>
      <div class="driver-meta">${trip.driver.email} | ${trip.driver.phone}</div>
      <div class="driver-meta">${trip.driver.vehicle}</div>
    </div>
  `;
}

// ---------------------------------------------------------------
// Render: Timeline
// ---------------------------------------------------------------
function renderTimeline(timeline) {
  document.getElementById("timeline-list").innerHTML = timeline.map((t) => `
    <li class="timeline-item">
      <div class="timeline-title">${t.title}</div>
      <div class="timeline-time">${t.time}</div>
    </li>
  `).join("");
}

// ---------------------------------------------------------------
// Misc controls
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
  document.getElementById("add-note-btn").addEventListener("click", () => {
    alert("Add Note is coming soon.");
  });
  document.getElementById("report-issue-btn").addEventListener("click", () => {
    alert("Report Issue is coming soon.");
  });

  // Simple dropdown toggles for More Actions / Print-Export — no real
  // menu items defined yet since neither flow exists on the backend.
  ["more-actions-dropdown", "print-export-dropdown"].forEach((id) => {
    document.getElementById(id).querySelector("button").addEventListener("click", () => {
      alert("This menu is coming soon.");
    });
  });
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
const currentTrip = getTripById(getTripIdFromUrl());

renderTripInfo(currentTrip);
renderRouteDetails(currentTrip);
renderTripSummary(currentTrip);
renderPassengers(currentTrip);
renderDriverInfo(currentTrip);
renderTimeline(currentTrip.timeline);
setupSidebarNav();
setupMiscControls();