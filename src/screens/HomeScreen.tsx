import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ThingSpeakAPI from '../services/ThingSpeakAPI';
import { COLORS, APP_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { SensorData } from '../utils/types';

type RootStackParamList = {
  Home: undefined;
  AR: undefined;
  Settings: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: null,
    humidity: null,
    fsr: null,
    rpm: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ThingSpeakAPI.fetchAllSensorData();
      setSensorData(data);
    } catch (error) {
      Alert.alert('Error', ERROR_MESSAGES.THINGSPEAK_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const isConnected = sensorData.temperature !== null || sensorData.humidity !== null || sensorData.fsr !== null;

  const renderSensorValue = (value: number | null, unit: string) => {
    if (isLoading) return <ActivityIndicator size="small" color={COLORS.PRIMARY} />;
    if (value === null) return <Text style={styles.sensorValue}>N/A</Text>;
    return <Text style={styles.sensorValue}>{`${value.toFixed(1)}${unit}`}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.appTitle}>{APP_CONFIG.APP_NAME}</Text>
        <Text style={styles.appSubtitle}>Real-time Sensor Monitoring</Text>
      </View>

      <View style={styles.sensorGrid}>
        <View style={styles.sensorCard}>
            <Text style={styles.sensorLabel}>🌡️ Temperature</Text>
            {renderSensorValue(sensorData.temperature, '°C')}
        </View>
        <View style={styles.sensorCard}>
            <Text style={styles.sensorLabel}>💧 Humidity</Text>
            {renderSensorValue(sensorData.humidity, '%')}
        </View>
        <View style={styles.sensorCard}>
            <Text style={styles.sensorLabel}>⚡️ Force (FSR)</Text>
            {renderSensorValue(sensorData.fsr, ' N')}
        </View>
        <View style={styles.sensorCard}>
            <Text style={styles.sensorLabel}>🔄 RPM</Text>
            {renderSensorValue(sensorData.rpm, '')}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
            style={[styles.primaryButton, !isConnected && styles.disabledButton]} 
            onPress={() => navigation.navigate('AR')}
            disabled={!isConnected}
        >
            <Text style={styles.primaryButtonText}>LAUNCH AR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={fetchData}>
            <Text style={styles.secondaryButtonText}>REFRESH</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.BACKGROUND, justifyContent: 'space-around', padding: 20 },
    header: { alignItems: 'center', marginBottom: 20 },
    appTitle: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 8 },
    appSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' },
    sensorGrid: { paddingHorizontal: 10 },
    sensorCard: { backgroundColor: COLORS.OVERLAY_BACKGROUND, borderRadius: 15, padding: 20, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sensorLabel: { fontSize: 18, color: 'white' },
    sensorValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.PRIMARY },
    actions: { marginTop: 20, paddingHorizontal: 10 },
    primaryButton: { backgroundColor: COLORS.PRIMARY, padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
    primaryButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    disabledButton: { backgroundColor: COLORS.WARNING, opacity: 0.7 },
    secondaryButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 15, borderRadius: 15, alignItems: 'center' },
    secondaryButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default HomeScreen; 