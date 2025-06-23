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
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start polling when the component mounts
    pollingIntervalRef.current = ThingSpeakAPI.startPolling((data) => {
      setSensorData(data);
    }, AR_CONFIG.OVERLAY_UPDATE_INTERVAL);

    // Stop polling when the component unmounts
    return () => {
      if (pollingIntervalRef.current) {
        ThingSpeakAPI.stopPolling(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleSensorDetected = (detection: Detection) => {
    setActiveDetection(detection);
    setIsOverlayVisible(true);
    
    setTimeout(() => {
        setIsOverlayVisible(false);
    }, 5000);
  };

  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
    setActiveDetection(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        onSensorDetected={handleSensorDetected}
        sensorData={sensorData}
        isARMode={true}
      />
      <SensorOverlay
        detection={activeDetection}
        isVisible={isOverlayVisible}
        onClose={handleOverlayClose}
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