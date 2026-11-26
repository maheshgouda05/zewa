/**
 * ZEWA - Order Processing, 10-Min Reservation Hold, Payment Verification,
 * and Real-Time Delivery Tracking Stepper.
 */

window.zewaOrders = {
  activeReservation: null,
  reservationTimer: null,
  reservationRemainingSeconds: 600, // 10 minutes
  activeTrackingOrder: null,
  trackingPollingInterval: null,

  async initiateReservation(item, quantity) {
    try {
      window.zewaApp.showToast('Locking inventory for 10 minutes...', 'info');

      const res = await window.zewaApi.reserveInventory(item.id, quantity);
      this.activeReservation = {
        ...res.reservation,
        item,
        quantity
      };

      this.openCheckoutModal(this.activeReservation);
      this.startReservationCountdown(res.reservation.expires_at);
    } catch (err) {
      console.error('[Order] Reservation error:', err);
      window.zewaApp.showToast(err.message || 'Could not hold inventory. Item might be sold out.', 'error');
    }
  },

  openCheckoutFromCart() {
    const entries = Object.values(window.zewaCustomer.cart);
    if (entries.length === 0) return;
    const first = entries[0];
    this.initiateReservation(first.item, first.quantity);
  },

  openCheckoutModal(reservation) {
    const modal = document.getElementById('modal-checkout');
    if (!modal) return;

    const item = reservation.item;
    const qty = reservation.quantity;
    const unitPrice = reservation.unit_price || (item.pricing ? item.pricing.current_price : item.starting_price);
    const subtotal = unitPrice * qty;
    const deliveryFee = 25;
    const platformFee = 5;
    const grandTotal = subtotal + deliveryFee + platformFee;

    const summaryEl = document.getElementById('checkout-order-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="checkout-item-preview">
          <img src="${item.image_url}" alt="${item.name}" class="checkout-thumb" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
          <div class="checkout-item-info">
            <h4>${item.name}</h4>
            <p class="text-muted">${item.restaurant ? item.restaurant.name : 'Kitchen'}</p>
            <div class="checkout-price-tag">
              <span>₹${unitPrice} × ${qty} portion${qty > 1 ? 's' : ''}</span>
              <strong>₹${subtotal}</strong>
            </div>
          </div>
        </div>

        <div class="price-breakdown">
          <div class="breakdown-row">
            <span>Food Subtotal (${qty} portion)</span>
            <span>₹${subtotal}</span>
          </div>
          <div class="breakdown-row">
            <span>Eco-Delivery Partner Fee</span>
            <span>₹${deliveryFee}</span>
          </div>
          <div class="breakdown-row">
            <span>Zero Waste Platform Fee</span>
            <span>₹${platformFee}</span>
          </div>
          <div class="breakdown-row total-row">
            <strong>Total Payable</strong>
            <strong class="total-amount">₹${grandTotal}</strong>
          </div>
        </div>
      `;
    }

    // Set default customer delivery address
    const addrInput = document.getElementById('checkout-delivery-address');
    if (addrInput && !addrInput.value) {
      addrInput.value = '12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038';
    }

    modal.classList.add('is-open');
  },

  closeCheckoutModal() {
    const modal = document.getElementById('modal-checkout');
    if (modal) modal.classList.remove('is-open');
    if (this.reservationTimer) clearInterval(this.reservationTimer);
  },

  startReservationCountdown(expiresAt) {
    if (this.reservationTimer) clearInterval(this.reservationTimer);

    const timerDisplay = document.getElementById('checkout-timer-countdown');
    const expiryTime = new Date(expiresAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((expiryTime - now) / 1000));

      const mins = Math.floor(diffSec / 60);
      const secs = diffSec % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      if (timerDisplay) {
        timerDisplay.textContent = formatted;
      }

      if (diffSec <= 0) {
        clearInterval(this.reservationTimer);
        window.zewaApp.showToast('Reservation expired. Inventory released.', 'warning');
        this.closeCheckoutModal();
        window.zewaCustomer.loadFeed();
      }
    };

    updateTimer();
    this.reservationTimer = setInterval(updateTimer, 1000);
  },

  /**
   * Execute Prepaid Checkout with Simulated Gateway & Server-Side Verification
   */
  async processPayment(method = 'upi') {
    if (!this.activeReservation) {
      window.zewaApp.showToast('No active inventory reservation.', 'error');
      return;
    }

    const payBtn = document.getElementById('btn-confirm-payment');
    const originalText = payBtn ? payBtn.innerHTML : 'Pay';
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.innerHTML = `<span>⏳ Verifying with Banking Server...</span>`;
    }

    try {
      const address = document.getElementById('checkout-delivery-address').value.trim();
      const notes = document.getElementById('checkout-delivery-notes').value.trim();

      if (!address) {
        throw new Error('Please provide your complete delivery address.');
      }

      // 1. Request Payment Session from Server
      const sessionRes = await window.zewaApi.createPaymentSession(this.activeReservation.id);

      // 2. Simulated UPI / Card processing delay
      await new Promise(r => setTimeout(r, 1200));

      // 3. Server-side payment verification
      const verifyRes = await window.zewaApi.verifyPayment({
        payment_id: sessionRes.payment_id,
        reservation_id: this.activeReservation.id,
        payment_signature: sessionRes.mock_signature,
        gateway_order_id: sessionRes.gateway_order_id,
        delivery_address: address,
        delivery_notes: notes
      });

      // Clear cart & reservation
      clearInterval(this.reservationTimer);
      delete window.zewaCustomer.cart[this.activeReservation.food_item_id];
      window.zewaCustomer.updateFloatingCartBar();
      window.zewaCustomer.updateCardQuantityUi(this.activeReservation.food_item_id);

      this.closeCheckoutModal();
      window.zewaApp.showToast(`Order Placed! Order ID: ${verifyRes.order.order_number}`, 'success');

      // Refresh customer feed inventory
      window.zewaCustomer.loadFeed();

      // Open Real-Time Order Tracking Stepper
      this.openOrderTracking(verifyRes.order.id);
    } catch (err) {
      console.error('[Payment] Error:', err);
      window.zewaApp.showToast(err.message || 'Payment processing failed.', 'error');
    } finally {
      if (payBtn) {
        payBtn.disabled = false;
        payBtn.innerHTML = originalText;
      }
    }
  },

  /**
   * Real-time Order Tracking Modal with 5-stage stepper
   */
  async openOrderTracking(orderId) {
    const modal = document.getElementById('modal-order-tracking');
    if (!modal) return;

    modal.classList.add('is-open');
    this.pollOrderDetails(orderId);
  },

  closeOrderTracking() {
    const modal = document.getElementById('modal-order-tracking');
    if (modal) modal.classList.remove('is-open');
    if (this.trackingPollingInterval) clearInterval(this.trackingPollingInterval);
  },

  async pollOrderDetails(orderId) {
    if (this.trackingPollingInterval) clearInterval(this.trackingPollingInterval);

    const fetchStatus = async () => {
      try {
        const res = await window.zewaApi.getOrder(orderId);
        this.activeTrackingOrder = res.order;
        this.renderTrackingModal(res.order);
      } catch (err) {
        console.warn('[Tracking] Polling error:', err);
      }
    };

    await fetchStatus();
    this.trackingPollingInterval = setInterval(fetchStatus, 3000);
  },

  renderTrackingModal(order) {
    const orderNumEl = document.getElementById('track-order-number');
    if (orderNumEl) orderNumEl.textContent = order.order_number;

    const stages = ['paid', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIdx = stages.indexOf(order.status);

    stages.forEach((stage, idx) => {
      const stepEl = document.getElementById(`step-${stage}`);
      if (!stepEl) return;

      if (idx < currentIdx) {
        stepEl.className = 'stepper-step completed';
      } else if (idx === currentIdx) {
        stepEl.className = 'stepper-step active';
      } else {
        stepEl.className = 'stepper-step pending';
      }
    });

    // Delivery Partner Details
    const partnerCard = document.getElementById('track-partner-details');
    if (partnerCard) {
      if (order.delivery_partner) {
        const partner = order.delivery_partner;
        const navUrl = window.zewaMaps.getGoogleMapsDirectionsUrl(
          order.restaurant ? order.restaurant.lat : 12.9784,
          order.restaurant ? order.restaurant.lng : 77.6408,
          partner.full_name
        );

        partnerCard.innerHTML = `
          <div class="partner-meta">
            <div class="partner-avatar">🛵</div>
            <div class="partner-info">
              <h4>${partner.full_name}</h4>
              <p>Vehicle: <strong>${partner.vehicle_details || 'Electric Scooter'}</strong> • ★ 4.9</p>
              <p class="text-sm">Status: <strong>${order.status.replace(/_/g, ' ').toUpperCase()}</strong></p>
            </div>
            <div class="partner-actions">
              <a href="tel:${partner.phone || '9876543210'}" class="btn btn-outline btn-sm">📞 Call</a>
            </div>
          </div>
          <div class="partner-directions mt-2">
            <a href="${navUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm btn-block">
              🗺️ Open Route in Google Maps
            </a>
          </div>
        `;
        partnerCard.style.display = 'block';
      } else {
        partnerCard.innerHTML = `
          <div class="partner-searching">
            <div class="spinner-small"></div>
            <span>Auto-matching nearest available Eco-Delivery Partner...</span>
          </div>
        `;
        partnerCard.style.display = 'block';
      }
    }

    // Order items summary
    const itemsEl = document.getElementById('track-order-items');
    if (itemsEl && order.items) {
      itemsEl.innerHTML = order.items.map(it => `
        <div class="track-item-row">
          <span>${it.food_item ? it.food_item.name : 'Surplus Portion'} × ${it.quantity}</span>
          <strong>₹${it.total_price}</strong>
        </div>
      `).join('');
    }
  },

  async loadCustomerOrderHistory() {
    try {
      const res = await window.zewaApi.getCustomerOrders();
      const container = document.getElementById('customer-orders-list');
      if (!container) return;

      if (!res.orders || res.orders.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Every portion you order saves fresh surplus food from going to landfill!</p>
          </div>
        `;
        return;
      }

      container.innerHTML = res.orders.map(order => `
        <div class="order-history-card">
          <div class="order-header-row">
            <div>
              <span class="order-id">${order.order_number}</span>
              <span class="order-date">${new Date(order.created_at).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <span class="status-badge status-${order.status}">${order.status.replace(/_/g, ' ')}</span>
          </div>
          <div class="order-body-row">
            <div>
              <strong>${order.restaurant ? order.restaurant.name : 'Local Kitchen'}</strong>
              <p class="text-sm text-muted">${order.items ? order.items.map(i => `${i.food_item ? i.food_item.name : 'Portion'} (${i.quantity})`).join(', ') : ''}</p>
            </div>
            <div class="order-amount">₹${order.total_amount}</div>
          </div>
          <div class="order-actions-row">
            <button class="btn btn-outline btn-sm" onclick="window.zewaOrders.openOrderTracking('${order.id}')">
              Track Order Live
            </button>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.warn('[Orders] History fetch error:', err);
    }
  }
};
