// CreateBooking.js
//
// ⚠️ Steps 2 and 3 are not shown in the provided design screenshots —
// built as reasonable defaults (pick passengers up to the seat count
// from step 1; review summary before confirming) rather than guessing
// at something more elaborate with no reference to go on.
//
// ⚠️ MOCK DATA — the employee list in step 2 uses the same mock roster
// as Employees.js. No confirmed POST /api/v1/corporate/bookings endpoint
// either — handleConfirmBooking() below is a placeholder; wire it to a
// real request once that's confirmed.

const MOCK_EMPLOYEES = [
    "Sarah Johnson", "Michael Ade", "Linda Mo", "James Okafor",
    "Tolu Bamidele", "Esther Bright", "David Wilson", "Grace Eze",
  ];
  
  const state = {
    currentStep: 1,
    route: { pickup: "", dropoff: "", stops: [] },
    dateTime: { date: "", time: "", seats: 2 },
    selectedPassengers: [],
  };
  
  // ---------------------------------------------------------------
  // Step navigation
  // ---------------------------------------------------------------
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
  
  // ---------------------------------------------------------------
  // Step 1: Route & Time
  // ---------------------------------------------------------------
  function validateStep1() {
    const pickup = document.getElementById("pickup-location").value.trim();
    const dropoff = document.getElementById("dropoff-location").value.trim();
    const date = document.getElementById("booking-date").value;
  
    if (!pickup || !dropoff) {
      alert("Please enter both pick up and drop off locations.");
      return false;
    }
    if (!date) {
      alert("Please select a date.");
      return false;
    }
  
    state.route.pickup = pickup;
    state.route.dropoff = dropoff;
    state.dateTime.date = date;
    state.dateTime.time = document.getElementById("booking-time").value;
    state.dateTime.seats = parseInt(document.getElementById("seats-needed").value, 10) || 1;
  
    return true;
  }
  
  function setupAddStop() {
    document.getElementById("add-stop-btn").addEventListener("click", () => {
      const container = document.getElementById("extra-stops");
      const row = document.createElement("div");
      row.className = "extra-stop-row";
      row.innerHTML = `
        <input type="text" placeholder="Additional stop">
        <button class="remove-stop-btn" aria-label="Remove stop"><i class="ph ph-x"></i></button>
      `;
      row.querySelector(".remove-stop-btn").addEventListener("click", () => row.remove());
      container.appendChild(row);
    });
  }
  
  // ---------------------------------------------------------------
  // Step 2: Passenger Details
  // ---------------------------------------------------------------
  function renderPassengerPicker() {
    const seats = state.dateTime.seats;
    document.getElementById("seats-hint").textContent =
      `Select up to ${seats} passenger${seats === 1 ? "" : "s"} (matches seats requested in step 1).`;
  
    const picker = document.getElementById("passenger-picker");
    picker.innerHTML = MOCK_EMPLOYEES.map((name) => `
      <div class="passenger-option ${state.selectedPassengers.includes(name) ? "selected" : ""}" data-name="${name}">
        <img src="Assets/avatar-placeholder.png" alt="">
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
  
  // ---------------------------------------------------------------
  // Step 3: Review & Confirm
  // ---------------------------------------------------------------
  function renderReviewSummary() {
    const rows = [
      { label: "Pick up location", value: state.route.pickup },
      { label: "Drop off location", value: state.route.dropoff },
      { label: "Date", value: formatDate(state.dateTime.date) },
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
  
  function formatDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  
  function handleConfirmBooking() {
    // TODO: replace with a real POST /api/v1/corporate/bookings call once
    // that endpoint is confirmed. Payload would presumably be something
    // like { pickup, dropoff, stops, date, time, seats, passengers }.
    alert("Booking confirmed! (mock — no backend call made yet)");
    window.location.href = "Bookings.html";
  }
  
  // ---------------------------------------------------------------
  // Wizard button wiring
  // ---------------------------------------------------------------
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
  
  // ---------------------------------------------------------------
  // Sidebar nav + misc controls
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
  }
  
  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  setupAddStop();
  setupWizardNav();
  setupSidebarNav();
  setupMiscControls();