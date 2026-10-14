/**
 * Community Emergency Response & Resource Management System
 * Main Application Controller & Router
 */

// Route mapping
const ROUTES = {
  'splash': () => window.renderSplashScreen(),
  'login': () => window.renderAuthScreen('login'),
  'register': () => window.renderAuthScreen('register'),
  'home': () => window.renderHomeScreen(),
  'sos': () => window.renderSosScreen(),
  'hospitals': () => window.renderHospitalsScreen(),
  'ambulances': () => window.renderAmbulancesScreen(),
  'blood-search': () => window.renderBloodScreen('search'),
  'blood-register': () => window.renderBloodScreen('register'),
  'volunteers': () => window.renderVolunteersScreen('register'),
  'resources': () => window.renderResourcesScreen(),
  'alerts': () => window.renderDisasterAlertsScreen(), // direct to disaster alerts
  'disaster-alerts': () => window.renderDisasterAlertsScreen(),
  'incident-report': () => window.renderIncidentReportScreen(),
  'incident-status': () => window.renderIncidentStatusScreen(),
  'profile': () => window.renderProfileScreen(),
  'notifications': () => window.renderNotificationsScreen(),
  'admin-dashboard': () => window.renderAdminDashboardScreen('overview'),
  'admin-incidents': () => window.renderAdminDashboardScreen('incidents'),
  'admin-alerts': () => window.renderAdminDashboardScreen('alerts'),
  'admin-volunteers': () => window.renderAdminDashboardScreen('volunteers')
};

// Global Toast System
window.showToast = function(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `app-toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  else if (type === 'warning') icon = '⚠️';
  else if (type === 'error') icon = '🚨';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// Global Modal System
window.showModal = function(htmlContent) {
  const overlay = document.getElementById('app-modal-overlay');
  const content = document.getElementById('app-modal-content');
  if (!overlay || !content) return;

  content.innerHTML = htmlContent;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  const overlay = document.getElementById('app-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Update status bar time
function startStatusBarClock() {
  const timeEl = document.getElementById('status-bar-clock');
  function updateTime() {
    if (timeEl) {
      const d = new Date();
      const h = d.getHours();
      const m = d.getMinutes().toString().padStart(2, '0');
      timeEl.textContent = `${h}:${m}`;
    }
  }
  updateTime();
  setInterval(updateTime, 10000);
}

// Update Bottom Navigation selection
function updateBottomNavigation(currentView) {
  const nav = document.getElementById('bottom-nav-bar');
  if (!nav) return;

  // Views that hide bottom nav
  const hideNavViews = ['splash', 'login', 'register'];
  if (hideNavViews.includes(currentView)) {
    nav.style.display = 'none';
    return;
  } else {
    nav.style.display = 'flex';
  }

  // Update active state on nav items
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.remove('active');
  });

  if (currentView === 'home') {
    document.getElementById('nav-item-home')?.classList.add('active');
  } else if (currentView === 'sos') {
    document.getElementById('nav-item-emergency')?.classList.add('active');
  } else if (['hospitals', 'ambulances', 'resources', 'blood-search', 'blood-register', 'volunteers'].includes(currentView)) {
    document.getElementById('nav-item-services')?.classList.add('active');
  } else if (currentView === 'alerts' || currentView === 'disaster-alerts') {
    document.getElementById('nav-item-alerts')?.classList.add('active');
  } else if (currentView === 'profile' || currentView.startsWith('admin')) {
    document.getElementById('nav-item-profile')?.classList.add('active');
  }
}

// Services Quick Sheet Popup
window.openServicesActionSheet = function() {
  window.showModal(`
    <div class="modal-card action-sheet-modal">
      <div class="modal-header">
        <div class="header-icon">📍</div>
        <div>
          <h3 class="title">Emergency Services</h3>
          <p class="subtitle">Quick access to medical, fleet & community relief</p>
        </div>
      </div>
      <div class="modal-body">
        <div class="services-sheet-grid">
          <div class="sheet-item disaster" style="background:#FEE2E2;" onclick="window.closeModal(); window.CER_STATE.navigate('disaster-alerts');">
            <span class="sheet-icon">🌊</span>
            <b style="color:#DC2626;">Disaster Alerts</b>
            <small>Floods, Quakes & Storms</small>
          </div>
          <div class="sheet-item hosp" onclick="window.closeModal(); window.CER_STATE.navigate('hospitals');">
            <span class="sheet-icon">🏥</span>
            <b>Nearby Hospitals</b>
            <small>Trauma & ICU Beds</small>
          </div>
          <div class="sheet-item amb" onclick="window.closeModal(); window.CER_STATE.navigate('ambulances');">
            <span class="sheet-icon">🚑</span>
            <b>Ambulances</b>
            <small>ALS & BLS Dispatch</small>
          </div>
          <div class="sheet-item blood" onclick="window.closeModal(); window.CER_STATE.navigate('blood-search');">
            <span class="sheet-icon">🩸</span>
            <b>Blood Donors</b>
            <small>Find or Donate</small>
          </div>
          <div class="sheet-item vol" onclick="window.closeModal(); window.CER_STATE.navigate('volunteers');">
            <span class="sheet-icon">🙋</span>
            <b>Volunteers</b>
            <small>Join Relief Teams</small>
          </div>
          <div class="sheet-item res" onclick="window.closeModal(); window.CER_STATE.navigate('resources');">
            <span class="sheet-icon">📦</span>
            <b>Resources</b>
            <small>Food, Water & Oxygen</small>
          </div>
          <div class="sheet-item rep" onclick="window.closeModal(); window.CER_STATE.navigate('incident-report');">
            <span class="sheet-icon">📝</span>
            <b>Report Incident</b>
            <small>Submit New Report</small>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-text" onclick="window.closeModal()">Close</button>
      </div>
    </div>
  `);
};

// Initial App Mount
window.addEventListener('DOMContentLoaded', () => {
  startStatusBarClock();

  // Watch for phone mockup frame toggle
  const shellEl = document.getElementById('device-shell-frame');
  const updateShellClass = (isMockup) => {
    if (shellEl) {
      if (isMockup) {
        shellEl.classList.add('mockup-mode');
        document.body.classList.add('body-mockup-bg');
      } else {
        shellEl.classList.remove('mockup-mode');
        document.body.classList.remove('body-mockup-bg');
      }
    }
  };
  updateShellClass(window.CER_STATE.get('isPhoneMockup'));
  window.CER_STATE.subscribe('isPhoneMockup', updateShellClass);

  // Subscribe to Route changes
  window.CER_STATE.subscribe('currentView', (viewName) => {
    updateBottomNavigation(viewName);
    const renderer = ROUTES[viewName] || ROUTES['home'];
    renderer();
    // Scroll to top
    const scroller = document.getElementById('view-scroll-area');
    if (scroller) scroller.scrollTop = 0;
  });

  // Close modal when clicking on overlay outside
  const modalOverlay = document.getElementById('app-modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        window.closeModal();
      }
    });
  }

  // Initial Route Load
  const initialView = window.CER_STATE.get('currentView') || 'splash';
  const initialRenderer = ROUTES[initialView] || ROUTES['splash'];
  updateBottomNavigation(initialView);
  initialRenderer();

  // Register Service Worker for Android PWA if available
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => {
      console.log('CER RMS PWA Service Worker Registered');
    }).catch(err => {
      console.log('Service Worker not registered in non-secure context or file protocol:', err);
    });
  }
});
