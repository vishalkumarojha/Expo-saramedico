import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen'; // Using your placeholder logic

// A simple placeholder component if you haven't built Hospital screens yet
const PlaceholderScreen = () => (
  <LoginScreen navigation={{ replace: () => {} }} /> 
);

const Stack = createStackNavigator();

export default function HospitalNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HospitalFlow" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}