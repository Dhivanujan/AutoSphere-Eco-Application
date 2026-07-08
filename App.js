import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, SafeAreaView } from 'react-native';
import { AppProvider, useApp } from './src/services/AppContext';
import { colors } from './src/theme/colors';

// Import All 20 Screens
import SplashScreen from './src/screens/SplashScreen';
import IntroScreen from './src/screens/IntroScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OTPScreen from './src/screens/OTPScreen';
import TypeSelectionScreen from './src/screens/TypeSelectionScreen';
import BusinessSetupScreen from './src/screens/BusinessSetupScreen';
import DocumentUploadScreen from './src/screens/DocumentUploadScreen';
import VerificationStatusScreen from './src/screens/VerificationStatusScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import RequestListScreen from './src/screens/RequestListScreen';
import RequestDetailsScreen from './src/screens/RequestDetailsScreen';
import AvailabilityScreen from './src/screens/AvailabilityScreen';
import LocationScreen from './src/screens/LocationScreen';
import EarningsScreen from './src/screens/EarningsScreen';
import CustomerListScreen from './src/screens/CustomerListScreen';
import ReviewsScreen from './src/screens/ReviewsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Core Navigator Switcher
function RootNavigator() {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    case 'SPLASH':
      return <SplashScreen />;
    case 'INTRO':
      return <IntroScreen />;
    case 'LOGIN':
      return <LoginScreen />;
    case 'REGISTER':
      return <RegisterScreen />;
    case 'OTP':
      return <OTPScreen />;
    case 'TYPE_SELECTION':
      return <TypeSelectionScreen />;
    case 'BUSINESS_SETUP':
      return <BusinessSetupScreen />;
    case 'DOCUMENT_UPLOAD':
      return <DocumentUploadScreen />;
    case 'VERIFICATION_STATUS':
      return <VerificationStatusScreen />;
    case 'DASHBOARD':
      return <DashboardScreen />;
    case 'REQUEST_LIST':
      return <RequestListScreen />;
    case 'REQUEST_DETAILS':
      return <RequestDetailsScreen />;
    case 'AVAILABILITY':
      return <AvailabilityScreen />;
    case 'LOCATION':
      return <LocationScreen />;
    case 'EARNINGS':
      return <EarningsScreen />;
    case 'CUSTOMER_LIST':
      return <CustomerListScreen />;
    case 'REVIEWS':
      return <ReviewsScreen />;
    case 'NOTIFICATIONS':
      return <NotificationsScreen />;
    case 'PROFILE':
      return <ProfileScreen />;
    case 'SETTINGS':
      return <SettingsScreen />;
    default:
      return <SplashScreen />;
  }
}

