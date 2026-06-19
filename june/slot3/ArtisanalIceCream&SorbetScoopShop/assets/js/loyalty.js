/**
 * NOVA — loyalty.js
 * Loyalty punch card stamp animation on scroll reveal
 */

(function () {
  document.addEventListener('DOMContentLoaded', function () {

    /* ---- Punch Card Stamp Animation ---- */
    function animatePunchCard(card) {
      const holes = card.querySelectorAll('.punch-hole');
      if (!holes.length) return;
      holes.forEach(function (hole, i) {
        hole.classList.remove('stamped');
      });
      // Stamp 7 of 10 holes (demo state)
      const stamped = 7;
      holes.forEach(function (hole, i) {
        if (i < stamped) {
          setTimeout(function () {
            hole.classList.add('stamped');
          }, i * 120 + 200);
        }
      });
    }

    const loyaltyCards = document.querySelectorAll('.loyalty-card');

    if ('IntersectionObserver' in window && loyaltyCards.length) {
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animatePunchCard(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      loyaltyCards.forEach(function (card) { obs.observe(card); });
    } else {
      loyaltyCards.forEach(animatePunchCard);
    }

    /* ---- Countdown Timer (Coming Soon) ---- */
    const countdownEl = document.getElementById('countdown-timer');
    if (countdownEl) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 42); // 42 days from now

      function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        if (diff <= 0) {
          countdownEl.innerHTML = '<span class="countdown-unit"><span class="countdown-num">0</span><span class="countdown-label">Days</span></span>'.repeat(4);
          return;
        }
        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.innerHTML =
          unit(days,    'Days')    +
          unit(hours,   'Hours')   +
          unit(minutes, 'Min')     +
          unit(seconds, 'Sec');
      }

      function unit(val, label) {
        return '<div class="countdown-unit"><span class="countdown-num">' +
          String(val).padStart(2, '0') +
          '</span><span class="countdown-label">' + label + '</span></div>';
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    }

    /* ---- Flavor Mixer Interactivity ---- */
    document.querySelectorAll('.mixer-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        const group = opt.closest('.mixer-group');
        if (group) {
          group.querySelectorAll('.mixer-option').forEach(function (o) {
            o.classList.remove('selected');
          });
        }
        opt.classList.toggle('selected');
      });
    });

  });
})();
