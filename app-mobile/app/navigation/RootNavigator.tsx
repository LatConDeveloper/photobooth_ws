import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Screens (to be implemented)
import AttractScreen from '../screens/AttractScreen';
import LayoutScreen from '../screens/LayoutScreen';
import CaptureScreen from '../screens/CaptureScreen';
import CustomizeScreen from '../screens/CustomizeScreen';
import ProductScreen from '../screens/ProductScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Attract"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false, // Disable swipe gestures for kiosk mode
        }}
      >
        <Stack.Screen name="Attract" component={AttractScreen} />
        <Stack.Screen name="Layout" component={LayoutScreen} />
        <Stack.Screen name="Capture" component={CaptureScreen} />
        <Stack.Screen name="Customize" component={CustomizeScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
