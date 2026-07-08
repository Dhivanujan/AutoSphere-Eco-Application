import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Initial Mock Requests
const initialRequests = [
  // Taxi Driver Requests
  {
    id: 'req-101',
    type: 'Taxi Driver',
    customerName: 'Sarah Jenkins',
    customerPhone: '+1 (555) 019-2834',
    serviceDetails: 'Ride: Premium Sedan (3.5 miles)',
    pickupLocation: 'Downtown Plaza, Terminal 2',
    dropoffLocation: 'Grand View Heights, Block C',
    time: 'Just now',
    notes: 'Please open trunk for luggage.',
    fare: 18.50,
    status: 'Pending', // Pending, Accepted, In Progress, Completed, Cancelled
    history: [
      { time: '18:14', event: 'Request created by customer' }
    ]
  },
  {
    id: 'req-102',
    type: 'Taxi Driver',
    customerName: 'Michael Chen',
    customerPhone: '+1 (555) 382-9012',
    serviceDetails: 'Ride: Standard Ride (8.2 miles)',
    pickupLocation: 'Westside Shopping Mall',
    dropoffLocation: 'International Airport, Departure Gates',
    time: '1 hour ago',
    notes: 'Flight is in 2 hours, please be on time.',
    fare: 35.00,
    status: 'Completed',
    history: [
      { time: '17:05', event: 'Request accepted' },
      { time: '17:15', event: 'Driver arrived' },
      { time: '17:35', event: 'Trip completed successfully' }
    ]
  },
  
  // Garage Requests
  {
    id: 'req-201',
    type: 'Garage',
    customerName: 'Amanda Vance',
    customerPhone: '+1 (555) 873-1122',
    serviceDetails: 'Full Brake Pad Replacement & Rotor Polish',
    vehicleDetails: '2021 Toyota RAV4 (Silver)',
    pickupLocation: 'Customer Home (12.4 miles away) - Home Pickup Service',
    time: 'Scheduled for Tomorrow, 10:00 AM',
    notes: 'Squeaking noise when braking at low speed.',
    fare: 220.00,
    status: 'Pending',
    history: [
      { time: '16:30', event: 'Appointment requested' }
    ]
  },
  {
    id: 'req-202',
    type: 'Garage',
    customerName: 'David Miller',
    customerPhone: '+1 (555) 438-9102',
    serviceDetails: 'Engine Oil Change & Filter Replacement',
    vehicleDetails: '2019 Honda Civic (Black)',
    pickupLocation: 'Garage Workshop (Self-Drop)',
    time: 'Today, 2:00 PM',
    notes: 'Use synthetic 0W-20 oil.',
    fare: 85.00,
    status: 'In Progress',
    history: [
      { time: '14:00', event: 'Vehicle checked in' },
      { time: '14:15', event: 'Oil drainage completed' }
    ]
  },
  
  // Spare Parts Seller Requests
  {
    id: 'req-301',
    type: 'Spare Parts Seller',
    customerName: 'Robert Ford',
    customerPhone: '+1 (555) 293-8472',
    serviceDetails: 'OEM Headlight Assembly (Left Side)',
    partNumber: 'HL-TOY-RAV4-21L',
    pickupLocation: 'Shipping: 421 Oak St, Springfield',
    time: '15 mins ago',
    notes: 'Ensure standard protective packaging.',
    fare: 145.00,
    status: 'Pending',
    history: [
      { time: '17:59', event: 'Order placed' }
    ]
  },
  {
    id: 'req-302',
    type: 'Spare Parts Seller',
    customerName: 'AutoFix Workshop',
    customerPhone: '+1 (555) 902-8833',
    serviceDetails: 'Spark Plugs Pack of 4 & Air Filter',
    partNumber: 'SP-NGK-7742 / AF-HON-19',
    pickupLocation: 'Store Pickup',
    time: '2 hours ago',
    notes: 'Mechanic will pick it up at 5:00 PM.',
    fare: 62.50,
    status: 'Accepted',
    history: [
      { time: '16:10', event: 'Order confirmed and packed' }
    ]
  }
];

