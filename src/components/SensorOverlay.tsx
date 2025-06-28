import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SENSOR_DISPLAY_CONFIG, ANIMATION_CONFIG } from '../utils/constants';
import { Detection, SensorData } from '../utils/types';

const { width, height } = Dimensions.get('window');

interface SensorOverlayProps {
  detection: Detection | null;
  onClose: () => void;
  isVisible: boolean;
}

const SensorOverlay: React.FC<SensorOverlayProps> = ({ detection, onClose, isVisible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isVisible ? 1 : 0,
        duration: ANIMATION_CONFIG.OVERLAY_FADE_IN,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: isVisible ? 1 : 0.8,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible, fadeAnim, scaleAnim]);

  if (!detection) {
    return null;
  }

  const { type, confidence, bounds, sensorData } = detection;
  const { temperature, humidity, fsr } = sensorData || {};

  console.log('SensorOverlay - Detection type:', type);
  console.log('SensorOverlay - Sensor data:', sensorData);
  console.log('SensorOverlay - Temperature:', temperature, 'Humidity:', humidity, 'FSR:', fsr);

  const getSensorDisplayData = () => {
    // Always show all three sensor values regardless of detection type
    return [
      { ...SENSOR_DISPLAY_CONFIG.TEMPERATURE, value: temperature },
      { ...SENSOR_DISPLAY_CONFIG.HUMIDITY, value: humidity },
      { ...SENSOR_DISPLAY_CONFIG.FSR, value: fsr },
    ];
  };

  const sensorDisplayData = getSensorDisplayData();

  // Calculate overlay position based on detected object bounds
  const calculateOverlayPosition = () => {
    const overlayWidth = 200;
    const overlayHeight = 150;
    
    // Fixed position: middle-left of the screen
    const fixedLeft = 20;
    const fixedTop = (height - overlayHeight) / 2; // Center vertically
    
    return {
      left: fixedLeft,
      top: fixedTop,
    };
  };

  const overlayPosition = calculateOverlayPosition();

  return (
    <Animated.View
      style={[
        styles.overlay,
        overlayPosition,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          display: isVisible ? 'flex' : 'none',
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.sensorType}>{type.replace('_', ' ').toUpperCase()}</Text>
        <Text style={styles.confidence}>{(confidence * 100).toFixed(1)}%</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {sensorDisplayData.map((sensor, index) => (
        <View key={index} style={styles.sensorRow}>
          <Text style={styles.sensorIcon}>{sensor.icon}</Text>
          <View>
            <Text style={styles.sensorLabel}>{sensor.label}</Text>
            <Text style={[styles.sensorValue, { color: sensor.color }]}>
              {sensor.value !== null && sensor.value !== undefined
                ? `${sensor.value.toFixed(1)}${sensor.unit}`
                : 'N/A'}
            </Text>
          </View>
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        width: 200,
        backgroundColor: COLORS.OVERLAY_BACKGROUND,
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        paddingBottom: 10,
        marginBottom: 10,
      },
      sensorType: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
      },
      confidence: {
        color: COLORS.SUCCESS,
        fontSize: 12,
        fontWeight: '600',
      },
      closeButton: {
        padding: 5,
      },
      closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      sensorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      sensorIcon: {
        fontSize: 24,
        marginRight: 10,
      },
      sensorLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
      },
      sensorValue: {
        fontSize: 18,
        fontWeight: 'bold',
      },
});

export default SensorOverlay; 