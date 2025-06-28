import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import CameraView from '../components/CameraView';
import SensorOverlay from '../components/SensorOverlay';
import ThingSpeakAPI from '../services/ThingSpeakAPI';
import { COLORS, AR_CONFIG } from '../utils/constants';
import { SensorData, Detection } from '../utils/types';

const ARScreen: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: null,
    humidity: null,
    fsr: null,
  });
  const [activeDetection, setActiveDetection] = useState<Detection | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [showAlwaysOnOverlay, setShowAlwaysOnOverlay] = useState(true); 
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start polling when the component mounts
    pollingIntervalRef.current = ThingSpeakAPI.startPolling((data) => {
      console.log('ARScreen - Received sensor data:', data);
      setSensorData(data);
    }, AR_CONFIG.OVERLAY_UPDATE_INTERVAL);

    return () => {
      if (pollingIntervalRef.current) {
        ThingSpeakAPI.stopPolling(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleSensorDetected = (detection: Detection) => {
    console.log('ARScreen - Object detected:', detection);
    console.log('ARScreen - Current sensor data:', sensorData);
    
    const detectionWithSensorData = {
      ...detection,
      sensorData: sensorData, 
    };
    
    console.log('ARScreen - Detection with sensor data:', detectionWithSensorData);
    
    setActiveDetection(detectionWithSensorData);
    setIsOverlayVisible(true);
    
    setTimeout(() => {
        setIsOverlayVisible(false);
    }, 5000);
  };

  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
    setActiveDetection(null);
  };

  const getAlwaysOnDetection = (): Detection | null => {
    if (!showAlwaysOnOverlay) return null;
    
    return {
      id: -1, 
      type: 'temp_humidity', 
      confidence: 1.0,
      bounds: {
        x: 20,
        y: 100,
        width: 200,
        height: 150,
      },
      timestamp: new Date().toISOString(),
      sensorData: sensorData,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        onSensorDetected={handleSensorDetected}
        sensorData={sensorData}
        isARMode={true}
      />
      
      {/* Show detection overlay when objects are detected */}
      <SensorOverlay
        detection={activeDetection}
        isVisible={isOverlayVisible}
        onClose={handleOverlayClose}
      />
      
      {/* Show always-on sensor data overlay */}
      <SensorOverlay
        detection={getAlwaysOnDetection()}
        isVisible={showAlwaysOnOverlay && !isOverlayVisible}
        onClose={() => setShowAlwaysOnOverlay(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});

export default ARScreen; 