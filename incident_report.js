/**
 * Incident Reporting Component
 * Incident creation form with category presets, photo uploader & demo gallery, GPS tag (Section 12)
 */

window.renderIncidentReportScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = window.CER_STATE.get('currentUser') || { name: 'Rahul Sharma', phone: '+91 98765 43210' };
  const loc = window.CER_STATE.get('currentLocation') || { address: 'Rohini Sector 14, New Delhi', lat: 28.7110, lng: 77.1235 };
  const now = new Date();
  const defaultTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString();

  container.innerHTML = `
    <div class="incident-report-wrapper">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Report Incident</span>
        <button class="btn-history-circle" onclick="window.CER_STATE.navigate('incident-status')" title="My Reports">📋</button>
      </div>

      <div class="report-form-card">
        <div class="report-intro">
          <div class="rep-icon">📝</div>
          <div>
            <h3>Emergency Incident Intake</h3>
            <p>Provide accurate details to help dispatchers route the right rescue units.</p>
          </div>
        </div>

        <form id="incident-report-form" onsubmit="window.handleIncidentReportSubmit(event)" novalidate>
          <!-- Category Selection Chips -->
          <div class="form-group">
            <label>Incident Category <span class="req">*</span></label>
            <div class="category-chips-grid">
              <label class="cat-chip-radio">
                <input type="radio" name="inc-category" value="Accident" checked />
                <span>🚗 Accident</span>
              </label>
              <label class="cat-chip-radio">
                <input type="radio" name="inc-category" value="Fire" />
                <span>🔥 Fire</span>
              </label>
              <label class="cat-chip-radio">
                <input type="radio" name="inc-category" value="Flood" />
                <span>🌊 Flood / Water</span>
              </label>
              <label class="cat-chip-radio">
                <input type="radio" name="inc-category" value="Medical Emergency" />
                <span>🩺 Medical</span>
              </label>
              <label class="cat-chip-radio">
                <input type="radio" name="inc-category" value="Missing Person" />
                <span>🔍 Missing Person</span>
              </label>
              <label class="cat-chip-radio">
                <input type="radio" name="inc-category" value="Road Blockage" />
                <span>🚧 Road Blockage</span>
              </label>
              <label class="cat-chip-radio">
                <input type="radio" name="inc-category" value="Other" />
                <span>⚠️ Other Crisis</span>
              </label>
            </div>
          </div>

          <!-- Severity Level -->
          <div class="form-group">
            <label>Severity Level <span class="req">*</span></label>
            <div class="severity-selector-bar">
              <label class="sev-radio low">
                <input type="radio" name="inc-severity" value="Low" />
                <span>Low</span>
              </label>
              <label class="sev-radio moderate">
                <input type="radio" name="inc-severity" value="Moderate" checked />
                <span>Moderate</span>
              </label>
              <label class="sev-radio high">
                <input type="radio" name="inc-severity" value="High" />
                <span>High</span>
              </label>
              <label class="sev-radio critical">
                <input type="radio" name="inc-severity" value="Critical" />
                <span>Critical</span>
              </label>
            </div>
          </div>

          <!-- Location Field with GPS autofill -->
          <div class="form-group">
            <label for="inc-location">Incident Location / Landmark <span class="req">*</span></label>
            <div class="input-with-action">
              <input type="text" id="inc-location" value="${loc.address}" placeholder="Street, area or landmark" required />
              <button type="button" class="btn-gps-stamp" onclick="window.stampGpsLocation()" title="Use GPS Location">
                🛰️ GPS
              </button>
            </div>
            <small class="error-msg" id="err-inc-location"></small>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="inc-desc">Description of the Incident <span class="req">*</span></label>
            <textarea id="inc-desc" rows="3" placeholder="Describe what happened, any injuries, hazards, or immediate dangers..." required></textarea>
            <small class="error-msg" id="err-inc-desc"></small>
          </div>

          <!-- Photo Upload & Demo Preset Picker -->
          <div class="form-group">
            <label>Incident Evidence Photo <small>(Optional)</small></label>
            <div class="photo-upload-area" id="photo-drop-zone">
              <input type="file" id="inc-file-input" accept="image/*" onchange="window.handleImageUpload(event)" style="display:none;" />
              <div class="upload-placeholder" onclick="document.getElementById('inc-file-input').click()">
                <span class="cam-icon">📷</span>
                <span class="upload-tip">Tap to capture or upload photo</span>
              </div>
            </div>

            <!-- Demo Incident Photos Quick Selector -->
            <div class="demo-photos-quick-select">
              <span class="quick-pick-title">Or pick demo incident scene:</span>
              <div class="demo-thumbnails-row">
                <img src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=150" class="demo-thumb" onclick="window.selectDemoPhoto(this.src)" title="Traffic Collision" />
                <img src="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=150" class="demo-thumb" onclick="window.selectDemoPhoto(this.src)" title="Flooding & Waterlogging" />
                <img src="https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=150" class="demo-thumb" onclick="window.selectDemoPhoto(this.src)" title="Fallen Tree / Blockage" />
                <img src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=150" class="demo-thumb" onclick="window.selectDemoPhoto(this.src)" title="Medical Extraction" />
              </div>
            </div>
            <input type="hidden" id="inc-photo-url" value="" />
          </div>

          <!-- Date / Time -->
          <div class="form-group">
            <label for="inc-time">Reported Timestamp</label>
            <input type="text" id="inc-time" value="${defaultTime}" readonly />
          </div>

          <button type="submit" class="btn-primary btn-submit-incident">
            🚀 Submit Incident Report
          </button>
        </form>
      </div>
    </div>
  `;
};

