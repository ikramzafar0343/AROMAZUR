(() => {
  document.documentElement.classList.remove('no-js');

  const pad2 = (n) => String(Math.max(0, n)).padStart(2, '0');

  const initCountdown = () => {
    document.querySelectorAll('.az-countdown').forEach((el) => {
      const endHours = Number(el.getAttribute('data-countdown-hours') || '23');
      const endMinutes = Number(el.getAttribute('data-countdown-minutes') || '59');
      const endSeconds = Number(el.getAttribute('data-countdown-seconds') || '59');

      const hEl = el.querySelector('.az-countdown__h');
      const mEl = el.querySelector('.az-countdown__m');
      const sEl = el.querySelector('.az-countdown__s');

      const calculateRemaining = () => {
        const now = new Date();
        const end = new Date();
        end.setHours(endHours, endMinutes, endSeconds, 0);
        
        // If end time has passed today, set it for tomorrow
        if (end <= now) {
          end.setDate(end.getDate() + 1);
        }

        const diff = Math.max(0, Math.floor((end - now) / 1000));
        return diff;
      };

      const render = () => {
        const remaining = calculateRemaining();
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;
        
        if (hEl) hEl.textContent = `${pad2(h)}h:`;
        if (mEl) mEl.textContent = `${pad2(m)}m:`;
        if (sEl) sEl.textContent = `${pad2(s)}s`;
      };

      // Render immediately to show correct time on page load
      render();
      
      // Update every second
      const interval = window.setInterval(() => {
        render();
      }, 1000);
    });
  };

  const initSearchToggle = () => {
    document.querySelectorAll('[data-search-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const header = btn.closest('.az-header');
        if (!header) return;
        const panel = header.querySelector('[data-search-panel]');
        if (!panel) return;
        const isHidden = panel.hasAttribute('hidden');
        if (isHidden) {
          panel.removeAttribute('hidden');
          const input = panel.querySelector('input[type="search"]');
          if (input) input.focus();
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('[data-search-panel]').forEach((panel) => panel.setAttribute('hidden', ''));
    });
  };

  const initMobileMenu = () => {
    const openButtons = document.querySelectorAll('[data-mobile-menu-open]');
    openButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const header = btn.closest('.az-header');
        if (!header) return;
        const menu = header.querySelector('[data-mobile-menu]');
        if (!menu) return;
        menu.removeAttribute('hidden');
        document.documentElement.style.overflow = 'hidden';
      });
    });

    document.querySelectorAll('[data-mobile-menu-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-mobile-menu]').forEach((menu) => menu.setAttribute('hidden', ''));
        document.documentElement.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('[data-mobile-menu]').forEach((menu) => menu.setAttribute('hidden', ''));
      document.documentElement.style.overflow = '';
    });
  };

  const initAuthModal = () => {
    const lockScroll = () => {
      document.documentElement.style.overflow = 'hidden';
    };
    const unlockScrollIfSafe = () => {
      const mobileOpen = document.querySelector('[data-mobile-menu]:not([hidden])');
      const authOpen = document.querySelector('[data-auth-modal]:not([hidden])');
      if (!mobileOpen && !authOpen) document.documentElement.style.overflow = '';
    };

    const openModal = (modal) => {
      if (!modal) return;
      modal.removeAttribute('hidden');
      lockScroll();
      const closeBtn = modal.querySelector('[data-auth-close]');
      if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();
    };

    const closeModal = (modal) => {
      if (!modal) return;
      modal.setAttribute('hidden', '');
      unlockScrollIfSafe();
    };

    document.querySelectorAll('[data-auth-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const header = btn.closest('.az-header');
        const modal = header?.querySelector('[data-auth-modal]');
        openModal(modal);
      });
    });

    document.querySelectorAll('[data-auth-modal]').forEach((modal) => {
      modal.querySelectorAll('[data-auth-close]').forEach((el) => {
        el.addEventListener('click', () => closeModal(modal));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('[data-auth-modal]:not([hidden])').forEach((modal) => closeModal(modal));
    });
  };

  const initHeaderHeight = () => {
    const header = document.querySelector('.az-header');
    if (!header) return;

    const apply = () => {
      const h = Math.ceil(header.getBoundingClientRect().height);
      if (h) document.documentElement.style.setProperty('--header-height', `${h}px`);
    };

    apply();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => apply());
      ro.observe(header);
    } else {
      window.addEventListener('resize', apply, { passive: true });
    }
  };

  const initCartModal = () => {
    const moneyFormat = () => {
      const el = document.body;
      if (!el) return null;
      const format = el.getAttribute('data-shop-money-format');
      if (format) return format;
      return null;
    };

    const formatMoney = (cents) => {
      const value = Number(cents);
      if (!Number.isFinite(value)) return '';
      if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
        return window.Shopify.formatMoney(value);
      }
      const format = moneyFormat();
      if (format) {
        const amount = (value / 100).toFixed(2);
        return format.replace(/\{\{amount\}\}/g, amount).replace(/\{\{amount_no_decimals\}\}/g, String(Math.round(value / 100)));
      }
      return `€${(value / 100).toFixed(2)}`;
    };

    const freeShippingThreshold = () => {
      const el = document.body;
      if (!el) return 0;
      const v = el.getAttribute('data-free-shipping-threshold');
      return Math.max(0, Number(v) || 0);
    };

    const lockScroll = () => {
      document.documentElement.style.overflow = 'hidden';
    };

    const unlockScrollIfSafe = () => {
      const mobileOpen = document.querySelector('[data-mobile-menu]:not([hidden])');
      const authOpen = document.querySelector('[data-auth-modal]:not([hidden])');
      const cartOpen = document.querySelector('[data-cart-modal]:not([hidden])');
      if (!mobileOpen && !authOpen && !cartOpen) document.documentElement.style.overflow = '';
    };

    const openModal = (modal) => {
      if (!modal) return;
      modal.removeAttribute('hidden');
      lockScroll();
      const closeBtn = modal.querySelector('[data-cart-close]');
      if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();
    };

    const closeModal = (modal) => {
      if (!modal) return;
      modal.setAttribute('hidden', '');
      unlockScrollIfSafe();
    };

    const updateCartUi = (cart, root) => {
      if (!cart || !root) return;
      const countEls = document.querySelectorAll('[data-cart-count]');
      countEls.forEach((el) => {
        const n = Number(cart.item_count || 0);
        if (n > 0) {
          el.textContent = String(n);
          if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
        } else {
          el.textContent = '0';
          el.setAttribute('hidden', '');
        }
      });

      const totalEl = root.querySelector('[data-cart-total]');
      if (totalEl) totalEl.textContent = formatMoney(cart.total_price);

      let cartSavings = 0;
      let cartOriginalTotal = 0;
      (cart.items || []).forEach((item) => {
        cartOriginalTotal += item.original_line_price || 0;
        if (item.original_line_price > item.final_line_price) {
          cartSavings += (item.original_line_price || 0) - (item.final_line_price || 0);
        }
      });
      const savingsEl = root.querySelector('[data-cart-savings]');
      if (savingsEl) savingsEl.textContent = '-' + formatMoney(cartSavings);
      const savingsRowEl = root.querySelector('[data-cart-savings-row]');
      if (savingsRowEl) {
        if (cartSavings > 0) savingsRowEl.removeAttribute('hidden');
        else savingsRowEl.setAttribute('hidden', '');
      }
      const originalTotalEl = root.querySelector('[data-cart-original-total]');
      if (originalTotalEl) {
        originalTotalEl.textContent = formatMoney(cartOriginalTotal);
        if (cartSavings > 0) originalTotalEl.removeAttribute('hidden');
        else originalTotalEl.setAttribute('hidden', '');
      }

      const titleEl = root.querySelector('.az-cart__title');
      if (titleEl) {
        const base = titleEl.getAttribute('data-cart-title-base') || 'Panier';
        titleEl.textContent = (cart.item_count || 0) > 0 ? `${base} (${cart.item_count})` : base;
      }

      const emptyEl = root.querySelector('.az-cart__empty');
      const itemsEl = root.querySelector('[data-cart-items]');
      const footerEl = root.querySelector('[data-cart-footer]') || root.querySelector('.az-cart__footer');
      const freeShipEl = root.querySelector('[data-cart-free-shipping]');
      const threshold = freeShippingThreshold();
      const itemCount = cart.item_count || 0;
      const giftEl = root.querySelector('[data-cart-gift]');
      const giftTextEl = root.querySelector('[data-cart-gift-text]');
      const giftFillEl = root.querySelector('[data-cart-gift-fill]');
      const giftThreshold = () => {
        const v = document.body && document.body.getAttribute('data-cart-gift-threshold');
        return Math.max(0, Number(v) || 0);
      };
      const giftThresh = giftThreshold();
      if (giftEl && giftTextEl && giftFillEl && giftThresh > 0 && itemCount > 0) {
        const subtotal = Number(cart.total_price) || 0;
        if (subtotal >= giftThresh) {
          giftTextEl.innerHTML = 'You\'ve unlocked your <strong>FREE</strong> Gift!';
          giftFillEl.style.width = '100%';
          giftEl.removeAttribute('hidden');
        } else {
          const remaining = giftThresh - subtotal;
          giftTextEl.innerHTML = 'Add ' + formatMoney(remaining) + ' to unlock your <strong>FREE</strong> Gift!';
          giftFillEl.style.width = Math.min(100, (subtotal / giftThresh) * 100) + '%';
          giftEl.removeAttribute('hidden');
        }
      } else if (giftEl) {
        giftEl.setAttribute('hidden', '');
      }
      if (freeShipEl) {
        if (itemCount === 0 || threshold <= 0) {
          freeShipEl.textContent = '';
          freeShipEl.setAttribute('hidden', '');
        } else if (threshold > 0) {
          const subtotal = Number(cart.total_price) || 0;
          if (subtotal >= threshold) {
            freeShipEl.textContent = 'Livraison gratuite offerte';
            freeShipEl.removeAttribute('hidden');
          } else {
            const remaining = threshold - subtotal;
            freeShipEl.textContent = 'Plus que ' + formatMoney(remaining) + ' pour la livraison gratuite';
            freeShipEl.removeAttribute('hidden');
          }
        }
      }
      const upsellEl = root.querySelector('[data-cart-upsell]');
      if (upsellEl) {
        if (itemCount > 0) upsellEl.removeAttribute('hidden');
        else upsellEl.setAttribute('hidden', '');
      }
      if (!itemsEl) return;

      if (itemCount === 0) {
        if (emptyEl) emptyEl.removeAttribute('hidden');
        itemsEl.setAttribute('hidden', '');
        itemsEl.innerHTML = '';
        if (footerEl) footerEl.setAttribute('hidden', '');
        return;
      }

      if (emptyEl) emptyEl.setAttribute('hidden', '');
      itemsEl.removeAttribute('hidden');
      if (footerEl) footerEl.removeAttribute('hidden');

      const existing = new Map();
      itemsEl.querySelectorAll('[data-cart-item]').forEach((node) => {
        const key = node.getAttribute('data-item-key');
        if (key) existing.set(key, node);
      });

      const frag = document.createDocumentFragment();
      (cart.items || []).forEach((item) => {
        const key = item.key;
        const node = existing.get(key);
        if (node) {
          const qtyInput = node.querySelector('[data-cart-quantity]');
          if (qtyInput) qtyInput.value = String(item.quantity);
          const priceEl = node.querySelector('[data-cart-line-price]');
          if (priceEl) priceEl.textContent = formatMoney(item.final_line_price);
          frag.appendChild(node);
          existing.delete(key);
        } else {
          const div = document.createElement('div');
          div.className = 'az-cart__item';
          div.setAttribute('data-cart-item', '');
          div.setAttribute('data-item-key', key);
          const hasCompare = item.original_line_price != null && item.original_line_price > item.final_line_price;
          const variantHtml = item.variant_title && item.variant_title !== 'Default Title'
            ? `<div class="az-cart__item-variant"><span class="az-cart__item-variant-label">Color:</span> ${item.variant_title}</div>`
            : '';
          div.innerHTML = `
            <a href="${item.url}" class="az-cart__item-image" aria-label="${item.product_title}">
              ${item.image ? `<img src="${item.image}" alt="" loading="lazy" decoding="async">` : `<div class="az-cart__placeholder"></div>`}
            </a>
            <div class="az-cart__item-details">
              <a href="${item.url}" class="az-cart__item-title">${item.product_title}</a>
              ${variantHtml}
              <div class="az-cart__item-price">
                <span class="az-cart__item-price-current" data-cart-line-price>${formatMoney(item.final_line_price)}</span>
                ${hasCompare ? `<span class="az-cart__item-price-compare">${formatMoney(item.original_line_price)}</span>` : ''}
              </div>
              <div class="az-cart__item-actions">
                <div class="az-cart__quantity">
                  <button type="button" class="az-cart__qty-btn" data-cart-decrease aria-label="Decrease quantity">−</button>
                  <input type="number" class="az-cart__qty-input" value="${item.quantity}" min="1" data-cart-quantity aria-label="Quantity">
                  <button type="button" class="az-cart__qty-btn" data-cart-increase aria-label="Increase quantity">+</button>
                </div>
                <button type="button" class="az-cart__remove" data-cart-remove aria-label="Remove item">Remove</button>
              </div>
            </div>
          `;
          frag.appendChild(div);
        }
      });

      itemsEl.innerHTML = '';
      itemsEl.appendChild(frag);
    };

    const fetchCart = async () => {
      const res = await fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('cart_fetch_failed');
      return res.json();
    };

    const changeCart = async (id, quantity) => {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id, quantity })
      });
      if (!res.ok) throw new Error('cart_change_failed');
      return res.json();
    };

    document.querySelectorAll('[data-cart-toggle]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const header = btn.closest('.az-header');
        const modal = header?.querySelector('[data-cart-modal]');
        if (!modal) return;
        openModal(modal);
        try {
          const cart = await fetchCart();
          updateCartUi(cart, modal);
        } catch (_) {}
      });
    });

    document.querySelectorAll('[data-cart-modal]').forEach((modal) => {
      modal.querySelectorAll('[data-cart-close]').forEach((el) => {
        el.addEventListener('click', () => closeModal(modal));
      });

      modal.addEventListener('click', async (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;

        const actionEl = target.closest('[data-cart-increase], [data-cart-decrease], [data-cart-remove]');
        if (!actionEl) return;

        const itemEl = actionEl.closest('[data-cart-item]');
        if (!itemEl) return;
        const key = itemEl.getAttribute('data-item-key');
        if (!key) return;

        const qtyInput = itemEl.querySelector('[data-cart-quantity]');
        const currentQty = Number(qtyInput instanceof HTMLInputElement ? qtyInput.value : '1') || 1;

        let nextQty = currentQty;
        if (actionEl.matches('[data-cart-increase]')) nextQty = currentQty + 1;
        if (actionEl.matches('[data-cart-decrease]')) nextQty = Math.max(1, currentQty - 1);
        if (actionEl.matches('[data-cart-remove]')) nextQty = 0;
        if (nextQty === currentQty && !actionEl.matches('[data-cart-remove]')) return;

        try {
          const cart = await changeCart(key, nextQty);
          updateCartUi(cart, modal);
        } catch (_) {}
      });

      modal.addEventListener('change', async (e) => {
        if (!e.target.matches('[data-cart-quantity]')) return;
        const input = e.target;
        const itemEl = input.closest('[data-cart-item]');
        if (!itemEl) return;
        const key = itemEl.getAttribute('data-item-key');
        if (!key) return;
        const qty = Math.max(1, parseInt(input.value, 10) || 1);
        try {
          const cart = await changeCart(key, qty);
          updateCartUi(cart, modal);
        } catch (_) {
          try {
            const cart = await fetchCart();
            updateCartUi(cart, modal);
          } catch (_) {}
        }
      });
    });

    document.addEventListener('cart:updated', async () => {
      const modal = document.querySelector('[data-cart-modal]');
      if (!modal) return;
      try {
        const cart = await fetchCart();
        updateCartUi(cart, modal);
      } catch (_) {}
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('[data-cart-modal]:not([hidden])').forEach((modal) => closeModal(modal));
    });
  };

  const showToast = (message) => {
    const existing = document.getElementById('az-cart-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'az-cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.className = 'az-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('az-toast--visible'));
    setTimeout(() => {
      toast.classList.remove('az-toast--visible');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  const WISHLIST_KEY = 'az_wishlist';

  const getWishlist = () => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  };

  const setWishlist = (items) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
      document.dispatchEvent(new CustomEvent('wishlist:updated'));
    } catch (_) {}
  };

  const addToWishlist = (item) => {
    const list = getWishlist();
    if (list.some((i) => String(i.product_id) === String(item.product_id))) return;
    list.push(item);
    setWishlist(list);
  };

  const removeFromWishlist = (productId) => {
    setWishlist(getWishlist().filter((i) => String(i.product_id) !== String(productId)));
  };

  const isInWishlist = (productId) => getWishlist().some((i) => String(i.product_id) === String(productId));

  const updateWishlistCount = () => {
    const n = getWishlist().length;
    document.querySelectorAll('[data-wishlist-count]').forEach((el) => {
      el.textContent = String(n);
      if (n > 0) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    });
  };

  const syncWishlistButtons = () => {
    document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
      const id = btn.getAttribute('data-product-id');
      if (!id) return;
      const inList = isInWishlist(id);
      btn.classList.toggle('az-prod-card__hover-btn--active', inList);
      btn.setAttribute('aria-label', inList ? 'Remove from wishlist' : 'Add to wishlist');
    });
  };

  const initWishlist = () => {
    updateWishlistCount();
    syncWishlistButtons();
    document.addEventListener('wishlist:updated', () => {
      updateWishlistCount();
      syncWishlistButtons();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-wishlist-toggle]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.az-prod') || btn.closest('[data-product-id]');
      if (!card) return;
      const productId = card.getAttribute('data-product-id');
      let variantId = card.getAttribute('data-variant-id');
      if (card.closest && card.closest('[data-product-page]')) {
        const formInput = card.querySelector('[data-variant-id]');
        if (formInput && formInput.value) variantId = formInput.value;
      }
      const title = card.getAttribute('data-product-title') || '';
      const handle = card.getAttribute('data-product-handle') || '';
      const image = card.getAttribute('data-product-image') || '';
      const price = card.getAttribute('data-price') || '0';
      const url = card.getAttribute('data-product-url') || '';
      if (!productId) return;

      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        btn.classList.remove('az-prod-card__hover-btn--active');
        btn.setAttribute('aria-label', 'Add to wishlist');
      } else {
        addToWishlist({
          product_id: productId,
          variant_id: variantId,
          title,
          handle,
          image,
          price: String(price),
          url
        });
        btn.classList.add('az-prod-card__hover-btn--active');
        btn.setAttribute('aria-label', 'Remove from wishlist');
      }
      updateWishlistCount();
    });
  };

  const formatMoneySimple = (cents) => {
    const value = Number(cents);
    if (!Number.isFinite(value)) return '';
    const format = document.body && document.body.getAttribute('data-shop-money-format');
    if (format) return format.replace(/\{\{amount\}\}/g, (value / 100).toFixed(2)).replace(/\{\{amount_no_decimals\}\}/g, String(Math.round(value / 100)));
    return '€' + (value / 100).toFixed(2);
  };

  const buildWishlistItemsHtml = (list) =>
    list
      .map(
        (item) => `
        <div class="az-wishlist-item" data-wishlist-row data-product-id="${item.product_id}">
          <a href="${(item.url || '').replace(/"/g, '&quot;')}" class="az-wishlist-item__image">
            ${item.image ? `<img src="${item.image.replace(/"/g, '&quot;')}" alt="" loading="lazy" decoding="async" width="120" height="120">` : '<div class="az-wishlist-item__placeholder"></div>'}
          </a>
          <div class="az-wishlist-item__details">
            <a href="${(item.url || '').replace(/"/g, '&quot;')}" class="az-wishlist-item__title">${(item.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>
            <div class="az-wishlist-item__price">${formatMoneySimple(item.price)}</div>
            <div class="az-wishlist-item__actions">
              <button type="button" class="az-wishlist-item__add-cart" data-wishlist-add-cart data-variant-id="${item.variant_id || ''}">Ajouter au panier</button>
              <button type="button" class="az-wishlist-item__remove" data-wishlist-remove aria-label="Remove">Retirer</button>
            </div>
          </div>
        </div>
      `
      )
      .join('');

  const handleWishlistItemClick = async (e, afterRemove) => {
    const target = e.target;
    const row = target.closest('[data-wishlist-row]');
    if (!row) return;
    const productId = row.getAttribute('data-product-id');

    if (target.closest('[data-wishlist-remove]')) {
      e.preventDefault();
      removeFromWishlist(productId);
      if (typeof afterRemove === 'function') afterRemove();
      return;
    }

    if (target.closest('[data-wishlist-add-cart]')) {
      e.preventDefault();
      const btn = target.closest('[data-wishlist-add-cart]');
      const variantId = btn.getAttribute('data-variant-id');
      if (!variantId) return;
      if (btn.disabled) return;
      btn.disabled = true;
      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          if (typeof showToast === 'function') showToast('✓ Ajouté au panier');
          document.dispatchEvent(new CustomEvent('cart:updated'));
        } else if (data.message) {
          if (typeof showToast === 'function') showToast(data.message);
        }
      } catch (_) {}
      btn.disabled = false;
    }
  };

  const initWishlistPage = () => {
    const page = document.querySelector('[data-wishlist-page]');
    if (!page) return;

    const emptyEl = page.querySelector('[data-wishlist-empty]');
    const itemsEl = page.querySelector('[data-wishlist-items]');
    if (!itemsEl) return;

    const render = () => {
      const list = getWishlist();
      if (list.length === 0) {
        if (emptyEl) emptyEl.removeAttribute('hidden');
        itemsEl.innerHTML = '';
        itemsEl.setAttribute('hidden', '');
        return;
      }
      if (emptyEl) emptyEl.setAttribute('hidden', '');
      itemsEl.removeAttribute('hidden');
      itemsEl.innerHTML = buildWishlistItemsHtml(list);
    };

    render();
    document.addEventListener('wishlist:updated', render);

    itemsEl.addEventListener('click', (e) => handleWishlistItemClick(e, render));
  };

  const initWishlistDrawer = () => {
    const drawer = document.querySelector('[data-wishlist-drawer]');
    if (!drawer) return;

    const overlay = drawer.querySelector('[data-wishlist-drawer-close]');
    const closeBtns = drawer.querySelectorAll('[data-wishlist-drawer-close]');
    const titleEl = drawer.querySelector('[data-wishlist-drawer-title]');
    const emptyEl = drawer.querySelector('[data-wishlist-drawer-empty]');
    const itemsEl = drawer.querySelector('[data-wishlist-drawer-items]');
    const footerEl = drawer.querySelector('[data-wishlist-drawer-footer]');
    const contentEl = drawer.querySelector('[data-wishlist-drawer-content]');

    const openDrawer = () => {
      drawer.removeAttribute('hidden');
      if (document.documentElement) document.documentElement.style.overflow = 'hidden';
      renderDrawer();
      const closeBtn = drawer.querySelector('.az-wishlist-drawer__close');
      if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();
    };

    const closeDrawer = () => {
      drawer.setAttribute('hidden', '');
      const cartOpen = document.querySelector('[data-cart-modal]:not([hidden])');
      const menuOpen = document.querySelector('[data-mobile-menu]:not([hidden])');
      if (!cartOpen && !menuOpen && document.documentElement) document.documentElement.style.overflow = '';
    };

    const renderDrawer = () => {
      const list = getWishlist();
      if (titleEl) titleEl.textContent = list.length > 0 ? `Ma liste d'envies (${list.length})` : "Ma liste d'envies";

      if (list.length === 0) {
        if (emptyEl) emptyEl.removeAttribute('hidden');
        if (itemsEl) itemsEl.innerHTML = '';
        if (footerEl) footerEl.setAttribute('hidden', '');
        return;
      }
      if (emptyEl) emptyEl.setAttribute('hidden', '');
      if (footerEl) footerEl.removeAttribute('hidden');
      if (itemsEl) {
        itemsEl.innerHTML = buildWishlistItemsHtml(list);
      }
    };

    document.querySelectorAll('[data-wishlist-toggle-drawer]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });

    closeBtns.forEach((el) => el.addEventListener('click', closeDrawer));
    document.addEventListener('wishlist:updated', renderDrawer);

    if (itemsEl) {
      itemsEl.addEventListener('click', (e) => handleWishlistItemClick(e, renderDrawer));
    }

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (drawer && !drawer.hasAttribute('hidden')) closeDrawer();
    });
  };

  const initQuickAdd = () => {
    document.addEventListener('submit', async (e) => {
      const form = e.target;
      if (!form || !form.classList.contains('az-prod-card__quick-add-form')) return;
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      const formData = new FormData(form);
      try {
        const res = await fetch('/cart/add.js', { method: 'POST', body: formData });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (data.message) showToast(data.message);
          if (submitBtn) submitBtn.disabled = false;
          return;
        }
        showToast('✓ Ajouté au panier');
        document.dispatchEvent(new CustomEvent('cart:updated'));
      } catch (_) {}
      if (submitBtn) submitBtn.disabled = false;
    });
  };

  const initShopPage = () => {
    const shopPage = document.querySelector('[data-shop-page]');
    if (!shopPage) return;

    const grid = shopPage.querySelector('[data-shop-grid]');
    const products = Array.from(shopPage.querySelectorAll('[data-shop-product]'));
    const countEl = shopPage.querySelector('[data-shop-count]');
    const emptyEl = shopPage.querySelector('[data-shop-empty]');
    const sidebar = shopPage.querySelector('[data-shop-sidebar]');
    const sidebarToggle = shopPage.querySelector('[data-shop-sidebar-toggle]');
    const sidebarClose = shopPage.querySelector('[data-shop-sidebar-close]');

    if (!grid || !products.length) return;

    const viewFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') || shopPage.getAttribute('data-shop-view') || '';
    };

    let currentCategory = 'all';
    let currentSort = 'featured';
    let currentView = viewFromUrl();
    let priceMin = 0;
    let priceMax = Infinity;

    const getProductPrice = (product) => {
      return Number(product.getAttribute('data-price')) || 0;
    };

    const getProductCategory = (product) => {
      return product.getAttribute('data-category') || '';
    };

    const productMatchesView = (product) => {
      if (!currentView) return true;
      const attr = product.getAttribute('data-view-' + currentView);
      return attr === 'true';
    };

    const filterProducts = () => {
      let visible = products.filter((product) => {
        if (!productMatchesView(product)) return false;
        const price = getProductPrice(product);
        const category = getProductCategory(product);
        
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        const priceMatch = price >= priceMin && price <= priceMax;
        
        return categoryMatch && priceMatch;
      });

      const sortProducts = (prods) => {
        return [...prods].sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          
          switch (currentSort) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'newest':
              const saleA = a.getAttribute('data-on-sale') === 'true';
              const saleB = b.getAttribute('data-on-sale') === 'true';
              if (saleA && !saleB) return -1;
              if (!saleA && saleB) return 1;
              return 0;
            case 'featured':
            default:
              return 0;
          }
        });
      };

      visible = sortProducts(visible);

      products.forEach((product) => {
        product.setAttribute('hidden', '');
      });

      visible.forEach((product) => {
        product.removeAttribute('hidden');
      });

      if (countEl) {
        countEl.textContent = visible.length;
      }

      if (emptyEl) {
        if (visible.length === 0) {
          emptyEl.removeAttribute('hidden');
        } else {
          emptyEl.setAttribute('hidden', '');
        }
      }
    };

    shopPage.querySelectorAll('[data-shop-filter="category"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          currentCategory = e.target.value;
          filterProducts();
        }
      });
    });

    const sortSelect = shopPage.querySelector('[data-shop-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
      });
    }

    const priceMinInput = shopPage.querySelector('[data-shop-price-min]');
    const priceMaxInput = shopPage.querySelector('[data-shop-price-max]');
    const rangeMin = shopPage.querySelector('[data-shop-range-min]');
    const rangeMax = shopPage.querySelector('[data-shop-range-max]');

    const updatePriceFilter = () => {
      const min = Number(priceMinInput?.value || rangeMin?.value || 0);
      const max = Number(priceMaxInput?.value || rangeMax?.value || Infinity);
      priceMin = min;
      priceMax = max === Infinity ? Infinity : max;
      filterProducts();
    };

    if (priceMinInput) {
      priceMinInput.addEventListener('input', updatePriceFilter);
    }
    if (priceMaxInput) {
      priceMaxInput.addEventListener('input', updatePriceFilter);
    }
    if (rangeMin) {
      rangeMin.addEventListener('input', (e) => {
        if (priceMinInput) priceMinInput.value = e.target.value;
        updatePriceFilter();
      });
    }
    if (rangeMax) {
      rangeMax.addEventListener('input', (e) => {
        if (priceMaxInput) priceMaxInput.value = e.target.value;
        updatePriceFilter();
      });
    }

    const resetBtn = shopPage.querySelector('[data-shop-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSort = 'featured';
        priceMin = 0;
        priceMax = Infinity;
        
        shopPage.querySelector('[data-shop-filter="category"][value="all"]')?.click();
        if (sortSelect) sortSelect.value = 'featured';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (rangeMin) rangeMin.value = rangeMin.min;
        if (rangeMax) rangeMax.value = rangeMax.max;
        
        filterProducts();
      });
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        if (sidebar) sidebar.removeAttribute('hidden');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        if (sidebar) sidebar.setAttribute('hidden', '');
      });
    }

    shopPage.addEventListener('click', (e) => {
      if (e.target === sidebar) {
        sidebar.setAttribute('hidden', '');
      }
    });

    filterProducts();
  };

  const initVoyagePage = () => {
    const voyagePage = document.querySelector('[data-voyage-page]');
    if (!voyagePage) return;

    const grid = voyagePage.querySelector('[data-voyage-grid]');
    const products = Array.from(voyagePage.querySelectorAll('[data-voyage-product]'));
    const countEl = voyagePage.querySelector('[data-voyage-count]');
    const emptyEl = voyagePage.querySelector('[data-voyage-empty]');
    const destinationLabelEl = voyagePage.querySelector('[data-voyage-destination-label]');
    const sidebar = voyagePage.querySelector('[data-voyage-sidebar]');
    const sidebarToggle = voyagePage.querySelector('[data-voyage-sidebar-toggle]');
    const sidebarClose = voyagePage.querySelector('[data-voyage-sidebar-close]');
    const destinationButtons = voyagePage.querySelectorAll('[data-destination]');

    if (!grid || !products.length) return;

    let currentCategory = 'all';
    let currentSort = 'featured';
    let currentDestination = 'all';
    let priceMin = 0;
    let priceMax = Infinity;

    const getProductPrice = (product) => {
      return Number(product.getAttribute('data-price')) || 0;
    };

    const getProductCategory = (product) => {
      return product.getAttribute('data-category') || '';
    };

    const getProductDestination = (product) => {
      return product.getAttribute('data-destination') || 'all';
    };

    const getDestinationLabel = (dest) => {
      const labels = {
        'all': '',
        'paris': 'Paris: ',
        'santorini': 'Santorini: ',
        'tokyo': 'Tokyo: ',
        'bali': 'Bali: ',
        'maldives': 'Maldives: '
      };
      return labels[dest] || '';
    };

    const filterProducts = () => {
      let visible = products.filter((product) => {
        const price = getProductPrice(product);
        const category = getProductCategory(product);
        const destination = getProductDestination(product);
        
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        const priceMatch = price >= priceMin && price <= priceMax;
        const destinationMatch = currentDestination === 'all' || destination === currentDestination;
        
        return categoryMatch && priceMatch && destinationMatch;
      });

      const sortProducts = (prods) => {
        return [...prods].sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          
          switch (currentSort) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'newest':
              const saleA = a.getAttribute('data-on-sale') === 'true';
              const saleB = b.getAttribute('data-on-sale') === 'true';
              if (saleA && !saleB) return -1;
              if (!saleA && saleB) return 1;
              return 0;
            case 'featured':
            default:
              return 0;
          }
        });
      };

      visible = sortProducts(visible);

      products.forEach((product) => {
        product.setAttribute('hidden', '');
      });

      visible.forEach((product) => {
        product.removeAttribute('hidden');
      });

      if (countEl) {
        countEl.textContent = visible.length;
      }

      if (destinationLabelEl) {
        destinationLabelEl.textContent = getDestinationLabel(currentDestination);
      }

      if (emptyEl) {
        if (visible.length === 0) {
          emptyEl.removeAttribute('hidden');
        } else {
          emptyEl.setAttribute('hidden', '');
        }
      }
    };

    destinationButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        destinationButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentDestination = btn.getAttribute('data-destination') || 'all';
        filterProducts();
      });
    });

    voyagePage.querySelectorAll('[data-voyage-filter="category"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          currentCategory = e.target.value;
          filterProducts();
        }
      });
    });

    const sortSelect = voyagePage.querySelector('[data-voyage-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
      });
    }

    const priceMinInput = voyagePage.querySelector('[data-voyage-price-min]');
    const priceMaxInput = voyagePage.querySelector('[data-voyage-price-max]');
    const rangeMin = voyagePage.querySelector('[data-voyage-range-min]');
    const rangeMax = voyagePage.querySelector('[data-voyage-range-max]');

    const updatePriceFilter = () => {
      const min = Number(priceMinInput?.value || rangeMin?.value || 0);
      const max = Number(priceMaxInput?.value || rangeMax?.value || Infinity);
      priceMin = min;
      priceMax = max === Infinity ? Infinity : max;
      filterProducts();
    };

    if (priceMinInput) {
      priceMinInput.addEventListener('input', updatePriceFilter);
    }
    if (priceMaxInput) {
      priceMaxInput.addEventListener('input', updatePriceFilter);
    }
    if (rangeMin) {
      rangeMin.addEventListener('input', (e) => {
        if (priceMinInput) priceMinInput.value = e.target.value;
        updatePriceFilter();
      });
    }
    if (rangeMax) {
      rangeMax.addEventListener('input', (e) => {
        if (priceMaxInput) priceMaxInput.value = e.target.value;
        updatePriceFilter();
      });
    }

    const resetBtn = voyagePage.querySelector('[data-voyage-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSort = 'featured';
        currentDestination = 'all';
        priceMin = 0;
        priceMax = Infinity;
        
        voyagePage.querySelector('[data-voyage-filter="category"][value="all"]')?.click();
        if (sortSelect) sortSelect.value = 'featured';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (rangeMin) rangeMin.value = rangeMin.min;
        if (rangeMax) rangeMax.value = rangeMax.max;
        
        destinationButtons.forEach((b) => b.classList.remove('is-active'));
        const allBtn = voyagePage.querySelector('[data-destination="all"]');
        if (allBtn) allBtn.classList.add('is-active');
        
        filterProducts();
      });
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        if (sidebar) sidebar.removeAttribute('hidden');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        if (sidebar) sidebar.setAttribute('hidden', '');
      });
    }

    voyagePage.addEventListener('click', (e) => {
      if (e.target === sidebar) {
        sidebar.setAttribute('hidden', '');
      }
    });

    filterProducts();
  };

  const initProductPage = () => {
    const productPage = document.querySelector('[data-product-page]');
    if (!productPage) return;

    // Gallery
    const galleryMain = productPage.querySelector('[data-product-gallery-main]');
    const galleryThumbs = productPage.querySelectorAll('[data-gallery-thumb]');
    const galleryItems = productPage.querySelectorAll('[data-gallery-index]');
    const zoomContainer = productPage.querySelector('[data-gallery-zoom]');

    galleryThumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const index = thumb.getAttribute('data-gallery-thumb');
        galleryItems.forEach((item) => {
          item.classList.remove('is-active');
          if (item.getAttribute('data-gallery-index') === index) {
            item.classList.add('is-active');
          }
        });
        galleryThumbs.forEach((t) => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });

    // Gallery zoom (hover)
    if (zoomContainer) {
      const mainWrap = zoomContainer.querySelector('[data-product-gallery-main]');
      const activeImage = () => mainWrap && mainWrap.querySelector('.az-product__gallery-item.is-active img');
      const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced && activeImage()) {
        zoomContainer.classList.add('az-product__gallery-zoom--enabled');
        zoomContainer.addEventListener('mouseenter', () => zoomContainer.classList.add('is-zooming'));
        zoomContainer.addEventListener('mouseleave', () => zoomContainer.classList.remove('is-zooming'));
        zoomContainer.addEventListener('mousemove', (e) => {
          const rect = zoomContainer.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          const img = activeImage();
          if (img) {
            img.style.transformOrigin = `${x}% ${y}%`;
          }
        });
      }
    }

    // Variants
    const variantOptions = productPage.querySelectorAll('[data-variant-option]');
    const variantSelects = productPage.querySelectorAll('[data-variant-select]');
    const variantIdInput = productPage.querySelector('[data-variant-id]');

    const updateVariant = () => {
      const selectedOptions = {};
      variantSelects.forEach((select) => {
        const optionName = select.id.replace(/^Option-.*-/, '').replace(/-/g, ' ');
        selectedOptions[optionName] = select.value;
      });

      // Find matching variant (simplified - in production, use Shopify's variant selection API)
      const productData = window.productData || {};
      if (productData.variants) {
        const matchingVariant = productData.variants.find((v) => {
          return v.options.every((opt, idx) => {
            const optionName = productData.options[idx]?.name || '';
            return selectedOptions[optionName] === opt;
          });
        });
        
        if (matchingVariant && variantIdInput) {
          variantIdInput.value = matchingVariant.id;
        }
      }
    };

    variantOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const optionName = option.getAttribute('data-option');
        const value = option.getAttribute('data-value');
        const optionIndex = option.getAttribute('data-option-index');
        
        // Update button states
        productPage.querySelectorAll(`[data-option="${optionName}"]`).forEach((opt) => {
          opt.classList.remove('is-selected');
        });
        option.classList.add('is-selected');
        
        // Update select
        const select = productPage.querySelector(`[data-variant-select][id*="Option-${optionIndex}"]`);
        if (select) {
          select.value = value;
          updateVariant();
        }
      });
    });

    variantSelects.forEach((select) => {
      select.addEventListener('change', updateVariant);
    });

    // Quantity
    const qtyInput = productPage.querySelector('[data-qty-input]');
    const qtyDecrease = productPage.querySelector('[data-qty-decrease]');
    const qtyIncrease = productPage.querySelector('[data-qty-increase]');

    if (qtyDecrease) {
      qtyDecrease.addEventListener('click', () => {
        if (qtyInput) {
          const current = parseInt(qtyInput.value) || 1;
          qtyInput.value = Math.max(1, current - 1);
        }
      });
    }

    if (qtyIncrease) {
      qtyIncrease.addEventListener('click', () => {
        if (qtyInput) {
          const current = parseInt(qtyInput.value) || 1;
          qtyInput.value = Math.min(99, current + 1);
        }
      });
    }

    // Accordions
    const accordionHeaders = productPage.querySelectorAll('[data-accordion-toggle]');
    accordionHeaders.forEach((header) => {
      header.addEventListener('click', () => {
        const accordion = header.closest('.az-product__accordion');
        const isOpen = accordion.classList.contains('is-open');
        productPage.querySelectorAll('.az-product__accordion').forEach((acc) => {
          acc.classList.remove('is-open');
          const h = acc.querySelector('[data-accordion-toggle]');
          if (h) h.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          accordion.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Add to cart
    const addBtn = productPage.querySelector('[data-add-to-cart]');
    const addText = productPage.querySelector('[data-add-text]');
    const addedText = productPage.querySelector('[data-added-text]');
    const mobileAddBtn = productPage.querySelector('[data-mobile-add-to-cart]');

    const handleAddToCart = async (e) => {
      e.preventDefault();
      
      const form = productPage.querySelector('form');
      if (!form) return;

      if (addBtn) {
        addBtn.classList.add('is-added');
        if (addText) addText.setAttribute('hidden', '');
        if (addedText) addedText.removeAttribute('hidden');
        
        setTimeout(() => {
          addBtn.classList.remove('is-added');
          if (addText) addText.removeAttribute('hidden');
          if (addedText) addedText.setAttribute('hidden', '');
        }, 1800);
      }

      // Submit form
      const formData = new FormData(form);
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          // Trigger cart update
          document.dispatchEvent(new CustomEvent('cart:updated'));
          
          // Open cart modal if available
          const cartToggle = document.querySelector('[data-cart-toggle]');
          if (cartToggle) {
            cartToggle.click();
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    };

    if (addBtn) {
      addBtn.addEventListener('click', handleAddToCart);
    }

    if (mobileAddBtn) {
      mobileAddBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (addBtn) {
          addBtn.click();
        }
      });
    }

    // Mobile bar visibility
    const mobileBar = productPage.querySelector('[data-product-mobile-bar]');
    if (mobileBar) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mobileBar.style.display = 'none';
          } else {
            mobileBar.style.display = 'block';
          }
        });
      }, {
        rootMargin: '-100px 0px'
      });

      const purchaseCard = productPage.querySelector('.az-product__purchase');
      if (purchaseCard) {
        observer.observe(purchaseCard);
      }
    }
  };

  const initPerfumesPage = () => {
    const perfumesPage = document.querySelector('[data-perfumes-page]');
    if (!perfumesPage) return;

    const grid = perfumesPage.querySelector('[data-perfumes-grid]');
    const products = Array.from(perfumesPage.querySelectorAll('[data-perfumes-product]'));
    const countEl = perfumesPage.querySelector('[data-perfumes-count]');
    const emptyEl = perfumesPage.querySelector('[data-perfumes-empty]');
    const profileLabelEl = perfumesPage.querySelector('[data-perfumes-profile-label]');
    const sidebar = perfumesPage.querySelector('[data-perfumes-sidebar]');
    const sidebarToggle = perfumesPage.querySelector('[data-perfumes-sidebar-toggle]');
    const sidebarClose = perfumesPage.querySelector('[data-perfumes-sidebar-close]');
    const profileButtons = perfumesPage.querySelectorAll('[data-profile]');

    if (!grid || !products.length) return;

    let currentCategory = 'all';
    let currentSort = 'featured';
    let currentProfile = 'all';
    let priceMin = 0;
    let priceMax = Infinity;

    const getProductPrice = (product) => {
      return Number(product.getAttribute('data-price')) || 0;
    };

    const getProductCategory = (product) => {
      return product.getAttribute('data-category') || '';
    };

    const getProductProfile = (product) => {
      return product.getAttribute('data-scent-profile') || 'all';
    };

    const getProfileLabel = (profile) => {
      if (profile === 'all') return 'All Fragrances';
      return profile.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const filterProducts = () => {
      let visible = products.filter((product) => {
        const price = getProductPrice(product);
        const category = getProductCategory(product);
        const profile = getProductProfile(product);
        
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        const priceMatch = price >= priceMin && price <= priceMax;
        const profileMatch = currentProfile === 'all' || profile === currentProfile;
        
        return categoryMatch && priceMatch && profileMatch;
      });

      const sortProducts = (prods) => {
        return [...prods].sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          
          switch (currentSort) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'newest':
              const saleA = a.getAttribute('data-on-sale') === 'true';
              const saleB = b.getAttribute('data-on-sale') === 'true';
              if (saleA && !saleB) return -1;
              if (!saleA && saleB) return 1;
              return 0;
            case 'featured':
            default:
              return 0;
          }
        });
      };

      visible = sortProducts(visible);

      products.forEach((product) => {
        product.setAttribute('hidden', '');
      });

      visible.forEach((product) => {
        product.removeAttribute('hidden');
      });

      if (countEl) {
        countEl.textContent = visible.length;
      }

      if (profileLabelEl) {
        profileLabelEl.textContent = getProfileLabel(currentProfile);
      }

      if (emptyEl) {
        if (visible.length === 0) {
          emptyEl.removeAttribute('hidden');
        } else {
          emptyEl.setAttribute('hidden', '');
        }
      }
    };

    profileButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        profileButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentProfile = btn.getAttribute('data-profile') || 'all';
        filterProducts();
      });
    });

    perfumesPage.querySelectorAll('[data-perfumes-filter="category"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          currentCategory = e.target.value;
          filterProducts();
        }
      });
    });

    const sortSelect = perfumesPage.querySelector('[data-perfumes-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
      });
    }

    const priceMinInput = perfumesPage.querySelector('[data-perfumes-price-min]');
    const priceMaxInput = perfumesPage.querySelector('[data-perfumes-price-max]');
    const rangeMin = perfumesPage.querySelector('[data-perfumes-range-min]');
    const rangeMax = perfumesPage.querySelector('[data-perfumes-range-max]');

    const updatePriceFilter = () => {
      const min = Number(priceMinInput?.value || rangeMin?.value || 0);
      const max = Number(priceMaxInput?.value || rangeMax?.value || Infinity);
      priceMin = min;
      priceMax = max === Infinity ? Infinity : max;
      filterProducts();
    };

    if (priceMinInput) {
      priceMinInput.addEventListener('input', updatePriceFilter);
    }
    if (priceMaxInput) {
      priceMaxInput.addEventListener('input', updatePriceFilter);
    }
    if (rangeMin) {
      rangeMin.addEventListener('input', (e) => {
        if (priceMinInput) priceMinInput.value = e.target.value;
        updatePriceFilter();
      });
    }
    if (rangeMax) {
      rangeMax.addEventListener('input', (e) => {
        if (priceMaxInput) priceMaxInput.value = e.target.value;
        updatePriceFilter();
      });
    }

    const resetBtn = perfumesPage.querySelector('[data-perfumes-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSort = 'featured';
        currentProfile = 'all';
        priceMin = 0;
        priceMax = Infinity;
        
        perfumesPage.querySelector('[data-perfumes-filter="category"][value="all"]')?.click();
        if (sortSelect) sortSelect.value = 'featured';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (rangeMin) rangeMin.value = rangeMin.min;
        if (rangeMax) rangeMax.value = rangeMax.max;
        
        profileButtons.forEach((b) => b.classList.remove('is-active'));
        const allBtn = perfumesPage.querySelector('[data-profile="all"]');
        if (allBtn) allBtn.classList.add('is-active');
        
        filterProducts();
      });
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        if (sidebar) sidebar.removeAttribute('hidden');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        if (sidebar) sidebar.setAttribute('hidden', '');
      });
    }

    perfumesPage.addEventListener('click', (e) => {
      if (e.target === sidebar) {
        sidebar.setAttribute('hidden', '');
      }
    });

    filterProducts();
  };

  const initNewPage = () => {
    const newPage = document.querySelector('[data-new-page]');
    if (!newPage) return;

    const grid = newPage.querySelector('[data-new-grid]');
    const products = Array.from(newPage.querySelectorAll('[data-new-product]'));
    const countEl = newPage.querySelector('[data-new-count]');
    const emptyEl = newPage.querySelector('[data-new-empty]');
    const sidebar = newPage.querySelector('[data-new-sidebar]');
    const sidebarToggle = newPage.querySelector('[data-new-sidebar-toggle]');
    const sidebarClose = newPage.querySelector('[data-new-sidebar-close]');

    if (!grid || !products.length) return;

    let currentCategory = 'all';
    let currentSort = 'featured';
    let priceMin = 0;
    let priceMax = Infinity;

    const getProductPrice = (product) => {
      return Number(product.getAttribute('data-price')) || 0;
    };

    const getProductCategory = (product) => {
      return product.getAttribute('data-category') || '';
    };

    const filterProducts = () => {
      let visible = products.filter((product) => {
        const price = getProductPrice(product);
        const category = getProductCategory(product);
        
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        const priceMatch = price >= priceMin && price <= priceMax;
        
        return categoryMatch && priceMatch;
      });

      const sortProducts = (prods) => {
        return [...prods].sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          
          switch (currentSort) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'newest':
              const newA = a.getAttribute('data-is-new') === 'true';
              const newB = b.getAttribute('data-is-new') === 'true';
              if (newA && !newB) return -1;
              if (!newA && newB) return 1;
              return 0;
            case 'featured':
            default:
              return 0;
          }
        });
      };

      visible = sortProducts(visible);

      products.forEach((product) => {
        product.setAttribute('hidden', '');
      });

      visible.forEach((product) => {
        product.removeAttribute('hidden');
      });

      if (countEl) {
        countEl.textContent = visible.length;
      }

      if (emptyEl) {
        if (visible.length === 0) {
          emptyEl.removeAttribute('hidden');
        } else {
          emptyEl.setAttribute('hidden', '');
        }
      }
    };

    newPage.querySelectorAll('[data-new-filter="category"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          currentCategory = e.target.value;
          filterProducts();
        }
      });
    });

    const sortSelect = newPage.querySelector('[data-new-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
      });
    }

    const priceMinInput = newPage.querySelector('[data-new-price-min]');
    const priceMaxInput = newPage.querySelector('[data-new-price-max]');
    const rangeMin = newPage.querySelector('[data-new-range-min]');
    const rangeMax = newPage.querySelector('[data-new-range-max]');

    const updatePriceFilter = () => {
      const min = Number(priceMinInput?.value || rangeMin?.value || 0);
      const max = Number(priceMaxInput?.value || rangeMax?.value || Infinity);
      priceMin = min;
      priceMax = max === Infinity ? Infinity : max;
      filterProducts();
    };

    if (priceMinInput) {
      priceMinInput.addEventListener('input', updatePriceFilter);
    }
    if (priceMaxInput) {
      priceMaxInput.addEventListener('input', updatePriceFilter);
    }
    if (rangeMin) {
      rangeMin.addEventListener('input', (e) => {
        if (priceMinInput) priceMinInput.value = e.target.value;
        updatePriceFilter();
      });
    }
    if (rangeMax) {
      rangeMax.addEventListener('input', (e) => {
        if (priceMaxInput) priceMaxInput.value = e.target.value;
        updatePriceFilter();
      });
    }

    const resetBtn = newPage.querySelector('[data-new-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSort = 'featured';
        priceMin = 0;
        priceMax = Infinity;
        
        newPage.querySelector('[data-new-filter="category"][value="all"]')?.click();
        if (sortSelect) sortSelect.value = 'featured';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (rangeMin) rangeMin.value = rangeMin.min;
        if (rangeMax) rangeMax.value = rangeMax.max;
        
        filterProducts();
      });
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        if (sidebar) sidebar.removeAttribute('hidden');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        if (sidebar) sidebar.setAttribute('hidden', '');
      });
    }

    newPage.addEventListener('click', (e) => {
      if (e.target === sidebar) {
        sidebar.setAttribute('hidden', '');
      }
    });

    filterProducts();
  };

  const initContactPage = () => {
    const contactPage = document.querySelector('[data-contact-page]');
    if (!contactPage) return;

    const form = contactPage.querySelector('[data-contact-form]');
    const successState = contactPage.querySelector('[data-contact-success]');
    const resetBtn = contactPage.querySelector('[data-contact-reset]');
    const submitBtn = contactPage.querySelector('[data-contact-submit]');
    const nameInput = contactPage.querySelector('[data-contact-name]');
    const emailInput = contactPage.querySelector('[data-contact-email]');
    const messageInput = contactPage.querySelector('[data-contact-message]');

    if (!form) return;

    const validateEmail = (email) => {
      return /^\S+@\S+\.\S+$/.test(email);
    };

    const validateForm = () => {
      const errors = {};
      let isValid = true;

      if (!nameInput || !nameInput.value.trim()) {
        errors.name = 'Name is required';
        isValid = false;
      }

      if (!emailInput || !emailInput.value.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!validateEmail(emailInput.value)) {
        errors.email = 'Email is invalid';
        isValid = false;
      }

      if (!messageInput || !messageInput.value.trim()) {
        errors.message = 'Message is required';
        isValid = false;
      }

      return { isValid, errors };
    };

    const showFieldError = (input, message) => {
      if (!input) return;
      
      input.style.borderColor = 'var(--color-error)';
      
      let errorEl = input.parentElement.querySelector('.az-contact__error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'az-contact__error';
        input.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = message;
    };

    const clearFieldError = (input) => {
      if (!input) return;
      
      input.style.borderColor = '';
      const errorEl = input.parentElement.querySelector('.az-contact__error');
      if (errorEl) {
        errorEl.remove();
      }
    };

    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        if (!nameInput.value.trim()) {
          showFieldError(nameInput, 'Name is required');
        } else {
          clearFieldError(nameInput);
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        if (!emailInput.value.trim()) {
          showFieldError(emailInput, 'Email is required');
        } else if (!validateEmail(emailInput.value)) {
          showFieldError(emailInput, 'Email is invalid');
        } else {
          clearFieldError(emailInput);
        }
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', () => {
        if (!messageInput.value.trim()) {
          showFieldError(messageInput, 'Message is required');
        } else {
          clearFieldError(messageInput);
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        const { isValid, errors } = validateForm();
        
        if (!isValid) {
          e.preventDefault();
          
          if (errors.name && nameInput) showFieldError(nameInput, errors.name);
          if (errors.email && emailInput) showFieldError(emailInput, errors.email);
          if (errors.message && messageInput) showFieldError(messageInput, errors.message);
          
          return false;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (form) form.removeAttribute('hidden');
        if (successState) successState.setAttribute('hidden', '');
        
        if (nameInput) {
          nameInput.value = '';
          clearFieldError(nameInput);
        }
        if (emailInput) {
          emailInput.value = '';
          clearFieldError(emailInput);
        }
        if (messageInput) {
          messageInput.value = '';
          clearFieldError(messageInput);
        }
      });
    }
  };

  const initCandlesPage = () => {
    const candlesPage = document.querySelector('[data-candles-page]');
    if (!candlesPage) return;

    const grid = candlesPage.querySelector('[data-candles-grid]');
    const products = Array.from(candlesPage.querySelectorAll('[data-candles-product]'));
    const countEl = candlesPage.querySelector('[data-candles-count]');
    const emptyEl = candlesPage.querySelector('[data-candles-empty]');
    const familyLabelEl = candlesPage.querySelector('[data-candles-family-label]');
    const sidebar = candlesPage.querySelector('[data-candles-sidebar]');
    const sidebarToggle = candlesPage.querySelector('[data-candles-sidebar-toggle]');
    const sidebarClose = candlesPage.querySelector('[data-candles-sidebar-close]');
    const familyButtons = candlesPage.querySelectorAll('[data-family]');

    if (!grid || !products.length) return;

    let currentCategory = 'all';
    let currentSort = 'featured';
    let currentFamily = 'all';
    let priceMin = 0;
    let priceMax = Infinity;

    const getProductPrice = (product) => {
      return Number(product.getAttribute('data-price')) || 0;
    };

    const getProductCategory = (product) => {
      return product.getAttribute('data-category') || '';
    };

    const getProductFamily = (product) => {
      return product.getAttribute('data-scent-family') || 'all';
    };

    const getFamilyLabel = (family) => {
      if (family === 'all') return 'All Candles';
      return family.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Collection';
    };

    const filterProducts = () => {
      let visible = products.filter((product) => {
        const price = getProductPrice(product);
        const category = getProductCategory(product);
        const family = getProductFamily(product);
        
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        const priceMatch = price >= priceMin && price <= priceMax;
        const familyMatch = currentFamily === 'all' || family === currentFamily;
        
        return categoryMatch && priceMatch && familyMatch;
      });

      const sortProducts = (prods) => {
        return [...prods].sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          
          switch (currentSort) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'newest':
              const saleA = a.getAttribute('data-on-sale') === 'true';
              const saleB = b.getAttribute('data-on-sale') === 'true';
              if (saleA && !saleB) return -1;
              if (!saleA && saleB) return 1;
              return 0;
            case 'featured':
            default:
              return 0;
          }
        });
      };

      visible = sortProducts(visible);

      products.forEach((product) => {
        product.setAttribute('hidden', '');
      });

      visible.forEach((product) => {
        product.removeAttribute('hidden');
      });

      if (countEl) {
        countEl.textContent = visible.length;
      }

      if (familyLabelEl) {
        familyLabelEl.textContent = getFamilyLabel(currentFamily);
      }

      if (emptyEl) {
        if (visible.length === 0) {
          emptyEl.removeAttribute('hidden');
        } else {
          emptyEl.setAttribute('hidden', '');
        }
      }
    };

    familyButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        familyButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentFamily = btn.getAttribute('data-family') || 'all';
        filterProducts();
      });
    });

    candlesPage.querySelectorAll('[data-candles-filter="category"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          currentCategory = e.target.value;
          filterProducts();
        }
      });
    });

    const sortSelect = candlesPage.querySelector('[data-candles-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
      });
    }

    const priceMinInput = candlesPage.querySelector('[data-candles-price-min]');
    const priceMaxInput = candlesPage.querySelector('[data-candles-price-max]');
    const rangeMin = candlesPage.querySelector('[data-candles-range-min]');
    const rangeMax = candlesPage.querySelector('[data-candles-range-max]');

    const updatePriceFilter = () => {
      const min = Number(priceMinInput?.value || rangeMin?.value || 0);
      const max = Number(priceMaxInput?.value || rangeMax?.value || Infinity);
      priceMin = min;
      priceMax = max === Infinity ? Infinity : max;
      filterProducts();
    };

    if (priceMinInput) {
      priceMinInput.addEventListener('input', updatePriceFilter);
    }
    if (priceMaxInput) {
      priceMaxInput.addEventListener('input', updatePriceFilter);
    }
    if (rangeMin) {
      rangeMin.addEventListener('input', (e) => {
        if (priceMinInput) priceMinInput.value = e.target.value;
        updatePriceFilter();
      });
    }
    if (rangeMax) {
      rangeMax.addEventListener('input', (e) => {
        if (priceMaxInput) priceMaxInput.value = e.target.value;
        updatePriceFilter();
      });
    }

    const resetBtn = candlesPage.querySelector('[data-candles-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSort = 'featured';
        currentFamily = 'all';
        priceMin = 0;
        priceMax = Infinity;
        
        candlesPage.querySelector('[data-candles-filter="category"][value="all"]')?.click();
        if (sortSelect) sortSelect.value = 'featured';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (rangeMin) rangeMin.value = rangeMin.min;
        if (rangeMax) rangeMax.value = rangeMax.max;
        
        familyButtons.forEach((b) => b.classList.remove('is-active'));
        const allBtn = candlesPage.querySelector('[data-family="all"]');
        if (allBtn) allBtn.classList.add('is-active');
        
        filterProducts();
      });
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        if (sidebar) sidebar.removeAttribute('hidden');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        if (sidebar) sidebar.setAttribute('hidden', '');
      });
    }

    candlesPage.addEventListener('click', (e) => {
      if (e.target === sidebar) {
        sidebar.setAttribute('hidden', '');
      }
    });

    filterProducts();
  };

  const initSalePage = () => {
    const salePage = document.querySelector('[data-sale-page]');
    if (!salePage) return;

    const grid = salePage.querySelector('[data-sale-grid]');
    const products = Array.from(salePage.querySelectorAll('[data-sale-product]'));
    const countEl = salePage.querySelector('[data-sale-count]');
    const emptyEl = salePage.querySelector('[data-sale-empty]');
    const sidebar = salePage.querySelector('[data-sale-sidebar]');
    const sidebarToggle = salePage.querySelector('[data-sale-sidebar-toggle]');
    const sidebarClose = salePage.querySelector('[data-sale-sidebar-close]');

    if (!grid || !products.length) return;

    let currentCategory = 'all';
    let currentSort = 'featured';
    let priceMin = 0;
    let priceMax = Infinity;

    const getProductPrice = (product) => {
      return Number(product.getAttribute('data-price')) || 0;
    };

    const getProductCategory = (product) => {
      return product.getAttribute('data-category') || '';
    };

    const getProductDiscount = (product) => {
      return Number(product.getAttribute('data-discount')) || 0;
    };

    const filterProducts = () => {
      let visible = products.filter((product) => {
        const price = getProductPrice(product);
        const category = getProductCategory(product);
        
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        const priceMatch = price >= priceMin && price <= priceMax;
        
        return categoryMatch && priceMatch;
      });

      const sortProducts = (prods) => {
        return [...prods].sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          const discountA = getProductDiscount(a);
          const discountB = getProductDiscount(b);
          
          switch (currentSort) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'discount-desc':
              return discountB - discountA;
            case 'featured':
            default:
              return 0;
          }
        });
      };

      visible = sortProducts(visible);

      products.forEach((product) => {
        product.setAttribute('hidden', '');
      });

      visible.forEach((product) => {
        product.removeAttribute('hidden');
      });

      if (countEl) {
        countEl.textContent = visible.length;
      }

      if (emptyEl) {
        if (visible.length === 0) {
          emptyEl.removeAttribute('hidden');
        } else {
          emptyEl.setAttribute('hidden', '');
        }
      }
    };

    salePage.querySelectorAll('[data-sale-filter="category"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          currentCategory = e.target.value;
          filterProducts();
        }
      });
    });

    const sortSelect = salePage.querySelector('[data-sale-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
      });
    }

    const priceMinInput = salePage.querySelector('[data-sale-price-min]');
    const priceMaxInput = salePage.querySelector('[data-sale-price-max]');
    const rangeMin = salePage.querySelector('[data-sale-range-min]');
    const rangeMax = salePage.querySelector('[data-sale-range-max]');

    const updatePriceFilter = () => {
      const min = Number(priceMinInput?.value || rangeMin?.value || 0);
      const max = Number(priceMaxInput?.value || rangeMax?.value || Infinity);
      priceMin = min;
      priceMax = max === Infinity ? Infinity : max;
      filterProducts();
    };

    if (priceMinInput) {
      priceMinInput.addEventListener('input', updatePriceFilter);
    }
    if (priceMaxInput) {
      priceMaxInput.addEventListener('input', updatePriceFilter);
    }
    if (rangeMin) {
      rangeMin.addEventListener('input', (e) => {
        if (priceMinInput) priceMinInput.value = e.target.value;
        updatePriceFilter();
      });
    }
    if (rangeMax) {
      rangeMax.addEventListener('input', (e) => {
        if (priceMaxInput) priceMaxInput.value = e.target.value;
        updatePriceFilter();
      });
    }

    const resetBtn = salePage.querySelector('[data-sale-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSort = 'featured';
        priceMin = 0;
        priceMax = Infinity;
        
        salePage.querySelector('[data-sale-filter="category"][value="all"]')?.click();
        if (sortSelect) sortSelect.value = 'featured';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (rangeMin) rangeMin.value = rangeMin.min;
        if (rangeMax) rangeMax.value = rangeMax.max;
        
        filterProducts();
      });
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        if (sidebar) sidebar.removeAttribute('hidden');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        if (sidebar) sidebar.setAttribute('hidden', '');
      });
    }

    salePage.addEventListener('click', (e) => {
      if (e.target === sidebar) {
        sidebar.setAttribute('hidden', '');
      }
    });

    filterProducts();
  };

  const initDiffusersPage = () => {
    const diffusersPage = document.querySelector('[data-diffusers-page]');
    if (!diffusersPage) return;

    const grid = diffusersPage.querySelector('[data-diffusers-grid]');
    const products = Array.from(diffusersPage.querySelectorAll('[data-diffusers-product]'));
    const countEl = diffusersPage.querySelector('[data-diffusers-count]');
    const emptyEl = diffusersPage.querySelector('[data-diffusers-empty]');
    const sidebar = diffusersPage.querySelector('[data-diffusers-sidebar]');
    const sidebarToggle = diffusersPage.querySelector('[data-diffusers-sidebar-toggle]');
    const sidebarClose = diffusersPage.querySelector('[data-diffusers-sidebar-close]');

    if (!grid || !products.length) return;

    let currentCategory = 'all';
    let currentSort = 'featured';
    let priceMin = 0;
    let priceMax = Infinity;

    const getProductPrice = (product) => {
      return Number(product.getAttribute('data-price')) || 0;
    };

    const getProductCategory = (product) => {
      return product.getAttribute('data-category') || '';
    };

    const filterProducts = () => {
      let visible = products.filter((product) => {
        const price = getProductPrice(product);
        const category = getProductCategory(product);
        
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        const priceMatch = price >= priceMin && price <= priceMax;
        
        return categoryMatch && priceMatch;
      });

      const sortProducts = (prods) => {
        return [...prods].sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          
          switch (currentSort) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'newest':
              const saleA = a.getAttribute('data-on-sale') === 'true';
              const saleB = b.getAttribute('data-on-sale') === 'true';
              if (saleA && !saleB) return -1;
              if (!saleA && saleB) return 1;
              return 0;
            case 'featured':
            default:
              return 0;
          }
        });
      };

      visible = sortProducts(visible);

      products.forEach((product) => {
        product.setAttribute('hidden', '');
      });

      visible.forEach((product) => {
        product.removeAttribute('hidden');
      });

      if (countEl) {
        countEl.textContent = visible.length;
      }

      if (emptyEl) {
        if (visible.length === 0) {
          emptyEl.removeAttribute('hidden');
        } else {
          emptyEl.setAttribute('hidden', '');
        }
      }
    };

    diffusersPage.querySelectorAll('[data-diffusers-filter="category"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          currentCategory = e.target.value;
          filterProducts();
        }
      });
    });

    const sortSelect = diffusersPage.querySelector('[data-diffusers-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
      });
    }

    const priceMinInput = diffusersPage.querySelector('[data-diffusers-price-min]');
    const priceMaxInput = diffusersPage.querySelector('[data-diffusers-price-max]');
    const rangeMin = diffusersPage.querySelector('[data-diffusers-range-min]');
    const rangeMax = diffusersPage.querySelector('[data-diffusers-range-max]');

    const updatePriceFilter = () => {
      const min = Number(priceMinInput?.value || rangeMin?.value || 0);
      const max = Number(priceMaxInput?.value || rangeMax?.value || Infinity);
      priceMin = min;
      priceMax = max === Infinity ? Infinity : max;
      filterProducts();
    };

    if (priceMinInput) {
      priceMinInput.addEventListener('input', updatePriceFilter);
    }
    if (priceMaxInput) {
      priceMaxInput.addEventListener('input', updatePriceFilter);
    }
    if (rangeMin) {
      rangeMin.addEventListener('input', (e) => {
        if (priceMinInput) priceMinInput.value = e.target.value;
        updatePriceFilter();
      });
    }
    if (rangeMax) {
      rangeMax.addEventListener('input', (e) => {
        if (priceMaxInput) priceMaxInput.value = e.target.value;
        updatePriceFilter();
      });
    }

    const resetBtn = diffusersPage.querySelector('[data-diffusers-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSort = 'featured';
        priceMin = 0;
        priceMax = Infinity;
        
        diffusersPage.querySelector('[data-diffusers-filter="category"][value="all"]')?.click();
        if (sortSelect) sortSelect.value = 'featured';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (rangeMin) rangeMin.value = rangeMin.min;
        if (rangeMax) rangeMax.value = rangeMax.max;
        
        filterProducts();
      });
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        if (sidebar) sidebar.removeAttribute('hidden');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        if (sidebar) sidebar.setAttribute('hidden', '');
      });
    }

    diffusersPage.addEventListener('click', (e) => {
      if (e.target === sidebar) {
        sidebar.setAttribute('hidden', '');
      }
    });

    filterProducts();
  };

  const initOilsPage = () => {
    const oilsPage = document.querySelector('[data-oils-page]');
    if (!oilsPage) return;

    const grid = oilsPage.querySelector('[data-oils-grid]');
    const products = Array.from(oilsPage.querySelectorAll('[data-oils-product]'));
    const countEl = oilsPage.querySelector('[data-oils-count]');
    const emptyEl = oilsPage.querySelector('[data-oils-empty]');
    const sidebar = oilsPage.querySelector('[data-oils-sidebar]');
    const sidebarToggle = oilsPage.querySelector('[data-oils-sidebar-toggle]');
    const sidebarClose = oilsPage.querySelector('[data-oils-sidebar-close]');

    if (!grid || !products.length) return;

    let currentCategory = 'all';
    let currentSort = 'featured';
    let priceMin = 0;
    let priceMax = Infinity;

    const getProductPrice = (product) => {
      return Number(product.getAttribute('data-price')) || 0;
    };

    const getProductCategory = (product) => {
      return product.getAttribute('data-category') || '';
    };

    const filterProducts = () => {
      let visible = products.filter((product) => {
        const price = getProductPrice(product);
        const category = getProductCategory(product);
        
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        const priceMatch = price >= priceMin && price <= priceMax;
        
        return categoryMatch && priceMatch;
      });

      const sortProducts = (prods) => {
        return [...prods].sort((a, b) => {
          const priceA = getProductPrice(a);
          const priceB = getProductPrice(b);
          
          switch (currentSort) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'newest':
              const saleA = a.getAttribute('data-on-sale') === 'true';
              const saleB = b.getAttribute('data-on-sale') === 'true';
              if (saleA && !saleB) return -1;
              if (!saleA && saleB) return 1;
              return 0;
            case 'featured':
            default:
              return 0;
          }
        });
      };

      visible = sortProducts(visible);

      products.forEach((product) => {
        product.setAttribute('hidden', '');
      });

      visible.forEach((product) => {
        product.removeAttribute('hidden');
      });

      if (countEl) {
        countEl.textContent = visible.length;
      }

      if (emptyEl) {
        if (visible.length === 0) {
          emptyEl.removeAttribute('hidden');
        } else {
          emptyEl.setAttribute('hidden', '');
        }
      }
    };

    oilsPage.querySelectorAll('[data-oils-filter="category"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          currentCategory = e.target.value;
          filterProducts();
        }
      });
    });

    const sortSelect = oilsPage.querySelector('[data-oils-sort]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
      });
    }

    const priceMinInput = oilsPage.querySelector('[data-oils-price-min]');
    const priceMaxInput = oilsPage.querySelector('[data-oils-price-max]');
    const rangeMin = oilsPage.querySelector('[data-oils-range-min]');
    const rangeMax = oilsPage.querySelector('[data-oils-range-max]');

    const updatePriceFilter = () => {
      const min = Number(priceMinInput?.value || rangeMin?.value || 0);
      const max = Number(priceMaxInput?.value || rangeMax?.value || Infinity);
      priceMin = min;
      priceMax = max === Infinity ? Infinity : max;
      filterProducts();
    };

    if (priceMinInput) {
      priceMinInput.addEventListener('input', updatePriceFilter);
    }
    if (priceMaxInput) {
      priceMaxInput.addEventListener('input', updatePriceFilter);
    }
    if (rangeMin) {
      rangeMin.addEventListener('input', (e) => {
        if (priceMinInput) priceMinInput.value = e.target.value;
        updatePriceFilter();
      });
    }
    if (rangeMax) {
      rangeMax.addEventListener('input', (e) => {
        if (priceMaxInput) priceMaxInput.value = e.target.value;
        updatePriceFilter();
      });
    }

    const resetBtn = oilsPage.querySelector('[data-oils-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentSort = 'featured';
        priceMin = 0;
        priceMax = Infinity;
        
        oilsPage.querySelector('[data-oils-filter="category"][value="all"]')?.click();
        if (sortSelect) sortSelect.value = 'featured';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (rangeMin) rangeMin.value = rangeMin.min;
        if (rangeMax) rangeMax.value = rangeMax.max;
        
        filterProducts();
      });
    }

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        if (sidebar) sidebar.removeAttribute('hidden');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        if (sidebar) sidebar.setAttribute('hidden', '');
      });
    }

    oilsPage.addEventListener('click', (e) => {
      if (e.target === sidebar) {
        sidebar.setAttribute('hidden', '');
      }
    });

    filterProducts();
  };

  const initCollectionFilters = () => {
    const page = document.querySelector('[data-collection-page]');
    if (!page) return;

    const sidebar = page.querySelector('[data-collection-sidebar]');
    const overlay = page.querySelector('[data-collection-overlay]');
    const grid = page.querySelector('[data-collection-grid]');
    const items = Array.from(page.querySelectorAll('[data-collection-item]'));
    const countEl = page.querySelector('[data-collection-count-num]');
    const countLabel = page.querySelector('[data-collection-count]');
    const emptyEl = page.querySelector('[data-collection-empty]');
    const chipsEl = page.querySelector('[data-collection-chips]');
    const priceMinValue = page.querySelector('[data-collection-price-min-value]');
    const priceMaxValue = page.querySelector('[data-collection-price-max-value]');
    const defaultMinCents = Number(priceMinValue?.value) || 0;
    const defaultMaxCents = Number(priceMaxValue?.value) || 999999999;

    const getCard = (item) => item.querySelector('.az-prod, [data-product-id]') || item;
    const getState = () => {
      const collectionRadio = page.querySelector('[data-filter-key="collection"]:checked');
      const intensityRadio = page.querySelector('[data-filter-key="intensity"]:checked');
      const familyRadio = page.querySelector('[data-filter-key="fragrance_family"]:checked');
      const inspiredRadio = page.querySelector('[data-filter-key="inspired_by"]:checked');
      const priceMinInput = page.querySelector('[data-collection-price-min]');
      const priceMaxInput = page.querySelector('[data-collection-price-max]');
      const minVal = priceMinInput?.value?.trim();
      const maxVal = priceMaxInput?.value?.trim();
      const priceMinCents = minVal === '' ? defaultMinCents : Math.round(parseFloat(minVal.replace(',', '.')) * 100) || defaultMinCents;
      const priceMaxCents = maxVal === '' ? defaultMaxCents : Math.round(parseFloat(maxVal.replace(',', '.')) * 100) || defaultMaxCents;
      return {
        collection: (collectionRadio?.value || '').trim().toLowerCase(),
        intensity: (intensityRadio?.value || '').trim().toLowerCase(),
        fragrance_family: (familyRadio?.value || '').trim().toLowerCase(),
        inspired_by: (inspiredRadio?.value || '').trim().toLowerCase(),
        priceMinCents,
        priceMaxCents
      };
    };

    const updateUrl = (state) => {
      const params = new URLSearchParams(window.location.search);
      ['collection', 'intensity', 'fragrance_family', 'inspired_by'].forEach((key) => {
        const v = state[key];
        if (v) params.set('filter_' + key, v);
        else params.delete('filter_' + key);
      });
      if (state.priceMinCents > defaultMinCents) params.set('filter_price_min', String(state.priceMinCents / 100));
      else params.delete('filter_price_min');
      if (state.priceMaxCents < defaultMaxCents) params.set('filter_price_max', String(state.priceMaxCents / 100));
      else params.delete('filter_price_max');
      const qs = params.toString();
      const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState({}, '', url);
    };

    const applyFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const collection = (params.get('filter_collection') || '').toLowerCase();
      const intensity = (params.get('filter_intensity') || '').toLowerCase();
      const family = (params.get('filter_fragrance_family') || '').toLowerCase();
      const inspired = (params.get('filter_inspired_by') || '').toLowerCase();
      const priceMin = params.get('filter_price_min');
      const priceMax = params.get('filter_price_max');
      if (collection) {
        const r = page.querySelector(`[data-filter-key="collection"][value="${collection.replace(/"/g, '&quot;')}"]`);
        if (r) r.checked = true;
      }
      if (intensity) {
        const r = page.querySelector(`[data-filter-key="intensity"][value="${intensity.replace(/"/g, '&quot;')}"]`);
        if (r) r.checked = true;
      }
      if (family) {
        const r = page.querySelector(`[data-filter-key="fragrance_family"][value="${family.replace(/"/g, '&quot;')}"]`);
        if (r) r.checked = true;
      }
      if (inspired) {
        const r = page.querySelector(`[data-filter-key="inspired_by"][value="${inspired.replace(/"/g, '&quot;')}"]`);
        if (r) r.checked = true;
      }
      const minInput = page.querySelector('[data-collection-price-min]');
      const maxInput = page.querySelector('[data-collection-price-max]');
      if (priceMin != null && minInput) minInput.value = priceMin;
      if (priceMax != null && maxInput) maxInput.value = priceMax;
    };

    const normalizeHandle = (v) => (v || '').trim().toLowerCase().replace(/\s+/g, '-');
    const apply = () => {
      const state = getState();
      let visible = 0;
      items.forEach((item) => {
        const card = getCard(item);
        const price = Number(card.getAttribute('data-price')) || 0;
        const productType = normalizeHandle(card.getAttribute('data-product-type'));
        const intensity = normalizeHandle(card.getAttribute('data-intensity'));
        const family = normalizeHandle(card.getAttribute('data-fragrance-family'));
        const inspired = normalizeHandle(card.getAttribute('data-inspired-by'));
        const matchCollection = !state.collection || productType === state.collection;
        const matchIntensity = !state.intensity || intensity === state.intensity;
        const matchFamily = !state.fragrance_family || family === state.fragrance_family;
        const matchInspired = !state.inspired_by || inspired === state.inspired_by;
        const matchPrice = price >= state.priceMinCents && price <= state.priceMaxCents;
        const show = matchCollection && matchIntensity && matchFamily && matchInspired && matchPrice;
        if (show) {
          item.removeAttribute('hidden');
          visible++;
        } else {
          item.setAttribute('hidden', '');
        }
      });
      updateUrl(state);
      if (countEl) countEl.textContent = String(visible);
      if (emptyEl) {
        if (visible === 0) emptyEl.removeAttribute('hidden');
        else emptyEl.setAttribute('hidden', '');
      }
      if (chipsEl) {
        const chips = [];
        if (state.collection) {
          const label = page.querySelector(`[data-filter-key="collection"][value="${state.collection.replace(/"/g, '&quot;')}"]`)?.closest('label')?.querySelector('span')?.textContent || state.collection;
          chips.push({ key: 'collection', value: state.collection, label });
        }
        if (state.intensity) {
          const label = page.querySelector(`[data-filter-key="intensity"][value="${state.intensity.replace(/"/g, '&quot;')}"]`)?.closest('label')?.querySelector('span')?.textContent || state.intensity;
          chips.push({ key: 'intensity', value: state.intensity, label });
        }
        if (state.fragrance_family) {
          const label = page.querySelector(`[data-filter-key="fragrance_family"][value="${state.fragrance_family.replace(/"/g, '&quot;')}"]`)?.closest('label')?.querySelector('span')?.textContent || state.fragrance_family;
          chips.push({ key: 'fragrance_family', value: state.fragrance_family, label });
        }
        if (state.inspired_by) {
          const label = page.querySelector(`[data-filter-key="inspired_by"][value="${state.inspired_by.replace(/"/g, '&quot;')}"]`)?.closest('label')?.querySelector('span')?.textContent || state.inspired_by;
          chips.push({ key: 'inspired_by', value: state.inspired_by, label });
        }
        if (state.priceMinCents > defaultMinCents || state.priceMaxCents < defaultMaxCents) {
          chips.push({ key: 'price', value: 'price', label: `${(state.priceMinCents / 100).toFixed(0)} – ${(state.priceMaxCents / 100).toFixed(0)} €` });
        }
        chipsEl.innerHTML = chips.map((c) => `<button type="button" class="az-collection__chip" data-collection-chip data-filter-key="${c.key.replace(/"/g, '&quot;')}" data-filter-value="${(c.value || '').replace(/"/g, '&quot;')}">${(c.label || c.value).replace(/</g, '&lt;')} <span aria-hidden="true">×</span></button>`).join('');
      }
    };

    const reset = () => {
      page.querySelectorAll('[data-collection-filter][type="radio"]').forEach((r) => {
        r.checked = r.value === '';
      });
      const minInput = page.querySelector('[data-collection-price-min]');
      const maxInput = page.querySelector('[data-collection-price-max]');
      if (minInput) minInput.value = '';
      if (maxInput) maxInput.value = '';
      updateUrl(getState());
      apply();
    };

    applyFromUrl();
    apply();

    page.querySelectorAll('[data-collection-filter]').forEach((el) => {
      el.addEventListener('change', () => apply());
    });
    const minInput = page.querySelector('[data-collection-price-min]');
    const maxInput = page.querySelector('[data-collection-price-max]');
    if (minInput) minInput.addEventListener('input', () => apply());
    if (maxInput) maxInput.addEventListener('input', () => apply());

    page.querySelectorAll('[data-collection-reset], [data-collection-reset-inline]').forEach((btn) => {
      btn.addEventListener('click', () => {
        reset();
        if (sidebar && overlay && !overlay.hasAttribute('hidden')) {
          sidebar.classList.remove('az-collection__sidebar--open');
          overlay.setAttribute('hidden', '');
          document.documentElement.style.overflow = '';
        }
      });
    });

    page.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-collection-chip]');
      if (!chip) return;
      e.preventDefault();
      const key = chip.getAttribute('data-filter-key');
      const value = chip.getAttribute('data-filter-value');
      if (key === 'price') {
        const minInput = page.querySelector('[data-collection-price-min]');
        const maxInput = page.querySelector('[data-collection-price-max]');
        if (minInput) minInput.value = '';
        if (maxInput) maxInput.value = '';
      } else {
        const radio = page.querySelector(`[data-filter-key="${key}"][value="${(value || '').replace(/"/g, '&quot;')}"]`);
        if (radio) radio.checked = false;
        const allRadio = page.querySelector(`[data-filter-key="${key}"][value=""]`);
        if (allRadio) allRadio.checked = true;
      }
      apply();
      if (sidebar && overlay && !overlay.hasAttribute('hidden')) {
        sidebar.classList.remove('az-collection__sidebar--open');
        overlay.setAttribute('hidden', '');
        document.documentElement.style.overflow = '';
      }
    });

    if (sidebar && overlay) {
      const openDrawer = () => {
        sidebar.classList.add('az-collection__sidebar--open');
        overlay.removeAttribute('hidden');
        document.documentElement.style.overflow = 'hidden';
      };
      const closeDrawer = () => {
        sidebar.classList.remove('az-collection__sidebar--open');
        overlay.setAttribute('hidden', '');
        document.documentElement.style.overflow = '';
      };
      page.querySelectorAll('[data-collection-open-drawer]').forEach((btn) => {
        btn.addEventListener('click', openDrawer);
      });
      page.querySelectorAll('[data-collection-close-drawer]').forEach((btn) => {
        btn.addEventListener('click', closeDrawer);
      });
      overlay.addEventListener('click', closeDrawer);
    }
  };

  const initScentQuiz = () => {
    const quiz = document.querySelector('[data-scent-quiz]');
    if (!quiz) return;
    const scriptEl = quiz.querySelector('[data-quiz-products]');
    if (!scriptEl) return;
    let products = [];
    try {
      products = JSON.parse(scriptEl.textContent || '[]');
    } catch (_) {
      return;
    }

    const steps = quiz.querySelectorAll('[data-quiz-step]');
    const backBtn = quiz.querySelector('[data-quiz-back]');
    const nextBtn = quiz.querySelector('[data-quiz-next]');
    const progressEl = quiz.querySelector('[data-quiz-progress]');
    const resultsPanel = quiz.querySelector('[data-quiz-results]');
    const resultsGrid = quiz.querySelector('[data-quiz-results-grid]');
    const restartBtn = quiz.querySelector('[data-quiz-restart]');
    const addToCartLabel = quiz.getAttribute('data-add-to-cart-label') || 'Add to cart';

    const state = { step: 1, answers: { ambiance: '', intensity: '', budget: '' } };
    const totalSteps = 3;

    const ambianceKeywords = {
      relaxing: ['spa', 'wellness', 'calming', 'herbal', 'linen', 'aromatic', 'clean'],
      fresh: ['fresh', 'clean', 'marine', 'green', 'tea', 'citrus'],
      cozy: ['woody', 'warm', 'floral-green', 'sandalwood', 'cedar', 'amber'],
      luxe: ['luxury', 'luxurious', 'floral', 'oriental', 'oud', 'gourmand'],
      energizing: ['green', 'tea', 'fruity', 'fresh-green', 'fresh-fruity', 'citrus']
    };

    const budgetRanges = {
      'under-25': { min: 0, max: 2500 },
      '25-50': { min: 2501, max: 5000 },
      '50-plus': { min: 5001, max: 99999999 }
    };

    const getCurrentStepEl = () => quiz.querySelector(`[data-quiz-step="${state.step}"]`);
    const getOptions = () => getCurrentStepEl()?.querySelectorAll('[data-quiz-option]') || [];

    const updateUI = () => {
      steps.forEach((s) => {
        const n = parseInt(s.getAttribute('data-quiz-step'), 10);
        if (n === state.step) {
          s.removeAttribute('hidden');
          s.setAttribute('data-step-active', '');
        } else {
          s.setAttribute('hidden', '');
          s.removeAttribute('data-step-active');
        }
      });
      getOptions().forEach((btn) => {
        const key = state.step === 1 ? 'ambiance' : state.step === 2 ? 'intensity' : 'budget';
        btn.classList.toggle('is-selected', btn.getAttribute('value') === state.answers[key]);
      });
      if (backBtn) {
        backBtn.hidden = state.step <= 1;
      }
      if (nextBtn) {
        const key = state.step === 1 ? 'ambiance' : state.step === 2 ? 'intensity' : 'budget';
        nextBtn.disabled = !state.answers[key];
      }
      if (progressEl) {
        progressEl.textContent = `Step ${state.step} of ${totalSteps}`;
      }
    };

    const getRecommendations = () => {
      const { ambiance, intensity, budget } = state.answers;
      const keywords = ambiance ? (ambianceKeywords[ambiance] || []) : [];
      const range = budget ? (budgetRanges[budget] || { min: 0, max: 99999999 }) : { min: 0, max: 99999999 };

      const scored = products
        .filter((p) => {
          if (p.price < range.min || p.price > range.max) return false;
          if (intensity && p.intensity !== intensity) return false;
          if (ambiance && keywords.length > 0) {
            const tagStr = (p.tags || []).join(' ');
            const familyStr = (p.fragrance_family || '') + ' ' + (p.fragrance_family_label || '');
            const combined = (tagStr + ' ' + familyStr).toLowerCase();
            const match = keywords.some((kw) => combined.includes(kw));
            if (!match) return false;
          }
          return true;
        })
        .slice(0, 5);

      if (scored.length === 0 && products.length > 0) {
        return products.slice(0, 5);
      }
      return scored;
    };

    const formatMoney = (cents) => {
      const v = Number(cents);
      if (!Number.isFinite(v)) return '';
      if (window.Shopify && typeof window.Shopify.formatMoney === 'function') return window.Shopify.formatMoney(v);
      return '€' + (v / 100).toFixed(2);
    };

    const showResults = () => {
      const recs = getRecommendations();
      if (!resultsGrid) return;
      resultsGrid.innerHTML = recs
        .map(
          (p) => `
        <li class="az-quiz__result-card" data-quiz-result>
          <a href="${(p.url || '').replace(/"/g, '&quot;')}" class="az-quiz__result-image">
            ${p.featured_image ? `<img src="${p.featured_image.replace(/"/g, '&quot;')}" alt="" loading="lazy" width="280" height="280">` : '<span class="az-quiz__result-placeholder"></span>'}
          </a>
          <div class="az-quiz__result-body">
            <a href="${(p.url || '').replace(/"/g, '&quot;')}" class="az-quiz__result-title">${(p.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>
            <div class="az-quiz__result-price">${formatMoney(p.price)}</div>
            <form class="az-quiz__add-form" data-quiz-add-form action="/cart/add" method="post">
              <input type="hidden" name="id" value="${(p.variant_id || '').replace(/"/g, '&quot;')}">
              <button type="submit" class="az-quiz__add-btn" ${!p.available ? 'disabled' : ''}>${p.available ? (addToCartLabel || 'Add to cart') : 'Sold out'}</button>
            </form>
          </div>
        </li>
      `
        )
        .join('');
      if (quiz.querySelector('[data-quiz-steps]')) quiz.querySelector('[data-quiz-steps]').setAttribute('hidden', '');
      if (quiz.querySelector('[data-quiz-nav]')) quiz.querySelector('.az-quiz__nav').setAttribute('hidden', '');
      if (resultsPanel) resultsPanel.removeAttribute('hidden');
    };

    quiz.querySelectorAll('[data-quiz-option]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = state.step === 1 ? 'ambiance' : state.step === 2 ? 'intensity' : 'budget';
        state.answers[key] = btn.getAttribute('value') || '';
        getOptions().forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        if (nextBtn) nextBtn.disabled = false;
      });
    });

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (state.step <= 1) return;
        state.step--;
        updateUI();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (state.step < totalSteps) {
          state.step++;
          updateUI();
        } else {
          showResults();
        }
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        state.step = 1;
        state.answers = { ambiance: '', intensity: '', budget: '' };
        if (resultsPanel) resultsPanel.setAttribute('hidden', '');
        const stepsWrap = quiz.querySelector('[data-quiz-steps]');
        if (stepsWrap) stepsWrap.removeAttribute('hidden');
        const nav = quiz.querySelector('.az-quiz__nav');
        if (nav) nav.removeAttribute('hidden');
        updateUI();
        if (nextBtn) nextBtn.disabled = true;
      });
    }

    quiz.addEventListener('submit', async (e) => {
      const form = e.target?.closest('[data-quiz-add-form]');
      if (!form) return;
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      const formData = new FormData(form);
      try {
        const res = await fetch('/cart/add.js', { method: 'POST', body: formData });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (data.message && typeof showToast === 'function') showToast(data.message);
        } else {
          if (typeof showToast === 'function') showToast('✓ Added to cart');
          document.dispatchEvent(new CustomEvent('cart:updated'));
        }
      } catch (_) {}
      if (submitBtn) submitBtn.disabled = false;
    });

    updateUI();
  };

  const COOKIE_CONSENT_KEY = 'az_cookie_consent';
  const NEWSLETTER_POPUP_KEY = 'az_newsletter_popup';

  const getConsent = () => {
    try {
      const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };

  const setConsent = (payload) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload));
      document.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: payload }));
    } catch (_) {}
  };

  const loadScript = (src, async = true) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = async;
    s.defer = true;
    document.head.appendChild(s);
  };

  const loadTrackingScripts = (banner) => {
    if (!banner) return;
    const consent = getConsent();
    if (!consent || (!consent.analytics && !consent.marketing)) return;

    const ga4Id = banner.getAttribute('data-ga4-id');
    const gtmId = banner.getAttribute('data-gtm-id');
    const metaPixelId = banner.getAttribute('data-meta-pixel-id');

    if (consent.analytics && ga4Id) {
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + ga4Id);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ga4Id, { anonymize_ip: true });
    }

    if (consent.analytics && gtmId) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
        f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', gtmId);
    }

    if (consent.marketing && metaPixelId) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', metaPixelId);
      window.fbq('track', 'PageView');
    }
  };

  const initCookieConsent = () => {
    const banner = document.querySelector('[data-cookie-consent]');
    if (!banner) return;

    const consent = getConsent();
    if (consent !== null) {
      loadTrackingScripts(banner);
      return;
    }

    banner.removeAttribute('hidden');
    banner.classList.add('az-cookie--visible');

    const hide = () => {
      banner.setAttribute('hidden', '');
      banner.classList.remove('az-cookie--visible');
    };

    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
      setConsent({ analytics: true, marketing: true });
      hide();
      loadTrackingScripts(banner);
    });

    banner.querySelector('[data-cookie-reject]')?.addEventListener('click', () => {
      setConsent({ analytics: false, marketing: false });
      hide();
    });
  };

  const initNewsletterPopup = () => {
    const popup = document.querySelector('[data-newsletter-popup]');
    if (!popup) return;

    const delay = Number(popup.getAttribute('data-delay')) || 0;
    const exitIntent = popup.getAttribute('data-exit-intent') !== 'false';
    const cookieDays = Number(popup.getAttribute('data-cookie-days')) || 7;

    const getPopupCookie = () => {
      try {
        const raw = localStorage.getItem(NEWSLETTER_POPUP_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (_) {
        return null;
      }
    };

    const setPopupCookie = () => {
      try {
        const exp = new Date();
        exp.setDate(exp.getDate() + cookieDays);
        localStorage.setItem(NEWSLETTER_POPUP_KEY, JSON.stringify({ seen: true, exp: exp.getTime() }));
      } catch (_) {}
    };

    const shouldShow = () => {
      const c = getPopupCookie();
      if (!c) return true;
      if (c.seen && c.exp && Date.now() < c.exp) return false;
      return true;
    };

    const show = () => {
      if (!shouldShow()) return;
      popup.removeAttribute('hidden');
      popup.classList.add('az-newsletter-popup--open');
      document.documentElement.style.overflow = 'hidden';
      setPopupCookie();
    };

    const close = () => {
      popup.setAttribute('hidden', '');
      popup.classList.remove('az-newsletter-popup--open');
      document.documentElement.style.overflow = '';
    };

    if (delay > 0) {
      setTimeout(show, delay * 1000);
    }

    if (exitIntent) {
      document.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0 && shouldShow()) show();
      }, { once: true, passive: true });
    }

    popup.querySelectorAll('[data-newsletter-popup-close]').forEach((el) => {
      el.addEventListener('click', close);
    });

    popup.querySelector('form')?.addEventListener('submit', () => {
      setTimeout(close, 500);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  };

  const initAll = () => {
    initCountdown();
    initSearchToggle();
    initMobileMenu();
    initAuthModal();
    initHeaderHeight();
    initCartModal();
    initQuickAdd();
    initWishlist();
    initWishlistPage();
    initWishlistDrawer();
    initCollectionFilters();
    initScentQuiz();
    initCookieConsent();
    initNewsletterPopup();
    initShopPage();
    initVoyagePage();
    initProductPage();
    initPerfumesPage();
    initNewPage();
    initContactPage();
    initCandlesPage();
    initSalePage();
    initDiffusersPage();
    initOilsPage();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }

  document.querySelectorAll('[data-scroll-top]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  const initHero = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    document.querySelectorAll('[data-hero]').forEach((hero) => {
      const text = hero.querySelector('[data-hero-text]');
      const visual = hero.querySelector('[data-hero-visual]');
      const media = hero.querySelector('[data-hero-visual-media]');
      const video = hero.querySelector('[data-hero-visual-video]');
      const tilt = hero.querySelector('[data-tilt]');

      if (video && reduced) {
        video.pause?.();
      }

      if (visual && media && video && !reduced) {
        const io = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (!entry) return;
            if (entry.isIntersecting) {
              hero.classList.add('is-inview');
              const p = video.play?.();
              if (p && typeof p.catch === 'function') p.catch(() => {});
            } else {
              hero.classList.remove('is-inview');
              video.pause?.();
            }
          },
          { rootMargin: '-20% 0px -20% 0px', threshold: 0.2 }
        );
        io.observe(media);
      }

      if (tilt && !reduced) {
        const max = 9;
        const onMove = (e) => {
          const rect = tilt.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const rx = (0.5 - y) * max;
          const ry = (x - 0.5) * max;
          tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        };
        const onLeave = () => {
          tilt.style.transform = '';
        };
        tilt.addEventListener('mousemove', onMove);
        tilt.addEventListener('mouseleave', onLeave);
      }

      if (text && !reduced) {
        let raf = 0;
        const onScroll = () => {
          if (raf) return;
          raf = window.requestAnimationFrame(() => {
            raf = 0;
            const y = Math.max(0, Math.min(600, window.scrollY || 0));
            const opacity = 1 - (y / 600) * 0.1;
            const translate = (y / 600) * 24;
            text.style.opacity = String(opacity);
            text.style.transform = `translateY(${translate}px)`;
          });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }
    });
  };

  const initFeaturedProducts = () => {
    document.querySelectorAll('[data-featured-products]').forEach((section) => {
      const buttons = Array.from(section.querySelectorAll('[data-filter]'));
      const items = Array.from(section.querySelectorAll('[data-category]'));
      const empty = section.querySelector('[data-featured-empty]');

      const apply = (filter) => {
        buttons.forEach((b) => {
          const active = b.getAttribute('data-filter') === filter;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        let visibleCount = 0;
        items.forEach((el) => {
          const category = (el.getAttribute('data-category') || '').trim();
          const onSale = (el.getAttribute('data-onsale') || 'false') === 'true';
          let show = true;
          if (filter === 'all') {
            show = true;
          } else if (filter === 'sale') {
            show = onSale;
          } else {
            show = category === filter;
          }
          el.style.display = show ? '' : 'none';
          if (show) visibleCount += 1;
        });

        if (empty) {
          if (visibleCount === 0) empty.removeAttribute('hidden');
          else empty.setAttribute('hidden', '');
        }
      };

      apply('all');

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter') || 'all';
          apply(filter);
        });
      });
    });
  };

  const initFaq = () => {
    document.querySelectorAll('[data-faq]').forEach((root) => {
      const items = Array.from(root.querySelectorAll('.az-faq__item'));
      const closeAll = () => {
        items.forEach((item) => {
          item.classList.remove('is-open');
          const btn = item.querySelector('.az-faq__q');
          const panel = item.querySelector('.az-faq__a');
          if (btn) btn.setAttribute('aria-expanded', 'false');
          if (panel) panel.setAttribute('hidden', '');
        });
      };

      const openItem = (item) => {
        item.classList.add('is-open');
        const btn = item.querySelector('.az-faq__q');
        const panel = item.querySelector('.az-faq__a');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        if (panel) panel.removeAttribute('hidden');
      };

      items.forEach((item) => {
        const btn = item.querySelector('.az-faq__q');
        const panel = item.querySelector('.az-faq__a');
        if (!btn || !panel) return;

        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');
          closeAll();
          if (!isOpen) openItem(item);
        });
      });

      const firstOpen = items.find((it) => it.classList.contains('is-open'));
      if (firstOpen) {
        closeAll();
        openItem(firstOpen);
      } else if (items[0]) {
        closeAll();
        openItem(items[0]);
      }
    });
  };

  const initMarquee = () => {
    document.querySelectorAll('[data-marquee]').forEach((track) => {
      const rowSelector = track.getAttribute('data-marquee-row') || '.az-marquee__row';
      const direction = (track.getAttribute('data-marquee-direction') || 'rtl').toLowerCase();
      const firstRow = track.querySelector(rowSelector);
      if (!firstRow) return;

      const apply = () => {
        const rowWidth = Math.ceil(firstRow.getBoundingClientRect().width);
        if (!rowWidth) return;
        if (direction === 'ltr') {
          track.style.setProperty('--az-marquee-from', `-${rowWidth}px`);
          track.style.setProperty('--az-marquee-to', '0px');
        } else {
          track.style.setProperty('--az-marquee-from', '0px');
          track.style.setProperty('--az-marquee-to', `-${rowWidth}px`);
        }
      };

      apply();

      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => apply());
        ro.observe(firstRow);
      } else {
        window.addEventListener('resize', apply, { passive: true });
      }

      if (document.fonts && typeof document.fonts.ready?.then === 'function') {
        document.fonts.ready.then(() => apply()).catch(() => {});
      }
    });
  };

  const initScrollAnimations = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduced) {
      // Set all fade-in elements to visible immediately
      document.querySelectorAll('.az-fade-in, .az-scroll-animate').forEach((el) => {
        el.classList.add('is-in-view');
      });
      return;
    }

    // Default viewport options (matches React component: once: true, margin: "-10%")
    const defaultObserverOptions = {
      threshold: 0,
      rootMargin: '-10% 0px -10% 0px'
    };

    // Create observer for fade-in elements
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          // Unobserve if element has data-fade-once="true" (default behavior)
          const once = entry.target.getAttribute('data-fade-once') !== 'false';
          if (once) {
            fadeInObserver.unobserve(entry.target);
          }
        } else {
          // Re-animate if element has data-fade-once="false"
          const once = entry.target.getAttribute('data-fade-once') !== 'false';
          if (!once) {
            entry.target.classList.remove('is-in-view');
          }
        }
      });
    }, defaultObserverOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.az-fade-in').forEach((el) => {
      fadeInObserver.observe(el);
    });

    // Legacy scroll-animate support (backward compatibility)
    const legacyObserverOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const legacyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          legacyObserver.unobserve(entry.target);
        }
      });
    }, legacyObserverOptions);

    document
      .querySelectorAll(
        '.az-scroll-animate, .az-scroll-animate--delay-1, .az-scroll-animate--delay-2, .az-scroll-animate--delay-3, .az-scroll-animate--fade, .az-scroll-animate--scale'
      )
      .forEach((el) => {
      legacyObserver.observe(el);
    });
  };

  const initPageTransition = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduced) {
      document.querySelectorAll('.az-page-transition').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    // Trigger page transition on load
    document.querySelectorAll('.az-page-transition').forEach((el) => {
      // Use requestAnimationFrame to ensure smooth transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('is-visible');
        });
      });
    });
  };

  const initAfterLoad = () => {
    initPageTransition();
    initHero();
    initFeaturedProducts();
    initFaq();
    initMarquee();
    initScrollAnimations();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAfterLoad, { once: true });
  } else {
    initAfterLoad();
  }
})();
