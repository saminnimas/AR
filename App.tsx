import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import ARScreen from './src/screens/ARScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { COLORS } from './src/utils/constants';

type RootStackParamList = {
  Home: undefined;
  AR: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.BACKGROUND,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.PRIMARY,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: '',
          cardStyle: { backgroundColor: COLORS.BACKGROUND },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AR"
          component={ARScreen}
          options={{ title: 'AR View' }}
        />
        <Stack.Screen 
          name="Settings"
          component={SettingsScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