window.stampGpsLocation = function() {
  window.showToast('Locating your position...', 'info');
  window.CER_MAP.requestLocation((err, loc) => {
    if (err) {
      window.showToast(err, 'warning');
    } else {
      const locInput = document.getElementById('inc-location');
      if (locInput) locInput.value = loc.address;
      window.showToast('Location stamped from GPS coordinates!', 'success');
    }
  });
};

window.handleImageUpload = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    window.selectDemoPhoto(evt.target.result);
  };
  reader.readAsDataURL(file);
};

window.selectDemoPhoto = function(url) {
  const photoInput = document.getElementById('inc-photo-url');
  const dropZone = document.getElementById('photo-drop-zone');
  if (photoInput) photoInput.value = url;
  if (dropZone) {
    dropZone.innerHTML = `
      <div class="photo-preview-box">
        <img src="${url}" alt="Incident Preview" class="img-preview" />
        <button type="button" class="btn-remove-photo" onclick="window.removeSelectedPhoto(event)">✖ Remove</button>
      </div>
    `;
  }
};

window.removeSelectedPhoto = function(e) {
  if (e) e.stopPropagation();
  const photoInput = document.getElementById('inc-photo-url');
  const dropZone = document.getElementById('photo-drop-zone');
  if (photoInput) photoInput.value = '';
  if (dropZone) {
    dropZone.innerHTML = `
      <input type="file" id="inc-file-input" accept="image/*" onchange="window.handleImageUpload(event)" style="display:none;" />
      <div class="upload-placeholder" onclick="document.getElementById('inc-file-input').click()">
        <span class="cam-icon">📷</span>
        <span class="upload-tip">Tap to capture or upload photo</span>
      </div>
    `;
  }
};

window.handleIncidentReportSubmit = function(e) {
  e.preventDefault();

  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

  const category = document.querySelector('input[name="inc-category"]:checked')?.value || 'Other';
  const severity = document.querySelector('input[name="inc-severity"]:checked')?.value || 'Moderate';
  const location = document.getElementById('inc-location').value.trim();
  const desc = document.getElementById('inc-desc').value.trim();
  const photoUrl = document.getElementById('inc-photo-url').value || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500';

  let hasError = false;
  if (!location) {
    document.getElementById('err-inc-location').textContent = 'Location is required';
    hasError = true;
  }
  if (!desc || desc.length < 8) {
    document.getElementById('err-inc-desc').textContent = 'Please provide a clear description (at least 8 chars)';
    hasError = true;
  }

  if (hasError) return;

  const user = window.CER_STATE.get('currentUser') || { name: 'Citizen User', phone: '+91 98765 43210' };
  const userLoc = window.CER_STATE.get('currentLocation') || { lat: 28.7110, lng: 77.1235 };

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString();
  const incId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const incidentItem = {
    id: incId,
    type: category,
    category: category,
    title: `${category} Reported at ${location.split(',')[0]}`,
    description: desc,
    location: location,
    lat: userLoc.lat,
    lng: userLoc.lng,
    reportedBy: user.name,
    reportedByPhone: user.phone,
    reportedAt: timeStr,
    severity: severity,
    status: 'Reported', // Reported, Assigned, In Progress, Resolved, Closed
    photoUrl: photoUrl,
    assignedVolunteerId: null,
    assignedVolunteerName: null,
    adminNotes: 'Awaiting coordinator intake review.',
    timeline: [
      { time: timeStr, text: `Incident reported by ${user.name} via citizen portal.` }
    ]
  };

  window.CER_DB.insert('incidents', incidentItem);

  // Add notification
  const notif = {
    id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `📋 Incident Registered: #${incId}`,
    message: `Your report regarding ${category} has been logged in dispatch queue.`,
    type: 'incident',
    timestamp: 'Just now',
    read: false,
    targetView: 'incident-status'
  };
  window.CER_DB.insert('notifications', notif);

  window.CER_AUDIO.playSuccess();

  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon hosp">✅</div>
        <div>
          <h3 class="title">Incident Reported Successfully</h3>
          <p class="subtitle">Assigned Tracking ID: <b>${incId}</b></p>
        </div>
      </div>
      <div class="modal-body">
        <div class="alert-box-success">
          Incident reported successfully. Emergency responders have been notified.
        </div>
        <div class="incident-summary-sheet">
          <p><b>Type:</b> ${category}</p>
          <p><b>Severity:</b> <span class="badge ${severity === 'Critical' ? 'badge-red' : 'badge-orange'}">${severity}</span></p>
          <p><b>Location:</b> ${location}</p>
          <p><b>Status:</b> 🟡 Reported (Queued for Dispatch)</p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.closeModal(); window.CER_STATE.navigate('incident-status');">
          Track Incident Progress
        </button>
        <button class="btn-text" onclick="window.closeModal(); window.CER_STATE.navigate('home');">
          Return Home
        </button>
      </div>
    </div>
  `);
};
