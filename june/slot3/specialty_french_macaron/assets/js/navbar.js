/* ============================================================
   Liora — Shared Navbar Injection
   ============================================================ */
(function () {
  'use strict';

  // Detect base path (root vs /pages/)
  const isRoot = !window.location.pathname.includes('/pages/');
  const base   = isRoot ? '.' : '..';

  function getNavHTML() {
    const links = [
      {
        label: 'Home',
        dropdown: [
          { label: 'Home 1', href: `${base}/index.html` },
          { label: 'Home 2', href: `${base}/pages/home2.html` }
        ]
      },
      { label: 'About',   href: `${base}/pages/about.html` },
      { label: 'Services', href: `${base}/pages/services.html` },
      { label: 'Pricing', href: `${base}/pages/pricing.html` },
      { label: 'Blog', href: `${base}/pages/blog.html` },
      { label: 'Contact', href: `${base}/pages/contact.html` },
    ];

    function buildDropdown(items) {
      return `<div class="dropdown" role="menu">
        ${items.map(item => `
          <a href="${item.href}" class="dropdown-item" role="menuitem">
            ${item.label}
          </a>`).join('')}
      </div>`;
    }

    const navItems = links.map(link => {
      if (link.dropdown) {
        return `<li class="nav-item" role="none">
          <button class="nav-link" aria-haspopup="true" aria-expanded="false">
            ${link.label}
            <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          ${buildDropdown(link.dropdown)}
        </li>`;
      }
      return `<li class="nav-item" role="none">
        <a href="${link.href}" class="nav-link" role="menuitem">${link.label}</a>
      </li>`;
    }).join('');

    const mobileItems = links.map(link => {
      if (link.dropdown) {
        const dropHtml = link.dropdown.map(item =>
          `<a href="${item.href}" class="mobile-dropdown-link">${item.label}</a>`
        ).join('');
        return `<li>
          <button class="mobile-nav-link mobile-dropdown-trigger" aria-expanded="false">
            ${link.label}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="mobile-dropdown">${dropHtml}</div>
        </li>`;
      }
      return `<li><a href="${link.href}" class="mobile-nav-link">${link.label}</a></li>`;
    }).join('');

    return `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <nav class="navbar" id="main-navbar" role="navigation" aria-label="Main navigation">
        <div class="navbar-inner">

          <!-- Brand -->
          <a href="${base}/index.html" class="navbar-brand" aria-label="Liora Home">
            <div class="brand-logo" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12c0-2.5.93-4.78 2.46-6.54"/><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="1"/></svg>
            </div>
            <div>
              <span class="brand-name">Liora</span>
            </div>
          </a>

          <!-- Desktop Nav -->
          <ul class="navbar-nav" role="menubar" aria-label="Site navigation">
            ${navItems}
          </ul>

          <!-- Controls -->
          <div class="navbar-controls">
            <!-- RTL Toggle -->
            <button class="ctrl-btn rtl-btn" id="rtl-toggle" aria-label="Toggle text direction" title="Toggle RTL/LTR">
              <span id="rtl-label">RTL</span>
            </button>

            <!-- Theme Toggle -->
            <button class="ctrl-btn" id="theme-toggle" aria-label="Toggle dark/light mode" title="Toggle theme">
              <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>



            <!-- Hamburger (mobile) -->
            <button class="hamburger" id="hamburger-btn" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div class="mobile-menu" id="mobile-menu" role="dialog" aria-label="Mobile navigation" aria-modal="false">
        <ul style="list-style:none;padding:0;margin:0">
          ${mobileItems}
        </ul>

      </div>
    `;
  }

  function initNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = getNavHTML();

    const navbar    = document.getElementById('main-navbar');
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu= document.getElementById('mobile-menu');

    // ── Hamburger Toggle ──
    function toggleMobileMenu(open) {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    hamburger.addEventListener('click', () => toggleMobileMenu());

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });

    // ── Mobile Dropdowns ──
    document.querySelectorAll('.mobile-dropdown-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const drop = btn.nextElementSibling;
        const isOpen = drop.classList.contains('open');
        document.querySelectorAll('.mobile-dropdown.open').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.mobile-dropdown-trigger').forEach(b => b.setAttribute('aria-expanded','false'));
        if (!isOpen) {
          drop.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // ── Navbar Scroll Effect ──
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Active Link ──
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-dropdown-link').forEach(link => {
      if (link.href && link.href.includes(currentPath.split('/').pop())) {
        link.classList.add('active');
      }
    });

    // ── Lucide icons re-init ──
    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();
