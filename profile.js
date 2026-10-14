/**
 * User Profile Component
 * User credentials, history navigation, settings & role switching (Section 14)
 */

window.renderProfileScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = window.CER_STATE.get('currentUser') || {
    name: 'Rahul Sharma',
    email: 'citizen@example.com',
    phone: '+91 98765 43210',
    area: 'Rohini Sector 14, New Delhi',
    bloodGroup: 'O+',
    role: 'citizen',
    volunteerStatus: 'Registered Citizen'
  };

  const currentTheme = window.CER_STATE.get('theme');
  const isPhoneMockup = window.CER_STATE.get('isPhoneMockup');
  const soundEnabled = window.CER_AUDIO.soundEnabled;

  const myIncidentsCount = window.CER_DB.getAll('incidents').filter(i => i.reportedBy === user.name).length;
  const mySosCount = window.CER_DB.getAll('sos_requests').filter(s => s.userId === user.id).length;

  container.innerHTML = `
    <div class="profile-screen-wrapper">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">User Profile</span>
        <button class="btn-role-switch-pill" onclick="window.toggleUserRoleFast()" title="Switch Role">
          ${user.role === 'admin' ? '🛡️ Admin' : '👤 Citizen'} ⇄
        </button>
      </div>

      <!-- Profile Header Card -->
      <div class="profile-hero-card">
        <div class="profile-avatar-wrap">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="${user.name}" class="profile-avatar-lg" />
          <button class="btn-edit-avatar" onclick="window.promptChangeAvatar()">📷</button>
        </div>

        <h2 class="profile-user-name">${user.name}</h2>
        <div class="profile-role-tag ${user.role}">
          ${user.role === 'admin' ? '🛡️ Disaster Operations Admin' : '👤 Community Citizen'}
        </div>

        <div class="profile-quick-stats">
          <div class="stat-pill">
            <span class="sp-icon">🩸</span>
            <span>Blood: <b>${user.bloodGroup || 'O+'}</b></span>
          </div>
          <div class="stat-pill">
            <span class="sp-icon">🤝</span>
            <span>Status: <b>${user.volunteerStatus || 'Citizen'}</b></span>
          </div>
        </div>
      </div>

      <!-- User Contact Info List -->
      <div class="profile-info-section">
        <h4 class="subhead">Contact & Location</h4>
        <div class="info-list-card">
          <div class="info-item">
            <span class="item-icon">✉️</span>
            <div class="item-content">
              <span class="item-label">Email Address</span>
              <span class="item-value">${user.email}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="item-icon">📱</span>
            <div class="item-content">
              <span class="item-label">Phone Number</span>
              <span class="item-value">${user.phone}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="item-icon">📍</span>
            <div class="item-content">
              <span class="item-label">Residential Area</span>
              <span class="item-value">${user.area || 'New Delhi'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Menu -->
      <div class="profile-menu-section">
        <h4 class="subhead">Activity & Records</h4>
        <div class="menu-list-card">
          <div class="menu-row" onclick="window.openEditProfileModal()">
            <span class="row-icon">✏️</span>
            <span class="row-label">Edit Profile Information</span>
            <span class="row-arrow">›</span>
          </div>
          <div class="menu-row" onclick="window.CER_STATE.navigate('incident-status')">
            <span class="row-icon">📋</span>
            <span class="row-label">My Reported Incidents</span>
            <span class="row-badge">${myIncidentsCount}</span>
            <span class="row-arrow">›</span>
          </div>
          <div class="menu-row" onclick="window.CER_STATE.navigate('sos')">
            <span class="row-icon">🚨</span>
            <span class="row-label">My SOS Emergency Signals</span>
            <span class="row-badge">${mySosCount}</span>
            <span class="row-arrow">›</span>
          </div>
          <div class="menu-row" onclick="window.CER_STATE.navigate('blood-register')">
            <span class="row-icon">🩸</span>
            <span class="row-label">My Blood Donor Profile</span>
            <span class="row-arrow">›</span>
          </div>
          <div class="menu-row" onclick="window.CER_STATE.navigate('volunteers')">
            <span class="row-icon">🙋</span>
            <span class="row-label">My Volunteer Profile</span>
            <span class="row-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- App Preferences / Settings -->
      <div class="profile-menu-section">
        <h4 class="subhead">App Preferences</h4>
        <div class="menu-list-card">
          <!-- Dark Mode Toggle -->
          <div class="menu-row preference-row">
            <div class="pref-left">
              <span class="row-icon">🌙</span>
              <span class="row-label">Dark Theme Mode</span>
            </div>
            <label class="switch-toggle">
              <input type="checkbox" id="toggle-dark-mode" ${currentTheme === 'dark' ? 'checked' : ''} onchange="window.CER_STATE.toggleTheme()" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Smartphone Shell Frame Mode Toggle -->
          <div class="menu-row preference-row">
            <div class="pref-left">
              <span class="row-icon">📱</span>
              <div>
                <span class="row-label">Android Device Mockup Frame</span>
                <small style="display:block; font-size:11px; color:var(--color-on-surface-variant);">Shows mobile status bar & Android shell</small>
              </div>
            </div>
            <label class="switch-toggle">
              <input type="checkbox" id="toggle-phone-frame" ${isPhoneMockup ? 'checked' : ''} onchange="window.CER_STATE.togglePhoneMockup()" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Sound Effects -->
          <div class="menu-row preference-row">
            <div class="pref-left">
              <span class="row-icon">🔊</span>
              <span class="row-label">Emergency Siren & Audio</span>
            </div>
            <label class="switch-toggle">
              <input type="checkbox" id="toggle-sound-effects" ${soundEnabled ? 'checked' : ''} onchange="window.toggleAudioEffects()" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Database Reset to Seed -->
          <div class="menu-row" onclick="window.confirmResetDatabase()">
            <span class="row-icon">🔄</span>
            <span class="row-label" style="color:var(--color-error)">Reset Database to Default Demo Seed</span>
            <span class="row-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- Logout / Switch Role -->
      <div class="profile-logout-wrap">
        <button class="btn-logout" onclick="window.handleLogout()">
          🚪 Logout & Exit Session
        </button>
      </div>
    </div>
  `;
};

