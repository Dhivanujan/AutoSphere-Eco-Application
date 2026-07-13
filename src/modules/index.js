// AutoSphere Eco Application Modules Registry
// This registry maps the 20 application screens to their respective 14 logical modules (as defined in Requirements Section 5)

import SplashScreen from '../screens/SplashScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OTPScreen from '../screens/OTPScreen';
import TypeSelectionScreen from '../screens/TypeSelectionScreen';
import BusinessSetupScreen from '../screens/BusinessSetupScreen';
import DocumentUploadScreen from '../screens/DocumentUploadScreen';
import VerificationStatusScreen from '../screens/VerificationStatusScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RequestListScreen from '../screens/RequestListScreen';
import RequestDetailsScreen from '../screens/RequestDetailsScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import LocationScreen from '../screens/LocationScreen';
import EarningsScreen from '../screens/EarningsScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

export const modules = {
  splashIntro: {
    name: 'Splash & Introduction Module',
    screens: {
      SPLASH: SplashScreen,
      INTRO: IntroScreen,
    }
  },
  auth: {
    name: 'Provider Authentication Module',
    screens: {
      LOGIN: LoginScreen,
      REGISTER: RegisterScreen,
      OTP: OTPScreen,
    }
  },
  typeSelection: {
    name: 'Provider Type Selection Module',
    screens: {
      TYPE_SELECTION: TypeSelectionScreen,
    }
  },
  profileSetup: {
    name: 'Business Profile Setup Module',
    screens: {
      BUSINESS_SETUP: BusinessSetupScreen,
    }
  },
  verification: {
    name: 'Verification Module',
    screens: {
      DOCUMENT_UPLOAD: DocumentUploadScreen,
      VERIFICATION_STATUS: VerificationStatusScreen,
    }
  },
  dashboard: {
    name: 'Dynamic Dashboard Module',
    screens: {
      DASHBOARD: DashboardScreen,
    }
  },
  requests: {
    name: 'Request Management Module',
    screens: {
      REQUEST_LIST: RequestListScreen,
      REQUEST_DETAILS: RequestDetailsScreen,
    }
  },
  availability: {
    name: 'Availability Management Module',
    screens: {
      AVAILABILITY: AvailabilityScreen,
    }
  },
  location: {
    name: 'Location Management Module',
    screens: {
      LOCATION: LocationScreen,
    }
  },
  earnings: {
    name: 'Earnings Management Module',
    screens: {
      EARNINGS: EarningsScreen,
    }
  },
  customers: {
    name: 'Customer Management Module',
    screens: {
      CUSTOMER_LIST: CustomerListScreen,
    }
  },
  notifications: {
    name: 'Notification Module',
    screens: {
      NOTIFICATIONS: NotificationsScreen,
    }
  },
  reviews: {
    name: 'Review & Rating Module',
    screens: {
      REVIEWS: ReviewsScreen,
    }
  },
  settings: {
    name: 'Settings Module',
    screens: {
      PROFILE: ProfileScreen,
      SETTINGS: SettingsScreen,
    }
  }
};
