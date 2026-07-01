/* ============================================================
   AquaShine Marine — Main JavaScript
   Handles: Navbar, Dark/Light Mode, RTL, Scroll Animations,
   Number Counters, Toast System, Mobile Menu, Dropdowns,
   Accordions, Filters, Lightbox, Countdown Timer, Charts init
   ============================================================ */

'use strict';

/* ── DOM Ready ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initMobileMenu();
  initRTL();
  initActiveNavLink();
  initScrollAnimations();
  initCounters();
  initAccordions();
  initScrollTop();
  initDropdowns();
  initPortfolioFilter();
  initLightbox();
  initForms();
  initCountdown();
  initBlogFilter();
  initDashboardSidebar();
  initBASliders();
});

/* ================================================================
   THEME (Dark / Light Mode)
   ================================================================ */
function initTheme() {
  const html  = document.documentElement;
  const btn   = document.getElementById('theme-toggle');
  const icon  = document.getElementById('theme-icon');
  const saved = localStorage.getItem('aquashine-theme');

  // Default: dark
  if (saved === 'light') {
    html.classList.remove('dark');
  } else {
    html.classList.add('dark');
  }

  updateThemeIcon();

  if (btn) {
    btn.addEventListener('click', () => {
      html.classList.toggle('dark');
      localStorage.setItem('aquashine-theme', html.classList.contains('dark') ? 'dark' : 'light');
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!icon) return;
    if (html.classList.contains('dark')) {
      icon.className = 'fas fa-sun';
      if (btn) btn.title = 'Switch to Light Mode';
    } else {
      icon.className = 'fas fa-moon';
      if (btn) btn.title = 'Switch to Dark Mode';
    }
  }
}

/* ================================================================
   RTL / LTR TOGGLE
   ================================================================ */
function initRTL() {
  const btn = document.getElementById('rtl-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('aquashine-dir') || 'ltr';
  document.documentElement.setAttribute('dir', saved);
  btn.textContent = saved === 'ltr' ? 'RTL' : 'LTR';

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('dir');
    const next = current === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', next);
    localStorage.setItem('aquashine-dir', next);
    btn.textContent = next === 'ltr' ? 'RTL' : 'LTR';
  });
}

/* ================================================================
   ACTIVE NAVIGATION LINK HIGHLIGHT
   ================================================================ */
function initActiveNavLink() {
  const path = window.location.pathname;
  let page = path.split('/').pop() || 'index.html';
  if (page === '') {
    page = 'index.html';
  }

  // Highlight desktop navbar links
  const desktopLinks = document.querySelectorAll('#navbar a.nav-link');
  desktopLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
    }
  });

  // Highlight dropdown panel links
  const dropdownLinks = document.querySelectorAll('.dropdown-panel a.dropdown-link');
  dropdownLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
      
      // Also highlight parent dropdown button
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        const parentBtn = parentDropdown.querySelector('button.nav-link');
        if (parentBtn) {
          parentBtn.classList.add('active-parent');
        }
      }
    }
  });

  // Highlight mobile menu links
  const mobileLinks = document.querySelectorAll('#mobile-menu a.mobile-link');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
    }
  });
}

/* ================================================================
   NAVBAR — Sticky + Shrink on Scroll
   ================================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const update = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ================================================================
   MOBILE MENU
   ================================================================ */
function initMobileMenu() {
  const btn   = document.getElementById('mobile-menu-btn');
  const menu  = document.getElementById('mobile-menu');
  const icon  = document.getElementById('menu-icon');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    if (icon) {
      icon.className = menu.classList.contains('hidden') ? 'fas fa-bars' : 'fas fa-times';
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
      if (icon) icon.className = 'fas fa-bars';
    }
  });
}

/* ================================================================
   DROPDOWNS — Click fallback for mobile / touch
   ================================================================ */
function initDropdowns() {
  document.querySelectorAll('.nav-dropdown > button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const panel = btn.nextElementSibling;
      if (!panel) return;

      const isOpen = panel.classList.contains('opacity-100');

      // Close all
      document.querySelectorAll('.dropdown-panel').forEach(p => {
        p.classList.remove('opacity-100');
        p.classList.add('opacity-0', 'invisible');
        p.style.transform = 'translateY(8px)';
      });

      if (!isOpen) {
        panel.classList.remove('opacity-0', 'invisible');
        panel.classList.add('opacity-100');
        panel.style.transform = 'translateY(0)';
      }
      e.stopPropagation();
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-panel').forEach(p => {
      p.classList.remove('opacity-100');
      p.classList.add('opacity-0', 'invisible');
      p.style.transform = 'translateY(8px)';
    });
  });
}

