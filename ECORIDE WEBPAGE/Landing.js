// Landing.js
// Handles independent pieces of interactivity on the landing page:
//   1. Mobile nav menu toggle (hamburger button)
//   2. Sticky header background color change on scroll
//   3. FAQ accordion (expand/collapse answers)
//   4. App store redirects (OS auto-detect)
//   5. Staggered entrance for the "Why Choose EcoRide?" feature boxes

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
  if (icon) {
    icon.classList.add("ph-list");
    icon.classList.remove("ph-x");
  }
}

hamburger.addEventListener("click", () => {
  const isOpen = navList.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));

  const icon = hamburger.querySelector("i");
  if (icon) {
    icon.classList.toggle("ph-list", !isOpen);
    icon.classList.toggle("ph-x", isOpen);
  }
});

// Close the menu if the user clicks a nav link (common mobile UX)
navList.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

// ---------------------------------------------------------------
// 2. Sticky Header Scroll Interaction
// Monitors vertical scroll depth. Toggles a '.scrolled' class on 
// the header container to transition background colors smoothly.
// ---------------------------------------------------------------
window.addEventListener('scroll', () => {
  const headerElement = document.querySelector('.headings');
  
  if (headerElement) {
    // If the user scrolls down more than 40px, apply the deep green styles
    if (window.scrollY > 40) {
      headerElement.classList.add('scrolled');
    } else {
      headerElement.classList.remove('scrolled');
    }
  }
}, { passive: true }); // Passive option improves mobile scrolling performance

// ---------------------------------------------------------------
// 3. FAQ accordion
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

  if (question) {
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // close every item first, so only one is open at a time
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherIcon = otherItem.querySelector(".plus-icon");
        if (otherIcon) otherIcon.textContent = "+";
      });

      // then reopen this one, unless it was the one already open
      if (!isOpen) {
        item.classList.add("active");
        if (icon) icon.textContent = "−";
      }
    });
  }
});

// ---------------------------------------------------------------
// 4. App store redirects (OS auto-detect)
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
    // desktop / unknown device — scroll to the QR code section
    document.querySelector(".download")?.scrollIntoView({ behavior: "smooth" });
  }
}

document.getElementById("download-app-btn")?.addEventListener("click", goToStore);
document.getElementById("become-driver-btn")?.addEventListener("click", goToStore);

// Store icon links validation
document.getElementById("app-store-link")?.addEventListener("click", (e) => {
  if (APP_STORE_URL === "#") e.preventDefault();
});
document.getElementById("play-store-link")?.addEventListener("click", (e) => {
  if (PLAY_STORE_URL === "#") e.preventDefault();
});

// ---------------------------------------------------------------
// 5. Staggered entrance for the "Why Choose EcoRide?" feature boxes
// ---------------------------------------------------------------
(function setupEcorideReveal() {
  const wholeBox = document.querySelector(".whole-box");
  if (!wholeBox) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    wholeBox.classList.add("in-view");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          wholeBox.classList.add("in-view");
          observer.unobserve(wholeBox); // only animate the first time it appears
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(wholeBox);
})();
