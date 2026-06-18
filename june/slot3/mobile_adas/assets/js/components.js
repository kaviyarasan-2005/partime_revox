/* ============================================
   CALIBRATE ADAS — Reusable Components
   Skeleton Loaders & Form Validation
   ============================================ */

'use strict';

(() => {
  /* ---- Skeleton Loader Management ---- */
  const SkeletonLoader = {
    init() {
      // Find all skeleton elements and replace them after a delay to simulate loading
      const loaders = document.querySelectorAll('.skeleton-loader');
      if (loaders.length === 0) return;

      setTimeout(() => {
        loaders.forEach(loader => {
          loader.classList.add('loaded');
          // If there's an internal element with class skeleton-content, show it
          const contents = loader.querySelectorAll('.skeleton-content');
          contents.forEach(content => {
            content.style.opacity = '1';
            content.style.visibility = 'visible';
          });
        });
      }, 800);
    }
  };

  /* ---- Form Validation ---- */
  const FormValidator = {
    init() {
      const forms = document.querySelectorAll('.validate-form');
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
          input.addEventListener('blur', () => this.validateField(input));
          input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
              this.validateField(input);
            }
          });
        });

        form.addEventListener('submit', (e) => {
          let isValid = true;
          inputs.forEach(input => {
            if (!this.validateField(input)) {
              isValid = false;
            }
          });

          if (!isValid) {
            e.preventDefault();
            // Scroll to the first error
            const firstError = form.querySelector('.input-error');
            if (firstError) {
              firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      });
    },

    validateField(input) {
      const parent = input.parentElement;
      let errorMsg = parent.querySelector('.error-message');
      let isValid = true;
      let message = '';

      // Reset
      input.classList.remove('input-error', 'input-success');
      if (errorMsg) errorMsg.remove();

      // Check empty
      if (!input.value.trim()) {
        isValid = false;
        message = 'This field is required.';
      } 
      // Check specific types
      else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          isValid = false;
          message = 'Please enter a valid email address.';
        }
      } 
      else if (input.type === 'tel') {
        const telRegex = /^\+?[0-9\s\-()]{7,15}$/;
        if (!telRegex.test(input.value.trim())) {
          isValid = false;
          message = 'Please enter a valid phone number.';
        }
      }

      if (!isValid) {
        input.classList.add('input-error');
        const err = document.createElement('span');
        err.className = 'error-message';
        err.textContent = message;
        err.style.color = 'var(--color-danger)';
        err.style.fontSize = 'var(--text-xs)';
        err.style.marginTop = 'var(--space-1)';
        err.style.display = 'block';
        parent.appendChild(err);
      } else {
        input.classList.add('input-success');
      }

      return isValid;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    SkeletonLoader.init();
    FormValidator.init();
  });
})();
