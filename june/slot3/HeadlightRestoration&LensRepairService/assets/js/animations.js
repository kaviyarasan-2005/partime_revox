/* ============================================================
   LUME — Animations & Scroll Reveal
   ============================================================ */

const AnimationsManager = (() => {

  /* ---- Scroll Reveal (Intersection Observer) ---- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const isMobile = window.matchMedia('(max-width: 639px)').matches;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ---- Navbar Scroll Behavior ---- */
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  /* ---- Mobile Hamburger ---- */
  function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const drawer = document.querySelector('.mobile-drawer');
    if (!hamburger || !drawer) return;

    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });

    function openDrawer() {
      drawer.classList.add('open');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  /* ---- Mobile Sub-menus ---- */
  function initMobileSubMenus() {
    const triggers = document.querySelectorAll('.mobile-nav-link[data-submenu]');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', e => {
        e.preventDefault();
        const targetId = trigger.getAttribute('data-submenu');
        const submenu = document.getElementById(targetId);
        if (!submenu) return;
        const isOpen = submenu.classList.contains('open');
        document.querySelectorAll('.mobile-sub-menu.open').forEach(m => m.classList.remove('open'));
        if (!isOpen) submenu.classList.add('open');
        const chevron = trigger.querySelector('.nav-chevron');
        if (chevron) {
          document.querySelectorAll('.nav-chevron').forEach(c => c.style.transform = '');
          if (!isOpen) chevron.style.transform = 'rotate(180deg)';
        }
      });
    });
  }

  /* ---- Active Nav Link Detection ---- */
  function initActiveNavLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link[data-page], .mobile-nav-link[data-page]');
    navLinks.forEach(link => {
      const page = link.getAttribute('data-page');
      if (page && (currentPath === page || (currentPath === '' && page === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Stat Counter Animate ---- */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-counter-num[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    }

    requestAnimationFrame(update);
  }

  /* ---- Accordion ---- */
  function initAccordions() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        items.forEach(i => i.classList.remove('active'));
        // Open clicked if was closed
        if (!isActive) item.classList.add('active');
      });
    });
  }

  /* ---- Before/After Slider ---- */
  function initBeforeAfterSliders() {
    const sliders = document.querySelectorAll('.ba-container');
    sliders.forEach(container => {
      const after = container.querySelector('.ba-after');
      const handle = container.querySelector('.ba-handle');
      if (!after || !handle) return;

      let isDragging = false;

      function setPosition(x) {
        const rect = container.getBoundingClientRect();
        const isRTL = document.documentElement.dir === 'rtl';
        let relX = (x - rect.left) / rect.width;
        relX = Math.max(0.05, Math.min(0.95, relX));
        const pct = isRTL ? (1 - relX) * 100 : relX * 100;
        handle.style.left = `${relX * 100}%`;
        if (isRTL) {
          after.style.clipPath = `inset(0 0 0 ${(1 - relX) * 100}%)`;
        } else {
          after.style.clipPath = `inset(0 ${(1 - relX) * 100}% 0 0)`;
        }
      }

      container.addEventListener('mousedown', e => { isDragging = true; setPosition(e.clientX); });
      container.addEventListener('touchstart', e => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
      document.addEventListener('mousemove', e => { if (isDragging) setPosition(e.clientX); });
      document.addEventListener('touchmove', e => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
      document.addEventListener('mouseup', () => { isDragging = false; });
      document.addEventListener('touchend', () => { isDragging = false; });
    });
  }

  /* ---- Smooth form validation ---- */
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const inputs = form.querySelectorAll('[required]');
        let valid = true;
        inputs.forEach(input => {
          clearError(input);
          if (!input.value.trim()) {
            showError(input, 'This field is required.');
            valid = false;
          } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address.');
            valid = false;
          } else if (input.type === 'tel' && input.value.trim().length < 7) {
            showError(input, 'Please enter a valid phone number.');
            valid = false;
          } else if (input.id === 'confirm-password') {
            const password = form.querySelector('#password');
            if (password && input.value !== password.value) {
              showError(input, 'Passwords do not match.');
              valid = false;
            }
          }
        });

        if (valid) {
          showSuccessState(form);
        }
      });

      // Real-time validation
      form.querySelectorAll('[required]').forEach(input => {
        input.addEventListener('blur', () => {
          if (input.value.trim()) clearError(input);
        });
      });
    });
  }

  function showError(input, message) {
    input.classList.add('error');
    let error = input.parentElement.querySelector('.form-error');
    if (!error) {
      error = document.createElement('span');
      error.className = 'form-error';
      input.parentElement.appendChild(error);
    }
    error.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('error');
    const error = input.parentElement.querySelector('.form-error');
    if (error) error.remove();
  }

  function showSuccessState(form) {
    const btn = form.querySelector('[type="submit"]');
    const successEl = form.querySelector('.form-success-msg');

    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent Successfully!';
      btn.style.background = '#27AE60';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }

    if (successEl) {
      successEl.style.display = 'flex';
      setTimeout(() => { successEl.style.display = 'none'; }, 3500);
    }

    form.querySelectorAll('input:not([type=submit]), textarea, select').forEach(el => {
      if (el.type !== 'checkbox' && el.type !== 'radio') el.value = '';
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ---- Password Toggle ---- */
  function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const wrap = btn.closest('.input-password-wrap');
        if (!wrap) return;
        const input = wrap.querySelector('input');
        if (!input) return;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isText ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
        }
      });
    });
  }

  /* ---- Step Connector Animation ---- */
  function initStepConnectors() {
    const connectors = document.querySelectorAll('.step-connector');
    if (!connectors.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    connectors.forEach(c => observer.observe(c));
  }

  /* ---- Lazy Image Loading ---- */
  function initLazyImages() {
    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imgs.forEach(img => observer.observe(img));
  }

  /* ---- Countdown Timer (Coming Soon) ---- */
  function initCountdown() {
    const el = document.getElementById('countdown-timer');
    if (!el) return;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    function update() {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        el.innerHTML = '<span>Launching Now!</span>';
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      const unit = (val, label) => `
        <div class="countdown-unit">
          <span class="countdown-num">${String(val).padStart(2, '0')}</span>
          <span class="countdown-label">${label}</span>
        </div>`;

      el.innerHTML = unit(days, 'Days') + unit(hours, 'Hours') + unit(mins, 'Min') + unit(secs, 'Sec');
    }

    update();
    setInterval(update, 1000);
  }

  /* ---- Scroll to top ---- */
  function initScrollToTop() {
    const btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.style.opacity = window.scrollY > 300 ? '1' : '0';
      btn.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Page Load Fade-in ---- */
  function initPageFadeIn() {
    document.body.classList.add('page-loaded');
  }

  /* ---- Init all ---- */
  function init() {
    initScrollReveal();
    initNavbarScroll();
    initHamburger();
    initMobileSubMenus();
    initActiveNavLinks();
    initCounterAnimation();
    initAccordions();
    initBeforeAfterSliders();
    initFormValidation();
    initPasswordToggles();
    initStepConnectors();
    initLazyImages();
    initCountdown();
    initScrollToTop();
    initPageFadeIn();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => AnimationsManager.init());
