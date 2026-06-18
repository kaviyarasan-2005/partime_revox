/* ============================================================
   LUME — Main JS Entry Point
   ============================================================ */

// All other scripts are initialized in their own DOMContentLoaded listeners.
// This file provides shared utilities and global setup.

const LUME = (() => {

  /* ---- Smooth Scroll for all anchor links ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height').trim(), 10) + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ---- Copy to clipboard helper ---- */
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }

  /* ---- Toast Notification ---- */
  function showToast(message, type = 'success', duration = 3000) {
    const existing = document.querySelector('.lume-toast');
    if (existing) existing.remove();

    const icons = {
      success: 'fa-circle-check',
      error: 'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };

    const colors = {
      success: '#27AE60',
      error: '#C0392B',
      warning: '#E67E22',
      info: '#2980B9'
    };

    const toast = document.createElement('div');
    toast.className = 'lume-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      inset-inline-end: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      background: ${colors[type]};
      color: #FFFFFF;
      border-radius: 10px;
      font-family: Inter, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 1300;
      max-width: 340px;
      animation: toastIn 0.3s ease;
    `;
    toast.innerHTML = `<i class="fa-solid ${icons[type]}" style="font-size:18px;flex-shrink:0;"></i><span>${message}</span>`;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes toastOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ---- Format Currency ---- */
  function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  }

  /* ---- Format Date ---- */
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /* ---- Add scroll to top button ---- */
  function addScrollToTopBtn() {
    if (document.getElementById('scroll-to-top')) return;
    const btn = document.createElement('button');
    btn.id = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    btn.style.cssText = `
      position: fixed;
      bottom: 24px;
      inset-inline-start: 24px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--color-primary);
      color: #FFFFFF;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 4px 16px rgba(26,58,92,0.35);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s, transform 0.2s;
      z-index: 999;
    `;
    btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
    document.body.appendChild(btn);
  }

  /* ---- Page body fade in ---- */
  function initPageFade() {
    const style = document.createElement('style');
    style.textContent = `
      body { opacity: 0; transition: opacity 0.3s ease; }
      body.page-loaded { opacity: 1; }
    `;
    document.head.insertBefore(style, document.head.firstChild);
  }

  /* ---- Init ---- */
  function init() {
    initSmoothScroll();
    addScrollToTopBtn();
  }

  return { init, showToast, copyToClipboard, formatCurrency, formatDate };
})();

// Initialize immediately (before DOMContentLoaded for page fade)
LUME.init && (document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', LUME.init)
  : LUME.init());
