/**
 * NOVA — rtl.js
 * RTL/LTR direction toggle
 */

(function () {
  const STORAGE_KEY = 'nova-dir';
  const html = document.documentElement;

  function getDir() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function applyDir(dir) {
    html.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });
  }

  function toggleDir() {
    const current = html.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';

    /* Close mobile drawer before switching */
    const drawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const hamburger = document.getElementById('hamburger');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.style.transform = '';
    }
    if (drawerOverlay) drawerOverlay.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';

    /* Add class to disable transitions */
    html.classList.add('dir-switching');

    applyDir(next);

    /* Remove class after repaint */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        html.classList.remove('dir-switching');
      });
    });
  }

  applyDir(getDir());

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleDir);
    });
  });
})();
