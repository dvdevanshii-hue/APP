/**
 * Resource Management Component
 * Stock availability tracking, depot locations, status badges & admin stock updates (Section 10)
 */

window.renderResourcesScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const resources = window.CER_DB.getAll('resources');
  const user = window.CER_STATE.get('currentUser') || {};
  const isAdmin = user.role === 'admin';

  const availableCount = resources.filter(r => r.status === 'Available').length;
  const limitedCount = resources.filter(r => r.status === 'Limited').length;
  const unavailableCount = resources.filter(r => r.status === 'Unavailable').length;

  container.innerHTML = `
    <div class="resources-screen-wrapper">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Emergency Resources</span>
        <span class="demo-tag-pill">Relief Depots</span>
      </div>

      <!-- Inventory Health Summary Bar -->
      <div class="resource-summary-bar">
        <div class="summary-chip green">
          <span class="dot"></span>
          <b>${availableCount}</b> Adequate
        </div>
        <div class="summary-chip yellow">
          <span class="dot"></span>
          <b>${limitedCount}</b> Limited
        </div>
        <div class="summary-chip red">
          <span class="dot"></span>
          <b>${unavailableCount}</b> Critical / Out
        </div>
      </div>

      <!-- Admin Fast Action Banner -->
      ${isAdmin ? `
        <div class="admin-notice-strip">
          <span>🛡️ Admin Mode: You have authorization to adjust inventory levels.</span>
        </div>
      ` : ''}

      <!-- Resources List -->
      <div class="resources-list-grid">
        ${resources.map(res => {
          let statusClass = 'green';
          let statusText = '🟢 Available';
          if (res.status === 'Limited') {
            statusClass = 'yellow';
            statusText = '🟡 Limited';
          } else if (res.status === 'Unavailable') {
            statusClass = 'red';
            statusText = '🔴 Unavailable';
          }

          let icon = '📦';
          if (res.category === 'Blood') icon = '🩸';
          else if (res.category === 'Food') icon = '🍲';
          else if (res.category === 'Water') icon = '💧';
          else if (res.category === 'Medicines') icon = '💊';
          else if (res.category === 'Blankets') icon = '🛏️';
          else if (res.category === 'First Aid Kits') icon = '🩹';
          else if (res.category === 'Emergency Kits') icon = '🧰';
          else if (res.category === 'Oxygen') icon = '🫁';

          return `
            <div class="resource-card status-${statusClass}">
              <div class="res-card-top">
                <div class="res-title-box">
                  <span class="res-icon">${icon}</span>
                  <div>
                    <h4 class="res-name">${res.name}</h4>
                    <span class="res-cat-tag">${res.category}</span>
                  </div>
                </div>
                <div class="res-status-pill ${statusClass}">
                  ${statusText}
                </div>
              </div>

              <div class="res-metric-row">
                <div class="metric-block">
                  <span class="metric-val">${res.quantity.toLocaleString()}</span>
                  <span class="metric-unit">${res.unit}</span>
                </div>
                <div class="metric-notes">
                  <small>${res.notes || 'Disaster stock reserve'}</small>
                </div>
              </div>

              <div class="res-location-row">
                <span>📍 Depot: <b>${res.location}</b></span>
                <span class="res-updated">🕒 ${res.lastUpdated}</span>
              </div>

              ${isAdmin ? `
                <div class="res-admin-actions">
                  <button class="btn-update-stock" onclick="window.openResourceUpdateModal('${res.id}')">
                    ✏️ Update Quantity & Status
                  </button>
                </div>
              ` : `
                <div class="res-citizen-actions">
                  <button class="btn-request-resource" onclick="window.requestResourceAid('${res.name}', '${res.location}')">
                    Request Supply Dispatch
                  </button>
                </div>
              `}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

window.openResourceUpdateModal = function(resourceId) {
  const res = window.CER_DB.getById('resources', resourceId);
  if (!res) return;

  window.showModal(`
    <div class="modal-card">
      <div class="modal-header">
        <div class="header-icon res">📦</div>
        <div>
          <h3 class="title">Update Resource Stock</h3>
          <p class="subtitle">${res.name} (${res.unit})</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Available Quantity (${res.unit})</label>
          <input type="number" id="update-res-qty" value="${res.quantity}" min="0" />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select id="update-res-status">
            <option value="Available" ${res.status === 'Available' ? 'selected' : ''}>🟢 Available</option>
            <option value="Limited" ${res.status === 'Limited' ? 'selected' : ''}>🟡 Limited</option>
            <option value="Unavailable" ${res.status === 'Unavailable' ? 'selected' : ''}>🔴 Unavailable</option>
          </select>
        </div>
        <div class="form-group">
          <label>Depot / Distribution Location</label>
          <input type="text" id="update-res-loc" value="${res.location}" />
        </div>
        <div class="form-group">
          <label>Operational Note</label>
          <input type="text" id="update-res-notes" value="${res.notes || ''}" />
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="window.saveResourceUpdate('${res.id}')">Save Changes</button>
        <button class="btn-text" onclick="window.closeModal()">Cancel</button>
      </div>
    </div>
  `);
};

window.saveResourceUpdate = function(resourceId) {
  const qty = parseInt(document.getElementById('update-res-qty')?.value, 10) || 0;
  const status = document.getElementById('update-res-status')?.value || 'Available';
  const loc = document.getElementById('update-res-loc')?.value || '';
  const notes = document.getElementById('update-res-notes')?.value || '';

  window.closeModal();

  window.CER_DB.update('resources', resourceId, {
    quantity: qty,
    status: status,
    location: loc,
    notes: notes,
    lastUpdated: 'Just now'
  });

  window.showToast('Resource inventory updated successfully', 'success');
  window.renderResourcesScreen();
};

window.requestResourceAid = function(resName, location) {
  window.showToast(`Relief supply request for ${resName} submitted to ${location}`, 'success');
};
