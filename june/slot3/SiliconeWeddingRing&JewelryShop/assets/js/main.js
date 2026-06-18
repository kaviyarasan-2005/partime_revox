/**
 * BAND — Main JavaScript
 * Handles: Theme, RTL, Navigation, Scroll Reveal, Animations
 */

'use strict';

// ============================================================
// THEME SYSTEM
// ============================================================
const ThemeManager = {
  STORAGE_KEY: 'band-theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = saved || systemPref;
    this.apply(theme);
    this.updateToggleIcons(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    this.updateToggleIcons(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  },

  updateToggleIcons(theme) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
};

// ============================================================
// RTL SYSTEM
// ============================================================
const RTLManager = {
  STORAGE_KEY: 'band-dir',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'ltr';
    this.apply(saved);
    this.updateToggleText(saved);
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'ltr' ? 'rtl' : 'ltr';
    this.apply(next);
    this.updateToggleText(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
  },

  updateToggleText(dir) {
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      btn.setAttribute('aria-label', dir === 'ltr' ? 'Switch to RTL layout' : 'Switch to LTR layout');
    });
  }
};

// ============================================================
// NAVIGATION
// ============================================================
const NavManager = {
  hamburgerBtn: null,
  mobileDrawer: null,
  navbar: null,
  ticking: false,
  lastToggleTime: 0,

  init() {
    this.hamburgerBtn = document.querySelector('.hamburger-btn');
    this.mobileDrawer = document.querySelector('.mobile-drawer');
    this.navbar = document.querySelector('.navbar');

    if (this.hamburgerBtn) {
      this.hamburgerBtn.addEventListener('click', (e) => {
        if (e.target !== this.hamburgerBtn && !this.hamburgerBtn.contains(e.target)) return;
        e.stopPropagation();
        this.toggleDrawer();
      });
    }

    // Track RTL/theme toggle clicks to debounce hamburger
    document.querySelectorAll('.rtl-toggle-btn, .theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.lastToggleTime = Date.now();
      });
    });

    // Close drawer on link click
    if (this.mobileDrawer) {
      this.mobileDrawer.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', (e) => {
          if (!el.classList.contains('mobile-util-btn') && !el.classList.contains('rtl-toggle-btn') && !el.classList.contains('theme-toggle-btn') && !el.classList.contains('mobile-nav-toggle')) {
            this.closeDrawer();
          }
        });
      });
    }

    // Mobile dropdown toggles
    document.querySelectorAll('.mobile-nav-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.nextElementSibling;
        if (!sub) return;
        const isOpen = sub.classList.contains('open');
        // Close all other open submenus
        document.querySelectorAll('.mobile-nav-sub.open').forEach(s => {
          if (s !== sub) {
            s.classList.remove('open');
            s.previousElementSibling?.classList.remove('active');
          }
        });
        sub.classList.toggle('open', !isOpen);
        btn.classList.toggle('active', !isOpen);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        this.mobileDrawer &&
        this.hamburgerBtn &&
        !this.mobileDrawer.contains(e.target) &&
        !this.hamburgerBtn.contains(e.target)
      ) {
        this.closeDrawer();
      }
    });

    // Set active nav link
    this.setActiveLink();

    // Scroll shadow for navbar
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
  },

  toggleDrawer() {
    if (Date.now() - this.lastToggleTime < 500) return;
    const isOpen = this.mobileDrawer && this.mobileDrawer.classList.contains('open');
    isOpen ? this.closeDrawer() : this.openDrawer();
  },

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      if (this.navbar) {
        this.navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
      }
      const topBar = document.querySelector('.page-top-bar');
      if (topBar) {
        topBar.classList.toggle('page-top-bar-scrolled', window.scrollY > 20);
      }
      this.ticking = false;
    });
  },

  openDrawer() {
    if (!this.mobileDrawer || !this.hamburgerBtn) return;
    this.mobileDrawer.classList.add('open');
    this.hamburgerBtn.classList.add('active');
    this.hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  },

  closeDrawer() {
    if (!this.mobileDrawer || !this.hamburgerBtn) return;
    this.mobileDrawer.classList.remove('open');
    this.hamburgerBtn.classList.remove('active');
    this.hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  },

  setActiveLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
      if (link.getAttribute('data-page') === current) {
        link.classList.add('active');
      }
    });
  }
};

// ============================================================
// SCROLL REVEAL
// ============================================================
const ScrollReveal = {
  observer: null,

  init() {
    const options = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.reveal').forEach(el => {
      this.observer.observe(el);
    });
  }
};

// ============================================================
// ACCORDION
// ============================================================
const AccordionManager = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.accordion-item.open').forEach(openItem => {
          openItem.classList.remove('open');
        });

        // Open clicked if it was closed
        if (!isOpen) item.classList.add('open');
      });
    });
  }
};

