// Wallet.js
//
// ⚠️ No design screenshot for this page — built to match the rest of the
// portal (same panel/table/tab patterns) and reuses the wallet balance
// figure already shown on Overview for consistency.
//
// ⚠️ MOCK DATA — no confirmed GET /api/v1/corporate/wallet/transactions
// or POST .../top-up endpoint. Swap generateMockTransactions() and
// handleTopUpConfirm() for real API calls once those exist.

const PAGE_SIZE = 8;
const TOTAL_MOCK_COUNT = 32;

const TOPUP_DESCRIPTIONS = ["Wallet top-up via bank transfer", "Wallet top-up via card"];
const DEBIT_DESCRIPTIONS = ["Trip charge - Ikeja → VI", "Trip charge - Lekki Phase 1 → VI", "Trip charge - Surulere → Ikeja"];

function generateMockTransactions(count) {
  const txns = [];
  for (let i = 0; i < count; i++) {
    const isTopup = i % 4 === 0;
    txns.push({
      id: `TXN-2026-${String(1000 + i)}`,
      description: isTopup ? TOPUP_DESCRIPTIONS[i % TOPUP_DESCRIPTIONS.length] : DEBIT_DESCRIPTIONS[i % DEBIT_DESCRIPTIONS.length],
      date: `July ${((i % 28) + 1)}, 2026, ${7 + (i % 5)}:${["00","15","30","45"][i % 4]} AM`,
      type: isTopup ? "topup" : "debit",
      amount: isTopup ? 200000 + (i * 15000) % 300000 : 1200 + (i * 350) % 3000,
    });
  }
  return txns;
}

const state = {
  transactions: generateMockTransactions(TOTAL_MOCK_COUNT),
  filtered: [],
  currentPage: 1,
  activeTab: "all",
};

// ---------------------------------------------------------------
// Filtering + pagination
// ---------------------------------------------------------------
function applyFilters() {
  state.filtered = state.transactions.filter((t) => {
    if (state.activeTab === "all") return true;
    return t.type === state.activeTab;
  });
  state.currentPage = 1;
  renderTable();
}

function getPageItems() {
  const start = (state.currentPage - 1) * PAGE_SIZE;
  return state.filtered.slice(start, start + PAGE_SIZE);
}

// ---------------------------------------------------------------
// Render: transactions table
// ---------------------------------------------------------------
function renderTable() {
  const tbody = document.getElementById("transactions-table-body");
  const pageItems = getPageItems();

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="ph ph-wallet"></i><p>No transactions in this view.</p></div></td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map((t) => `
      <tr>
        <td>${t.id}</td>
        <td>${t.description}</td>
        <td>${t.date}</td>
        <td><span class="status-badge ${t.type}">${t.type === "topup" ? "Top-Up" : "Trip Charge"}</span></td>
        <td class="txn-amount ${t.type === "topup" ? "credit" : "debit"}">${t.type === "topup" ? "+" : "-"}₦${t.amount.toLocaleString()}</td>
      </tr>
    `).join("");
  }

  renderPagination();
}

// ---------------------------------------------------------------
// Render: pagination
// ---------------------------------------------------------------
function renderPagination() {
  const container = document.getElementById("transactions-pagination");
  const total = state.filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const shown = Math.min(PAGE_SIZE, total - (state.currentPage - 1) * PAGE_SIZE);

  const pageButtons = [];
  const maxVisible = 3;
  for (let p = 1; p <= Math.min(maxVisible, totalPages); p++) {
    pageButtons.push(p);
  }

  container.innerHTML = `
    <span>Showing ${Math.max(0, shown)} of ${total} transactions</span>
    <div class="pagination-controls">
      <button class="page-btn" id="prev-page" ${state.currentPage === 1 ? "disabled" : ""}><i class="ph ph-caret-left"></i></button>
      ${pageButtons.map((p) => `<button class="page-btn ${p === state.currentPage ? "active" : ""}" data-page="${p}">${p}</button>`).join("")}
      ${totalPages > maxVisible ? `<span>...</span><button class="page-btn" data-page="${totalPages}">${totalPages}</button>` : ""}
      <button class="page-btn" id="next-page" ${state.currentPage === totalPages ? "disabled" : ""}><i class="ph ph-caret-right"></i></button>
    </div>
  `;

  container.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.currentPage = Number(btn.dataset.page);
      renderTable();
    });
  });
  document.getElementById("prev-page").addEventListener("click", () => {
    if (state.currentPage > 1) { state.currentPage--; renderTable(); }
  });
  document.getElementById("next-page").addEventListener("click", () => {
    if (state.currentPage < totalPages) { state.currentPage++; renderTable(); }
  });
}

// ---------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------
function setupTabs() {
  const tabs = document.querySelectorAll("#wallet-tabs .emp-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.activeTab = tab.dataset.tab;
      applyFilters();
    });
  });
}

// ---------------------------------------------------------------
// Top Up modal
// ---------------------------------------------------------------
function setupTopUpModal() {
  const overlay = document.getElementById("topup-modal-overlay");
  const openBtn = document.getElementById("top-up-btn");
  const closeBtn = document.getElementById("topup-modal-close");
  const confirmBtn = document.getElementById("topup-confirm-btn");
  const amountInput = document.getElementById("topup-amount");

  openBtn.addEventListener("click", () => {
    amountInput.value = "";
    overlay.classList.add("open");
  });
  closeBtn.addEventListener("click", () => overlay.classList.remove("open"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("open");
  });

  confirmBtn.addEventListener("click", () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    // TODO: replace with a real POST /api/v1/corporate/wallet/top-up
    // call once that endpoint is confirmed.
    alert(`Top up of ₦${amount.toLocaleString()} confirmed (mock — no backend call made yet).`);
    overlay.classList.remove("open");
  });
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
  document.getElementById("withdraw-btn").addEventListener("click", () => {
    alert("Withdraw is coming soon.");
  });
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
setupTabs();
setupTopUpModal();
setupSidebarNav();
setupMiscControls();
applyFilters();