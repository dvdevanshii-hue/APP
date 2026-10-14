/**
 * Blood Donor Portal Component
 * Blood Donor Registration & Search with Privacy Protection (Section 7 & 8)
 */

window.renderBloodScreen = function(activeTab = 'search') {
  const container = document.getElementById('view-container');
  if (!container) return;

  const isSearch = activeTab === 'search';

  container.innerHTML = `
    <div class="blood-screen-wrapper">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Blood Lifeline</span>
        <span class="demo-tag-pill">Donor Network</span>
      </div>

      <!-- Segmented Tabs: Search Donors vs Register as Donor -->
      <div class="segmented-control">
        <button class="segment-tab ${isSearch ? 'active' : ''}" onclick="window.renderBloodScreen('search')">
          🔍 Find Donors
        </button>
        <button class="segment-tab ${!isSearch ? 'active' : ''}" onclick="window.renderBloodScreen('register')">
          🩸 Register as Donor
        </button>
      </div>

      ${isSearch ? window.renderBloodSearchHtml() : window.renderBloodRegisterHtml()}
    </div>
  `;

  if (isSearch) {
    window.updateBloodSearchResults();
  }
};

window.renderBloodSearchHtml = function() {
  return `
    <div class="blood-search-section">
      <!-- Compatibility Help Bar -->
      <div class="blood-tip-banner">
        <span class="tip-icon">💡</span>
        <div class="tip-text">
          <b>Need immediate blood?</b> O- is universal donor for red blood cells; AB+ is universal plasma recipient.
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="filter-card">
        <div class="filter-form-grid">
          <div class="filter-field">
            <label for="filter-blood-group">Blood Group</label>
            <select id="filter-blood-group" onchange="window.updateBloodSearchResults()">
              <option value="ALL">All Groups</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div class="filter-field">
            <label for="filter-blood-city">City / Area</label>
            <input type="text" id="filter-blood-city" placeholder="Search area (e.g. Rohini)" oninput="window.updateBloodSearchResults()" />
          </div>

          <div class="filter-field checkbox-field">
            <label class="custom-checkbox">
              <input type="checkbox" id="filter-blood-avail" checked onchange="window.updateBloodSearchResults()" />
              <span class="checkmark"></span>
              <span class="check-text">Available Donors Only</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Privacy Protection Badge -->
      <div class="privacy-notice-badge">
        <span>🛡️ <b>Privacy Protected:</b> Exact phone numbers and addresses are secured. Direct anonymous requests are relayed through emergency dispatch.</span>
      </div>

      <!-- Donor Cards Container -->
      <div class="donor-cards-grid" id="blood-donors-container">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
};

window.renderBloodRegisterHtml = function() {
  const user = window.CER_STATE.get('currentUser') || {};
  return `
    <div class="blood-register-card">
      <div class="register-header">
        <div class="reg-icon">🩸</div>
        <div>
          <h3>Register as a Blood Donor</h3>
          <p>Your single donation can save up to three lives.</p>
        </div>
      </div>

      <form id="blood-donor-form" onsubmit="window.handleBloodDonorRegister(event)" novalidate>
        <div class="form-group">
          <label for="bd-name">Full Name <span class="req">*</span></label>
          <input type="text" id="bd-name" value="${user.name || ''}" placeholder="e.g. Rahul Sharma" required />
          <small class="error-msg" id="err-bd-name"></small>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="bd-group">Blood Group <span class="req">*</span></label>
            <select id="bd-group" required>
              <option value="">Select Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <small class="error-msg" id="err-bd-group"></small>
          </div>

          <div class="form-group half">
            <label for="bd-phone">Phone Number <span class="req">*</span></label>
            <input type="tel" id="bd-phone" value="${user.phone || ''}" placeholder="+91 98765 43210" required />
            <small class="error-msg" id="err-bd-phone"></small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="bd-area">City / Area <span class="req">*</span></label>
            <input type="text" id="bd-area" value="${user.area || ''}" placeholder="e.g. Rohini Sector 14" required />
            <small class="error-msg" id="err-bd-area"></small>
          </div>

          <div class="form-group half">
            <label for="bd-avail">Availability <span class="req">*</span></label>
            <select id="bd-avail" required>
              <option value="Available">🟢 Available Now</option>
              <option value="Unavailable">🔴 Currently Unavailable</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="bd-last-date">Last Donation Date <small>(If applicable)</small></label>
          <input type="date" id="bd-last-date" max="${new Date().toISOString().split('T')[0]}" />
        </div>

        <div class="eligibility-box">
          <b>Eligibility Checklist:</b>
          <label class="custom-checkbox">
            <input type="checkbox" id="bd-eligibility" required />
            <span class="checkmark"></span>
            <span class="check-text">I confirm that I am aged 18-65, weight > 50kg, and free of chronic health conditions.</span>
          </label>
          <small class="error-msg" id="err-bd-eligibility"></small>
        </div>

        <button type="submit" class="btn-primary btn-submit-donor">
          🩸 Register as Blood Donor
        </button>
      </form>
    </div>
  `;
};

window.updateBloodSearchResults = function() {
  const groupSelect = document.getElementById('filter-blood-group');
  const cityInput = document.getElementById('filter-blood-city');
  const availCheck = document.getElementById('filter-blood-avail');
  const container = document.getElementById('blood-donors-container');
  if (!container) return;

  const selectedGroup = groupSelect ? groupSelect.value : 'ALL';
  const queryCity = cityInput ? cityInput.value.toLowerCase().trim() : '';
  const onlyAvail = availCheck ? availCheck.checked : false;

  const allDonors = window.CER_DB.getAll('blood_donors');

  const filtered = allDonors.filter(donor => {
    if (selectedGroup !== 'ALL' && donor.bloodGroup !== selectedGroup) return false;
    if (queryCity && !donor.area.toLowerCase().includes(queryCity) && !donor.city.toLowerCase().includes(queryCity)) return false;
    if (onlyAvail && donor.availability !== 'Available') return false;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card span-all">
        <p>No donors found matching your criteria. Try adjusting the blood group or area filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(d => `
    <div class="donor-card">
      <div class="donor-card-top">
        <div class="donor-info">
          <h4 class="donor-name">${d.name}</h4>
          <span class="donor-area">📍 Area: ${d.area}</span>
        </div>
        <div class="blood-group-badge">
          ${d.bloodGroup}
        </div>
      </div>

      <div class="donor-status-line">
        <span class="status-indicator ${d.availability === 'Available' ? 'avail' : 'unavail'}">
          ${d.availability === 'Available' ? '🟢 Available' : '🔴 Unavailable'}
        </span>
        <span class="last-donated">Last: ${d.lastDonationDate || 'Not specified'}</span>
      </div>

      <div class="donor-card-action">
        <button class="btn-request-blood" onclick="window.openBloodRequestModal('${d.id}', '${d.name}', '${d.bloodGroup}')">
          📩 Request Blood
        </button>
      </div>
    </div>
  `).join('');
};

window.handleBloodDonorRegister = function(e) {
  e.preventDefault();

  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

  const name = document.getElementById('bd-name').value.trim();
  const group = document.getElementById('bd-group').value;
  const phone = document.getElementById('bd-phone').value.trim();
  const area = document.getElementById('bd-area').value.trim();
  const avail = document.getElementById('bd-avail').value;
  const lastDate = document.getElementById('bd-last-date').value;
  const eligibility = document.getElementById('bd-eligibility').checked;

  let hasError = false;
  if (!name) {
    document.getElementById('err-bd-name').textContent = 'Full name is required';
    hasError = true;
  }
  if (!group) {
    document.getElementById('err-bd-group').textContent = 'Please select a blood group';
    hasError = true;
  }
  if (!phone || phone.length < 8) {
    document.getElementById('err-bd-phone').textContent = 'Valid phone number is required';
    hasError = true;
  }
  if (!area) {
    document.getElementById('err-bd-area').textContent = 'City/Area is required';
    hasError = true;
  }
  if (!eligibility) {
    document.getElementById('err-bd-eligibility').textContent = 'Please confirm medical eligibility';
    hasError = true;
  }

  if (hasError) return;

  const newDonor = {
    id: `DONOR-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name,
    bloodGroup: group,
    phone: phone, // Saved securely in DB, never exposed in public cards
    area: area,
    city: 'New Delhi',
    availability: avail,
    lastDonationDate: lastDate || new Date().toISOString().split('T')[0],
    donationsCount: 1,
    eligibilityConfirmed: true,
    registeredAt: new Date().toISOString().split('T')[0]
  };

  window.CER_DB.insert('blood_donors', newDonor);
  window.CER_AUDIO.playSuccess();

  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon blood">🩸</div>
        <div>
          <h3 class="title">Donor Profile Registered</h3>
          <p class="subtitle">Thank you for being a community lifesaver!</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="alert-box-success">
          Your donor profile has been registered.
        </div>
        <p style="margin-top:10px;">
          You are now listed in the emergency blood registry as <b>${group}</b>. Your personal contact details remain protected.
        </p>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.closeModal(); window.renderBloodScreen('search');">
          View Donor Directory
        </button>
      </div>
    </div>
  `);
};

window.openBloodRequestModal = function(donorId, donorName, bloodGroup) {
  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon blood">🩸</div>
        <div>
          <h3 class="title">Send Blood Request</h3>
          <p class="subtitle">To Donor: ${donorName} (${bloodGroup})</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Hospital / Destination</label>
          <input type="text" id="req-hosp-name" placeholder="e.g. AIIMS Trauma Center" required />
        </div>
        <div class="form-row">
          <div class="form-group half">
            <label>Units Required</label>
            <input type="number" id="req-units" min="1" max="10" value="1" />
          </div>
          <div class="form-group half">
            <label>Urgency Level</label>
            <select id="req-urgency">
              <option value="Critical">🔴 Critical (Immediate)</option>
              <option value="Urgent">🟠 Urgent (Within 4 hrs)</option>
              <option value="Normal">🟡 Planned (Within 24 hrs)</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Patient Contact / Coordinator</label>
          <input type="tel" id="req-contact" placeholder="+91 98765 43210" value="${window.CER_STATE.get('currentUser')?.phone || ''}" />
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.submitBloodRequest('${donorId}', '${donorName}', '${bloodGroup}')">
          Send Urgent Request
        </button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};

window.submitBloodRequest = function(donorId, donorName, bloodGroup) {
  const hosp = document.getElementById('req-hosp-name')?.value || 'Local Hospital';
  const units = document.getElementById('req-units')?.value || '1';
  const urgency = document.getElementById('req-urgency')?.value || 'Critical';

  window.closeModal();

  // Create notification record
  const notif = {
    id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `🩸 Blood Request Sent: ${bloodGroup}`,
    message: `Request for ${units} unit(s) of ${bloodGroup} at ${hosp} relayed to donor network.`,
    type: 'blood',
    timestamp: 'Just now',
    read: false,
    targetView: 'blood-search'
  };
  window.CER_DB.insert('notifications', notif);

  window.CER_AUDIO.playSuccess();
  window.showToast(`Emergency blood request sent to ${donorName} (${bloodGroup})`, 'success');
};