// Mock Reviews
const initialReviews = [
  { id: 'rev-1', author: 'Sarah Jenkins', rating: 5, date: 'Today', comment: 'Extremely polite, clean car, arrived 5 minutes early. Highly recommended!', service: 'Ride to Terminal 2' },
  { id: 'rev-2', author: 'David Miller', rating: 4, date: 'Yesterday', comment: 'Good service at the garage. Explained the issues clearly, though it took 15 minutes longer than estimated.', service: 'Oil Change' },
  { id: 'rev-3', author: 'Robert Ford', rating: 5, date: '3 days ago', comment: 'The spare headlight arrived intact and fits perfectly. Original OEM parts indeed!', service: 'Headlight Assembly' },
  { id: 'rev-4', author: 'Jessica Taylor', rating: 5, date: '1 week ago', comment: 'Excellent ride! Professional driver and very smooth navigation through rush hour traffic.', service: 'Ride to Downtown' }
];

// Mock Notifications
const initialNotifications = [
  { id: 'nt-1', title: 'New Booking Request', body: 'Sarah Jenkins requested a ride (3.5 miles). Earn $18.50.', time: 'Just now', read: false, type: 'request' },
  { id: 'nt-2', title: 'Payout Successful', body: 'Your weekly earnings of $450.00 have been deposited to your account.', time: '2 hours ago', read: true, type: 'payment' },
  { id: 'nt-3', title: 'Verification Update', body: 'Your Identity Document has been verified successfully.', time: '1 day ago', read: true, type: 'system' },
  { id: 'nt-4', title: '5-Star Review Received', body: 'Jessica Taylor left a 5-star review for your ride service.', time: '1 week ago', read: true, type: 'review' }
];

