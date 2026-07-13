require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autosphere';

// --- DATABASE CONNECTION ---
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('[MongoDB] Connected successfully to', MONGODB_URI);
    seedDatabase();
  })
  .catch(err => {
    console.error('[MongoDB] Connection error:', err);
  });

// --- SCHEMAS & MODELS ---
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  fullName: { type: String },
  phone: { type: String },
  profilePhoto: { type: String },
  businessName: { type: String },
  businessLogo: { type: String },
  address: { type: String },
  workingHours: { type: String },
  workingDays: [{ type: String }],
  serviceArea: { type: String },
  serviceRadius: { type: Number },
  providerType: { type: String },
  documents: {
    identityDoc: { type: String, default: null },
    businessReg: { type: String, default: null },
    license: { type: String, default: null },
    certificates: { type: String, default: null },
    status: { type: String, default: 'Pending' },
    reviewNotes: { type: String, default: 'Upload your documents to submit your application.' }
  }
});
const User = mongoose.model('User', userSchema);

const requestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String },
  customerName: { type: String },
  customerPhone: { type: String },
  serviceDetails: { type: String },
  pickupLocation: { type: String },
  dropoffLocation: { type: String },
  vehicleDetails: { type: String },
  partNumber: { type: String },
  time: { type: String },
  notes: { type: String },
  fare: { type: Number },
  status: { type: String, default: 'Pending' },
  providerId: { type: String, default: null },
  history: [{ time: String, event: String }],
  createdAt: { type: Date, default: Date.now }
});
const Request = mongoose.model('Request', requestSchema);

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  providerId: { type: String, required: true },
  title: { type: String },
  body: { type: String },
  time: { type: String },
  read: { type: Boolean, default: false },
  type: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  author: { type: String },
  rating: { type: Number },
  date: { type: String },
  comment: { type: String },
  service: { type: String },
  providerId: { type: String, default: null }
});
const Review = mongoose.model('Review', reviewSchema);

const payoutSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  providerId: { type: String, required: true },
  amount: { type: Number },
  title: { type: String },
  date: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Payout = mongoose.model('Payout', payoutSchema);

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  requestId: { type: String, required: true },
  sender: { type: String },
  text: { type: String },
  time: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// --- SEED DATA ---
const initialRequests = [
  {
    id: 'req-101',
    type: 'Taxi Driver',
    customerName: 'Nuwan Perera',
    customerPhone: '+94 77 123 4567',
    serviceDetails: 'Ride: Premium Sedan (5.6 km)',
    pickupLocation: 'Galle Face Green, Colombo 03',
    dropoffLocation: 'Bambalapitiya, Colombo 04',
    time: 'Just now',
    notes: 'Please open trunk for luggage.',
    fare: 1200.00,
    status: 'Pending',
    history: [{ time: '18:14', event: 'Request created by customer' }]
  },
  {
    id: 'req-102',
    type: 'Taxi Driver',
    customerName: 'Dilhan Fernando',
    customerPhone: '+94 71 987 6543',
    serviceDetails: 'Ride: Standard Ride (13 km)',
    pickupLocation: 'Majestic City, Bambalapitiya',
    dropoffLocation: 'Bandaranaike International Airport (BIA)',
    time: '1 hour ago',
    notes: 'Flight is in 2 hours, please be on time.',
    fare: 6500.00,
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
    customerName: 'Sanduni Gunawardena',
    customerPhone: '+94 76 543 2109',
    serviceDetails: 'Full Brake Pad Replacement & Rotor Polish',
    vehicleDetails: '2021 Suzuki Alto (Silver)',
    pickupLocation: 'Customer Home (15 km away) - Home Pickup Service',
    time: 'Scheduled for Tomorrow, 10:00 AM',
    notes: 'Squeaking noise when braking at low speed.',
    fare: 18000.00,
    status: 'Pending',
    history: [{ time: '16:30', event: 'Appointment requested' }]
  },
  {
    id: 'req-202',
    type: 'Garage',
    customerName: 'Kasun Jayawardene',
    customerPhone: '+94 72 345 6789',
    serviceDetails: 'Engine Oil Change & Filter Replacement',
    vehicleDetails: '2019 Honda Vezel (Black)',
    pickupLocation: 'Garage Workshop (Self-Drop)',
    time: 'Today, 2:00 PM',
    notes: 'Use synthetic 0W-20 oil.',
    fare: 12500.00,
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
    customerName: 'Priyantha Silva',
    customerPhone: '+94 75 876 5432',
    serviceDetails: 'OEM Headlight Assembly (Left Side)',
    partNumber: 'HL-TOY-RAV4-21L',
    pickupLocation: 'Shipping: 45 Galle Road, Colombo 03',
    time: '15 mins ago',
    notes: 'Ensure standard protective packaging.',
    fare: 35000.00,
    status: 'Pending',
    history: [{ time: '17:59', event: 'Order placed' }]
  },
  {
    id: 'req-302',
    type: 'Spare Parts Seller',
    customerName: 'Lanka Auto Works',
    customerPhone: '+94 11 234 5678',
    serviceDetails: 'Spark Plugs Pack of 4 & Air Filter',
    partNumber: 'SP-NGK-7742 / AF-HON-19',
    pickupLocation: 'Store Pickup',
    time: '2 hours ago',
    notes: 'Mechanic will pick it up at 5:00 PM.',
    fare: 9500.00,
    status: 'Accepted',
    providerId: 'demo-provider-uid',
    history: [{ time: '16:10', event: 'Order confirmed and packed' }]
  }
];

