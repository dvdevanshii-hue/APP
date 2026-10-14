/**
 * Incident Status & Tracker Component
 * Real-time progression lifecycle (Reported -> Assigned -> In Progress -> Resolved -> Closed)
 * Section 13
 */

window.renderIncidentStatusScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = window.CER_STATE.get('currentUser') || {};
  const incidents = window.CER_DB.getAll('incidents');
  
  // Filter for this user or show all if admin
  const userIncidents = user.role === 'admin' 
    ? incidents 
    : incidents.filter(i => i.reportedBy === user.name || i.reportedByPhone === user.phone || incidents.indexOf(i) < 3);

  container.innerHTML = `
    <div class="incident-status-wrapper">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Incident Status Tracker</span>
        <button class="btn-new-report" onclick="window.CER_STATE.navigate('incident-report')">＋ New</button>
      </div>

      <div class="incident-tracker-intro">
        <p>Live status updates for community emergency reports and response operations.</p>
      </div>

      <!-- Incidents List -->
      <div class="incidents-tracker-list">
        ${userIncidents.length === 0 ? `
          <div class="empty-state-card">
            <span class="empty-icon">📂</span>
            <h3>No Incidents Reported</h3>
            <p>You have not logged any emergency reports yet.</p>
            <button class="btn-primary" onclick="window.CER_STATE.navigate('incident-report')">Report Incident Now</button>
          </div>
        ` : userIncidents.map(inc => {
          let statusBadgeClass = 'badge-yellow';
          let statusEmoji = '🟡';
          if (inc.status === 'Assigned') { statusBadgeClass = 'badge-blue'; statusEmoji = '🔵'; }
          else if (inc.status === 'In Progress') { statusBadgeClass = 'badge-orange'; statusEmoji = '🟠'; }
          else if (inc.status === 'Resolved') { statusBadgeClass = 'badge-green'; statusEmoji = '🟢'; }
          else if (inc.status === 'Closed') { statusBadgeClass = 'badge-red'; statusEmoji = '🔴'; }

          return `
            <div class="incident-tracker-card status-${inc.status.toLowerCase().replace(' ', '-')}">
              <!-- Header -->
              <div class="inc-card-header">
                <div>
                  <span class="inc-id-tag">#${inc.id}</span>
                  <span class="inc-cat-tag">${inc.type || inc.category}</span>
                </div>
                <span class="badge ${statusBadgeClass}">${statusEmoji} ${inc.status}</span>
              </div>

              <!-- Title & Location -->
              <h3 class="inc-title">${inc.title || inc.type}</h3>
              <div class="inc-meta-line">
                <span>📍 ${inc.location}</span>
                <span>🕒 ${inc.reportedAt}</span>
              </div>

              <p class="inc-desc-text">${inc.description}</p>

              ${inc.photoUrl ? `
                <div class="inc-photo-wrap">
                  <img src="${inc.photoUrl}" alt="Scene Photo" class="inc-scene-img" />
                </div>
              ` : ''}

              <!-- Responder info if assigned -->
              ${inc.assignedVolunteerName ? `
                <div class="inc-responder-box">
                  <span class="resp-icon">👮</span>
                  <div>
                    <b>Assigned Responder:</b>
                    <span>${inc.assignedVolunteerName}</span>
                  </div>
                </div>
              ` : ''}

              <!-- Visual Status Progression Bar -->
              <div class="status-stepper-bar">
                <div class="step-node ${window.isStepActive('Reported', inc.status)}">
                  <span class="node-circle">1</span>
                  <span class="node-label">Reported</span>
                </div>
                <div class="step-line ${window.isLineActive('Assigned', inc.status)}"></div>
                <div class="step-node ${window.isStepActive('Assigned', inc.status)}">
                  <span class="node-circle">2</span>
                  <span class="node-label">Assigned</span>
                </div>
                <div class="step-line ${window.isLineActive('In Progress', inc.status)}"></div>
                <div class="step-node ${window.isStepActive('In Progress', inc.status)}">
                  <span class="node-circle">3</span>
                  <span class="node-label">In Progress</span>
                </div>
                <div class="step-line ${window.isLineActive('Resolved', inc.status)}"></div>
                <div class="step-node ${window.isStepActive('Resolved', inc.status)}">
                  <span class="node-circle">4</span>
                  <span class="node-label">Resolved</span>
                </div>
              </div>

              <!-- Expandable Timeline Activity Log -->
              <div class="inc-timeline-block">
                <div class="timeline-title">Activity & Dispatch Updates:</div>
                <div class="timeline-items">
                  ${(inc.timeline || []).map(t => `
                    <div class="timeline-entry">
                      <span class="t-bullet"></span>
                      <div class="t-content">
                        <span class="t-time">${t.time}</span>
                        <span class="t-text">${t.text}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Follow up action -->
              <div class="inc-card-footer">
                <button class="btn-text-action" onclick="window.addIncidentUpdateNote('${inc.id}')">
                  💬 Add Follow-up Note
                </button>
                ${user.role === 'admin' ? `
                  <button class="btn-admin-manage-inc" onclick="window.openAdminIncidentModal('${inc.id}')">
                    🛡️ Admin Dispatch Control
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

window.isStepActive = function(stepName, currentStatus) {
  const order = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
  const curIdx = order.indexOf(currentStatus);
  const stepIdx = order.indexOf(stepName);
  if (curIdx >= stepIdx) return 'active';
  return '';
};

window.isLineActive = function(stepName, currentStatus) {
  const order = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
  const curIdx = order.indexOf(currentStatus);
  const stepIdx = order.indexOf(stepName);
  if (curIdx >= stepIdx) return 'active';
  return '';
};

window.addIncidentUpdateNote = function(incId) {
  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon">💬</div>
        <div>
          <h3 class="title">Add Incident Follow-up Note</h3>
          <p class="subtitle">Incident #${incId}</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Update Details</label>
          <textarea id="inc-note-text" rows="3" placeholder="Provide new situational updates or contact instructions..."></textarea>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.saveIncidentNote('${incId}')">Post Update</button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};

window.saveIncidentNote = function(incId) {
  const note = document.getElementById('inc-note-text')?.value.trim();
  if (!note) {
    window.showToast('Please enter a note', 'warning');
    return;
  }

  window.closeModal();

  const inc = window.CER_DB.getById('incidents', incId);
  if (inc) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeline = inc.timeline || [];
    timeline.push({ time: timeStr, text: `Follow-up note: ${note}` });

    window.CER_DB.update('incidents', incId, { timeline });
    window.showToast('Follow-up note appended to incident timeline', 'success');
    window.renderIncidentStatusScreen();
  }
};
