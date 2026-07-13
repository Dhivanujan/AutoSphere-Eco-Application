import { auth, db, isFirebaseConfigured } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  onSnapshot,
  orderBy,
  deleteDoc,
  limit
} from 'firebase/firestore';

// --- MOCK / FALLBACK SEED DATA ---
const initialRequests = [
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
    status: 'Pending',
    history: [{ time: '18:14', event: 'Request created by customer' }]
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
    providerId: 'demo-provider-uid',
    history: [
      { time: '17:05', event: 'Request accepted' },
      { time: '17:15', event: 'Driver arrived' },
      { time: '17:35', event: 'Trip completed successfully' }
    ]
  },
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
    history: [{ time: '16:30', event: 'Appointment requested' }]
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
    providerId: 'demo-provider-uid',
    history: [
      { time: '14:00', event: 'Vehicle checked in' },
      { time: '14:15', event: 'Oil drainage completed' }
    ]
  },
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
    history: [{ time: '17:59', event: 'Order placed' }]
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
    providerId: 'demo-provider-uid',
    history: [{ time: '16:10', event: 'Order confirmed and packed' }]
  }
];

const initialReviews = [
  { id: 'rev-1', author: 'Sarah Jenkins', rating: 5, date: 'Today', comment: 'Extremely polite, clean car, arrived 5 minutes early. Highly recommended!', service: 'Ride to Terminal 2' },
  { id: 'rev-2', author: 'David Miller', rating: 4, date: 'Yesterday', comment: 'Good service at the garage. Explained the issues clearly, though it took 15 minutes longer than estimated.', service: 'Oil Change' },
  { id: 'rev-3', author: 'Robert Ford', rating: 5, date: '3 days ago', comment: 'The spare headlight arrived intact and fits perfectly. Original OEM parts indeed!', service: 'Headlight Assembly' },
  { id: 'rev-4', author: 'Jessica Taylor', rating: 5, date: '1 week ago', comment: 'Excellent ride! Professional driver and very smooth navigation through rush hour traffic.', service: 'Ride to Downtown' }
];

const initialNotifications = [
  { id: 'nt-1', title: 'New Booking Request', body: 'Sarah Jenkins requested a ride (3.5 miles). Earn $18.50.', time: 'Just now', read: false, type: 'request' },
  { id: 'nt-2', title: 'Payout Successful', body: 'Your weekly earnings of $450.00 have been deposited to your account.', time: '2 hours ago', read: true, type: 'payment' },
  { id: 'nt-3', title: 'Verification Update', body: 'Your Identity Document has been verified successfully.', time: '1 day ago', read: true, type: 'system' },
  { id: 'nt-4', title: '5-Star Review Received', body: 'Jessica Taylor left a 5-star review for your ride service.', time: '1 week ago', read: true, type: 'review' }
];

const defaultMockUsers = [
  {
    uid: 'demo-provider-uid',
    email: 'alex.carter@autosphere.eco',
    password: 'password123',
    profile: {
      fullName: 'Alex Carter',
      email: 'alex.carter@autosphere.eco',
      phone: '+1 (555) 789-0123',
      profilePhoto: '👨‍✈️',
      businessName: 'Carter Auto Repairs',
      businessLogo: '🛠️',
      address: '742 Evergreen Terrace, Springfield',
      workingHours: '08:00 AM - 06:00 PM',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      serviceArea: 'Springfield Metro Area',
      serviceRadius: 15,
      providerType: 'Garage',
      documents: {
        identityDoc: 'government_id_card.pdf',
        businessReg: 'business_registration_license.pdf',
        license: 'commercial_operating_permit.pdf',
        certificates: 'insurance_and_liability_cert.pdf',
        status: 'Approved',
        reviewNotes: 'Verified via Quick Dev Tools.'
      }
    }
  }
];

// --- BACKEND / MONGO LOCALHOST CONFIGURATION ---
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const BACKEND_WS_URL = process.env.EXPO_PUBLIC_BACKEND_WS_URL;
const isBackendConfigured = !!BACKEND_URL;