const initialReviews = [
  { id: 'rev-1', author: 'Nuwan Perera', rating: 5, date: 'Today', comment: 'Extremely polite, clean car, arrived 5 minutes early. Highly recommended!', service: 'Ride to Bambalapitiya' },
  { id: 'rev-2', author: 'Kasun Jayawardene', rating: 4, date: 'Yesterday', comment: 'Good service at the garage. Explained the issues clearly, though it took 15 minutes longer than estimated.', service: 'Oil Change' },
  { id: 'rev-3', author: 'Priyantha Silva', rating: 5, date: '3 days ago', comment: 'The spare headlight arrived intact and fits perfectly. Original OEM parts indeed!', service: 'Headlight Assembly' },
  { id: 'rev-4', author: 'Sanduni Gunawardena', rating: 5, date: '1 week ago', comment: 'Excellent ride! Professional driver and very smooth navigation through rush hour traffic.', service: 'Ride to Galle Face' }
];

const initialNotifications = [
  { id: 'nt-1', title: 'New Booking Request', body: 'Nuwan Perera requested a ride (5.6 km). Earn Rs. 1,200.00.', time: 'Just now', read: false, type: 'request' },
  { id: 'nt-2', title: 'Payout Successful', body: 'Your weekly earnings of Rs. 45,000.00 have been deposited to your account.', time: '2 hours ago', read: true, type: 'payment' },
  { id: 'nt-3', title: 'Verification Update', body: 'Your Identity Document has been verified successfully.', time: '1 day ago', read: true, type: 'system' },
  { id: 'nt-4', title: '5-Star Review Received', body: 'Sanduni Gunawardena left a 5-star review for your ride service.', time: '1 week ago', read: true, type: 'review' }
];

const defaultMockUsers = [
  {
    uid: 'demo-provider-uid',
    email: 'roshan.ranasinghe@autosphere.eco',
    password: 'password123',
    fullName: 'Roshan Ranasinghe',
    phone: '+94 77 789 0123',
    profilePhoto: '👨‍✈️',
    businessName: 'Ranasinghe Auto Repairs',
    businessLogo: '🛠️',
    address: 'No. 742, Galle Road, Colombo 03',
    workingHours: '08:00 AM - 06:00 PM',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    serviceArea: 'Colombo Metro Area',
    serviceRadius: 25,
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
];

// --- SEED FUNCTION ---
async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB] Seeding default users...');
      await User.insertMany(defaultMockUsers);
    }
    
    const requestCount = await Request.countDocuments();
    if (requestCount === 0) {
      console.log('[MongoDB] Seeding initial requests...');
      await Request.insertMany(initialRequests);
    }

    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('[MongoDB] Seeding initial reviews...');
      await Review.insertMany(initialReviews);
    }

    const notificationCount = await Notification.countDocuments();
    if (notificationCount === 0) {
      console.log('[MongoDB] Seeding initial notifications...');
      // Map seed notifications to the demo-provider-uid
      const notifsWithUid = initialNotifications.map(n => ({ ...n, providerId: 'demo-provider-uid' }));
      await Notification.insertMany(notifsWithUid);
    }
    
    console.log('[MongoDB] Database seeding checked/completed.');
  } catch (err) {
    console.warn('[MongoDB] Seeding error:', err);
  }
}

// --- HTTP SERVER & WEBSOCKET SETUP ---
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

