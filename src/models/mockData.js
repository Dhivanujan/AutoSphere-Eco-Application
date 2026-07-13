export const initialRequests = [
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

export const initialReviews = [
  { id: 'rev-1', author: 'Nuwan Perera', rating: 5, date: 'Today', comment: 'Extremely polite, clean car, arrived 5 minutes early. Highly recommended!', service: 'Ride to Bambalapitiya' },
  { id: 'rev-2', author: 'Kasun Jayawardene', rating: 4, date: 'Yesterday', comment: 'Good service at the garage. Explained the issues clearly, though it took 15 minutes longer than estimated.', service: 'Oil Change' },
  { id: 'rev-3', author: 'Priyantha Silva', rating: 5, date: '3 days ago', comment: 'The spare headlight arrived intact and fits perfectly. Original OEM parts indeed!', service: 'Headlight Assembly' },
  { id: 'rev-4', author: 'Sanduni Gunawardena', rating: 5, date: '1 week ago', comment: 'Excellent ride! Professional driver and very smooth navigation through rush hour traffic.', service: 'Ride to Galle Face' }
];

export const initialNotifications = [
  { id: 'nt-1', title: 'New Booking Request', body: 'Nuwan Perera requested a ride (5.6 km). Earn Rs. 1,200.00.', time: 'Just now', read: false, type: 'request' },
  { id: 'nt-2', title: 'Payout Successful', body: 'Your weekly earnings of Rs. 45,000.00 have been deposited to your account.', time: '2 hours ago', read: true, type: 'payment' },
  { id: 'nt-3', title: 'Verification Update', body: 'Your Identity Document has been verified successfully.', time: '1 day ago', read: true, type: 'system' },
  { id: 'nt-4', title: '5-Star Review Received', body: 'Sanduni Gunawardena left a 5-star review for your ride service.', time: '1 week ago', read: true, type: 'review' }
];

export const defaultMockUsers = [
  {
    uid: 'demo-provider-uid',
    email: 'roshan.ranasinghe@autosphere.eco',
    password: 'password123',
    profile: {
      fullName: 'Roshan Ranasinghe',
      email: 'roshan.ranasinghe@autosphere.eco',
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
  }
];
