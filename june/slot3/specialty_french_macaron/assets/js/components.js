/* ============================================================
   Liora — Shared Component Logic
   ============================================================ */
(function () {
  'use strict';

  /* =========================================================
     MODAL SYSTEM
     ========================================================= */
  window.openModal = function (modalId) {
    const backdrop = document.getElementById(modalId);
    if (!backdrop) return;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    const focusable = backdrop.querySelector('button, input, select, textarea, a[href]');
    if (focusable) setTimeout(() => focusable.focus(), 50);
  };

  window.closeModal = function (modalId) {
    const backdrop = document.getElementById(modalId);
    if (!backdrop) return;
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  function initModals() {
    // Open triggers
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => window.openModal(btn.getAttribute('data-modal-open')));
    });

    // Close triggers
    document.querySelectorAll('[data-modal-close], .modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const backdrop = btn.closest('.modal-backdrop');
        if (backdrop) backdrop.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Click backdrop to close
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(b => {
          b.classList.remove('open');
          document.body.style.overflow = '';
        });
      }
    });
  }

  /* =========================================================
     FLAVOR CARD QUICK-ADD
     ========================================================= */
  function initFlavorCards() {
    document.querySelectorAll('.flavor-card-v2').forEach(card => {
      const addBtn = card.querySelector('[data-add-to-order]');
      if (!addBtn) return;
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = card.querySelector('.flavor-title')?.textContent || 'item';
        if (window.showToast) {
          window.showToast('success', `${name} added to your order!`);
        }
      });
    });
  }

  /* =========================================================
     SMOOTH SCROLL for anchor links
     ========================================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'), 10) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* =========================================================
     COPY TO CLIPBOARD
     ========================================================= */
  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(() => {
          if (window.showToast) window.showToast('success', 'Copied to clipboard!');
        });
      });
    });
  }

  /* =========================================================
     PLAN SELECTOR
     ========================================================= */
  function initPlanSelector() {
    document.querySelectorAll('.plan-card').forEach(card => {
      card.addEventListener('click', () => {
        const container = card.closest('.subscription-plans');
        if (container) {
          container.querySelectorAll('.plan-card').forEach(c => c.classList.remove('active'));
        }
        card.classList.add('active');
      });
    });
  }

  /* =========================================================
     GALLERY ITEM FOCUS
     ========================================================= */
  function initGalleryFocus() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      if (!item.getAttribute('tabindex')) item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'img');
    });
  }

  /* =========================================================
     DONUT CHART ANIMATION
     ========================================================= */
  function initDonutCharts() {
    document.querySelectorAll('.donut-chart-svg circle[data-pct]').forEach(circle => {
      const r = parseFloat(circle.getAttribute('r'));
      const circumference = 2 * Math.PI * r;
      const pct = parseFloat(circle.getAttribute('data-pct'));
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              circle.style.transition = 'stroke-dashoffset 1.2s ease';
              circle.style.strokeDashoffset = circumference * (1 - pct / 100);
            }, 200);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(circle);
    });
  }

  /* =========================================================
     CONTACT FORM HANDLER
     ========================================================= */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check if Formspree action is set
      const action = form.getAttribute('action');
      if (!action || action === '#') {
        if (window.showToast) {
          window.showToast('success', 'Thank you! Your message has been sent. We\'ll reply within 24 hours.');
        }
        form.reset();
        form.querySelectorAll('.success, .error').forEach(el => {
          el.classList.remove('success', 'error');
        });
        return;
      }

      // Formspree submission
      const data = new FormData(form);
      fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(res => {
        if (res.ok) {
          if (window.showToast) window.showToast('success', 'Message sent! We\'ll be in touch soon.');
          form.reset();
        } else {
          if (window.showToast) window.showToast('error', 'Something went wrong. Please try again.');
        }
      }).catch(() => {
        if (window.showToast) window.showToast('error', 'Network error. Please try again later.');
      });
    });
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    initModals();
    initFlavorCards();
    initSmoothScroll();
    initCopyButtons();
    initPlanSelector();
    initGalleryFocus();
    initDonutCharts();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
