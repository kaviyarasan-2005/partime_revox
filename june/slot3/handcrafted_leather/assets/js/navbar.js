/**
 * navbar.js — Sticky Header, Mobile Menu, Dropdown Logic
 * Handcrafted Leather Journal & Sketchbook Bindery
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    var navbar    = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var navMenu   = document.getElementById('navMenu');
    var overlay   = document.getElementById('navOverlay');

    /* ── Sticky / Scrolled Class ── */
    if (navbar) {
      var scrollThreshold = 50;

      function handleNavbarScroll() {
        if (window.scrollY > scrollThreshold) {
          navbar.classList.add('is-scrolled');
        } else {
          navbar.classList.remove('is-scrolled');
        }
      }

      window.addEventListener('scroll', handleNavbarScroll, { passive: true });
      handleNavbarScroll(); /* Run once on load */
    }

    /* ── Mobile Menu ── */
    function openMenu() {
      if (!navMenu || !hamburger) return;
      navMenu.classList.add('is-open');
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close navigation menu');
      if (overlay) {
        overlay.classList.add('is-visible');
        overlay.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden';

      /* Trap focus */
      var focusable = navMenu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex="0"]'
      );
      if (focusable.length) focusable[0].focus();
    }

    function closeMenu() {
      if (!navMenu || !hamburger) return;
      navMenu.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open navigation menu');
      if (overlay) {
        overlay.classList.remove('is-visible');
        overlay.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }

    if (hamburger) {
      hamburger.addEventListener('click', function () {
        var isOpen = navMenu && navMenu.classList.contains('is-open');
        if (isOpen) closeMenu(); else openMenu();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    /* Close menu on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    /* Close menu on resize (to desktop) */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) closeMenu();
    });

    /* ── Dropdown Logic ── */
    var dropdownItems = document.querySelectorAll('.navbar__item--dropdown');

    function closeAllDropdowns(except) {
      dropdownItems.forEach(function (item) {
        if (item !== except) {
          item.classList.remove('is-open');
          var btn = item.querySelector('.navbar__dropdown-toggle');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    dropdownItems.forEach(function (item) {
      var btn      = item.querySelector('.navbar__dropdown-toggle');
      var dropdown = item.querySelector('.navbar__dropdown');

      if (!btn || !dropdown) return;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = item.classList.contains('is-open');
        closeAllDropdowns(item);
        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      /* Hover (desktop) */
      item.addEventListener('mouseenter', function () {
        if (window.innerWidth > 1024) {
          closeAllDropdowns(item);
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      item.addEventListener('mouseleave', function () {
        if (window.innerWidth > 1024) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      /* Keyboard nav within dropdown */
      var links = dropdown.querySelectorAll('.navbar__dropdown-link');
      links.forEach(function (link, idx) {
        link.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (links[idx + 1]) links[idx + 1].focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (idx === 0) btn.focus();
            else if (links[idx - 1]) links[idx - 1].focus();
          } else if (e.key === 'Escape') {
            item.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            btn.focus();
          }
        });
      });
    });

    /* Close dropdowns when clicking outside */
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar__item--dropdown')) {
        closeAllDropdowns(null);
      }
    });

    /* ── Active Page Link Highlighting ── */
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('[data-page]').forEach(function (link) {
      var page = link.dataset.page;
      if (
        (page === 'home1' && (currentPath === 'index.html' || currentPath === '')) ||
        (page === 'home2' && currentPath === 'home2.html') ||
        (page === 'about' && currentPath === 'about.html') ||
        (page === 'service' && currentPath === 'service.html') ||
        (page === 'pricing' && currentPath === 'pricing.html') ||
        (page === 'blog' && currentPath === 'blog.html') ||
        (page === 'contact' && currentPath === 'contact.html')
      ) {
        link.classList.add('is-active');

        /* If the active link is inside a dropdown, also highlight the parent toggle */
        var parentDropdown = link.closest('.navbar__item--dropdown');
        if (parentDropdown) {
          var toggleBtn = parentDropdown.querySelector('.navbar__dropdown-toggle');
          if (toggleBtn) toggleBtn.classList.add('has-active-child');
        }
      }
    });

  });
})();
