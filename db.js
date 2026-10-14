/**
 * Community Emergency Response & Resource Management System
 * Client Database & State Store with SQL-Backed Authentication Engine
 */

const STORAGE_KEY_PREFIX = 'cerrms_db_';

const DEFAULT_OPERATIONAL_DATA = {
  hospitals: [
    {
      id: 'HOSP-101',
      name: 'AIIMS Trauma & Emergency Center',
      type: 'Government',
      address: 'Sri Aurobindo Marg, Ansari Nagar East',
      area: 'Ansari Nagar, New Delhi',
      phone: '011-26588500',
      emergencyPhone: '011-26593677',
      lat: 28.5672,
      lng: 77.2100,
      emergency24x7: true,
      icuBeds: 28,
      totalBeds: 450,
      bloodBank: true,
      traumaLevel: 'Level 1 Trauma Center',
      status: 'Open 24/7',
      rating: 4.8
    },
    {
      id: 'HOSP-102',
      name: 'Safdarjung Emergency & Super Speciality',
      type: 'Government',
      address: 'Ring Road, Opposite AIIMS',
      area: 'Safdarjung, New Delhi',
      phone: '011-26165060',
      emergencyPhone: '102',
      lat: 28.5701,
      lng: 77.2064,
      emergency24x7: true,
      icuBeds: 18,
      totalBeds: 320,
      bloodBank: true,
      traumaLevel: 'Level 1 Trauma Center',
      status: 'Open 24/7',
      rating: 4.5
    },
    {
      id: 'HOSP-103',
      name: 'Fortis Escorts Heart & Emergency Institute',
      type: 'Private',
      address: 'Okhla Road, Sukhdev Vihar Metro Station',
      area: 'Okhla, New Delhi',
      phone: '011-47135000',
      emergencyPhone: '011-105010',
      lat: 28.5606,
      lng: 77.2805,
      emergency24x7: true,
      icuBeds: 14,
      totalBeds: 210,
      bloodBank: true,
      traumaLevel: 'Level 2 Emergency',
      status: 'Open 24/7',
      rating: 4.7
    },
    {
      id: 'HOSP-104',
      name: 'Max Super Speciality Hospital',
      type: 'Private',
      address: '1, 2, Press Enclave Marg, Saket',
      area: 'Saket, New Delhi',
      phone: '011-26515050',
      emergencyPhone: '011-40554055',
      lat: 28.5282,
      lng: 77.2117,
      emergency24x7: true,
      icuBeds: 22,
      totalBeds: 280,
      bloodBank: true,
      traumaLevel: 'Level 1 Trauma Center',
      status: 'Open 24/7',
      rating: 4.6
    },
    {
      id: 'HOSP-105',
      name: 'Sir Ganga Ram Emergency Care Hospital',
      type: 'Private Trust',
      address: 'Sir Ganga Ram Hospital Marg, Rajinder Nagar',
      area: 'Rajinder Nagar, New Delhi',
      phone: '011-25750000',
      emergencyPhone: '011-42251000',
      lat: 28.6385,
      lng: 77.1895,
      emergency24x7: true,
      icuBeds: 16,
      totalBeds: 350,
      bloodBank: true,
      traumaLevel: 'Level 2 Emergency',
      status: 'Open 24/7',
      rating: 4.6
    }
  ],

  ambulances: [
    {
      id: 'AMB-101',
      name: 'Rapid Response ACLS Unit #01',
      type: 'Advanced Cardiac Life Support (ACLS)',
      hospitalName: 'AIIMS Emergency Wing',
      phone: '+91 98100 11223',
      lat: 28.5720,
      lng: 77.2150,
      status: 'Available',
      equipment: ['Ventilator', 'Defibrillator', 'Oxygen', 'Infusion Pump', 'Trauma Kit'],
      driverName: 'Harish Verma',
      vehicleNo: 'DL 1C AB 4421'
    },
    {
      id: 'AMB-102',
      name: 'BLS City Ambulance Unit #04',
      type: 'Basic Life Support (BLS)',
      hospitalName: 'Safdarjung Hospital',
      phone: '+91 98100 22334',
      lat: 28.5650,
      lng: 77.1980,
      status: 'Available',
      equipment: ['Oxygen', 'First Aid Spine Board', 'Splints', 'Stretcher'],
      driverName: 'Rajinder Kumar',
      vehicleNo: 'DL 1T 5589'
    },
    {
      id: 'AMB-103',
      name: 'Neonatal & Critical Transport Unit #07',
      type: 'Neonatal Critical Care',
      hospitalName: 'Max Healthcare Saket',
      phone: '+91 98100 33445',
      lat: 28.5320,
      lng: 77.2180,
      status: 'Busy',
      equipment: ['Incubator', 'Pediatric Monitor', 'Infusion Support'],
      driverName: 'Mohd. Salim',
      vehicleNo: 'DL 2C CD 9912'
    },
    {
      id: 'AMB-104',
      name: 'Paramedic Quick Response Unit #09',
      type: 'Advanced Life Support',
      hospitalName: 'Fortis Hospital Okhla',
      phone: '+91 98100 44556',
      lat: 28.5550,
      lng: 77.2750,
      status: 'Available',
      equipment: ['ECG Monitor', 'Defibrillator', 'Oxygen', 'Extraction Kit'],
      driverName: 'Sanjay Mehra',
      vehicleNo: 'DL 1C EF 1042'
    }
  ],

  blood_donors: [
    {
      id: 'DON-201',
      name: 'Vikas Malhotra',
      bloodGroup: 'O+',
      phone: '+91 98711 22334',
      city: 'New Delhi',
      area: 'Rohini Sector 9',
      availability: 'Available',
      lastDonationDate: '2025-11-15',
      healthConfirmed: true,
      donationsCount: 6
    },
    {
      id: 'DON-202',
      name: 'Pooja Verma',
      bloodGroup: 'A+',
      phone: '+91 98722 33445',
      city: 'New Delhi',
      area: 'Saket Enclave',
      availability: 'Available',
      lastDonationDate: '2025-12-02',
      healthConfirmed: true,
      donationsCount: 4
    },
    {
      id: 'DON-203',
      name: 'Amitabh Sengupta',
      bloodGroup: 'B+',
      phone: '+91 98733 44556',
      city: 'New Delhi',
      area: 'Connaught Place',
      availability: 'Available',
      lastDonationDate: '2026-01-10',
      healthConfirmed: true,
      donationsCount: 12
    },
    {
      id: 'DON-204',
      name: 'Fatima Sheikh',
      bloodGroup: 'O-',
      phone: '+91 98744 55667',
      city: 'New Delhi',
      area: 'Lajpat Nagar IV',
      availability: 'Available',
      lastDonationDate: '2025-10-20',
      healthConfirmed: true,
      donationsCount: 8
    },
    {
      id: 'DON-205',
      name: 'Gurpreet Singh',
      bloodGroup: 'AB+',
      phone: '+91 98755 66778',
      city: 'New Delhi',
      area: 'Rajouri Garden',
      availability: 'Recently Donated',
      lastDonationDate: '2026-02-14',
      healthConfirmed: true,
      donationsCount: 3
    }
  ],

  volunteers: [
    {
      id: 'VOL-301',
      name: 'Rohan Gupta',
      phone: '+91 98912 34567',
      email: 'rohan.firstaid@gmail.com',
      area: 'Rohini & Pitampura, North Delhi',
      skills: ['First Aid Certified', 'CPR', 'Stretcher Handling'],
      category: 'First Aid',
      availability: 'Ready for Dispatch',
      experience: 'Red Cross Volunteer with 3 years emergency experience',
      status: 'Active Member'
    },
    {
      id: 'VOL-302',
      name: 'Dr. Shruti Nair',
      phone: '+91 98923 45678',
      email: 'shruti.md@gmail.com',
      area: 'South Delhi & Hauz Khas',
      skills: ['Emergency Triage', 'Trauma Assessment', 'IV Administration'],
      category: 'Medical',
      availability: 'On Call (Evening)',
      experience: 'Resident Doctor & Disaster Triage Specialist',
      status: 'Active Member'
    },
    {
      id: 'VOL-303',
      name: 'Manpreet Sodhi',
      phone: '+91 98934 56789',
      email: 'manpreet.transport@gmail.com',
      area: 'Saket & Mehrauli',
      skills: ['4x4 Vehicle Offroad Driving', 'Equipment Transport'],
      category: 'Transportation',
      availability: 'Ready for Dispatch',
      experience: 'All-terrain vehicle owner for relief material transfer',
      status: 'Active Member'
    },
    {
      id: 'VOL-304',
      name: 'Priyanka Sen',
      phone: '+91 98945 67890',
      email: 'priyanka.relief@gmail.com',
      area: 'Central Delhi & Civil Lines',
      skills: ['Food Logistics', 'Shelter Management', 'Crowd Guidance'],
      category: 'Food Distribution',
      availability: 'Ready for Dispatch',
      experience: 'Community food kitchen coordinator during floods',
      status: 'Active Member'
    }
  ],

  resources: [
    {
      id: 'RES-401',
      name: 'O- Negative Blood Units (Universal Donor)',
      category: 'Blood Units',
      quantity: 14,
      unit: 'Bags (350ml)',
      location: 'Central Red Cross Blood Bank, Connaught Place',
      lastUpdated: '10 mins ago',
      status: 'Limited',
      threshold: 20,
      notes: 'Critical reserve reserved for emergency surgery patients'
    },
    {
      id: 'RES-402',
      name: 'O+ Positive Blood Units',
      category: 'Blood Units',
      quantity: 48,
      unit: 'Bags (350ml)',
      location: 'AIIMS Blood Bank, Ansari Nagar',
      lastUpdated: '15 mins ago',
      status: 'Available',
      threshold: 30,
      notes: 'Adequate stock available for immediate emergency requests'
    },
    {
      id: 'RES-403',
      name: 'Ready-to-Eat Emergency Food Rations',
      category: 'Food Rations',
      quantity: 1200,
      unit: 'Meal Packs',
      location: 'Disaster Relief Logistics Center, Rohini',
      lastUpdated: '1 hour ago',
      status: 'Available',
      threshold: 500,
      notes: 'Nutrient-dense meal packs with self-heating elements'
    },
    {
      id: 'RES-404',
      name: 'Packaged Drinking Water (1L Bottles)',
      category: 'Water',
      quantity: 3400,
      unit: 'Bottles',
      location: 'Civil Defence Relief Warehouse, Okhla',
      lastUpdated: '45 mins ago',
      status: 'Available',
      threshold: 1000,
      notes: 'Stored in temperature-controlled hygienic facility'
    },
    {
      id: 'RES-405',
      name: 'Thermal Emergency Foil Blankets',
      category: 'Blankets',
      quantity: 650,
      unit: 'Pieces',
      location: 'Disaster Relief Logistics Center, Rohini',
      lastUpdated: '2 hours ago',
      status: 'Available',
      threshold: 200,
      notes: 'Reflective insulation blankets for cold wave and shock management'
    },
    {
      id: 'RES-406',
      name: 'Medical Oxygen Cylinders (D-Type 46L)',
      category: 'Oxygen',
      quantity: 85,
      unit: 'Cylinders',
      location: 'Gas Supply Depot, Okhla Industrial Area',
      lastUpdated: '25 mins ago',
      status: 'Available',
      threshold: 30,
      notes: 'Tested and certified cylinders with dual flow regulators'
    }
  ],

  alerts: [
    {
      id: 'DIS-101',
      disasterType: 'Flood',
      disasterIcon: '🌊',
      title: '🌊 FLOOD WARNING: Yamuna River Inundation Alert',
      severity: 'Critical',
      affectedArea: 'Delhi (Yamuna River Catchment & Low-lying Civil Lines Zones)',
      date: 'Today, 11:30 AM',
      description: 'Heavy rainfall upstream has caused water levels to surge 1.4 meters above danger mark. Severe waterlogging reported across arterial roadways.',
      safetyInstructions: [
        'Avoid flooded roads – Turn Around, Don\'t Drown!',
        'Move to a safe/high location or designated relief shelter immediately',
        'Keep emergency supplies, food rations, and medical kits ready',
        'Turn off main electrical breakers and gas supply if water enters premises',
        'Follow official emergency civil protection instructions'
      ],
      status: 'Active Warning',
      nearbyResources: [
        'Safe Evacuation Camp #2 (Civil Lines, 1.1 km)',
        'NDRF Flood Boat Squad #4 (Ring Road Post)',
        'AIIMS Trauma Emergency Hospital (3.2 km)'
      ],
      isDemo: true,
      active: true,
      issuedBy: 'State Disaster Management Authority (SDMA)'
    },
    {
      id: 'DIS-102',
      disasterType: 'Earthquake',
      disasterIcon: '🌍',
      title: '🌍 6.2 MAGNITUDE EARTHQUAKE SHOCKWAVE ALERT',
      severity: 'High',
      affectedArea: 'Delhi NCR & Himalayan Foothills Seismic Corridor',
      date: 'Today, 10:45 AM',
      description: 'Shallow focal depth seismic tremor felt across Delhi NCR. Structural inspections underway on major flyovers.',
      safetyInstructions: [
        'DROP, COVER, and HOLD ON immediately under sturdy furniture',
        'Stay away from glass windows, exterior brick walls, and hanging fixtures',
        'If outdoors, move into an open area away from power lines and flyovers',
        'Do NOT use elevators; check for gas leaks before lighting matches or switches'
      ],
      status: 'Active Warning',
      nearbyResources: [
        'Open Ground Evacuation Zone (Talkatora Stadium, 1.8 km)',
        'Mobile Trauma Triage Unit #3 (RML Hospital)'
      ],
      isDemo: true,
      active: true,
      issuedBy: 'National Center for Seismology (NCS)'
    }
  ],

  incidents: [
    {
      id: 'INC-2026-9042',
      type: 'Accident',
      category: 'Accident',
      title: 'Multi-Vehicle Collision with Trapped Passengers',
      description: 'Three cars involved in pileup near Rohini Sector 14 flyover. Paramedics and rescue teams dispatched.',
      location: 'Outer Ring Road, Near Rohini Flyover',
      lat: 28.7110,
      lng: 77.1235,
      reportedBy: 'Rahul Sharma',
      reportedByPhone: '+91 98765 43210',
      reportedAt: 'Today, 12:15 PM',
      severity: 'High',
      status: 'In Progress',
      photoUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop&q=80',
      assignedVolunteerId: 'VOL-301',
      assignedVolunteerName: 'Rohan Gupta (First Aid)',
      adminNotes: 'Ambulance AMB-101 dispatched at 12:18 PM. Traffic police cleared emergency lane.',
      timeline: [
        { time: '12:15 PM', text: 'Incident reported by citizen via mobile app.' },
        { time: '12:17 PM', text: 'Incident validated and assigned to Rapid Response Team.' },
        { time: '12:18 PM', text: 'Ambulance AMB-101 en route.' }
      ]
    }
  ],

  notifications: [
    {
      id: 'NOTIF-601',
      title: '⚠️ Flash Flood Alert Issued for Your Area',
      message: 'Yamuna flood warning issued for low-lying zones. Check emergency guidelines.',
      type: 'alert',
      timestamp: '15 mins ago',
      read: false,
      targetView: 'alerts'
    },
    {
      id: 'NOTIF-602',
      title: '🚑 Ambulance Request Confirmed',
      message: 'Ambulance AMB-101 has acknowledged dispatch order for incident #INC-2026-9042.',
      type: 'sos',
      timestamp: '30 mins ago',
      read: false,
      targetView: 'incident-status'
    }
  ],

  sos_requests: []
};

