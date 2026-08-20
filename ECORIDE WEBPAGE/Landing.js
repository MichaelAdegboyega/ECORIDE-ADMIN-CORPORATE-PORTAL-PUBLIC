// Landing.js
// Handles two independent pieces of interactivity on the landing page:
//   1. Mobile nav menu toggle (hamburger button)
//   2. FAQ accordion (expand/collapse answers)

// ---------------------------------------------------------------
// 1. Mobile nav toggle
// .lists is hidden below 835px by landingstyle.css; this adds/removes
// an "open" class so it can be shown as a dropdown, and swaps the
// icon between list/x so the button reflects open state.
// ---------------------------------------------------------------
const hamburger = document.getElementById("hamburger-toggle");
const navList = document.getElementById("nav-list");

function closeMobileNav() {
  navList.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  const icon = hamburger.querySelector("i");
  icon.classList.add("ph-list");
  icon.classList.remove("ph-x");
}

hamburger.addEventListener("click", () => {
  const isOpen = navList.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));

  const icon = hamburger.querySelector("i");
  icon.classList.toggle("ph-list", !isOpen);
  icon.classList.toggle("ph-x", isOpen);
});

// Close the menu if the user clicks a nav link (common mobile UX —
// otherwise the menu stays open after navigating, or after clicking
// a same-page anchor like these "#" placeholders).
navList.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

// ---------------------------------------------------------------
// 2. FAQ accordion
// Each .faq-item contains a .faq-question (clickable) and a
// .faq-answer (hidden by default via CSS, shown when .faq-item
// has the "active" class). Clicking a question toggles its own
// item and closes any other open item, so only one answer shows
// at a time.
// ---------------------------------------------------------------
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const icon = item.querySelector(".plus-icon");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    // close every item first, so only one is open at a time
    faqItems.forEach((otherItem) => {
      otherItem.classList.remove("active");
      otherItem.querySelector(".plus-icon").textContent = "+";
    });

    // then reopen this one, unless it was the one already open
    // (in which case the loop above already closed it — clicking
    // an open question closes it, matching standard accordion behavior)
    if (!isOpen) {
      item.classList.add("active");
      icon.textContent = "−";
    }
  });
});

// ---------------------------------------------------------------
// 3. App store redirects (OS auto-detect)
//
// ⚠️ PLACEHOLDER URLS — app isn't published yet. Replace APP_STORE_URL
// and PLAY_STORE_URL below with the real listing URLs once live; that's
// the only change needed, every button below reads from these two.
// ---------------------------------------------------------------
const APP_STORE_URL = "#"; // TODO: replace with real App Store URL once published
const PLAY_STORE_URL = "#"; // TODO: replace with real Play Store URL once published

function detectOS() {
  const ua = navigator.userAgent || navigator.vendor || "";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

function goToStore() {
  const os = detectOS();
  if (os === "ios") {
    window.location.href = APP_STORE_URL;
  } else if (os === "android") {
    window.location.href = PLAY_STORE_URL;
  } else {
    // desktop / unknown device — no store to redirect to, so just
    // scroll to the QR code section instead of guessing
    document.querySelector(".download")?.scrollIntoView({ behavior: "smooth" });
  }
}

document.getElementById("download-app-btn").addEventListener("click", goToStore);
document.getElementById("become-driver-btn").addEventListener("click", goToStore);

// Store icon links always go to their specific store, regardless of
// visiting device — someone might be sharing the App Store link with
// an iPhone user from a desktop browser, for instance.
document.getElementById("app-store-link").addEventListener("click", (e) => {
  if (APP_STORE_URL === "#") e.preventDefault(); // not published yet
});
document.getElementById("play-store-link").addEventListener("click", (e) => {
  if (PLAY_STORE_URL === "#") e.preventDefault(); // not published yet
});