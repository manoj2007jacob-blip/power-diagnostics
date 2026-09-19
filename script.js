// Power Diagnostics — Minimal Scripts

(function () {
  "use strict";

  // --- Navbar scroll effect ---
  const navbar = document.getElementById("mainNav");

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // set initial state

  // --- Highlight active menu ---
  function highlightActiveMenu() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#navMenu .nav-link:not(.dropdown-toggle)');
    
    navLinks.forEach(function(link) {
      const href = link.getAttribute('href');
      
      // Remove any existing active class first
      link.classList.remove('active');
      
      if (!href) return;
      
      // Extract just the filename from href
      const linkFile = href.split('/').pop().split('#')[0];
      
      // Check for matches
      if (linkFile === currentPage) {
        link.classList.add('active');
      }
      // Special case for home page
      else if ((currentPage === 'index.html' || currentPage === '') && 
               (href === '#hero' || href === '#' || href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  
  // Run on page load
  highlightActiveMenu();

  // --- Auto-close mobile nav on link click ---
  const navCollapse = document.getElementById("navMenu");
  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse, {
    toggle: false,
  });

  // Close mobile nav when clicking nav links (except dropdown toggle)
  document.querySelectorAll("#navMenu .nav-link:not(.dropdown-toggle)").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navCollapse.classList.contains("show")) {
        bsCollapse.hide();
      }
    });
  });

  // Close mobile nav when clicking dropdown items
  document.querySelectorAll("#navMenu .dropdown-item").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navCollapse.classList.contains("show")) {
        bsCollapse.hide();
      }
    });
  });

  // --- Contact form opens email client ---
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // Build mailto link
      const to = "sales@power-diagnostics.com";
      const subject = encodeURIComponent(`Contact Form Submission from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );
      
      const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;

      // Open email client
      window.location.href = mailtoLink;

      // Show feedback
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-circle me-1"></i> Opening Email...';
      btn.disabled = true;
      btn.classList.add("btn-success");
      btn.classList.remove("btn-accent");

      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove("btn-success");
        btn.classList.add("btn-accent");
        form.reset();
        form.classList.remove("was-validated");
      }, 2000);
    });
  }

  // --- Scroll animations with Intersection Observer ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll(
    '.animate-on-scroll, .slide-in-left, .slide-in-right, .fade-in, .scale-in'
  );
  
  animatedElements.forEach(function(el) {
    observer.observe(el);
  });

  // Trigger hero animations immediately
  setTimeout(function() {
    document.querySelectorAll('.hero-section .slide-in-left').forEach(function(el) {
      el.classList.add('animated');
    });
  }, 200);

  // --- Counter animation for About section stats ---
  function animateCounter(element, target, duration, suffix) {
    let current = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(function() {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  // Special observer for stat counters
  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // Find the counter element within this stat
        const counterElement = entry.target.querySelector('.fw-bold');
        if (counterElement && !counterElement.dataset.counted) {
          counterElement.dataset.counted = 'true';
          const text = counterElement.textContent.trim();
          
          // Parse the number and suffix
          if (text.includes('+')) {
            const num = parseInt(text.replace('+', ''));
            counterElement.textContent = '0+';
            animateCounter(counterElement, num, 1500, '+');
          } else if (text.includes('%')) {
            const num = parseInt(text.replace('%', ''));
            counterElement.textContent = '0%';
            animateCounter(counterElement, num, 1500, '%');
          } else if (text.includes('/')) {
            // For "24/7", just fade it in without counting
            counterElement.style.opacity = '0';
            setTimeout(function() {
              counterElement.style.transition = 'opacity 0.6s ease';
              counterElement.style.opacity = '1';
            }, 500);
          }
        }
        
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Observe stats in About section
  document.querySelectorAll('.d-flex.gap-4 > div').forEach(function(stat) {
    statsObserver.observe(stat);
  });

  // --- Sectors Carousel Auto-play ---
  const sectorsCarousel = document.getElementById('sectorsCarousel');
  if (sectorsCarousel) {
    const carousel = new bootstrap.Carousel(sectorsCarousel, {
      interval: 5000,
      wrap: true,
      keyboard: true
    });

    // Pause on hover
    sectorsCarousel.addEventListener('mouseenter', function() {
      carousel.pause();
    });

    sectorsCarousel.addEventListener('mouseleave', function() {
      carousel.cycle();
    });
  }

  // --- Brands Page: Live Search & Category Filtering ---
  const brandSearchInput = document.getElementById('brandSearchInput');
  const brandFilterBtns = document.querySelectorAll('.brand-category-btn');
  const brandCards = document.querySelectorAll('.brand-card-item');
  const brandCountDisplay = document.getElementById('brandCountDisplay');
  const noBrandsFoundMsg = document.getElementById('noBrandsFound');

  function filterBrands() {
    if (!brandCards.length) return;

    const searchTerm = (brandSearchInput ? brandSearchInput.value.toLowerCase().trim() : '');
    const activeBtn = document.querySelector('.brand-category-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

    let visibleCount = 0;

    brandCards.forEach(function (card) {
      const brandName = (card.getAttribute('data-name') || '').toLowerCase();
      const brandCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const brandSpecialty = (card.getAttribute('data-specialty') || '').toLowerCase();

      const matchesSearch = !searchTerm || brandName.includes(searchTerm) || brandCategory.includes(searchTerm) || brandSpecialty.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || brandCategory.includes(selectedCategory.toLowerCase());

      if (matchesSearch && matchesCategory) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (brandCountDisplay) {
      brandCountDisplay.textContent = visibleCount;
    }

    if (noBrandsFoundMsg) {
      noBrandsFoundMsg.classList.toggle('d-none', visibleCount > 0);
    }
  }

  if (brandSearchInput) {
    brandSearchInput.addEventListener('input', filterBrands);
  }

  if (brandFilterBtns.length) {
    brandFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        brandFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterBrands();
      });
    });
  }

  // --- Products Page: URL Query String & Category Filtering ---
  const productCards = document.querySelectorAll('.product-card-item');
  const productSearchInput = document.getElementById('productSearchInput');
  const productFilterBtns = document.querySelectorAll('.product-category-btn');
  const productCountDisplay = document.getElementById('productCountDisplay');
  const activeBrandBanner = document.getElementById('activeBrandBanner');
  const activeBrandNameSpan = document.getElementById('activeBrandName');
  const clearBrandFilterBtn = document.getElementById('clearBrandFilter');
  const noProductsFoundMsg = document.getElementById('noProductsFound');

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // ============================================
  // Cart State Engine (localStorage)
  // ============================================
  const CART_STORAGE_KEY = 'pd_cart';

  function getCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [
        // Default initial items for realistic demonstration matching sample images
        {
          id: 'hioki-3280-10f',
          name: 'AC Clamp Meter 3280-10F',
          brand: 'Hioki',
          category: 'Test & Measurement',
          image: 'images/equipment/hioki-3280-10f.jpg',
          qty: 2
        },
        {
          id: 'hioki-lr8450',
          name: 'Temperature & Data Logger LR8450',
          brand: 'Hioki',
          category: 'Digital Oscilloscopes / Recorders',
          image: 'images/equipment/hioki-lr8450.jpg',
          qty: 2
        }
      ];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    renderAllCartUI();
  }

  function addToCart(product, qty = 1) {
    const cart = getCart();
    const existingIndex = cart.findIndex(function (item) { return item.id === product.id; });

    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand || 'Power Diagnostics',
        category: product.category || 'General Equipment',
        image: product.image || 'images/equipment/digital-multimeters_3.jpg',
        qty: qty
      });
    }

    saveCart(cart);

    // Open Offcanvas Cart Drawer
    const cartOffcanvasEl = document.getElementById('cartOffcanvas');
    if (cartOffcanvasEl && typeof bootstrap !== 'undefined') {
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartOffcanvasEl);
      bsOffcanvas.show();
    }
  }

  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(function (item) { return item.id !== id; });
    saveCart(cart);
  }

  function updateCartQty(id, deltaOrVal, isAbsolute = false) {
    const cart = getCart();
    const item = cart.find(function (i) { return i.id === id; });
    if (!item) return;

    if (isAbsolute) {
      item.qty = Math.max(1, parseInt(deltaOrVal) || 1);
    } else {
      item.qty += deltaOrVal;
    }

    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      saveCart(cart);
    }
  }

  function getCartCount() {
    const cart = getCart();
    return cart.reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);
  }

  function renderAllCartUI() {
    const cart = getCart();
    const totalCount = getCartCount();

    // 1. Update all cart count badges in navbars
    document.querySelectorAll('.nav-cart-badge').forEach(function (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    // 2. Render Offcanvas Cart Drawer
    const drawerContainer = document.getElementById('cartDrawerItemsList');
    const drawerEmptyMsg = document.getElementById('cartDrawerEmpty');
    const drawerFooter = document.getElementById('cartDrawerFooter');

    if (drawerContainer) {
      if (cart.length === 0) {
        drawerContainer.innerHTML = '';
        if (drawerEmptyMsg) drawerEmptyMsg.classList.remove('d-none');
        if (drawerFooter) drawerFooter.classList.add('d-none');
      } else {
        if (drawerEmptyMsg) drawerEmptyMsg.classList.add('d-none');
        if (drawerFooter) drawerFooter.classList.remove('d-none');

        let html = '';
        cart.forEach(function (item) {
          html += `
            <div class="cart-drawer-item">
              <div class="cart-drawer-img">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="cart-drawer-details">
                <div class="cart-drawer-title" title="${item.name}">${item.name}</div>
                <div class="cart-drawer-meta">
                  <span class="cart-drawer-qty">${item.qty} &times; Units</span>
                  <span class="badge bg-light text-muted border ms-1" style="font-size: 0.7rem;">${item.brand || 'Power Diagnostics'}</span>
                </div>
              </div>
              <button type="button" class="cart-drawer-remove btn-remove-item" data-id="${item.id}" title="Remove item">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          `;
        });
        drawerContainer.innerHTML = html;

        // Update drawer total counter if present
        const drawerUnitsEl = document.getElementById('drawerTotalUnits');
        if (drawerUnitsEl) {
          drawerUnitsEl.textContent = `${totalCount} Unit${totalCount !== 1 ? 's' : ''}`;
        }

        drawerContainer.querySelectorAll('.btn-remove-item').forEach(function (btn) {
          btn.addEventListener('click', function () {
            removeFromCart(btn.getAttribute('data-id'));
          });
        });
      }
    }

    // 3. Render View Cart Page (cart.html)
    const cartTableBody = document.getElementById('cartPageTableBody');
    const cartPageEmptyState = document.getElementById('cartPageEmptyState');
    const cartPageContent = document.getElementById('cartPageContent');
    const summaryTotalItems = document.getElementById('summaryTotalItems');
    const summaryItemCount = document.getElementById('summaryItemCount');

    if (summaryTotalItems) summaryTotalItems.textContent = totalCount;
    if (summaryItemCount) summaryItemCount.textContent = `${cart.length} distinct item${cart.length !== 1 ? 's' : ''}`;

    if (cartTableBody) {
      if (cart.length === 0) {
        if (cartPageEmptyState) cartPageEmptyState.classList.remove('d-none');
        if (cartPageContent) cartPageContent.classList.add('d-none');
      } else {
        if (cartPageEmptyState) cartPageEmptyState.classList.add('d-none');
        if (cartPageContent) cartPageContent.classList.remove('d-none');

        let tableHtml = '';
        cart.forEach(function (item) {
          tableHtml += `
            <tr class="cart-item-row" data-id="${item.id}">
              <td style="width: 50px;" class="text-center">
                <button type="button" class="btn btn-sm btn-link text-danger p-1 btn-page-remove" data-id="${item.id}" title="Remove item" style="text-decoration:none;">
                  <i class="bi bi-trash3" style="font-size: 0.95rem;"></i>
                </button>
              </td>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 0.6rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px;">
                  <div>
                    <h6 class="mb-1 fw-bold text-dark" style="font-size: 0.95rem;">${item.name}</h6>
                    <div class="d-flex align-items-center gap-2">
                      <span class="badge bg-light text-primary border" style="font-size: 0.725rem;">${item.brand || 'Power Diagnostics'}</span>
                      <small class="text-muted" style="font-size: 0.8rem;">${item.category || ''}</small>
                    </div>
                  </div>
                </div>
              </td>
              <td class="text-end" style="width: 150px;">
                <div class="qty-stepper">
                  <button type="button" class="qty-btn btn-qty-minus" data-id="${item.id}">-</button>
                  <input type="text" class="qty-display" value="${item.qty}" readonly>
                  <button type="button" class="qty-btn btn-qty-plus" data-id="${item.id}">+</button>
                </div>
              </td>
            </tr>
          `;
        });
        cartTableBody.innerHTML = tableHtml;

        cartTableBody.querySelectorAll('.btn-page-remove').forEach(function (btn) {
          btn.addEventListener('click', function () {
            removeFromCart(btn.getAttribute('data-id'));
          });
        });

        cartTableBody.querySelectorAll('.btn-qty-minus').forEach(function (btn) {
          btn.addEventListener('click', function () {
            updateCartQty(btn.getAttribute('data-id'), -1);
          });
        });

        cartTableBody.querySelectorAll('.btn-qty-plus').forEach(function (btn) {
          btn.addEventListener('click', function () {
            updateCartQty(btn.getAttribute('data-id'), 1);
          });
        });
      }
    }

    // WhatsApp Quote Button on cart.html
    const cartWhatsAppBtn = document.getElementById('cartWhatsAppQuoteBtn');
    if (cartWhatsAppBtn) {
      if (cart.length > 0) {
        let waText = '*EQUIPMENT QUOTATION REQUEST - POWER DIAGNOSTICS*\n\nHello Power Diagnostics, I would like to request an official quotation for the following items:\n\n';
        cart.forEach(function (item, idx) {
          waText += `${idx + 1}. *${item.name}* (${item.brand || 'Power Diagnostics'}) - Qty: ${item.qty || 1}\n`;
        });
        waText += `\n*Total Units:* ${totalCount} Units\nPlease share pricing and availability.`;
        cartWhatsAppBtn.href = `https://wa.me/971501886773?text=${encodeURIComponent(waText)}`;
        cartWhatsAppBtn.classList.remove('d-none');
      } else {
        cartWhatsAppBtn.classList.add('d-none');
      }
    }

    // 4. Render Checkout Page (checkout.html)
    const checkoutTableBody = document.getElementById('checkoutEnquiryTableBody');
    const checkoutFormWrapper = document.getElementById('checkoutFormWrapper');
    const checkoutEmptyState = document.getElementById('checkoutEmptyState');
    const checkoutItemCountBadge = document.getElementById('checkoutItemCountBadge');

    if (checkoutItemCountBadge) {
      checkoutItemCountBadge.textContent = `${totalCount} unit${totalCount !== 1 ? 's' : ''} (${cart.length} item${cart.length !== 1 ? 's' : ''})`;
    }

    if (checkoutTableBody) {
      if (cart.length === 0) {
        if (checkoutFormWrapper) checkoutFormWrapper.classList.add('d-none');
        if (checkoutEmptyState) checkoutEmptyState.classList.remove('d-none');
      } else {
        if (checkoutFormWrapper) checkoutFormWrapper.classList.remove('d-none');
        if (checkoutEmptyState) checkoutEmptyState.classList.add('d-none');

        let checkoutHtml = '';
        cart.forEach(function (item) {
          checkoutHtml += `
            <tr class="checkout-item-row" data-id="${item.id}">
              <td style="width: 40px;" class="text-center">
                <button type="button" class="btn btn-sm btn-link text-danger p-0 btn-checkout-remove" data-id="${item.id}" title="Remove item">
                  <i class="bi bi-trash3" style="font-size: 0.9rem;"></i>
                </button>
              </td>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 0.5rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px;">
                  <div>
                    <h6 class="mb-0 fw-bold text-dark" style="font-size: 0.9rem;">${item.name}</h6>
                    <small class="text-muted" style="font-size: 0.75rem;">${item.brand || 'Power Diagnostics'}</small>
                  </div>
                </div>
              </td>
              <td class="text-end" style="width: 140px;">
                <div class="qty-stepper">
                  <button type="button" class="qty-btn btn-checkout-qty-minus" data-id="${item.id}">-</button>
                  <input type="text" class="qty-display" value="${item.qty}" readonly>
                  <button type="button" class="qty-btn btn-checkout-qty-plus" data-id="${item.id}">+</button>
                </div>
              </td>
            </tr>
          `;
        });
        checkoutTableBody.innerHTML = checkoutHtml;

        checkoutTableBody.querySelectorAll('.btn-checkout-remove').forEach(function (btn) {
          btn.addEventListener('click', function () {
            removeFromCart(btn.getAttribute('data-id'));
          });
        });

        checkoutTableBody.querySelectorAll('.btn-checkout-qty-minus').forEach(function (btn) {
          btn.addEventListener('click', function () {
            updateCartQty(btn.getAttribute('data-id'), -1);
          });
        });

        checkoutTableBody.querySelectorAll('.btn-checkout-qty-plus').forEach(function (btn) {
          btn.addEventListener('click', function () {
            updateCartQty(btn.getAttribute('data-id'), 1);
          });
        });
      }
    }
  }

  // Global Event Listener for Add to Cart Buttons across all pages
  document.addEventListener('click', function (e) {
    const addBtn = e.target.closest('.btn-add-to-cart');
    if (!addBtn) return;
    e.preventDefault();

    const product = {
      id: addBtn.getAttribute('data-id') || 'pd-item-' + Date.now(),
      name: addBtn.getAttribute('data-name') || 'Diagnostic Equipment',
      brand: addBtn.getAttribute('data-brand') || 'Power Diagnostics',
      category: addBtn.getAttribute('data-category') || 'Equipment',
      image: addBtn.getAttribute('data-image') || 'images/equipment/digital-multimeters_3.jpg'
    };

    addToCart(product, 1);

    // Subtle button feedback
    const originalText = addBtn.innerHTML;
    addBtn.innerHTML = '<i class="bi bi-check2 me-1"></i> Added';
    addBtn.classList.add('btn-success');
    setTimeout(function () {
      addBtn.innerHTML = originalText;
      addBtn.classList.remove('btn-success');
    }, 1200);
  });

  // Helper to compile enquiry data across Email and WhatsApp
  function compileEnquiryPayload() {
    const cart = getCart();
    const firstName = (document.getElementById('firstName') ? document.getElementById('firstName').value.trim() : '');
    const lastName = (document.getElementById('lastName') ? document.getElementById('lastName').value.trim() : '');
    const company = (document.getElementById('companyName') ? document.getElementById('companyName').value.trim() : 'Company Client');
    const country = (document.getElementById('countryRegion') ? document.getElementById('countryRegion').value : 'UAE');
    const streetAddress = (document.getElementById('streetAddress') ? document.getElementById('streetAddress').value.trim() : '');
    const city = (document.getElementById('townCity') ? document.getElementById('townCity').value.trim() : 'Dubai');
    const phone = (document.getElementById('phone') ? document.getElementById('phone').value.trim() : '');
    const email = (document.getElementById('email') ? document.getElementById('email').value.trim() : '');
    const notes = (document.getElementById('orderNotes') ? document.getElementById('orderNotes').value.trim() : '');

    const refNumber = 'PD-ENQ-' + Math.floor(100000 + Math.random() * 900000);
    const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    let itemsListText = '';
    let waItemsList = '';
    let totalUnits = 0;
    cart.forEach(function (item, idx) {
      const qty = item.qty || 1;
      totalUnits += qty;
      itemsListText += `${idx + 1}. ${item.name} (${item.brand || 'Power Diagnostics'}) - Qty: ${qty}\n`;
      waItemsList += `${idx + 1}. *${item.name}* (${item.brand || 'Power Diagnostics'}) - Qty: ${qty}\n`;
    });

    const to = "sales@power-diagnostics.com";
    const subject = `Official Quotation Request [${refNumber}] - ${company}`;
    const emailBody =
      `OFFICIAL EQUIPMENT QUOTATION REQUEST\n` +
      `Ref No: ${refNumber} | Date: ${formattedDate}\n\n` +
      `CLIENT DETAILS:\n` +
      `• Company: ${company}\n` +
      `• Contact: ${firstName} ${lastName}\n` +
      `• Email: ${email}\n` +
      `• Phone: ${phone}\n` +
      `• Location: ${city}, ${country}\n` +
      (streetAddress ? `• Facility: ${streetAddress}\n` : '') +
      `\n` +
      `REQUESTED EQUIPMENT (${totalUnits} Units Total):\n` +
      `${itemsListText}\n` +
      (notes ? `NOTES / REQUIREMENTS:\n${notes}\n\n` : '') +
      `Please send an official commercial quotation including availability, delivery lead times, and calibration documentation.\n\n` +
      `Thank you,\n` +
      `${firstName} ${lastName}\n` +
      `${company}\n` +
      `Phone: ${phone}`;

    const waBody =
      `*OFFICIAL EQUIPMENT QUOTATION REQUEST*\n` +
      `*Ref:* ${refNumber} | *Date:* ${formattedDate}\n\n` +
      `*CLIENT DETAILS:*\n` +
      `• *Company:* ${company}\n` +
      `• *Contact:* ${firstName} ${lastName}\n` +
      `• *Email:* ${email}\n` +
      `• *Phone:* ${phone}\n` +
      `• *Location:* ${city}, ${country}\n` +
      (streetAddress ? `• *Facility:* ${streetAddress}\n` : '') +
      `\n` +
      `*REQUESTED EQUIPMENT (${totalUnits} Units):*\n` +
      `${waItemsList}\n` +
      (notes ? `*Notes:* ${notes}\n\n` : '') +
      `Please provide commercial quotation, availability, and lead times.`;

    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    const waUrl = `https://wa.me/971501886773?text=${encodeURIComponent(waBody)}`;

    return { refNumber, email, emailBody, mailtoUrl, gmailUrl, waUrl };
  }

  // Function to configure confirmation modal and wire the 4 transmission channels
  function setupConfirmationModal(payload) {
    const modalRefSpan = document.getElementById('modalEnquiryRef');
    const modalEmailSpan = document.getElementById('modalEnquiryEmail');
    const modalMailBtn = document.getElementById('modalOpenMailBtn');
    const modalGmailBtn = document.getElementById('modalOpenGmailBtn');
    const modalWhatsAppBtn = document.getElementById('modalOpenWhatsAppBtn');
    const modalCopyBtn = document.getElementById('modalCopySummaryBtn');
    const modalAlert = document.getElementById('modalCartClearedAlert');

    if (modalRefSpan) modalRefSpan.textContent = payload.refNumber;
    if (modalEmailSpan) modalEmailSpan.textContent = payload.email || 'your organization';
    if (modalAlert) {
      modalAlert.classList.add('d-none');
      modalAlert.classList.remove('d-flex');
    }

    // Helper to clear cart and show confirmation feedback upon clicking ANY of the 4 channels
    function triggerCartClearOnTransmission(clickedElement) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
      renderAllCartUI();
      if (modalAlert) {
        modalAlert.classList.remove('d-none');
        modalAlert.classList.add('d-flex');
      }
      if (clickedElement) {
        clickedElement.classList.add('channel-item-confirmed');
      }
    }

    // Channel 1: WhatsApp
    if (modalWhatsAppBtn) {
      modalWhatsAppBtn.href = payload.waUrl;
      modalWhatsAppBtn.onclick = function () {
        triggerCartClearOnTransmission(modalWhatsAppBtn);
      };
    }

    // Channel 2: Email Client (mailto)
    if (modalMailBtn) {
      modalMailBtn.href = payload.mailtoUrl;
      modalMailBtn.onclick = function (e) {
        e.preventDefault();
        try {
          window.location.assign(payload.mailtoUrl);
        } catch (err) {
          const mailLink = document.createElement('a');
          mailLink.href = payload.mailtoUrl;
          document.body.appendChild(mailLink);
          mailLink.click();
          document.body.removeChild(mailLink);
        }
        triggerCartClearOnTransmission(modalMailBtn);
      };
    }

    // Channel 3: Gmail Web
    if (modalGmailBtn) {
      modalGmailBtn.href = payload.gmailUrl;
      modalGmailBtn.onclick = function () {
        triggerCartClearOnTransmission(modalGmailBtn);
      };
    }

    // Channel 4: Copy Quote Text
    if (modalCopyBtn) {
      modalCopyBtn.onclick = function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(payload.emailBody).then(function () {
            const titleEl = document.getElementById('modalCopyBtnTitle');
            const descEl = document.getElementById('modalCopyBtnDesc');
            const iconEl = document.getElementById('modalCopyBtnIcon');

            if (titleEl) titleEl.innerHTML = '<span class="text-success fw-bold">✓ Quotation Copied!</span>';
            if (descEl) descEl.textContent = 'Summary copied to clipboard. Ready to paste in email/chat.';
            if (iconEl) iconEl.className = 'bi bi-check2 text-success fs-5';

            setTimeout(function () {
              if (titleEl) titleEl.textContent = 'Copy Quotation Text';
              if (descEl) descEl.textContent = 'Copy structured text to paste anywhere';
              if (iconEl) iconEl.className = 'bi bi-clipboard channel-arrow';
            }, 3500);
          });
        }
        triggerCartClearOnTransmission(modalCopyBtn);
      };
    }
  }

  // Helper to handle incomplete form submissions (scroll to top & inform user)
  function handleInvalidCheckoutForm() {
    if (!checkoutForm) return;
    checkoutForm.classList.add('was-validated');

    // Show alert banner
    const alertEl = document.getElementById('checkoutFormValidationAlert');
    if (alertEl) {
      alertEl.classList.remove('d-none');
      alertEl.classList.add('d-flex');
    }

    // Smooth scroll to top of step 1 / alert
    const targetScroll = alertEl || document.getElementById('checkoutStep1Box') || checkoutForm;
    if (targetScroll) {
      const topOffset = targetScroll.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({
        top: Math.max(0, topOffset),
        behavior: 'smooth'
      });
    }

    // Focus first invalid input field after scroll starts
    const firstInvalid = checkoutForm.querySelector(':invalid');
    if (firstInvalid) {
      setTimeout(function () {
        firstInvalid.focus({ preventScroll: true });
      }, 400);
    }
  }

  // Handle Checkout Form Submission (Email Flow)
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    // Hide validation alert when user fills in any input
    checkoutForm.addEventListener('input', function () {
      const alertEl = document.getElementById('checkoutFormValidationAlert');
      if (alertEl && checkoutForm.checkValidity()) {
        alertEl.classList.add('d-none');
        alertEl.classList.remove('d-flex');
      }
    });

    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!checkoutForm.checkValidity()) {
        handleInvalidCheckoutForm();
        return;
      }

      const cart = getCart();
      if (cart.length === 0) {
        alert('Your enquiry cart is empty. Please add items before placing an enquiry.');
        return;
      }

      const payload = compileEnquiryPayload();
      setupConfirmationModal(payload);

      // Show Confirmation Modal (Cart is NOT cleared until one of the 4 buttons is clicked)
      const confirmationModalEl = document.getElementById('enquirySuccessModal');
      if (confirmationModalEl && typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getOrCreateInstance(confirmationModalEl);
        bsModal.show();
      }
    });
  }

  // Handle Direct WhatsApp Button on Checkout Page
  const btnCheckoutWhatsApp = document.getElementById('btnCheckoutWhatsApp');
  if (btnCheckoutWhatsApp && checkoutForm) {
    btnCheckoutWhatsApp.addEventListener('click', function () {
      if (!checkoutForm.checkValidity()) {
        handleInvalidCheckoutForm();
        return;
      }

      const cart = getCart();
      if (cart.length === 0) {
        alert('Your enquiry cart is empty. Please add items before placing an enquiry.');
        return;
      }

      const payload = compileEnquiryPayload();
      setupConfirmationModal(payload);

      // Show Confirmation Modal (Cart is NOT cleared until one of the 4 buttons is clicked)
      const confirmationModalEl = document.getElementById('enquirySuccessModal');
      if (confirmationModalEl && typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getOrCreateInstance(confirmationModalEl);
        bsModal.show();
      }
    });
  }

  // Run on page load
  renderAllCartUI();

  // ============================================
  // Shop & Products Page Filtering & Active Filter Tags
  // ============================================
  const shopCards = Array.from(document.querySelectorAll('.shop-product-item'));
  const shopProductsGrid = document.getElementById('shopProductsGrid');
  const shopSearchInput = document.getElementById('shopSearchInput');
  const shopSearchClear = document.getElementById('shopSearchClear');
  const shopSortSelect = document.getElementById('shopSortSelect');
  const shopResultCount = document.getElementById('shopResultCount');
  const sidebarBrandLinks = document.querySelectorAll('.sidebar-brand-link');
  const sidebarCatLinks = document.querySelectorAll('.sidebar-cat-link');
  const shopNoProductsMsg = document.getElementById('shopNoProducts');
  const activeFiltersBar = document.getElementById('activeFiltersBar');
  const activeFilterTagsList = document.getElementById('activeFilterTagsList');
  const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  let currentBrand = getQueryParam('brand') || '';
  let currentCategory = getQueryParam('category') || 'all';

  // Category display names mapping
  const categoryNames = {
    'all': 'All Categories',
    'power quality': 'Power Quality Analyzers',
    'injection': 'Current Injection Sets',
    'insulation': 'High Voltage & Insulation',
    'multimeter': 'Digital Multimeters',
    'diagnostic': 'Diagnostics & Sensors',
    'valves': 'Solenoid Valves & Controls',
    'cable faults': 'Cable Fault Location',
    'data logger': 'Data Loggers'
  };

  function updateActiveFiltersBar(searchTerm) {
    if (!activeFiltersBar || !activeFilterTagsList) return;

    const hasBrandFilter = currentBrand && currentBrand !== 'all';
    const hasCatFilter = currentCategory && currentCategory !== 'all';
    const hasSearchFilter = Boolean(searchTerm && searchTerm.length > 0);

    if (!hasBrandFilter && !hasCatFilter && !hasSearchFilter) {
      activeFiltersBar.classList.add('d-none');
      activeFilterTagsList.innerHTML = '';
      return;
    }

    activeFiltersBar.classList.remove('d-none');
    let tagsHtml = '';

    // 1. Brand Tag
    if (hasBrandFilter) {
      // Capitalize or find exact brand text
      const brandDisplay = currentBrand.charAt(0).toUpperCase() + currentBrand.slice(1);
      tagsHtml += `
        <a href="#" class="filter-tag-item" data-filter="brand" title="Remove ${brandDisplay} filter">
          <i class="bi bi-x"></i> ${brandDisplay}
        </a>
      `;
    }

    // 2. Category Tag
    if (hasCatFilter) {
      const catDisplay = categoryNames[currentCategory.toLowerCase()] || (currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1));
      tagsHtml += `
        <a href="#" class="filter-tag-item" data-filter="category" title="Remove ${catDisplay} filter">
          <i class="bi bi-x"></i> ${catDisplay}
        </a>
      `;
    }

    // 3. Search Tag
    if (hasSearchFilter) {
      tagsHtml += `
        <a href="#" class="filter-tag-item" data-filter="search" title="Clear search query">
          <i class="bi bi-x"></i> &ldquo;${searchTerm}&rdquo;
        </a>
      `;
    }

    activeFilterTagsList.innerHTML = tagsHtml;

    // Bind click events on individual filter tags
    activeFilterTagsList.querySelectorAll('.filter-tag-item').forEach(function (tag) {
      tag.addEventListener('click', function (e) {
        e.preventDefault();
        const filterType = tag.getAttribute('data-filter');
        if (filterType === 'brand') {
          currentBrand = 'all';
          updateURL();
        } else if (filterType === 'category') {
          currentCategory = 'all';
          updateURL();
        } else if (filterType === 'search') {
          if (shopSearchInput) shopSearchInput.value = '';
          if (shopSearchClear) shopSearchClear.classList.add('d-none');
        }
        filterShopProducts();
      });
    });
  }

  function updateURL() {
    const url = new URL(window.location);
    if (currentBrand && currentBrand !== 'all') {
      url.searchParams.set('brand', currentBrand);
    } else {
      url.searchParams.delete('brand');
    }
    if (currentCategory && currentCategory !== 'all') {
      url.searchParams.set('category', currentCategory);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState({}, '', url);
  }

  function sortProducts() {
    if (!shopProductsGrid || !shopSortSelect) return;
    const sortVal = shopSortSelect.value;

    const sorted = [...shopCards].sort(function (a, b) {
      const nameA = (a.getAttribute('data-name') || '').toLowerCase();
      const nameB = (b.getAttribute('data-name') || '').toLowerCase();
      const brandA = (a.getAttribute('data-brand') || '').toLowerCase();
      const brandB = (b.getAttribute('data-brand') || '').toLowerCase();

      if (sortVal === 'name-asc') {
        return nameA.localeCompare(nameB);
      } else if (sortVal === 'name-desc') {
        return nameB.localeCompare(nameA);
      } else if (sortVal === 'brand') {
        return brandA.localeCompare(brandB) || nameA.localeCompare(nameB);
      }
      return 0; // default order
    });

    sorted.forEach(function (card) {
      shopProductsGrid.appendChild(card);
    });
  }

  function filterShopProducts() {
    if (!shopCards.length) return;

    const searchTerm = (shopSearchInput ? shopSearchInput.value.toLowerCase().trim() : '');
    
    // Toggle Search Clear Button
    if (shopSearchClear) {
      shopSearchClear.classList.toggle('d-none', !searchTerm);
    }

    let visibleCount = 0;

    shopCards.forEach(function (card) {
      const pName = (card.getAttribute('data-name') || '').toLowerCase();
      const pBrand = (card.getAttribute('data-brand') || '').toLowerCase();
      const pCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const pDesc = (card.getAttribute('data-desc') || '').toLowerCase();

      const matchesBrand = !currentBrand || currentBrand === 'all' || pBrand === currentBrand.toLowerCase() || pName.includes(currentBrand.toLowerCase());
      const matchesCategory = !currentCategory || currentCategory === 'all' || pCategory.includes(currentCategory.toLowerCase());
      const matchesSearch = !searchTerm || pName.includes(searchTerm) || pBrand.includes(searchTerm) || pCategory.includes(searchTerm) || pDesc.includes(searchTerm);

      if (matchesBrand && matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (shopResultCount) {
      shopResultCount.textContent = visibleCount;
    }

    if (shopNoProductsMsg) {
      shopNoProductsMsg.classList.toggle('d-none', visibleCount > 0);
    }

    // Highlight active sidebar links
    sidebarBrandLinks.forEach(function (link) {
      const b = link.getAttribute('data-brand') || '';
      link.classList.toggle('active', b.toLowerCase() === currentBrand.toLowerCase() || (!currentBrand && b === 'all'));
    });

    sidebarCatLinks.forEach(function (link) {
      const c = link.getAttribute('data-category') || '';
      link.classList.toggle('active', c.toLowerCase() === currentCategory.toLowerCase() || (!currentCategory && c === 'all'));
    });

    // Update Active Filters Bar tags
    updateActiveFiltersBar(searchTerm);
  }

  // Bind Search Input
  if (shopSearchInput) {
    shopSearchInput.addEventListener('input', filterShopProducts);
  }

  // Bind Search Clear Button
  if (shopSearchClear) {
    shopSearchClear.addEventListener('click', function () {
      if (shopSearchInput) {
        shopSearchInput.value = '';
        shopSearchInput.focus();
      }
      filterShopProducts();
    });
  }

  // Bind Clear All Filters Button
  if (clearAllFiltersBtn) {
    clearAllFiltersBtn.addEventListener('click', function (e) {
      e.preventDefault();
      currentBrand = 'all';
      currentCategory = 'all';
      if (shopSearchInput) shopSearchInput.value = '';
      if (shopSearchClear) shopSearchClear.classList.add('d-none');
      updateURL();
      filterShopProducts();
    });
  }

  // Bind Sort Dropdown
  if (shopSortSelect) {
    shopSortSelect.addEventListener('change', function () {
      sortProducts();
      filterShopProducts();
    });
  }

  // Bind Sidebar Brand Links
  if (sidebarBrandLinks.length) {
    sidebarBrandLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        currentBrand = link.getAttribute('data-brand') || 'all';
        updateURL();
        filterShopProducts();
      });
    });
  }

  // Bind Sidebar Category Links
  if (sidebarCatLinks.length) {
    sidebarCatLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        currentCategory = link.getAttribute('data-category') || 'all';
        updateURL();
        filterShopProducts();
      });
    });
  }

  // Initial shop filter run
  if (shopCards.length) {
    filterShopProducts();
  }

  // Make shop product cards clickable to navigate to product-details.html?id=...
  document.addEventListener('click', function (e) {
    const card = e.target.closest('.shop-card');
    if (!card) return;
    if (e.target.closest('.btn-add-to-cart')) return;

    const itemContainer = card.closest('.shop-product-item');
    if (itemContainer) {
      const pId = itemContainer.getAttribute('data-id');
      if (pId) {
        window.location.href = `product-details.html?id=${encodeURIComponent(pId)}`;
      }
    }
  });

  // ============================================
  // Product Details Page Dynamic Catalog Engine
  // ============================================
  const PRODUCTS_DATABASE = {
    'hioki-3280-10f': {
      id: 'hioki-3280-10f',
      name: 'AC Clamp Meter 3280-10F',
      brand: 'Hioki',
      category: 'Electrical / Clamp Meters',
      model: 'CM3280-10F',
      image: 'images/equipment/hioki-3280-10f.jpg',
      gallery: [
        'images/equipment/hioki-3280-10f.jpg',
        'images/equipment/ac-and-dc-clamp-meters_1.jpg',
        'images/equipment/digital-multimeters_3.jpg'
      ],
      shortDesc: 'Rugged & Compact, Essential Equipment for Professional Electricians: Measure Current and Voltage with a Single Instrument.',
      longDesc: 'The 3280-10F is an average rectifying 1000A AC clamp meter that features a broad operating temperature range of -25°C to 65°C, thin and compact clamp core and optional flexible current sensor that you can attach to let you get into the tightest spots.',
      cardVal1: '-25°C to 65°C',
      cardLabel1: 'Operating Temperature',
      cardVal2: '1000A AC Range',
      cardLabel2: 'Current Measurement',
      cardVal3: '1-Meter Drop-Proof',
      cardLabel3: 'Field Ruggedness',
      features: [
        'A pocket clamp meter that can use flexible sensors',
        'Essential for electrical work: A thin card tester that fits in the pocket with all the capabilities of a clamp meter',
        'A tough, pocket-size clamp meter with an operating temperature range of -25°C to 65°C',
        'Drop-proof design withstands drop from a height of 1 meter onto concrete',
        'Thin and compact clamp core (33 mm diameter) for effortless clamping in dense distribution panels'
      ],
      specs: [
        { label: 'AC Current range', value: '41.99 to 1000 A, 3 ranges (50 Hz to 60 Hz, Average rectified), Basic accuracy: ±1.5 % rdg. ±5 dgt.' },
        { label: 'DC Voltage range', value: '419.9 mV to 600 V, 5 ranges, Basic accuracy: ±1.0 % rdg. ±3 dgt.' },
        { label: 'AC Voltage range', value: '4.199 V to 600 V, 4 ranges (45 to 500 Hz, Average rectified), Basic accuracy: ±1.8 % rdg. ±7 dgt.' },
        { label: 'Crest factor', value: 'N/A' },
        { label: 'Resistance range', value: '419.9 Ω to 41.99 MΩ, 6 ranges, Basic accuracy: ±2 % rdg. ±4 dgt.' },
        { label: 'Other functions', value: 'Continuity: Buzzer sounds at 50 Ω ±40 Ω or less, Data hold, Auto power save, Drop-proof from height of 1 meter' },
        { label: 'Display', value: 'LCD, max. 4199 dgt., Display refresh rate: 400 ms' },
        { label: 'Environmental protection', value: 'IP40 dustproof and waterproof (while in storage)' },
        { label: 'Power supply', value: 'Coin type lithium battery (CR2032) ×1, Continuous use 120 hours' }
      ]
    },
    'hioki-lr8450': {
      id: 'hioki-lr8450',
      name: 'Temperature & Data Logger LR8450',
      brand: 'Hioki',
      category: 'Digital Oscilloscopes / Recorders',
      model: 'LR8450-01',
      image: 'images/equipment/hioki-lr8450.jpg',
      gallery: [
        'images/equipment/hioki-lr8450.jpg',
        'images/equipment/digital-multimeters_3.jpg',
        'images/equipment/hioki-pw4001.jpg'
      ],
      shortDesc: 'Wireless Memory HiLogger with high-speed sampling for multichannel temperature, voltage, and strain data logging.',
      longDesc: 'The Hioki LR8450 is a 120-channel high-speed memory data logger featuring wireless module connectivity. Ideal for EV battery testing, industrial machinery thermal profiling, and electrical engineering laboratory research.',
      cardVal1: 'Up to 120 Channels',
      cardLabel1: 'Multichannel Capacity',
      cardVal2: '1 ms Sampling',
      cardLabel2: 'High-Speed Recording',
      cardVal3: 'Wireless Modules',
      cardLabel3: 'Modular Architecture',
      features: [
        'Expandable up to 120 channels with plug-in and wireless measurement units',
        'Sample voltage and temperature in as fast as 1 ms',
        'Direct connection of strain gauges and resistance temperature detectors (RTDs)',
        'Noise-resistant design ensures stable recording even in high-voltage EV battery environments',
        'Wireless LAN connectivity for real-time remote monitoring and automated PC synchronization'
      ],
      specs: [
        { label: 'Number of Channels', value: 'Up to 120 channels with 4 plug-in units + 7 wireless units' },
        { label: 'Recording Interval', value: '1 ms to 1 hour (depending on selected measurement module)' },
        { label: 'Measurement Targets', value: 'Voltage, Thermocouples (K, J, E, T, N, R, S, B, C), RTD (Pt100/JPt100), Resistance, Humidity, Strain' },
        { label: 'Display', value: '8.5-inch TFT color LCD (WVGA 800 × 480 dots)' },
        { label: 'Internal Storage', value: 'Non-volatile 512 MB internal memory + SD Card slot / USB drive support' },
        { label: 'Interfaces', value: 'LAN (100BASE-TX), USB 2.0 High Speed, Wireless LAN IEEE 802.11b/g/n' },
        { label: 'Power Supply', value: 'AC Adapter (100 to 240 V AC), Battery Pack Z1007, or DC 10 to 30 V' }
      ]
    },
    'fluke-117': {
      id: 'fluke-117',
      name: 'Fluke 117 True RMS Multimeter',
      brand: 'Fluke',
      category: 'Digital Multimeters',
      model: 'FLUKE-117',
      image: 'images/equipment/fluke-117.jpg',
      gallery: [
        'images/equipment/fluke-117.jpg',
        'images/equipment/digital-multimeters_3.jpg'
      ],
      shortDesc: 'Electricians Multimeter with non-contact voltage detection, AutoV/LoZ function, and True-RMS precision.',
      longDesc: 'Designed by electricians for electricians, the Fluke 117 provides compact True-RMS precision for commercial buildings, hospitals, and educational facilities. Features integrated VoltAlert non-contact AC voltage detection.',
      cardVal1: '600V CAT III',
      cardLabel1: 'Safety Category',
      cardVal2: 'VoltAlert™ Built-in',
      cardLabel2: 'Non-Contact Voltage',
      cardVal3: 'True-RMS Accuracy',
      cardLabel3: 'Precision AC Reading',
      features: [
        'VoltAlert™ technology for non-contact voltage detection',
        'AutoVolt automatic AC/DC voltage selection',
        'LoZ: low input impedance helps prevent false readings due to ghost voltage',
        'Large white LED backlight to work in poorly lit areas',
        'True-RMS for accurate measurements on non-linear loads'
      ],
      specs: [
        { label: 'DC Voltage Range', value: '600.0 V, Accuracy: 0.5% + 2 digits' },
        { label: 'AC Voltage Range', value: '600.0 V (True-RMS), Accuracy: 1.0% + 3 digits' },
        { label: 'DC/AC Current Range', value: '10.00 A continuous (20 A overload for 30 seconds max)' },
        { label: 'Resistance Range', value: 'Up to 40.00 MΩ' },
        { label: 'Capacitance Range', value: '1000 nF to 9999 μF' },
        { label: 'Safety Rating', value: 'ANSI/ISA 82.02.01 (61010-1) 2004, CAN/CSA-C22.2 No 61010-1-04, CAT III 600V' },
        { label: 'Battery Life', value: '9V Alkaline, typical 400 hours without backlight' }
      ]
    },
    'fluke-1736': {
      id: 'fluke-1736',
      name: 'Fluke 1736 Three-Phase Power Logger',
      brand: 'Fluke',
      category: 'Power Quality & Loggers',
      model: 'FLUKE-1736/EUS',
      image: 'images/equipment/fluke-1736.jpg',
      gallery: [
        'images/equipment/fluke-1736.jpg',
        'images/equipment/hioki-pw4001.jpg'
      ],
      shortDesc: 'Comprehensive three-phase power logger for energy load studies, harmonic analysis, and power quality surveying.',
      longDesc: 'The Fluke 1736 Three-Phase Power Logger built with Fluke Connect mobile app and desktop software compatibility gives you the data you need to make critical power quality and energy decisions in real time.',
      cardVal1: '3-Phase + Neutral',
      cardLabel1: 'Channel Architecture',
      cardVal2: 'IEC 61000-4-30',
      cardLabel2: 'Class A Compliance',
      cardVal3: 'Fluke Connect®',
      cardLabel3: 'Wireless Cloud Sync',
      features: [
        'Automatically capture and log voltage, current, power, harmonics and associated power quality values',
        'Power instrument directly from the measured circuit',
        'Comprehensive logging: More than 20 separate logging sessions can be stored on the instrument',
        'Capture dips, swells, and inrush currents with event waveforms and high-resolution RMS profiles'
      ],
      specs: [
        { label: 'Voltage Inputs', value: 'Up to 1000 V (CAT III 1000 V / CAT IV 600 V)' },
        { label: 'Current Inputs', value: '4 flexible current probes (iFlex 1500A / 3000A / 6000A)' },
        { label: 'Sampling Frequency', value: 'Continuous sampling at 512 samples per cycle (50/60 Hz)' },
        { label: 'Harmonics', value: 'Harmonics up to 50th order (voltage and current)' },
        { label: 'Wireless Communication', value: 'Wi-Fi, Bluetooth, Fluke Connect® Cloud System' }
      ]
    }
  };

  // Helper function to build fallback product details for any catalog item
  function getProductDetails(productId) {
    if (PRODUCTS_DATABASE[productId]) {
      return PRODUCTS_DATABASE[productId];
    }

    // Default template for other products
    return {
      id: productId,
      name: 'Industrial Diagnostic Instrument',
      brand: 'Power Diagnostics',
      category: 'Electrical Test Equipment',
      model: productId.toUpperCase(),
      image: 'images/equipment/digital-multimeters_3.jpg',
      gallery: [
        'images/equipment/digital-multimeters_3.jpg',
        'images/equipment/hioki-3280-10f.jpg',
        'images/equipment/fluke-117.jpg'
      ],
      shortDesc: 'High-precision industrial test instrument engineered for reliability, safety, and NIST-traceable accuracy.',
      longDesc: 'Engineered to international electrical testing standards, this instrument provides advanced diagnostic capabilities for substation maintenance, commissioning, and energy auditing.',
      cardVal1: 'NIST Certified',
      cardLabel1: 'Calibration Standard',
      cardVal2: 'CAT IV Rated',
      cardLabel2: 'Industrial Safety',
      cardVal3: 'GCC Express',
      cardLabel3: 'Fast Dispatch',
      features: [
        'Engineered for harsh industrial and high-voltage substation environments',
        'Precision measurement circuitry with digital filtering',
        'Comprehensive data logging and automated report generation',
        'Pre-calibrated and certified before dispatch across UAE & GCC'
      ],
      specs: [
        { label: 'Measurement Accuracy', value: '±0.5% reading + 2 digits' },
        { label: 'Operating Temperature', value: '-10°C to 55°C (14°F to 131°F)' },
        { label: 'Safety Rating', value: 'IEC 61010-1 CAT IV 600V / CAT III 1000V' },
        { label: 'Protection Degree', value: 'IP54 ruggedized dust and water resistant' },
        { label: 'Warranty & Calibration', value: '1 Year Manufacturer Warranty + ISO/IEC 17025 Certificate' }
      ]
    };
  }

  // Initialize Product Details Page
  function initProductDetailsPage() {
    const mainImgEl = document.getElementById('pdMainImage');
    if (!mainImgEl) return; // Not on product-details.html

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'hioki-3280-10f';
    const product = getProductDetails(productId);

    // Update document title & metadata
    document.title = `${product.name} | Power Diagnostics Equipment`;

    // Populate Hero / Summary Info
    const breadcrumbCat = document.getElementById('pdBreadcrumbCategory');
    const bannerTitle = document.getElementById('pdBannerTitle');
    const titleEl = document.getElementById('pdTitle');
    const brandBadge = document.getElementById('pdBrandBadge');
    const catBadge = document.getElementById('pdCategoryBadge');
    const modelVal = document.getElementById('pdModelVal');
    const shortDesc = document.getElementById('pdShortDesc');
    const longDesc = document.getElementById('pdLongDescription');

    if (breadcrumbCat) breadcrumbCat.textContent = product.category;
    if (bannerTitle) bannerTitle.textContent = product.name;
    if (titleEl) titleEl.textContent = product.name;
    if (brandBadge) brandBadge.textContent = product.brand.toUpperCase();
    if (catBadge) catBadge.textContent = product.category;
    if (modelVal) modelVal.textContent = product.model;
    if (shortDesc) shortDesc.textContent = product.shortDesc;
    if (longDesc) longDesc.textContent = product.longDesc;

    // Overview cards
    const cardVal1 = document.getElementById('pdCardVal1');
    const cardLabel1 = document.getElementById('pdCardLabel1');
    const cardVal2 = document.getElementById('pdCardVal2');
    const cardLabel2 = document.getElementById('pdCardLabel2');
    const cardVal3 = document.getElementById('pdCardVal3');
    const cardLabel3 = document.getElementById('pdCardLabel3');

    if (cardVal1 && product.cardVal1) cardVal1.textContent = product.cardVal1;
    if (cardLabel1 && product.cardLabel1) cardLabel1.textContent = product.cardLabel1;
    if (cardVal2 && product.cardVal2) cardVal2.textContent = product.cardVal2;
    if (cardLabel2 && product.cardLabel2) cardLabel2.textContent = product.cardLabel2;
    if (cardVal3 && product.cardVal3) cardVal3.textContent = product.cardVal3;
    if (cardLabel3 && product.cardLabel3) cardLabel3.textContent = product.cardLabel3;

    // Main image
    mainImgEl.src = product.image;
    mainImgEl.alt = product.name;

    // Thumbnails
    const thumbContainer = document.getElementById('pdThumbList');
    if (thumbContainer && product.gallery && product.gallery.length) {
      let thumbHtml = '';
      product.gallery.forEach(function (imgSrc, idx) {
        thumbHtml += `
          <div class="pd-thumb-item ${idx === 0 ? 'active' : ''}" data-img="${imgSrc}">
            <img src="${imgSrc}" alt="${product.name} view ${idx + 1}">
          </div>
        `;
      });
      thumbContainer.innerHTML = thumbHtml;

      thumbContainer.querySelectorAll('.pd-thumb-item').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          thumbContainer.querySelectorAll('.pd-thumb-item').forEach(function (t) { t.classList.remove('active'); });
          thumb.classList.add('active');
          const newSrc = thumb.getAttribute('data-img');
          if (newSrc) mainImgEl.src = newSrc;
        });
      });
    }

    // Features List
    const featuresList = document.getElementById('pdFeaturesList');
    if (featuresList && product.features) {
      let fHtml = '';
      product.features.forEach(function (feat) {
        fHtml += `
          <li class="pd-feature-item">
            <i class="bi bi-star-fill text-success me-2"></i>
            <span>${feat}</span>
          </li>
        `;
      });
      featuresList.innerHTML = fHtml;
    }

    // Specifications Table
    const specsBody = document.getElementById('pdSpecsTableBody');
    if (specsBody && product.specs) {
      let sHtml = '';
      product.specs.forEach(function (spec) {
        sHtml += `
          <tr>
            <th style="width: 28%;">${spec.label}</th>
            <td>${spec.value}</td>
          </tr>
        `;
      });
      specsBody.innerHTML = sHtml;
    }

    // Quantity Controls
    let currentQty = 1;
    const qtyInput = document.getElementById('pdQtyInput');
    const qtyMinus = document.getElementById('pdQtyMinus');
    const qtyPlus = document.getElementById('pdQtyPlus');

    if (qtyMinus && qtyInput) {
      qtyMinus.addEventListener('click', function () {
        if (currentQty > 1) {
          currentQty--;
          qtyInput.value = currentQty;
          updateWhatsAppLink();
        }
      });
    }

    if (qtyPlus && qtyInput) {
      qtyPlus.addEventListener('click', function () {
        currentQty++;
        qtyInput.value = currentQty;
        updateWhatsAppLink();
      });
    }

    // WhatsApp Button Action
    const waBtn = document.getElementById('pdWhatsAppBtn');
    function updateWhatsAppLink() {
      if (waBtn) {
        const waMsg = `*PRODUCT INQUIRY - POWER DIAGNOSTICS*\n\nHello, I would like to request an official quotation for:\n• *Product:* ${product.name} (${product.brand})\n• *Model:* ${product.model}\n• *Quantity:* ${currentQty} Unit(s)\n\nPlease share price, calibration details, and availability.`;
        waBtn.href = `https://wa.me/971501886773?text=${encodeURIComponent(waMsg)}`;
      }
    }
    updateWhatsAppLink();

    // Add To Cart Button Action
    const addCartBtn = document.getElementById('pdAddToCartBtn');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', function () {
        addToCart({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          image: product.image
        }, currentQty);

        const origHtml = addCartBtn.innerHTML;
        addCartBtn.innerHTML = '<i class="bi bi-check2 me-1"></i> Added to Cart!';
        addCartBtn.classList.remove('btn-accent-gradient');
        addCartBtn.classList.add('btn-success');
        setTimeout(function () {
          addCartBtn.innerHTML = origHtml;
          addCartBtn.classList.remove('btn-success');
          addCartBtn.classList.add('btn-accent-gradient');
        }, 1500);
      });
    }

    // Direct Enquiry Checkout Button
    const directEnquiryBtn = document.getElementById('pdDirectEnquiryBtn');
    if (directEnquiryBtn) {
      directEnquiryBtn.addEventListener('click', function (e) {
        addToCart({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          image: product.image
        }, currentQty);
      });
    }

    // Render Related Products Grid
    const relatedGrid = document.getElementById('pdRelatedGrid');
    if (relatedGrid) {
      const allKeys = Object.keys(PRODUCTS_DATABASE).filter(function (k) { return k !== productId; });
      const relatedKeys = allKeys.slice(0, 4);
      let relatedHtml = '';
      relatedKeys.forEach(function (k) {
        const rel = PRODUCTS_DATABASE[k];
        relatedHtml += `
          <div class="col-sm-6 col-lg-3">
            <div class="shop-card h-100">
              <a href="product-details.html?id=${rel.id}" class="shop-card-img-wrap">
                <img src="${rel.image}" alt="${rel.name}">
              </a>
              <div class="shop-card-body">
                <div class="shop-card-category">${rel.category}</div>
                <h6 class="shop-card-title">
                  <a href="product-details.html?id=${rel.id}" class="text-dark text-decoration-none">${rel.name}</a>
                </h6>
                <div class="shop-card-brand">${rel.brand}</div>
                <button type="button" class="btn-add-to-cart" data-id="${rel.id}" data-name="${rel.name}" data-brand="${rel.brand}" data-category="${rel.category}" data-image="${rel.image}">
                  <i class="bi bi-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        `;
      });
      relatedGrid.innerHTML = relatedHtml;
    }
  }

  // --- Global Header Search Handling ---
  document.querySelectorAll('.nav-search-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = form.querySelector('.nav-search-input');
      if (input && input.value.trim()) {
        window.location.href = 'products.html?search=' + encodeURIComponent(input.value.trim());
      }
    });
  });

  // --- Quick Connect Modal Form Handling ---
  const quickConnectForm = document.getElementById('quickConnectForm');
  if (quickConnectForm) {
    quickConnectForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!quickConnectForm.checkValidity()) {
        quickConnectForm.classList.add('was-validated');
        return;
      }
      const qName = document.getElementById('qcName').value;
      const qPhone = document.getElementById('qcPhone').value;
      const qService = document.getElementById('qcService').value;

      const qcAlert = document.getElementById('qcSuccessAlert');
      if (qcAlert) {
        qcAlert.classList.remove('d-none');
      }

      // Also generate direct WhatsApp callback link option
      const qcWaBtn = document.getElementById('qcDirectWaBtn');
      if (qcWaBtn) {
        const waMsg = `*QUICK CONNECT REQUEST - POWER DIAGNOSTICS*\n\nName: ${qName}\nPhone: ${qPhone}\nService/Product Needed: ${qService}`;
        qcWaBtn.href = `https://wa.me/971501886773?text=${encodeURIComponent(waMsg)}`;
      }

      setTimeout(function() {
        quickConnectForm.reset();
        quickConnectForm.classList.remove('was-validated');
      }, 3000);
    });
  }

  // Run on page load
  initProductDetailsPage();
})();
