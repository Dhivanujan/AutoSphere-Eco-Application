import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image, Linking } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { MetricCard, EmptyState, RequestCard, AnimatedScreen, InteractiveMap } from '../components';
import { formatCurrency } from '../utils/helpers';

export default function DashboardScreen() {
  const { 
    providerType, 
    isOnline, 
    setIsOnline, 
    profile, 
    requests, 
    earnings, 
    reviews, 
    notifications,
    documents,
    location,
    setCurrentScreen,
    setSelectedRequest
  } = useApp();

  const isBusiness = [
    'Taxi Company',
    'Garage',
    'Service Station',
    'Spare Parts Seller',
    'Vehicle Rental',
    'Bus Operator',
    'Parking Service',
    'Car Wash Service'
  ].includes(providerType);

  // Filter requests that are active or pending
  const activeRequests = requests.filter(r => r.type === providerType && (r.status === 'Pending' || r.status === 'Accepted' || r.status === 'In Progress'));
  const pendingRequestsCount = requests.filter(r => r.type === providerType && r.status === 'Pending').length;
  const activeJobsCount = requests.filter(r => r.type === providerType && (r.status === 'Accepted' || r.status === 'In Progress')).length;
  const completedJobsCount = requests.filter(r => r.type === providerType && r.status === 'Completed').length;
  const totalRequestsCount = requests.filter(r => r.type === providerType).length;
  
  // Calculate average rating
  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : '5.0';
  
  // Notification badge count
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navigateToRequest = (req) => {
    setSelectedRequest(req);
    setCurrentScreen('REQUEST_DETAILS');
  };

  // 1. Dashboard Widget: Driver Map / Bus Operator
  const renderDriverWidget = () => {
    let mapTitle = '📍 Live Map Area';
    let btnText = 'Configure Service Radius';
    if (['Taxi Driver', 'Taxi Company', 'Bus Operator'].includes(providerType)) {
      mapTitle = '📍 Live Dispatch Map';
    } else if (providerType === 'Vehicle Rental') {
      mapTitle = '📍 Fleet Tracking Map';
      btnText = 'Configure Rental Area';
    } else if (providerType === 'Fuel Service') {
      mapTitle = '📍 Fuel Delivery Logistics Map';
      btnText = 'Configure Delivery Radius';
    } else if (providerType === 'Emergency Provider') {
      mapTitle = '📍 Emergency Assist Dispatch Map';
      btnText = 'Configure Assist Radius';
    }
    
    return (
      <View style={globalStyles.card}>
        <View style={styles.cardHeader}>
          <Text style={globalStyles.cardTitle}>{mapTitle}</Text>
          <Text style={[styles.badgeText, { color: isOnline ? colors.success : colors.danger }]}>
            ● {isOnline ? 'GPS Active' : 'GPS Offline'}
          </Text>
        </View>
        <View style={styles.mapMock}>
          <InteractiveMap latitude={location.latitude} longitude={location.longitude} />
        </View>
        <TouchableOpacity 
          style={[globalStyles.btnSecondary, { marginTop: 12 }]}
          onPress={() => setCurrentScreen('LOCATION')}
        >
          <Text style={globalStyles.btnSecondaryText}>{btnText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 2. Dashboard Widget: Garage / Service Station appointments
  const renderGarageWidget = () => {
    let widgetTitle = '🛠️ Workshop Appointments';
    let activeLabel = 'Active Repairs';
    let queueLabel = 'Bookings Queue';
    
    if (providerType === 'Car Wash Service') {
      widgetTitle = '🧼 Detailing Slots';
      activeLabel = 'Active Washes';
      queueLabel = 'Wash Queue';
    } else if (providerType === 'Parking Service') {
      widgetTitle = '🅿️ Parking Spaces';
      activeLabel = 'Occupied Spaces';
      queueLabel = 'Valet Bookings';
    }
    
    const activeCount = requests.filter(r => r.type === providerType && r.status === 'In Progress').length;
    const pendingCount = requests.filter(r => r.type === providerType && r.status === 'Pending').length;

    return (
      <View style={globalStyles.card}>
        <View style={styles.cardHeader}>
          <Text style={globalStyles.cardTitle}>{widgetTitle}</Text>
          <TouchableOpacity onPress={() => setCurrentScreen('REQUEST_LIST')}>
            <Text style={styles.seeAllLink}>See Queue</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.appointmentBox}>
          <Text style={styles.appointmentStats}>
            {activeLabel}: <Text style={{ color: colors.primary }}>{activeCount}</Text>
          </Text>
          <Text style={styles.appointmentStats}>
            {queueLabel}: <Text style={{ color: colors.pending }}>{pendingCount}</Text>
          </Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.sectionHeading}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.gridBtn} onPress={() => setCurrentScreen('AVAILABILITY')}>
            <Text style={styles.gridIcon}>📅</Text>
            <Text style={styles.gridText}>Slots</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridBtn} onPress={() => setCurrentScreen('CUSTOMER_LIST')}>
            <Text style={styles.gridIcon}>👤</Text>
            <Text style={styles.gridText}>Customers</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 3. Dashboard Widget: Spare Parts Seller inventory & orders
  const renderSellerWidget = () => (
    <View style={globalStyles.card}>
      <View style={styles.cardHeader}>
        <Text style={globalStyles.cardTitle}>📦 Product & Orders Hub</Text>
        <TouchableOpacity onPress={() => setCurrentScreen('SETTINGS')}>
          <Text style={styles.seeAllLink}>Manage Inventory</Text>
        </TouchableOpacity>
      </View>
      
      {/* Alert banner */}
      <View style={styles.inventoryAlert}>
        <Text style={styles.alertIcon}>⚠️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>Low Stock Notice</Text>
          <Text style={styles.alertBody}>OEM Front Rotors are below threshold limit (2 packs left).</Text>
        </View>
      </View>

      <View style={styles.sellerStatsRow}>
        <View style={styles.sellerStatCard}>
          <Text style={styles.sellerStatVal}>{requests.filter(r => r.type === providerType && r.status === 'Pending').length}</Text>
          <Text style={styles.sellerStatLabel}>New Orders</Text>
        </View>
        <View style={styles.sellerStatCard}>
          <Text style={styles.sellerStatVal}>148</Text>
          <Text style={styles.sellerStatLabel}>Items Listed</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Premium Header */}
      <View style={styles.customHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {isBusiness ? (
              profile.businessLogo ? (
                <Text style={styles.avatarTextIcon}>{profile.businessLogo}</Text>
              ) : (
                <Text style={styles.avatarText}>
                  {(profile.businessName || profile.fullName || 'P').substring(0, 1)}
                </Text>
              )
            ) : (
              profile.profilePhoto ? (
                <Text style={styles.avatarTextIcon}>{profile.profilePhoto}</Text>
              ) : (
                <Text style={styles.avatarText}>{(profile.fullName || 'P').substring(0, 1)}</Text>
              )
            )}
          </View>
          <View>
            <Text style={styles.greeting}>
              {(() => { const h = new Date().getHours(); return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'; })()}
            </Text>
            <Text style={styles.userName}>{profile.businessName || profile.fullName}</Text>
            <Text style={styles.userRole}>{providerType}</Text>
          </View>
        </View>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.notifBtn} onPress={() => setCurrentScreen('NOTIFICATIONS')}>
            <Text style={styles.iconEmoji}>🔔</Text>
            {unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeVal}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <AnimatedScreen animation="fade">
          {/* Availability Quick Toggle Banner */}
          <View style={[styles.statusBanner, isOnline ? styles.bannerOnline : styles.bannerOffline]}>
            <View style={[styles.bannerAccent, { backgroundColor: isOnline ? colors.success : colors.danger }]} />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerEmoji}>{isOnline ? '🟢' : '🔴'}</Text>
              <Text style={styles.bannerText}>
                Status: <Text style={{ fontWeight: 'bold' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggleBtn, isOnline ? styles.toggleBtnOnline : styles.toggleBtnOffline]}
              onPress={() => setIsOnline(!isOnline)}
            >
              <Text style={styles.toggleBtnText}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
            </TouchableOpacity>
          </View>

          {/* Metrics Grid */}
          <Text style={styles.quickStatsLabel}>📊 Quick Stats</Text>
          <View style={styles.metricsRow}>
            <MetricCard
              label="Earnings"
              value={formatCurrency(earnings.weekly)}
              sub="Unsettled"
              onPress={() => setCurrentScreen('EARNINGS')}
            />
            <MetricCard
              label="Active Jobs"
              value={activeJobsCount}
              sub={`${pendingRequestsCount} Pending`}
              onPress={() => setCurrentScreen('REQUEST_LIST')}
            />
            <MetricCard
              label="Completed"
              value={completedJobsCount}
              sub="All Time"
              onPress={() => setCurrentScreen('EARNINGS')}
            />
          </View>

          <View style={[styles.metricsRow, { marginTop: 8 }]}>
            <MetricCard
              label="Total Requests"
              value={totalRequestsCount}
              sub="Received"
              onPress={() => setCurrentScreen('REQUEST_LIST')}
            />
            <MetricCard
              label="Rating"
              value={averageRating}
              icon="⭐"
              sub={`${reviews.length} Reviews`}
              onPress={() => setCurrentScreen('REVIEWS')}
            />
            <MetricCard
              label="Alerts"
              value={unreadNotifications}
              sub="Unread"
              onPress={() => setCurrentScreen('NOTIFICATIONS')}
            />
          </View>

          {/* Dynamic Category Specific Content */}
        {['Taxi Driver', 'Taxi Company', 'Bus Operator', 'Vehicle Rental', 'Fuel Service', 'Emergency Provider'].includes(providerType) && renderDriverWidget()}
        {['Garage', 'Service Station', 'Car Wash Service', 'Parking Service'].includes(providerType) && renderGarageWidget()}
        {['Spare Parts Seller'].includes(providerType) && renderSellerWidget()}

        {/* Verification Lock for Requests */}
        {documents.status !== 'Approved' ? (
          <View style={[globalStyles.card, styles.lockCard]}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockTitle}>Verification Required</Text>
            <Text style={styles.lockText}>
              Your account status is currently <Text style={styles.lockStatusText}>{(documents.status || 'Pending').toUpperCase()}</Text>.
              You cannot receive customer requests until your document verification is approved.
            </Text>
            <TouchableOpacity 
              style={[globalStyles.btnSecondary, { marginTop: 15 }]}
              onPress={() => setCurrentScreen('VERIFICATION_STATUS')}
            >
              <Text style={globalStyles.btnSecondaryText}>View Verification Status</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Recent Service Requests Card */
          <View style={globalStyles.card}>
            <View style={styles.cardHeader}>
              <Text style={globalStyles.cardTitle}>📥 Active Job Requests</Text>
              <TouchableOpacity onPress={() => setCurrentScreen('REQUEST_LIST')}>
                <Text style={styles.seeAllLink}>View All ({requests.filter(r => r.type === providerType).length})</Text>
              </TouchableOpacity>
            </View>

            {activeRequests.length === 0 ? (
              <EmptyState
                icon="📭"
                title="No active or pending requests"
                subtitle="When customers book your service, details will appear here."
              />
            ) : (
              activeRequests.map((req) => (
                <RequestCard 
                  key={req.id} 
                  request={req}
                  onPress={() => navigateToRequest(req)}
                />
              ))
            )}
          </View>
        )}

        {/* Application Navigation Quick Links Grid */}
        <Text style={styles.navHeader}>Application Management</Text>
        <View style={styles.navGrid}>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('REQUEST_LIST')}>
            <Text style={styles.navIcon}>📥</Text>
            <Text style={styles.navText}>Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('LOCATION')}>
            <Text style={styles.navIcon}>📍</Text>
            <Text style={styles.navText}>Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('AVAILABILITY')}>
            <Text style={styles.navIcon}>⏰</Text>
            <Text style={styles.navText}>Availability</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('EARNINGS')}>
            <Text style={styles.navIcon}>💳</Text>
            <Text style={styles.navText}>Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('CUSTOMER_LIST')}>
            <Text style={styles.navIcon}>👥</Text>
            <Text style={styles.navText}>Customers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('REVIEWS')}>
            <Text style={styles.navIcon}>⭐</Text>
            <Text style={styles.navText}>Reviews</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('PROFILE')}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('SETTINGS')}>
            <Text style={styles.navIcon}>⚙️</Text>
            <Text style={styles.navText}>Settings</Text>
          </TouchableOpacity>
        </View>
        </AnimatedScreen>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.textWhite,
    fontWeight: '800',
    fontSize: 18,
  },
  userName: {
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 16,
  },
  userRole: {
    color: colors.textLight,
    fontSize: 12,
    marginTop: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifBtn: {
    padding: 8,
    position: 'relative',
  },
  iconEmoji: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.danger,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeVal: {
    color: colors.textWhite,
    fontSize: 9,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusBanner: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bannerOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  bannerOffline: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  bannerText: {
    fontSize: 14,
    color: colors.textDark,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  toggleBtnOnline: {
    backgroundColor: colors.danger,
  },
  toggleBtnOffline: {
    backgroundColor: colors.success,
  },
  toggleBtnText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
    marginTop: 6,
  },
  metricSub: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  seeAllLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  mapMock: {
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  mapIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  mapText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  mapSubtext: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
  appointmentBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  appointmentStats: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  quickGrid: {
    flexDirection: 'row',
  },
  gridBtn: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  gridText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  inventoryAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  alertBody: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 1,
  },
  sellerStatsRow: {
    flexDirection: 'row',
  },
  sellerStatCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  sellerStatVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.secondary,
  },
  sellerStatLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
  emptyRequests: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  emptySubtext: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  requestItem: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  requestLeft: {
    flex: 1,
    paddingRight: 10,
  },
  reqCustomerName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  reqDetails: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 3,
  },
  reqLocation: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 3,
  },
  requestRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  reqFare: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  indicatorPending: {
    backgroundColor: colors.pendingLight,
  },
  indicatorAccepted: {
    backgroundColor: colors.infoLight,
  },
  indicatorActive: {
    backgroundColor: colors.successLight,
  },
  indicatorLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  navHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 4,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navItem: {
    width: '23%',
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  navText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.secondary,
    textAlign: 'center',
  },
  avatarTextIcon: {
    fontSize: 22,
  },
  lockCard: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderColor: colors.danger,
    borderWidth: 1,
  },
  lockIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  lockTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 8,
  },
  lockText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  lockStatusText: {
    color: colors.danger,
    fontWeight: '800',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  greeting: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 1,
  },
  bannerAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerEmoji: {
    fontSize: 12,
    marginRight: 6,
  },
  quickStatsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 8,
    marginLeft: 2,
  }
});
