/**
 * BAND — Size Guide Interactive
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Highlight table rows on hover
  const sizeTable = document.querySelector('.size-table');
  if (sizeTable) {
    sizeTable.querySelectorAll('tbody tr').forEach(row => {
      row.addEventListener('mouseenter', () => row.style.background = 'rgba(225,112,85,0.06)');
      row.addEventListener('mouseleave', () => {
        if (!row.classList.contains('highlight')) row.style.background = '';
      });
    });
  }

  // Animated ring sizer: pulse on scroll reveal
  const animRing = document.querySelector('.animated-ring');
  if (animRing) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        animRing.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0.5 });
    obs.observe(animRing);
  }
});
