import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from './api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState('SPLASH');
  
  // Current User Session
  const [currentUser, setCurrentUser] = useState(null);
  
  // Provider Selection State
  const [providerType, setProviderType] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  
  // User Profile Info
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    profilePhoto: null,
    businessName: '',
    businessLogo: null,
    address: '',
    workingHours: '08:00 AM - 06:00 PM',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    serviceArea: '',
    serviceRadius: 10,
  });

  // Verification Documents State
  const [documents, setDocuments] = useState({
    identityDoc: null,
    businessReg: null,
    license: null,
    certificates: null,
    status: 'Pending',
    reviewNotes: 'Upload your documents to submit your application.'
  });

  // Requests and Operations
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Reviews & Notifications
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Payouts & Chats
  const [payouts, setPayouts] = useState([]);
  const [activeChatMessages, setActiveChatMessages] = useState([]);

  // Earnings metrics (dynamically calculated from requests)
  const [earnings, setEarnings] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    history: []
  });

  // Location configuration
  const [location, setLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    address: 'Market St, San Francisco, CA',
    radius: 10,
    liveTracking: true
  });

  // Settings
  const [settings, setSettings] = useState({
    language: 'English',
    pushNotifications: true,
    emailNotifications: true,
    locationAccess: true,
    biometrics: false,
    darkMode: false,
  });

  // Connection indicator
  const firebaseActive = api.firebaseActive;

  // 1. AUTH STATE OBSERVER
  useEffect(() => {
    const unsubAuth = api.auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        // Sync profile fields from user
        setProfile({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          profilePhoto: user.profilePhoto || null,
          businessName: user.businessName || '',
          businessLogo: user.businessLogo || null,
          address: user.address || '',
          workingHours: user.workingHours || '08:00 AM - 06:00 PM',
          workingDays: user.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          serviceArea: user.serviceArea || '',
          serviceRadius: user.serviceRadius || 10,
        });

        if (user.providerType) {
          setProviderType(user.providerType);
        }

        if (user.documents) {
          setDocuments(user.documents);
        }

        if (user.location) {
          setLocation(user.location);
        }

        if (user.settings) {
          setSettings(user.settings);
        }

        // Auto-navigate user from Splash/Auth to Dashboard if setup is complete
        if (currentScreen === 'SPLASH' || currentScreen === 'LOGIN' || currentScreen === 'REGISTER' || currentScreen === 'OTP') {
          if (!user.providerType) {
            setCurrentScreen('TYPE_SELECTION');
          } else if (user.documents?.status !== 'Approved') {
            setCurrentScreen('VERIFICATION_STATUS');
          } else {
            setCurrentScreen('DASHBOARD');
          }
        }
      } else {
        // Logged out
        setProfile({
          fullName: '',
          email: '',
          phone: '',
          profilePhoto: null,
          businessName: '',
          businessLogo: null,
          address: '',
          workingHours: '08:00 AM - 06:00 PM',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          serviceArea: '',
          serviceRadius: 10,
        });
        setProviderType(null);
        setDocuments({
          identityDoc: null,
          businessReg: null,
          license: null,
          certificates: null,
          status: 'Pending',
          reviewNotes: 'Upload your documents to submit your application.'
        });
        setRequests([]);
        setNotifications([]);
        setReviews([]);
        if (currentScreen !== 'REGISTER' && currentScreen !== 'INTRO' && currentScreen !== 'SPLASH') {
          setCurrentScreen('LOGIN');
        }
      }
    });

    return () => {
      if (typeof unsubAuth === 'function') unsubAuth();
    };
  }, [currentScreen]);

  // 2. REAL-TIME DATA DATABASE SUBSCRIPTIONS (Triggered on login)
  useEffect(() => {
    if (!currentUser || !providerType) return;

    // Listen for requests of this provider type
    const unsubReqs = api.requests.subscribeRequests(providerType, currentUser.uid, (data) => {
      setRequests(data);
      // Keep selectedRequest state synchronized if its properties changed in database
      setSelectedRequest(prev => {
        if (!prev) return null;
        const matched = data.find(r => r.id === prev.id);
        return matched || prev;
      });
    });

    // Listen for current user notifications
    const unsubNotifs = api.notifications.subscribeNotifications(currentUser.uid, (data) => {
      setNotifications(data);
    });

    // Listen for current user reviews
    const unsubReviews = api.reviews.subscribeReviews(currentUser.uid, (data) => {
      setReviews(data);
    });

    // Listen for payouts
    const unsubPayouts = api.payouts.subscribePayouts(currentUser.uid, (data) => {
      setPayouts(data);
    });

    return () => {
      if (typeof unsubReqs === 'function') unsubReqs();
      if (typeof unsubNotifs === 'function') unsubNotifs();
      if (typeof unsubReviews === 'function') unsubReviews();
      if (typeof unsubPayouts === 'function') unsubPayouts();
    };
  }, [currentUser, providerType]);

  // 2.5. CHAT MESSAGES REAL-TIME SUBSCRIPTION
  useEffect(() => {
    if (!selectedRequest) {
      setActiveChatMessages([]);
      return;
    }

    const unsubChat = api.chat.subscribeMessages(selectedRequest.id, (data) => {
      setActiveChatMessages(data);
    });

    return () => {
      if (typeof unsubChat === 'function') unsubChat();
    };
  }, [selectedRequest]);

  // 3. EARNINGS METRICS CALCULATION (Computed dynamically from completed jobs & payouts)
  useEffect(() => {
    const completed = requests.filter(r => r.status === 'Completed');
    
    const jobsHistory = completed.map(req => {
      // Find completion event time in history
      const compEvent = req.history?.find(h => h.event.includes('completed')) || req.history?.[req.history.length - 1];
      const eventTime = compEvent ? compEvent.time : 'Just now';
      return {
        id: `tx-${req.id}`,
        amount: req.fare,
        title: `${req.customerName} - ${req.serviceDetails?.split(':')[0] || 'Service'}`,
        date: `Today, ${eventTime}`,
        status: 'Completed',
        createdAt: req.createdAt || new Date(0).toISOString()
      };
    });

    const payoutsHistory = payouts.map(po => ({
      id: po.id,
      amount: -po.amount,
      title: po.title,
      date: po.date,
      status: po.status,
      createdAt: po.createdAt
    }));

    // Merge history and sort by createdAt desc
    const combinedHistory = [...jobsHistory, ...payoutsHistory];
    combinedHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalFare = completed.reduce((acc, curr) => acc + curr.fare, 0);
    const totalPayouts = payouts.reduce((acc, curr) => acc + curr.amount, 0);
    const remainingBalance = Math.max(0, totalFare - totalPayouts);

    setEarnings({
      daily: completed.length > 0 ? completed[completed.length - 1].fare : 0,
      weekly: remainingBalance,
      monthly: remainingBalance,
      history: combinedHistory
    });
  }, [requests, payouts]);

  // --- ACTIONS / HANDLERS ---
  const loginUser = async (email, password) => {
    try {
      await api.auth.login(email, password);
    } catch (err) {
      alert(err.message || 'Login failed.');
    }
  };

  const registerUser = async (name, email, phone, password) => {
    try {
      await api.auth.register(name, email, phone, password);
      setCurrentScreen('OTP');
    } catch (err) {
      alert(err.message || 'Registration failed.');
    }
  };

  const verifyOTP = (code) => {
    // Standard mock verification code
    if (code === '1234' || code.length === 4) {
      setCurrentScreen('TYPE_SELECTION');
      return true;
    }
    return false;
  };

  const selectProviderType = async (type) => {
    setProviderType(type);
    if (currentUser) {
      await api.profile.updateProfile(currentUser.uid, { providerType: type });
    }
    setCurrentScreen('BUSINESS_SETUP');
  };

  const saveBusinessProfile = async (details) => {
    if (currentUser) {
      await api.profile.updateProfile(currentUser.uid, {
        ...details,
        // Sync with base profile fields if needed
      });
    }
    setCurrentScreen('DOCUMENT_UPLOAD');
  };

  const uploadProfilePhoto = async (photo) => {
    if (currentUser) {
      await api.profile.updateProfile(currentUser.uid, { profilePhoto: photo });
    }
  };

  const uploadBusinessLogo = async (logo) => {
    if (currentUser) {
      await api.profile.updateProfile(currentUser.uid, { businessLogo: logo });
    }
  };

  const uploadDocument = async (docKey, fileName) => {
    if (currentUser) {
      await api.documents.uploadDocument(currentUser.uid, docKey, fileName);
    }
  };

  const submitDocumentsForVerification = async () => {
    if (currentUser) {
      await api.documents.submitForVerification(currentUser.uid);
    }
    setCurrentScreen('VERIFICATION_STATUS');
  };

  const acceptRequest = async (requestId) => {
    if (currentUser) {
      const req = requests.find(r => r.id === requestId);
      if (req) {
        await api.requests.acceptRequest(requestId, currentUser.uid, req.customerName);
      }
    }
  };

  const rejectRequest = async (requestId) => {
    if (currentUser) {
      await api.requests.rejectRequest(requestId, currentUser.uid);
    }
  };

  const startService = async (requestId) => {
    if (currentUser) {
      await api.requests.startService(requestId, currentUser.uid);
    }
  };

  const completeService = async (requestId) => {
    if (currentUser) {
      const req = requests.find(r => r.id === requestId);
      if (req) {
        await api.requests.completeService(requestId, currentUser.uid, req.fare, req.customerName, req.serviceDetails);
      }
    }
  };

  const markNotificationRead = async (notificationId) => {
    if (currentUser) {
      await api.notifications.markAsRead(notificationId, currentUser.uid);
    }
  };

  const clearAllNotifications = async () => {
    if (currentUser) {
      await api.notifications.clearAll(currentUser.uid);
    }
  };

  const updateSettings = async (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    if (currentUser) {
      await api.profile.updateProfile(currentUser.uid, { settings: updatedSettings });
    }
  };

  const logout = async () => {
    await api.auth.logout();
  };

  const requestPayout = async (amount) => {
    if (currentUser && amount > 0) {
      await api.payouts.createPayout(currentUser.uid, amount);
      return true;
    }
    return false;
  };

  const sendChatMessage = async (text) => {
    if (currentUser && selectedRequest && text.trim()) {
      await api.chat.sendMessage(selectedRequest.id, currentUser.uid, 'Provider', text);
      
      // Auto-simulate a customer response after 1.5 seconds
      setTimeout(async () => {
        const responses = [
          "Okay, thank you for updating!",
          "Great! I am waiting.",
          "Perfect, let me know when you arrive.",
          "Thanks, sounds good!",
          "Got it. Drive safe!"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await api.chat.sendMessage(selectedRequest.id, 'customer', selectedRequest.customerName, randomResponse);
      }, 1500);
    }
  };

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      providerType,
      setProviderType,
      isOnline,
      setIsOnline,
      profile,
      setProfile,
      documents,
      setDocuments,
      requests,
      setRequests,
      selectedRequest,
      setSelectedRequest,
      reviews,
      notifications,
      earnings,
      location,
      setLocation,
      settings,
      loginUser,
      registerUser,
      verifyOTP,
      selectProviderType,
      saveBusinessProfile,
      uploadProfilePhoto,
      uploadBusinessLogo,
      uploadDocument,
      submitDocumentsForVerification,
      acceptRequest,
      rejectRequest,
      startService,
      completeService,
      markNotificationRead,
      clearAllNotifications,
      updateSettings,
      logout,
      firebaseActive,
      setNotifications,
      payouts,
      activeChatMessages,
      requestPayout,
      sendChatMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};
