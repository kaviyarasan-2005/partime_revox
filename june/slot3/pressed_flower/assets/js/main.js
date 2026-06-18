/**
 * Main Interactive Logic
 * Pressed Flower & Botanical Resin Jewelry Studio
 */

(function () {
  'use strict';

  // 1. Page Loader
  const loader = document.getElementById('pageLoader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 300);
    });
  }

  // 2. Navbar Scroll Behavior
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 3. Mobile Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      // Prevent body scrolling when menu is open
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Mobile Dropdown Toggle
    const mobileDropdownToggles = mobileMenu.querySelectorAll('.mobile-dropdown-toggle');
    mobileDropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const menu = toggle.nextElementSibling;
        const chevron = toggle.querySelector('.dropdown-chevron');
        if (menu.style.display === 'none') {
          menu.style.display = 'block';
          if(chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
          menu.style.display = 'none';
          if(chevron) chevron.style.transform = 'rotate(0deg)';
        }
      });
    });
  }

  // 4. Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Accordion / FAQ Toggle
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');

      // Close other accordions in the same list
      const parent = item.parentElement;
      parent.querySelectorAll('.accordion-item').forEach(sibling => {
        sibling.classList.remove('open');
        const siblingBody = sibling.querySelector('.accordion-body');
        if (siblingBody) siblingBody.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        const body = item.querySelector('.accordion-body');
        if (body) {
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      }
    });
  });

  // 6. Tabs Switcher Component
  const tabNavs = document.querySelectorAll('.tab-nav');
  tabNavs.forEach(nav => {
    const tabBtns = nav.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        if (!targetId) return;

        // Deactivate other buttons in the same nav
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Deactivate all sibling panels in the parent container
        const container = nav.nextElementSibling;
        if (container) {
          container.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
          });
          const targetPane = container.querySelector(`#${targetId}`);
          if (targetPane) {
            targetPane.classList.add('active');
          }
        }
      });
    });
  });

  // 7. Toast Notification Utility
  window.BFToast = {
    show: function (message, type = 'success') {
      let container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      // Use standard check / cross SVGs based on success/error
      const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-svg"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

      const icon = type === 'success' ? successIcon : errorIcon;
      toast.innerHTML = `<div class="flex-center gap-2">${icon}<span>${message}</span></div>`;

      container.appendChild(toast);

      // Fade out and remove
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px)';
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 3000);
    }
  };

  // 8. Contact & Newsletter Form Mock Submissions
  const contactForm = document.querySelector('.contact-form-element');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const inputs = contactForm.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach(input => {
        const parent = input.closest('.form-group');
        if (parent) parent.classList.remove('has-error');

        if (!input.value.trim()) {
          valid = false;
          if (parent) parent.classList.add('has-error');
        }
      });

      if (valid) {
        window.BFToast.show('Thank you! Your botanical design request has been sent.', 'success');
        contactForm.reset();
      } else {
        window.BFToast.show('Please fill in all required fields.', 'error');
      }
    });
  }

  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        window.BFToast.show('Subscribed! Welcome to our botanical workshop newsletter.', 'success');
        form.reset();
      } else {
        window.BFToast.show('Please enter a valid email address.', 'error');
      }
    });
  });

  // Custom Pricing Estimation Calculator (for pricing.html)
  const estimateForm = document.getElementById('estimateForm');
  if (estimateForm) {
    estimateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const jewelryType = document.getElementById('jewelryType').value;
      const flowerPrep = document.getElementById('flowerPrep').value;
      const extraGilding = document.getElementById('extraGilding').checked;

      let basePrice = 45;
      if (jewelryType === 'cufflinks') basePrice = 65;
      if (jewelryType === 'bangle') basePrice = 75;
      if (jewelryType === 'preservation-frame') basePrice = 180;
      if (jewelryType === 'heirloom-set') basePrice = 250;

      let prepFee = 0;
      if (flowerPrep === 'bridal-fresh') prepFee = 80;
      if (flowerPrep === 'memorial-dry') prepFee = 30;

      let gildingFee = extraGilding ? 15 : 0;

      const total = basePrice + prepFee + gildingFee;

      const resultEl = document.getElementById('estimateResult');
      if (resultEl) {
        resultEl.innerHTML = `
          <div class="card bg-secondary p-5 mt-4 text-center fade-up visible">
            <h4 class="text-sage mb-2">Estimated Value</h4>
            <div class="tier-price mb-2">
              <span class="currency">$</span><span class="amount">${total}</span>
            </div>
            <p class="text-xs text-muted mb-4">Includes custom resin casting, polishing, and complimentary linen gift packaging.</p>
            <a href="contact.html?type=${jewelryType}" class="btn btn-rose btn-sm btn-rounded w-full">Request This Piece</a>
          </div>
        `;
      }
    });
  }

  // 9. Countdown Timer (for coming-soon.html)
  const countdownBox = document.querySelector('.countdown-grid');
  if (countdownBox) {
    // Set target date 30 days into the future
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const daysVal = document.getElementById('daysVal');
      const hoursVal = document.getElementById('hoursVal');
      const minutesVal = document.getElementById('minutesVal');
      const secondsVal = document.getElementById('secondsVal');

      if (daysVal) daysVal.textContent = String(days).padStart(2, '0');
      if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
      if (minutesVal) minutesVal.textContent = String(minutes).padStart(2, '0');
      if (secondsVal) secondsVal.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 10. Scroll-triggered animations loader (mock animation trigger)
  const fadeUps = document.querySelectorAll('.fade-up');
  if (fadeUps.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeUps.forEach(element => {
      observer.observe(element);
    });
  }

})();
