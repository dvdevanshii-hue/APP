/**
 * Login & Registration Component
 * Multi-role authentication (Citizen vs Admin) with form validation
 */

window.renderAuthScreen = function(mode = 'login') {
  const container = document.getElementById('view-container');
  if (!container) return;

  const isLogin = mode === 'login';

  container.innerHTML = `
    <div class="auth-screen-wrapper">
      <div class="auth-header">
        <div class="auth-logo-badge">🚨</div>
        <h2 class="auth-title">${isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p class="auth-subtitle">${isLogin ? 'Sign in to access emergency response network' : 'Register to request aid, volunteer or donate blood'}</p>
      </div>

      <!-- Quick Demo Role Switcher -->
      <div class="quick-demo-roles">
        <span class="quick-label">⚡ Quick Demo Login:</span>
        <div class="demo-role-buttons">
          <button type="button" class="btn-demo-role citizen" onclick="window.demoLogin('citizen')">
            👤 Citizen (Rahul)
          </button>
          <button type="button" class="btn-demo-role admin" onclick="window.demoLogin('admin')">
            🛡️ Admin / Dispatcher
          </button>
        </div>
      </div>

      <div class="auth-card">
        <!-- Role Tabs for registration / login context -->
        <div class="role-selector-tabs">
          <button type="button" class="role-tab active" id="tab-role-citizen" onclick="window.setAuthRole('citizen')">
            Citizen / User
          </button>
          <button type="button" class="role-tab" id="tab-role-admin" onclick="window.setAuthRole('admin')">
            Emergency Admin
          </button>
        </div>

        <form id="auth-form" onsubmit="window.handleAuthSubmit(event, '${mode}')" novalidate>
          <input type="hidden" id="auth-selected-role" value="citizen" />

          ${!isLogin ? `
            <!-- Registration Only Fields -->
            <div class="form-group">
              <label for="reg-name">Full Name <span class="req">*</span></label>
              <div class="input-with-icon">
                <span class="field-icon">👤</span>
                <input type="text" id="reg-name" placeholder="e.g. Rahul Sharma" required />
              </div>
              <small class="error-msg" id="err-name"></small>
            </div>
          ` : ''}

          <div class="form-group">
            <label for="auth-email">Email Address <span class="req">*</span></label>
            <div class="input-with-icon">
              <span class="field-icon">✉️</span>
              <input type="email" id="auth-email" placeholder="name@example.com" required />
            </div>
            <small class="error-msg" id="err-email"></small>
          </div>

          ${!isLogin ? `
            <div class="form-group">
              <label for="reg-phone">Mobile Phone Number <span class="req">*</span></label>
              <div class="input-with-icon">
                <span class="field-icon">📱</span>
                <input type="tel" id="reg-phone" placeholder="+91 98765 43210" required />
              </div>
              <small class="error-msg" id="err-phone"></small>
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label for="reg-city">City / Area <span class="req">*</span></label>
                <div class="input-with-icon">
                  <span class="field-icon">📍</span>
                  <input type="text" id="reg-city" placeholder="e.g. Rohini, Delhi" required />
                </div>
                <small class="error-msg" id="err-city"></small>
              </div>

              <div class="form-group half">
                <label for="reg-blood">Blood Group <small>(Optional)</small></label>
                <div class="input-with-icon">
                  <span class="field-icon">🩸</span>
                  <select id="reg-blood">
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
          ` : ''}

          <div class="form-group">
            <div class="label-with-action">
              <label for="auth-password">Password <span class="req">*</span></label>
              ${isLogin ? `<a href="javascript:void(0)" class="forgot-link" onclick="window.showForgotPasswordModal()">Forgot Password?</a>` : ''}
            </div>
            <div class="input-with-icon">
              <span class="field-icon">🔒</span>
              <input type="password" id="auth-password" placeholder="••••••••" required />
              <button type="button" class="btn-toggle-password" onclick="window.togglePasswordVisibility('auth-password', this)">👁️</button>
            </div>
            <small class="error-msg" id="err-password"></small>
          </div>

          ${!isLogin ? `
            <div class="form-group">
              <label for="reg-confirm-password">Confirm Password <span class="req">*</span></label>
              <div class="input-with-icon">
                <span class="field-icon">🔒</span>
                <input type="password" id="reg-confirm-password" placeholder="••••••••" required />
              </div>
              <small class="error-msg" id="err-confirm-password"></small>
            </div>

            <div class="form-group checkbox-group">
              <label class="custom-checkbox">
                <input type="checkbox" id="reg-terms" required />
                <span class="checkbox-box"></span>
                <span class="checkbox-label">I agree to the <a href="javascript:void(0)" onclick="window.showTermsModal()">Terms of Emergency Service</a> and Privacy Notice</span>
              </label>
              <small class="error-msg" id="err-terms"></small>
            </div>
          ` : ''}

          <button type="submit" class="btn-primary auth-submit-btn" id="btn-auth-submit">
            ${isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div class="auth-footer-toggle">
          ${isLogin ? `
            <p>Don't have an account? <a href="javascript:void(0)" onclick="window.renderAuthScreen('register')">Create an Account</a></p>
          ` : `
            <p>Already have an account? <a href="javascript:void(0)" onclick="window.renderAuthScreen('login')">Sign In</a></p>
          `}
        </div>
      </div>
    </div>
  `;
};

