/* ============================================================
   Cart — add to cart, display, localStorage
   ============================================================ */

const Cart = (() => {
  const STORAGE_KEY = 'nova_cart';

  function getItems() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    renderBadge();
    renderDropdown();
  }

  function addItem(name, price, image) {
    const items = getItems();
    const existing = items.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ name, price, image, qty: 1 });
    }
    saveItems(items);
    showAddedToast(name);
  }

  function removeItem(name) {
    const items = getItems().filter(i => i.name !== name);
    saveItems(items);
  }

  function updateQty(name, qty) {
    const items = getItems();
    const item = items.find(i => i.name === name);
    if (!item) return;
    if (qty <= 0) {
      removeItem(name);
    } else {
      item.qty = qty;
      saveItems(items);
    }
  }

  function getTotal() {
    return getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getCount() {
    return getItems().reduce((sum, i) => sum + i.qty, 0);
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
    renderBadge();
    renderDropdown();
  }

  /* ---------- DOM rendering ---------- */

  function renderBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
    const mobileBadge = document.getElementById('mobile-cart-badge');
    if (mobileBadge) {
      const count = getCount();
      mobileBadge.textContent = count;
      mobileBadge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function renderDropdown() {
    const dropdown = document.getElementById('cart-dropdown');
    if (!dropdown) return;
    const items = getItems();

    if (items.length === 0) {
      dropdown.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
          <p>Your cart is empty</p>
        </div>`;
      return;
    }

    let html = '<div class="cart-items">';
    items.forEach(item => {
      html += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
          </div>
          <div class="cart-item-qty">
            <button class="cart-qty-btn" data-action="dec" data-name="${item.name}" aria-label="Decrease quantity">−</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn" data-action="inc" data-name="${item.name}" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item-remove" data-name="${item.name}" aria-label="Remove ${item.name}">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>`;
    });
    html += '</div>';

    html += `
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total</span>
          <span class="cart-total-val">$${getTotal().toFixed(2)}</span>
        </div>
        <button class="btn btn-primary btn-full" id="cart-checkout-btn">
          <i class="fa-solid fa-credit-card" aria-hidden="true"></i> Checkout
        </button>
        <button class="btn btn-outline btn-full" id="cart-clear-btn" style="margin-top:8px;">
          <i class="fa-solid fa-trash" aria-hidden="true"></i> Clear Cart
        </button>
      </div>`;

    dropdown.innerHTML = html;

    /* event listeners */
    dropdown.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const action = btn.dataset.action;
        const item = getItems().find(i => i.name === name);
        if (!item) return;
        if (action === 'inc') updateQty(name, item.qty + 1);
        else updateQty(name, item.qty - 1);
      });
    });

    dropdown.querySelectorAll('[data-name]').forEach(btn => {
      if (btn.dataset.action) return;
      btn.addEventListener('click', () => removeItem(btn.dataset.name));
    });

    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
      alert('Thank you! Your order has been placed. Total: $' + getTotal().toFixed(2));
      clear();
      toggleDropdown(false);
    });

    const clearBtn = document.getElementById('cart-clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', clear);
  }

  function showAddedToast(name) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<i class="fa-solid fa-check" aria-hidden="true"></i> <strong>${name}</strong> added to cart`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  function toggleDropdown(force) {
    const dropdown = document.getElementById('cart-dropdown');
    const toggle = document.getElementById('cart-toggle');
    if (!dropdown || !toggle) return;
    const open = force !== undefined ? force : dropdown.classList.contains('hidden');
    dropdown.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', open);
  }

  /* ---------- init ---------- */

  function init() {
    renderBadge();
    renderDropdown();

    const toggle = document.getElementById('cart-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
      });
    }

    const mobileToggle = document.getElementById('mobile-cart-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
      });
    }

    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('cart-dropdown');
      const toggle = document.getElementById('cart-toggle');
      if (dropdown && !dropdown.contains(e.target) && toggle && !toggle.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    /* wire up "Add to Cart" buttons */
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const image = btn.dataset.image;
        addItem(name, price, image);
      });
    });
  }

  return { init, addItem, removeItem, updateQty, getCount, getTotal, clear, toggleDropdown };
})();

document.addEventListener('DOMContentLoaded', Cart.init);
