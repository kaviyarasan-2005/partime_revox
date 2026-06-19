/* ============================================================
   MAIN.JS — Core Vanilla JavaScript
   Mobile Car Audio & Subwoofer Installation Service
   ============================================================ */

'use strict';

/* ── Theme System ─────────────────────────────────────────── */
const ThemeManager = {
  STORAGE_KEY: 'caraudio-theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = saved || system;
    this.apply(theme);

    // Listen for system changes when no explicit preference is stored
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const icon = btn.querySelector('.theme-icon');
      if (icon) icon.innerHTML = theme === 'dark' ? SvgIcons.sun() : SvgIcons.moon();
      // #33 — update mobile menu label text
      const mobileLabel = btn.querySelector('.mobile-theme-label');
      if (mobileLabel) mobileLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.STORAGE_KEY, next);
    this.apply(next);
  }
};

/* ── RTL Manager ───────────────────────────────────────────── */
const RTLManager = {
  STORAGE_KEY: 'caraudio-rtl',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    // Apply saved direction, fallback to current html dir attr, then ltr
    const dir = saved || document.documentElement.getAttribute('dir') || 'ltr';
    this.apply(dir);
  },

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    // #36 — Update every RTL toggle button to show current active mode label
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.setAttribute('aria-pressed', dir === 'rtl' ? 'true' : 'false');
      btn.setAttribute('title', dir === 'rtl' ? 'LTR' : 'RTL');
      // Update visible label span — show target mode, not current
      const label = btn.querySelector('.rtl-toggle-label');
      if (label) label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem(this.STORAGE_KEY, next);
    // Disable transitions briefly to prevent visual glitch during direction switch
    document.documentElement.classList.add('no-transition');
    this.apply(next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition');
      });
    });
  }
};

/* ── SVG Icons (inline) ───────────────────────────────────── */
const SvgIcons = {
  sun: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  moon: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  rtl:  () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10h-4a3 3 0 0 1 0-6h4"/><path d="M17 3v18"/><path d="M13 3v18"/></svg>`,
};

/* ── Sticky Navbar ────────────────────────────────────────── */
const Navbar = {
  init() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
};

/* ── Mobile Menu ──────────────────────────────────────────── */
const MobileMenu = {
  isOpen: false,

  init() {
    const toggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => this.toggle());

    // Close on overlay click (outside nav)
    document.addEventListener('click', (e) => {
      if (this.isOpen && !mobileNav.contains(e.target) && !toggle.contains(e.target)) {
        this.close();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Close when a nav link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.close());
    });
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    const toggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    toggle?.classList.add('active');
    mobileNav?.classList.add('open');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.isOpen = false;
    const toggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    toggle?.classList.remove('active');
    mobileNav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
};

/* ── Mobile Dropdown Toggles ──────────────────────────────── */
function initMobileDropdowns() {
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const menu = btn.nextElementSibling;
      btn.setAttribute('aria-expanded', String(!expanded));
      menu?.classList.toggle('open', !expanded);
    });
  });
}

/* ── Scroll Reveal ────────────────────────────────────────── */
const ScrollReveal = {
  observer: null,

  init() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!elements.length) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -48px 0px'
    });

    elements.forEach(el => this.observer.observe(el));
  }
};

/* ── Counter Animations ───────────────────────────────────── */
const CounterAnimation = {
  observer: null,

  init() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => this.observer.observe(el));
  },

  animate(el) {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration) || 2000;
    const decimals = target % 1 !== 0 ? 1 : 0;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = target * ease;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }
};

/* ── FAQ Accordion ────────────────────────────────────────── */
const FAQAccordion = {
  init() {
    const triggers = document.querySelectorAll('.faq-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => this.toggle(trigger));
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(trigger);
        }
      });
    });
  },

  toggle(trigger) {
    const item = trigger.closest('.faq-item');
    const body = item.querySelector('.faq-body');
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) this.close(openItem);
    });

    if (isOpen) {
      this.close(item);
    } else {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    }
  },

  close(item) {
    const body = item.querySelector('.faq-body');
    const trigger = item.querySelector('.faq-trigger');
    item.classList.remove('open');
    body.style.maxHeight = '0';
    trigger?.setAttribute('aria-expanded', 'false');
  }
};