export const AppProvider = ({ children }) => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState('SPLASH');
  
  // Provider Selection State
  const [providerType, setProviderType] = useState('Taxi Driver'); // Default type
  const [isOnline, setIsOnline] = useState(true);
  
  // User Profile Info
  const [profile, setProfile] = useState({
    fullName: 'Alex Carter',
    email: 'alex.carter@autosphere.eco',
    phone: '+1 (555) 789-0123',
    profilePhoto: null,
    
    // Business Details
    businessName: 'Carter Express Services',
    businessLogo: null,
    address: '742 Evergreen Terrace, Springfield',
    workingHours: '08:00 AM - 06:00 PM',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    serviceArea: 'Springfield Metro & Surrounding Suburbs',
    serviceRadius: 15, // in miles
  });

  // Verification Documents State
  const [documents, setDocuments] = useState({
    identityDoc: null, // file name or status
    businessReg: null,
    license: null,
    certificates: null,
    status: 'Pending', // Pending, Approved, Rejected
    reviewNotes: 'Our support team is reviewing your uploaded credentials. This usually takes 24 hours.'
  });

  // Requests and Operations
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Reviews & Notifications
  const [reviews, setReviews] = useState(initialReviews);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // Earnings metrics
  const [earnings, setEarnings] = useState({
    daily: 120.50,
    weekly: 685.00,
    monthly: 2740.00,
    history: [
      { id: 'tx-1', amount: 18.50, title: 'Sarah Jenkins - Ride', date: 'Today, 18:15', status: 'Completed' },
      { id: 'tx-2', amount: 85.00, title: 'David Miller - Oil Change', date: 'Today, 14:30', status: 'Completed' },
      { id: 'tx-3', amount: 145.00, title: 'Robert Ford - Spare Part', date: 'Yesterday, 11:20', status: 'Completed' },
      { id: 'tx-4', amount: 35.00, title: 'Michael Chen - Ride', date: 'Yesterday, 09:15', status: 'Completed' },
      { id: 'tx-5', amount: 450.00, title: 'Weekly Bank Payout', date: '2 days ago', status: 'Settled' }
    ]
  });

  // Location configuration
  const [location, setLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    address: 'Market St, San Francisco, CA',
    radius: 10, // miles
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

  // Actions / Handlers
  const loginUser = (email, password) => {
    setProfile(prev => ({
      ...prev,
      email: email || prev.email,
    }));
    // Move to type selection if not selected, or dashboard if already setup
    if (!providerType) {
      setCurrentScreen('TYPE_SELECTION');
    } else if (documents.status !== 'Approved') {
      setCurrentScreen('VERIFICATION_STATUS');
    } else {
      setCurrentScreen('DASHBOARD');
    }
  };

  const registerUser = (name, email, phone, password) => {
    setProfile(prev => ({
      ...prev,
      fullName: name,
      email: email,
      phone: phone,
    }));
    setCurrentScreen('OTP');
  };

  const verifyOTP = (code) => {
    if (code === '1234' || code.length === 4) {
      setCurrentScreen('TYPE_SELECTION');
      return true;
    }
    return false;
  };

  const selectProviderType = (type) => {
    setProviderType(type);
    setCurrentScreen('BUSINESS_SETUP');
  };

  const saveBusinessProfile = (details) => {
    setProfile(prev => ({
      ...prev,
      ...details
    }));
    setCurrentScreen('DOCUMENT_UPLOAD');
  };

  const uploadProfilePhoto = (photo) => {
    setProfile(prev => ({
      ...prev,
      profilePhoto: photo
    }));
  };

  const uploadBusinessLogo = (logo) => {
    setProfile(prev => ({
      ...prev,
      businessLogo: logo
    }));
  };

  const uploadDocument = (docKey, fileName) => {
    setDocuments(prev => {
      const updated = { ...prev, [docKey]: fileName };
      // If all documents are uploaded, mock approval/pending state
      const allUploaded = updated.identityDoc && updated.businessReg && updated.license;
      if (allUploaded) {
        updated.status = 'Pending';
      }
      return updated;
    });
  };

  const submitDocumentsForVerification = () => {
    setDocuments(prev => ({
      ...prev,
      status: 'Pending',
      reviewNotes: 'Our support team is reviewing your uploaded credentials. This usually takes 24 hours.'
    }));
    setCurrentScreen('VERIFICATION_STATUS');
    
    // Auto-approve after 10 seconds for demo purposes
    setTimeout(() => {
      setDocuments(prev => ({
        ...prev,
        status: 'Approved',
        reviewNotes: 'Congratulations! Your profile has been approved.'
      }));
      // Add system notification
      setNotifications(prev => [
        {
          id: 'nt-sys-approve',
          title: 'Account Approved!',
          body: 'Your credentials have been verified. You can now go online and accept requests.',
          time: 'Just now',
          read: false,
          type: 'system'
        },
        ...prev
      ]);
    }, 12000);
  };

  const acceptRequest = (requestId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedReq = { ...req, status: 'Accepted' };
        updatedReq.history = [...req.history, { time: 'Just now', event: 'Request accepted by provider' }];
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(updatedReq);
        }
        return updatedReq;
      }
      return req;
    }));
    
    // Add notification
    setNotifications(prev => [
      {
        id: `nt-accept-${Date.now()}`,
        title: 'Request Accepted',
        body: `You accepted the request from ${requests.find(r => r.id === requestId)?.customerName}.`,
        time: 'Just now',
        read: false,
        type: 'request'
      },
      ...prev
    ]);
  };

  const rejectRequest = (requestId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedReq = { ...req, status: 'Cancelled' };
        updatedReq.history = [...req.history, { time: 'Just now', event: 'Request declined by provider' }];
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(updatedReq);
        }
        return updatedReq;
      }
      return req;
    }));
  };

  const startService = (requestId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedReq = { ...req, status: 'In Progress' };
        updatedReq.history = [...req.history, { time: 'Just now', event: 'Service in progress' }];
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(updatedReq);
        }
        return updatedReq;
      }
      return req;
    }));
  };

  const completeService = (requestId) => {
    let completedReq = null;
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        completedReq = { ...req, status: 'Completed' };
        completedReq.history = [...req.history, { time: 'Just now', event: 'Service marked as completed' }];
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(completedReq);
        }
        return completedReq;
      }
      return req;
    }));

    if (completedReq) {
      // Add to earnings
      setEarnings(prev => ({
        ...prev,
        daily: prev.daily + completedReq.fare,
        weekly: prev.weekly + completedReq.fare,
        monthly: prev.monthly + completedReq.fare,
        history: [
          {
            id: `tx-${Date.now()}`,
            amount: completedReq.fare,
            title: `${completedReq.customerName} - ${completedReq.serviceDetails.split(':')[0]}`,
            date: 'Today, Just now',
            status: 'Completed'
          },
          ...prev.history
        ]
      }));
    }
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => prev.map(nt => 
      nt.id === notificationId ? { ...nt, read: true } : nt
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const logout = () => {
    setCurrentScreen('LOGIN');
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
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