class DatabaseManager {
  constructor() {
    this.init();
    this.syncUsersFromSQL();
  }

  init() {
    Object.keys(DEFAULT_OPERATIONAL_DATA).forEach(key => {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
      if (!stored) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(DEFAULT_OPERATIONAL_DATA[key]));
      }
    });
  }

  // Sync users from the SQL database
  async syncUsersFromSQL() {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users) {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(data.users));
        }
      }
    } catch (e) {
      console.warn('SQL Auth sync error:', e);
    }
  }

  getCollection(name) {
    try {
      const key = (name === 'bloodDonors' ? 'blood_donors' : (name === 'sosRequests' ? 'sos_requests' : (name === 'disasterAlerts' ? 'alerts' : name)));
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
      return data ? JSON.parse(data) : (DEFAULT_OPERATIONAL_DATA[key] || []);
    } catch (e) {
      return DEFAULT_OPERATIONAL_DATA[name] || [];
    }
  }

  setCollection(name, items) {
    try {
      const key = (name === 'bloodDonors' ? 'blood_donors' : (name === 'sosRequests' ? 'sos_requests' : (name === 'disasterAlerts' ? 'alerts' : name)));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(items));
      return true;
    } catch (e) {
      return false;
    }
  }

  getAll(collection) {
    return this.getCollection(collection);
  }

  getById(collection, id) {
    const items = this.getCollection(collection);
    return items.find(item => item.id === id) || null;
  }

  insert(collection, item) {
    const items = this.getCollection(collection);
    if (!item.id) {
      const prefix = collection.substring(0, 3).toUpperCase();
      item.id = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    items.unshift(item);
    this.setCollection(collection, items);
    return item;
  }

  update(collection, id, updates) {
    const items = this.getCollection(collection);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.setCollection(collection, items);
      return items[index];
    }
    return null;
  }

  delete(collection, id) {
    const items = this.getCollection(collection);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length !== items.length) {
      this.setCollection(collection, filtered);
      return true;
    }
    return false;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 1.5;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }
}

