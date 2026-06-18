/**
 * main.js — General Page Interactions
 * Scroll reveals, counters, accordions, tabs, skeleton loaders, gallery, countdown
 * Handcrafted Leather Journal & Sketchbook Bindery
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ────────────────────────────────────
       PAGE LOADER
    ──────────────────────────────────── */
    const loader = document.querySelector('.page-loader');
    if (loader) {
      window.addEventListener('load', function () {
        setTimeout(function () {
          loader.classList.add('is-hidden');
        }, 400);
      });
      /* Fallback: hide after 2s regardless */
      setTimeout(function () {
        loader.classList.add('is-hidden');
      }, 2000);
    }

    /* ────────────────────────────────────
       SCROLL REVEAL
    ──────────────────────────────────── */
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length > 0 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ────────────────────────────────────
       ANIMATED COUNTERS
    ──────────────────────────────────── */
    function animateCounter(el) {
      const target  = parseInt(el.dataset.target, 10);
      const suffix  = el.dataset.suffix || '';
      const dur     = parseInt(el.dataset.duration, 10) || 1800;
      const start   = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        /* Ease-out cubic */
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.round(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    const counterEls = document.querySelectorAll('[data-counter]');
    if (counterEls.length > 0 && 'IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counterEls.forEach(function (el) { counterObserver.observe(el); });
    }

    /* ────────────────────────────────────
       ACCORDIONS
    ──────────────────────────────────── */
    document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const item   = trigger.closest('.accordion__item');
        const body   = item.querySelector('.accordion__body');
        const isOpen = item.classList.contains('is-open');

        /* Close siblings (single-open accordion) */
        const accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion__item.is-open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('is-open');
              const openTrigger = openItem.querySelector('.accordion__trigger');
              if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
              const openBody = openItem.querySelector('.accordion__body');
              if (openBody) openBody.style.maxHeight = null;
            }
          });
        }

        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          body.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });

    /* ────────────────────────────────────
       TABS
    ──────────────────────────────────── */
    document.querySelectorAll('.tabs').forEach(function (tabsEl) {
      const buttons = tabsEl.querySelectorAll('.tabs__btn');
      const panels  = tabsEl.querySelectorAll('.tabs__panel');

      buttons.forEach(function (btn, idx) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
          panels.forEach(function (p)  { p.classList.remove('is-active'); });
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected', 'true');
          if (panels[idx]) panels[idx].classList.add('is-active');
        });
      });
    });

    /* ────────────────────────────────────
       SKELETON LOADERS
    ──────────────────────────────────── */
    document.querySelectorAll('.skeleton-wrapper').forEach(function (wrapper) {
      const delay = parseInt(wrapper.dataset.delay, 10) || 800;
      setTimeout(function () {
        wrapper.classList.add('loaded');
        const skeletons = wrapper.querySelectorAll('.skeleton-card, .skeleton-item');
        const content   = wrapper.querySelectorAll('.real-content');
        skeletons.forEach(function (s) { s.style.display = 'none'; });
        content.forEach(function (c) { c.style.display = ''; c.classList.add('animate-fade-in'); });
      }, delay);
    });

    /* ────────────────────────────────────
       PRICING TOGGLE
    ──────────────────────────────────── */
    const pricingToggle = document.getElementById('pricingToggle');
    if (pricingToggle) {
      pricingToggle.addEventListener('change', function () {
        const isAnnual = this.checked;
        document.querySelectorAll('[data-price-monthly]').forEach(function (el) {
          el.textContent = isAnnual
            ? el.dataset.priceAnnual
            : el.dataset.priceMonthly;
        });
        document.querySelectorAll('[data-period]').forEach(function (el) {
          el.textContent = isAnnual ? 'per piece (annual)' : 'per piece';
        });
        const labels = document.querySelectorAll('.pricing-toggle-label');
        labels.forEach(function (l, i) {
          l.classList.toggle('is-active', isAnnual ? i === 1 : i === 0);
        });
      });
    }

    /* ────────────────────────────────────
       COUNTDOWN TIMER (Coming Soon)
    ──────────────────────────────────── */
    const countdown = document.getElementById('countdown');
    if (countdown) {
      const targetDate = new Date(countdown.dataset.target || '2026-09-01T00:00:00');

      function updateCountdown() {
        const now  = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
          countdown.innerHTML = '<p class="countdown__done">We are live!</p>';
          return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        function pad(n) { return String(n).padStart(2, '0'); }

        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-minutes');
        const sEl = document.getElementById('cd-seconds');

        if (dEl) dEl.textContent = pad(d);
        if (hEl) hEl.textContent = pad(h);
        if (mEl) mEl.textContent = pad(m);
        if (sEl) sEl.textContent = pad(s);
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    }

    /* ────────────────────────────────────
       SMOOTH ANCHOR LINKS
    ──────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80; /* navbar height */
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });

    /* ────────────────────────────────────
       FLOATING HERO ELEMENTS (parallax-lite)
    ──────────────────────────────────── */
    const floatEls = document.querySelectorAll('.hero-float');
    if (floatEls.length > 0) {
      window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        floatEls.forEach(function (el) {
          const speed = parseFloat(el.dataset.speed) || 0.15;
          el.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });
      }, { passive: true });
    }

    /* ────────────────────────────────────
       TESTIMONIAL SIMPLE SLIDER
    ──────────────────────────────────── */
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
      const slides  = slider.querySelectorAll('.testimonial-slide');
      const dotsWrap = document.querySelector('.testimonial-dots');
      let current = 0;
      let timer;

      function showSlide(idx) {
        slides.forEach(function (s, i) {
          s.classList.toggle('is-active', i === idx);
        });
        if (dotsWrap) {
          dotsWrap.querySelectorAll('.dot').forEach(function (d, i) {
            d.classList.toggle('is-active', i === idx);
          });
        }
        current = idx;
      }

      function nextSlide() {
        showSlide((current + 1) % slides.length);
      }

      /* Create dots */
      if (dotsWrap) {
        slides.forEach(function (_, i) {
          const dot = document.createElement('button');
          dot.className = 'dot' + (i === 0 ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
          dot.addEventListener('click', function () {
            clearInterval(timer);
            showSlide(i);
            timer = setInterval(nextSlide, 5000);
          });
          dotsWrap.appendChild(dot);
        });
      }

      /* Prev/Next buttons */
      const prevBtn = document.querySelector('.slider-prev');
      const nextBtn = document.querySelector('.slider-next');
      if (prevBtn) prevBtn.addEventListener('click', function () {
        clearInterval(timer);
        showSlide((current - 1 + slides.length) % slides.length);
        timer = setInterval(nextSlide, 5000);
      });
      if (nextBtn) nextBtn.addEventListener('click', function () {
        clearInterval(timer);
        nextSlide();
        timer = setInterval(nextSlide, 5000);
      });

      if (slides.length > 1) {
        showSlide(0);
        timer = setInterval(nextSlide, 5000);
      }
    }

  });
})();
