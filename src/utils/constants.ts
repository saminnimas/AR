// App Configuration Constants
export const APP_CONFIG = {
  APP_NAME: 'Sensor AR',
  VERSION: '1.0.0',
  DEBUG_MODE: __DEV__,
};

// ThingSpeak Configuration
export const THINGSPEAK_CONFIG = {
  CHANNEL_ID: "2801415",
  READ_API_KEY: "FBT6JHTEJI88YVM1",
  BASE_URL: "https://api.thingspeak.com",
  FETCH_INTERVAL: 1000, // 1 second
  FIELDS: {
    TEMPERATURE: 1,
    FSR: 2,
    HUMIDITY: 4,
  },
};

// Sensor Types
export const SENSOR_TYPES = {
  TEMPERATURE_HUMIDITY: 'temp_humidity',
  FSR: 'fsr',
};

// AR Configuration
export const AR_CONFIG = {
  DETECTION_CONFIDENCE: 0.5,
  MAX_DETECTIONS: 5,
  OVERLAY_UPDATE_INTERVAL: 1000,
  CAMERA_PERMISSION: 'camera',
  LOCATION_PERMISSION: 'location',
};

// UI Colors
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  BACKGROUND: '#000000',
  OVERLAY_BACKGROUND: 'rgba(0, 0, 0, 0.7)',
  TEMPERATURE_TEXT: '#FF3B30', // Red
  HUMIDITY_TEXT: '#007AFF',    // Blue
  FSR_TEXT: '#34C759',         // Green
};

// Sensor Display Configuration
export const SENSOR_DISPLAY_CONFIG = {
  TEMPERATURE: {
    label: 'Temperature',
    unit: '°C',
    color: COLORS.TEMPERATURE_TEXT,
    icon: '🌡️',
  },
  HUMIDITY: {
    label: 'Humidity',
    unit: '%',
    color: COLORS.HUMIDITY_TEXT,
    icon: '💧',
  },
  FSR: {
    label: 'Force',
    unit: 'N',
    color: COLORS.FSR_TEXT,
    icon: '⚡',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  CAMERA_PERMISSION_DENIED: 'Camera permission is required for AR functionality',
  LOCATION_PERMISSION_DENIED: 'Location permission is required for AR positioning',
  NETWORK_ERROR: 'Network error. Please check your internet connection',
  THINGSPEAK_ERROR: 'Unable to fetch sensor data from ThingSpeak',
  AR_NOT_SUPPORTED: 'AR is not supported on this device',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SENSOR_DETECTED: 'Sensor detected successfully',
  DATA_UPDATED: 'Sensor data updated',
  AR_READY: 'AR session ready',
};

// Animation Configuration
export const ANIMATION_CONFIG = {
  OVERLAY_FADE_IN: 300,
  OVERLAY_FADE_OUT: 300,
  DATA_UPDATE: 500,
  SENSOR_DETECTION: 1000,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_SETTINGS: 'user_settings',
  SENSOR_PREFERENCES: 'sensor_preferences',
  AR_CALIBRATION: 'ar_calibration',
}; 