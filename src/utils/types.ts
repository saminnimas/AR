/**
 * Interface representing the structure of sensor data fetched from ThingSpeak.
 */
export interface SensorData {
  temperature: number | null;
  humidity: number | null;
  fsr: number | null;
}

/**
 * Interface for a detected object from our ML model.
 */
export interface Detection {
  id: number;
  type: 'temp_humidity' | 'fsr';
  confidence: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  sensorData?: SensorData;
  timestamp: string;
}

/**
 * Interface for the application's user-configurable settings.
 */
export interface Settings {
  autoDetect: boolean;
  showGrid: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  highAccuracy: boolean;
  dataRefreshInterval: number;
} 