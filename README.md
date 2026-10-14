# 🚨 Community Emergency Response & Resource Management System (CER RMS)

An emergency-first mobile Android application designed to empower citizens and disaster relief coordinators during crises by connecting them with nearby hospitals, real-time ambulances, verified blood donors, community volunteers, and emergency relief resources.

---

## 📱 Mobile-First Architecture & Design Principles

- **Mobile-First Android Interface**: Clean, modern Material Design 3 aesthetic with generous touch targets (>= 48px), high-contrast emergency tokens, and readable typography.
- **Color Coding**:
  - 🔴 **Red (`#DC2626`)**: Critical Emergency SOS, high threats & immediate dispatch actions.
  - 🟠 **Orange (`#EA580C`)**: Warnings, incident reports & moderate advisories.
  - 🟢 **Green (`#16A34A`)**: Safe statuses, available ambulances, verified donor availability.
  - 🔵 **Blue (`#2563EB`)**: Hospital navigation, verified information & system notices.
  - ⚪ **Slate/Zinc Neutral**: Clean readable layouts without visual clutter.
- **Prototype Simulation Notice**: Clearly alerts users that this system operates in safe simulation mode unless production emergency APIs are integrated. Direct one-tap speed dialers are linked to national emergency numbers (`112`, `102`, `101`, `1077`).
- **Resilient Dual Mapping Engine**:
  - **Leaflet OpenStreetMap**: Interactive map with customizable markers when online.
  - **Tactical SVG Radar Map**: Automatic fallback that renders interactive radar nodes, concentric range rings, and GPS coordinate tracking completely offline.
- **Synthesized Audio Emergency Siren**: Uses the native Web Audio API (zero audio file dependencies) to generate authentic siren acoustics upon SOS activation.

---

## 🚀 Live Demo & How to Run

### Option 1: Run Local Web Server (Instant)
The project comes with a zero-dependency Node.js HTTP server:

```powershell
# In the project directory:
node server.js
```
Open **`http://localhost:3000`** in Google Chrome or Microsoft Edge.

### Option 2: Install as Android PWA
1. Open the URL in Google Chrome on your Android smartphone.
2. Tap the Chrome menu (`⋮`) and select **"Add to Home screen"** or **"Install App"**.
3. The app installs as a standalone Android app with full offline support via `sw.js` and `manifest.json`.

