/**
 * Community Emergency Response & Resource Management System
 * App State Management
 */

class AppStateManager {
  constructor() {
    this.listeners = new Map();
    
    // Default current user
    const users = window.CER_DB.getAll('users');
    const savedUserId = localStorage.getItem('cerrms_current_user_id') || 'USR-1001';
    let currentUser = users.find(u => u.id === savedUserId) || users[0];
    
    // Fallback if none found
    if (!currentUser) {
      currentUser = {
        id: 'USR-1001',
        name: 'Rahul Sharma',
        email: 'citizen@example.com',
        phone: '+91 98765 43210',
        role: 'citizen',
        area: 'Rohini Sector 14, New Delhi',
        city: 'New Delhi',
        bloodGroup: 'O+',
        volunteerStatus: 'Volunteer Member',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
    }

    this.state = {
      currentUser: currentUser,
      userRole: currentUser.role || 'citizen',
      currentLocation: {
        lat: 28.7110,
        lng: 77.1235,
        address: 'Rohini Sector 14, New Delhi',
        accuracy: 12,
        isLiveGPS: false
      },
      currentView: 'splash', // start with splash
      previousView: 'home',
      activeSosId: null,
      theme: localStorage.getItem('cerrms_theme') || 'light',
      isPhoneMockup: localStorage.getItem('cerrms_phone_frame') === 'true', // Phone shell toggle
      activeFilters: {},
      selectedHospital: null,
      selectedIncident: null
    };

    // Apply saved theme immediately
    document.documentElement.setAttribute('data-theme', this.state.theme);
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
    this.notify(key, value);
  }

  update(updates) {
    Object.keys(updates).forEach(key => {
      this.state[key] = updates[key];
      this.notify(key, updates[key]);
    });
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }

  notify(key, value) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(cb => {
        try {
          cb(value, this.state);
        } catch (e) {
          console.error(`Error in state listener for ${key}:`, e);
        }
      });
    }
    // Also notify global wildcard listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => {
        try {
          cb(key, value, this.state);
        } catch (e) {
          console.error(`Error in wildcard listener:`, e);
        }
      });
    }
  }

  setUser(user) {
    this.state.currentUser = user;
    this.state.userRole = user.role;
    localStorage.setItem('cerrms_current_user_id', user.id);
    this.notify('currentUser', user);
    this.notify('userRole', user.role);
  }

  switchRole(role) {
    const users = window.CER_DB.getAll('users');
    const targetUser = users.find(u => u.role === role) || users[0];
    this.setUser(targetUser);
  }

  setTheme(theme) {
    this.state.theme = theme;
    localStorage.setItem('cerrms_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify('theme', theme);
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  togglePhoneMockup() {
    this.state.isPhoneMockup = !this.state.isPhoneMockup;
    localStorage.setItem('cerrms_phone_frame', this.state.isPhoneMockup);
    this.notify('isPhoneMockup', this.state.isPhoneMockup);
  }

  navigate(viewName, params = {}) {
    this.state.previousView = this.state.currentView;
    this.state.currentView = viewName;
    if (params) {
      Object.assign(this.state, params);
    }
    this.notify('currentView', viewName);
    window.scrollTo(0, 0);
  }

  goBack() {
    const prev = this.state.previousView || 'home';
    this.navigate(prev);
  }
}

// Global state instance
window.CER_STATE = new AppStateManager();
