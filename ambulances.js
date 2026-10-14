/**
 * Ambulance Locator Component
 * Fleet status, real-time availability, distance & dispatch requests
 */

window.renderAmbulancesScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const userLoc = window.CER_STATE.get('currentLocation') || { lat: 28.7110, lng: 77.1235, address: 'Rohini Sector 14, New Delhi' };
  const ambulances = window.CER_DB.getAll('ambulances').map(a => {
    const dist = window.CER_DB.calculateDistance(userLoc.lat, userLoc.lng, a.lat, a.lng);
    const etaMin = Math.max(2, Math.round(dist * 2.8));
    return { ...a, distance: dist, eta: `${etaMin} mins` };
  }).sort((a, b) => {
    // Available first, then by distance
    if (a.status === 'Available' && b.status !== 'Available') return -1;
    if (b.status === 'Available' && a.status !== 'Available') return 1;
    return a.distance - b.distance;
  });

  const availableCount = ambulances.filter(a => a.status === 'Available').length;
  const busyCount = ambulances.filter(a => a.status === 'Busy').length;
  const offlineCount = ambulances.filter(a => a.status === 'Offline').length;

  container.innerHTML = `
    <div class="ambulances-screen-wrapper">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Ambulance Locator</span>
        <span class="demo-tag-pill">Demo Fleet</span>
      </div>

      <!-- Fleet Status Overview Stats -->
      <div class="fleet-status-bar">
        <div class="fleet-stat-item green">
          <span class="stat-dot"></span>
          <b>${availableCount}</b> Available
        </div>
        <div class="fleet-stat-item red">
          <span class="stat-dot"></span>
          <b>${busyCount}</b> Busy
        </div>
        <div class="fleet-stat-item grey">
          <span class="stat-dot"></span>
          <b>${offlineCount}</b> Offline
        </div>
      </div>

      <!-- Quick Dispatch Notice -->
      <div class="info-alert-card">
        <span class="info-icon">🚑</span>
        <div>
          <b>Emergency Dispatch Available</b>
          <p>Requesting an ambulance assigns the nearest available ALS/BLS crew to your GPS location.</p>
        </div>
      </div>

      <!-- Ambulance Cards List -->
      <div class="ambulance-cards-list">
        ${ambulances.map(a => `
          <div class="ambulance-card ${a.status.toLowerCase()}">
            <div class="amb-card-header">
              <div class="amb-id-block">
                <span class="amb-vehicle-tag">${a.vehicleNo}</span>
                <span class="amb-unit-id">${a.id}</span>
              </div>
              <div class="amb-status-badge ${a.status.toLowerCase()}">
                <span class="status-indicator-dot"></span>
                ${a.status}
              </div>
            </div>

            <div class="amb-type-row">
              <b>${a.type}</b>
              <span class="amb-eta-text">${a.status === 'Available' ? `📍 ${a.distance} km • ETA ${a.eta}` : (a.status === 'Busy' ? 'In Active Mission' : 'Offline / Maintenance')}</span>
            </div>

            <p class="amb-crew-info">👥 Crew: ${a.paramedicTeam}</p>
            <p class="amb-base-info">🏢 Base Station: ${a.baseLocation}</p>

            <div class="amb-equipment-tags">
              ${a.equipment.map(eq => `<span class="equipment-pill">${eq}</span>`).join('')}
            </div>

            <div class="amb-card-actions">
              ${a.status === 'Available' ? `
                <button class="btn-primary btn-dispatch-amb" onclick="window.requestAmbulanceDispatch('${a.id}')">
                  🚨 Request Dispatch
                </button>
              ` : `
                <button class="btn-secondary" disabled style="opacity:0.6; cursor:not-allowed;">
                  ${a.status === 'Busy' ? 'Unit Occupied' : 'Unit Unavailable'}
                </button>
              `}
              <a href="tel:${a.phone}" class="btn-secondary btn-call-amb">
                📞 Call Crew
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

window.requestAmbulanceDispatch = function(ambulanceId) {
  const amb = window.CER_DB.getById('ambulances', ambulanceId);
  if (!amb) return;

  const userLoc = window.CER_STATE.get('currentLocation') || { address: 'Rohini Sector 14, New Delhi' };

  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon amb">🚑</div>
        <div>
          <h3 class="title">Confirm Ambulance Dispatch</h3>
          <p class="subtitle">Unit ${amb.id} (${amb.vehicleNo})</p>
        </div>
      </div>
      <div class="modal-body">
        <p>Dispatch destination:</p>
        <p><b>📍 ${userLoc.address}</b></p>
        <div class="alert-box-info" style="margin-top:10px;">
          The paramedic team will be alerted and dispatched with emergency beacon.
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.confirmDispatchAmbulance('${amb.id}')">
          Confirm Dispatch
        </button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};

window.confirmDispatchAmbulance = function(ambulanceId) {
  window.closeModal();

  // Mark ambulance as Busy in DB
  window.CER_DB.update('ambulances', ambulanceId, {
    status: 'Busy',
    lastDispatched: 'Emergency Citizen Dispatch Request'
  });

  // Create notification
  const notif = {
    id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '🚑 Ambulance En Route',
    message: `Ambulance ${ambulanceId} dispatched to your location. Expected ETA: 4 mins.`,
    type: 'sos',
    timestamp: 'Just now',
    read: false,
    targetView: 'ambulances'
  };
  window.CER_DB.insert('notifications', notif);

  window.CER_AUDIO.playSuccess();
  window.showToast(`Ambulance ${ambulanceId} dispatched successfully!`, 'success');
  window.renderAmbulancesScreen();
};
