/**
 * Admin Command Center & Management Portal
 * Sections 16, 17 & 18: Incident Command Dashboard, Incident Dispatch, Alert Broadcast
 */

window.renderAdminDashboardScreen = function(activeTab = 'overview') {
  const container = document.getElementById('view-container');
  if (!container) return;

  const users = window.CER_DB.getAll('users');
  const volunteers = window.CER_DB.getAll('volunteers');
  const activeVolunteers = volunteers.filter(v => v.status === 'Active');
  const donors = window.CER_DB.getAll('blood_donors');
  const availDonors = donors.filter(d => d.availability === 'Available');
  const incidents = window.CER_DB.getAll('incidents');
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed');
  const resources = window.CER_DB.getAll('resources');
  const availResources = resources.filter(r => r.status === 'Available');
  const alerts = window.CER_DB.getAll('alerts').filter(a => a.active);
  const ambulances = window.CER_DB.getAll('ambulances');
  const availAmbulances = ambulances.filter(a => a.status === 'Available');

  container.innerHTML = `
    <div class="admin-portal-wrapper">
      <!-- Admin Top Nav Bar -->
      <div class="admin-top-bar">
        <div class="admin-brand">
          <span class="admin-shield">🛡️</span>
          <div>
            <h3>DISASTER CONTROL HQ</h3>
            <span class="admin-sub">Emergency Incident Commander</span>
          </div>
        </div>
        <div class="admin-actions-right">
          <button class="btn-citizen-switch" onclick="window.CER_STATE.navigate('home')">
            Exit to Citizen App ✕
          </button>
        </div>
      </div>

      <!-- Admin Tab Navigation Strip -->
      <div class="admin-tabs-nav">
        <button class="adm-tab ${activeTab === 'overview' ? 'active' : ''}" onclick="window.renderAdminDashboardScreen('overview')">
          📊 Overview
        </button>
        <button class="adm-tab ${activeTab === 'incidents' ? 'active' : ''}" onclick="window.renderAdminDashboardScreen('incidents')">
          🚨 Incidents (${activeIncidents.length})
        </button>
        <button class="adm-tab ${activeTab === 'alerts' ? 'active' : ''}" onclick="window.renderAdminDashboardScreen('alerts')">
          📢 Broadcasts (${alerts.length})
        </button>
        <button class="adm-tab ${activeTab === 'volunteers' ? 'active' : ''}" onclick="window.renderAdminDashboardScreen('volunteers')">
          🙋 Responders (${activeVolunteers.length})
        </button>
        <button class="adm-tab ${activeTab === 'users' ? 'active' : ''}" onclick="window.renderAdminDashboardScreen('users')">
          👥 SQL Users
        </button>
      </div>

      <div class="admin-view-body">
        ${activeTab === 'overview' ? window.renderAdminOverviewHtml(users, activeVolunteers, availDonors, activeIncidents, availResources, alerts, availAmbulances) : ''}
        ${activeTab === 'incidents' ? window.renderAdminIncidentsHtml(incidents) : ''}
        ${activeTab === 'alerts' ? window.renderAdminAlertsHtml(alerts) : ''}
        ${activeTab === 'volunteers' ? window.renderAdminVolunteersHtml(volunteers) : ''}
        ${activeTab === 'users' ? window.renderAdminUsersHtml() : ''}
      </div>
    </div>
  `;
};

