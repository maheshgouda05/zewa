/**
 * ZEWA - Delivery Partner Platform Controller
 * Manages Online/Offline duty toggle, GPS broadcaster,
 * incoming delivery matching, and step-by-step navigation.
 */

window.zewaDelivery = {
  partnerData: null,
  isOnline: true,
  activeAssignment: null,
  pollInterval: null,

  async init() {
    await this.loadDashboard();
    this.bindEvents();
    this.startLiveAssignmentPolling();
  },

  async loadDashboard() {
    try {
      const res = await window.zewaApi.getDeliveryDashboard();
      this.partnerData = res;
      this.isOnline = res.partner ? res.partner.is_online : true;
      this.activeAssignment = res.active_assignment || null;

      this.renderStatusToggle();
      this.renderStats(res);
      this.renderAssignment(this.activeAssignment);
    } catch (err) {
      console.error('[Delivery] Dashboard error:', err);
      window.zewaApp.showToast(`Delivery data error: ${err.message}`, 'error');
    }
  },

  bindEvents() {
    const toggle = document.getElementById('delivery-online-toggle');
    if (toggle) {
      toggle.addEventListener('change', (e) => this.handleStatusToggle(e.target.checked));
    }
  },

  async handleStatusToggle(checked) {
    try {
      this.isOnline = checked;
      const loc = window.zewaMaps.getCurrentLocation();
      await window.zewaApi.updateDeliveryStatus(this.isOnline, loc.lat, loc.lng);
      window.zewaApp.showToast(this.isOnline ? 'You are now Online and receiving deliveries!' : 'You are now Offline.', 'info');
      this.renderStatusToggle();
    } catch (err) {
      window.zewaApp.showToast(err.message, 'error');
    }
  },

  renderStatusToggle() {
    const toggle = document.getElementById('delivery-online-toggle');
    const label = document.getElementById('delivery-status-label');
    if (toggle) toggle.checked = this.isOnline;
    if (label) {
      label.textContent = this.isOnline ? 'Online (Ready for Orders)' : 'Offline (Paused)';
      label.className = `status-pill ${this.isOnline ? 'status-online' : 'status-offline'}`;
    }
  },

  renderStats(data) {
    const pName = document.getElementById('delivery-partner-name');
    const pVehicle = document.getElementById('delivery-partner-vehicle');
    if (pName && data.partner) pName.textContent = data.partner.full_name;
    if (pVehicle && data.partner) pVehicle.textContent = `🛵 ${data.partner.vehicle_details || 'Electric Scooter'}`;

    const stats = data.stats || {};
    const elTrips = document.getElementById('delivery-stat-trips');
    const elEarnings = document.getElementById('delivery-stat-earnings');

    if (elTrips) elTrips.textContent = stats.completed_trips || 0;
    if (elEarnings) elEarnings.textContent = `₹${stats.total_earnings || 0}`;
  },

  renderAssignment(assignment) {
    const container = document.getElementById('delivery-active-assignment');
    if (!container) return;

    if (!assignment) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🛵</div>
          <h3>Looking for nearby surplus orders...</h3>
          <p>Stay online. Orders from local restaurants will be routed to you based on optimal proximity.</p>
        </div>
      `;
      return;
    }

    const order = assignment.order || {};
    const rest = order.restaurant || {};
    const restNavUrl = window.zewaMaps.getGoogleMapsDirectionsUrl(rest.lat || 12.9784, rest.lng || 77.6408, rest.name);
    const custNavUrl = window.zewaMaps.getGoogleMapsDirectionsUrl(12.9790, 77.6410, 'Customer Doorstep');

    const isPending = assignment.status === 'assigned';
    const isAccepted = assignment.status === 'accepted';
    const isPickedUp = assignment.status === 'picked_up';

    container.innerHTML = `
      <div class="assignment-active-card">
        <div class="assignment-badge-bar">
          <span class="badge badge-accent">NEW RESCUE TRIP</span>
          <span class="order-id">${order.order_number}</span>
          <span class="payout-pill">Earnings: <strong>₹${assignment.delivery_fee || 25}</strong></span>
        </div>

        <div class="route-timeline">
          <!-- Step 1: Restaurant Pickup -->
          <div class="route-step ${isPickedUp ? 'done' : 'active'}">
            <div class="route-icon">🏬</div>
            <div class="route-details">
              <h4>Pickup: ${rest.name || 'Kitchen'}</h4>
              <p class="text-muted">${rest.address || 'Indiranagar, Bengaluru'}</p>
              <div class="step-items-list">
                ${order.items ? order.items.map(i => `<span>${i.food_item ? i.food_item.name : 'Portion'} × ${i.quantity}</span>`).join(', ') : ''}
              </div>
              <a href="${restNavUrl}" target="_blank" rel="noopener" class="btn btn-outline btn-sm mt-2">
                🗺️ Directions to Kitchen
              </a>
            </div>
          </div>

          <!-- Step 2: Customer Delivery -->
          <div class="route-step ${isPickedUp ? 'active' : 'pending'}">
            <div class="route-icon">🏡</div>
            <div class="route-details">
              <h4>Deliver to: ${order.customer ? order.customer.full_name : 'Customer'}</h4>
              <p class="text-muted">${order.delivery_address || 'Customer Address'}</p>
              ${order.delivery_notes ? `<p class="customer-note">Note: "${order.delivery_notes}"</p>` : ''}
              <a href="${custNavUrl}" target="_blank" rel="noopener" class="btn btn-outline btn-sm mt-2">
                🗺️ Directions to Customer
              </a>
            </div>
          </div>
        </div>

        <div class="assignment-actions mt-3">
          ${isPending ? `
            <div class="action-grid">
              <button class="btn btn-primary btn-block" onclick="window.zewaDelivery.respond('${assignment.id}', 'accept')">
                ✅ Accept Delivery
              </button>
              <button class="btn btn-outline btn-block" onclick="window.zewaDelivery.respond('${assignment.id}', 'reject')">
                ❌ Decline
              </button>
            </div>
          ` : isAccepted ? `
            <button class="btn btn-primary btn-block" onclick="window.zewaDelivery.advanceStep('${assignment.id}', 'pickup')">
              📦 Confirm Food Picked Up from Kitchen
            </button>
          ` : isPickedUp ? `
            <button class="btn btn-accent btn-block" onclick="window.zewaDelivery.advanceStep('${assignment.id}', 'deliver')">
              🎉 Mark Order Delivered to Customer
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  async respond(assignmentId, action) {
    try {
      await window.zewaApi.respondToAssignment(assignmentId, action);
      window.zewaApp.showToast(`Delivery ${action === 'accept' ? 'accepted!' : 'declined.'}`, 'info');
      await this.loadDashboard();
    } catch (err) {
      window.zewaApp.showToast(err.message, 'error');
    }
  },

  async advanceStep(assignmentId, action) {
    try {
      await window.zewaApi.updateDeliveryStep(assignmentId, action);
      window.zewaApp.showToast(action === 'pickup' ? 'Food picked up! Head to customer.' : 'Delivery completed! Trip earnings credited.', 'success');
      await this.loadDashboard();
    } catch (err) {
      window.zewaApp.showToast(err.message, 'error');
    }
  },

  startLiveAssignmentPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(async () => {
      // Only poll if on delivery view
      const delView = document.getElementById('view-delivery');
      if (delView && delView.classList.contains('active')) {
        await this.loadDashboard();
      }
    }, 4000);
  }
};
