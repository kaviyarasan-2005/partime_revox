/* ============================================================
   Liora — Shared Footer Injection
   ============================================================ */
(function () {
  'use strict';

  const isRoot = !window.location.pathname.includes('/pages/');
  const base   = isRoot ? '.' : '..';

  function getFooterHTML() {
    return `
      <footer class="footer" role="contentinfo" aria-label="Site footer">
        <div class="container">
          <div class="footer-grid">

            <!-- Brand Column -->
            <div class="footer-brand">
              <a href="${base}/index.html" class="footer-logo" aria-label="Liora Home">
                <div class="footer-logo-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="none">
                    <path d="M7 14 C7 8.5 10.5 5 16 5 C21.5 5 25 8.5 25 14" fill="rgba(255,255,255,0.3)" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
                    <path d="M7 14 Q8.5 16 10 14 Q11.5 16 13 14 Q14.5 16 16 14 Q17.5 16 19 14 Q20.5 16 22 14 Q23.5 16 25 14" stroke="white" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="7.5" y="15.5" width="17" height="3" rx="1.5" fill="rgba(255,255,255,0.45)" stroke="white" stroke-width="1.2"/>
                    <path d="M7 19 C7 24 10.5 27 16 27 C21.5 27 25 24 25 19" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
                    <path d="M17 5 Q20 2 22 3.5 Q20 3 18 5" fill="rgba(255,255,255,0.7)" stroke="white" stroke-width="0.8" stroke-linejoin="round"/>
                    <line x1="19.5" y1="3.2" x2="18" y2="5" stroke="white" stroke-width="0.6" opacity="0.6"/>
                  </svg>
                </div>
                <div>
                  <span class="footer-brand-name">Liora</span>
                </div>
              </a>
              <p class="footer-desc">Crafting exquisite French macarons and pastries with passion since 2015. Every bite tells a story of tradition, creativity, and love.</p>
              <nav class="footer-social" aria-label="Social media links">
                <a href="#" class="footer-social-link" aria-label="Follow us on Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" class="footer-social-link" aria-label="Follow us on Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" class="footer-social-link" aria-label="Follow us on Pinterest">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M17.2 8.4a5.5 5.5 0 1 0-9.7 4.2L12 22"/><circle cx="12" cy="9" r="5.5"/></svg>
                </a>
                <a href="#" class="footer-social-link" aria-label="Follow us on TikTok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </a>
              </nav>
            </div>

            <!-- Quick Links -->
            <div>
              <h3 class="footer-col-title">Quick Links</h3>
              <nav class="footer-links" aria-label="Quick links">
                <a href="${base}/index.html"         class="footer-link">Home</a>
                <a href="${base}/pages/about.html"   class="footer-link">About Us</a>
                <a href="${base}/pages/services.html" class="footer-link">Our Services</a>
                <a href="${base}/pages/pricing.html" class="footer-link">Pricing</a>
                <a href="${base}/pages/contact.html" class="footer-link">Contact</a>
                <a href="${base}/pages/coming-soon.html" class="footer-link">Coming Soon</a>
              </nav>
            </div>

            <!-- Services -->
            <div>
              <h3 class="footer-col-title">Specialties</h3>
              <nav class="footer-links" aria-label="Services links">
                <a href="${base}/pages/services.html" class="footer-link">Classic Macarons</a>
                <a href="${base}/pages/services.html" class="footer-link">Pastry Masterclasses</a>
                <a href="${base}/pages/services.html" class="footer-link">Corporate Events</a>
                <a href="${base}/pages/services.html" class="footer-link">Custom Orders</a>
              </nav>
            </div>

            <!-- Contact -->
            <div>
              <h3 class="footer-col-title">Get in Touch</h3>
              <address style="font-style:normal">
                <div class="footer-contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>24 Rue de la Paix, Paris, 75001</span>
                </div>
                <div class="footer-contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>+1 (800) 555-ROSE</span>
                </div>
                <div class="footer-contact-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>hello@liora.com</span>
                </div>
              </address>
            </div>

            <!-- Newsletter -->
            <div>
              <h3 class="footer-col-title">Newsletter</h3>
              <p style="font-size:0.8rem;color:rgba(255,248,240,0.45);margin-bottom:12px">Monthly macaron news, recipes &amp; exclusive offers.</p>
              <form class="footer-newsletter-form" action="#" method="POST" aria-label="Newsletter signup">
                <label for="footer-email" class="sr-only">Email address</label>
                <input
                  type="email"
                  id="footer-email"
                  name="email"
                  class="footer-newsletter-input"
                  placeholder="Your email address"
                  required
                  autocomplete="email"
                >
                <button type="submit" class="footer-newsletter-btn">
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="container" style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:16px;width:100%;text-align:center">
            <p class="footer-copy" style="margin: 0 auto; text-align: center;">
              &copy; <span id="footer-year"></span> Liora. All rights reserved. Crafted with passion.
            </p>
          </div>
        </div>
      </footer>

      <!-- Toast Container -->
      <div class="toast-container" id="toast-container" role="region" aria-live="polite" aria-label="Notifications"></div>
    `;
  }

  function initFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = getFooterHTML();

    // Set current year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Newsletter form
    const form = placeholder.querySelector('.footer-newsletter-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        if (email && window.showToast) {
          window.showToast('success', 'Subscribed! Welcome to Liora.');
          form.reset();
        }
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }
})();
