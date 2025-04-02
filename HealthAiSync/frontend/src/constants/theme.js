// Theme constants for the HealthAI application

// Colors
export const COLORS = {
  // Primary brand colors
  primary: '#2A7DE1', // Blue - primary brand color
  primaryLight: '#5A9CFF',
  primaryDark: '#1A63C0',
  
  // Secondary colors
  secondary: '#4ECB71', // Green - represents health, wellness
  secondaryLight: '#7FE49A',
  secondaryDark: '#2EA04D',
  
  // Accent colors
  accent1: '#7C4DFF', // Purple - for AI elements
  accent2: '#FF6B6B', // Coral - for alerts, urgent items
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  darkGray: '#616161',
  
  // Text colors
  text: '#333333',
  textLight: '#757575',
  textDark: '#212121',
  
  // Functional colors
  success: '#4ECB71', // Green
  warning: '#FFCA28', // Amber
  error: '#FF5252', // Red
  info: '#2196F3', // Blue
  
  // Background colors
  background: '#FFFFFF',
  backgroundLight: '#F5F7FA',
  backgroundDark: '#EEEEEE',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#BDBDBD',
  
  // Input field
  inputBg: '#F5F7FA',
  inputText: '#333333',
  inputPlaceholder: '#9E9E9E',
  
  // Gradients (string format for linear-gradient)
  gradientPrimary: ['#2A7DE1', '#1A63C0'],
  gradientSecondary: ['#4ECB71', '#2EA04D'],
  gradientAccent: ['#7C4DFF', '#5E35B1'],
  
  // Transparency
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Card backgrounds 
  cardBg: '#FFFFFF',
  cardBgDark: '#F8F9FA',
  
  // Chart colors
  chart: {
    blue: '#2A7DE1',
    green: '#4ECB71',
    purple: '#7C4DFF',
    coral: '#FF6B6B',
    yellow: '#FFCA28',
    teal: '#26A69A',
    orange: '#FF9800',
    lightBlue: '#5A9CFF',
    lightGreen: '#7FE49A',
    lightPurple: '#B39DDB'
  },
  
  // Medical specialties colors
  specialties: {
    cardiology: '#FF5252',  // Red
    neurology: '#7C4DFF',   // Purple
    dermatology: '#FFA726', // Orange
    pediatrics: '#4FC3F7',  // Light Blue
    orthopedics: '#66BB6A', // Green
    general: '#78909C'      // Blue Grey
  }
};

// Typography
export const FONTS = {
  // Font sizes
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  body1: 16,
  body2: 14,
  body3: 12,
  button: 16,
  caption: 12,
  small: 10,
  
  // Font family
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  
  // Font weights (may be used with numeric values in some cases)
  weightLight: '300',
  weightRegular: '400',
  weightMedium: '500',
  weightSemiBold: '600',
  weightBold: '700',
  
  // Line heights
  lineHeightTight: 1.2,
  lineHeightRegular: 1.5,
  lineHeightRelaxed: 1.8
};

// Spacing, sizes and measurements
export const SIZES = {
  // Base sizes
  base: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  
  // Specific spacing
  padding: 16,
  margin: 16,
  
  // Border radius
  radiusXs: 2,
  radiusSm: 4,
  radius: 8,
  radiusLg: 12,
  radiusXl: 16,
  radiusRound: 999, // For fully rounded elements
  
  // Button sizes
  buttonHeight: 48,
  buttonHeightSm: 36,
  buttonHeightLg: 56,
  
  // Input field sizes
  inputHeight: 48,
  inputHeightSm: 36,
  inputHeightLg: 56,
  
  // Icon sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 40,
  
  // Avatar sizes
  avatarSm: 32,
  avatarMd: 48,
  avatarLg: 64,
  avatarXl: 96,
  
  // Card sizes
  cardPadding: 16,
  cardBorderRadius: 8,
  
  // Header and footer
  headerHeight: 60,
  footerHeight: 60,
  
  // Screen specific measurements
  screenWidth: '100%',
  screenHeight: '100%',
  
  // Modal sizes
  modalWidth: '90%',
  modalBorderRadius: 12,
  
  // Maximum width for different elements
  maxWidthSm: 480,
  maxWidthMd: 768,
  maxWidthLg: 1024,
};

// Shadows and elevation
export const SHADOWS = {
  // For iOS
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  button: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  // For elements that need stronger elevation like modals
  elevated: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Animations and transitions
export const ANIMATION = {
  // Durations
  durationShort: 200,
  durationMedium: 300,
  durationLong: 500,
  
  // Easing functions (for React Native Animated)
  easeIn: 'easeIn',
  easeOut: 'easeOut',
  easeInOut: 'easeInOut',
  
  // Animation types
  slide: 'slide',
  fade: 'fade',
  scale: 'scale',
  
  // Transition properties (for web)
  transitionShort: 'all 0.2s ease',
  transitionMedium: 'all 0.3s ease',
  transitionLong: 'all 0.5s ease',
};

// Responsive breakpoints (mainly for web)
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
};