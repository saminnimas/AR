import { Detection } from '../utils/types';
import { SENSOR_TYPES } from '../utils/constants';
import { Dimensions } from 'react-native';

const BACKEND_URL = 'http://192.168.0.175:8000/predict/';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export async function detectObjects(imageUri: string): Promise<Detection[]> {
  try {
    console.log('Starting object detection for image:', imageUri);
    console.log('Sending request to:', BACKEND_URL);
    
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to get prediction: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API Response:', result);

    // Map backend response to Detection[]
    return (result.detections || []).map((det: any, idx: number) => {
      const [x1, y1, x2, y2] = det.bbox;
      
      // YOLO model typically processes images at 640x640 or similar
      // We need to scale these coordinates to screen dimensions
      const modelInputSize = 640; // YOLO default input size
      
      // Calculate scale factors
      const scaleX = screenWidth / modelInputSize;
      const scaleY = screenHeight / modelInputSize;
      
      // Scale the coordinates to screen space
      const scaledX1 = x1 * scaleX;
      const scaledY1 = y1 * scaleY;
      const scaledX2 = x2 * scaleX;
      const scaledY2 = y2 * scaleY;
      
      console.log(`Original bbox: [${x1}, ${y1}, ${x2}, ${y2}]`);
      console.log(`Scaled bbox: [${scaledX1}, ${scaledY1}, ${scaledX2}, ${scaledY2}]`);
      console.log(`Screen dimensions: ${screenWidth}x${screenHeight}`);
      
      return {
        id: idx,
        type: det.class_id === 0 ? SENSOR_TYPES.TEMPERATURE_HUMIDITY : SENSOR_TYPES.FSR,
        confidence: det.confidence,
        bounds: {
          x: scaledX1,
          y: scaledY1,
          width: scaledX2 - scaledX1,
          height: scaledY2 - scaledY1,
        },
        timestamp: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error in detectObjects:', error);
    throw error;
  }
} 