/**
 * Main JS — Mobile Ceramic Coating & Paint Protection
 * Scroll animations, accordion, form validation,
 * before/after slider, countdown, toast, page loader
 */

(function () {
  'use strict';

  // ── Page Loader ───────────────────────────────────────────
  function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 300);
    });
  }


  // ── Intersection Observer — Fade-up animations ────────────
  function initScrollAnimations() {
    if (window.innerWidth < 640) return; // Reduced animations on mobile

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  // ── Counter Animation ─────────────────────────────────────
  function animateCounter(el) {
    const target   = parseInt(el.dataset.count || el.textContent, 10);
    const duration = 2000;
    const step     = target / (duration / 16);
    let   current  = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
    }, 16);
  }

  function initCounters() {
    const counters  = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // ── Accordion / FAQ ───────────────────────────────────────
  function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item     = header.parentElement;
        const isOpen   = item.classList.contains('open');

        // Close siblings
        const siblings = item.parentElement.querySelectorAll('.accordion-item');
        siblings.forEach(s => {
          s.classList.remove('open');
          const h = s.querySelector('.accordion-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ── Form Validation ───────────────────────────────────────
  function validateField(field) {
    const group    = field.closest('.form-group');
    const errorEl  = group && group.querySelector('.form-error');
    let   valid    = true;
    let   message  = '';

    // Required check
    if (field.required && !field.value.trim()) {
      valid   = false;
      message = field.dataset.errorRequired || 'This field is required.';
    }

    // Email check
    if (valid && field.type === 'email' && field.value) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(field.value)) {
        valid   = false;
        message = field.dataset.errorEmail || 'Please enter a valid email address.';
      }
    }

    // Phone check
    if (valid && field.type === 'tel' && field.value) {
      const phoneRe = /^\+?[\d\s\-()]{7,}$/;
      if (!phoneRe.test(field.value)) {
        valid   = false;
        message = field.dataset.errorPhone || 'Please enter a valid phone number.';
      }
    }

    // Min length
    if (valid && field.minLength > 0 && field.value.length < field.minLength) {
      valid   = false;
      message = `Minimum ${field.minLength} characters required.`;
    }

    if (group) {
      group.classList.toggle('has-error', !valid);
      field.classList.toggle('is-error', !valid);
      field.classList.toggle('is-success', valid && field.value.trim() !== '');
    }

    if (errorEl) errorEl.textContent = message;

    return valid;
  }

  function initFormValidation() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      // Real-time validation on blur
      form.querySelectorAll('.form-control').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.closest('.form-group')?.classList.contains('has-error')) {
            validateField(field);
          }
        });
      });

      // Submit handler
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let allValid = true;

        form.querySelectorAll('.form-control').forEach(field => {
          if (!validateField(field)) allValid = false;
        });

        if (allValid) {
          showToast('Message sent successfully! We will contact you shortly.', 'success');
          form.reset();
          // Clear success states
          form.querySelectorAll('.form-control').forEach(f => f.classList.remove('is-success'));
        } else {
          showToast('Please fix the errors before submitting.', 'error');
        }
      });
    });
  }

  // ── Toast Notification ────────────────────────────────────
  function showToast(message, type = 'default', duration = 3500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  window.showToast = showToast;

  // ── Before / After Image Slider ───────────────────────────
  function initBeforeAfterSlider() {
    document.querySelectorAll('.before-after-container').forEach(container => {
      const slider  = container.querySelector('.ba-slider');
      const after   = container.querySelector('.ba-after');
      if (!slider || !after) return;

      let dragging = false;

      function updatePosition(x) {
        const rect    = container.getBoundingClientRect();
        let   percent = ((x - rect.left) / rect.width) * 100;
        percent = Math.max(5, Math.min(95, percent));

        slider.style.left = `${percent}%`;
        after.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      }

      container.addEventListener('mousedown', (e) => {
        dragging = true;
        updatePosition(e.clientX);
      });

      window.addEventListener('mousemove', (e) => {
        if (dragging) updatePosition(e.clientX);
      });

      window.addEventListener('mouseup', () => { dragging = false; });

      container.addEventListener('touchstart', (e) => {
        dragging = true;
        updatePosition(e.touches[0].clientX);
      }, { passive: true });

      container.addEventListener('touchmove', (e) => {
        if (dragging) updatePosition(e.touches[0].clientX);
      }, { passive: true });

      container.addEventListener('touchend', () => { dragging = false; });
    });
  }

  // ── Countdown Timer (Coming Soon page) ───────────────────
  function initCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;

    const targetDate = new Date(countdown.dataset.target || '2027-01-01T00:00:00').getTime();

    function update() {
      const now  = Date.now();
      const diff = Math.max(0, targetDate - now);

      const days    = Math.floor(diff / 86400000);
      const hours   = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val).padStart(2, '0');
      };

      set('cd-days', days);
      set('cd-hours', hours);
      set('cd-minutes', minutes);
      set('cd-seconds', seconds);
    }

    update();
    setInterval(update, 1000);
  }

  // ── Gallery Lightbox (simple) ─────────────────────────────
  function initGalleryLightbox() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position:fixed;inset:0;z-index:9999;
          background:rgba(0,0,0,0.92);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;padding:24px;
        `;

        const image = document.createElement('img');
        image.src = img.src;
        image.style.cssText = 'max-width:90vw;max-height:85vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.8)';

        overlay.appendChild(image);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        const close = () => {
          overlay.remove();
          document.body.style.overflow = '';
        };

        overlay.addEventListener('click', close);
        document.addEventListener('keydown', function escClose(e) {
          if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', escClose);
          }
        });
      });
    });
  }

  // ── Dashboard Tab Switching ───────────────────────────────
  function initDashboardTabs() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-panel]');
    if (!sidebarLinks.length) return;

    function showPanel(panelId) {
      document.querySelectorAll('.dashboard-panel').forEach(p => {
        p.style.display = 'none';
        p.setAttribute('aria-hidden', 'true');
      });
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.style.display = 'block';
        panel.setAttribute('aria-hidden', 'false');
      }

      sidebarLinks.forEach(l => {
        l.classList.toggle('active', l.dataset.panel === panelId);
      });
    }

    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showPanel(link.dataset.panel);
      });
    });

    // Show first panel by default
    const firstLink = sidebarLinks[0];
    if (firstLink && firstLink.dataset.panel) {
      showPanel(firstLink.dataset.panel);
    }
  }

  // ── Skeleton Loader Demo ──────────────────────────────────
  function initSkeletonLoaders() {
    document.querySelectorAll('[data-skeleton]').forEach(el => {
      const skeletonHtml = `
        <div class="skeleton skeleton-img mb-3"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text w-75"></div>
        <div class="skeleton skeleton-text w-50"></div>
      `;
      el.innerHTML = skeletonHtml;
      setTimeout(() => {
        el.innerHTML = el.dataset.skeleton || '';
      }, 1500);
    });
  }

  // ── Smooth Scroll for anchor links ───────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ── Tab Switcher (Pricing, etc.) ──────────────────────────
  function initTabs() {
    document.querySelectorAll('.tab-nav').forEach(nav => {
      const tabs    = nav.querySelectorAll('.tab-btn');
      const panels  = nav.closest('[data-tabs]')
                         ?.querySelectorAll('.tab-panel') || [];

      tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
          tabs.forEach(t  => t.classList.remove('active'));
          panels.forEach(p => p.style.display = 'none');
          tab.classList.add('active');
          if (panels[i]) panels[i].style.display = 'block';
        });
      });

      // Activate first
      if (tabs[0]) tabs[0].click();
    });
  }

  // ── Initialize all ────────────────────────────────────────
  function init() {
    initPageLoader();
    initScrollAnimations();
    initCounters();
    initAccordion();
    initFormValidation();
    initBeforeAfterSlider();
    initCountdown();
    initGalleryLightbox();
    initDashboardTabs();
    initSkeletonLoaders();
    initSmoothScroll();
    initTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