window.toggleUserRoleFast = function() {
  const currentRole = window.CER_STATE.get('userRole');
  const targetRole = currentRole === 'admin' ? 'citizen' : 'admin';
  window.CER_STATE.switchRole(targetRole);
  window.showToast(`Switched account to: ${targetRole.toUpperCase()}`, 'info');
  window.renderProfileScreen();
};

window.toggleAudioEffects = function() {
  window.CER_AUDIO.soundEnabled = !window.CER_AUDIO.soundEnabled;
  window.showToast(`Emergency Audio ${window.CER_AUDIO.soundEnabled ? 'Enabled' : 'Muted'}`, 'info');
};

window.openEditProfileModal = function() {
  const user = window.CER_STATE.get('currentUser') || {};
  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon">✏️</div>
        <div>
          <h3 class="title">Edit Profile Information</h3>
          <p class="subtitle">Keep your emergency contact info up to date</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="edit-user-name" value="${user.name || ''}" />
        </div>
        <div class="form-group">
          <label>Mobile Phone</label>
          <input type="tel" id="edit-user-phone" value="${user.phone || ''}" />
        </div>
        <div class="form-group">
          <label>Area / Location</label>
          <input type="text" id="edit-user-area" value="${user.area || ''}" />
        </div>
        <div class="form-group">
          <label>Blood Group</label>
          <select id="edit-user-blood">
            ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => `
              <option value="${bg}" ${user.bloodGroup === bg ? 'selected' : ''}>${bg}</option>
            `).join('')}
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.saveProfileEdits()">Save Profile</button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};

window.saveProfileEdits = function() {
  const user = window.CER_STATE.get('currentUser');
  if (!user) return;

  const name = document.getElementById('edit-user-name')?.value.trim();
  const phone = document.getElementById('edit-user-phone')?.value.trim();
  const area = document.getElementById('edit-user-area')?.value.trim();
  const blood = document.getElementById('edit-user-blood')?.value;

  if (!name || !phone) {
    window.showToast('Name and phone are required', 'warning');
    return;
  }

  window.closeModal();

  const updatedUser = window.CER_DB.update('users', user.id, {
    name, phone, area, bloodGroup: blood
  });

  window.CER_STATE.setUser(updatedUser);
  window.showToast('Profile updated successfully!', 'success');
  window.renderProfileScreen();
};

window.promptChangeAvatar = function() {
  const newUrl = prompt('Enter image URL for profile photo:', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
  if (newUrl) {
    const user = window.CER_STATE.get('currentUser');
    const updated = window.CER_DB.update('users', user.id, { avatar: newUrl });
    window.CER_STATE.setUser(updated);
    window.renderProfileScreen();
  }
};

window.confirmResetDatabase = function() {
  if (confirm('Are you sure you want to reset all data back to the demo factory seeds?')) {
    window.CER_DB.resetToDefaults();
    window.showToast('Database reset to factory demo data.', 'info');
    setTimeout(() => window.location.reload(), 500);
  }
};

window.handleLogout = function() {
  localStorage.removeItem('cerrms_current_user_id');
  window.showToast('Logged out successfully.', 'info');
  window.CER_STATE.navigate('login');
};