// ============================================================
// FORM VALIDATION
// ============================================================
const FormValidator = {
  init() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validate(form)) {
          this.handleSuccess(form);
        }
      });

      // Real-time validation
      form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            this.validateField(input);
          }
        });
      });
    });
  },

  validate(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!this.validateField(field)) valid = false;
    });
    return valid;
  },

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let error = '';

    if (field.hasAttribute('required') && !value) {
      error = 'This field is required.';
    } else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (type === 'password' && value && value.length < 8) {
      error = 'Password must be at least 8 characters.';
    } else if (field.name === 'confirm_password') {
      const passField = field.form.querySelector('[name="password"]');
      if (passField && value !== passField.value) {
        error = 'Passwords do not match.';
      }
    }

    const errEl = field.closest('.form-group')?.querySelector('.field-error');
    if (error) {
      field.classList.add('error');
      if (errEl) {
        errEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${error}`;
        errEl.classList.add('visible');
      }
      return false;
    } else {
      field.classList.remove('error');
      if (errEl) errEl.classList.remove('visible');
      return true;
    }
  },

  handleSuccess(form) {
    const successEl = form.querySelector('.form-success');
    if (successEl) {
      form.querySelectorAll('.form-group, .btn').forEach(el => {
        el.style.display = 'none';
      });
      successEl.style.display = 'flex';
    }
  }
};

// ============================================================
// PASSWORD TOGGLE
// ============================================================
const PasswordToggle = {
  init() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.input-wrapper').querySelector('input');
        if (!input) return;
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        }
      });
    });
  }
};

// ============================================================
// FILTER BAR
// ============================================================
const FilterBar = {
  init() {
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', function () {
        if (this.querySelector('.remove')) return; // active pill remove
        const group = this.closest('.filter-group');
        if (group) {
          group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        }
        this.classList.add('active');
      });

      const removeBtn = pill.querySelector('.remove');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          pill.remove();
        });
      }
    });

    document.querySelectorAll('.clear-filters').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      });
    });
  }
};

// ============================================================
// BUNDLE BUILDER
// ============================================================
const BundleBuilder = {
  selectedRings: [],
  DISCOUNT_TIERS: [
    { min: 2, max: 2, discount: 0.1,  label: '10% OFF — Keep going!' },
    { min: 3, max: 3, discount: 0.15, label: '15% OFF — Almost there!' },
    { min: 4, max: Infinity, discount: 0.2, label: '20% OFF — Max savings!' },
  ],
  BASE_PRICE: 19.99,

  init() {
    const container = document.querySelector('.bundle-builder');
    if (!container) return;

    container.querySelectorAll('.builder-ring-item').forEach(item => {
      item.addEventListener('click', () => this.toggleRing(item));
    });

    this.updateUI();
  },

  toggleRing(item) {
    const id = item.dataset.ringId;
    if (!id) return;

    if (item.classList.contains('selected')) {
      item.classList.remove('selected');
      this.selectedRings = this.selectedRings.filter(r => r !== id);
    } else {
      item.classList.add('selected');
      this.selectedRings.push(id);
    }

    this.updateUI();
  },

  getDiscount() {
    const count = this.selectedRings.length;
    if (count < 2) return { discount: 0, label: 'Add 2+ rings to unlock savings' };
    const tier = this.DISCOUNT_TIERS.slice().reverse().find(t => count >= t.min) ||
                 this.DISCOUNT_TIERS[this.DISCOUNT_TIERS.length - 1];
    return tier ? { discount: tier.discount, label: tier.label } : { discount: 0, label: '' };
  },

  updateUI() {
    const count = this.selectedRings.length;
    const { discount, label } = this.getDiscount();
    const subtotal = count * this.BASE_PRICE;
    const savings = subtotal * discount;
    const total = subtotal - savings;
    const progress = Math.min((count / 4) * 100, 100);

    const countEl = document.querySelector('.bundle-ring-count');
    const discountEl = document.querySelector('.bundle-discount-label');
    const progressEl = document.querySelector('.bundle-progress-fill');
    const subtotalEl = document.querySelector('.bundle-subtotal');
    const savingsEl = document.querySelector('.bundle-savings-amount');
    const totalEl = document.querySelector('.bundle-total');
    const countLabelEl = document.querySelector('.bundle-count-label');

    if (countEl) countEl.textContent = count;
    if (discountEl) discountEl.textContent = label;
    if (progressEl) progressEl.style.width = `${progress}%`;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (savingsEl) savingsEl.textContent = `-$${savings.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (countLabelEl) countLabelEl.textContent = `${count} ring${count !== 1 ? 's' : ''} selected`;

    // Update selected ring thumbnails
    const thumbsContainer = document.querySelector('.bundle-selected-rings');
    if (thumbsContainer) {
      thumbsContainer.innerHTML = '';
      document.querySelectorAll('.builder-ring-item.selected').forEach(item => {
        const img = item.querySelector('.builder-ring-img');
        if (img) {
          const thumb = document.createElement('img');
          thumb.src = img.src;
          thumb.alt = 'Selected ring';
          thumb.className = 'bundle-selected-ring-thumb';
          thumbsContainer.appendChild(thumb);
        }
      });
    }
  }
};

// ============================================================
// COUNTDOWN TIMER (Coming Soon Page)
// ============================================================
const CountdownTimer = {
  init() {
    const target = document.querySelector('[data-countdown]');
    if (!target) return;

    const targetDate = new Date(target.getAttribute('data-countdown'));

    const update = () => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        target.innerHTML = '<span class="countdown-item"><span class="countdown-num">0</span><span class="countdown-label">Days</span></span>';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const dEl = target.querySelector('[data-unit="days"]');
      const hEl = target.querySelector('[data-unit="hours"]');
      const mEl = target.querySelector('[data-unit="mins"]');
      const sEl = target.querySelector('[data-unit="secs"]');

      if (dEl) dEl.textContent = String(d).padStart(2, '0');
      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');
    };

    update();
    setInterval(update, 1000);
  }
};

// ============================================================
// PAGE LOAD ANIMATION
// ============================================================
const PageLoader = {
  init() {
    document.body.classList.add('page-fade');
  }
};

// ============================================================
// INIT ALL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  NavManager.init();
  ScrollReveal.init();
  AccordionManager.init();
  FormValidator.init();
  PasswordToggle.init();
  FilterBar.init();
  BundleBuilder.init();
  CountdownTimer.init();
  PageLoader.init();

  // Expose globals for inline handlers
  window.ThemeManager = ThemeManager;
  window.RTLManager = RTLManager;
});
