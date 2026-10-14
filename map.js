/**
 * Community Emergency Response & Resource Management System
 * Map & Geolocation Engine
 * Provides dual-mode mapping: Leaflet OSM Map + Resilient Interactive Canvas/SVG Tactical Map
 */

class EmergencyMapEngine {
  constructor() {
    this.leafletMap = null;
    this.markers = [];
    this.userMarker = null;
    this.currentCenter = [28.7110, 77.1235];
  }

  // Request device location
  requestLocation(callback) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 15);
          
          const loc = {
            lat,
            lng,
            address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (GPS Verified)`,
            accuracy,
            isLiveGPS: true
          };

          window.CER_STATE.set('currentLocation', loc);
          if (callback) callback(null, loc);
        },
        (error) => {
          console.warn('Geolocation error or denied:', error.message);
          let friendlyMsg = 'Location permission was denied or unavailable. Using default emergency dispatch location.';
          if (error.code === 1) {
            friendlyMsg = 'Location permission denied. Please allow location access or choose manually.';
          } else if (error.code === 2) {
            friendlyMsg = 'Location unavailable. Network/GPS signal weak. Using fallback location.';
          }
          if (callback) callback(friendlyMsg, window.CER_STATE.get('currentLocation'));
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
      );
    } else {
      if (callback) callback('Geolocation not supported by this device.', window.CER_STATE.get('currentLocation'));
    }
  }

  // Set manual location
  setManualLocation(lat, lng, addressName) {
    const loc = {
      lat,
      lng,
      address: addressName,
      accuracy: 5,
      isLiveGPS: false
    };
    window.CER_STATE.set('currentLocation', loc);
    return loc;
  }

  // Initialize or render map into a container element
  renderMap(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const userLoc = window.CER_STATE.get('currentLocation') || { lat: 28.7110, lng: 77.1235 };
    const hospitals = window.CER_DB.getAll('hospitals');
    const ambulances = window.CER_DB.getAll('ambulances');
    const incidents = window.CER_DB.getAll('incidents');

    // Check if Leaflet is loaded
    if (typeof L !== 'undefined') {
      this.initLeafletMap(containerId, userLoc, hospitals, ambulances, incidents, options);
    } else {
      // Fallback to Interactive Tactical Canvas/SVG Radar Map
      this.renderTacticalRadarMap(container, userLoc, hospitals, ambulances, incidents, options);
    }
  }

  initLeafletMap(containerId, userLoc, hospitals, ambulances, incidents, options) {
    try {
      const container = document.getElementById(containerId);
      // Clean up existing instance if already bound
      if (container._leaflet_id) {
        container.innerHTML = '';
        container._leaflet_id = null;
      }

      this.leafletMap = L.map(containerId, {
        zoomControl: false,
        attributionControl: false
      }).setView([userLoc.lat, userLoc.lng], options.zoom || 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.leafletMap);

      // Add user marker
      const userIcon = L.divIcon({
        className: 'user-radar-pin',
        html: `<div class="pulse-marker-user"><span class="ping-circle"></span><span class="center-dot"></span></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker([userLoc.lat, userLoc.lng], { icon: userIcon })
        .addTo(this.leafletMap)
        .bindPopup(`<b>Your Emergency Position</b><br>${userLoc.address}`);

      // Add Hospitals
      hospitals.forEach(h => {
        const dist = window.CER_DB.calculateDistance(userLoc.lat, userLoc.lng, h.lat, h.lng);
        const hospIcon = L.divIcon({
          className: 'map-pin-hospital',
          html: `<div class="pin-hospital-badge">🏥</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        L.marker([h.lat, h.lng], { icon: hospIcon })
          .addTo(this.leafletMap)
          .bindPopup(`
            <div class="leaflet-popup-card">
              <h4>${h.name}</h4>
              <p><b>Distance:</b> ${dist} km</p>
              <p><b>ICU Beds:</b> ${h.icuBeds} available</p>
              <p><b>Status:</b> ${h.status}</p>
              <a href="tel:${h.phone}" class="popup-btn-call">📞 Call (${h.phone})</a>
            </div>
          `);
      });

      // Add Ambulances
      ambulances.forEach(a => {
        if (a.status === 'Offline') return;
        const ambIcon = L.divIcon({
          className: 'map-pin-ambulance',
          html: `<div class="pin-ambulance-badge ${a.status.toLowerCase()}">🚑</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        L.marker([a.lat, a.lng], { icon: ambIcon })
          .addTo(this.leafletMap)
          .bindPopup(`
            <div class="leaflet-popup-card">
              <h4>Ambulance ${a.id}</h4>
              <p><b>Type:</b> ${a.type}</p>
              <p><b>Status:</b> ${a.status}</p>
              <p><b>Base:</b> ${a.baseLocation}</p>
              <button onclick="window.requestAmbulanceDispatch('${a.id}')" class="popup-btn-call">Request Dispatch</button>
            </div>
          `);
      });

      // Add Incidents if required
      if (options.showIncidents) {
        incidents.forEach(inc => {
          if (inc.status === 'Resolved' || inc.status === 'Closed') return;
          const incIcon = L.divIcon({
            className: 'map-pin-incident',
            html: `<div class="pin-incident-badge ${inc.severity.toLowerCase()}">⚠️</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });
          L.marker([inc.lat, inc.lng], { icon: incIcon })
            .addTo(this.leafletMap)
            .bindPopup(`
              <div class="leaflet-popup-card">
                <h4>⚠️ ${inc.title}</h4>
                <p><b>Severity:</b> ${inc.severity}</p>
                <p><b>Status:</b> ${inc.status}</p>
                <p>${inc.location}</p>
              </div>
            `);
        });
      }

      // Add custom UI buttons
      L.control.zoom({ position: 'bottomright' }).addTo(this.leafletMap);

    } catch (err) {
      console.warn('Leaflet init error, falling back to tactical map:', err);
      this.renderTacticalRadarMap(document.getElementById(containerId), userLoc, hospitals, ambulances, incidents, options);
    }
  }

  // Interactive Tactical Canvas / SVG Radar Map (100% Offline-Safe)
  renderTacticalRadarMap(container, userLoc, hospitals, ambulances, incidents, options) {
    const width = container.clientWidth || 360;
    const height = options.height || 260;

    let hospitalPins = hospitals.map((h, i) => {
      const dist = window.CER_DB.calculateDistance(userLoc.lat, userLoc.lng, h.lat, h.lng);
      // Normalized offset
      const dx = ((h.lng - userLoc.lng) * 900) + (width / 2);
      const dy = (-(h.lat - userLoc.lat) * 900) + (height / 2);
      const clampedX = Math.max(25, Math.min(width - 25, dx));
      const clampedY = Math.max(25, Math.min(height - 25, dy));

      return `
        <g class="interactive-map-node" onclick="window.CER_MAP.showPinDetails('hosp', '${h.id}')" cursor="pointer">
          <circle cx="${clampedX}" cy="${clampedY}" r="16" fill="var(--color-surface)" stroke="#2563EB" stroke-width="2" />
          <text x="${clampedX}" y="${clampedY + 5}" font-size="14" text-anchor="middle">🏥</text>
          <text x="${clampedX}" y="${clampedY + 24}" font-size="10" font-weight="bold" fill="var(--color-on-surface)" text-anchor="middle">${h.name.split(' ')[0]} (${dist}km)</text>
        </g>
      `;
    }).join('');

    let ambulancePins = ambulances.filter(a => a.status !== 'Offline').map(a => {
      const dist = window.CER_DB.calculateDistance(userLoc.lat, userLoc.lng, a.lat, a.lng);
      const dx = ((a.lng - userLoc.lng) * 900) + (width / 2);
      const dy = (-(a.lat - userLoc.lat) * 900) + (height / 2);
      const clampedX = Math.max(30, Math.min(width - 30, dx));
      const clampedY = Math.max(30, Math.min(height - 30, dy));
      const color = a.status === 'Available' ? '#16A34A' : '#DC2626';

      return `
        <g class="interactive-map-node" onclick="window.CER_MAP.showPinDetails('amb', '${a.id}')" cursor="pointer">
          <circle cx="${clampedX}" cy="${clampedY}" r="15" fill="var(--color-surface)" stroke="${color}" stroke-width="2" />
          <text x="${clampedX}" y="${clampedY + 5}" font-size="13" text-anchor="middle">🚑</text>
          <text x="${clampedX}" y="${clampedY + 22}" font-size="9" font-weight="600" fill="${color}" text-anchor="middle">${a.id} (${a.status})</text>
        </g>
      `;
    }).join('');

    container.innerHTML = `
      <div class="tactical-radar-map-wrapper" style="position: relative; width: 100%; height: ${height}px; background: var(--color-surface-variant); border-radius: 16px; overflow: hidden; border: 1px solid var(--color-outline-variant);">
        <!-- Radar Grid Lines -->
        <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="position: absolute; inset: 0;">
          <defs>
            <radialGradient id="radarGrid" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(37,99,235,0.06)" />
              <stop offset="100%" stop-color="rgba(37,99,235,0.01)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#radarGrid)" />
          <!-- Concentric range rings -->
          <circle cx="${width/2}" cy="${height/2}" r="45" fill="none" stroke="rgba(100,116,139,0.2)" stroke-dasharray="3,3" />
          <circle cx="${width/2}" cy="${height/2}" r="90" fill="none" stroke="rgba(100,116,139,0.2)" stroke-dasharray="4,4" />
          <circle cx="${width/2}" cy="${height/2}" r="135" fill="none" stroke="rgba(100,116,139,0.15)" stroke-dasharray="5,5" />
          <line x1="0" y1="${height/2}" x2="${width}" y2="${height/2}" stroke="rgba(100,116,139,0.15)" />
          <line x1="${width/2}" y1="0" x2="${width/2}" y2="${height}" stroke="rgba(100,116,139,0.15)" />

          <!-- Hospital Pins -->
          ${hospitalPins}

          <!-- Ambulance Pins -->
          ${ambulancePins}

          <!-- User Radar Center -->
          <circle cx="${width/2}" cy="${height/2}" r="22" fill="rgba(220,38,38,0.2)" class="svg-pulse-circle">
            <animate attributeName="r" values="10;35;10" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="${width/2}" cy="${height/2}" r="9" fill="#DC2626" stroke="#ffffff" stroke-width="2.5" />
          <text x="${width/2}" y="${height/2 - 14}" font-size="11" font-weight="700" fill="#DC2626" text-anchor="middle">You (GPS)</text>
        </svg>

        <!-- Overlay HUD Controls -->
        <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 6px; z-index: 5;">
          <span class="badge-hud">📡 Radar Tactical Map</span>
          <span class="badge-hud green">Live Units</span>
        </div>

        <div style="position: absolute; bottom: 8px; right: 10px; z-index: 5;">
          <button class="btn-map-control" onclick="window.CER_MAP.openLocationPicker()" title="Change Location">📍 Change GPS</button>
        </div>
      </div>
    `;
  }

  showPinDetails(type, id) {
    if (type === 'hosp') {
      const h = window.CER_DB.getById('hospitals', id);
      if (h) {
        window.CER_STATE.set('selectedHospital', h);
        window.showModal(`
          <div class="modal-card">
            <div class="modal-header">
              <div class="header-icon hosp">🏥</div>
              <div>
                <h3 class="title">${h.name}</h3>
                <span class="badge badge-blue">${h.type} • ${h.traumaLevel}</span>
              </div>
            </div>
            <div class="modal-body">
              <p><b>Address:</b> ${h.address}</p>
              <div class="stats-row" style="display:flex; gap:12px; margin: 12px 0;">
                <div class="stat-box"><b>${h.icuBeds}</b><span>ICU Beds</span></div>
                <div class="stat-box"><b>${h.totalBeds}</b><span>Total Beds</span></div>
                <div class="stat-box"><b>${h.rating} ★</b><span>Rating</span></div>
              </div>
              <p><b>Emergency Status:</b> <span class="badge-green">${h.status}</span></p>
              <p><b>Blood Bank:</b> ${h.bloodBank ? '✅ Available On-site' : '❌ External Bank'}</p>
            </div>
            <div class="modal-actions">
              <a href="tel:${h.emergencyPhone || h.phone}" class="btn-primary" style="background:var(--color-primary); color:white; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                📞 Call Emergency (${h.emergencyPhone || h.phone})
              </a>
              <button class="btn-secondary" onclick="window.CER_MAP.openDirections('${h.name}', ${h.lat}, ${h.lng})">🧭 Directions</button>
              <button class="btn-text" onclick="window.closeModal()">Close</button>
            </div>
          </div>
        `);
      }
    } else if (type === 'amb') {
      const a = window.CER_DB.getById('ambulances', id);
      if (a) {
        window.showModal(`
          <div class="modal-card">
            <div class="modal-header">
              <div class="header-icon amb">🚑</div>
              <div>
                <h3 class="title">Ambulance ${a.id}</h3>
                <span class="badge ${a.status === 'Available' ? 'badge-green' : 'badge-red'}">${a.status}</span>
              </div>
            </div>
            <div class="modal-body">
              <p><b>Vehicle No:</b> ${a.vehicleNo}</p>
              <p><b>Unit Type:</b> ${a.type}</p>
              <p><b>Crew:</b> ${a.paramedicTeam}</p>
              <p><b>Base:</b> ${a.baseLocation}</p>
              <p><b>Equipment:</b> ${a.equipment.join(', ')}</p>
            </div>
            <div class="modal-actions">
              ${a.status === 'Available' ? `
                <button class="btn-primary" onclick="window.requestAmbulanceDispatch('${a.id}')">🚨 Dispatch to My Location</button>
              ` : `
                <button class="btn-primary" disabled style="opacity:0.6;">Unit Currently Dispatched</button>
              `}
              <a href="tel:${a.phone}" class="btn-secondary" style="text-decoration:none; text-align:center;">📞 Call Paramedic</a>
              <button class="btn-text" onclick="window.closeModal()">Close</button>
            </div>
          </div>
        `);
      }
    }
  }

  openDirections(targetName, targetLat, targetLng) {
    const userLoc = window.CER_STATE.get('currentLocation') || { lat: 28.7110, lng: 77.1235 };
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${targetLat},${targetLng}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  }

  openLocationPicker() {
    const locations = [
      { name: 'Rohini Sector 14, New Delhi', lat: 28.7110, lng: 77.1235 },
      { name: 'Connaught Place, Central Delhi', lat: 28.6315, lng: 77.2167 },
      { name: 'Saket & Press Enclave, South Delhi', lat: 28.5273, lng: 77.2138 },
      { name: 'Dwarka Sector 10, South West Delhi', lat: 28.5823, lng: 77.0500 },
      { name: 'Lajpat Nagar, South East Delhi', lat: 28.5700, lng: 77.2400 },
      { name: 'Civil Lines & Wazirabad, North Delhi', lat: 28.6812, lng: 77.2227 }
    ];

    const optionsHtml = locations.map(l => `
      <div class="location-pick-item" onclick="window.CER_MAP.selectCustomLocation(${l.lat}, ${l.lng}, '${l.name}')">
        <span class="loc-pin">📍</span>
        <div class="loc-details">
          <b>${l.name}</b>
          <small>GPS: ${l.lat.toFixed(4)}, ${l.lng.toFixed(4)}</small>
        </div>
      </div>
    `).join('');

    window.showModal(`
      <div class="modal-card">
        <div class="modal-header">
          <div class="header-icon">📍</div>
          <div>
            <h3 class="title">Select Your Location</h3>
            <p class="subtitle">Simulate emergency coordinates or use live device GPS</p>
          </div>
        </div>
        <div class="modal-body">
          <button class="btn-primary" onclick="window.CER_MAP.detectLiveGps()" style="width:100%; margin-bottom:12px; display:flex; align-items:center; justify-content:center; gap:8px;">
            🛰️ Auto-Detect Current Device GPS
          </button>
          <div class="divider-text">OR CHOOSE AREA</div>
          <div class="location-list">
            ${optionsHtml}
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-text" onclick="window.closeModal()">Cancel</button>
        </div>
      </div>
    `);
  }

  detectLiveGps() {
    window.showToast('Acquiring high accuracy GPS coordinates...', 'info');
    this.requestLocation((err, loc) => {
      if (err) {
        window.showToast(err, 'warning');
      } else {
        window.showToast(`GPS Position Locked: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`, 'success');
        window.closeModal();
        window.CER_STATE.notify('currentLocation', loc);
      }
    });
  }

  selectCustomLocation(lat, lng, name) {
    const loc = this.setManualLocation(lat, lng, name);
    window.showToast(`Location set to: ${name}`, 'success');
    window.closeModal();
    window.CER_STATE.notify('currentLocation', loc);
  }
}

window.CER_MAP = new EmergencyMapEngine();
