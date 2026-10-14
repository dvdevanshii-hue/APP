/**
 * Notification Center Component
 * Alerts, SOS status, incident updates & resource notifications (Section 15)
 */

window.renderNotificationsScreen = function(filter = 'all') {
  const container = document.getElementById('view-container');
  if (!container) return;

  const notifications = window.CER_DB.getAll('notifications');
  const unreadCount = notifications.filter(n => !n.read).length;

  let displayed = notifications;
  if (filter === 'unread') {
    displayed = notifications.filter(n => !n.read);
  }

  container.innerHTML = `
    <div class="notifications-screen-wrapper">
      <div class="screen-top-bar">
        <button class="btn-back-circle" onclick="window.CER_STATE.goBack()">←</button>
        <span class="screen-title">Notifications</span>
        <button class="btn-text-nav" onclick="window.markAllNotificationsRead()">Mark Read</button>
      </div>

      <!-- Segmented Filter -->
      <div class="segmented-control">
        <button class="segment-tab ${filter === 'all' ? 'active' : ''}" onclick="window.renderNotificationsScreen('all')">
          All (${notifications.length})
        </button>
        <button class="segment-tab ${filter === 'unread' ? 'active' : ''}" onclick="window.renderNotificationsScreen('unread')">
          Unread (${unreadCount})
        </button>
      </div>

      <!-- Notification List -->
      <div class="notifications-list-container">
        ${displayed.length === 0 ? `
          <div class="empty-state-card">
            <span class="empty-icon">🔔</span>
            <p>No notifications to display in this view.</p>
          </div>
        ` : displayed.map(notif => {
          let icon = '🔔';
          let borderClass = 'info';
          if (notif.type === 'alert') { icon = '🚨'; borderClass = 'critical'; }
          else if (notif.type === 'sos') { icon = '🚑'; borderClass = 'urgent'; }
          else if (notif.type === 'blood') { icon = '🩸'; borderClass = 'blood'; }
          else if (notif.type === 'resource') { icon = '📦'; borderClass = 'resource'; }
          else if (notif.type === 'incident') { icon = '📋'; borderClass = 'incident'; }

          return `
            <div class="notification-item ${!notif.read ? 'unread' : 'read'} type-${borderClass}" onclick="window.handleNotificationClick('${notif.id}', '${notif.targetView || 'home'}')">
              <div class="notif-icon-col">
                <span class="notif-type-icon">${icon}</span>
              </div>
              <div class="notif-content-col">
                <div class="notif-title-row">
                  <h4 class="notif-title">${notif.title}</h4>
                  ${!notif.read ? '<span class="unread-dot"></span>' : ''}
                </div>
                <p class="notif-message">${notif.message}</p>
                <div class="notif-footer-row">
                  <span class="notif-time">🕒 ${notif.timestamp}</span>
                  <span class="notif-action-tag">Open View →</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${notifications.length > 0 ? `
        <div class="clear-all-wrap">
          <button class="btn-clear-notifs" onclick="window.clearAllNotifications()">
            🗑️ Clear All Notifications
          </button>
        </div>
      ` : ''}
    </div>
  `;
};

window.handleNotificationClick = function(id, targetView) {
  window.CER_DB.update('notifications', id, { read: true });
  if (targetView) {
    window.CER_STATE.navigate(targetView);
  } else {
    window.renderNotificationsScreen();
  }
};

window.markAllNotificationsRead = function() {
  const notifs = window.CER_DB.getAll('notifications');
  notifs.forEach(n => { n.read = true; });
  window.CER_DB.setCollection('notifications', notifs);
  window.showToast('All notifications marked as read', 'info');
  window.renderNotificationsScreen();
};

window.clearAllNotifications = function() {
  window.CER_DB.setCollection('notifications', []);
  window.showToast('All notifications cleared', 'info');
  window.renderNotificationsScreen();
};
