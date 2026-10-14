/**
 * Comprehensive Automated Test Suite
 * Validates DB schemas, Natural Disasters & Crisis Alerts, state management, distance formula, and business logic
 */

const assert = require('node:assert');

// Mock localStorage and window for headless node testing
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

global.window = {
  AudioContext: class {
    createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, disconnect: () => {} }; }
    createOscillator() { return { frequency: { setValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {}, disconnect: () => {} }; }
    get currentTime() { return 0; }
  },
  location: { href: 'http://localhost:3000' }
};

global.document = {
  documentElement: { setAttribute: () => {} }
};

// Load modules
require('./js/db.js');
require('./js/state.js');
require('./js/audio.js');

console.log('--- RUNNING TEST SUITE ---');

// Test 1: DB Initialization & Collections
console.log('Test 1: Verify Seed Collections...');
const collections = ['users', 'hospitals', 'ambulances', 'blood_donors', 'volunteers', 'resources', 'alerts', 'incidents', 'notifications', 'sos_requests'];
collections.forEach(col => {
  const items = window.CER_DB.getAll(col);
  assert(Array.isArray(items) && items.length > 0, `Collection ${col} should have seed data`);
  console.log(`  ✓ Collection '${col}' loaded: ${items.length} items`);
});

// Test 2: Haversine Distance Calculation
console.log('Test 2: Distance Calculation...');
const d1 = window.CER_DB.calculateDistance(28.7110, 77.1235, 28.5672, 77.2100);
assert(d1 > 15 && d1 < 25, `Distance between Rohini and AIIMS should be ~18-20km, got ${d1}`);
console.log(`  ✓ Distance calculated: ${d1} km`);

// Test 3: State Management & Role Switching
console.log('Test 3: State & Roles...');
assert.strictEqual(window.CER_STATE.get('userRole'), 'citizen');
window.CER_STATE.switchRole('admin');
assert.strictEqual(window.CER_STATE.get('userRole'), 'admin');
assert.strictEqual(window.CER_STATE.get('currentUser').role, 'admin');
console.log(`  ✓ Role switch to admin verified: ${window.CER_STATE.get('currentUser').name}`);

// Test 4: CRUD Insertion & Retrieval
console.log('Test 4: CRUD Operations...');
const testIncident = {
  id: 'INC-TEST-1',
  type: 'Fire',
  title: 'Test Fire Incident',
  location: 'Test Location',
  severity: 'Critical',
  status: 'Reported'
};
window.CER_DB.insert('incidents', testIncident);
const fetched = window.CER_DB.getById('incidents', 'INC-TEST-1');
assert.strictEqual(fetched.title, 'Test Fire Incident');

window.CER_DB.update('incidents', 'INC-TEST-1', { status: 'In Progress' });
assert.strictEqual(window.CER_DB.getById('incidents', 'INC-TEST-1').status, 'In Progress');

window.CER_DB.delete('incidents', 'INC-TEST-1');
assert.strictEqual(window.CER_DB.getById('incidents', 'INC-TEST-1'), null);
console.log('  ✓ Insert, Update, GetById, Delete all passed');

// Test 5: Audio Siren Synthesis Engine
console.log('Test 5: Audio Engine...');
window.CER_AUDIO.startEmergencySiren();
assert.strictEqual(window.CER_AUDIO.isSirenPlaying, true);
window.CER_AUDIO.stopEmergencySiren();
console.log('  ✓ Audio siren start & stop executed cleanly');

// Test 6: Natural Disasters & Crisis Alerts Module Coverage
console.log('Test 6: Natural Disaster Types & Safety Protocol Templates...');
const requiredDisasters = [
  'Flood', 'Tsunami', 'Landslide', 'Earthquake', 'Cyclone',
  'Wildfire', 'Severe Storm', 'Heavy Rainfall', 'Extreme Weather',
  'Fire', 'Other Emergency'
];

const alerts = window.CER_DB.getAll('alerts');
requiredDisasters.forEach(dtype => {
  const matching = alerts.find(a => a.disasterType === dtype);
  assert(matching, `Database must contain seed alert for disaster type: ${dtype}`);
  assert(matching.severity, `Disaster ${dtype} must have severity rating`);
  assert(matching.affectedArea, `Disaster ${dtype} must have affected area`);
  assert(matching.safetyInstructions && matching.safetyInstructions.length > 0, `Disaster ${dtype} must have safety instructions`);
  assert(matching.status, `Disaster ${dtype} must have status`);
  assert(matching.nearbyResources && matching.nearbyResources.length > 0, `Disaster ${dtype} must list nearby emergency resources`);
  console.log(`  ✓ Disaster '${dtype}' validated: ${matching.title} [Status: ${matching.status}]`);
});

// Test 7: Safety Instruction Templates Integrity
console.log('Test 7: Verify Domain Safety Templates for all Disasters...');
requiredDisasters.forEach(dtype => {
  const template = window.DISASTER_SAFETY_TEMPLATES[dtype];
  assert(Array.isArray(template) && template.length >= 3, `Safety template for ${dtype} must contain detailed instructions`);
});
console.log('  ✓ All 11 disaster safety instruction templates verified');

console.log('\n=========================================');
console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! (7/7)');
console.log('=========================================\n');
