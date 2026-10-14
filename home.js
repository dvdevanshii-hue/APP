/**
 * Home Dashboard Component
 * Clean, modern, emergency-focused dashboard with SOS trigger and quick features
 */

window.renderHomeScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = window.CER_STATE.get('currentUser') || { name: 'Citizen', role: 'citizen' };
  const loc = window.CER_STATE.get('currentLocation') || { address: 'Rohini Sector 14, New Delhi' };
  const alerts = window.CER_DB.getAll('alerts').filter(a => a.active);
  const criticalAlert = alerts.find(a => a.severity === 'Critical') || alerts[0];
  const hospitalsCount = window.CER_DB.getAll('hospitals').length;
  const ambulancesAvailable = window.CER_DB.getAll('ambulances').filter(a => a.status === 'Available').length;
  const donorsCount = window.CER_DB.getAll('blood_donors').filter(d => d.availability === 'Available').length;
  const resources = window.CER_DB.getAll('resources');
  const notifications = window.CER_DB.getAll('notifications');
  const unreadCount = notifications.filter(n => !n.read).length;

  container.innerHTML = `
    <div class="home-screen-wrapper">
      <!-- Top Mobile App Header -->
      <header class="home-app-header">
        <div class="header-brand">
          <div class="brand-logo-pill">🚨</div>
          <div>
            <span class="brand-app-name">Community Emergency</span>
            <div class="user-greeting">Hello, <b>${user.name.split(' ')[0]}</b> <span class="role-chip ${user.role}">${user.role}</span></div>
          </div>
        </div>
        <div class="header-actions">
          <button class="icon-btn-header" onclick="window.CER_STATE.navigate('notifications')" aria-label="Notifications">
            🔔
            ${unreadCount > 0 ? `<span class="badge-dot-unread">${unreadCount}</span>` : ''}
          </button>
          <button class="profile-avatar-btn" onclick="window.CER_STATE.navigate('profile')" aria-label="Profile">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" alt="${user.name}" class="header-avatar-img" />
          </button>
        </div>
      </header>

      <!-- Prototype Notice Banner -->
      <div class="prototype-banner-top">
        <span class="warning-icon">⚠️</span>
        <div class="banner-text">
          <b>PROTOTYPE SYSTEM</b>: In a real life-threatening emergency, dial <b>112 / 102</b> immediately. This app provides coordinated community response simulation.
        </div>
      </div>

      <!-- Current Location Bar -->
      <div class="current-location-card" onclick="window.CER_MAP.openLocationPicker()">
        <div class="loc-left">
          <span class="loc-radar-icon">📡</span>
          <div>
            <div class="loc-label">CURRENT LOCATION</div>
            <div class="loc-name">${loc.address}</div>
          </div>
        </div>
        <button class="btn-change-loc">Change ▾</button>
      </div>

      <!-- Primary Red Emergency SOS Button Section -->
      <section class="sos-hero-section">
        <div class="sos-outer-pulse">
          <div class="sos-glow-ring ring-a"></div>
          <div class="sos-glow-ring ring-b"></div>
          <button class="btn-emergency-sos-giant" onclick="window.triggerSosConfirmation()">
            <span class="sos-siren-icon">🚨</span>
            <span class="sos-main-text">EMERGENCY SOS</span>
            <span class="sos-sub-text">Press to Request Instant Aid</span>
          </button>
        </div>
        <p class="sos-hint">One-tap coordinates dispatch & alerts nearest emergency units</p>
      </section>

      <!-- Quick Feature Grid -->
      <section class="feature-grid-section">
        <h3 class="section-title">Emergency Response Hub</h3>
        
        <div class="features-grid">
          <!-- Nearby Hospitals -->
          <div class="feature-card" onclick="window.CER_STATE.navigate('hospitals')">
            <div class="card-icon-bubble hosp">🏥</div>
            <div class="card-content">
              <h4>Nearby Hospitals</h4>
              <p>Trauma, ICU & 24/7 ER</p>
            </div>
            <span class="card-count-badge">${hospitalsCount} Found</span>
          </div>

          <!-- Ambulance Locator -->
          <div class="feature-card" onclick="window.CER_STATE.navigate('ambulances')">
            <div class="card-icon-bubble amb">🚑</div>
            <div class="card-content">
              <h4>Ambulance</h4>
              <p>ALS & BLS Dispatch</p>
            </div>
            <span class="card-count-badge available">${ambulancesAvailable} Available</span>
          </div>

          <!-- Blood Donors -->
          <div class="feature-card" onclick="window.CER_STATE.navigate('blood-search')">
            <div class="card-icon-bubble blood">🩸</div>
            <div class="card-content">
              <h4>Blood Donors</h4>
              <p>Find or Register Donor</p>
            </div>
            <span class="card-count-badge">${donorsCount} Active</span>
          </div>

          <!-- Volunteers -->
          <div class="feature-card" onclick="window.CER_STATE.navigate('volunteers')">
            <div class="card-icon-bubble vol">🙋</div>
            <div class="card-content">
              <h4>Volunteers</h4>
              <p>Join or Request Aid</p>
            </div>
            <span class="card-count-badge">Join Team</span>
          </div>

          <!-- Resources -->
          <div class="feature-card" onclick="window.CER_STATE.navigate('resources')">
            <div class="card-icon-bubble res">📦</div>
            <div class="card-content">
              <h4>Resources</h4>
              <p>Food, Water, Meds & O₂</p>
            </div>
            <span class="card-count-badge">${resources.length} Types</span>
          </div>

          <!-- Emergency Alerts -->
          <div class="feature-card" onclick="window.CER_STATE.navigate('alerts')">
            <div class="card-icon-bubble alert">📢</div>
            <div class="card-content">
              <h4>Emergency Alerts</h4>
              <p>Disaster & Weather Warnings</p>
            </div>
            <span class="card-count-badge ${alerts.length > 0 ? 'critical' : ''}">${alerts.length} Active</span>
          </div>

          <!-- Report Incident -->
          <div class="feature-card span-full report-card" onclick="window.CER_STATE.navigate('incident-report')">
            <div class="card-icon-bubble report">📝</div>
            <div class="card-content">
              <h4>Report Incident / Crisis</h4>
              <p>Upload photo, location & details for rapid response</p>
            </div>
            <span class="btn-report-arrow">Report Now →</span>
          </div>
        </div>
      </section>

      <!-- Admin Fast Access (for Admin Users) -->
      ${user.role === 'admin' ? `
        <div class="admin-quick-card" onclick="window.CER_STATE.navigate('admin-dashboard')">
          <div class="admin-quick-left">
            <span class="admin-badge-icon">🛡️</span>
            <div>
              <b>Incident Commander Dashboard</b>
              <p>Manage incidents, dispatches, alert broadcast & resources</p>
            </div>
          </div>
          <button class="btn-open-admin">Open Portal →</button>
        </div>
      ` : ''}

      <!-- Speed Dial Emergency Helplines -->
      <section class="helplines-section">
        <h3 class="section-title">National Emergency Helplines (Direct Call)</h3>
        <div class="speed-dial-grid">
          <a href="tel:112" class="speed-dial-item">
            <span class="speed-icon">🚨</span>
            <div class="speed-num">112</div>
            <div class="speed-label">National Emergency</div>
          </a>
          <a href="tel:102" class="speed-dial-item">
            <span class="speed-icon">🚑</span>
            <div class="speed-num">102 / 108</div>
            <div class="speed-label">Ambulance</div>
          </a>
          <a href="tel:101" class="speed-dial-item">
            <span class="speed-icon">🚒</span>
            <div class="speed-num">101</div>
            <div class="speed-label">Fire Rescue</div>
          </a>
          <a href="tel:1077" class="speed-dial-item">
            <span class="speed-icon">🌊</span>
            <div class="speed-num">1077</div>
            <div class="speed-label">Disaster Control</div>
          </a>
        </div>
      </section>
    </div>
  `;
};

window.triggerSosConfirmation = function() {
  window.showModal(`
    <div class="modal-card sos-confirm-modal">
      <div class="modal-header">
        <div class="header-icon sos">🚨</div>
        <div>
          <h3 class="title" style="color:var(--color-error)">Activate Emergency SOS?</h3>
          <p class="subtitle">This will record an urgent crisis incident at your GPS coordinates</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="sos-confirm-warning">
          <p>⚠️ <b>Warning</b>: Use this feature for genuine emergencies requiring immediate medical, fire, or rescue support.</p>
        </div>
        <p>Your recorded location: <br><b>${window.CER_STATE.get('currentLocation').address}</b></p>
      </div>
      <div class="modal-actions">
        <button class="btn-danger-large" onclick="window.activateSosNow()">
          🚨 ACTIVATE SOS NOW
        </button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};
