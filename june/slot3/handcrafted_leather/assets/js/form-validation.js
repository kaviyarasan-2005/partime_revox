/**
 * form-validation.js — Client-side Form Validation
 * Handcrafted Leather Journal & Sketchbook Bindery
 */

(function () {
  'use strict';

  /* ── Validation rules ── */
  const RULES = {
    required: function (val) {
      return val.trim() !== '';
    },
    email: function (val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    },
    minLength: function (val, len) {
      return val.trim().length >= parseInt(len, 10);
    },
    maxLength: function (val, len) {
      return val.trim().length <= parseInt(len, 10);
    },
    phone: function (val) {
      return /^[\+]?[\d\s\-\(\)]{7,20}$/.test(val.trim());
    },
  };

  /* ── Error messages ── */
  const MESSAGES = {
    required:  'This field is required.',
    email:     'Please enter a valid email address.',
    minLength: function (len) { return 'Must be at least ' + len + ' characters.'; },
    maxLength: function (len) { return 'Must be no more than ' + len + ' characters.'; },
    phone:     'Please enter a valid phone number.',
  };

  /* ── Validate a single field ── */
  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    const errors = [];
    const val    = field.value;

    /* Check data-validate attributes */
    if (field.hasAttribute('required') || field.dataset.required) {
      if (!RULES.required(val)) errors.push(MESSAGES.required);
    }

    if (field.type === 'email' && val.trim() !== '') {
      if (!RULES.email(val)) errors.push(MESSAGES.email);
    }

    if (field.dataset.minlength && val.trim() !== '') {
      if (!RULES.minLength(val, field.dataset.minlength)) {
        errors.push(MESSAGES.minLength(field.dataset.minlength));
      }
    }

    if (field.dataset.maxlength && val.trim() !== '') {
      if (!RULES.maxLength(val, field.dataset.maxlength)) {
        errors.push(MESSAGES.maxLength(field.dataset.maxlength));
      }
    }

    if (field.dataset.phone && val.trim() !== '') {
      if (!RULES.phone(val)) errors.push(MESSAGES.phone);
    }

    /* Show/hide error */
    const errorEl = group.querySelector('.form-error');

    if (errors.length > 0) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      group.classList.add('has-error');
      field.setAttribute('aria-invalid', 'true');
      if (errorEl) {
        errorEl.textContent = errors[0];
        errorEl.style.display = 'flex';
      }
      return false;
    } else if (val.trim() !== '') {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      group.classList.remove('has-error');
      field.removeAttribute('aria-invalid');
      if (errorEl) errorEl.style.display = 'none';
    } else {
      field.classList.remove('is-invalid', 'is-valid');
      group.classList.remove('has-error');
      if (errorEl) errorEl.style.display = 'none';
    }

    return true;
  }

  /* ── Validate entire form ── */
  function validateForm(form) {
    const fields = form.querySelectorAll('.form-control[required], .form-control[data-required]');
    let valid = true;
    let firstInvalid = null;

    fields.forEach(function (field) {
      if (!validateField(field)) {
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
  }

  /* ── Show form success/error state ── */
  function showFormFeedback(form, type, message) {
    /* Remove any existing feedback */
    const existing = form.querySelector('.form-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('div');
    feedback.className = 'alert alert-' + type + ' form-feedback';
    feedback.setAttribute('role', 'alert');
    feedback.setAttribute('aria-live', 'polite');

    const icon = type === 'success'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

    feedback.innerHTML = icon + '<span>' + message + '</span>';
    form.prepend(feedback);

    /* Auto-remove success after 6s */
    if (type === 'success') {
      setTimeout(function () { feedback.remove(); }, 6000);
    }
  }

  /* ── Init all validated forms ── */
  function initForms() {
    document.querySelectorAll('form[data-validate]').forEach(function (form) {

      /* Real-time validation on blur */
      form.querySelectorAll('.form-control').forEach(function (field) {
        field.addEventListener('blur', function () { validateField(field); });
        field.addEventListener('input', function () {
          if (field.classList.contains('is-invalid')) validateField(field);
        });
      });

      /* Submit handler */
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm(form)) return;

        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';

        /* Loading state */
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML =
            '<span class="spinner" aria-hidden="true"></span><span>Sending…</span>';
        }

        /* Check for Formspree action */
        const action = form.getAttribute('action');
        const isFormspree = action && action.includes('formspree');

        if (isFormspree) {
          const data = new FormData(form);
          fetch(action, {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' },
          })
          .then(function (res) {
            if (res.ok) {
              showFormFeedback(form, 'success', 'Thank you! Your message has been sent. We\'ll be in touch soon.');
              form.reset();
              form.querySelectorAll('.form-control').forEach(function (f) {
                f.classList.remove('is-valid', 'is-invalid');
              });
            } else {
              showFormFeedback(form, 'error', 'Something went wrong. Please try again or email us directly.');
            }
          })
          .catch(function () {
            showFormFeedback(form, 'error', 'Network error. Please check your connection and try again.');
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }
          });
        } else {
          /* Demo simulation — remove in production */
          setTimeout(function () {
            showFormFeedback(form, 'success', 'Thank you! Your message has been sent successfully.');
            form.reset();
            form.querySelectorAll('.form-control').forEach(function (f) {
              f.classList.remove('is-valid', 'is-invalid');
            });
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }
          }, 1400);
        }
      });
    });

    /* Newsletter forms */
    document.querySelectorAll('form[data-newsletter]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = form.querySelector('[type="email"]');
        if (!emailInput || !RULES.email(emailInput.value)) {
          if (emailInput) {
            emailInput.classList.add('is-invalid');
            emailInput.focus();
          }
          return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const orig = btn ? btn.innerHTML : '';

        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner" aria-hidden="true"></span>';
        }

        setTimeout(function () {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Subscribed!';
            setTimeout(function () { btn.innerHTML = orig; }, 3000);
          }
          emailInput.value = '';
          emailInput.classList.remove('is-invalid', 'is-valid');
        }, 1200);
      });
    });
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})();