/* ── Gallery Filter ───────────────────────────────────────── */
const GalleryFilter = {
  init() {
    const filterBtns = document.querySelectorAll('[data-filter-btn]');
    const galleryItems = document.querySelectorAll('[data-filter]');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filterBtn;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        galleryItems.forEach(item => {
          const category = item.dataset.filter;
          const show = filter === 'all' || category === filter;
          item.style.opacity = show ? '1' : '0';
          item.style.transform = show ? 'scale(1)' : 'scale(0.95)';
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }
};

/* ── Package Filter ───────────────────────────────────────── */
const PackageFilter = {
  init() {
    const btns = document.querySelectorAll('[data-pkg-filter]');
    const items = document.querySelectorAll('[data-package]');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.pkgFilter;
        items.forEach(item => {
          const show = filter === 'all' || item.dataset.package === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }
};

/* ── Before/After Comparison Slider ──────────────────────── */
const CompareSlider = {
  init() {
    document.querySelectorAll('.compare-slider').forEach(slider => {
      this.setup(slider);
    });
  },

  setup(slider) {
    const afterEl = slider.querySelector('.compare-after');
    const handle = slider.querySelector('.compare-handle');
    let isDragging = false;

    const setPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      const pct = pos * 100;
      if (afterEl) afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      if (handle) handle.style.left = pct + '%';
    };

    handle?.addEventListener('mousedown', () => { isDragging = true; });
    handle?.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });
    document.addEventListener('touchmove', (e) => {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });

    // Keyboard support
    handle?.addEventListener('keydown', (e) => {
      const rect = slider.getBoundingClientRect();
      const current = handle.offsetLeft / slider.offsetWidth;
      if (e.key === 'ArrowLeft') setPosition(rect.left + (current - 0.05) * rect.width);
      if (e.key === 'ArrowRight') setPosition(rect.left + (current + 0.05) * rect.width);
    });

    setPosition(slider.getBoundingClientRect().left + slider.offsetWidth * 0.5);
  }
};

/* ── Vehicle Compatibility Checker ───────────────────────── */
const VehicleChecker = {
  data: {
    Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tundra', 'Tacoma'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Ridgeline'],
    Ford: ['F-150', 'Mustang', 'Explorer', 'Edge', 'Bronco'],
    Chevrolet: ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Suburban'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5', 'M3', 'M5'],
    Mercedes: ['C-Class', 'E-Class', 'GLE', 'GLC', 'S-Class'],
    Audi: ['A4', 'A6', 'Q5', 'Q7', 'TT'],
    Lexus: ['ES', 'IS', 'RX', 'GX', 'LX'],
    Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y'],
    Jeep: ['Wrangler', 'Grand Cherokee', 'Compass', 'Renegade'],
    Ram: ['1500', '2500', '3500'],
    Nissan: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier'],
  },

  packages: {
    sedan:  ['Starter Package', 'Bass Upgrade Package', 'Premium Package'],
    suv:    ['Bass Upgrade Package', 'Premium Package', 'Competition Package'],
    truck:  ['Premium Package', 'Competition Package', 'Ultimate Package'],
    luxury: ['Premium Package', 'Competition Package', 'Ultimate Package'],
  },

  init() {
    const brandSelect = document.getElementById('checker-brand');
    const modelSelect = document.getElementById('checker-model');
    const typeSelect  = document.getElementById('checker-type');
    const btn         = document.getElementById('checker-btn');
    const result      = document.getElementById('checker-result');

    if (!brandSelect) return;

    brandSelect.addEventListener('change', () => {
      const brand = brandSelect.value;
      modelSelect.innerHTML = '<option value="">Select Model</option>';
      if (brand && this.data[brand]) {
        this.data[brand].forEach(m => {
          modelSelect.innerHTML += `<option value="${m}">${m}</option>`;
        });
      }
    });

    btn?.addEventListener('click', () => {
      if (!brandSelect.value || !modelSelect.value) {
        ToastManager.show('Please select a brand and model.', 'info');
        return;
      }
      const type = typeSelect?.value || 'sedan';
      const pkgs = this.packages[type] || this.packages.sedan;
      if (result) {
        result.classList.add('show');
        result.innerHTML = `
          <h4 style="font-family:var(--font-display);font-weight:700;color:var(--color-text);margin-bottom:var(--space-3);">
            Compatible Packages for ${brandSelect.value} ${modelSelect.value}
          </h4>
          <ul style="list-style:none;">
            ${pkgs.map(p => `<li style="padding:var(--space-2) 0;font-size:var(--text-sm);color:var(--color-text-secondary);display:flex;gap:var(--space-3);align-items:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>${p}</li>`).join('')}
          </ul>
          <a href="packages.html" class="btn btn-primary btn-sm" style="margin-top:var(--space-4);">View Packages</a>
        `;
      }
    });
  }
};

/* ── Form Validation ──────────────────────────────────────── */
const FormValidation = {
  init() {
    document.querySelectorAll('[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validate(form)) {
          this.handleSuccess(form);
        }
      });
    });
  },

  validate(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      this.clearError(field);
      if (!field.value.trim()) {
        this.showError(field, 'This field is required.');
        valid = false;
      } else if (field.type === 'email' && !this.isEmail(field.value)) {
        this.showError(field, 'Please enter a valid email address.');
        valid = false;
      } else if (field.type === 'tel' && !this.isPhone(field.value)) {
        this.showError(field, 'Please enter a valid phone number.');
        valid = false;
      } else {
        field.classList.add('success');
      }
    });
    return valid;
  },

  showError(field, msg) {
    field.classList.add('error');
    field.classList.remove('success');
    let err = field.parentNode.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      field.parentNode.appendChild(err);
    }
    err.textContent = msg;
    field.setAttribute('aria-invalid', 'true');
  },

  clearError(field) {
    field.classList.remove('error', 'success');
    field.removeAttribute('aria-invalid');
    const err = field.parentNode.querySelector('.form-error');
    if (err) err.remove();
  },

  isEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  isPhone: (v) => /^[\+]?[\d\s\-\(\)]{7,15}$/.test(v),

  handleSuccess(form) {
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      btn.classList.add('loading');
      btn.disabled = true;
    }
    setTimeout(() => {
      if (btn) {
        btn.classList.remove('loading');
        btn.disabled = false;
      }
      ToastManager.show('Message sent successfully!', 'success');
      form.reset();
      form.querySelectorAll('.form-control').forEach(f => f.classList.remove('success'));
    }, 1500);
  }
};

/* ── Toast Notifications ──────────────────────────────────── */
const ToastManager = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', title = '', duration = 4000) {
    const icons = {
      success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
      info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    };
    const defaultTitles = { success: 'Success', error: 'Error', info: 'Info' };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-body">
        <div class="toast-title">${title || defaultTitles[type]}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button onclick="this.closest('.toast').remove()" style="background:none;border:none;cursor:pointer;color:var(--color-text-muted);padding:4px;flex-shrink:0;" aria-label="Close notification">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    this.container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
};

/* ── Audio Visualizer (Canvas) ────────────────────────────── */
const AudioVisualizer = {
  canvas: null,
  ctx: null,
  bars: [],
  animId: null,

  init() {
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.setupBars();
    this.animate();

    window.addEventListener('resize', () => {
      this.resize();
      this.setupBars();
    });
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  },

  setupBars() {
    if (!this.canvas) return;
    const count = Math.floor(this.canvas.offsetWidth / 8);
    this.bars = Array.from({ length: count }, () => ({
      height: Math.random() * 60 + 10,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));
  },

  animate() {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.offsetWidth;
    const h = this.canvas.offsetHeight;
    const t = Date.now() / 1000;

    this.ctx.clearRect(0, 0, w, h);

    const barW = w / this.bars.length;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? '59, 142, 255' : '26, 111, 219';

    this.bars.forEach((bar, i) => {
      const bh = bar.height * (0.5 + 0.5 * Math.sin(t * bar.speed * 10 + bar.phase + i * 0.1));
      const x = i * barW;
      const y = h - bh;
      const alpha = 0.3 + 0.4 * (bh / 80);
      this.ctx.fillStyle = `rgba(${color}, ${alpha})`;
      this.ctx.fillRect(x + 1, y, barW - 2, bh);
    });

    this.animId = requestAnimationFrame(() => this.animate());
  }
};

/* ── Modal System ─────────────────────────────────────────── */
const ModalManager = {
  init() {
    // Open buttons
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.modalOpen);
        if (modal) this.open(modal);
      });
    });

    // Close buttons
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) this.close(modal);
      });
    });

    // Click outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close(overlay);
      });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => this.close(m));
      }
    });
  },

  open(overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstFocusable = overlay.querySelector('button, input, select, textarea, a[href]');
    firstFocusable?.focus();
    overlay.setAttribute('aria-hidden', 'false');
  },

  close(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    overlay.setAttribute('aria-hidden', 'true');
  }
};

/* ── Tabs ─────────────────────────────────────────────────── */
const TabSystem = {
  init() {
    document.querySelectorAll('[data-tabs]').forEach(container => {
      const btns = container.querySelectorAll('.tab-btn');
      const contents = container.querySelectorAll('.tab-content');

      btns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          contents[i]?.classList.add('active');
        });
      });
    });
  }
};

/* ── Skeleton Loading Simulation ──────────────────────────── */
const SkeletonLoader = {
  init() {
    document.querySelectorAll('[data-skeleton]').forEach(container => {
      const delay = parseInt(container.dataset.skeleton) || 1500;
      setTimeout(() => {
        container.querySelectorAll('.skeleton').forEach(s => {
          s.style.transition = 'opacity 0.4s';
          s.style.opacity = '0';
          setTimeout(() => s.remove(), 400);
        });
        container.querySelectorAll('[data-skeleton-content]').forEach(c => {
          c.style.display = '';
        });
      }, delay);
    });
  }
};

/* ── Smooth Scroll ────────────────────────────────────────── */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
          const top = el.getBoundingClientRect().top + window.scrollY - offset - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }
};

/* ── Image Lazy Loading ───────────────────────────────────── */
const LazyLoad = {
  init() {
    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imgs.forEach(img => observer.observe(img));
  }
};

/* ── Active Nav Link ───────────────────────────────────────────── */
const ActiveNav = {
  init() {
    // #18 — highlight active nav/mobile links; also mark dropdown parent if a child matches
    const fullPath = window.location.pathname;
    const page    = fullPath.split('/').pop() || 'index.html';

    // 1. Mark exact .nav-link and .mobile-nav-link matches
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      // Strip hash and query for comparison
      const hrefPage = href.split('#')[0].split('?')[0].split('/').pop();
      if (hrefPage && (hrefPage === page || href.endsWith(page))) {
        link.classList.add('active');
      }
    });

    // 2. If a dropdown item is active, also mark its parent .nav-link as active
    document.querySelectorAll('.nav-dropdown-item').forEach(item => {
      const href = item.getAttribute('href');
      if (!href || href === '#') return;
      const hrefPage = href.split('#')[0].split('?')[0].split('/').pop();
      if (hrefPage && (hrefPage === page || href.endsWith(page))) {
        item.classList.add('active');
        // Walk up to find the parent .nav-dropdown > .nav-link
        const dropdown = item.closest('.nav-dropdown');
        if (dropdown) {
          const parentLink = dropdown.querySelector(':scope > .nav-link');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });
  }
};

/* ── Newsletter Form ──────────────────────────────────────── */
const Newsletter = {
  init() {
    document.querySelectorAll('[data-newsletter]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        if (!email?.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          ToastManager.show('Please enter a valid email address.', 'error');
          return;
        }
        const btn = form.querySelector('button');
        if (btn) { btn.classList.add('loading'); btn.disabled = true; }
        setTimeout(() => {
          if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
          ToastManager.show('You\'ve successfully subscribed!', 'success', 'Subscribed!');
          form.reset();
        }, 1200);
      });
    });
  }
};

/* ── Notification Bell ────────────────────────────────────── */
const NotificationBell = {
  init() {
    const btn = document.getElementById('notification-btn');
    const panel = document.getElementById('notification-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.getAttribute('aria-hidden') === 'false';
      panel.setAttribute('aria-hidden', open ? 'true' : 'false');
      panel.style.display = open ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !panel.contains(e.target)) {
        panel.setAttribute('aria-hidden', 'true');
        panel.style.display = 'none';
      }
    });
  }
};

/* ── Booking Form Steps ───────────────────────────────────── */
const BookingForm = {
  current: 1,

  init() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    this.update();

    form.querySelectorAll('[data-next-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentStep = form.querySelector(`[data-step="${this.current}"]`);
        const inputs = currentStep?.querySelectorAll('[required]');
        let valid = true;
        inputs?.forEach(input => {
          if (!input.value.trim()) {
            input.classList.add('error');
            valid = false;
          } else {
            input.classList.remove('error');
          }
        });
        if (valid && this.current < 4) {
          this.current++;
          this.update();
        }
      });
    });

    form.querySelectorAll('[data-prev-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.current > 1) { this.current--; this.update(); }
      });
    });
  },

  update() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    form.querySelectorAll('[data-step]').forEach(step => {
      step.style.display = parseInt(step.dataset.step) === this.current ? '' : 'none';
    });
    form.querySelectorAll('[data-step-indicator]').forEach(ind => {
      const n = parseInt(ind.dataset.stepIndicator);
      ind.classList.toggle('active', n === this.current);
      ind.classList.toggle('done', n < this.current);
    });
  }
};

/* ── Dashboard Sidebar (mobile + desktop toggle) ─────────── */
const DashboardSidebar = {
  overlay: null,

  init() {
    const btn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const layout  = document.querySelector('.dashboard-layout');
    if (!btn || !sidebar || !layout) return;

    // Replace the inline onclick so we control behaviour fully
    btn.removeAttribute('onclick');
    btn.addEventListener('click', () => this.toggle());

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMobile();
    });
  },

  isMobile() {
    return window.innerWidth <= 1024;
  },

  toggle() {
    if (this.isMobile()) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar?.classList.contains('open')) {
        this.closeMobile();
      } else {
        this.openMobile();
      }
    } else {
      // Desktop: collapse/expand
      const layout = document.querySelector('.dashboard-layout');
      layout?.classList.toggle('sidebar-collapsed');
    }
  },

  openMobile() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Create backdrop
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:var(--z-sticky,40)',
        'background:rgba(0,0,0,0.45)', 'backdrop-filter:blur(2px)',
        'transition:opacity 0.25s'
      ].join(';');
      this.overlay.addEventListener('click', () => this.closeMobile());
      document.body.appendChild(this.overlay);
      requestAnimationFrame(() => { this.overlay.style.opacity = '1'; });
    }
  },

  closeMobile() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.remove('open');
    document.body.style.overflow = '';
    if (this.overlay) {
      this.overlay.style.opacity = '0';
      setTimeout(() => {
        this.overlay?.remove();
        this.overlay = null;
      }, 250);
    }
  }
};

/* ── Saved Favorites ──────────────────────────────────────── */
const Favorites = {
  KEY: 'caraudio-favorites',

  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  toggle(id) {
    const favs = this.get();
    const idx = favs.indexOf(id);
    if (idx >= 0) { favs.splice(idx, 1); }
    else { favs.push(id); }
    localStorage.setItem(this.KEY, JSON.stringify(favs));
    return idx < 0;
  },

  init() {
    document.querySelectorAll('[data-favorite]').forEach(btn => {
      const id = btn.dataset.favorite;
      const favs = this.get();
      if (favs.includes(id)) btn.classList.add('active');

      btn.addEventListener('click', () => {
        const added = this.toggle(id);
        btn.classList.toggle('active', added);
        ToastManager.show(added ? 'Added to favorites!' : 'Removed from favorites.', added ? 'success' : 'info');
      });
    });
  }
};

/* ── Audio Upgrade Calculator ─────────────────────────────── */
const AudioCalculator = {
  prices: {
    subwoofer:    { basic: 199, premium: 349, competition: 599 },
    amplifier:    { basic: 149, premium: 299, competition: 499 },
    speakers:     { basic: 99,  premium: 199, competition: 349 },
    dsp:          { basic: 0,   premium: 199, competition: 299 },
    soundproofing:{ basic: 99,  premium: 199, competition: 299 },
    installation: 99,
    tuning:       { basic: 0,   premium: 79,  competition: 149 },
  },

  init() {
    const calc = document.getElementById('audio-calculator');
    if (!calc) return;

    calc.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('change', () => this.calculate(calc));
    });
    this.calculate(calc);
  },

  calculate(calc) {
    let total = this.prices.installation;
    const tier = calc.querySelector('[name="tier"]')?.value || 'basic';

    ['subwoofer', 'amplifier', 'speakers', 'dsp', 'soundproofing', 'tuning'].forEach(item => {
      const checkbox = calc.querySelector(`[name="${item}"]`);
      if (checkbox?.checked) {
        const p = this.prices[item];
        total += typeof p === 'object' ? p[tier] || 0 : p;
      }
    });

    const display = calc.querySelector('[data-calc-total]');
    if (display) display.textContent = '$' + total.toLocaleString();
  }
};

/* ── Initialize Everything ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  MobileMenu.init();
  initMobileDropdowns();
  ScrollReveal.init();
  CounterAnimation.init();
  FAQAccordion.init();
  GalleryFilter.init();
  PackageFilter.init();
  CompareSlider.init();
  VehicleChecker.init();
  FormValidation.init();
  ToastManager.init();
  ModalManager.init();
  TabSystem.init();
  SkeletonLoader.init();
  SmoothScroll.init();
  LazyLoad.init();
  ActiveNav.init();
  Newsletter.init();
  NotificationBell.init();
  BookingForm.init();
  Favorites.init();
  AudioCalculator.init();
  AudioVisualizer.init();
  DashboardSidebar.init();

  // Wire theme toggle
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => ThemeManager.toggle());
  });

  // Wire RTL toggle
  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => RTLManager.toggle());
  });

  // Animate progress bars
  const pbObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width || '0%';
        pbObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.progress-bar[data-width]').forEach(bar => {
    bar.style.width = '0%';
    pbObserver.observe(bar);
  });
});

/* ── Export for use in other modules ─────────────────────── */
window.CarAudio = {
  ThemeManager,
  RTLManager,
  ToastManager,
  ModalManager,
  Favorites,
  DashboardSidebar,
};
