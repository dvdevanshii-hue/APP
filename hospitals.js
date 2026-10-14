/**
 * Nearby Hospitals Locator Component
 * Interactive map, real-time distance calculations, bed availability, direct calling & directions
 */

window.renderHospitalsScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const userLoc = window.CER_STATE.get('currentLocation') || { lat: 28.7110, lng: 77.1235, address: 'Rohini Sector 14, New Delhi' };
  const allHospitals = window.CER_DB.getAll('hospitals');

  // Compute distances & sort nearest first
  const hospitalsWithDistance = allHospitals.map(h => {
    const dist = window.CER_DB.calculateDistance(userLoc.lat, userLoc.lng, h.lat, h.lng);
    return { ...h, distance: dist };
  }).sort((a, b) => a.distance - b.distance);

  container.innerHTML = `
    <div class="hospitals-screen-wrapper">
      <!-- Screen Top Bar -->
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Nearby Hospitals</span>
        <span class="demo-tag-pill">Demo Data</span>
      </div>

      <!-- User Location Bar -->
      <div class="mini-location-bar" onclick="window.CER_MAP.openLocationPicker()">
        <span>📍 Search Origin: <b>${userLoc.address}</b></span>
        <button class="btn-edit-loc">Change</button>
      </div>

      <!-- Map Container -->
      <div class="hospital-map-container" id="hospitals-map-box"></div>

      <!-- Filter Chips -->
      <div class="filter-chips-scroll">
        <button class="filter-chip active" id="chip-hosp-all" onclick="window.filterHospitals('all')">All (${hospitalsWithDistance.length})</button>
        <button class="filter-chip" id="chip-hosp-govt" onclick="window.filterHospitals('govt')">Government</button>
        <button class="filter-chip" id="chip-hosp-private" onclick="window.filterHospitals('private')">Private</button>
        <button class="filter-chip" id="chip-hosp-icu" onclick="window.filterHospitals('icu')">ICU Available</button>
        <button class="filter-chip" id="chip-hosp-blood" onclick="window.filterHospitals('blood')">Blood Bank</button>
      </div>

      <!-- Hospitals Cards List -->
      <div class="hospitals-cards-list" id="hospitals-list-container">
        ${window.renderHospitalCardsHtml(hospitalsWithDistance)}
      </div>
    </div>
  `;

  // Render Map after DOM is rendered
  setTimeout(() => {
    window.CER_MAP.renderMap('hospitals-map-box', { zoom: 13, height: 220 });
  }, 100);
};

window.renderHospitalCardsHtml = function(hospitals) {
  if (!hospitals || hospitals.length === 0) {
    return `<div class="empty-state-card"><p>No hospitals found matching your filter.</p></div>`;
  }

  return hospitals.map(h => `
    <div class="hospital-card">
      <div class="hosp-card-header">
        <div class="hosp-name-block">
          <h3 class="hosp-title">${h.name}</h3>
          <span class="badge ${h.type === 'Government' ? 'badge-blue' : 'badge-purple'}">${h.type}</span>
          <span class="badge badge-green">${h.status}</span>
        </div>
        <div class="hosp-distance-pill">
          <span class="dist-num">${h.distance}</span>
          <span class="dist-unit">km</span>
        </div>
      </div>

      <div class="hosp-address">
        <span>📍 ${h.address}</span>
      </div>

      <div class="hosp-meta-row">
        <div class="meta-pill">
          <span class="meta-icon">🛏️</span>
          <span><b>${h.icuBeds}</b> ICU Beds</span>
        </div>
        <div class="meta-pill">
          <span class="meta-icon">🩸</span>
          <span>${h.bloodBank ? 'Blood Bank' : 'No Blood Bank'}</span>
        </div>
        <div class="meta-pill">
          <span class="meta-icon">⭐</span>
          <span>${h.rating} / 5</span>
        </div>
      </div>

      <div class="hosp-card-actions">
        <a href="tel:${h.emergencyPhone || h.phone}" class="btn-primary btn-call">
          📞 Call
        </a>
        <button class="btn-secondary btn-directions" onclick="window.CER_MAP.openDirections('${h.name}', ${h.lat}, ${h.lng})">
          🧭 Directions
        </button>
        <button class="btn-icon-more" onclick="window.CER_MAP.showPinDetails('hosp', '${h.id}')" title="More Info">
          ℹ️
        </button>
      </div>
    </div>
  `).join('');
};

window.filterHospitals = function(filter) {
  // Update chip styles
  document.querySelectorAll('.filter-chips-scroll .filter-chip').forEach(el => el.classList.remove('active'));
  const activeChip = document.getElementById(`chip-hosp-${filter}`);
  if (activeChip) activeChip.classList.add('active');

  const userLoc = window.CER_STATE.get('currentLocation') || { lat: 28.7110, lng: 77.1235 };
  let allHospitals = window.CER_DB.getAll('hospitals').map(h => ({
    ...h,
    distance: window.CER_DB.calculateDistance(userLoc.lat, userLoc.lng, h.lat, h.lng)
  })).sort((a, b) => a.distance - b.distance);

  let filtered = allHospitals;
  if (filter === 'govt') {
    filtered = allHospitals.filter(h => h.type === 'Government');
  } else if (filter === 'private') {
    filtered = allHospitals.filter(h => h.type === 'Private');
  } else if (filter === 'icu') {
    filtered = allHospitals.filter(h => h.icuBeds > 10);
  } else if (filter === 'blood') {
    filtered = allHospitals.filter(h => h.bloodBank);
  }

  const listContainer = document.getElementById('hospitals-list-container');
  if (listContainer) {
    listContainer.innerHTML = window.renderHospitalCardsHtml(filtered);
  }
};
