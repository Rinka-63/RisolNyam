/* ==========================================================================
   RISOL NYAM - JAVASCRIPT LOGIC
   Brand: RISOL NYAM ("Renyah di Luar, Lumer di Dalam")
   ========================================================================== */

// ==========================================================================
// CONFIGURATION
// ==========================================================================

// Format nomor WhatsApp: 62xxxxxxxxxx
const WHATSAPP_NUMBER = "6285725158604";

// ==========================================================================
// WHATSAPP HELPER
// ==========================================================================

/**
 * Membuka WhatsApp dengan pesan yang sudah diformat.
 * @param {string} customMessage
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
  initCartCheckout();
});

// ==========================================================================
// 1. NAVBAR GLASSMORPHISM SCROLL HANDLER
// ==========================================================================

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
  handleScroll();
}

// ==========================================================================
// 2. MOBILE HAMBURGER MENU TOGGLE
// ==========================================================================

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

  // Menutup menu ketika salah satu link diklik
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// ==========================================================================
// 3. FAQ ACCORDION
// ==========================================================================

function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Tutup semua FAQ yang terbuka
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

      // Buka FAQ yang diklik jika sebelumnya tertutup
      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// ==========================================================================
// 4. INTERSECTION OBSERVER
// ==========================================================================

function initScrollObserver() {
  const animatedElements = document.querySelectorAll(".fade-up");

  if (!("IntersectionObserver" in window)) {
    animatedElements.forEach((el) => {
      el.classList.add("visible");
    });
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

// ==========================================================================
// 5. LUCIDE ICONS
// ==========================================================================

function initLucideIcons() {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
}

// ==========================================================================
// 6. CART & CHECKOUT CONFIGURATION
// ==========================================================================

function initCartCheckout() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutError = document.getElementById("checkout-error");

  // Fitur keranjang memerlukan elemen berikut di index.html.
  if (!cartItems || !cartCount || !cartTotal || !checkoutForm) {
    return;
  }

  const STORAGE_KEY = "risolNyamCart";

  // Menggunakan Map agar setiap produk mempunyai satu entri.
  const cart = new Map();

  // ------------------------------------------------------------------------
  // FORMAT RUPIAH
  // ------------------------------------------------------------------------

  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  }

  // ------------------------------------------------------------------------
  // LOAD CART DARI LOCAL STORAGE
  // ------------------------------------------------------------------------

  function loadCart() {
    try {
      const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      if (!Array.isArray(savedCart)) return;

      savedCart.forEach((item) => {
        if (
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          Number.isFinite(Number(item.price)) &&
          Number(item.price) > 0 &&
          Number.isInteger(Number(item.quantity)) &&
          Number(item.quantity) > 0
        ) {
          cart.set(item.id, {
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
          });
        }
      });
    } catch (error) {
      console.error("Gagal memuat keranjang:", error);
    }
  }

  // ------------------------------------------------------------------------
  // SIMPAN CART KE LOCAL STORAGE
  // ------------------------------------------------------------------------

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...cart.values()]));
    } catch (error) {
      console.error("Gagal menyimpan keranjang:", error);
    }
  }

  // ------------------------------------------------------------------------
  // RENDER KERANJANG
  // ------------------------------------------------------------------------

  function renderCart() {
    cartItems.replaceChildren();

    let total = 0;
    let count = 0;

    if (cart.size === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Keranjang masih kosong.";
      emptyMessage.className = "cart-empty";
      cartItems.appendChild(emptyMessage);
    }

    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-row";

      // Nama dan harga produk
      const info = document.createElement("div");
      info.className = "cart-info";
      info.textContent = `${item.name} - ${formatRupiah(item.price)}`;

      // Bagian tombol kuantitas
      const controls = document.createElement("div");
      controls.className = "cart-controls";

      const minusButton = document.createElement("button");
      minusButton.type = "button";
      minusButton.textContent = "−";
      minusButton.dataset.cartAction = "minus";
      minusButton.dataset.id = item.id;
      minusButton.setAttribute("aria-label", `Kurangi ${item.name}`);

      const quantity = document.createElement("span");
      quantity.className = "cart-quantity";
      quantity.textContent = String(item.quantity);

      const plusButton = document.createElement("button");
      plusButton.type = "button";
      plusButton.textContent = "+";
      plusButton.dataset.cartAction = "plus";
      plusButton.dataset.id = item.id;
      plusButton.setAttribute("aria-label", `Tambah ${item.name}`);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Hapus";
      removeButton.dataset.cartAction = "remove";
      removeButton.dataset.id = item.id;

      controls.append(minusButton, quantity, plusButton, removeButton);

      row.append(info, controls);
      cartItems.appendChild(row);

      total += item.price * item.quantity;
      count += item.quantity;
    });

    cartCount.textContent = String(count);
    cartTotal.textContent = formatRupiah(total);
    const cartBadge = document.getElementById("cart-badge");

    if (cartBadge) {
      cartBadge.textContent = count > 99 ? "99+" : String(count);
      cartBadge.hidden = count === 0;
    }
  }

  // ------------------------------------------------------------------------
  // TAMBAH PRODUK KE KERANJANG
  // ------------------------------------------------------------------------

  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const name = button.dataset.name;
      const price = Number(button.dataset.price);

      if (!id || !name || !Number.isFinite(price) || price <= 0) {
        console.error("Data produk tidak valid:", button);
        return;
      }

      const existingItem = cart.get(id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.set(id, {
          id,
          name,
          price,
          quantity: 1,
        });
      }

      saveCart();
      renderCart();

      if (checkoutError) {
        checkoutError.textContent = "";
      }
    });
  });

  // ------------------------------------------------------------------------
  // TOMBOL TAMBAH, KURANGI, DAN HAPUS
  // ------------------------------------------------------------------------

  cartItems.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.cartAction;
    const item = cart.get(id);

    if (!item) return;

    if (action === "plus") {
      item.quantity += 1;
    } else if (action === "minus") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cart.delete(id);
      }
    } else if (action === "remove") {
      cart.delete(id);
    } else {
      return;
    }

    saveCart();
    renderCart();

    if (checkoutError) {
      checkoutError.textContent = "";
    }
  });

  // ------------------------------------------------------------------------
  // CHECKOUT WHATSAPP
  // ------------------------------------------------------------------------

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (checkoutError) {
      checkoutError.textContent = "";
    }

    if (cart.size === 0) {
      if (checkoutError) {
        checkoutError.textContent =
          "Keranjang masih kosong. Silakan pilih produk.";
      }
      return;
    }

    const customerName = document.getElementById("customer-name").value.trim();

    const pickupLocation = document
      .getElementById("pickup-location")
      .value.trim();

    const paymentMethod = document.getElementById("payment-method").value;

    const customerNote = document.getElementById("customer-note").value.trim();

    if (!customerName || !pickupLocation || !paymentMethod) {
      if (checkoutError) {
        checkoutError.textContent =
          "Lengkapi nama, lokasi pengambilan, dan metode pembayaran.";
      }
      return;
    }

    // Susun daftar pesanan
    let total = 0;

    const orderDetails = [...cart.values()].map((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      return `- ${item.name} x ${item.quantity} = ` + formatRupiah(subtotal);
    });

    // Susun pesan WhatsApp
    const message = [
      "Halo Risol Nyam, saya ingin melakukan pemesanan.",
      "",
      `Nama: ${customerName}`,
      `Lokasi pengambilan: ${pickupLocation}`,
      `Metode pembayaran: ${paymentMethod}`,
      "",
      "Detail pesanan:",
      ...orderDetails,
      "",
      `TOTAL: ${formatRupiah(total)}`,
      customerNote ? `Catatan: ${customerNote}` : "",
      "",
      "Mohon konfirmasi pesanan saya. Terima kasih.",
    ]
      .filter(Boolean)
      .join("\n");

    // Buka WhatsApp dengan isi pesanan.
    // Keranjang tidak langsung dikosongkan karena pesan
    // belum tentu dikirim oleh konsumen.
    sendWhatsAppOrder(message);
  });

  // Tampilkan keranjang awal, termasuk data yang tersimpan.
  loadCart();
  renderCart();
}
