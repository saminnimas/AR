import axios from 'axios';
import { THINGSPEAK_CONFIG } from '../utils/constants';
import { SensorData } from '../utils/types';

class ThingSpeakAPI {
  private lastFetch: number = 0;
  private cachedData: SensorData = {
    temperature: null,
    humidity: null,
    fsr: null,
    rpm: null,
  };

  /**
   * Fetch the most recent value from a single ThingSpeak field.
   * @param fieldNumber The field number to fetch.
   * @returns A promise that resolves to the sensor value or null.
   */
  async fetchLatestField(fieldNumber: number): Promise<number | null> {
    try {
      const url = `${THINGSPEAK_CONFIG.BASE_URL}/channels/${THINGSPEAK_CONFIG.CHANNEL_ID}/fields/${fieldNumber}.json?results=1&api_key=${THINGSPEAK_CONFIG.READ_API_KEY}`;
      const response = await axios.get(url, { timeout: 3000 });
      const feeds = response.data?.feeds;

      if (feeds && feeds.length > 0) {
        const value = feeds[0][`field${fieldNumber}`];
        return value ? parseFloat(value) : null;
      }
      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`ThingSpeak fetch error (field ${fieldNumber}):`, error.message);
      } else {
        console.error(`An unexpected error occurred (field ${fieldNumber}):`, error);
      }
      return null;
    }
  }

  /**
   * Fetches all sensor data from ThingSpeak, respecting the fetch interval.
   * @returns A promise that resolves to the latest sensor data.
   */
  async fetchAllSensorData(): Promise<SensorData> {
    const now = Date.now();
    if (now - this.lastFetch > THINGSPEAK_CONFIG.FETCH_INTERVAL) {
      try {
        const [temperature, fsr, humidity, rpm] = await Promise.all([
          this.fetchLatestField(THINGSPEAK_CONFIG.FIELDS.TEMPERATURE),
          this.fetchLatestField(THINGSPEAK_CONFIG.FIELDS.FSR),
          this.fetchLatestField(THINGSPEAK_CONFIG.FIELDS.HUMIDITY),
          this.fetchLatestField(THINGSPEAK_CONFIG.FIELDS.RPM),
        ]);

        this.cachedData = { temperature, humidity, fsr, rpm };
        this.lastFetch = now;
      } catch (error) {
        console.error('Error fetching all sensor data:', error);
      }
    }
    return this.cachedData;
  }

  /**
   * Starts polling for sensor data at a specified interval.
   * @param callback The function to call with the updated sensor data.
   * @param interval The polling interval in milliseconds.
   * @returns The interval ID for cleanup.
   */
  startPolling(callback: (data: SensorData) => void, interval: number = THINGSPEAK_CONFIG.FETCH_INTERVAL): NodeJS.Timeout {
    return setInterval(async () => {
      const sensorData = await this.fetchAllSensorData();
      callback(sensorData);
    }, interval);
  }

  /**
   * Stops the sensor data polling.
   * @param intervalId The interval ID to clear.
   */
  stopPolling(intervalId: NodeJS.Timeout): void {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
}

export default new ThingSpeakAPI(); 