window.renderAdminOverviewHtml = function(users, activeVolunteers, availDonors, activeIncidents, availResources, alerts, availAmbulances) {
  return `
    <div class="admin-overview-view">
      <!-- Stat Metric Cards (Section 16 Requirements) -->
      <div class="admin-stats-grid">
        <div class="admin-kpi-card kpi-red" onclick="window.renderAdminDashboardScreen('incidents')">
          <div class="kpi-header">
            <span>🚨 Active Incidents</span>
            <span class="kpi-trend">Live</span>
          </div>
          <div class="kpi-number">${activeIncidents.length}</div>
          <span class="kpi-sub">Critical / In Progress</span>
        </div>

        <div class="admin-kpi-card kpi-orange" onclick="window.renderAdminDashboardScreen('alerts')">
          <div class="kpi-header">
            <span>📢 Active Alerts</span>
            <span class="kpi-trend">Broadcast</span>
          </div>
          <div class="kpi-number">${alerts.length}</div>
          <span class="kpi-sub">Advisories Issued</span>
        </div>

        <div class="admin-kpi-card kpi-green" onclick="window.renderAdminDashboardScreen('volunteers')">
          <div class="kpi-header">
            <span>🙋 Active Volunteers</span>
            <span class="kpi-trend">Ready</span>
          </div>
          <div class="kpi-number">${activeVolunteers.length}</div>
          <span class="kpi-sub">Field Responders</span>
        </div>

        <div class="admin-kpi-card kpi-blue">
          <div class="kpi-header">
            <span>🩸 Blood Donors</span>
            <span class="kpi-trend">Eligible</span>
          </div>
          <div class="kpi-number">${availDonors.length}</div>
          <span class="kpi-sub">Ready for Emergency</span>
        </div>

        <div class="admin-kpi-card kpi-purple" onclick="window.CER_STATE.navigate('resources')">
          <div class="kpi-header">
            <span>📦 Adequate Resources</span>
            <span class="kpi-trend">Depots</span>
          </div>
          <div class="kpi-number">${availResources.length}</div>
          <span class="kpi-sub">Supply Categories</span>
        </div>

        <div class="admin-kpi-card kpi-teal" onclick="window.CER_STATE.navigate('ambulances')">
          <div class="kpi-header">
            <span>🚑 Ambulances Ready</span>
            <span class="kpi-trend">ALS/BLS</span>
          </div>
          <div class="kpi-number">${availAmbulances.length}</div>
          <span class="kpi-sub">Fleet Units Standby</span>
        </div>
      </div>

      <!-- Quick Action Controls -->
      <div class="admin-quick-ops">
        <h4>Incident Commander Quick Actions</h4>
        <div class="ops-button-row">
          <button class="btn-op-broadcast" onclick="window.openCreateAlertModal()">
            📢 Broadcast Urgent Alert
          </button>
          <button class="btn-op-incident" onclick="window.CER_STATE.navigate('incident-report')">
            📝 Log New Dispatch
          </button>
          <button class="btn-op-resource" onclick="window.CER_STATE.navigate('resources')">
            📦 Stock Up Inventory
          </button>
        </div>
      </div>

      <!-- Tactical Map View for Admin -->
      <div class="admin-map-panel">
        <div class="panel-header">
          <h4>🗺️ Tactical Field Radar Map</h4>
          <span class="badge badge-blue">Live Geofence</span>
        </div>
        <div id="admin-tactical-map" style="width:100%; height:230px; border-radius:12px; overflow:hidden;"></div>
      </div>
    </div>
  `;
};

// Admin Incident Management (Section 17)
window.renderAdminIncidentsHtml = function(incidents) {
  return `
    <div class="admin-incidents-panel">
      <!-- Multi-Filter Bar -->
      <div class="admin-filter-bar">
        <input type="text" id="admin-inc-search" placeholder="Search location or title..." oninput="window.filterAdminIncidents()" />
        <select id="admin-inc-filter-sev" onchange="window.filterAdminIncidents()">
          <option value="ALL">All Severities</option>
          <option value="Critical">Critical Only</option>
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>
        <select id="admin-inc-filter-status" onchange="window.filterAdminIncidents()">
          <option value="ALL">All Statuses</option>
          <option value="Reported">🟡 Reported</option>
          <option value="Assigned">🔵 Assigned</option>
          <option value="In Progress">🟠 In Progress</option>
          <option value="Resolved">🟢 Resolved</option>
          <option value="Closed">🔴 Closed</option>
        </select>
      </div>

      <div class="admin-incidents-list" id="admin-incidents-container">
        ${window.renderAdminIncidentCardsList(incidents)}
      </div>
    </div>
  `;
};

