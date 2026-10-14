/**
 * Volunteer Portal Component
 * Volunteer Registration, Skills & Categories, and Authorized Volunteer Roster (Section 9)
 */

window.renderVolunteersScreen = function(tab = 'register') {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = window.CER_STATE.get('currentUser') || {};
  const isRoster = tab === 'roster';
  const volunteers = window.CER_DB.getAll('volunteers');
  const activeCount = volunteers.filter(v => v.status === 'Active').length;

  container.innerHTML = `
    <div class="volunteers-screen-wrapper">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Volunteer Network</span>
        <span class="demo-tag-pill">${activeCount} Active</span>
      </div>

      <!-- Segmented Navigation -->
      <div class="segmented-control">
        <button class="segment-tab ${!isRoster ? 'active' : ''}" onclick="window.renderVolunteersScreen('register')">
          🙋 Join as Volunteer
        </button>
        <button class="segment-tab ${isRoster ? 'active' : ''}" onclick="window.renderVolunteersScreen('roster')">
          📋 Responder Roster
        </button>
      </div>

      ${!isRoster ? window.renderVolunteerRegisterForm(user) : window.renderVolunteerRoster(volunteers)}
    </div>
  `;
};

window.renderVolunteerRegisterForm = function(user) {
  return `
    <div class="volunteer-form-card">
      <div class="vol-form-intro">
        <div class="vol-icon-badge">🤝</div>
        <div>
          <h3>Become a Community Volunteer</h3>
          <p>Support your neighbors during crises with medical aid, rescue, food distribution or logistics.</p>
        </div>
      </div>

      <form id="volunteer-reg-form" onsubmit="window.handleVolunteerSubmit(event)" novalidate>
        <div class="form-group">
          <label for="vol-name">Full Name <span class="req">*</span></label>
          <input type="text" id="vol-name" value="${user.name || ''}" placeholder="e.g. Rohan Gupta" required />
          <small class="error-msg" id="err-vol-name"></small>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="vol-phone">Phone Number <span class="req">*</span></label>
            <input type="tel" id="vol-phone" value="${user.phone || ''}" placeholder="+91 98912 34567" required />
            <small class="error-msg" id="err-vol-phone"></small>
          </div>

          <div class="form-group half">
            <label for="vol-email">Email Address <span class="req">*</span></label>
            <input type="email" id="vol-email" value="${user.email || ''}" placeholder="name@example.com" required />
            <small class="error-msg" id="err-vol-email"></small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="vol-area">City / Area <span class="req">*</span></label>
            <input type="text" id="vol-area" value="${user.area || ''}" placeholder="e.g. Rohini Sector 13" required />
            <small class="error-msg" id="err-vol-area"></small>
          </div>

          <div class="form-group half">
            <label for="vol-category">Preferred Category <span class="req">*</span></label>
            <select id="vol-category" required>
              <option value="">Select Category</option>
              <option value="First Aid">🩹 First Aid</option>
              <option value="Medical">🩺 Medical Support</option>
              <option value="Food Distribution">🍲 Food Distribution</option>
              <option value="Transportation">🚚 Transportation & Logistics</option>
              <option value="Rescue Support">🧗 Rescue Support</option>
              <option value="Communication">📻 Communication / Dispatch</option>
              <option value="Other">🤝 Other Community Aid</option>
            </select>
            <small class="error-msg" id="err-vol-category"></small>
          </div>
        </div>

        <div class="form-group">
          <label for="vol-skills">Specialized Skills / Certifications <span class="req">*</span></label>
          <input type="text" id="vol-skills" placeholder="e.g. CPR Certified, EMT, 4x4 Driving, HAM Radio" required />
          <small class="error-msg" id="err-vol-skills"></small>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="vol-avail">Availability <span class="req">*</span></label>
            <select id="vol-avail" required>
              <option value="Available 24/7">Available 24/7</option>
              <option value="Evenings & Weekends">Evenings & Weekends</option>
              <option value="On-Call">On-Call for Emergencies</option>
              <option value="Critical Emergency Only">Critical Emergency Only</option>
            </select>
          </div>

          <div class="form-group half">
            <label for="vol-exp">Emergency Experience</label>
            <input type="text" id="vol-exp" placeholder="e.g. 2 yrs Red Cross / Civil Defence" />
          </div>
        </div>

        <button type="submit" class="btn-primary btn-submit-volunteer">
          ✅ Register as Emergency Volunteer
        </button>
      </form>
    </div>
  `;
};

window.renderVolunteerRoster = function(volunteers) {
  return `
    <div class="volunteer-roster-view">
      <div class="roster-header-info">
        <p>Verified community first-responders ready for crisis mobilization.</p>
      </div>

      <div class="volunteer-cards-list">
        ${volunteers.map(v => `
          <div class="volunteer-card">
            <div class="vol-card-top">
              <div class="vol-title-block">
                <h4>${v.name}</h4>
                <span class="badge badge-purple">${v.category}</span>
              </div>
              <span class="badge badge-green">${v.status}</span>
            </div>

            <p class="vol-skills-text">🛠️ <b>Skills:</b> ${v.skills}</p>
            <p class="vol-avail-text">⏰ <b>Availability:</b> ${v.availability}</p>
            <p class="vol-exp-text">🎖️ <b>Experience:</b> ${v.emergencyExperience || 'Community trained'}</p>

            <div class="vol-footer-row">
              <span class="vol-location">📍 ${v.area}</span>
              <a href="tel:${v.phone}" class="btn-contact-vol">📞 Contact Responder</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

window.handleVolunteerSubmit = function(e) {
  e.preventDefault();

  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

  const name = document.getElementById('vol-name').value.trim();
  const phone = document.getElementById('vol-phone').value.trim();
  const email = document.getElementById('vol-email').value.trim();
  const area = document.getElementById('vol-area').value.trim();
  const category = document.getElementById('vol-category').value;
  const skills = document.getElementById('vol-skills').value.trim();
  const avail = document.getElementById('vol-avail').value;
  const exp = document.getElementById('vol-exp').value.trim();

  let hasError = false;
  if (!name) { document.getElementById('err-vol-name').textContent = 'Name is required'; hasError = true; }
  if (!phone) { document.getElementById('err-vol-phone').textContent = 'Phone is required'; hasError = true; }
  if (!email) { document.getElementById('err-vol-email').textContent = 'Email is required'; hasError = true; }
  if (!area) { document.getElementById('err-vol-area').textContent = 'Area is required'; hasError = true; }
  if (!category) { document.getElementById('err-vol-category').textContent = 'Please choose a category'; hasError = true; }
  if (!skills) { document.getElementById('err-vol-skills').textContent = 'Skills description is required'; hasError = true; }

  if (hasError) return;

  const newVolunteer = {
    id: `VOL-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    phone,
    email,
    area,
    city: 'New Delhi',
    category,
    skills,
    availability: avail,
    emergencyExperience: exp || 'Civilian Emergency Volunteer',
    status: 'Active',
    assignedIncidentId: null,
    joinedDate: new Date().toISOString().split('T')[0]
  };

  window.CER_DB.insert('volunteers', newVolunteer);

  // Update current user's profile badge
  const currentUser = window.CER_STATE.get('currentUser');
  if (currentUser) {
    currentUser.volunteerStatus = `Volunteer (${category})`;
    window.CER_DB.update('users', currentUser.id, { volunteerStatus: currentUser.volunteerStatus });
  }

  window.CER_AUDIO.playSuccess();
  window.showToast('Volunteer registration submitted successfully!', 'success');
  window.renderVolunteersScreen('roster');
};
