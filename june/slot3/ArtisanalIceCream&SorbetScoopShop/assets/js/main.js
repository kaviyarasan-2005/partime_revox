/**
 * NOVA — main.js
 * Shared functionality: navbar, mobile drawer, dropdowns, forms, scroll
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       1. MOBILE DRAWER
       ============================================================ */
    const hamburger     = document.getElementById('hamburger');
    const drawer        = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose   = document.getElementById('drawer-close');

    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add('open');
      drawerOverlay && drawerOverlay.classList.add('open');
      hamburger && hamburger.classList.add('open');
      document.body.style.overflow = 'hidden';
      hamburger && hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove('open');
      drawerOverlay && drawerOverlay.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
      document.body.style.overflow = '';
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger     && hamburger.addEventListener('click', openDrawer);
    drawerClose   && drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay && drawerOverlay.addEventListener('click', closeDrawer);

    // Mobile sub-menu toggles
    document.querySelectorAll('[data-mobile-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetId = btn.getAttribute('data-mobile-toggle');
        const target = document.getElementById(targetId);
        if (target) {
          target.classList.toggle('open');
          const chevron = btn.querySelector('.fa-chevron-down');
          if (chevron) chevron.style.transform = target.classList.contains('open') ? 'rotate(180deg)' : '';
        }
      });
    });

    /* ============================================================
       2. DESKTOP DROPDOWN (keyboard + click fallback)
       ============================================================ */
    document.querySelectorAll('.nav-item-dropdown').forEach(function (item) {
      const toggle = item.querySelector('.nav-dropdown-toggle');
      const dropdown = item.querySelector('.nav-dropdown');
      if (!toggle || !dropdown) return;

      // Click to toggle
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.nav-item-dropdown.open').forEach(function (el) {
          el.classList.remove('open');
        });
        if (!wasOpen) item.classList.add('open');
      });

      // Keyboard support
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.classList.toggle('open');
        }
        if (e.key === 'Escape') item.classList.remove('open');
      });

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (!item.contains(e.target)) item.classList.remove('open');
      });
    });

    /* ============================================================
       3. STICKY NAVBAR SCROLL STYLE
       ============================================================ */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
          navbar.style.boxShadow = '0 2px 20px rgba(44,24,16,0.08)';
        } else {
          navbar.style.boxShadow = 'none';
        }
      }, { passive: true });
    }

    /* ============================================================
       4. ACTIVE NAV LINK
       ============================================================ */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && href !== '#' && currentPage === href) {
        link.classList.add('active');
      }
    });

    /* ============================================================
       5. CONTACT FORM VALIDATION
       ============================================================ */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        contactForm.querySelectorAll('[required]').forEach(function (field) {
          const errorEl = document.getElementById(field.id + '-error');
          if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = 'var(--color-danger)';
            if (errorEl) errorEl.style.display = 'flex';
          } else {
            field.style.borderColor = '';
            if (errorEl) errorEl.style.display = 'none';
          }
          // Email validation
          if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
              valid = false;
              field.style.borderColor = 'var(--color-danger)';
              if (errorEl) errorEl.style.display = 'flex';
            }
          }
        });

        if (valid) {
          const successMsg = document.getElementById('form-success-msg');
          if (successMsg) {
            successMsg.style.display = 'flex';
            contactForm.reset();
            setTimeout(function () { successMsg.style.display = 'none'; }, 5000);
          }
        }
      });

      // Clear error on input
      contactForm.querySelectorAll('[required]').forEach(function (field) {
        field.addEventListener('input', function () {
          field.style.borderColor = '';
          const errorEl = document.getElementById(field.id + '-error');
          if (errorEl) errorEl.style.display = 'none';
        });
      });
    }

    /* ============================================================
       6. LOGIN / AUTH FORMS
       ============================================================ */
    // Password show/hide toggle
    document.querySelectorAll('[data-pw-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetId = btn.getAttribute('data-pw-toggle');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        const icon = btn.querySelector('i');
        if (icon) icon.className = isText ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
      });
    });

    // Auth form submit (demo)
    document.querySelectorAll('.auth-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(function (field) {
          const wrapper = field.closest('.form-group');
          const errorEl = wrapper && wrapper.querySelector('.form-error');
          if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = 'var(--color-danger)';
            if (errorEl) errorEl.style.display = 'flex';
          } else {
            field.style.borderColor = '';
            if (errorEl) errorEl.style.display = 'none';
          }
        });
        if (valid) {
          const btn = form.querySelector('[type="submit"]');
          if (btn) { btn.textContent = 'Success!'; btn.disabled = true; }
        }
      });
    });

    /* ============================================================
       7. NEWSLETTER FORM (Blog, Blog Detail, Contact)
       ============================================================ */
    document.querySelectorAll('.newsletter-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = form.querySelector('.newsletter-input');
        const btn = form.querySelector('.btn');
        if (input && input.value.trim()) {
          if (btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Subscribed!';
            btn.disabled = true;
            setTimeout(function () {
              btn.innerHTML = orig;
              btn.disabled = false;
              input.value = '';
            }, 3000);
          }
        }
      });
    });

    /* ============================================================
       8. CAKE CONFIGURATOR (Home Catering)
       ============================================================ */
    const cakeForm = document.getElementById('cake-configurator');
    if (cakeForm) {
      cakeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = cakeForm.querySelector('[type="submit"]');
        if (btn) {
          btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Request Sent!';
          btn.disabled = true;
          setTimeout(function () {
            btn.innerHTML = 'Design Your Cake';
            btn.disabled = false;
            cakeForm.reset();
          }, 3000);
        }
      });
    }

    /* ============================================================
       9. HOSTING INQUIRY FORM (Services)
       ============================================================ */
    const hostForm = document.getElementById('hosting-form');
    if (hostForm) {
      hostForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = hostForm.querySelector('[type="submit"]');
        if (btn) {
          btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Request Received!';
          btn.disabled = true;
          setTimeout(function () {
            btn.innerHTML = 'Check Availability';
            btn.disabled = false;
            hostForm.reset();
          }, 3000);
        }
      });
    }

    /* ============================================================
       10. COMING SOON NOTIFY FORM
       ============================================================ */
    const notifyForm = document.getElementById('notify-form');
    if (notifyForm) {
      notifyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = notifyForm.querySelector('[type="submit"]');
        const input = notifyForm.querySelector('input[type="email"]');
        if (input && input.value.trim()) {
          if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Notified!';
            btn.disabled = true;
          }
        }
      });
    }

    /* ============================================================
       11. ESCAPE KEY CLOSES DRAWER
       ============================================================ */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });

    /* ============================================================
       12. LAZY LOAD IMAGES
       ============================================================ */
    if ('IntersectionObserver' in window) {
      const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
      // Browser handles loading="lazy" natively — this is a fallback signal
      lazyImgs.forEach(function (img) {
        if (!img.src && img.dataset.src) {
          const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                img.src = img.dataset.src;
                obs.unobserve(img);
              }
            });
          });
          obs.observe(img);
        }
      });
    }

    /* ============================================================
       13. SMOOTH SCROLL FOR ANCHOR LINKS
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 80;
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });

  });
})();