// Global Disaster Definitions & Safety Templates
window.DISASTER_DEFINITIONS = [
  { type: 'Flood', icon: '🌊', label: 'Flood', defaultSev: 'High' },
  { type: 'Tsunami', icon: '🌊', label: 'Tsunami', defaultSev: 'Critical' },
  { type: 'Landslide', icon: '⛰️', label: 'Landslide', defaultSev: 'High' },
  { type: 'Earthquake', icon: '🌍', label: 'Earthquake', defaultSev: 'Critical' },
  { type: 'Cyclone', icon: '🌪️', label: 'Cyclone', defaultSev: 'Critical' },
  { type: 'Wildfire', icon: '🔥', label: 'Wildfire', defaultSev: 'High' },
  { type: 'Severe Storm', icon: '⛈️', label: 'Severe Storm', defaultSev: 'Medium' },
  { type: 'Heavy Rainfall', icon: '🌧️', label: 'Heavy Rainfall', defaultSev: 'High' },
  { type: 'Extreme Weather', icon: '🌨️', label: 'Extreme Weather', defaultSev: 'Medium' },
  { type: 'Fire', icon: '🔥', label: 'Fire', defaultSev: 'High' },
  { type: 'Other Emergency', icon: '⚠️', label: 'Other Emergency', defaultSev: 'Medium' }
];

