/**
 * Dedicated Emergency SOS Component
 * High-urgency workflow, coordinates broadcast, nearby hospital shortcuts & cancel safeguards
 */

window.renderSosScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const activeSosId = window.CER_STATE.get('activeSosId');
  const user = window.CER_STATE.get('currentUser') || { name: 'Rahul Sharma', phone: '+91 98765 43210' };
  const loc = window.CER_STATE.get('currentLocation') || { address: 'Rohini Sector 14, New Delhi', lat: 28.7110, lng: 77.1235 };

  let activeSosData = null;
  if (activeSosId) {
    activeSosData = window.CER_DB.getById('sos_requests', activeSosId);
  }

  // If SOS is already active
  if (activeSosData && activeSosData.status !== 'Cancelled') {
    window.renderActiveSosView(activeSosData, loc);
    return;
  }

  // Idle SOS Screen (Ready to trigger)
  container.innerHTML = `
    <div class="sos-screen-idle">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Emergency SOS Dispatch</span>
        <button class="btn-info-circle" onclick="window.showSosInfo()">ℹ️</button>
      </div>

      <div class="sos-main-trigger-container">
        <div class="sos-guidance-text">
          <h2>Need Immediate Help?</h2>
          <p>Tap the button below to broadcast emergency coordinates to first responders and community volunteers.</p>
        </div>

        <div class="sos-interactive-button-wrapper">
          <div class="pulse-beacon-halo halo-1"></div>
          <div class="pulse-beacon-halo halo-2"></div>
          <div class="pulse-beacon-halo halo-3"></div>

          <button class="sos-big-red-button" onclick="window.confirmActivateSos()">
            <div class="sos-inner-content">
              <span class="sos-emoji">🚨</span>
              <span class="sos-title">SOS</span>
              <span class="sos-sub">EMERGENCY</span>
            </div>
          </button>
        </div>

        <div class="current-dispatch-coord-card">
          <div class="coord-header">
            <span class="coord-icon">📍</span>
            <span>DISPATCH COORDINATES</span>
          </div>
          <div class="coord-address">${loc.address}</div>
          <small class="coord-latlng">Lat: ${loc.lat.toFixed(5)}, Lng: ${loc.lng.toFixed(5)}</small>
        </div>
      </div>

      <!-- Emergency Quick Call Grid -->
      <div class="sos-helpline-box">
        <div class="helpline-header">DIRECT EMERGENCY DISPATCH</div>
        <div class="helpline-buttons">
          <a href="tel:112" class="btn-helpline-pill red">
            <span>🚨 Police / Unified (112)</span>
          </a>
          <a href="tel:102" class="btn-helpline-pill blue">
            <span>🚑 Ambulance (102 / 108)</span>
          </a>
          <a href="tel:101" class="btn-helpline-pill orange">
            <span>🚒 Fire Rescue (101)</span>
          </a>
        </div>
      </div>
    </div>
  `;
};

window.confirmActivateSos = function() {
  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon sos">🚨</div>
        <div>
          <h3 class="title" style="color:var(--color-error);">Confirm Emergency SOS Activation</h3>
          <p class="subtitle">Broadcast your current location and incident details</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="alert-box-warning">
          Are you sure you want to activate Emergency SOS?
        </div>
        <p style="margin-top:12px; font-size:13px; color:var(--color-on-surface-variant);">
          Your exact GPS coordinates and contact details will be logged into the emergency incident registry.
        </p>
      </div>
      <div class="modal-actions">
        <button class="btn-danger-large" onclick="window.activateSosNow()">
          Activate SOS
        </button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};