/* ================================================================
   SCROLL ANIMATIONS — IntersectionObserver
   ================================================================ */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .zoom-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ================================================================
   NUMBER COUNTERS
   ================================================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const animate = (el, target, duration = 2000, prefix = '', suffix = '') => {
    const start = performance.now();
    const update = (now) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const val = Math.floor(ease(elapsed) * target);
      el.textContent = prefix + val.toLocaleString() + suffix;
      if (elapsed < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target   = parseInt(el.dataset.counter) || 0;
        const suffix   = el.dataset.suffix  || '';
        const prefix   = el.dataset.prefix  || '';
        const duration = parseInt(el.dataset.duration) || 2000;
        animate(el, target, duration, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ================================================================
   TOAST NOTIFICATIONS
   ================================================================ */
window.showToast = function(message, type = 'success', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fas fa-check-circle',
    error:   'fas fa-times-circle',
    warning: 'fas fa-exclamation-triangle',
    info:    'fas fa-info-circle',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="toast-icon ${icons[type] || icons.info}"></i>
    <span>${message}</span>
    <button class="toast-close" aria-label="Close"><i class="fas fa-times"></i></button>
  `;

  container.appendChild(toast);

  const close = () => {
    toast.classList.add('exiting');
    setTimeout(() => toast.remove(), 310);
  };

  toast.querySelector('.toast-close').addEventListener('click', close);
  setTimeout(close, duration);
};

/* ================================================================
   ACCORDIONS
   ================================================================ */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body   = header.nextElementSibling;
      const isOpen = body && body.classList.contains('open');

      // Close all siblings
      const parent = header.closest('.accordion-group') || header.closest('.accordions') || document;
      parent.querySelectorAll('.accordion-header').forEach(h => {
        h.classList.remove('active');
        const b = h.nextElementSibling;
        if (b) b.classList.remove('open');
      });

      if (!isOpen && body) {
        header.classList.add('active');
        body.classList.add('open');
      }
    });
  });
}

/* ================================================================
   SCROLL TO TOP
   ================================================================ */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ================================================================
   PORTFOLIO FILTER
   ================================================================ */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  const items = document.querySelectorAll('[data-filter-item]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filterBtn;

      items.forEach(item => {
        const cat = item.dataset.filterItem;
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

/* ================================================================
   LIGHTBOX
   ================================================================ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');
  if (!lightbox || !lbImg) return;

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      lbImg.src = el.dataset.lightbox;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  if (lbClose) lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ================================================================
   FORMS — Mock Submit with Toast
   ================================================================ */
function initForms() {
  document.querySelectorAll('[data-mock-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          showToast('✓ Message sent successfully! We\'ll respond within 24 hours.', 'success');
          form.reset();
        }, 1800);
      }
    });
  });

  // Auth forms
  document.querySelectorAll('[data-auth-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const isLogin = form.dataset.authForm === 'login';
      if (btn) {
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait...';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          if (isLogin) {
            showToast('Welcome back! Redirecting to dashboard...', 'success');
            setTimeout(() => { window.location.href = 'user-dashboard.html'; }, 1500);
          } else {
            showToast('Account created! Redirecting...', 'success');
            setTimeout(() => { window.location.href = 'user-dashboard.html'; }, 1500);
          }
        }, 1800);
      }
    });
  });
}

/* ================================================================
   COUNTDOWN TIMER (Coming Soon Page)
   ================================================================ */
function initCountdown() {
  const el = document.getElementById('countdown-target');
  if (!el) return;

  const targetDate = new Date(el.dataset.target || '2025-12-31T00:00:00');

  const update = () => {
    const now  = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent    = '00';
      document.getElementById('cd-hours').textContent   = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-minutes');
    const sEl = document.getElementById('cd-seconds');
    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(minutes);
    if (sEl) sEl.textContent = pad(seconds);
  };

  update();
  setInterval(update, 1000);
}

/* ================================================================
   BLOG FILTER
   ================================================================ */
function initBlogFilter() {
  const btns  = document.querySelectorAll('[data-blog-filter]');
  const cards = document.querySelectorAll('[data-blog-cat]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.blogFilter;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.blogCat === cat;
        card.style.opacity = match ? '1' : '0';
        card.style.transform = match ? 'scale(1)' : 'scale(0.95)';
        setTimeout(() => { card.style.display = match ? '' : 'none'; }, match ? 0 : 300);
      });
    });
  });
}

function initDashboardSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar   = document.getElementById('dash-sidebar');
  const overlay   = document.getElementById('sidebar-overlay');
  const main      = document.querySelector('.dashboard-main');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    if (window.innerWidth <= 1024) {
      // Mobile logic: slide-out drawer toggle
      sidebar.classList.toggle('open');
      if (overlay) {
        overlay.classList.toggle('hidden');
      }
      if (sidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    } else {
      // Desktop logic: collapse / expand sidebar
      sidebar.classList.toggle('collapsed');
      if (main) {
        main.classList.toggle('collapsed');
      }
      localStorage.setItem('aquashine-sidebar-collapsed', sidebar.classList.contains('collapsed') ? 'true' : 'false');
    }
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  // Restore collapsed state on desktop load
  if (window.innerWidth > 1024) {
    const saved = localStorage.getItem('aquashine-sidebar-collapsed');
    if (saved === 'true') {
      sidebar.classList.add('collapsed');
      if (main) {
        main.classList.add('collapsed');
      }
    }
  }
}

/* ================================================================
   TAB SWITCHER (generic)
   ================================================================ */
window.initTabs = function(containerSel) {
  const container = document.querySelector(containerSel);
  if (!container) return;

  const tabs    = container.querySelectorAll('[data-tab]');
  const panels  = container.querySelectorAll('[data-tab-panel]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach(p => {
        p.classList.toggle('hidden', p.dataset.tabPanel !== target);
      });
    });
  });
};

/* ================================================================
   TESTIMONIAL CAROUSEL (simple auto-scroll)
   ================================================================ */
(function initTestimonialCarousel() {
  const track = document.getElementById('testimonial-track');
  if (!track) return;

  let pos = 0;
  const cards = track.children;
  const total = cards.length;
  if (total < 2) return;

  let autoPlay = setInterval(next, 4500);

  function next() {
    pos = (pos + 1) % total;
    scroll();
  }
  function scroll() {
    const w = track.querySelector('.testimonial-card')?.offsetWidth || 340;
    const gap = 24;
    track.style.transform = `translateX(-${pos * (w + gap)}px)`;
  }

  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    pos = (pos - 1 + total) % total;
    scroll();
    clearInterval(autoPlay);
    autoPlay = setInterval(next, 4500);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    pos = (pos + 1) % total;
    scroll();
    clearInterval(autoPlay);
    autoPlay = setInterval(next, 4500);
  });
})();

/* ================================================================
   PROGRESS BARS — animate on scroll
   ================================================================ */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar-fill[data-width]');
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => { b.style.width = '0'; obs.observe(b); });
})();

/* ================================================================
   BEFORE / AFTER COMPARISON SLIDERS
   ================================================================ */
function initBASliders() {
  const sliders = document.querySelectorAll('.ba-slider');
  if (!sliders.length) return;

  sliders.forEach(slider => {
    const clip   = slider.querySelector('.ba-before-clip');
    const handle = slider.querySelector('.ba-handle');
    if (!clip || !handle) return;

    let dragging = false;

    function updatePosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const pct = (x / rect.width) * 100;
      clip.style.width = pct + '%';
      handle.style.left = pct + '%';
    }

    // Mouse events
    slider.addEventListener('mousedown', e => {
      e.preventDefault();
      dragging = true;
      updatePosition(e.clientX);
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      e.preventDefault();
      updatePosition(e.clientX);
    });
    document.addEventListener('mouseup', () => { dragging = false; });

    // Touch events
    slider.addEventListener('touchstart', e => {
      dragging = true;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchmove', e => {
      if (!dragging) return;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', () => { dragging = false; });
  });
}