window.DISASTER_SAFETY_TEMPLATES = {
  'Flood': [
    'Avoid flooded roads – Turn Around, Don\'t Drown!',
    'Move to a safe/high location or designated relief shelter immediately',
    'Keep emergency supplies, food rations, and medical kits ready',
    'Turn off main electrical breakers and gas supplies before water enters premises',
    'Follow official emergency civil protection instructions'
  ],
  'Tsunami': [
    'Immediately move inland to elevated ground (at least 100 feet above sea level)',
    'Never go down to the coast or harbor to inspect receding shorelines',
    'Stay clear of coastal rivers, estuaries, and beachfront corridors',
    'Remain in designated high-ground shelters until official all-clear is broadcast'
  ],
  'Landslide': [
    'Evacuate slope-adjacent structures and river valleys immediately',
    'Watch for sudden increases or decreases in stream water flow or muddy torrents',
    'Listen for unusual rumbling sounds, cracking trees, or falling boulders',
    'Do NOT cross road sections covered in mud, rock debris, or sliding earth'
  ],
  'Earthquake': [
    'DROP, COVER, and HOLD ON immediately under sturdy furniture',
    'Stay away from glass windows, exterior brick walls, and hanging fixtures',
    'If outdoors, move into an open area away from buildings, power lines, and flyovers',
    'Do NOT use elevators; check for gas leaks before using switches or open flames',
    'Prepare for potential aftershocks over the next 24 to 48 hours'
  ],
  'Cyclone': [
    'Secure exterior doors, roofs, and window storm shutters immediately',
    'Shelter in a small, windowless interior room on the lowest floor',
    'Unplug major appliances; keep battery-operated emergency radios tuned',
    'Beware of the calm eye of the storm; ferocious winds will resume from opposite direction'
  ],
  'Wildfire': [
    'Evacuate immediately if instructed by civil protection or fire authorities',
    'Keep all doors, windows, and attic vents shut to block flying embers',
    'Wear N95 masks or damp cloth to filter dangerous smoke particles',
    'Clear dry leaves, wooden patio furniture, and brush away from home walls'
  ],
  'Severe Storm': [
    'Remain indoors away from windows, skylights, and electrical appliances',
    'Do NOT seek shelter under isolated trees, metal towers, or billboards',
    'Unplug sensitive electronic devices to prevent voltage surge damage',
    'Avoid contact with plumbing fixtures and metal railings during lightning'
  ],
  'Heavy Rainfall': [
    'Avoid submerged underpasses, open stormwater drains, and low-lying transit lanes',
    'Drive slowly and maintain wide following distances; watch for open manholes',
    'Keep emergency battery lights and mobile power banks fully charged',
    'Report open electrical junction boxes or fallen wires immediately'
  ],
  'Extreme Weather': [
    'Limit outdoor exposure during extreme temperature spikes or severe frost',
    'Use low-beam fog headlights and hazard flashers when operating vehicles',
    'Check on elderly, homeless, and vulnerable neighbors in unheated rooms',
    'Ensure safe ventilation if using gas heaters or coal braziers'
  ],
  'Fire': [
    'Evacuate premises immediately via designated fire exit stairs – NEVER use elevators',
    'Crawl low under smoke where air is cleaner and cooler',
    'Feel doors with back of hand before opening; if hot, choose alternate exit',
    'Call 101 or 112 as soon as you reach a safe outdoor assembly area'
  ],
  'Other Emergency': [
    'Follow official public guidance issued by civil defense and emergency responders',
    'Keep telephone lines open for emergency traffic and distress calls only',
    'Have your emergency grab-and-go kit ready with essential documents and medicines',
    'Avoid spreading unverified rumors on social media'
  ]
};

window.CER_DB = new DatabaseManager();
