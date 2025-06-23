import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, THINGSPEAK_CONFIG, APP_CONFIG } from '../utils/constants';

const SettingsScreen: React.FC = () => {
  const showInfoAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>{APP_CONFIG.APP_NAME}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP_CONFIG.VERSION}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ThingSpeak Configuration</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Channel ID</Text>
            <Text style={styles.infoValue}>{THINGSPEAK_CONFIG.CHANNEL_ID}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Read API Key</Text>
            <Text style={styles.infoValue}>{THINGSPEAK_CONFIG.READ_API_KEY.substring(0, 4)}...{THINGSPEAK_CONFIG.READ_API_KEY.slice(-4)}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
            style={styles.button} 
            onPress={() => showInfoAlert('About', 'This app was built to demonstrate AR with sensor data.')}
        >
            <Text style={styles.buttonText}>About this App</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 5,
  },
  infoCard: {
    backgroundColor: COLORS.OVERLAY_BACKGROUND,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  button: {
      backgroundColor: COLORS.PRIMARY,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
  },
  buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  }
});

export default SettingsScreen; 