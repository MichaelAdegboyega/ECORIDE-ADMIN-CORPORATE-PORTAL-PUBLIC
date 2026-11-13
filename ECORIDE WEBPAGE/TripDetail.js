function getTripIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "TRP-2024-0647";
}

function getTripById(id) {
  return {
    id: id || "TRP-2024-0647",
    status: "completed",
    route: { from: "Lekki Phase 1", to: "Victoria Island" },
    date: "May 21, 2026 . 8:00 AM",
    driver: {
      name: "Sarah Johnson",
      email: "sarahj@j.com",
      phone: "+234 812 345 7843",
      vehicle: "Toyota Camry . LND 123 AB",
    },
    seats: "3 Seats",
    amount: 1200,
    tripIdLabel: "TRP-2024-0647",
    paymentMethod: "Corporate Wallet",
    distance: "12.4km",
    duration: "24 mins",
    summary: {
      status: "completed",
      totalAmount: 1200,
      paidBy: "Corporate Wallet",
      bookedBy: "Sarah Johnson",
      passengerCount: 3,
      seatsBooked: "3 of 3",
      tripType: "Regular Commute",
      createdAt: "May 20, 2024 . 9:15 AM",
      completedAt: "May 20, 2024 . 8:24 AM",
    },
    passengers: [
      { name: "Sarah Johnson", email: "srahj@acme.com", phone: "+234 812 324 6789", boarding: "Lekki Phase 1", dropoff: "Victoria Island", amount: 1200 },
      { name: "Micheal Ade", email: "mic@acme.com", phone: "+234 812 324 6789", boarding: "Lekki Phase 1", dropoff: "Victoria Island", amount: 1200 },
      { name: "Linda Mo", email: "linda@acme.com", phone: "+234 812 324 6789", boarding: "Lekki Phase 1", dropoff: "Victoria Island", amount: 1200 },
    ],
    timeline: [
      { title: "Trip Created", time: "May 20, 2024 . 9:15 AM" },
      { title: "Driver assigned", time: "May 20, 2024 . 9:17 AM" },
      { title: "Passengers notified", time: "May 20, 2024 . 9:20 AM" },
      { title: "Trip started", time: "May 20, 2024 . 8:00 AM" },
      { title: "Trip completed", time: "May 21, 2024 . 8:24 AM" },
      { title: "Payment completed", time: "May 21, 2024 . 8:25 AM" },
    ],
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function currency(amount) {
  return `N${amount.toLocaleString()}`;
}

function renderTripInfo(trip) {
  const badge = document.getElementById("trip-status-badge");
  badge.textContent = capitalize(trip.status);
  badge.className = "trip-pill-badge";

  const rows = [
    { icon: "ph-git-branch", label: "Route", value: `<span class="info-row-value route">${trip.route.from} <i class="ph ph-arrow-right"></i> ${trip.route.to}</span>` },
    { icon: "ph-calendar-blank", label: "Date & Time", value: trip.date },
    { icon: "ph-user", label: "Driver", value: `<span class="driver-inline"><img src="Assets/Review.jpg" alt="${trip.driver.name}">${trip.driver.name}</span>` },
    { icon: "ph-car", label: "Vehicle", value: trip.driver.vehicle },
    { icon: "ph-armchair", label: "Seats", value: trip.seats },
    { icon: "ph-credit-card", label: "Amount", value: currency(trip.amount) },
    { icon: "ph-map-pin", label: "Trip ID", value: trip.tripIdLabel },
    { icon: "ph-wallet", label: "Payment Method", value: trip.paymentMethod },
  ];

  document.getElementById("trip-info-rows").innerHTML = rows.map((r) => `
    <li class="info-row">
      <span class="info-row-label"><span class="info-row-icon"><i class="ph ${r.icon}"></i></span>${r.label}</span>
      <span class="info-row-value">${r.value}</span>
    </li>
  `).join("");
}

function renderRouteDetails(trip) {
  document.getElementById("route-distance").textContent = trip.distance;
  document.getElementById("route-duration").textContent = trip.duration;
}

function renderTripSummary(trip) {
  const s = trip.summary;
  const rows = [
    { icon: "ph-git-branch", label: "Status", value: `<span class="trip-pill-badge">${capitalize(s.status)}</span>` },
    { icon: "ph-credit-card", label: "Total Amount", value: currency(s.totalAmount) },
    { icon: "ph-user", label: "Paid By", value: s.paidBy },
    { icon: "ph-user", label: "Booked By", value: `<span class="driver-inline"><img src="Assets/Review.jpg" alt="${s.bookedBy}">${s.bookedBy}</span>` },
    {
      icon: "ph-users",
      label: "Passengers",
      value: `<span class="passengers-inline">${Array.from({ length: s.passengerCount }).map(() => `<img src="Assets/Review.jpg" alt="Passenger">`).join("")}<span class="passengers-more">+0</span></span>`,
    },
    { icon: "ph-armchair", label: "Seats Booked", value: s.seatsBooked },
    { icon: "ph-map-pin", label: "Trip Type", value: s.tripType },
    { icon: "ph-clock", label: "Created At", value: s.createdAt },
    { icon: "ph-clock", label: "Completed At", value: s.completedAt },
  ];

  document.getElementById("trip-summary-rows").innerHTML = rows.map((r) => `
    <li class="info-row">
      <span class="info-row-label"><span class="info-row-icon"><i class="ph ${r.icon}"></i></span>${r.label}</span>
      <span class="info-row-value">${r.value}</span>
    </li>
  `).join("");
}

function renderPassengers(trip) {
  const tbody = document.getElementById("passenger-table-body");
  tbody.innerHTML = trip.passengers.map((p) => `
    <tr>
      <td>
        <span class="passenger-name-cell">
          <img src="Assets/Review.jpg" alt="${p.name}">
          <span>${p.name}</span>
        </span>
      </td>
      <td>${p.email}</td>
      <td>${p.phone}</td>
      <td>${p.boarding}</td>
      <td>${p.dropoff}</td>
      <td>${currency(p.amount)}</td>
    </tr>
  `).join("");

  const total = trip.passengers.reduce((sum, p) => sum + p.amount, 0);
  document.getElementById("total-paid").textContent = currency(total);
}

function renderDriverInfo(trip) {
  document.getElementById("driver-info").innerHTML = `
    <img src="Assets/Review.jpg" alt="${trip.driver.name}">
    <div>
      <div class="driver-name">${trip.driver.name}</div>
      <div class="driver-meta">${trip.driver.email} | ${trip.driver.phone}</div>
      <div class="driver-meta">${trip.driver.vehicle}</div>
    </div>
  `;
}

function renderTimeline(timeline) {
  document.getElementById("timeline-list").innerHTML = timeline.map((t) => `
    <li class="timeline-item">
      <div class="timeline-title">${t.title}</div>
      <div class="timeline-time">${t.time}</div>
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

  ["more-actions-dropdown", "print-export-dropdown"].forEach((id) => {
    document.getElementById(id).querySelector("button").addEventListener("click", () => {
      alert("This menu is coming soon.");
    });
  });
}

const currentTrip = getTripById(getTripIdFromUrl());

renderTripInfo(currentTrip);
renderRouteDetails(currentTrip);
renderTripSummary(currentTrip);
renderPassengers(currentTrip);
renderDriverInfo(currentTrip);
renderTimeline(currentTrip.timeline);
setupSidebarNav();
setupMiscControls();
