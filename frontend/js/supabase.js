/**
 * ZEWA - Frontend API & Supabase Client Adapter
 * Seamlessly interfaces with the Express Backend (/api)
 * Supports live Supabase client or local API fallback with session caching.
 */

const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? '/api'
  : (window.location.origin + '/api');

class ZewaApi {
  constructor() {
    this.token = localStorage.getItem('zewa_auth_token') || null;
    this.user = JSON.parse(localStorage.getItem('zewa_user') || 'null');
  }

  setSession(token, user) {
    this.token = token;
    this.user = user;
    if (token) {
      localStorage.setItem('zewa_auth_token', token);
      localStorage.setItem('zewa_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zewa_auth_token');
      localStorage.removeItem('zewa_user');
    }
  }

  getSession() {
    return { token: this.token, user: this.user };
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      return data;
    } catch (err) {
      console.warn(`[API] Error on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth Endpoints
  async register(payload) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data.session) {
      this.setSession(data.session.token, data.session.user);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.session) {
      this.setSession(data.session.token, data.session.user);
    }
    return data;
  }

  async getMe() {
    const data = await this.request('/auth/me');
    if (data.user) {
      this.user = data.user;
      localStorage.setItem('zewa_user', JSON.stringify(this.user));
    }
    return data;
  }

  logout() {
    this.setSession(null, null);
  }

  // Customer Endpoints
  async getFeed(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/customer/feed${query ? '?' + query : ''}`);
  }

  async getFoodItem(id) {
    return this.request(`/customer/food/${id}`);
  }

  async reserveInventory(food_item_id, quantity) {
    return this.request('/customer/reserve', {
      method: 'POST',
      body: JSON.stringify({ food_item_id, quantity })
    });
  }

  // Order Endpoints
  async createPaymentSession(reservation_id) {
    return this.request('/orders/create-payment-session', {
      method: 'POST',
      body: JSON.stringify({ reservation_id })
    });
  }

  async verifyPayment(payload) {
    return this.request('/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async getCustomerOrders() {
    return this.request('/orders/my-orders');
  }

  // Restaurant Endpoints
  async getRestaurantDashboard() {
    return this.request('/restaurant/dashboard');
  }

  async addFoodItem(payload) {
    return this.request('/restaurant/food', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateFoodItem(id, payload) {
    return this.request(`/restaurant/food/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async deleteFoodItem(id) {
    return this.request(`/restaurant/food/${id}`, {
      method: 'DELETE'
    });
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/restaurant/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Delivery Partner Endpoints
  async getDeliveryDashboard() {
    return this.request('/delivery/dashboard');
  }

  async updateDeliveryStatus(is_online, lat, lng) {
    return this.request('/delivery/status', {
      method: 'PUT',
      body: JSON.stringify({ is_online, lat, lng })
    });
  }

  async respondToAssignment(assignmentId, action) {
    return this.request(`/delivery/assignments/${assignmentId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  }

  async updateDeliveryStep(assignmentId, action) {
    return this.request(`/delivery/assignments/${assignmentId}/step`, {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  }
}

// Global API instance
window.zewaApi = new ZewaApi();
