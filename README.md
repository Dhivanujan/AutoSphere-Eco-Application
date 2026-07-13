# 🚗 AutoSphere Eco — Service Provider Mobile Application

AutoSphere Eco is a premium, cross-platform mobile application designed for service providers and businesses to manage bookings, track earnings, update availability, adjust service radii, and interact with customers in real-time. Built on React Native and Expo SDK 54, the app runs seamlessly on iOS, Android, and Web platforms.

---

## 📱 Features & Highlights

- **Dynamic Provider Personas**: Adapts layout, KPIs, badges, and labels dynamically across 11 different service provider categories:
  - Taxi Driver, Taxi Company, Garage, Service Station, Spare Parts Seller, Vehicle Rental, Bus Operator, Parking Service, Fuel Service, Car Wash Service, Emergency Provider.
- **Persistent Bottom Tab Bar**: Custom navigation container (zero-dependency) featuring real-time unread notifications badges and adaptive labels.
- **Offline-First Fallback Layer**: Integrated mock database and real-time simulator that seamlessly takes over using `AsyncStorage` and subscription signals when Firebase/Backend services are offline.
- **Image Upload & Simulators**: Photo upload triggers real image pickers on web and interactive random preset avatars on native platforms.
- **GPS Calibration & Maps**: Dynamic OpenStreetMap reverse geocoding to resolve address strings on web/emulator environments, with native map fallbacks.
- **Micro-Animations**: Smooth screen entries (fade/slideUp) and custom transitions.

---

## 🛠️ Reusable Component Library

The application utilizes a modular, barrel-exported shared component library under `src/components/`:

1. **`AnimatedScreen.js`**: Wrap layout structures for smooth fade-in or slide-up entrance screen animations.
2. **`ScreenHeader.js`**: Standardized header with adaptive back navigation and custom action buttons (e.g. Save, Clear All).
3. **`BottomTabBar.js`**: Persistent tab navigation matching the 11 provider types and displaying notification badges.
4. **`MetricCard.js`**: Modern numeric statistics display card supporting icons, values, labels, and tap callbacks.
5. **`StatusBadge.js`**: Color-coded, unified status pills (e.g. Approved, Pending, Accepted, Completed).
6. **`EmptyState.js`**: Standardized fallback placeholder component with emojis and helper messages for empty lists or locked states.
7. **`InteractiveMap.js`**: Platform-guarded live GPS navigation mapping that renders an interactive iframe map on web, and Yandex Static Maps with tap-to-Google-Maps callback on iOS/Android.
8. **`RequestCard.js`**: Standard list item display showing client details, pricing, location, and status.

---

## 📂 Directory Structure

```text
AutoSphere Eco Application/
├── App.js                         # Application router, core provider switcher, and root navigation
├── index.js                       # Entry point (Registering the App component)
├── package.json                   # Dependencies (Expo SDK 54, React Native 0.81.5, React 19)
├── README.md                      # Setup Guide & Documentation
├── src/
│   ├── components/                # Reusable Component Library
│   │   ├── index.js               # Barrel exports file
│   │   ├── AnimatedScreen.js      # Mount transitions
│   │   ├── ScreenHeader.js        # Core headers
│   │   ├── BottomTabBar.js        # Navigation tabs
│   │   ├── MetricCard.js          # Stat blocks
│   │   ├── StatusBadge.js         # Color pills
│   │   ├── EmptyState.js          # Empty views
│   │   ├── InteractiveMap.js      # Platform-guarded maps
│   │   └── RequestCard.js         # Booking item card
│   ├── screens/                   # Onboarding, Setup, Operational and Settings screens (20 files)
│   │   ├── SplashScreen.js        # v1.0.0 Brand Entry
│   │   ├── IntroScreen.js         # Visual Onboarding carousel
│   │   ├── LoginScreen.js         # Phone verification triggers
│   │   ├── RegisterScreen.js      # Partner account setup
│   │   ├── OTPScreen.js           # Verification code entries
│   │   ├── TypeSelectionScreen.js # Persona picker (11 categories)
│   │   ├── BusinessSetupScreen.js # Profile detail edits
│   │   ├── DocumentUploadScreen.js# PDF/Image verification uploader
│   │   ├── VerificationStatusScreen.js # Live tracking approval
│   │   ├── DashboardScreen.js     # Adaptive widgets, KPIs, quick metrics
│   │   ├── RequestListScreen.js   # Filterable incoming job orders
│   │   ├── RequestDetailsScreen.js# Route directions, mock chats, progress controls
│   │   ├── AvailabilityScreen.js  # Hours slots & availability calendar
│   │   ├── LocationScreen.js      # Operating radius & GPS calibrator
│   │   ├── EarningsScreen.js      # Earnings overview charts & history
│   │   ├── CustomerListScreen.js  # Directory index with contact links
│   │   ├── ReviewsScreen.js       # Customer ratings & testimonials
│   │   ├── NotificationsScreen.js # Push alerts inbox
│   │   ├── ProfileScreen.js       # Avatar selector & business setup
│   │   └── SettingsScreen.js      # Biometric toggles, push alerts, language
│   ├── services/
│   │   ├── AppContext.js          # Unified React Context and state machine
│   │   ├── api.js                 # Unified fetch logic, mock seed data, simulation loops
│   │   └── firebase.js            # Initialized Firebase/Firestore connector stub
│   └── theme/
│       ├── colors.js              # Curated color tokens (sleek dark design)
│       └── styles.js              # Universal styling guidelines
```

---

## 🚀 Setup & Installation Guide

Follow these steps to run the application locally on Web, Android, or iOS:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended) and the [Expo Go](https://expo.dev/client) app installed on your physical mobile device if testing native.

### 2. Install Dependencies
Navigate to the project root and install the required modules:
```bash
npm install
```

### 3. Run Development Server
Start the Expo development server:
```bash
npm run start
```

### 4. Choose Platform
- **Run on Web**: Press **`w`** in the terminal to launch the web browser version.
- **Run on Android**: Press **`a`** to open in an Android Virtual Device (AVD).
- **Run on iOS**: Press **`i`** to open in an iOS Simulator.
- **Run on Physical Device**: Scan the QR code displayed in the terminal using your phone camera (iOS) or the Expo Go App (Android).

### 5. Run Mock Server (Optional)
If running a mock local server node:
```bash
npm run server
```

---

## 🎨 Theme & Typography

- **Background Colors**: Deep navy `#0B1117` and obsidian darks.
- **Primary Highlights**: Electric blue `#2563EB` & teal secondary colors.
- **Feedback Accents**: Success Emerald green, Warn Gold orange, Danger Crimson red.
- **Typography**: Uses modern Outfit and Inter system fonts with absolute clean layout grids.

---

## 🛡️ License

Intern Submission Project for **AutoSphere Eco**. Built with ❤️ for extreme user experience, responsiveness, and premium design standards.