async function fetchSubData(channel, params) {
  try {
    switch (channel) {
      case 'requests': {
        return await Request.find({
          type: params.providerType,
          $or: [{ status: 'Pending' }, { providerId: params.uid }]
        }).sort({ createdAt: -1 });
      }
      case 'notifications': {
        return await Notification.find({ providerId: params.uid }).sort({ createdAt: -1 });
      }
      case 'reviews': {
        // Return user reviews or default reviews if empty
        const list = await Review.find({ $or: [{ providerId: params.uid }, { providerId: null }] });
        if (list.length === 0) return initialReviews;
        return list;
      }
      case 'payouts': {
        return await Payout.find({ providerId: params.uid }).sort({ createdAt: -1 });
      }
      case 'chat': {
        return await Message.find({ requestId: params.requestId }).sort({ createdAt: 1 });
      }
      case 'profile': {
        const userObj = await User.findOne({ uid: params.uid });
        if (userObj) {
          const user = userObj.toObject();
          delete user.password;
          return user;
        }
        return null;
      }
      default:
        return null;
    }
  } catch (err) {
    console.error(`Error fetching data for sub channel ${channel}:`, err);
    return null;
  }
}

async function notifySubscribers(channel, matchFn) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN && client.subscriptions) {
      for (const [subId, sub] of Object.entries(client.subscriptions)) {
        if (sub.channel === channel && (!matchFn || matchFn(sub.params))) {
          const data = await fetchSubData(sub.channel, sub.params);
          client.send(JSON.stringify({ id: subId, data }));
        }
      }
    }
  }
}

wss.on('connection', (ws) => {
  ws.subscriptions = {};

  ws.on('message', async (message) => {
    try {
      const msg = JSON.parse(message);
      if (msg.type === 'subscribe') {
        const { id, channel, params } = msg;
        ws.subscriptions[id] = { channel, params };
        const data = await fetchSubData(channel, params);
        ws.send(JSON.stringify({ id, data }));
      } else if (msg.type === 'unsubscribe') {
        const { id } = msg;
        delete ws.subscriptions[id];
      }
    } catch (err) {
      console.error('[WebSocket] Error processing message:', err);
    }
  });
});