### Option 3: Compile Native Android APK (Android Studio)
The repository contains an Android Studio project in the `android/` directory:
1. Open Android Studio and choose **"Open an existing Android Studio Project"**.
2. Select the `android/` directory.
3. Place the web assets in `android/app/src/main/assets/www/`.
4. Run `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

---

## 👥 User Roles & Quick Credentials

| Role | Demo User | Email / Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Citizen** | Rahul Sharma | `citizen@example.com` / `password123` | Trigger Emergency SOS, locate hospitals & ambulances, search blood donors, register as donor/volunteer, report incidents & track status |
| **Admin** | Dr. Anita Roy (Incident Commander) | `admin@emergency.gov` / `adminpassword` | Full Command Center access, incident triage & responder assignment, broadcast public emergency alerts, adjust relief resource stocks |

*Tip: Use the **"⚡ Quick Demo Login"** buttons on the Login screen or switch roles anytime via the Profile screen.*

---

## 📋 Comprehensive Feature Walkthrough

### 1. Splash Screen
- Emergency pulse radar animation with pulsating glow rings.
- Dynamic ECG heartbeat wave SVG animation.
- Brand Title: *"Community Emergency Response"*, Subtitle: *"Connect. Respond. Save."*
- Smooth 3-second auto-transition to Home or Login with an instant **"Skip"** button.

### 2. Authentication & Registration
- Form validation for Email, Password, Name, Phone, City, and Blood Group.
- Two distinct user roles: **Citizen** and **Admin**.
- Password reset simulation dialog.
- Terms & Emergency Privacy acknowledgment checkbox.

### 3. Home Dashboard
- Mobile app header with user avatar, greeting, role badge, and notification bell with unread badge counter.
- **Prominent Emergency SOS Button**: Glowing tactile button with pulsing rings.
- Current location tracker with one-tap location customization.
- Critical Alert banner with live flashing beacon.
- 7 Core Feature cards:
  - 🏥 **Nearby Hospitals** (distance, ICU beds)
  - 🚑 **Ambulance Locator** (real-time availability)
  - 🩸 **Blood Donors** (search & compatibility)
  - 🙋 **Volunteers** (join relief corps)
  - 📦 **Resources** (inventory status)
  - 📢 **Emergency Alerts** (weather & disaster feeds)
  - 📝 **Report Incident** (photo upload & GPS)
- Direct speed-dial buttons for national helplines: **112** (Unified), **102** (Ambulance), **101** (Fire), **1077** (Disaster Control).
- Bottom Navigation bar with active state indicator pills.

### 4. Dedicated Emergency SOS
- Large tactile trigger with safety confirmation dialog: *"Are you sure you want to activate Emergency SOS?"*
- Upon activation:
  - Captures high-accuracy GPS coordinates and reverse-geocoded address.
  - Generates unique Tracking ID (e.g. `SOS-94821`).
  - Synthesizes wailing emergency siren audio.
  - Automatically identifies nearest trauma hospitals and available ambulances.
  - Clearly displays prototype notice: *"SOS request registered successfully."*
  - Provides a safe **"Cancel Emergency SOS"** action with confirmation.

### 5. Nearby Hospitals Locator
- Interactive map view displaying user position and surrounding medical facilities.
- Dynamic distance calculation using the Haversine formula based on user coordinates.
- Filters: **All**, **Government**, **Private**, **ICU Available**, **Blood Bank**.
- Details include available ICU beds, trauma rating, 24/7 emergency status, direct phone dialer, and one-tap Google Maps turn-by-turn navigation.

### 6. Ambulance Locator
- Live fleet status tracker: 🟢 **Available**, 🔴 **Busy**, ⚪ **Offline**.
- Units categorized by **ALS (Advanced Life Support)**, **BLS (Basic Life Support)**, and Patient Transport.
- Shows crew names, onboard equipment (Defibrillators, Ventilators, Medical Oxygen), and estimated arrival time (ETA).
- **"Request Dispatch"** button with simulated responder assignment.

### 7 & 8. Blood Donor Registration & Privacy-Protected Search
- **Registration**: Full name, blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), availability toggle, last donation date, and health eligibility checklist.
- **Search**: Multi-filter by blood group, city/area, and availability.
- **Strict Privacy Protection (Requirement #8 & #22)**:
  - Exact phone numbers and street addresses are **never** exposed to the public.
  - Users send anonymous in-app blood requests that notify donors securely without disclosing private information.

### 9. Volunteer Portal
- **"Become a Volunteer"** registration form covering 7 categories:
  - *Medical Support, Food Distribution, Transportation & Logistics, Rescue Support, Communication & Dispatch, First Aid, Other*.
- Volunteer Roster for responders and coordinators with contact relay.

### 10. Resource Management
- Real-time inventory tracking for critical crisis supplies:
  - *Blood Plasma, Food Rations, Drinking Water, Trauma Medicines, Thermal Blankets, First Aid Kits, Rescue Gear, Medical Oxygen*.
  - Status badges: 🟢 **Available**, 🟡 **Limited**, 🔴 **Unavailable**.
- Authorized Admin modal to adjust stock counts, operational notes, and depot locations.

### 11. Natural Disasters & Crisis Alerts Module (Dedicated)
- Comprehensive coverage of 11 distinct crisis and disaster types:
  - 🌊 **Flood** (inundation, river surge warnings)
  - 🌊 **Tsunami** (coastal withdrawal & high surge watches)
  - ⛰️ **Landslide** (hillside debris flow & rockfall advisories)
  - 🌍 **Earthquake** (seismic shockwave & tremor alerts)
  - 🌪️ **Cyclone** (super cyclonic gale winds & squall advisories)
  - 🔥 **Wildfire** (forest fire & ember hazard warnings)
  - ⛈️ **Severe Storm** (thunderstorm, lightning & squall alerts)
  - 🌧️ **Heavy Rainfall** (arterial waterlogging & drainage overload)
  - 🌨️ **Extreme Weather** (coldwave, ground frost & zero-visibility fog)
  - 🔥 **Fire** (industrial & multi-story structural fires)
  - ⚠️ **Other Emergency** (hazardous pipeline leaks & civil anomalies)
- **Disaster Filters**: Multi-chip filter (`All` \| `Flood` \| `Tsunami` \| `Landslide` \| `Earthquake` \| `Cyclone` \| `Fire` \| `Storm` \| `Other`) and search bar.
- **Display Fields**: Disaster type, Alert title, Severity (*Critical, High, Medium, Low*), Affected area, Date/time, Situational description, Domain-specific safety instructions, Current status (*Active Warning, Watch, Advisory, Evacuation Order, Standby, Resolved*), and Nearby emergency resources.
- **Interactive Action Buttons**:
  - `[View Details]`: Opens situational assessment, full protocol checklist, and assigned emergency assets.
  - `[Nearby Help]`: Opens direct speed dialers (`112`, `1077`, `102`), nearest hospitals with ICU capacity, ready ambulances with dispatch triggers, and community relief shelters.
- **Admin Management Portal**: Complete form with all required fields (Disaster Type, Title, Description, Area, Severity, Time, Instructions, Status, Resources), safety protocol auto-fill, editing capabilities, and push notification dispatchers.
- **Prototype Label**: Clearly labeled as *"Demo"* with disclaimers regarding official API integration.

### 12 & 13. Incident Reporting & Status Tracker
- Intake form with category chips, severity selector, auto-stamped GPS location, description, and scene photo uploader with quick-pick disaster demo scene thumbnails.
- Generates official tracking IDs (e.g. `INC-2026-9042`).
- 5-stage visual progression stepper:
  `🟡 Reported` ➔ `🔵 Assigned` ➔ `🟠 In Progress` ➔ `🟢 Resolved` ➔ `🔴 Closed`
- Expandable timeline audit log and follow-up citizen notes.

### 14 & 15. User Profile & Notification Center
- Profile management with avatar photo picker, contact details, blood group, and volunteer badges.
- Preference switches:
  - 🌙 **Dark Mode / Light Mode**
  - 📱 **Android Mockup Frame** (toggle device shell vs fullscreen)
  - 🔊 **Emergency Audio Siren Mute/Enable**
  - 🔄 **Factory Demo Data Reset**
- Notification Center with unread badges, filter tabs (*All* vs *Unread*), and one-tap navigation to relevant events.

### 16, 17 & 18. Admin Command Center
- **Executive KPI Cards**: Active Incidents, Broadcasts, Active Volunteers, Blood Donors, Resources, and Ready Ambulances.
- **Incident Dispatch Control**: Filter by severity/status, assign volunteers, edit response notes, and mark incidents resolved.
- **Alert Broadcaster**: Compose and publish emergency alerts that instantly notify all connected citizens.

---

## 🗄️ Database Schema & Storage

The application utilizes an offline-first storage engine backed by `localStorage` and `IndexedDB` with automatic seeding:

```
cerrms_db_
├── users              # User accounts & roles
├── blood_donors       # Protected blood donor registry
├── volunteers         # Certified community responders
├── hospitals          # Medical centers & ICU capacity
├── ambulances         # Vehicle fleet, crew & equipment
├── resources          # Relief supplies & depot stock
├── incidents          # Reported crises & progression logs
├── alerts             # Public safety broadcasts
├── notifications      # In-app and push notification feed
└── sos_requests       # Emergency SOS coordinates & tracking
```

---

## 🔒 Safety, Privacy & Production Integration Guide

1. **Production Geolocation**: Replace `navigator.geolocation` defaults with Google Geolocation API or Mapbox SDK.
2. **Push Notifications**: Connect Firebase Cloud Messaging (FCM) via `sw.js` using `firebase.initializeApp()` and `messaging.onBackgroundMessage()`.
3. **Emergency Dispatch APIs**: Integrate municipal CAD (Computer-Aided Dispatch) or Twilio emergency SMS webhooks in `js/components/sos.js`.
4. **Data Privacy**: Ensure that donor PII remains masked on the backend before serving public search queries.
