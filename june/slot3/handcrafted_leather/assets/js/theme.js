/**
 * theme.js — Theme (Light/Dark) & Direction (LTR/RTL) Management
 * IMPORTANT: Load this script BEFORE the closing </head> to prevent FOUC
 * Handcrafted Leather Journal & Sketchbook Bindery
 */

(function () {
  'use strict';

  /* ── Storage Keys ── */
  var THEME_KEY = 'lcb-theme';
  var DIR_KEY   = 'lcb-dir';

  /* ── Defaults ── */
  var DEFAULT_THEME = 'light';
  var DEFAULT_DIR   = 'ltr';

  /* ── Apply stored preferences immediately (prevent FOUC) ── */
  var savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  var savedDir   = localStorage.getItem(DIR_KEY)   || DEFAULT_DIR;

  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('dir', savedDir);

  /* ── Setup after DOM ready ── */
  function init() {
    /* ── Theme Toggle ── */
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      updateThemeBtn(themeBtn, savedTheme);

      themeBtn.addEventListener('click', function () {
        var current  = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
        var next     = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(THEME_KEY, next);
        updateThemeBtn(themeBtn, next);
        themeBtn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        themeBtn.setAttribute('title',      next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
    }

    /* ── RTL Toggle ── */
    var rtlBtn = document.getElementById('rtlToggle');
    if (rtlBtn) {
      updateRtlBtn(rtlBtn, savedDir);

      rtlBtn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('dir') || DEFAULT_DIR;
        var next    = current === 'ltr' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', next);
        localStorage.setItem(DIR_KEY, next);
        updateRtlBtn(rtlBtn, next);
        rtlBtn.setAttribute('aria-label', next === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');
      });
    }

    /* ── Scroll Progress Bar ── */
    var progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      function updateProgress() {
        var scrollTop    = window.scrollY || document.documentElement.scrollTop;
        var docHeight    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
      }
      window.addEventListener('scroll', updateProgress, { passive: true });
    }


  }

  /* ── Helpers ── */
  function updateThemeBtn(btn, theme) {
    if (theme === 'dark') {
      btn.setAttribute('aria-label', 'Switch to light mode');
      btn.setAttribute('title', 'Switch to light mode');
    } else {
      btn.setAttribute('aria-label', 'Switch to dark mode');
      btn.setAttribute('title', 'Switch to dark mode');
    }
  }

  function updateRtlBtn(btn, dir) {
    var label = btn.querySelector('.rtl-label');
    if (label) label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
