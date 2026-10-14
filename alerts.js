/**
 * Emergency Alerts Component
 * Official crisis bulletins, severity visual cues, actionable safety instructions & push simulation
 */

window.renderAlertsScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const alerts = window.CER_DB.getAll('alerts');
  const user = window.CER_STATE.get('currentUser') || {};
  const isAdmin = user.role === 'admin';

  container.innerHTML = `
    <div class="alerts-screen-wrapper">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Emergency Bulletins</span>
        <button class="btn-simulate-push" onclick="window.simulateIncomingPushAlert()" title="Test Push Notification">
          📲 Test Push
        </button>
      </div>

      <!-- Live Broadcast Banner -->
      <div class="alerts-live-indicator">
        <span class="live-dot-pulse"></span>
        <span><b>LIVE ADVISORY FEED</b> • Synchronized with Disaster Management Authorities</span>
      </div>

      ${isAdmin ? `
        <div class="admin-create-alert-bar">
          <button class="btn-admin-broadcast" onclick="window.openCreateAlertModal()">
            📢 Broadcast New Emergency Alert
          </button>
        </div>
      ` : ''}

      <!-- Alerts Feed -->
      <div class="alerts-feed-list">
        ${alerts.map(alt => {
          const sevClass = alt.severity.toLowerCase();
          return `
            <div class="alert-feed-card sev-${sevClass}">
              <div class="card-severity-strip ${sevClass}"></div>

              <div class="card-inner-pad">
                <div class="alert-top-row">
                  <div class="alert-tag ${sevClass}">
                    <span class="tag-pulse"></span>
                    ${alt.severity.toUpperCase()} ALERT
                  </div>
                  <span class="alert-timestamp">🕒 ${alt.date}</span>
                </div>

                <h3 class="alert-headline">${alt.title}</h3>
                
                <div class="alert-area-row">
                  <span>📍 <b>Affected Zone:</b> ${alt.affectedArea}</span>
                </div>

                <p class="alert-body-desc">${alt.description}</p>

                <!-- Safety Instructions Dropdown / Box -->
                <div class="safety-guide-box">
                  <div class="safety-guide-title">
                    <span>🛡️ Actionable Safety Instructions:</span>
                  </div>
                  <div class="safety-guide-content">
                    ${alt.safetyInstructions.split('\n').map(step => `<p>${step}</p>`).join('')}
                  </div>
                </div>

                <div class="alert-card-footer">
                  <span class="issued-by">Authority: <b>${alt.issuedBy || 'Civil Protection'}</b></span>
                  <button class="btn-share-alert" onclick="window.shareAlert('${alt.id}', '${alt.title.replace(/'/g, "\\'")}')">
                    📤 Share Safety Info
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};

window.simulateIncomingPushAlert = function() {
  window.CER_AUDIO.playWarning();

  // Create new live alert
  const pushAlert = {
    id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '⚠️ Flash Flood Siren Alert: Sector 14 Water Rise',
    category: 'Flood Warning',
    severity: 'Critical',
    affectedArea: 'Rohini Sector 14 & Outer Ring Road Lowlands',
    date: 'Just Now',
    description: 'Rapid stormwater runoff has inundated local storm drains. Road submergence up to 2 feet.',
    safetyInstructions: '1. Do not cross waterlogged underpasses.\n2. Keep cell phones charged and maintain battery saver mode.\n3. Ascend to upper floors if living in ground-level housing.',
    active: true,
    issuedBy: 'Immediate Response Dispatch'
  };

  window.CER_DB.insert('alerts', pushAlert);

  const notif = {
    id: `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '🚨 CRITICAL PUSH ALERT',
    message: pushAlert.title,
    type: 'alert',
    timestamp: 'Just now',
    read: false,
    targetView: 'alerts'
  };
  window.CER_DB.insert('notifications', notif);

  window.showToast('🚨 PUSH ALERT: ' + pushAlert.title, 'error');
  window.renderAlertsScreen();
};

window.shareAlert = function(id, title) {
  if (navigator.share) {
    navigator.share({
      title: 'Emergency Advisory',
      text: `EMERGENCY ALERT: ${title}. Stay safe and follow instructions.`,
      url: window.location.href
    }).catch(() => {});
  } else {
    window.showToast('Emergency alert details copied to clipboard!', 'info');
  }
};
