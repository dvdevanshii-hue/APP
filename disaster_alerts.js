/**
 * Natural Disasters & Crisis Alerts Module
 * Dedicated module for Flood, Tsunami, Landslide, Earthquake, Cyclone, Wildfire,
 * Severe Storm, Heavy Rainfall, Extreme Weather, Fire & Other Emergencies.
 */

window.renderDisasterAlertsScreen = function(initialFilter = 'All') {
  const container = document.getElementById('view-container');
  if (!container) return;

  const alerts = window.CER_DB.getAll('alerts').filter(a => a.active);
  const user = window.CER_STATE.get('currentUser') || {};
  const isAdmin = user.role === 'admin';

  container.innerHTML = `
    <div class="disaster-alerts-wrapper">
      <!-- Screen Top Bar -->
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Natural Disasters & Crisis</span>
        <span class="demo-tag-pill">Demo Alerts</span>
      </div>

      <!-- Prototype Simulation Notice (Strict Requirement) -->
      <div class="disaster-prototype-notice">
        <span class="warn-symbol">⚠️</span>
        <div class="notice-content">
          <b>PROTOTYPE / DEMO DISCLAIMER:</b>
          This application displays simulated crisis alerts for demonstration. It does <b>NOT</b> generate or claim live real-time warnings unless connected to authorized governmental meteorological & geological disaster APIs.
        </div>
      </div>

      <!-- Quick Summary Metric Bar -->
      <div class="disaster-kpi-bar">
        <div class="kpi-mini-card red">
          <span class="kpi-mini-val">${alerts.filter(a => a.severity === 'Critical').length}</span>
          <span class="kpi-mini-label">Critical</span>
        </div>
        <div class="kpi-mini-card orange">
          <span class="kpi-mini-val">${alerts.filter(a => a.severity === 'High').length}</span>
          <span class="kpi-mini-label">High Threat</span>
        </div>
        <div class="kpi-mini-card yellow">
          <span class="kpi-mini-val">${alerts.filter(a => a.severity === 'Medium').length}</span>
          <span class="kpi-mini-label">Advisory</span>
        </div>
        <div class="kpi-mini-card blue" onclick="window.openDisasterGuideModal()">
          <span class="kpi-mini-val">🛡️</span>
          <span class="kpi-mini-label">Safety Guide</span>
        </div>
      </div>

      <!-- Admin Fast Action Broadcast Bar -->
      ${isAdmin ? `
        <div class="admin-disaster-broadcast-strip">
          <button class="btn-admin-broadcast-disaster" onclick="window.openCreateDisasterAlertModal()">
            📢 Issue New Natural Disaster Alert
          </button>
        </div>
      ` : ''}

      <!-- Search & Disaster Filter Bar -->
      <div class="disaster-filter-section">
        <div class="disaster-search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="disaster-search-input" placeholder="Search disaster, area, or keyword..." oninput="window.filterDisasterAlerts()" />
        </div>

        <div class="disaster-chips-row" id="disaster-filter-chips">
          <button class="disaster-filter-chip ${initialFilter === 'All' ? 'active' : ''}" onclick="window.setDisasterFilter('All')">All</button>
          <button class="disaster-filter-chip ${initialFilter === 'Flood' ? 'active' : ''}" onclick="window.setDisasterFilter('Flood')">🌊 Flood</button>
          <button class="disaster-filter-chip ${initialFilter === 'Tsunami' ? 'active' : ''}" onclick="window.setDisasterFilter('Tsunami')">🌊 Tsunami</button>
          <button class="disaster-filter-chip ${initialFilter === 'Landslide' ? 'active' : ''}" onclick="window.setDisasterFilter('Landslide')">⛰️ Landslide</button>
          <button class="disaster-filter-chip ${initialFilter === 'Earthquake' ? 'active' : ''}" onclick="window.setDisasterFilter('Earthquake')">🌍 Earthquake</button>
          <button class="disaster-filter-chip ${initialFilter === 'Cyclone' ? 'active' : ''}" onclick="window.setDisasterFilter('Cyclone')">🌪️ Cyclone</button>
          <button class="disaster-filter-chip ${initialFilter === 'Fire' ? 'active' : ''}" onclick="window.setDisasterFilter('Fire')">🔥 Fire</button>
          <button class="disaster-filter-chip ${initialFilter === 'Storm' ? 'active' : ''}" onclick="window.setDisasterFilter('Storm')">⛈️ Storm</button>
          <button class="disaster-filter-chip ${initialFilter === 'Other' ? 'active' : ''}" onclick="window.setDisasterFilter('Other')">⚠️ Other</button>
        </div>
      </div>

      <!-- Disaster Alerts Feed Container -->
      <div class="disaster-alerts-list" id="disaster-cards-container">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  // Apply initial filter
  window.activeDisasterFilter = initialFilter;
  window.filterDisasterAlerts();
};

window.setDisasterFilter = function(filterCategory) {
  window.activeDisasterFilter = filterCategory;
  document.querySelectorAll('#disaster-filter-chips .disaster-filter-chip').forEach(el => {
    el.classList.remove('active');
    if (el.textContent.includes(filterCategory)) {
      el.classList.add('active');
    }
  });
  window.filterDisasterAlerts();
};

window.filterDisasterAlerts = function() {
  const container = document.getElementById('disaster-cards-container');
  if (!container) return;

  const searchQuery = document.getElementById('disaster-search-input')?.value.toLowerCase().trim() || '';
  const filterCat = window.activeDisasterFilter || 'All';
  const allAlerts = window.CER_DB.getAll('alerts').filter(a => a.active);

  const filtered = allAlerts.filter(alert => {
    const type = alert.disasterType || '';
    
    // Category mapping
    if (filterCat !== 'All') {
      if (filterCat === 'Flood' && type !== 'Flood') return false;
      if (filterCat === 'Tsunami' && type !== 'Tsunami') return false;
      if (filterCat === 'Landslide' && type !== 'Landslide') return false;
      if (filterCat === 'Earthquake' && type !== 'Earthquake') return false;
      if (filterCat === 'Cyclone' && type !== 'Cyclone') return false;
      if (filterCat === 'Fire' && type !== 'Fire' && type !== 'Wildfire') return false;
      if (filterCat === 'Storm' && type !== 'Severe Storm' && type !== 'Heavy Rainfall') return false;
      if (filterCat === 'Other' && type !== 'Extreme Weather' && type !== 'Other Emergency') return false;
    }

    // Search query
    if (searchQuery) {
      const matchTitle = alert.title.toLowerCase().includes(searchQuery);
      const matchArea = alert.affectedArea.toLowerCase().includes(searchQuery);
      const matchDesc = alert.description.toLowerCase().includes(searchQuery);
      const matchType = type.toLowerCase().includes(searchQuery);
      if (!matchTitle && !matchArea && !matchDesc && !matchType) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card">
        <span class="empty-icon">🛡️</span>
        <h3>No Alerts for Current Filter</h3>
        <p>No active natural disaster warnings matching "${filterCat}". Tap "All" to view other advisories.</p>
        <button class="btn-secondary" onclick="window.setDisasterFilter('All')">Show All Disaster Alerts</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(alert => window.renderDisasterCardHtml(alert)).join('');
};

window.renderDisasterCardHtml = function(alert) {
  const sev = alert.severity || 'High';
  const sevClass = sev.toLowerCase();
  const icon = alert.disasterIcon || '⚠️';
  const type = alert.disasterType || 'Emergency';
  const status = alert.status || 'Active Warning';
  const instructions = Array.isArray(alert.safetyInstructions)
    ? alert.safetyInstructions
    : (alert.safetyInstructions || '').split('\n').filter(Boolean);

  const resources = alert.nearbyResources || [
    'District Relief Camp #1',
    'Ambulance Triage Unit',
    'Emergency Bottled Water Supplies'
  ];

  return `
    <div class="disaster-feed-card sev-${sevClass}">
      <!-- Top Meta Banner -->
      <div class="dfc-top-bar">
        <div class="dfc-type-pill">
          <span class="dfc-icon">${icon}</span>
          <span class="dfc-name">${type.toUpperCase()}</span>
          <span class="dfc-status-chip ${status.toLowerCase().replace(/\s+/g, '-')}">${status}</span>
        </div>
        <div class="dfc-sev-badge ${sevClass}">
          <span class="pulse-sev-dot"></span>
          ${sev.toUpperCase()}
        </div>
      </div>

      <!-- Alert Title & Headline -->
      <h3 class="dfc-title">${alert.title}</h3>

      <!-- Location & Time -->
      <div class="dfc-meta-row">
        <span>📍 <b>Affected Area:</b> ${alert.affectedArea}</span>
        <span>🕒 ${alert.date}</span>
      </div>

      <!-- Description -->
      <p class="dfc-description">${alert.description}</p>

      <!-- Safety Instructions Section -->
      <div class="dfc-instructions-box">
        <div class="instructions-header">
          <span>🛡️ Safety Instructions:</span>
        </div>
        <ul class="instructions-list">
          ${instructions.map(inst => `<li>${inst.replace(/^[0-9]+\.\s*/, '')}</li>`).join('')}
        </ul>
      </div>

      <!-- Nearby Emergency Resources -->
      <div class="dfc-resources-box">
        <div class="resources-header">
          <span>📦 Emergency Resources Nearby:</span>
        </div>
        <div class="resource-pills-row">
          ${resources.map(res => `
            <span class="resource-mini-tag">${res}</span>
          `).join('')}
        </div>
      </div>

      <!-- Action Buttons [View Details] [Nearby Help] -->
      <div class="dfc-action-buttons">
        <button class="btn-dfc-details" onclick="window.openDisasterDetailModal('${alert.id}')">
          ℹ️ View Details
        </button>
        <button class="btn-dfc-help" onclick="window.openDisasterHelpModal('${alert.id}')">
          🚨 Nearby Help
        </button>
      </div>

      <!-- Demo watermark footer -->
      <div class="dfc-card-footer">
        <span class="demo-tag-label">⚠️ Demo Alert • Official Verification Needed</span>
        <span class="authority-label">Source: ${alert.issuedBy || 'Civil Defense'}</span>
      </div>
    </div>
  `;
};

// View Details Modal
window.openDisasterDetailModal = function(alertId) {
  const alert = window.CER_DB.getById('alerts', alertId);
  if (!alert) return;

  const instructions = Array.isArray(alert.safetyInstructions)
    ? alert.safetyInstructions
    : (alert.safetyInstructions || '').split('\n').filter(Boolean);

  window.showModal(`
    <div class="modal-card disaster-detail-modal">
      <div class="modal-header">
        <div class="header-icon alert">${alert.disasterIcon || '🚨'}</div>
        <div>
          <h3 class="title">${alert.title}</h3>
          <span class="badge ${alert.severity === 'Critical' ? 'badge-red' : 'badge-orange'}">${alert.severity} SEVERITY</span>
          <span class="badge badge-blue">${alert.status || 'Active Warning'}</span>
        </div>
      </div>

      <div class="modal-body">
        <div class="disaster-detail-meta">
          <p><b>📍 Affected Location:</b> ${alert.affectedArea}</p>
          <p><b>🕒 Issue Timestamp:</b> ${alert.date}</p>
          <p><b>🏢 Authorized Agency:</b> ${alert.issuedBy || 'State Disaster Management Authority'}</p>
        </div>

        <div class="disaster-detail-desc">
          <h4>Situational Threat Assessment</h4>
          <p>${alert.description}</p>
        </div>

        <div class="disaster-protocol-section">
          <h4>🚨 Official Action Protocol & Do's / Don'ts</h4>
          <ul class="detail-protocol-list">
            ${instructions.map(inst => `<li><b>•</b> ${inst}</li>`).join('')}
          </ul>
        </div>

        <div class="disaster-nearby-facilities">
          <h4>🏥 Nearby Emergency Assets Assigned</h4>
          ${(alert.nearbyResources || []).map(r => `
            <div class="facility-row-item">
              <span>📍 ${r}</span>
              <span class="status-green">Ready</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-primary" onclick="window.closeModal(); window.openDisasterHelpModal('${alert.id}');">
          🚑 Access Nearby Emergency Help
        </button>
        <button class="btn-text" onclick="window.closeModal()">Close</button>
      </div>
    </div>
  `);
};

// Nearby Help Modal
window.openDisasterHelpModal = function(alertId) {
  const alert = window.CER_DB.getById('alerts', alertId) || {};
  const userLoc = window.CER_STATE.get('currentLocation') || { address: 'Delhi NCR' };
  const hospitals = window.CER_DB.getAll('hospitals').slice(0, 3);
  const ambulances = window.CER_DB.getAll('ambulances').filter(a => a.status === 'Available').slice(0, 2);

  window.showModal(`
    <div class="modal-card disaster-help-modal">
      <div class="modal-header">
        <div class="header-icon hosp">🚨</div>
        <div>
          <h3 class="title">Nearby Emergency Help & Evacuation</h3>
          <p class="subtitle">${alert.disasterType || 'Crisis'} Response • ${alert.affectedArea || userLoc.address}</p>
        </div>
      </div>

      <div class="modal-body">
        <!-- Direct Helplines -->
        <div class="help-hotlines-box">
          <a href="tel:112" class="hotline-btn police">
            <span>🚨 Police / SOS: <b>112</b></span>
          </a>
          <a href="tel:1077" class="hotline-btn disaster">
            <span>🌊 Disaster Helpline: <b>1077</b></span>
          </a>
          <a href="tel:102" class="hotline-btn medical">
            <span>🚑 Ambulance: <b>102 / 108</b></span>
          </a>
        </div>

        <!-- Nearest Hospitals -->
        <div class="help-section-group">
          <h4>🏥 Nearest Emergency Hospitals</h4>
          <div class="help-units-list">
            ${hospitals.map(h => `
              <div class="help-unit-row">
                <div class="unit-info">
                  <b>${h.name}</b>
                  <small>${h.icuBeds} ICU Beds Available • ${h.address.substring(0, 30)}...</small>
                </div>
                <div class="unit-actions">
                  <a href="tel:${h.emergencyPhone || h.phone}" class="btn-unit-call">📞 Call</a>
                  <button class="btn-unit-route" onclick="window.CER_MAP.openDirections('${h.name}', ${h.lat}, ${h.lng})">🧭 Route</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Nearest Ambulances -->
        <div class="help-section-group">
          <h4>🚑 Ready Ambulances</h4>
          <div class="help-units-list">
            ${ambulances.map(a => `
              <div class="help-unit-row">
                <div class="unit-info">
                  <b>Ambulance ${a.id} (${a.type.split(' ')[0]})</b>
                  <small>${a.paramedicTeam}</small>
                </div>
                <button class="btn-unit-dispatch" onclick="window.requestAmbulanceDispatch('${a.id}')">
                  Dispatch
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Community Shelters -->
        <div class="help-section-group">
          <h4>🏕️ Evacuation Shelters & Relief Hubs</h4>
          <div class="shelter-info-pill">
            <b>Central Disaster Shelter #2</b>
            <p>Civil Lines Stadium Grounds • Capacity: 1,500 • Clean Water, Meals & Blankets</p>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-primary" onclick="window.closeModal(); window.CER_STATE.navigate('sos');">
          🚨 Trigger Emergency SOS Coordinates
        </button>
        <button class="btn-text" onclick="window.closeModal()">Back</button>
      </div>
    </div>
  `);
};

// Safety Guide Manual Modal (All Disasters Reference)
window.openDisasterGuideModal = function() {
  const types = window.DISASTER_DEFINITIONS || [];
  const templates = window.DISASTER_SAFETY_TEMPLATES || {};

  window.showModal(`
    <div class="modal-card disaster-guide-modal">
      <div class="modal-header">
        <div class="header-icon">🛡️</div>
        <div>
          <h3 class="title">Civil Defense Disaster Guidelines</h3>
          <p class="subtitle">Standard safety protocols for all natural crises</p>
        </div>
      </div>
      <div class="modal-body" style="max-height:65vh; overflow-y:auto;">
        ${types.map(t => `
          <div class="guide-disaster-block">
            <div class="guide-type-head">
              <span>${t.icon}</span>
              <b>${t.label.toUpperCase()}</b>
            </div>
            <ul class="guide-list">
              ${(templates[t.type] || []).map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.closeModal()">Understood</button>
      </div>
    </div>
  `);
};
