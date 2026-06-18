/**
 * Navbar Manager
 * Mobile Ceramic Coating & Paint Protection
 * Handles hamburger, dropdowns, scroll behavior
 */

(function () {
  'use strict';

  // ── Scroll Effect ─────────────────────────────────────────
  function initScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ── Hamburger / Mobile Menu ───────────────────────────────
  function initHamburger() {
    const hamburger   = document.querySelector('.hamburger');
    const mobileMenu  = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      hamburger.classList.add('open');
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      if (hamburger.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Close on backdrop click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Update on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) closeMenu();
    });
  }

  // ── Desktop Dropdowns ─────────────────────────────────────
  function initDropdowns() {
    const navItems = document.querySelectorAll('.navbar-nav .nav-item');

    navItems.forEach(item => {
      const toggle  = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.dropdown-menu');
      if (!toggle || !dropdown) return;

      let hoverTimer;

      // Mouse enter
      item.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        navItems.forEach(i => i !== item && i.classList.remove('open'));
        item.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      });

      // Mouse leave
      item.addEventListener('mouseleave', () => {
        hoverTimer = setTimeout(() => {
          item.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }, 150);
      });

      // Keyboard support
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isOpen = item.classList.toggle('open');
          toggle.setAttribute('aria-expanded', String(isOpen));
        }
        if (e.key === 'Escape') {
          item.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    });

    // Close all on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item')) {
        navItems.forEach(item => {
          item.classList.remove('open');
          const toggle = item.querySelector('.nav-link');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // ── Active Link Highlighting ──────────────────────────────
  function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const fileName    = currentPath.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link').forEach(link => {
      const href     = link.getAttribute('href') || '';
      const hrefFile = href.split('/').pop();

      if (hrefFile === fileName || (fileName === '' && hrefFile === 'index.html')) {
        link.classList.add('active');
        // Also mark parent nav item
        const parentItem = link.closest('.nav-item');
        if (parentItem) {
          const parentLink = parentItem.querySelector(':scope > .nav-link');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });
  }

  // ── Initialize ────────────────────────────────────────────
  function init() {
    initScrollEffect();
    initHamburger();
    initDropdowns();
    highlightActiveLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