// --- REST ENDPOINTS ---

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const sessionUser = user.toObject();
    delete sessionUser.password;
    res.json(sessionUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Auth: Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    const newUid = 'usr-' + Math.floor(Math.random() * 900000 + 100000);
    const newUser = new User({
      uid: newUid,
      email,
      password,
      fullName: name,
      phone,
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
    });
    await newUser.save();
    
    // Seed standard request pool if it's the first registering user
    const requestCount = await Request.countDocuments();
    if (requestCount === 0) {
      await Request.insertMany(initialRequests);
    }

    const sessionUser = newUser.toObject();
    delete sessionUser.password;
    res.status(201).json(sessionUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Profile: Get user profile
app.get('/api/profile/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Profile: Update profile
app.put('/api/profile/:uid', async (req, res) => {
  const { uid } = req.params;
  const updateData = req.body;
  try {
    let user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Handle nested doc updates
    if (updateData.documents) {
      updateData.documents = {
        ...user.documents,
        ...updateData.documents
      };
    }

    Object.assign(user, updateData);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);

    // Notify listeners
    notifySubscribers('profile', params => params.uid === uid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Documents: Upload
app.post('/api/documents/upload', async (req, res) => {
  const { uid, docKey, fileName } = req.body;
  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const updatedDocs = { ...user.documents, [docKey]: fileName };
    const isBusiness = [
      'Taxi Company', 'Garage', 'Service Station', 'Spare Parts Seller',
      'Vehicle Rental', 'Bus Operator', 'Parking Service', 'Car Wash Service'
    ].includes(user.providerType);
    
    const allUploaded = updatedDocs.identityDoc && updatedDocs.license && (!isBusiness || updatedDocs.businessReg);
    if (allUploaded) {
      updatedDocs.status = 'Pending';
    }

    user.documents = updatedDocs;
    await user.save();
    
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);

    // Notify listeners
    notifySubscribers('profile', params => params.uid === uid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Documents: Submit for verification
app.post('/api/documents/verify', async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.documents = {
      ...user.documents,
      status: 'Pending',
      reviewNotes: 'Our support team is reviewing your uploaded credentials. This usually takes 24 hours.'
    };
    await user.save();
    
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);

    // Notify listeners
    notifySubscribers('profile', params => params.uid === uid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request: Accept
app.put('/api/requests/:requestId/accept', async (req, res) => {
  const { requestId } = req.params;
  const { uid, customerName } = req.body;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const historyUpdate = { time: timeStr, event: 'Request accepted by provider' };

  try {
    const request = await Request.findOne({ id: requestId });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.status = 'Accepted';
    request.providerId = uid;
    request.history.push(historyUpdate);
    await request.save();

    // Create notification
    const newNotif = new Notification({
      id: 'nt-' + Date.now(),
      providerId: uid,
      title: 'Request Accepted',
      body: `You accepted the request from ${customerName}.`,
      time: 'Just now',
      read: false,
      type: 'request'
    });
    await newNotif.save();

    res.json(request);

    // Notify WS subscribers
    notifySubscribers('requests', params => params.providerType === request.type && (params.uid === uid || params.uid === request.providerId));
    notifySubscribers('notifications', params => params.uid === uid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request: Reject
app.put('/api/requests/:requestId/reject', async (req, res) => {
  const { requestId } = req.params;
  const { uid } = req.body;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const historyUpdate = { time: timeStr, event: 'Request declined by provider' };

  try {
    const request = await Request.findOne({ id: requestId });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.status = 'Cancelled';
    request.history.push(historyUpdate);
    await request.save();

    res.json(request);

    // Notify WS subscribers
    notifySubscribers('requests', params => params.providerType === request.type && (params.uid === uid || params.uid === request.providerId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request: Start Service
app.put('/api/requests/:requestId/start', async (req, res) => {
  const { requestId } = req.params;
  const { uid } = req.body;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const historyUpdate = { time: timeStr, event: 'Service in progress' };

  try {
    const request = await Request.findOne({ id: requestId });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.status = 'In Progress';
    request.history.push(historyUpdate);
    await request.save();

    res.json(request);

    // Notify WS subscribers
    notifySubscribers('requests', params => params.providerType === request.type && (params.uid === uid || params.uid === request.providerId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request: Complete Service
app.put('/api/requests/:requestId/complete', async (req, res) => {
  const { requestId } = req.params;
  const { uid, fare, customerName, serviceDetails } = req.body;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const historyUpdate = { time: timeStr, event: 'Service marked as completed' };

  try {
    const request = await Request.findOne({ id: requestId });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.status = 'Completed';
    request.history.push(historyUpdate);
    await request.save();

    // Create Notification
    const newNotif = new Notification({
      id: 'nt-' + Date.now(),
      providerId: uid,
      title: 'Job Completed',
      body: `You successfully completed the service for ${customerName}.`,
      time: 'Just now',
      read: false,
      type: 'system'
    });
    await newNotif.save();

    res.json(request);

    // Notify WS subscribers
    notifySubscribers('requests', params => params.providerType === request.type && (params.uid === uid || params.uid === request.providerId));
    notifySubscribers('notifications', params => params.uid === uid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request: Create Mock Order
app.post('/api/requests/mock', async (req, res) => {
  const { providerType, customerName, fare, serviceDetails, extraFields } = req.body;
  const idNum = Date.now() + Math.floor(Math.random() * 1000);
  
  const newReq = new Request({
    id: `req-${idNum}`,
    type: providerType,
    customerName,
    customerPhone: '+94 77 753 9514',
    pickupLocation: 'Galle Face Green, Colombo 03',
    time: 'Just now',
    notes: 'Urgent service request. Settle via card.',
    fare,
    status: 'Pending',
    serviceDetails,
    history: [{ time: 'Just now', event: 'Request triggered by customer via dispatch' }],
    ...extraFields
  });

  try {
    await newReq.save();
    res.status(201).json(newReq);

    // Notify matching providers
    notifySubscribers('requests', params => params.providerType === providerType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Notifications: Mark as Read
app.post('/api/notifications/:notificationId/read', async (req, res) => {
  const { notificationId } = req.params;
  const { uid } = req.body;
  try {
    const notif = await Notification.findOne({ id: notificationId });
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    
    notif.read = true;
    await notif.save();
    
    res.json(notif);
    
    // Notify WS subscribers
    notifySubscribers('notifications', params => params.uid === uid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Notifications: Clear All
app.post('/api/notifications/clear', async (req, res) => {
  const { uid } = req.body;
  try {
    await Notification.deleteMany({ providerId: uid });
    res.json({ message: 'All notifications cleared.' });
    
    // Notify WS subscribers
    notifySubscribers('notifications', params => params.uid === uid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Payouts: Create
app.post('/api/payouts', async (req, res) => {
  const { uid, amount } = req.body;
  const payoutObj = new Payout({
    id: 'po-' + Date.now(),
    providerId: uid,
    amount: amount,
    title: 'Payout to Bank Account',
    date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    status: 'Processing'
  });

  try {
    await payoutObj.save();
    res.status(201).json(payoutObj);

    // Notify WS subscribers
    notifySubscribers('payouts', params => params.uid === uid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Chat: Send Message
app.post('/api/chat/:requestId', async (req, res) => {
  const { requestId } = req.params;
  const { uid, sender, text } = req.body;
  const msgObj = new Message({
    id: 'msg-' + Date.now(),
    requestId,
    sender,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  try {
    await msgObj.save();
    res.status(201).json(msgObj);

    // Notify WS subscribers
    notifySubscribers('chat', params => params.requestId === requestId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start listening
server.listen(PORT, () => {
  console.log(`[Express] Server listening on port ${PORT}`);
});
