// Environment configuration

/**
 * Gets an environment variable with fallback
 * @param {string} key - The environment variable key
 * @returns {string} The environment variable value or undefined
 */
const getEnvVariable = (key) => {
  // For React Native on web or native
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // For Expo
  if (typeof Expo !== 'undefined' && Expo.Constants && Expo.Constants.manifest) {
    return Expo.Constants.manifest.extra ? Expo.Constants.manifest.extra[key] : undefined;
  }
  
  return undefined;
};

// OpenAI API Key (used on the server side, not directly in client)
export const OPENAI_API_KEY = getEnvVariable('OPENAI_API_KEY');

// API Base URL for server endpoints
export const API_BASE_URL = getEnvVariable('API_BASE_URL') || '/api';

// Node environment
export const NODE_ENV = getEnvVariable('NODE_ENV') || 'development';

// App version from package.json
export const APP_VERSION = getEnvVariable('APP_VERSION') || '1.0.0';

// Environment validation function
export const validateEnv = () => {
  const requiredVars = [];
  const missingVars = requiredVars.filter(varName => !getEnvVariable(varName));
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};

// Load and return all config variables
export const getConfig = () => {
  return {
    API_BASE_URL,
    NODE_ENV,
    APP_VERSION,
  };
};

// App configuration object with defaults
export const appConfig = {
  // Feature flags
  features: {
    enableAnalytics: NODE_ENV === 'production',
    enableErrorReporting: NODE_ENV === 'production',
    enableImageAnalysis: true,
    enableVoiceInput: false, // Planned for future
    enablePreferenceSync: true,
  },
  
  // UI/UX configuration
  ui: {
    theme: 'light', // 'light' or 'dark'
    animations: true,
    hapticFeedback: true,
  },
  
  // API timeouts
  api: {
    timeout: 30000, // 30 seconds
    retryCount: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Storage keys
  storage: {
    userPreferences: 'healthai_user_preferences',
    authTokens: 'healthai_auth_tokens',
    healthRecords: 'healthai_health_records',
  },
};