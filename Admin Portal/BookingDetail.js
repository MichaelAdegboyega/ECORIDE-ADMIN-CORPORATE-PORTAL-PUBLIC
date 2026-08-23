// BookingDetail.js
//
// ⚠️ No design reference for this page — built to match DriverDetail.js's
// structure and reuse AdminBookingDashboard.css's status badge classes.
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/admin/bookings/:id endpoint.
// Reads ?id= from the URL (set by AdminBookingDashboard.js row clicks)
// and regenerates data using the same seed logic as the Bookings table,
// so a given ride ID shows consistent info whichever page you came from.

const DRIVERS = ["Kelechi Obi", "Yemi Soyinka", "Tunde Fashola", "Ngozi Adeyemi"];
const PASSENGERS = ["Chioma Dike", "Adaeze Okonkwo", "Seun Adeyemi", "Emeka Nwosu", "Halima Sani"];
const ROUTES = [
  { from: "Lekki Phase 1", to: "V.I. (Eko Hotel)", distance: "12.4 km", duration: "34 min" },
  { from: "Ajah", to: "Marina", distance: "22.1 km", duration: "62 min" },
  { from: "Surulere", to: "Ikeja GRA", distance: "8.7 km", duration: "25 min" },
  { from: "Ikoyi", to: "Oniru", distance: "5.2 km", duration: "18 min" },
  { from: "Oshodi", to: "Apapa", distance: "9.8 km", duration: "41 min" },
];
const STATUSES = ["completed", "completed", "completed", "active", "cancelled"];
const FARES = [2800, 4200, 1900, 1400, 2110];

function getRideIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "R10091";
}

function getBookingData(rideId) {
  const match = rideId.match(/(\d+)$/);
  const i = match ? Math.max(0, parseInt(match[1], 10) - 10091) : 0;

  const route = ROUTES[i % ROUTES.length];
  const status = STATUSES[i % STATUSES.length];
  const fare = FARES[i % FARES.length];
  const baseFare = Math.round(fare * 0.6);
  const distanceFare = fare - baseFare - 200;
  const bookingFee = 200;

  return {
    rideId,
    status,
    driver: DRIVERS[i % DRIVERS.length],
    passenger: PASSENGERS[i % PASSENGERS.length],
    route,
    fare,
    fareBreakdown: [
      { label: "Base fare", amount: baseFare },
      { label: "Distance/time", amount: distanceFare },
      { label: "Booking fee", amount: bookingFee },
    ],
    paymentMethod: i % 2 === 0 ? "Card" : "Wallet",
    date: "July 22, 2026, 8:45 AM",

    timeline: [
      { title: "Booking created", time: "July 22, 2026, 8:40 AM" },
      { title: "Driver assigned", time: "July 22, 2026, 8:42 AM" },
      { title: "Trip started", time: "July 22, 2026, 8:45 AM" },
      { title: status === "cancelled" ? "Trip cancelled" : status === "active" ? "Trip in progress" : "Trip completed", time: `July 22, 2026, ${9 + (i % 2)}:${["05","20"][i % 2]} AM` },
    ],
  };
}

const statusClass = { completed: "status-badge-completed", active: "status-badge-active", cancelled: "status-badge-cancelled" };
const statusLabel = { completed: "Completed", active: "Active", cancelled: "Cancelled" };

// ---------------------------------------------------------------
// Render
// ---------------------------------------------------------------
function renderHeader(booking) {
  document.getElementById("booking-ride-id").textContent = `Ride ${booking.rideId}`;
  const badge = document.getElementById("booking-status-badge");
  badge.textContent = statusLabel[booking.status];
  badge.className = statusClass[booking.status];
}

function renderTripInfo(booking) {
  const rows = [
    { label: "Route", value: `${booking.route.from} → ${booking.route.to}` },
    { label: "Date & Time", value: booking.date },
    { label: "Distance", value: booking.route.distance },
    { label: "Duration", value: booking.route.duration },
    { label: "Payment Method", value: booking.paymentMethod },
  ];
  document.getElementById("booking-info-rows").innerHTML = rows.map((r) => `
    <li class="info-row"><span>${r.label}</span><strong>${r.value}</strong></li>
  `).join("");
}

function renderFareBreakdown(booking) {
  document.getElementById("fare-breakdown-rows").innerHTML = booking.fareBreakdown.map((f) => `
    <li class="info-row"><span>${f.label}</span><strong>₦${f.amount.toLocaleString()}</strong></li>
  `).join("");
  document.getElementById("booking-total-fare").textContent = `₦${booking.fare.toLocaleString()}`;
}

function renderDriverRow(booking) {
  document.getElementById("booking-driver-row").innerHTML = `
    <img src="Assets/Driver.jpg" alt="">
    <div>
      <div class="person-name">${booking.driver}</div>
      <div class="person-meta">Driver</div>
    </div>
    <a class="view-link" href="DriverDetail.html?name=${encodeURIComponent(booking.driver)}">View Profile</a>
  `;
}

function renderPassengerRow(booking) {
  document.getElementById("booking-passenger-row").innerHTML = `
    <img src="Assets/Driver.jpg" alt="">
    <div>
      <div class="person-name">${booking.passenger}</div>
      <div class="person-meta">Passenger</div>
    </div>
    <a class="view-link" href="PassengerDetail.html?name=${encodeURIComponent(booking.passenger)}">View Profile</a>
  `;
}

function renderTimeline(timeline) {
  document.getElementById("booking-timeline-list").innerHTML = timeline.map((t) => `
    <li class="timeline-item">
      <div class="timeline-title">${t.title}</div>
      <div class="timeline-time">${t.time}</div>
    </li>
  `).join("");
}

// ---------------------------------------------------------------
// Misc actions
// ---------------------------------------------------------------
function setupMiscControls(booking) {
  document.getElementById("flag-booking-btn").addEventListener("click", () => {
    // TODO: replace with a real PATCH .../admin/bookings/:id/flag call.
    alert(`Booking ${booking.rideId} flagged for review (mock — no backend call made yet).`);
  });
  document.getElementById("contact-support-btn").addEventListener("click", () => {
    alert("Contact Support is coming soon.");
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

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
const currentBooking = getBookingData(getRideIdFromUrl());

renderHeader(currentBooking);
renderTripInfo(currentBooking);
renderFareBreakdown(currentBooking);
renderDriverRow(currentBooking);
renderPassengerRow(currentBooking);
renderTimeline(currentBooking.timeline);
setupMiscControls(currentBooking);
setupNotifications();
setupProfileDropdown();