// Developer Sandbox Overlay Panel
function DevToolsOverlay() {
  const { 
    currentScreen, 
    setCurrentScreen, 
    providerType, 
    setProviderType, 
    setRequests, 
    setNotifications,
    documents,
    setDocuments
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  // Instantly simulate a new incoming request based on chosen provider type
  const triggerMockRequest = () => {
    const idNum = Math.floor(Math.random() * 900) + 100;
    let newReq = {
      id: `req-${idNum}`,
      type: providerType,
      customerName: 'Marcus Aurelius',
      customerPhone: '+1 (555) 753-9514',
      pickupLocation: 'Centennial Arena Hall D',
      time: 'Just now',
      notes: 'Urgent service request. Settle via card.',
      fare: 45.00,
      status: 'Pending',
      history: [{ time: 'Just now', event: 'Request triggered by customer via dispatch' }]
    };

    if (providerType === 'Garage') {
      newReq.serviceDetails = 'Radiator Coolant Flushing & System Check';
      newReq.vehicleDetails = '2020 Chevrolet Traverse (Blue)';
    } else if (providerType === 'Spare Parts Seller') {
      newReq.serviceDetails = 'Engine Spark Plugs Core Kit Set';
      newReq.partNumber = 'SP-CORE-NGK';
    } else {
      newReq.serviceDetails = 'Premium Transit (5.8 miles)';
    }

    // Add to requests list
    setRequests(prev => [newReq, ...prev]);

    // Add notification
    setNotifications(prev => [
      {
        id: `nt-mock-${idNum}`,
        title: 'New Dispatch Order',
        body: `New request from Marcus Aurelius for ${providerType}. Est: $45.00.`,
        time: 'Just now',
        read: false,
        type: 'request'
      },
      ...prev
    ]);

    alert(`🔔 Simulated new request received!\nCustomer: Marcus Aurelius\nCategory: ${providerType}`);
  };

  const setVerification = (statusValue) => {
    setDocuments(prev => ({
      ...prev,
      status: statusValue,
      reviewNotes: statusValue === 'Rejected' 
        ? 'Identity card photo was blur/unreadable.' 
        : 'Approved successfully.'
    }));
    alert(`Verification status updated to: ${statusValue}`);
  };

  if (!isOpen) {
    return (
      <TouchableOpacity 
        style={styles.floatingBubble}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.bubbleIcon}>🛠️</Text>
        <Text style={styles.bubbleText}>DEV</Text>
      </TouchableOpacity>
    );
  }

  const screensList = [
    'SPLASH', 'INTRO', 'LOGIN', 'REGISTER', 'OTP', 
    'TYPE_SELECTION', 'BUSINESS_SETUP', 'DOCUMENT_UPLOAD', 'VERIFICATION_STATUS', 
    'DASHBOARD', 'REQUEST_LIST', 'REQUEST_DETAILS', 'AVAILABILITY', 
    'LOCATION', 'EARNINGS', 'CUSTOMER_LIST', 'REVIEWS', 
    'NOTIFICATIONS', 'PROFILE', 'SETTINGS'
  ];

  const rolesList = [
    'Taxi Driver', 'Taxi Company', 'Garage', 'Service Station', 
    'Spare Parts Seller', 'Vehicle Rental', 'Bus Operator', 
    'Emergency Provider', 'Fuel Service', 'Parking Service', 
    'Car Wash Service'
  ];

  return (
    <View style={styles.devPanel}>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>🛠️ Developer Mock Toolbar</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => setIsOpen(false)}>
          <Text style={styles.closeBtnText}>Minimize ✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.panelBody} nestedScrollEnabled={true}>
        <Text style={styles.sectionTitle}>1. Jump to Screen ({screensList.indexOf(currentScreen) + 1}/20)</Text>
        <View style={styles.devRowGrid}>
          {screensList.map(scr => (
            <TouchableOpacity 
              key={scr} 
              style={[styles.devGridBtn, currentScreen === scr ? styles.devGridBtnActive : null]}
              onPress={() => setCurrentScreen(scr)}
            >
              <Text style={[styles.devGridBtnText, currentScreen === scr ? styles.devGridBtnTextActive : null]}>
                {scr.substring(0, 10)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>2. Active Provider Category</Text>
        <View style={styles.devRowGrid}>
          {rolesList.map(role => (
            <TouchableOpacity 
              key={role} 
              style={[styles.devGridBtn, providerType === role ? styles.devGridBtnActive : null]}
              onPress={() => setProviderType(role)}
            >
              <Text style={[styles.devGridBtnText, providerType === role ? styles.devGridBtnTextActive : null]}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>3. Dispatch Simulator</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={triggerMockRequest}>
          <Text style={styles.actionBtnText}>🔔 Simulate Incoming Request</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>4. Document Verification Status</Text>
        <View style={styles.devBtnRow}>
          {['Pending', 'Approved', 'Rejected'].map(s => (
            <TouchableOpacity 
              key={s} 
              style={[
                styles.actionBtnSide, 
                documents.status === s ? styles.devGridBtnActive : null,
                s === 'Approved' ? { backgroundColor: 'rgba(16, 185, 129, 0.1)' } :
                s === 'Rejected' ? { backgroundColor: 'rgba(239, 68, 68, 0.1)' } : null
              ]}
              onPress={() => setVerification(s)}
            >
              <Text style={[styles.actionBtnTextSide, documents.status === s ? { color: '#fff' } : null]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <RootNavigator />
        <DevToolsOverlay />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  floatingBubble: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.secondary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 999,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  bubbleIcon: {
    fontSize: 20,
  },
  bubbleText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    marginTop: 2,
  },
  devPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 380,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    zIndex: 9999,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  panelTitle: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: 14,
  },
  closeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#334155',
    borderRadius: 6,
  },
  closeBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '650',
  },
  panelBody: {
    padding: 14,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  devRowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  devGridBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#1E293B',
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  devGridBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  devGridBtnText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  devGridBtnTextActive: {
    color: '#ffffff',
  },
  actionBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 4,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  devBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtnSide: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionBtnTextSide: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '750',
  }
});
