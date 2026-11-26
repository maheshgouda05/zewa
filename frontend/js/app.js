/**
 * ZEWA - Master Application Coordinator & View Router
 * Connects Customer, Restaurant, and Delivery Partner interfaces,
 * manages responsive bottom navigation, modals, and toasts.
 */

window.zewaApp = {
  currentView: 'customer',

  async init() {
    console.log('[ZEWA] Initializing Zero Waste Food Surplus Marketplace...');

    // 1. Initialize Map / Location
    await window.zewaMaps.initLocation();

    // 2. Initialize Authentication & Demo Session
    window.zewaAuth.init();

    // 3. Initialize Customer View
    await window.zewaCustomer.init();

    // 4. Bind Global Navigation & UI
    this.bindGlobalEvents();

    console.log('[ZEWA] Ready.');
  },

  bindGlobalEvents() {
    // Bottom Navigation Bar tabs
    document.querySelectorAll('.bottom-nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // Close buttons for all modals
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.closest('.modal-base').classList.remove('is-open');
        }
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetModal = e.currentTarget.closest('.modal-base');
        if (targetModal) targetModal.classList.remove('is-open');
      });
    });

    // Checkout payment submission button
    const payBtn = document.getElementById('btn-confirm-payment');
    if (payBtn) {
      payBtn.addEventListener('click', () => {
        window.zewaOrders.processPayment();
      });
    }

    // Customer Location indicator click to re-detect
    const locTrigger = document.getElementById('header-location-picker');
    if (locTrigger) {
      locTrigger.addEventListener('click', async () => {
        this.showToast('Detecting location...', 'info');
        localStorage.removeItem('zewa_user_location');
        await window.zewaMaps.initLocation();
        this.updateHeaderLocationDisplay();
        window.zewaCustomer.loadFeed();
        this.showToast('Location updated!', 'success');
      });
    }

    this.updateHeaderLocationDisplay();
  },

  updateHeaderLocationDisplay() {
    const loc = window.zewaMaps.getCurrentLocation();
    const locEl = document.getElementById('current-location-text');
    if (locEl) {
      locEl.textContent = loc.name || 'Indiranagar, Bengaluru';
    }
  },

  onRoleSwitched(role) {
    if (role === 'customer') {
      this.switchView('customer');
      window.zewaCustomer.loadFeed();
    } else if (role === 'restaurant') {
      this.switchView('restaurant');
      window.zewaRestaurant.init();
    } else if (role === 'delivery_partner') {
      this.switchView('delivery');
      window.zewaDelivery.init();
    }
  },

  switchView(viewName) {
    this.currentView = viewName;

    // Toggle views
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });

    const activeView = document.getElementById(`view-${viewName}`);
    if (activeView) {
      activeView.classList.add('active');
    }

    // Toggle Bottom Nav active tab
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    // View-specific data refresh
    if (viewName === 'customer') {
      window.zewaCustomer.loadFeed();
    } else if (viewName === 'customer-orders') {
      window.zewaOrders.loadCustomerOrderHistory();
    } else if (viewName === 'restaurant') {
      window.zewaRestaurant.loadDashboard();
    } else if (viewName === 'delivery') {
      window.zewaDelivery.loadDashboard();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';
    if (type === 'warning') icon = '⏳';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.zewaApp.init();
});