window.setAuthRole = function(role) {
  const hiddenRole = document.getElementById('auth-selected-role');
  if (hiddenRole) hiddenRole.value = role;

  const tabCitizen = document.getElementById('tab-role-citizen');
  const tabAdmin = document.getElementById('tab-role-admin');
  if (tabCitizen && tabAdmin) {
    if (role === 'admin') {
      tabAdmin.classList.add('active');
      tabCitizen.classList.remove('active');
    } else {
      tabCitizen.classList.add('active');
      tabAdmin.classList.remove('active');
    }
  }
};

window.demoLogin = async function(role) {
  const email = role === 'admin' ? 'admin@emergency.gov' : 'citizen@example.com';
  const pass = role === 'admin' ? 'admin123' : 'password123';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();
    if (data.success && data.user) {
      window.CER_STATE.setUser(data.user);
      window.showToast(`Logged in as ${data.user.name} (${data.user.role.toUpperCase()})`, 'success');
      if (data.user.role === 'admin') {
        window.CER_STATE.navigate('admin-dashboard');
      } else {
        window.CER_STATE.navigate('home');
      }
      return;
    }
  } catch (err) {
    console.warn('API login failed, using session fallback:', err);
  }

  // Fallback demo user
  const fallbackUser = {
    id: role === 'admin' ? 'USR-ADMIN-1' : 'USR-CITIZEN-1',
    name: role === 'admin' ? 'Emergency Admin' : 'Rahul Sharma',
    email: email,
    role: role,
    bloodGroup: 'O+',
    volunteerStatus: role === 'admin' ? 'Incident Commander' : 'Registered Citizen'
  };
  window.CER_STATE.setUser(fallbackUser);
  window.showToast(`Logged in as ${fallbackUser.name} (${role.toUpperCase()})`, 'success');
  if (role === 'admin') {
    window.CER_STATE.navigate('admin-dashboard');
  } else {
    window.CER_STATE.navigate('home');
  }
};

