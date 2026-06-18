/**
 * Theme & RTL Manager
 * Pressed Flower & Botanical Resin Jewelry Studio
 * Handles Dark/Light mode and RTL/LTR switching
 */

(function () {
  'use strict';

  const THEME_KEY = 'bf-theme';
  const DIR_KEY   = 'bf-dir';

  // Detect system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) ||
           (prefersDark.matches ? 'dark' : 'light');
  }

  function getSavedDir() {
    return localStorage.getItem(DIR_KEY) || 'ltr';
  }

  // Apply theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#1A1714' : '#F8F5F0');
    }
  }

  // Toggle theme
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Apply direction
  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(DIR_KEY, dir);

    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      const span = btn.querySelector('span');
      if (span) span.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR mode' : 'Switch to RTL mode');
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });
  }

  // Toggle direction
  function toggleDir() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    applyDir(current === 'rtl' ? 'ltr' : 'rtl');
  }

  // Wire up all toggle buttons
  function initToggles() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.addEventListener('click', toggleDir);
    });
  }

  // Listen for system preference changes
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Initialize on DOM ready
  function init() {
    applyTheme(getSavedTheme());
    applyDir(getSavedDir());
    initToggles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.BFTheme = { toggleTheme, toggleDir, applyTheme, applyDir };

})();