window.renderAdminIncidentCardsList = function(incidents) {
  if (incidents.length === 0) {
    return `<div class="empty-state-card"><p>No incidents match the selected filter.</p></div>`;
  }

  return incidents.map(inc => {
    let sevBadge = inc.severity === 'Critical' ? 'badge-red' : (inc.severity === 'High' ? 'badge-orange' : 'badge-yellow');
    return `
      <div class="admin-incident-row-card">
        <div class="airc-header">
          <div class="airc-id-title">
            <span class="inc-id-tag">#${inc.id}</span>
            <span class="badge ${sevBadge}">${inc.severity}</span>
            <span class="inc-type-label">${inc.type || inc.category}</span>
          </div>
          <span class="badge badge-blue">${inc.status}</span>
        </div>

        <h4 class="airc-title">${inc.title}</h4>
        <p class="airc-desc">${inc.description}</p>

        <div class="airc-meta">
          <span>📍 ${inc.location}</span>
          <span>👤 Caller: ${inc.reportedBy} (${inc.reportedByPhone || 'Protected'})</span>
          <span>🕒 ${inc.reportedAt}</span>
        </div>

        <div class="airc-assignment">
          <b>Assigned:</b> ${inc.assignedVolunteerName || '<span style="color:var(--color-error)">⚠️ Unassigned</span>'}
        </div>

        <div class="airc-actions">
          <button class="btn-admin-manage" onclick="window.openAdminIncidentModal('${inc.id}')">
            ⚙️ Manage Dispatch & Status
          </button>
          ${inc.status !== 'Resolved' ? `
            <button class="btn-admin-resolve-fast" onclick="window.markIncidentResolvedFast('${inc.id}')">
              ✅ Mark Resolved
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
};

window.filterAdminIncidents = function() {
  const q = document.getElementById('admin-inc-search')?.value.toLowerCase().trim() || '';
  const sev = document.getElementById('admin-inc-filter-sev')?.value || 'ALL';
  const st = document.getElementById('admin-inc-filter-status')?.value || 'ALL';

  const incidents = window.CER_DB.getAll('incidents');
  const filtered = incidents.filter(i => {
    if (sev !== 'ALL' && i.severity !== sev) return false;
    if (st !== 'ALL' && i.status !== st) return false;
    if (q && !i.title.toLowerCase().includes(q) && !i.location.toLowerCase().includes(q) && !i.id.toLowerCase().includes(q)) return false;
    return true;
  });

  const c = document.getElementById('admin-incidents-container');
  if (c) c.innerHTML = window.renderAdminIncidentCardsList(filtered);
};

window.openAdminIncidentModal = function(incId) {
  const inc = window.CER_DB.getById('incidents', incId);
  if (!inc) return;

  const volunteers = window.CER_DB.getAll('volunteers');

  window.showModal(`
    <div class="modal-card admin-inc-modal">
      <div class="modal-header">
        <div class="header-icon">⚙️</div>
        <div>
          <h3 class="title">Incident Dispatch Control</h3>
          <p class="subtitle">#${inc.id} • ${inc.title}</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Lifecycle Status</label>
          <select id="admin-update-status">
            <option value="Reported" ${inc.status === 'Reported' ? 'selected' : ''}>🟡 Reported</option>
            <option value="Assigned" ${inc.status === 'Assigned' ? 'selected' : ''}>🔵 Assigned</option>
            <option value="In Progress" ${inc.status === 'In Progress' ? 'selected' : ''}>🟠 In Progress</option>
            <option value="Resolved" ${inc.status === 'Resolved' ? 'selected' : ''}>🟢 Resolved</option>
            <option value="Closed" ${inc.status === 'Closed' ? 'selected' : ''}>🔴 Closed</option>
          </select>
        </div>

        <div class="form-group">
          <label>Assign First Responder / Volunteer</label>
          <select id="admin-assign-vol">
            <option value="">-- No Volunteer Assigned --</option>
            ${volunteers.map(v => `
              <option value="${v.id}" ${inc.assignedVolunteerId === v.id ? 'selected' : ''}>
                ${v.name} (${v.category} - ${v.status})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Severity Level</label>
          <select id="admin-update-sev">
            <option value="Critical" ${inc.severity === 'Critical' ? 'selected' : ''}>🔴 Critical</option>
            <option value="High" ${inc.severity === 'High' ? 'selected' : ''}>🟠 High</option>
            <option value="Moderate" ${inc.severity === 'Moderate' ? 'selected' : ''}>🟡 Moderate</option>
            <option value="Low" ${inc.severity === 'Low' ? 'selected' : ''}>🔵 Low</option>
          </select>
        </div>

        <div class="form-group">
          <label>Incident Commander Action Note</label>
          <textarea id="admin-action-note" rows="2" placeholder="e.g. Unit dispatched, road cleared, victim stabilized...">${inc.adminNotes || ''}</textarea>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.saveAdminIncidentChanges('${inc.id}')">Apply Updates</button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};

window.saveAdminIncidentChanges = function(incId) {
  const newStatus = document.getElementById('admin-update-status').value;
  const newVolId = document.getElementById('admin-assign-vol').value;
  const newSev = document.getElementById('admin-update-sev').value;
  const note = document.getElementById('admin-action-note').value;

  const inc = window.CER_DB.getById('incidents', incId);
  if (!inc) return;

  let volName = inc.assignedVolunteerName;
  if (newVolId) {
    const v = window.CER_DB.getById('volunteers', newVolId);
    if (v) volName = `${v.name} (${v.category})`;
  } else {
    volName = null;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeline = inc.timeline || [];
  timeline.push({ time: timeStr, text: `Dispatcher updated status to "${newStatus}". Note: ${note || 'Status updated.'}` });

  window.CER_DB.update('incidents', incId, {
    status: newStatus,
    severity: newSev,
    assignedVolunteerId: newVolId || null,
    assignedVolunteerName: volName,
    adminNotes: note,
    timeline: timeline
  });

  window.closeModal();
  window.showToast(`Incident #${incId} updated successfully`, 'success');
  window.renderAdminDashboardScreen('incidents');
};

window.markIncidentResolvedFast = function(incId) {
  const inc = window.CER_DB.getById('incidents', incId);
  if (!inc) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeline = inc.timeline || [];
  timeline.push({ time: timeStr, text: `Incident confirmed resolved by Incident Commander Dr. Anita Roy.` });

  window.CER_DB.update('incidents', incId, {
    status: 'Resolved',
    timeline: timeline
  });

  window.showToast(`Incident #${incId} marked as Resolved!`, 'success');
  window.renderAdminDashboardScreen('incidents');
};

// Admin Alert Management (Section 18)
window.renderAdminAlertsHtml = function(alerts) {
  return `
    <div class="admin-alerts-panel">
      <div class="admin-panel-top">
        <p>Broadcast public safety alerts directly to all citizens in the affected zone.</p>
        <button class="btn-primary" onclick="window.openCreateAlertModal()">
          📢 Create New Alert Broadcast
        </button>
      </div>

      <div class="admin-alerts-list">
        ${alerts.map(alt => `
          <div class="admin-alert-item sev-${alt.severity.toLowerCase()}">
            <div class="aai-header">
              <span class="badge ${alt.severity === 'Critical' ? 'badge-red' : 'badge-orange'}">${alt.severity}</span>
              <span class="aai-date">Issued: ${alt.date}</span>
            </div>
            <h4>${alt.title}</h4>
            <p><b>Area:</b> ${alt.affectedArea}</p>
            <p>${alt.description}</p>

            <div class="aai-actions">
              <button class="btn-text-delete" onclick="window.deleteAlert('${alt.id}')">
                🗑️ Retract / Delete Alert
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

window.renderAdminVolunteersHtml = function(volunteers) {
  return `
    <div class="admin-volunteers-panel">
      <div class="vol-management-header">
        <p>Field responders and community volunteer corps management.</p>
      </div>
      <div class="admin-vol-grid">
        ${volunteers.map(v => `
          <div class="admin-vol-card">
            <div class="avc-top">
              <b>${v.name}</b>
              <span class="badge badge-green">${v.status}</span>
            </div>
            <p>🏷️ <b>Category:</b> ${v.category}</p>
            <p>🛠️ <b>Skills:</b> ${v.skills}</p>
            <p>📍 <b>Area:</b> ${v.area}</p>
            <p>📱 <b>Phone:</b> ${v.phone}</p>
            <p>⏰ <b>Availability:</b> ${v.availability}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// Admin Alert & Disaster Management (Sections 18 & Disaster Module)
window.renderAdminAlertsHtml = function(alerts) {
  return `
    <div class="admin-alerts-panel">
      <div class="admin-panel-top">
        <div>
          <h4>Natural Disasters & Crisis Alert Broadcaster</h4>
          <p>Create, update and issue real-time disaster warnings to the citizen network.</p>
        </div>
        <button class="btn-primary" onclick="window.openCreateDisasterAlertModal()">
          📢 ➕ Issue New Disaster Alert
        </button>
      </div>

      <div class="admin-alerts-list">
        ${alerts.length === 0 ? `
          <div class="empty-state-card"><p>No active disaster broadcasts.</p></div>
        ` : alerts.map(alt => {
          const sevClass = (alt.severity || 'High').toLowerCase();
          const instructions = Array.isArray(alt.safetyInstructions)
            ? alt.safetyInstructions
            : (alt.safetyInstructions || '').split('\n').filter(Boolean);

          return `
            <div class="admin-alert-item sev-${sevClass}">
              <div class="aai-header">
                <div class="aai-type-block">
                  <span class="aai-icon">${alt.disasterIcon || '⚠️'}</span>
                  <b>${(alt.disasterType || 'Disaster').toUpperCase()}</b>
                  <span class="badge badge-blue">${alt.status || 'Active Warning'}</span>
                </div>
                <div class="aai-badges">
                  <span class="badge ${alt.severity === 'Critical' ? 'badge-red' : (alt.severity === 'High' ? 'badge-orange' : 'badge-yellow')}">${alt.severity}</span>
                  <span class="aai-date">🕒 ${alt.date}</span>
                </div>
              </div>

              <h4 class="aai-title">${alt.title}</h4>
              <p class="aai-area">📍 <b>Affected Area:</b> ${alt.affectedArea}</p>
              <p class="aai-desc">${alt.description}</p>

              <div class="aai-safety-preview">
                <b>Safety Instructions (${instructions.length}):</b>
                <ul>
                  ${instructions.slice(0, 3).map(s => `<li>• ${s}</li>`).join('')}
                  ${instructions.length > 3 ? `<li><i>+ ${instructions.length - 3} more instructions</i></li>` : ''}
                </ul>
              </div>

              ${alt.nearbyResources ? `
                <div class="aai-res-preview">
                  <b>Assigned Resources:</b>
                  <span>${Array.isArray(alt.nearbyResources) ? alt.nearbyResources.join(' • ') : alt.nearbyResources}</span>
                </div>
              ` : ''}

              <div class="aai-actions">
                <button class="btn-admin-edit-alt" onclick="window.openCreateDisasterAlertModal('${alt.id}')">
                  ✏️ Edit / Update Alert
                </button>
                <button class="btn-admin-resend-push" onclick="window.resendDisasterPushNotification('${alt.id}')">
                  📲 Trigger Push
                </button>
                <button class="btn-text-delete" onclick="window.deleteAlert('${alt.id}')">
                  🗑️ Retract / Delete
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

window.renderAdminVolunteersHtml = function(volunteers) {
  return `
    <div class="admin-volunteers-panel">
      <div class="vol-management-header">
        <p>Field responders and community volunteer corps management.</p>
      </div>
      <div class="admin-vol-grid">
        ${volunteers.map(v => `
          <div class="admin-vol-card">
            <div class="avc-top">
              <b>${v.name}</b>
              <span class="badge badge-green">${v.status}</span>
            </div>
            <p>🏷️ <b>Category:</b> ${v.category}</p>
            <p>🛠️ <b>Skills:</b> ${v.skills}</p>
            <p>📍 <b>Area:</b> ${v.area}</p>
            <p>📱 <b>Phone:</b> ${v.phone}</p>
            <p>⏰ <b>Availability:</b> ${v.availability}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

// Modal for Creating or Updating a Natural Disaster Alert
window.openCreateDisasterAlertModal = function(editAlertId = null) {
  const existingAlert = editAlertId ? window.CER_DB.getById('alerts', editAlertId) : null;
  const isEdit = Boolean(existingAlert);

  const defTypes = window.DISASTER_DEFINITIONS || [
    { type: 'Flood', icon: '🌊', label: 'Flood' },
    { type: 'Tsunami', icon: '🌊', label: 'Tsunami' },
    { type: 'Landslide', icon: '⛰️', label: 'Landslide' },
    { type: 'Earthquake', icon: '🌍', label: 'Earthquake' },
    { type: 'Cyclone', icon: '🌪️', label: 'Cyclone' },
    { type: 'Wildfire', icon: '🔥', label: 'Wildfire' },
    { type: 'Severe Storm', icon: '⛈️', label: 'Severe Storm' },
    { type: 'Heavy Rainfall', icon: '🌧️', label: 'Heavy Rainfall' },
    { type: 'Extreme Weather', icon: '🌨️', label: 'Extreme Weather' },
    { type: 'Fire', icon: '🔥', label: 'Fire' },
    { type: 'Other Emergency', icon: '⚠️', label: 'Other Emergency' }
  ];

  const now = new Date();
  const defaultDate = 'Today, ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Safety instructions formatted as string
  let initialInstructions = '';
  if (existingAlert) {
    if (Array.isArray(existingAlert.safetyInstructions)) {
      initialInstructions = existingAlert.safetyInstructions.join('\n');
    } else {
      initialInstructions = existingAlert.safetyInstructions || '';
    }
  } else {
    // Default Flood instructions
    initialInstructions = (window.DISASTER_SAFETY_TEMPLATES && window.DISASTER_SAFETY_TEMPLATES['Flood'])
      ? window.DISASTER_SAFETY_TEMPLATES['Flood'].join('\n')
      : 'Avoid flooded roads\nMove to a safe/high location\nKeep emergency supplies ready';
  }

  const initialResources = existingAlert && existingAlert.nearbyResources
    ? (Array.isArray(existingAlert.nearbyResources) ? existingAlert.nearbyResources.join(', ') : existingAlert.nearbyResources)
    : 'District Relief Shelter #2 (1.2 km), Emergency Boat Rescue Squad #1, Trauma Center';

  window.showModal(`
    <div class="modal-card disaster-admin-modal">
      <div class="modal-header">
        <div class="header-icon alert">${existingAlert?.disasterIcon || '🚨'}</div>
        <div>
          <h3 class="title">${isEdit ? 'Update Disaster Alert' : 'Publish Natural Disaster Alert'}</h3>
          <p class="subtitle">Admin Fields: Type, Title, Description, Area, Severity, Time, Instructions, Status</p>
        </div>
      </div>
      <div class="modal-body">
        <input type="hidden" id="admin-alert-edit-id" value="${existingAlert ? existingAlert.id : ''}" />

        <!-- Disaster Type Dropdown -->
        <div class="form-group">
          <label>Disaster Type <span class="req">*</span></label>
          <select id="admin-alert-type" onchange="window.handleAdminDisasterTypeChange(this.value)">
            ${defTypes.map(d => `
              <option value="${d.type}" data-icon="${d.icon}" ${existingAlert?.disasterType === d.type ? 'selected' : ''}>
                ${d.icon} ${d.label}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Alert Title -->
        <div class="form-group">
          <label>Alert Title <span class="req">*</span></label>
          <input type="text" id="admin-alert-title" value="${existingAlert ? existingAlert.title : '🌊 FLOOD WARNING: Major Waterlogging Alert'}" placeholder="e.g. 🌊 FLOOD WARNING: Yamuna River Inundation" required />
        </div>

        <!-- Description -->
        <div class="form-group">
          <label>Threat Description <span class="req">*</span></label>
          <textarea id="admin-alert-desc" rows="3" placeholder="Provide accurate situational assessment, current readings, and hazards...">${existingAlert ? existingAlert.description : 'Heavy rainfall has caused waterlogging in some areas. River levels are rising rapidly.'}</textarea>
        </div>

        <div class="form-row">
          <!-- Affected Area -->
          <div class="form-group half">
            <label>Affected Location / Area <span class="req">*</span></label>
            <input type="text" id="admin-alert-area" value="${existingAlert ? existingAlert.affectedArea : 'Delhi NCR & Low-lying Sectors'}" placeholder="e.g. Delhi" required />
          </div>

          <!-- Severity Level -->
          <div class="form-group half">
            <label>Severity Level <span class="req">*</span></label>
            <select id="admin-alert-sev">
              <option value="Critical" ${existingAlert?.severity === 'Critical' ? 'selected' : ''}>🔴 Critical</option>
              <option value="High" ${(!existingAlert || existingAlert?.severity === 'High') ? 'selected' : ''}>🟠 High</option>
              <option value="Medium" ${existingAlert?.severity === 'Medium' ? 'selected' : ''}>🟡 Medium</option>
              <option value="Low" ${existingAlert?.severity === 'Low' ? 'selected' : ''}>🔵 Low</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <!-- Date / Time -->
          <div class="form-group half">
            <label>Date and Time <span class="req">*</span></label>
            <input type="text" id="admin-alert-date" value="${existingAlert ? existingAlert.date : defaultDate}" required />
          </div>

          <!-- Status -->
          <div class="form-group half">
            <label>Current Status <span class="req">*</span></label>
            <select id="admin-alert-status">
              <option value="Active Warning" ${(!existingAlert || existingAlert?.status === 'Active Warning') ? 'selected' : ''}>🚨 Active Warning</option>
              <option value="Watch" ${existingAlert?.status === 'Watch' ? 'selected' : ''}>👁️ Watch</option>
              <option value="Advisory" ${existingAlert?.status === 'Advisory' ? 'selected' : ''}>📢 Advisory</option>
              <option value="Evacuation Order" ${existingAlert?.status === 'Evacuation Order' ? 'selected' : ''}>🏃 Evacuation Order</option>
              <option value="Standby" ${existingAlert?.status === 'Standby' ? 'selected' : ''}>⏳ Standby</option>
              <option value="Resolved" ${existingAlert?.status === 'Resolved' ? 'selected' : ''}>✅ Resolved</option>
            </select>
          </div>
        </div>

        <!-- Safety Instructions with Auto-fill helper -->
        <div class="form-group">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <label style="margin:0;">Safety Instructions (1 per line) <span class="req">*</span></label>
            <button type="button" class="btn-text-nav" style="font-size:11px; padding:0;" onclick="window.autoFillSafetyInstructions()">
              ⚡ Load Suggested Protocol
            </button>
          </div>
          <textarea id="admin-alert-safety" rows="4" placeholder="• Avoid flooded roads\n• Move to a safe/high location if necessary\n• Keep emergency supplies ready\n• Follow official emergency instructions">${initialInstructions}</textarea>
        </div>

        <!-- Emergency Resources Nearby -->
        <div class="form-group">
          <label>Emergency Resources Nearby <small>(Comma-separated facilities)</small></label>
          <input type="text" id="admin-alert-resources" value="${initialResources}" placeholder="e.g. Relief Camp #2, Trauma Hospital, Boat Rescue Squad" />
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-primary" onclick="window.saveAndPublishDisasterAlert()">
          ${isEdit ? '💾 Update & Re-Publish Alert' : '🚀 Publish Alert & Send Push Notifications'}
        </button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};

window.openCreateAlertModal = window.openCreateDisasterAlertModal;

window.handleAdminDisasterTypeChange = function(selectedType) {
  const typeObj = (window.DISASTER_DEFINITIONS || []).find(d => d.type === selectedType);
  const icon = typeObj ? typeObj.icon : '🚨';
  
  const titleInput = document.getElementById('admin-alert-title');
  if (titleInput && (!titleInput.value || titleInput.value.includes('WARNING') || titleInput.value.includes('ALERT'))) {
    titleInput.value = `${icon} ${selectedType.toUpperCase()} WARNING`;
  }

  // Offer automatic safety template
  window.autoFillSafetyInstructions();
};

window.autoFillSafetyInstructions = function() {
  const selectedType = document.getElementById('admin-alert-type')?.value || 'Flood';
  const templates = window.DISASTER_SAFETY_TEMPLATES || {};
  const instructions = templates[selectedType] || [
    'Follow official emergency guidelines',
    'Keep your family emergency kit prepared',
    'Stay tuned to local disaster coordination broadcasts'
  ];

  const safetyArea = document.getElementById('admin-alert-safety');
  if (safetyArea) {
    safetyArea.value = instructions.join('\n');
    window.showToast(`Loaded official safety protocol for ${selectedType}`, 'info');
  }
};

window.saveAndPublishDisasterAlert = function() {
  const editId = document.getElementById('admin-alert-edit-id')?.value;
  const disasterType = document.getElementById('admin-alert-type')?.value || 'Other Emergency';
  const title = document.getElementById('admin-alert-title')?.value.trim();
  const desc = document.getElementById('admin-alert-desc')?.value.trim();
  const area = document.getElementById('admin-alert-area')?.value.trim();
  const sev = document.getElementById('admin-alert-sev')?.value || 'High';
  const dateStr = document.getElementById('admin-alert-date')?.value.trim();
  const status = document.getElementById('admin-alert-status')?.value || 'Active Warning';
  const safetyText = document.getElementById('admin-alert-safety')?.value.trim();
  const resourcesText = document.getElementById('admin-alert-resources')?.value.trim();

  if (!title || !desc || !area || !safetyText) {
    window.showToast('Please fill all required alert fields', 'warning');
    return;
  }

  window.closeModal();

  const typeObj = (window.DISASTER_DEFINITIONS || []).find(d => d.type === disasterType);
  const icon = typeObj ? typeObj.icon : '⚠️';

  const instructionsArray = safetyText.split('\n').map(s => s.trim()).filter(Boolean);
  const resourcesArray = resourcesText ? resourcesText.split(',').map(r => r.trim()).filter(Boolean) : [
    'Nearest Designated Safe Relief Camp',
    'Emergency First Aid Response Post'
  ];

  if (editId) {
    // Update existing alert
    window.CER_DB.update('alerts', editId, {
      disasterType,
      disasterIcon: icon,
      title,
      description: desc,
      affectedArea: area,
      severity: sev,
      date: dateStr,
      status,
      safetyInstructions: instructionsArray,
      nearbyResources: resourcesArray,
      isDemo: true,
      active: true
    });

    window.CER_AUDIO.playSuccess();
    window.showToast(`Disaster Alert #${editId} updated and synchronized!`, 'success');
  } else {
    // Create new alert
    const newId = `DIS-${Math.floor(100 + Math.random() * 900)}`;
    const newAlert = {
      id: newId,
      disasterType,
      disasterIcon: icon,
      title,
      category: `${disasterType} Alert`,
      severity: sev,
      affectedArea: area,
      date: dateStr,
      description: desc,
      safetyInstructions: instructionsArray,
      status,
      nearbyResources: resourcesArray,
      isDemo: true,
      active: true,
      issuedBy: 'Disaster Operations Command HQ'
    };

    window.CER_DB.insert('alerts', newAlert);

    // Create Push Notification
    const notif = {
      id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `🚨 ${title}`,
      message: `${disasterType} alert issued for ${area}. Status: ${status}.`,
      type: 'alert',
      timestamp: 'Just now',
      read: false,
      targetView: 'disaster-alerts'
    };
    window.CER_DB.insert('notifications', notif);

    window.CER_AUDIO.playWarning();
    window.showToast(`Natural Disaster Alert broadcasted across network!`, 'success');
  }

  window.renderAdminDashboardScreen('alerts');
};

window.resendDisasterPushNotification = function(alertId) {
  const alert = window.CER_DB.getById('alerts', alertId);
  if (!alert) return;

  const notif = {
    id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `🚨 PUSH BROADCAST: ${alert.title}`,
    message: `Urgent update for ${alert.affectedArea}. Status: ${alert.status}.`,
    type: 'alert',
    timestamp: 'Just now',
    read: false,
    targetView: 'disaster-alerts'
  };
  window.CER_DB.insert('notifications', notif);

  window.CER_AUDIO.playWarning();
  window.showToast(`Push notification dispatched for "${alert.title}"`, 'success');
};

window.deleteAlert = function(alertId) {
  if (confirm('Are you sure you want to retract/delete this disaster alert from the active feeds?')) {
    window.CER_DB.delete('alerts', alertId);
    window.showToast('Disaster alert retracted from public feed.', 'info');
    window.renderAdminDashboardScreen('alerts');
  }
};

window.renderAdminUsersHtml = function() {
  setTimeout(async () => {
    const listEl = document.getElementById('admin-sql-users-list');
    if (!listEl) return;
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      const users = data.users || [];
      if (users.length === 0) {
        listEl.innerHTML = '<div class="empty-state-card"><p>No users found in SQL database.</p></div>';
        return;
      }
      listEl.innerHTML = users.map(u => `
        <div class="admin-user-card" style="background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:14px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; gap:12px; align-items:center;">
            <div style="width:44px; height:44px; border-radius:50%; background:var(--primary-light, #e3f2fd); color:var(--primary, #1976d2); display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:bold;">
              ${u.role === 'admin' ? '🛡️' : '👤'}
            </div>
            <div>
              <div style="font-weight:700; font-size:15px; color:var(--text-main); display:flex; align-items:center; gap:8px;">
                ${u.name}
                <span style="font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px; background:${u.role === 'admin' ? '#ffebee' : '#e8f5e9'}; color:${u.role === 'admin' ? '#c62828' : '#2e7d32'}; text-transform:uppercase;">
                  ${u.role}
                </span>
              </div>
              <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                ✉️ ${u.email} | 📱 ${u.phone || 'N/A'}
              </div>
              <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
                📍 ${u.city || u.area || 'Unknown Area'} | 🩸 ${u.bloodGroup || 'N/A'} | 🆔 ${u.id}
              </div>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; background:rgba(0,0,0,0.05); padding:4px 8px; border-radius:6px; color:var(--text-secondary);">
              ${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>
      `).join('');
    } catch (e) {
      listEl.innerHTML = '<div class="empty-state-card"><p>Failed to load SQL users.</p></div>';
    }
  }, 50);

  return `
    <div class="admin-users-view">
      <div class="admin-section-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h3 style="margin:0; font-size:18px;">🗄️ SQL Registered Accounts</h3>
          <p style="margin:4px 0 0; font-size:12px; color:var(--text-secondary);">Live user accounts stored in SQLite database (database.sqlite)</p>
        </div>
        <button class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="window.renderAdminDashboardScreen('users')">
          🔄 Refresh
        </button>
      </div>

      <div id="admin-sql-users-list">
        <div style="text-align:center; padding:30px; color:var(--text-muted);">
          ⏳ Loading accounts from SQL database...
        </div>
      </div>
    </div>
  `;
};

