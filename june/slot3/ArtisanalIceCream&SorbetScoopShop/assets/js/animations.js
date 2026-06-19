/**
 * NOVA — animations.js
 * Intersection Observer scroll reveal + staggered card animations
 */

(function () {
  document.addEventListener('DOMContentLoaded', function () {

    /* ---- Scroll Reveal ---- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealEls.length) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: show all immediately
      revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ---- Staggered Grid Children ---- */
    document.querySelectorAll('[data-stagger]').forEach(function (grid) {
      const children = grid.querySelectorAll('.reveal');
      children.forEach(function (child, i) {
        child.style.transitionDelay = (i * 0.1) + 's';
      });
    });

    /* ---- Flavor Badge Hover Rotate ---- */
    document.querySelectorAll('.flavor-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        const badge = card.querySelector('.badge');
        if (badge) {
          badge.style.transform = 'rotate(-3deg) scale(1.05)';
          badge.style.transition = 'transform 0.3s ease';
        }
      });
      card.addEventListener('mouseleave', function () {
        const badge = card.querySelector('.badge');
        if (badge) {
          badge.style.transform = 'rotate(0deg) scale(1)';
        }
      });
    });

    /* ---- Page Fade In ---- */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)';
    requestAnimationFrame(function () {
      document.body.style.opacity = '1';
    });

    /* ---- Smooth Parallax for Hero (desktop only) ---- */
    const hero = document.querySelector('.hero-bg img');
    if (hero && window.innerWidth >= 1024) {
      window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        hero.style.transform = 'translateY(' + (scrollY * 0.25) + 'px)';
      }, { passive: true });
    }

  });
})();
