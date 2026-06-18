/* ============================================
   CALIBRATE ADAS — Main JavaScript
   Theme Toggle, RTL Toggle, Scroll Effects
   ============================================ */

'use strict';

const Nexo = (() => {

  /* ---- Theme Management ---- */
  const Theme = {
    init() {
      const saved = localStorage.getItem('calibrate-theme');
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      this.updateIcons();

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('calibrate-theme')) {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
          this.updateIcons();
        }
      });

      // Event delegation for theme toggle clicks
      document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-toggle');
        if (btn) {
          e.preventDefault();
          this.toggle();
        }
      });
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('calibrate-theme', next);
      this.updateIcons();
    },

    updateIcons() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}"></i>`;
        if (window.lucide) {
          window.lucide.createIcons({ root: btn });
        }
      });
    }
  };

  /* ---- RTL Management ---- */
  const RTL = {
    init() {
      const saved = localStorage.getItem('calibrate-dir');
      if (saved) {
        document.documentElement.setAttribute('dir', saved);
      }
      this.updateIcons();

      // Event delegation for RTL toggle clicks
      document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.rtl-toggle');
        if (btn) {
          e.preventDefault();
          this.toggle();
        }
      });
    },

    toggle() {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('calibrate-dir', next);
      this.updateIcons();
    },

    updateIcons() {
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      document.querySelectorAll('.rtl-toggle').forEach(btn => {
        const label = btn.querySelector('.toggle-label');
        if (label) {
          label.textContent = isRTL ? 'LTR' : 'RTL';
        }
      });
    }
  };

  /* ---- Navbar Scroll Effect ---- */
  const NavScroll = {
    init() {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;

      const check = () => {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };

      window.addEventListener('scroll', check, { passive: true });
      check();
    }
  };

  /* ---- Mobile Navigation ---- */
  const MobileNav = {
    init() {
      const hamburger = document.querySelector('.hamburger');
      const mobileNav = document.querySelector('.mobile-nav');
      const overlay = document.querySelector('.mobile-overlay');
      const closeBtn = document.querySelector('.mobile-nav-close');

      if (!hamburger || !mobileNav) return;

      hamburger.addEventListener('click', () => this.open(mobileNav, overlay));

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close(mobileNav, overlay));
      }
      if (overlay) {
        overlay.addEventListener('click', () => this.close(mobileNav, overlay));
      }

      // Mobile dropdowns
      document.querySelectorAll('.mobile-dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const dropdown = trigger.nextElementSibling;
          if (dropdown && dropdown.classList.contains('mobile-dropdown')) {
            dropdown.classList.toggle('open');
            const icon = trigger.querySelector('.mobile-nav-link i');
            if (icon) {
              icon.style.transform = dropdown.classList.contains('open') ? 'rotate(180deg)' : '';
            }
          }
        });
      });
    },

    open(nav, overlay) {
      nav.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close(nav, overlay) {
      nav.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  /* ---- Scroll Animations ---- */
  const ScrollAnimations = {
    init() {
      const elements = document.querySelectorAll('.animate-on-scroll, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
      if (!elements.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(el => observer.observe(el));
    }
  };

  /* ---- Counter Animation ---- */
  const CounterAnimation = {
    init() {
      const counters = document.querySelectorAll('[data-count]');
      if (!counters.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(el => observer.observe(el));
    },

    animate(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  };

  /* ---- Accordion ---- */
  const Accordion = {
    init() {
      document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.accordion-item');
          const isOpen = item.classList.contains('open');

          // Close all in same group
          const parent = item.parentElement;
          parent.querySelectorAll('.accordion-item.open').forEach(openItem => {
            openItem.classList.remove('open');
          });

          if (!isOpen) {
            item.classList.add('open');
          }
        });
      });
    }
  };

  /* ---- Tabs ---- */
  const Tabs = {
    init() {
      document.querySelectorAll('.tabs').forEach(tabContainer => {
        const buttons = tabContainer.querySelectorAll('.tab-btn');
        const parent = tabContainer.parentElement;
        const contents = parent.querySelectorAll('.tab-content');

        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            buttons.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = parent.querySelector(`[data-tab-content="${target}"]`);
            if (targetContent) targetContent.classList.add('active');
          });
        });
      });
    }
  };

  /* ---- Smooth Scroll ---- */
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  };

  /* ---- Back to Top ---- */
  const BackToTop = {
    init() {
      document.querySelectorAll('.back-to-top').forEach(btn => {
        btn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }
  };

  /* ---- Volume Slider ---- */
  const VolumeSlider = {
    init() {
      const slider = document.getElementById('volume-slider');
      const priceDisplay = document.getElementById('volume-price');
      if (!slider || !priceDisplay) return;

      const prices = { 1: 299, 5: 269, 10: 239, 25: 199, 50: 169, 100: 139 };
      const breakpoints = [1, 5, 10, 25, 50, 100];

      slider.addEventListener('input', () => {
        const val = parseInt(slider.value, 10);
        let price = 299;
        for (let i = breakpoints.length - 1; i >= 0; i--) {
          if (val >= breakpoints[i]) {
            price = prices[breakpoints[i]];
            break;
          }
        }
        priceDisplay.textContent = `$${price}`;
        const label = document.getElementById('volume-count');
        if (label) label.textContent = val;
      });
    }
  };

  /* ---- Countdown Timer ---- */
  const Countdown = {
    init() {
      const container = document.querySelector('.countdown');
      if (!container) return;

      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 45);

      const update = () => {
        const now = new Date();
        const diff = launchDate - now;

        if (diff <= 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      };

      update();
      setInterval(update, 1000);
    }
  };

  /* ---- Dashboard Sidebar Toggle ---- */
  const DashboardSidebar = {
    init() {
      const toggle = document.querySelector('.sidebar-toggle');
      const sidebar = document.querySelector('.dashboard-sidebar');
      const overlay = document.querySelector('.dashboard-overlay');

      if (!toggle || !sidebar) return;

      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
      });

      if (overlay) {
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('open');
          overlay.classList.remove('active');
        });
      }
    }
  };

  /* ---- Initialize All ---- */
  const init = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
    Theme.init();
    RTL.init();
    NavScroll.init();
    MobileNav.init();
    ScrollAnimations.init();
    CounterAnimation.init();
    Accordion.init();
    Tabs.init();
    SmoothScroll.init();
    BackToTop.init();
    VolumeSlider.init();
    Countdown.init();
    DashboardSidebar.init();
  };

  document.addEventListener('DOMContentLoaded', init);

  const api = { Theme, RTL };
  window.Nexo = api;
  return api;
})();