let socket = null;
const socketCallbacks = {};

const getSocket = () => {
  if (!BACKEND_WS_URL) return null;
  if (socket && (socket.readyState === 0 || socket.readyState === 1)) {
    return socket;
  }
  
  console.log('[WebSocket] Connecting to', BACKEND_WS_URL);
  socket = new WebSocket(BACKEND_WS_URL);
  
  socket.onopen = () => {
    console.log('[WebSocket] Connection established.');
    // Resubscribe to all active channels
    Object.keys(socketCallbacks).forEach(subId => {
      const { channel, params } = socketCallbacks[subId];
      socket.send(JSON.stringify({ type: 'subscribe', id: subId, channel, params }));
    });
  };
  
  socket.onmessage = (e) => {
    try {
      const { id, data } = JSON.parse(e.data);
      if (socketCallbacks[id]) {
        socketCallbacks[id].callback(data);
      }
    } catch (err) {
      console.warn('[WebSocket] Error parsing message:', err);
    }
  };
  
  socket.onclose = () => {
    console.log('[WebSocket] Connection closed. Reconnecting in 3s...');
    setTimeout(getSocket, 3000);
  };
  
  socket.onerror = (err) => {
    console.warn('[WebSocket] Error:', err);
  };
  
  return socket;
};

const subscribeWebSocket = (channel, params, callback) => {
  const subId = `${channel}_${JSON.stringify(params || {})}_${Math.random().toString(36).substring(7)}`;
  socketCallbacks[subId] = { channel, params, callback };
  
  const ws = getSocket();
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({ type: 'subscribe', id: subId, channel, params }));
  }
  
  return () => {
    delete socketCallbacks[subId];
    if (socket && socket.readyState === 1) {
      socket.send(JSON.stringify({ type: 'unsubscribe', id: subId }));
    }
  };
};

const makeRequest = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`[Backend API] Request failed for ${method} ${url}:`, err.message);
    throw err;
  }
};

// --- OFFLINE STATE STORE MANAGERS ---
const localAuthCallbacks = {};
const activeSubscriptions = {}; // key -> array of callbacks

const triggerLocalAuthChange = (user) => {
  Object.values(localAuthCallbacks).forEach(cb => cb(user));
};

const triggerLocalSubscription = (key, data) => {
  if (activeSubscriptions[key]) {
    activeSubscriptions[key].forEach(cb => cb(data));
  }
};

const getOfflineData = async (key, defaultValue = null) => {
  try {
    const val = await AsyncStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (err) {
    console.error('Offline storage read error:', err);
    return defaultValue;
  }
};

const setOfflineData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Offline storage write error:', err);
  }
};

// Seed database collections in Firestore if they are empty
const seedFirestoreIfEmpty = async () => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const reqSnap = await getDocs(query(collection(db, 'requests'), limit(1)));
    if (reqSnap.empty) {
      console.log('[Firebase] Seeding initial requests...');
      for (const req of initialRequests) {
        await addDoc(collection(db, 'requests'), { ...req, createdAt: new Date().toISOString() });
      }
    }
  } catch (error) {
    console.warn('[Firebase] Seeding failed/refused:', error);
  }
};

// Initial database seeding trigger
setTimeout(() => {
  seedFirestoreIfEmpty();
}, 2000);

