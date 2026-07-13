export const initialRequests = [
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

export const initialReviews = [
  { id: 'rev-1', author: 'Sarah Jenkins', rating: 5, date: 'Today', comment: 'Extremely polite, clean car, arrived 5 minutes early. Highly recommended!', service: 'Ride to Terminal 2' },
  { id: 'rev-2', author: 'David Miller', rating: 4, date: 'Yesterday', comment: 'Good service at the garage. Explained the issues clearly, though it took 15 minutes longer than estimated.', service: 'Oil Change' },
  { id: 'rev-3', author: 'Robert Ford', rating: 5, date: '3 days ago', comment: 'The spare headlight arrived intact and fits perfectly. Original OEM parts indeed!', service: 'Headlight Assembly' },
  { id: 'rev-4', author: 'Jessica Taylor', rating: 5, date: '1 week ago', comment: 'Excellent ride! Professional driver and very smooth navigation through rush hour traffic.', service: 'Ride to Downtown' }
];

export const initialNotifications = [
  { id: 'nt-1', title: 'New Booking Request', body: 'Sarah Jenkins requested a ride (3.5 miles). Earn $18.50.', time: 'Just now', read: false, type: 'request' },
  { id: 'nt-2', title: 'Payout Successful', body: 'Your weekly earnings of $450.00 have been deposited to your account.', time: '2 hours ago', read: true, type: 'payment' },
  { id: 'nt-3', title: 'Verification Update', body: 'Your Identity Document has been verified successfully.', time: '1 day ago', read: true, type: 'system' },
  { id: 'nt-4', title: '5-Star Review Received', body: 'Jessica Taylor left a 5-star review for your ride service.', time: '1 week ago', read: true, type: 'review' }
];

export const defaultMockUsers = [
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
