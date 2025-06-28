import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType, FlashMode } from 'expo-camera';
import { COLORS, ERROR_MESSAGES, SENSOR_TYPES } from '../utils/constants';
import { SensorData, Detection } from '../utils/types';
import { detectObjects } from '../services/YOLOAPI';

const { width, height } = Dimensions.get('window');

type CameraTypeString = 'back' | 'front';
type FlashModeString = 'off' | 'on';

interface CameraViewProps {
  onSensorDetected: (detection: Detection) => void;
  sensorData: SensorData;
  isARMode?: boolean;
}

const CameraViewComponent: React.FC<CameraViewProps> = ({ 
  onSensorDetected, 
  sensorData, 
  isARMode = true,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraTypeString>('back');
  const [flashMode, setFlashMode] = useState<FlashModeString>('off');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      Alert.alert('Permission Required', ERROR_MESSAGES.CAMERA_PERMISSION_DENIED, [
        { text: 'Grant Permission', onPress: () => requestPermission() },
      ]);
    }
  }, [permission]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        console.log('Picture taken:', photo.uri);
        setIsProcessing(true);
        // Call YOLO API
        const detections = await detectObjects(photo.uri);
        if (detections && detections.length > 0) {
          onSensorDetected(detections[0]); // Use the first detection for overlay
        } else {
          Alert.alert('No objects detected');
        }
      } catch (error: any) {
        console.error('Error taking picture or detecting:', error);
        Alert.alert('Detection Error', error?.message || 'Failed to detect objects.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!permission) {
    return <View style={styles.container}><Text style={styles.text}>Requesting camera permission...</Text></View>;
  }
  if (!permission.granted) {
    return <View style={styles.container}><Text style={styles.text}>No access to camera.</Text></View>;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        flash={flashMode}
        onCameraReady={() => {}} // Use onCameraReady to trigger first detection
        onMountError={(error: any) => console.error("Camera mount error:", error)}
        ratio="16:9"
        autofocus="on"
      >
        {isARMode && (
          <View style={styles.arOverlay}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: isProcessing ? COLORS.WARNING : COLORS.SUCCESS }]} />
              <Text style={styles.statusText}>{isProcessing ? 'SCANNING...' : 'READY'}</Text>
            </View>
          </View>
        )}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={() => setFlashMode(flashMode === 'off' ? 'on' : 'off')}>
            <Text style={styles.controlButtonText}>⚡️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
          <TouchableOpacity style={styles.controlButton} onPress={() => setCameraType(cameraType === 'back' ? 'front' : 'back')}>
            <Text style={styles.controlButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  camera: { flex: 1 },
  text: { color: 'white', fontSize: 18, textAlign: 'center', marginTop: 50 },
  arOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' },
  statusIndicator: { position: 'absolute', top: 60, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.OVERLAY_BACKGROUND, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  controls: { position: 'absolute', bottom: 30, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  controlButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', width: 50, height: 50, borderRadius: 25 },
  controlButtonText: { color: 'white', fontSize: 24 },
  captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', borderWidth: 5, borderColor: COLORS.PRIMARY, alignSelf: 'center' },
});

export default CameraViewComponent; 