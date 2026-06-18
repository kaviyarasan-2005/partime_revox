/* ============================================================
   LUME — Theme Manager (Dark/Light Mode)
   ============================================================ */

const ThemeManager = (() => {
  const STORAGE_KEY = 'lume-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || LIGHT;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleButtons(theme);
    // Notify charts if available
    if (typeof ChartsManager !== 'undefined') {
      ChartsManager.updateTheme(theme);
    }
  }

  function updateToggleButtons(theme) {
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(btn => {
      const icon = btn.querySelector('i') || btn;
      if (btn.querySelector('i')) {
        btn.querySelector('i').className = theme === DARK
          ? 'fa-solid fa-sun'
          : 'fa-solid fa-moon';
      } else {
        btn.innerHTML = theme === DARK ? '☀' : '🌙';
      }
      btn.setAttribute('aria-label', theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function toggle() {
    const current = getCurrentTheme();
    applyTheme(current === DARK ? LIGHT : DARK);
  }

  function init() {
    const saved = getSavedTheme();
    const theme = saved || getSystemPreference();
    applyTheme(theme);

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!getSavedTheme()) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });

    // Bind toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, getCurrentTheme, applyTheme };
})();

document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