window.activateSosNow = function() {
  window.closeModal();

  const user = window.CER_STATE.get('currentUser') || { id: 'USR-1001', name: 'Citizen User', phone: '+91 98765 43210' };
  const loc = window.CER_STATE.get('currentLocation') || { lat: 28.7110, lng: 77.1235, address: 'Rohini Sector 14, New Delhi' };

  const sosId = `SOS-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString();

  // Create SOS request record
  const sosRecord = {
    id: sosId,
    userId: user.id,
    userName: user.name,
    userPhone: user.phone,
    lat: loc.lat,
    lng: loc.lng,
    address: loc.address,
    timestamp: timeStr,
    status: 'Active',
    assignedAmbulanceId: 'AMB-101',
    notes: 'Emergency SOS initiated via citizen app.'
  };

  // Create corresponding incident in registry
  const incidentRecord = {
    id: `INC-${Math.floor(10000 + Math.random() * 90000)}`,
    type: 'SOS Emergency Signal',
    category: 'Medical Emergency',
    title: `🚨 Emergency SOS Triggered by ${user.name}`,
    description: `High-priority SOS signal initiated at ${loc.address}. Immediate assistance requested.`,
    location: loc.address,
    lat: loc.lat,
    lng: loc.lng,
    reportedBy: user.name,
    reportedByPhone: user.phone,
    reportedAt: timeStr,
    severity: 'Critical',
    status: 'In Progress',
    photoUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500&auto=format&fit=crop&q=80',
    assignedVolunteerId: 'VOL-301',
    assignedVolunteerName: 'Rohan Gupta (First Aid)',
    adminNotes: 'Automated rapid dispatch protocol triggered by SOS signal.',
    timeline: [
      { time: timeStr, text: 'SOS signal broadcasted with high accuracy GPS.' },
      { time: timeStr, text: 'Incident registered in dispatch queue.' }
    ]
  };

  // Create in-app notification
  const notif = {
    id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '🚨 Emergency SOS Dispatched',
    message: `SOS Request ${sosId} registered at ${loc.address}.`,
    type: 'sos',
    timestamp: 'Just now',
    read: false,
    targetView: 'sos'
  };

  window.CER_DB.insert('sos_requests', sosRecord);
  window.CER_DB.insert('incidents', incidentRecord);
  window.CER_DB.insert('notifications', notif);

  window.CER_STATE.set('activeSosId', sosId);
  window.CER_AUDIO.playSuccess();
  window.CER_AUDIO.startEmergencySiren();

  window.showToast('SOS request registered successfully.', 'success');
  window.renderActiveSosView(sosRecord, loc);
};

window.renderActiveSosView = function(sos, loc) {
  const container = document.getElementById('view-container');
  if (!container) return;

  const hospitals = window.CER_DB.getAll('hospitals').slice(0, 3);
  const ambulances = window.CER_DB.getAll('ambulances').filter(a => a.status === 'Available').slice(0, 2);

  container.innerHTML = `
    <div class="sos-active-view">
      <!-- Active Emergency Header -->
      <div class="active-sos-banner">
        <div class="pulsing-badge-critical">
          <span class="siren-beacon"></span>
          ACTIVE EMERGENCY SOS
        </div>
        <div class="sos-incident-tag">INCIDENT ID: <b>${sos.id}</b></div>
        <p class="prototype-warning-callout">
          ⚠️ <b>PROTOTYPE SIMULATION NOTICE</b>: SOS request registered successfully. Real government emergency dispatch APIs are not connected in prototype mode. Dial 112 for live dispatch.
        </p>
      </div>

      <!-- Siren Sound Controller -->
      <div class="siren-controls-bar">
        <div class="siren-indicator">
          <span>🔊 Emergency Audio Beacon:</span>
          <b id="siren-status-text">${window.CER_AUDIO.isSirenPlaying ? 'Sounding' : 'Muted'}</b>
        </div>
        <button class="btn-toggle-siren" onclick="window.toggleSirenAudio()">
          ${window.CER_AUDIO.isSirenPlaying ? '🔇 Mute Siren' : '🔊 Play Siren'}
        </button>
      </div>

      <!-- Incident Meta Card -->
      <div class="sos-details-card">
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="badge badge-red">🚨 Dispatched / Active</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time Registered</span>
          <span class="detail-value">${sos.timestamp}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location</span>
          <span class="detail-value">${sos.address}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Coordinates</span>
          <span class="detail-value">${sos.lat.toFixed(5)}, ${sos.lng.toFixed(5)}</span>
        </div>
      </div>

      <!-- Nearest Hospitals Section -->
      <div class="sos-section-block">
        <div class="section-header-row">
          <h4>🏥 Nearest Emergency Hospitals</h4>
          <span class="badge badge-blue">Ready for Admission</span>
        </div>
        <div class="sos-hospitals-list">
          ${hospitals.map(h => {
            const dist = window.CER_DB.calculateDistance(sos.lat, sos.lng, h.lat, h.lng);
            return `
              <div class="mini-hospital-item">
                <div class="mini-hosp-info">
                  <b>${h.name}</b>
                  <small>${dist} km away • ${h.icuBeds} ICU Beds</small>
                </div>
                <div class="mini-hosp-actions">
                  <a href="tel:${h.emergencyPhone || h.phone}" class="btn-pill-call">📞 Call</a>
                  <button class="btn-pill-nav" onclick="window.CER_MAP.openDirections('${h.name}', ${h.lat}, ${h.lng})">🧭 Route</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Assigned Ambulance Dispatch -->
      <div class="sos-section-block">
        <div class="section-header-row">
          <h4>🚑 Emergency Ambulance Unit</h4>
          <span class="badge badge-green">En Route</span>
        </div>
        <div class="sos-ambulance-card">
          <div class="amb-header">
            <span class="amb-badge">Unit DL-01-EA-9912 (ALS)</span>
            <span class="eta-pill">ETA: 4 Mins</span>
          </div>
          <p>Equipped with advanced ventilator, defibrillator & medical oxygen.</p>
          <div class="amb-actions">
            <a href="tel:+919899122331" class="btn-primary" style="text-decoration:none; text-align:center; padding: 10px;">
              📞 Call Ambulance Paramedic
            </a>
          </div>
        </div>
      </div>

      <!-- Cancel SOS Action -->
      <div class="cancel-sos-container">
        <button class="btn-cancel-sos" onclick="window.confirmCancelSos('${sos.id}')">
          ✖ Cancel Emergency SOS
        </button>
        <small class="cancel-note">Only cancel if the emergency has been safely resolved or activated mistakenly.</small>
      </div>
    </div>
  `;
};

window.toggleSirenAudio = function() {
  if (window.CER_AUDIO.isSirenPlaying) {
    window.CER_AUDIO.stopEmergencySiren();
  } else {
    window.CER_AUDIO.startEmergencySiren();
  }
  const textEl = document.getElementById('siren-status-text');
  if (textEl) {
    textEl.textContent = window.CER_AUDIO.isSirenPlaying ? 'Sounding' : 'Muted';
  }
};

window.confirmCancelSos = function(sosId) {
  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon">⚠️</div>
        <div>
          <h3 class="title">Cancel Emergency SOS?</h3>
          <p class="subtitle">Please confirm that you are safe and aid is no longer required</p>
        </div>
      </div>
      <div class="modal-body">
        <p>This will withdraw your emergency signal from the active responder queue.</p>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.executeCancelSos('${sosId}')">Confirm & Cancel SOS</button>
        <button class="btn-text" onclick="window.closeModal()">Keep SOS Active</button>
      </div>
    </div>
  `);
};

window.executeCancelSos = function(sosId) {
  window.closeModal();
  window.CER_AUDIO.stopEmergencySiren();
  window.CER_DB.update('sos_requests', sosId, { status: 'Cancelled' });
  window.CER_STATE.set('activeSosId', null);

  window.showToast('Emergency SOS cancelled. Responders stood down.', 'info');
  window.CER_STATE.navigate('home');
};

window.showSosInfo = function() {
  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon">ℹ️</div>
        <div>
          <h3 class="title">About Emergency SOS</h3>
          <p class="subtitle">Community Emergency Response System</p>
        </div>
      </div>
      <div class="modal-body">
        <p>The SOS system instantly captures your coordinates and broadcasts an alert to registered community first responders and nearby facilities.</p>
        <p style="margin-top:8px;"><b>Note:</b> This is a prototype system. In an active threat or critical crisis, always call <b>112</b> directly.</p>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.closeModal()">Got it</button>
      </div>
    </div>
  `);
};
