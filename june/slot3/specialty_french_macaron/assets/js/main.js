/* ============================================================
   Liora — Core JavaScript
   Theme Toggle, RTL, Animations, Counters, Form Validation
   ============================================================ */
(function () {
  'use strict';

  /* =========================================================
     PAGE LOADER
     ========================================================= */
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 300);
    });
  }

  /* =========================================================
     THEME TOGGLE (Dark / Light)
     ========================================================= */
  const THEME_KEY = 'lmr-theme';

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY);
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    const isDark = theme === 'dark';
    // Desktop icons
    const sunD  = document.getElementById('icon-sun');
    const moonD = document.getElementById('icon-moon');
    if (sunD)  sunD.style.display  = isDark  ? 'block' : 'none';
    if (moonD) moonD.style.display = isDark  ? 'none'  : 'block';
    // Mobile icons
    const sunM  = document.getElementById('icon-sun-m');
    const moonM = document.getElementById('icon-moon-m');
    if (sunM)  sunM.style.display  = isDark  ? 'block' : 'none';
    if (moonM) moonM.style.display = isDark  ? 'none'  : 'block';
  }

  function initTheme() {
    const stored = getStoredTheme();
    applyTheme(stored || getSystemTheme());

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
    });

    // Desktop toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle') || e.target.closest('#theme-toggle-mobile')) {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      }
    });
  }

  /* =========================================================
     RTL / LTR TOGGLE
     ========================================================= */
  const DIR_KEY = 'lmr-dir';

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    updateDirLabels(dir);
  }

  function updateDirLabels(dir) {
    const isRtl = dir === 'rtl';
    const labels = document.querySelectorAll('#rtl-label, #rtl-label-mobile');
    labels.forEach(el => { el.textContent = isRtl ? 'LTR' : 'RTL'; });
  }

  function initDir() {
    const stored = localStorage.getItem(DIR_KEY) || 'ltr';
    applyDir(stored);

    document.addEventListener('click', (e) => {
      if (e.target.closest('#rtl-toggle') || e.target.closest('#rtl-toggle-mobile')) {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        applyDir(current === 'rtl' ? 'ltr' : 'rtl');
      }
    });
  }

  /* =========================================================
     SCROLL ANIMATIONS (IntersectionObserver)
     ========================================================= */
  function initScrollAnimations() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }

  /* =========================================================
     COUNTER ANIMATION
     ========================================================= */
  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-count'), 10);
    const suffix  = el.getAttribute('data-suffix') || '';
    const prefix  = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start   = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current  = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* =========================================================
     FORM VALIDATION
     ========================================================= */
  function validateField(input) {
    const value   = input.value.trim();
    const type    = input.type;
    const name    = input.name || input.id;
    const required= input.hasAttribute('required');
    let error = '';

    if (required && !value) {
      error = `${input.getAttribute('data-label') || 'This field'} is required.`;
    } else if (value) {
      if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address.';
      } else if (type === 'tel' && !/^\+?[\d\s\-\(\)]{7,}$/.test(value)) {
        error = 'Please enter a valid phone number.';
      } else if (input.minLength && value.length < input.minLength) {
        error = `Minimum ${input.minLength} characters required.`;
      }
    }

    const group = input.closest('.form-group');
    if (!group) return !error;

    input.classList.toggle('error',   !!error);
    input.classList.toggle('success', !error && !!value);

    let errEl = group.querySelector('.form-error');
    if (error) {
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'form-error';
        errEl.setAttribute('role', 'alert');
        group.appendChild(errEl);
      }
      errEl.textContent = error;
    } else if (errEl) {
      errEl.remove();
    }

    return !error;
  }

  function initFormValidation() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) validateField(field);
        });
      });

      form.addEventListener('submit', (e) => {
        let valid = true;
        form.querySelectorAll('input, select, textarea').forEach(field => {
          if (!validateField(field)) valid = false;
        });

        if (!valid) {
          e.preventDefault();
          const firstError = form.querySelector('.error');
          if (firstError) firstError.focus();
        }
      });
    });
  }

  /* =========================================================
     TOAST NOTIFICATIONS
     ========================================================= */
  window.showToast = function (type, message, duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
      success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      error:   '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      info:    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" aria-label="Dismiss notification">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    function removeToast() {
      toast.classList.add('removing');
      setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }

    toast.querySelector('.toast-close').addEventListener('click', removeToast);
    container.appendChild(toast);
    setTimeout(removeToast, duration);
  };

  /* =========================================================
     ACCORDION
     ========================================================= */
  function initAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item   = trigger.closest('.accordion-item');
        const isOpen = item.classList.contains('open');

        // Close siblings (optional: remove for multi-open)
        const parent = item.parentNode;
        parent.querySelectorAll('.accordion-item.open').forEach(openItem => {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* =========================================================
     TABS
     ========================================================= */
  function initTabs() {
    document.querySelectorAll('.tabs-nav').forEach(nav => {
      const buttons = nav.querySelectorAll('.tab-btn');
      const panels  = nav.nextElementSibling
        ? nav.nextElementSibling.querySelectorAll('.tab-panel')
        : nav.closest('.tabs-wrap')?.querySelectorAll('.tab-panel');

      if (!buttons.length) return;

      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
          if (panels) panels.forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          if (panels && panels[i]) panels[i].classList.add('active');
        });
      });
    });
  }

  /* =========================================================
     PRICING TOGGLE (monthly / annual)
     ========================================================= */
  function initPricingToggle() {
    const toggle = document.querySelector('#pricing-toggle');
    if (!toggle) return;

    const prices = document.querySelectorAll('[data-monthly][data-annual]');

    toggle.addEventListener('change', () => {
      const isAnnual = toggle.checked;
      prices.forEach(el => {
        el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
      });
    });
  }

  /* =========================================================
     COUNTDOWN TIMER
     ========================================================= */
  function initCountdown() {
    const el = document.getElementById('countdown-target');
    if (!el) return;
    const targetDate = new Date(el.getAttribute('data-date') || '2026-01-01T00:00:00').getTime();

    function tick() {
      const now  = Date.now();
      const diff = Math.max(0, targetDate - now);

      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);

      const pad = n => String(n).padStart(2, '0');
      const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = pad(v); };

      set('cd-days', days);
      set('cd-hours', hours);
      set('cd-mins', mins);
      set('cd-secs', secs);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* =========================================================
     SUBSCRIPTION PLAN CARDS
     ========================================================= */
  function initPlanCards() {
    document.querySelectorAll('.plan-card').forEach(card => {
      card.addEventListener('click', () => {
        card.closest('.subscription-plans')
          .querySelectorAll('.plan-card')
          .forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  /* =========================================================
     DASHBOARD SIDEBAR MOBILE TOGGLE
     ========================================================= */
  function initDashboardSidebar() {
    const toggleBtn  = document.getElementById('sidebar-toggle');
    const sidebar    = document.getElementById('dashboard-sidebar');
    const backdrop   = document.getElementById('sidebar-backdrop');

    if (!toggleBtn || !sidebar) return;

    function openSidebar() {
      sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('show');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    if (backdrop) backdrop.addEventListener('click', closeSidebar);
  }

  /* =========================================================
     MINI BAR CHART ANIMATION
     ========================================================= */
  function initMiniCharts() {
    const bars = document.querySelectorAll('.mini-bar');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.height = entry.target.getAttribute('data-h') + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(b => {
      b.style.height = '0%';
      b.style.transition = 'height 0.8s ease';
      observer.observe(b);
    });
  }

  /* =========================================================
     GALLERY LIGHTBOX (simple)
     ========================================================= */
  function initGallery() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }

  /* =========================================================
     INIT ALL
     ========================================================= */
  function init() {
    initLoader();
    initTheme();
    initDir();
    initScrollAnimations();
    initCounters();
    initFormValidation();
    initAccordions();
    initTabs();
    initPricingToggle();
    initCountdown();
    initPlanCards();
    initDashboardSidebar();
    initMiniCharts();
    initGallery();

    // Re-run Lucide after all DOM is ready
    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init after navbar/footer inject (they fire lucide themselves,
  // but re-run counters after DOM mutations)
  window.addEventListener('load', () => {
    initCounters();
    initScrollAnimations();
    if (window.lucide) window.lucide.createIcons();
  });
})();
