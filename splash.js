/**
 * Splash Screen Component
 * Emergency pulse animation, brand name, and automatic transition
 */

window.renderSplashScreen = function() {
  const container = document.getElementById('view-container');
  if (!container) return;

  container.innerHTML = `
    <div class="splash-screen-wrapper">
      <div class="splash-content">
        <!-- Emergency Pulse Radar & Icon -->
        <div class="splash-logo-container">
          <div class="pulse-ring ring-1"></div>
          <div class="pulse-ring ring-2"></div>
          <div class="pulse-ring ring-3"></div>
          <div class="splash-logo-circle">
            <span class="splash-icon">🚨</span>
          </div>
        </div>

        <!-- App Branding -->
        <div class="splash-text-container">
          <h1 class="splash-title">Community Emergency<br><span class="accent-text">Response</span></h1>
          <p class="splash-subtitle">Connect. Respond. Save.</p>
          <div class="prototype-badge">⚠️ PROTOTYPE SIMULATION SYSTEM</div>
        </div>

        <!-- Loading Progress & Heartbeat line -->
        <div class="splash-loader-container">
          <div class="heartbeat-line">
            <svg viewBox="0 0 300 40" class="ecg-svg">
              <path class="ecg-path" d="M0,20 L80,20 L90,5 L100,35 L110,20 L130,20 L140,0 L150,40 L160,20 L300,20" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" />
            </svg>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" id="splash-progress"></div>
          </div>
          <span class="loading-label">Connecting emergency mesh network...</span>
        </div>

        <button class="btn-skip-splash" onclick="window.finishSplashScreen()">
          Skip to App →
        </button>
      </div>
    </div>
  `;

  // Start progress bar animation and timeout
  const progressBar = document.getElementById('splash-progress');
  if (progressBar) {
    progressBar.style.width = '0%';
    setTimeout(() => { if (progressBar) progressBar.style.width = '100%'; }, 100);
  }

  // Auto transition after 3.2 seconds
  window.splashTimeout = setTimeout(() => {
    window.finishSplashScreen();
  }, 3200);
};

window.finishSplashScreen = function() {
  if (window.splashTimeout) {
    clearTimeout(window.splashTimeout);
    window.splashTimeout = null;
  }
  const currentUser = window.CER_STATE.get('currentUser');
  if (currentUser) {
    window.CER_STATE.navigate('home');
  } else {
    window.CER_STATE.navigate('login');
  }
};
