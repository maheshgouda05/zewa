/**
 * ZEWA - Authentication & Role Manager
 * Handles multi-role logins (Customer, Restaurant, Delivery Partner)
 * Includes 1-Click Fast Demo Logins for smooth evaluation.
 */

window.zewaAuth = {
  // Pre-configured Demo Accounts
  demoAccounts: {
    customer: {
      email: 'customer@zewa.demo',
      password: 'demo_password_123',
      name: 'Aarav Sharma (Customer)',
      role: 'customer'
    },
    restaurant: {
      email: 'restaurant@zewa.demo',
      password: 'demo_password_123',
      name: 'Ramesh Gowda (Annapoorna Mess)',
      role: 'restaurant'
    },
    delivery: {
      email: 'delivery@zewa.demo',
      password: 'demo_password_123',
      name: 'Karthik Raja (Delivery Partner)',
      role: 'delivery_partner'
    }
  },

  currentRole: 'customer',

  init() {
    const session = window.zewaApi.getSession();
    if (session.user) {
      this.currentRole = session.user.role;
      this.updateUiForLoggedInUser(session.user);
    } else {
      // Auto-login as default demo customer for instant exploration
      this.loginWithDemo('customer', true);
    }

    this.bindEvents();
  },

  bindEvents() {
    // Top demo role switch buttons
    document.querySelectorAll('[data-switch-role]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.currentTarget.getAttribute('data-switch-role');
        this.loginWithDemo(role);
      });
    });

    // Modal Trigger
    const authTrigger = document.getElementById('btn-open-auth');
    if (authTrigger) {
      authTrigger.addEventListener('click', () => this.openAuthModal());
    }

    const authClose = document.getElementById('btn-close-auth');
    if (authClose) {
      authClose.addEventListener('click', () => this.closeAuthModal());
    }

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Auth Form Submit
    const authForm = document.getElementById('form-auth');
    if (authForm) {
      authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));
    }

    // Switch between Login and Register tabs inside modal
    const tabLogin = document.getElementById('tab-auth-login');
    const tabRegister = document.getElementById('tab-auth-register');
    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', () => this.setAuthTab('login'));
      tabRegister.addEventListener('click', () => this.setAuthTab('register'));
    }
  },

  async loginWithDemo(roleKey, silent = false) {
    const creds = this.demoAccounts[roleKey];
    if (!creds) {
      window.zewaApp.showToast(`No demo account configured for "${roleKey}".`, 'error');
      return;
    }

    try {
      if (!silent) window.zewaApp.showToast(`Signing in as ${creds.name}...`, 'info');
      const res = await window.zewaApi.login(creds.email, creds.password);
      if (!res.user) {
        throw new Error('Authentication response did not return a valid user profile.');
      }
      this.currentRole = res.user.role;
      this.updateUiForLoggedInUser(res.user);
      this.closeAuthModal();

      // Trigger app view change
      window.zewaApp.onRoleSwitched(this.currentRole);

      if (!silent) window.zewaApp.showToast(`Welcome back, ${res.user.full_name}!`, 'success');
    } catch (err) {
      console.error('[Auth] Demo login failed:', err);
      if (!silent) {
        window.zewaApp.showToast(`Login failed: ${err.message}`, 'error');
      } else {
        window.zewaApp.showToast(`Backend connection notice: ${err.message}`, 'warning');
      }
    }
  },

  async handleAuthSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const isRegister = form.getAttribute('data-mode') === 'register';

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      let res;
      if (isRegister) {
        const full_name = form.full_name.value.trim();
        const role = form.role.value;
        const phone = form.phone.value.trim();
        const restaurant_name = form.restaurant_name ? form.restaurant_name.value.trim() : null;
        const address = form.address ? form.address.value.trim() : null;

        res = await window.zewaApi.register({
          email,
          password,
          full_name,
          role,
          phone,
          restaurant_name,
          address
        });
        window.zewaApp.showToast('Account created successfully!', 'success');
      } else {
        res = await window.zewaApi.login(email, password);
        window.zewaApp.showToast('Welcome back!', 'success');
      }

      this.currentRole = res.user.role;
      this.updateUiForLoggedInUser(res.user);
      this.closeAuthModal();
      window.zewaApp.onRoleSwitched(this.currentRole);
    } catch (err) {
      window.zewaApp.showToast(err.message, 'error');
    }
  },

  logout() {
    window.zewaApi.logout();
    this.currentRole = 'customer';
    this.updateUiForLoggedInUser(null);
    window.zewaApp.showToast('Logged out', 'info');
    // Re-login demo customer
    this.loginWithDemo('customer', true);
  },

  updateUiForLoggedInUser(user) {
    const userBadge = document.getElementById('header-user-badge');
    const rolePills = document.querySelectorAll('[data-switch-role]');

    if (user) {
      if (userBadge) {
        userBadge.innerHTML = `
          <div class="user-chip">
            <span class="user-avatar">${user.full_name.charAt(0).toUpperCase()}</span>
            <span class="user-name">${user.full_name.split(' ')[0]}</span>
            <span class="user-role-tag">${user.role.replace('_', ' ')}</span>
          </div>
        `;
      }

      // Highlight active role switcher pill
      rolePills.forEach(pill => {
        const target = pill.getAttribute('data-switch-role');
        const roleKey = user.role === 'delivery_partner' ? 'delivery' : user.role;
        pill.classList.toggle('active', target === roleKey);
      });
    } else {
      if (userBadge) {
        userBadge.innerHTML = `<button class="btn btn-outline btn-sm" id="btn-open-auth">Log In</button>`;
        const btn = document.getElementById('btn-open-auth');
        if (btn) btn.addEventListener('click', () => this.openAuthModal());
      }
    }
  },

  openAuthModal() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.classList.add('is-open');
  },

  closeAuthModal() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.classList.remove('is-open');
  },

  setAuthTab(mode) {
    const form = document.getElementById('form-auth');
    const tabLogin = document.getElementById('tab-auth-login');
    const tabRegister = document.getElementById('tab-auth-register');
    const registerFields = document.querySelectorAll('.register-only');

    if (!form) return;
    form.setAttribute('data-mode', mode);

    if (mode === 'register') {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerFields.forEach(el => el.style.display = 'block');
      form.querySelector('button[type="submit"]').textContent = 'Create ZEWA Account';
    } else {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      registerFields.forEach(el => el.style.display = 'none');
      form.querySelector('button[type="submit"]').textContent = 'Log In';
    }
  }
};