export const api = {
  // Connection Mode Indicators
  firebaseActive: isFirebaseConfigured,
  backendActive: isBackendConfigured,

  // --- AUTHENTICATION ---
  auth: {
    login: async (email, password) => {
      if (isBackendConfigured) {
        const sessionUser = await makeRequest(`${BACKEND_URL}/api/auth/login`, 'POST', { email, password });
        await AsyncStorage.setItem('autosphere_current_session', JSON.stringify(sessionUser));
        triggerLocalAuthChange(sessionUser);
        return sessionUser;
      }
      if (isFirebaseConfigured && auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          return { uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() };
        }
        return { uid: firebaseUser.uid, email: firebaseUser.email };
      } else {
        const users = await getOfflineData('autosphere_users', defaultMockUsers);
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (!foundUser) {
          throw new Error('Invalid email or password.');
        }
        const sessionUser = { uid: foundUser.uid, email: foundUser.email, ...foundUser.profile };
        await setOfflineData('autosphere_current_session', sessionUser);
        triggerLocalAuthChange(sessionUser);
        return sessionUser;
      }
    },

    register: async (name, email, phone, password) => {
      if (isBackendConfigured) {
        const sessionUser = await makeRequest(`${BACKEND_URL}/api/auth/register`, 'POST', { name, email, phone, password });
        await AsyncStorage.setItem('autosphere_current_session', JSON.stringify(sessionUser));
        triggerLocalAuthChange(sessionUser);
        return sessionUser;
      }
      if (isFirebaseConfigured && auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const initialProfile = {
          fullName: name,
          email: email,
          phone: phone,
          profilePhoto: null,
          businessName: '',
          businessLogo: null,
          address: '',
          workingHours: '08:00 AM - 06:00 PM',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          serviceArea: '',
          serviceRadius: 10,
          providerType: null,
          documents: {
            identityDoc: null,
            businessReg: null,
            license: null,
            certificates: null,
            status: 'Pending',
            reviewNotes: 'Upload your documents to submit your application.'
          }
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), initialProfile);
        return { uid: firebaseUser.uid, email: firebaseUser.email, ...initialProfile };
      } else {
        const users = await getOfflineData('autosphere_users', defaultMockUsers);
        const alreadyExists = users.some(u => u.email === email);
        if (alreadyExists) {
          throw new Error('An account with this email already exists.');
        }
        const newUid = 'usr-' + Math.floor(Math.random() * 900000 + 100000);
        const initialProfile = {
          fullName: name,
          email: email,
          phone: phone,
          profilePhoto: null,
          businessName: '',
          businessLogo: null,
          address: '',
          workingHours: '08:00 AM - 06:00 PM',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          serviceArea: '',
          serviceRadius: 10,
          providerType: null,
          documents: {
            identityDoc: null,
            businessReg: null,
            license: null,
            certificates: null,
            status: 'Pending',
            reviewNotes: 'Upload your documents to submit your application.'
          }
        };

        users.push({ uid: newUid, email, password, profile: initialProfile });
        await setOfflineData('autosphere_users', users);
        const sessionUser = { uid: newUid, email, ...initialProfile };
        await setOfflineData('autosphere_current_session', sessionUser);
        triggerLocalAuthChange(sessionUser);
        
        const localReqs = await getOfflineData('autosphere_requests');
        if (!localReqs) {
          await setOfflineData('autosphere_requests', initialRequests);
        }
        return sessionUser;
      }
    },

    logout: async () => {
      if (isBackendConfigured) {
        await AsyncStorage.removeItem('autosphere_current_session');
        triggerLocalAuthChange(null);
        return;
      }
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      } else {
        await AsyncStorage.removeItem('autosphere_current_session');
        triggerLocalAuthChange(null);
      }
    },

    onAuthStateChanged: (callback) => {
      if (isBackendConfigured) {
        getOfflineData('autosphere_current_session').then(session => {
          callback(session);
        });

        const id = Math.random().toString(36).substring(7);
        localAuthCallbacks[id] = callback;

        let unsubWS = () => {};
        getOfflineData('autosphere_current_session').then(session => {
          if (session && session.uid) {
            unsubWS = subscribeWebSocket('profile', { uid: session.uid }, (updatedProfile) => {
              if (updatedProfile) {
                const newSession = { ...session, ...updatedProfile };
                setOfflineData('autosphere_current_session', newSession);
                triggerLocalAuthChange(newSession);
              }
            });
          }
        });

        return () => {
          delete localAuthCallbacks[id];
          unsubWS();
        };
      }
      if (isFirebaseConfigured && auth) {
        return onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const profileRef = doc(db, 'users', firebaseUser.uid);
            const unsubProfile = onSnapshot(profileRef, (snap) => {
              if (snap.exists()) {
                callback({ uid: firebaseUser.uid, email: firebaseUser.email, ...snap.data() });
              } else {
                callback({ uid: firebaseUser.uid, email: firebaseUser.email });
              }
            });
            return () => unsubProfile();
          } else {
            callback(null);
          }
        });
      } else {
        getOfflineData('autosphere_current_session').then(session => {
          callback(session);
        });

        const id = Math.random().toString(36).substring(7);
        localAuthCallbacks[id] = callback;
        return () => {
          delete localAuthCallbacks[id];
        };
      }
    }
  },

  // --- PROFILE ---
  profile: {
    updateProfile: async (uid, profileData) => {
      if (isBackendConfigured) {
        const updatedUser = await makeRequest(`${BACKEND_URL}/api/profile/${uid}`, 'PUT', profileData);
        const session = await getOfflineData('autosphere_current_session');
        if (session && session.uid === uid) {
          const newSession = { ...session, ...profileData };
          await setOfflineData('autosphere_current_session', newSession);
          triggerLocalAuthChange(newSession);
        }
        return updatedUser;
      }
      if (isFirebaseConfigured && db) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, profileData);
      } else {
        const users = await getOfflineData('autosphere_users', defaultMockUsers);
        const userIndex = users.findIndex(u => u.uid === uid);
        if (userIndex !== -1) {
          users[userIndex].profile = { ...users[userIndex].profile, ...profileData };
          await setOfflineData('autosphere_users', users);
        }
        const session = await getOfflineData('autosphere_current_session');
        if (session && session.uid === uid) {
          const updatedSession = { ...session, ...profileData };
          await setOfflineData('autosphere_current_session', updatedSession);
          triggerLocalAuthChange(updatedSession);
        }
      }
    }
  },

  // --- DOCUMENTS / VERIFICATION ---
  documents: {
    uploadDocument: async (uid, docKey, fileName) => {
      if (isBackendConfigured) {
        const updatedUser = await makeRequest(`${BACKEND_URL}/api/documents/upload`, 'POST', { uid, docKey, fileName });
        const session = await getOfflineData('autosphere_current_session');
        if (session && session.uid === uid) {
          const newSession = { ...session, documents: updatedUser.documents };
          await setOfflineData('autosphere_current_session', newSession);
          triggerLocalAuthChange(newSession);
        }
        return updatedUser;
      }
      if (isFirebaseConfigured && db) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
          [`documents.${docKey}`]: fileName
        });
      } else {
        const session = await getOfflineData('autosphere_current_session');
        if (session && session.uid === uid) {
          const updatedDocs = { ...session.documents, [docKey]: fileName };
          const isBusiness = [
            'Taxi Company', 'Garage', 'Service Station', 'Spare Parts Seller',
            'Vehicle Rental', 'Bus Operator', 'Parking Service', 'Car Wash Service'
          ].includes(session.providerType);
          const allUploaded = updatedDocs.identityDoc && updatedDocs.license && (!isBusiness || updatedDocs.businessReg);
          if (allUploaded) {
            updatedDocs.status = 'Pending';
          }
          await api.profile.updateProfile(uid, { documents: updatedDocs });
        }
      }
    },
    submitForVerification: async (uid) => {
      if (isBackendConfigured) {
        const updatedUser = await makeRequest(`${BACKEND_URL}/api/documents/verify`, 'POST', { uid });
        const session = await getOfflineData('autosphere_current_session');
        if (session && session.uid === uid) {
          const newSession = { ...session, documents: updatedUser.documents };
          await setOfflineData('autosphere_current_session', newSession);
          triggerLocalAuthChange(newSession);
        }
        return updatedUser;
      }
      const updateObj = {
        'documents.status': 'Pending',
        'documents.reviewNotes': 'Our support team is reviewing your uploaded credentials. This usually takes 24 hours.'
      };
      if (isFirebaseConfigured && db) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, updateObj);
      } else {
        const session = await getOfflineData('autosphere_current_session');
        if (session && session.uid === uid) {
          const updatedDocs = { 
            ...session.documents, 
            status: 'Pending', 
            reviewNotes: 'Our support team is reviewing your uploaded credentials. This usually takes 24 hours.' 
          };
          await api.profile.updateProfile(uid, { documents: updatedDocs });
        }
      }
    }
  },

  // --- SERVICE DISPATCH REQUESTS ---
  requests: {
    subscribeRequests: (providerType, uid, callback) => {
      if (isBackendConfigured) {
        return subscribeWebSocket('requests', { providerType, uid }, callback);
      }
      if (isFirebaseConfigured && db) {
        const q = query(collection(db, 'requests'), where('type', '==', providerType));
        return onSnapshot(q, (snap) => {
          const reqs = [];
          snap.forEach(docSnap => {
            const reqData = docSnap.data();
            if (reqData.status === 'Pending' || reqData.providerId === uid) {
              reqs.push({ id: docSnap.id, ...reqData });
            }
          });
          callback(reqs);
        });
      } else {
        const subKey = `requests_${providerType}_${uid}`;
        if (!activeSubscriptions[subKey]) activeSubscriptions[subKey] = [];
        activeSubscriptions[subKey].push(callback);

        const emitData = async () => {
          const reqs = await getOfflineData('autosphere_requests', initialRequests);
          const filtered = reqs.filter(r => r.type === providerType && (r.status === 'Pending' || r.providerId === uid));
          callback(filtered);
        };
        emitData();

        return () => {
          activeSubscriptions[subKey] = activeSubscriptions[subKey].filter(cb => cb !== callback);
        };
      }
    },

    acceptRequest: async (requestId, uid, customerName) => {
      if (isBackendConfigured) {
        return await makeRequest(`${BACKEND_URL}/api/requests/${requestId}/accept`, 'PUT', { uid, customerName });
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const historyUpdate = { time: timeStr, event: 'Request accepted by provider' };

      if (isFirebaseConfigured && db) {
        const reqRef = doc(db, 'requests', requestId);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          const currentHist = reqSnap.data().history || [];
          await updateDoc(reqRef, {
            status: 'Accepted',
            providerId: uid,
            history: [...currentHist, historyUpdate]
          });
        }
        await addDoc(collection(db, 'notifications'), {
          providerId: uid,
          title: 'Request Accepted',
          body: `You accepted the request from ${customerName}.`,
          time: 'Just now',
          read: false,
          type: 'request',
          createdAt: new Date().toISOString()
        });
      } else {
        const reqs = await getOfflineData('autosphere_requests', initialRequests);
        const index = reqs.findIndex(r => r.id === requestId);
        if (index !== -1) {
          reqs[index].status = 'Accepted';
          reqs[index].providerId = uid;
          reqs[index].history = [...(reqs[index].history || []), historyUpdate];
          await setOfflineData('autosphere_requests', reqs);
          const type = reqs[index].type;
          triggerLocalSubscription(`requests_${type}_${uid}`, reqs.filter(r => r.type === type && (r.status === 'Pending' || r.providerId === uid)));
        }

        const notifications = await getOfflineData(`autosphere_notifications_${uid}`, initialNotifications);
        const newNotif = {
          id: 'nt-' + Date.now(),
          title: 'Request Accepted',
          body: `You accepted the request from ${customerName}.`,
          time: 'Just now',
          read: false,
          type: 'request',
          createdAt: new Date().toISOString()
        };
        notifications.unshift(newNotif);
        await setOfflineData(`autosphere_notifications_${uid}`, notifications);
        triggerLocalSubscription(`notifications_${uid}`, notifications);
      }
    },

    rejectRequest: async (requestId, uid) => {
      if (isBackendConfigured) {
        return await makeRequest(`${BACKEND_URL}/api/requests/${requestId}/reject`, 'PUT', { uid });
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const historyUpdate = { time: timeStr, event: 'Request declined by provider' };

      if (isFirebaseConfigured && db) {
        const reqRef = doc(db, 'requests', requestId);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          const currentHist = reqSnap.data().history || [];
          await updateDoc(reqRef, {
            status: 'Cancelled',
            history: [...currentHist, historyUpdate]
          });
        }
      } else {
        const reqs = await getOfflineData('autosphere_requests', initialRequests);
        const index = reqs.findIndex(r => r.id === requestId);
        if (index !== -1) {
          reqs[index].status = 'Cancelled';
          reqs[index].history = [...(reqs[index].history || []), historyUpdate];
          await setOfflineData('autosphere_requests', reqs);
          const type = reqs[index].type;
          triggerLocalSubscription(`requests_${type}_${uid}`, reqs.filter(r => r.type === type && (r.status === 'Pending' || r.providerId === uid)));
        }
      }
    },

    startService: async (requestId, uid) => {
      if (isBackendConfigured) {
        return await makeRequest(`${BACKEND_URL}/api/requests/${requestId}/start`, 'PUT', { uid });
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const historyUpdate = { time: timeStr, event: 'Service in progress' };

      if (isFirebaseConfigured && db) {
        const reqRef = doc(db, 'requests', requestId);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          const currentHist = reqSnap.data().history || [];
          await updateDoc(reqRef, {
            status: 'In Progress',
            history: [...currentHist, historyUpdate]
          });
        }
      } else {
        const reqs = await getOfflineData('autosphere_requests', initialRequests);
        const index = reqs.findIndex(r => r.id === requestId);
        if (index !== -1) {
          reqs[index].status = 'In Progress';
          reqs[index].history = [...(reqs[index].history || []), historyUpdate];
          await setOfflineData('autosphere_requests', reqs);
          const type = reqs[index].type;
          triggerLocalSubscription(`requests_${type}_${uid}`, reqs.filter(r => r.type === type && (r.status === 'Pending' || r.providerId === uid)));
        }
      }
    },

    completeService: async (requestId, uid, fare, customerName, serviceDetails) => {
      if (isBackendConfigured) {
        return await makeRequest(`${BACKEND_URL}/api/requests/${requestId}/complete`, 'PUT', { uid, fare, customerName, serviceDetails });
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const historyUpdate = { time: timeStr, event: 'Service marked as completed' };

      if (isFirebaseConfigured && db) {
        const reqRef = doc(db, 'requests', requestId);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          const currentHist = reqSnap.data().history || [];
          await updateDoc(reqRef, {
            status: 'Completed',
            history: [...currentHist, historyUpdate]
          });
        }
      } else {
        const reqs = await getOfflineData('autosphere_requests', initialRequests);
        const index = reqs.findIndex(r => r.id === requestId);
        if (index !== -1) {
          reqs[index].status = 'Completed';
          reqs[index].history = [...(reqs[index].history || []), historyUpdate];
          await setOfflineData('autosphere_requests', reqs);
          const type = reqs[index].type;
          triggerLocalSubscription(`requests_${type}_${uid}`, reqs.filter(r => r.type === type && (r.status === 'Pending' || r.providerId === uid)));
        }

        const notifications = await getOfflineData(`autosphere_notifications_${uid}`, initialNotifications);
        const newNotif = {
          id: 'nt-' + Date.now(),
          title: 'Job Completed',
          body: `You successfully completed the service for ${customerName}.`,
          time: 'Just now',
          read: false,
          type: 'system',
          createdAt: new Date().toISOString()
        };
        notifications.unshift(newNotif);
        await setOfflineData(`autosphere_notifications_${uid}`, notifications);
        triggerLocalSubscription(`notifications_${uid}`, notifications);
      }
    },

    createMockDispatchOrder: async (providerType, customerName, fare, serviceDetails, extraFields = {}) => {
      if (isBackendConfigured) {
        return await makeRequest(`${BACKEND_URL}/api/requests/mock`, 'POST', { providerType, customerName, fare, serviceDetails, extraFields });
      }
      const idNum = Math.floor(Math.random() * 900) + 100;
      const newReq = {
        id: `req-${idNum}`,
        type: providerType,
        customerName: customerName,
        customerPhone: '+1 (555) 753-9514',
        pickupLocation: 'Centennial Arena Hall D',
        time: 'Just now',
        notes: 'Urgent service request. Settle via card.',
        fare: fare,
        status: 'Pending',
        serviceDetails: serviceDetails,
        history: [{ time: 'Just now', event: 'Request triggered by customer via dispatch' }],
        ...extraFields
      };

      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'requests'), { ...newReq, createdAt: new Date().toISOString() });
      } else {
        const reqs = await getOfflineData('autosphere_requests', initialRequests);
        reqs.unshift(newReq);
        await setOfflineData('autosphere_requests', reqs);
        const currentSession = await getOfflineData('autosphere_current_session');
        if (currentSession && currentSession.providerType === providerType) {
          triggerLocalSubscription(`requests_${providerType}_${currentSession.uid}`, reqs.filter(r => r.type === providerType && (r.status === 'Pending' || r.providerId === currentSession.uid)));
        }
      }
    }
  },

  // --- NOTIFICATIONS ---
  notifications: {
    subscribeNotifications: (uid, callback) => {
      if (isBackendConfigured) {
        return subscribeWebSocket('notifications', { uid }, callback);
      }
      if (isFirebaseConfigured && db) {
        const q = query(
          collection(db, 'notifications'), 
          where('providerId', '==', uid)
        );
        return onSnapshot(q, (snap) => {
          const list = [];
          snap.forEach(docSnap => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          callback(list);
        });
      } else {
        const subKey = `notifications_${uid}`;
        if (!activeSubscriptions[subKey]) activeSubscriptions[subKey] = [];
        activeSubscriptions[subKey].push(callback);

        getOfflineData(`autosphere_notifications_${uid}`, initialNotifications).then(list => {
          callback(list);
        });

        return () => {
          activeSubscriptions[subKey] = activeSubscriptions[subKey].filter(cb => cb !== callback);
        };
      }
    },

    markAsRead: async (notificationId, uid) => {
      if (isBackendConfigured) {
        return await makeRequest(`${BACKEND_URL}/api/notifications/${notificationId}/read`, 'POST', { uid });
      }
      if (isFirebaseConfigured && db) {
        const notifRef = doc(db, 'notifications', notificationId);
        await updateDoc(notifRef, { read: true });
      } else {
        const list = await getOfflineData(`autosphere_notifications_${uid}`, initialNotifications);
        const index = list.findIndex(n => n.id === notificationId);
        if (index !== -1) {
          list[index].read = true;
          await setOfflineData(`autosphere_notifications_${uid}`, list);
          triggerLocalSubscription(`notifications_${uid}`, list);
        }
      }
    },

    clearAll: async (uid) => {
      if (isBackendConfigured) {
        return await makeRequest(`${BACKEND_URL}/api/notifications/clear`, 'POST', { uid });
      }
      if (isFirebaseConfigured && db) {
        const q = query(collection(db, 'notifications'), where('providerId', '==', uid));
        const snap = await getDocs(q);
        for (const docSnap of snap.docs) {
          await deleteDoc(doc(db, 'notifications', docSnap.id));
        }
      } else {
        await setOfflineData(`autosphere_notifications_${uid}`, []);
        triggerLocalSubscription(`notifications_${uid}`, []);
      }
    }
  },

  // --- REVIEWS ---
  reviews: {
    subscribeReviews: (uid, callback) => {
      if (isBackendConfigured) {
        return subscribeWebSocket('reviews', { uid }, callback);
      }
      if (isFirebaseConfigured && db) {
        const q = query(collection(db, 'reviews'), where('providerId', '==', uid));
        return onSnapshot(q, (snap) => {
          const list = [];
          snap.forEach(docSnap => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          if (list.length === 0) {
            callback(initialReviews);
          } else {
            callback(list);
          }
        });
      } else {
        const subKey = `reviews_${uid}`;
        if (!activeSubscriptions[subKey]) activeSubscriptions[subKey] = [];
        activeSubscriptions[subKey].push(callback);

        callback(initialReviews);

        return () => {
          activeSubscriptions[subKey] = activeSubscriptions[subKey].filter(cb => cb !== callback);
        };
      }
    }
  },

  // --- PAYOUTS ---
  payouts: {
    subscribePayouts: (uid, callback) => {
      if (isBackendConfigured) {
        return subscribeWebSocket('payouts', { uid }, callback);
      }
      if (isFirebaseConfigured && db) {
        const q = query(collection(db, 'payouts'), where('providerId', '==', uid));
        return onSnapshot(q, (snap) => {
          const list = [];
          snap.forEach(docSnap => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          callback(list);
        });
      } else {
        const subKey = `payouts_${uid}`;
        if (!activeSubscriptions[subKey]) activeSubscriptions[subKey] = [];
        activeSubscriptions[subKey].push(callback);

        getOfflineData(`autosphere_payouts_${uid}`, []).then(list => {
          callback(list);
        });

        return () => {
          activeSubscriptions[subKey] = activeSubscriptions[subKey].filter(cb => cb !== callback);
        };
      }
    },
    createPayout: async (uid, amount) => {
      if (isBackendConfigured) {
        return await makeRequest(`${BACKEND_URL}/api/payouts`, 'POST', { uid, amount });
      }
      const payoutObj = {
        providerId: uid,
        amount: amount,
        title: 'Payout to Bank Account',
        date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        status: 'Processing',
        createdAt: new Date().toISOString()
      };
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'payouts'), payoutObj);
      } else {
        const list = await getOfflineData(`autosphere_payouts_${uid}`, []);
        const newPayout = { id: 'po-' + Date.now(), ...payoutObj };
        list.unshift(newPayout);
        await setOfflineData(`autosphere_payouts_${uid}`, list);
        triggerLocalSubscription(`payouts_${uid}`, list);
      }
    }
  },

  // --- CHAT MESSAGES ---
  chat: {
    subscribeMessages: (requestId, callback) => {
      if (isBackendConfigured) {
        return subscribeWebSocket('chat', { requestId }, callback);
      }
      if (isFirebaseConfigured && db) {
        const q = query(
          collection(db, 'messages'), 
          where('requestId', '==', requestId),
          orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, (snap) => {
          const list = [];
          snap.forEach(docSnap => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          callback(list);
        });
      } else {
        const subKey = `chat_${requestId}`;
        if (!activeSubscriptions[subKey]) activeSubscriptions[subKey] = [];
        activeSubscriptions[subKey].push(callback);

        getOfflineData(`autosphere_chat_${requestId}`, []).then(list => {
          callback(list);
        });

        return () => {
          activeSubscriptions[subKey] = activeSubscriptions[subKey].filter(cb => cb !== callback);
        };
      }
    },
    sendMessage: async (requestId, uid, sender, text) => {
      if (isBackendConfigured) {
        return await makeRequest(`${BACKEND_URL}/api/chat/${requestId}`, 'POST', { uid, sender, text });
      }
      const msgObj = {
        requestId,
        sender,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString()
      };
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'messages'), msgObj);
      } else {
        const list = await getOfflineData(`autosphere_chat_${requestId}`, []);
        const newMsg = { id: 'msg-' + Date.now(), ...msgObj };
        list.push(newMsg);
        await setOfflineData(`autosphere_chat_${requestId}`, list);
        triggerLocalSubscription(`chat_${requestId}`, list);
      }
    }
  }
};
