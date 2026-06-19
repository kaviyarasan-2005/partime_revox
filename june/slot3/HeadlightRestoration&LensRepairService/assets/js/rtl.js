/* ============================================================
   LUME — RTL Manager (Right-to-Left / Left-to-Right Toggle)
   ============================================================ */

const RTLManager = (() => {
  const STORAGE_KEY = 'lume-direction';
  const RTL = 'rtl';
  const LTR = 'ltr';

  function getCurrentDir() {
    return document.documentElement.getAttribute('dir') || LTR;
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    updateToggleButtons(dir);
  }

  function updateToggleButtons(dir) {
    const btns = document.querySelectorAll('.rtl-toggle');
    btns.forEach(btn => {
      // Show the mode to SWITCH TO, not the current
      btn.textContent = dir === RTL ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === RTL ? 'Switch to left-to-right' : 'Switch to right-to-left');
      btn.setAttribute('title', dir === RTL ? 'Switch to LTR layout' : 'Switch to RTL layout');
    });
  }

  function toggle() {
    const current = getCurrentDir();
    applyDirection(current === RTL ? LTR : RTL);
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const dir = saved || LTR;
    applyDirection(dir);

    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, getCurrentDir, applyDirection };
})();

document.addEventListener('DOMContentLoaded', () => RTLManager.init());
