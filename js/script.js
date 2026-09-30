/* ==========================================================================
   RISOL NYAM - JAVASCRIPT LOGIC
   Brand: RISOL NYAM ("Renyah di Luar, Lumer di Dalam")
   ========================================================================== */

// ==========================================================================
// CONFIGURATION (DUMMY DATA - EASY TO CHANGE)
// ==========================================================================
// Ganti nomor WhatsApp di bawah ini dengan nomor bisnis Anda (Format: 6281234567890)
const WHATSAPP_NUMBER = "6285725158604";

/**
 * Helper Reusable Function untuk Membuka WhatsApp dengan Pesan Terformat
 * @param {string} customMessage - Teks pesan yang ingin dikirim
 */
function sendWhatsAppOrder(customMessage) {
  const defaultMessage = "Halo Risol Nyam, saya ingin melakukan pemesanan.";
  const textToSend = customMessage ? customMessage : defaultMessage;
  const encodedText = encodeURIComponent(textToSend);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

  window.open(waUrl, "_blank");
}

// ==========================================================================
// DOM CONTENT LOADED EVENT HANDLER
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initMobileMenu();
  initFaqAccordion();
  initScrollObserver();
  initLucideIcons();
});

/**
 * 1. Navbar Glassmorphism Scroll Handler
 */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Trigger initial state
}

/**
 * 2. Mobile Hamburger Menu Toggle
 */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isActive = hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");
  });

  // Auto close menu when link clicked
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/**
 * 3. FAQ Accordion (Single Item Open at a Time)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all active items
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }
        const otherBtn = otherItem.querySelector(".faq-question");
        if (otherBtn) {
          otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      // If clicked item was not active, open it
      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/**
 * 4. IntersectionObserver for Smooth Fade-Up Animations
 */
function initScrollObserver() {
  const animatedElements = document.querySelectorAll(".fade-up");

  if (!("IntersectionObserver" in window)) {
    // Fallback if IntersectionObserver is not supported
    animatedElements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -50px 0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => observer.observe(el));
}

/**
 * 5. Initialize Lucide Icons dynamically if library is present
 */
function initLucideIcons() {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
}
