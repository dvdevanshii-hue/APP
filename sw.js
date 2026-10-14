/**
 * Service Worker for Offline Disaster Support & Caching
 */

const CACHE_NAME = 'cer-app-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/db.js',
  './js/state.js',
  './js/audio.js',
  './js/map.js',
  './js/app.js',
  './js/components/splash.js',
  './js/components/auth.js',
  './js/components/home.js',
  './js/components/sos.js',
  './js/components/hospitals.js',
  './js/components/ambulances.js',
  './js/components/blood.js',
  './js/components/volunteers.js',
  './js/components/resources.js',
  './js/components/alerts.js',
  './js/components/disaster_alerts.js',
  './js/components/incident_report.js',
  './js/components/incident_status.js',
  './js/components/profile.js',
  './js/components/notifications.js',
  './js/components/admin.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Cache addAll warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