window.handleAuthSubmit = async function(e, mode) {
  e.preventDefault();

  // Reset errors
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

  const isLogin = mode === 'login';
  const role = document.getElementById('auth-selected-role').value;
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');
  const submitBtn = document.getElementById('btn-auth-submit');
  
  let hasError = false;

  // Validate Email
  const email = emailInput.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('err-email').textContent = 'Please enter a valid email address';
    hasError = true;
  }

  // Validate Password
  const pass = passInput.value;
  if (!pass || pass.length < 6) {
    document.getElementById('err-password').textContent = 'Password must be at least 6 characters';
    hasError = true;
  }

  if (!isLogin) {
    const nameInput = document.getElementById('reg-name');
    const phoneInput = document.getElementById('reg-phone');
    const cityInput = document.getElementById('reg-city');
    const confirmPassInput = document.getElementById('reg-confirm-password');
    const termsInput = document.getElementById('reg-terms');

    if (!nameInput.value.trim()) {
      document.getElementById('err-name').textContent = 'Full name is required';
      hasError = true;
    }
    if (!phoneInput.value.trim() || phoneInput.value.length < 8) {
      document.getElementById('err-phone').textContent = 'Valid phone number is required';
      hasError = true;
    }
    if (!cityInput.value.trim()) {
      document.getElementById('err-city').textContent = 'City / Area is required';
      hasError = true;
    }
    if (confirmPassInput.value !== pass) {
      document.getElementById('err-confirm-password').textContent = 'Passwords do not match';
      hasError = true;
    }
    if (!termsInput.checked) {
      document.getElementById('err-terms').textContent = 'You must accept the terms to continue';
      hasError = true;
    }

    if (hasError) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
    }

    try {
      const payload = {
        name: nameInput.value.trim(),
        email: email,
        password: pass,
        phone: phoneInput.value.trim(),
        role: role,
        area: cityInput.value.trim(),
        city: cityInput.value.trim(),
        bloodGroup: document.getElementById('reg-blood').value || 'Unknown',
        volunteerStatus: role === 'admin' ? 'Coordinator' : 'Registered Citizen'
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.user) {
        window.CER_STATE.setUser(data.user);
        window.showToast('Registration successful! Welcome to Community Emergency Response.', 'success');
        if (role === 'admin') {
          window.CER_STATE.navigate('admin-dashboard');
        } else {
          window.CER_STATE.navigate('home');
        }
        return;
      } else {
        document.getElementById('err-email').textContent = data.error || 'Registration failed';
        window.showToast(data.error || 'Registration error', 'error');
      }
    } catch (err) {
      console.error('Registration error:', err);
      window.showToast('Network error while registering', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    }

  } else {
    // Login
    if (hasError) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();

      if (data.success && data.user) {
        window.CER_STATE.setUser(data.user);
        window.showToast(`Logged in successfully as ${data.user.name}`, 'success');
        if (data.user.role === 'admin') {
          window.CER_STATE.navigate('admin-dashboard');
        } else {
          window.CER_STATE.navigate('home');
        }
      } else {
        document.getElementById('err-password').textContent = data.error || 'Invalid credentials';
        window.showToast('Authentication failed. Check your email & password.', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      window.showToast('Server connection error', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      }
    }
  }
};

window.showForgotPasswordModal = function() {
  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon">🔑</div>
        <div>
          <h3 class="title">Reset Emergency Password</h3>
          <p class="subtitle">Enter your registered email to receive an instant verification code</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" id="reset-email" placeholder="name@example.com" class="input-full" />
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.sendResetCode()">Send Verification Link</button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};

window.sendResetCode = function() {
  const emailInput = document.getElementById('reset-email');
  if (!emailInput || !emailInput.value) {
    window.showToast('Please enter your email', 'warning');
    return;
  }
  window.closeModal();
  window.showToast('Password reset link sent to ' + emailInput.value + ' (Simulation)', 'success');
};

window.togglePasswordVisibility = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
};

window.showTermsModal = function() {
  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon">📋</div>
        <div>
          <h3 class="title">Terms & Conditions</h3>
          <p class="subtitle">Community Emergency Response & Resource Management System</p>
        </div>
      </div>
      <div class="modal-body" style="max-height: 280px; overflow-y: auto; font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
        <p><strong>1. Emergency Usage:</strong> This system is designed to coordinate community aid during crises. Do not submit false SOS requests or fake incident reports.</p>
        <p style="margin-top: 8px;"><strong>2. Privacy Protection:</strong> Exact contact and address details of blood donors and vulnerable citizens are protected and masked.</p>
        <p style="margin-top: 8px;"><strong>3. Prototype Disclaimer:</strong> Unless connected to municipal dispatch APIs, emergency requests are handled within the community volunteer grid.</p>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.closeModal()">I Understand & Agree</button>
      </div>
    </div>
  `);
};
