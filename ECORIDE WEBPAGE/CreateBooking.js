const MOCK_EMPLOYEES = [
  "Sarah Johnson",
  "Michael Ade",
  "Linda Mo",
  "James Okafor",
  "Tolu Bamidele",
  "Esther Bright",
  "David Wilson",
  "Grace Eze",
];

const state = {
  currentStep: 1,
  route: { pickup: "Lekki Phase 1, Lagos", dropoff: "Victoria Island, Lagos", stops: [] },
  dateTime: { date: "May 24, 2024", time: "8:00AM", seats: 2 },
  selectedPassengers: ["Sarah Johnson", "Michael Ade"],
};

function goToStep(stepNum) {
  document.querySelectorAll(".wizard-step-content").forEach((el) => {
    el.style.display = "none";
  });
  document.getElementById(`step-${stepNum}`).style.display = "block";

  document.querySelectorAll(".wizard-step").forEach((el) => {
    const n = Number(el.dataset.step);
    el.classList.toggle("active", n === stepNum);
    el.classList.toggle("completed", n < stepNum);
  });

  document.querySelectorAll(".wizard-connector").forEach((el, i) => {
    el.classList.toggle("completed", i + 1 < stepNum);
  });

  state.currentStep = stepNum;

  if (stepNum === 2) renderPassengerPicker();
  if (stepNum === 3) renderReviewSummary();
}

function validateStep1() {
  const pickup = document.getElementById("pickup-location").value.trim();
  const dropoff = document.getElementById("dropoff-location").value.trim();
  const date = document.getElementById("booking-date").value.trim();

  if (!pickup || !dropoff) {
    alert("Please enter both pick up and drop off locations.");
    return false;
  }
  if (!date) {
    alert("Please enter a date.");
    return false;
  }

  state.route.pickup = pickup;
  state.route.dropoff = dropoff;
  state.dateTime.date = date;
  state.dateTime.time = document.getElementById("booking-time").value;
  state.dateTime.seats = parseInt(document.getElementById("seats-needed").value, 10) || 1;

  if (state.selectedPassengers.length > state.dateTime.seats) {
    state.selectedPassengers = state.selectedPassengers.slice(0, state.dateTime.seats);
  }

  return true;
}

function setupAddStop() {
  document.getElementById("add-stop-btn").addEventListener("click", () => {
    const container = document.getElementById("extra-stops");
    const row = document.createElement("div");
    row.className = "extra-stop-row";
    row.innerHTML = `
      <input type="text" placeholder="Additional stop">
      <button class="remove-stop-btn" type="button" aria-label="Remove stop"><i class="ph ph-x"></i></button>
    `;
    row.querySelector(".remove-stop-btn").addEventListener("click", () => row.remove());
    container.appendChild(row);
  });
}

function renderPassengerPicker() {
  const seats = state.dateTime.seats;
  document.getElementById("seats-hint").textContent =
    `Select up to ${seats} passenger${seats === 1 ? "" : "s"} (matches seats requested in step 1).`;

  const picker = document.getElementById("passenger-picker");
  picker.innerHTML = MOCK_EMPLOYEES.map((name) => `
    <div class="passenger-option ${state.selectedPassengers.includes(name) ? "selected" : ""}" data-name="${name}">
      <img src="Assets/Driver.jpg" alt="${name}">
      <span class="passenger-option-name">${name}</span>
      <span class="passenger-check"><i class="ph-fill ph-check"></i></span>
    </div>
  `).join("");

  picker.querySelectorAll(".passenger-option").forEach((el) => {
    el.addEventListener("click", () => togglePassenger(el.dataset.name));
  });
}

function togglePassenger(name) {
  const idx = state.selectedPassengers.indexOf(name);
  const seats = state.dateTime.seats;
  const hint = document.getElementById("seats-hint");

  if (idx > -1) {
    state.selectedPassengers.splice(idx, 1);
  } else {
    if (state.selectedPassengers.length >= seats) {
      hint.textContent = `You've selected the maximum of ${seats} passenger${seats === 1 ? "" : "s"} for this booking.`;
      hint.classList.add("over-limit");
      return;
    }
    state.selectedPassengers.push(name);
  }
  hint.classList.remove("over-limit");
  renderPassengerPicker();
}

function validateStep2() {
  if (state.selectedPassengers.length === 0) {
    alert("Please select at least one passenger.");
    return false;
  }
  return true;
}

function renderReviewSummary() {
  const rows = [
    { label: "Pick up location", value: state.route.pickup },
    { label: "Drop off location", value: state.route.dropoff },
    { label: "Date", value: state.dateTime.date },
    { label: "Time", value: state.dateTime.time },
    { label: "Seats Needed", value: `${state.dateTime.seats}` },
    { label: "Passengers", value: state.selectedPassengers.join(", ") },
  ];

  document.getElementById("review-summary").innerHTML = rows.map((r) => `
    <div class="review-row">
      <span class="review-label">${r.label}</span>
      <span class="review-value">${r.value || "—"}</span>
    </div>
  `).join("");
}

function handleConfirmBooking() {
  alert("Booking confirmed!");
  window.location.href = "Bookings.html";
}

function setupWizardNav() {
  document.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = Number(btn.dataset.next);
      if (state.currentStep === 1 && !validateStep1()) return;
      if (state.currentStep === 2 && !validateStep2()) return;
      goToStep(target);
    });
  });

  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => goToStep(Number(btn.dataset.back)));
  });

  document.getElementById("confirm-booking-btn").addEventListener("click", handleConfirmBooking);
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
}

setupAddStop();
setupWizardNav();
setupSidebarNav();
setupMiscControls();
