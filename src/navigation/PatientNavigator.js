import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Screens
import MicrophoneTestScreen from '../screens/patient/MicrophoneTestScreen';
import PatientDashboard from '../screens/patient/PatientDashboard';
import MedicalRecordsScreen from '../screens/patient/MedicalRecordsScreen';
import ScheduleScreen from '../screens/patient/ScheduleScreen';
import MessagesScreen from '../screens/patient/MessagesScreen';
import SearchScreen from '../screens/patient/SearchScreen';
import PatientSettingsScreen from '../screens/patient/PatientSettingsScreen';

// Shared
import VideoCallScreen from '../screens/VideoCallScreen';

const Stack = createStackNavigator();

export default function PatientNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="PatientFlow" // Maps to MicrophoneTest as per your original logic
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
      }}
    >
      {/* Entry Point */}
      <Stack.Screen name="PatientFlow" component={MicrophoneTestScreen} />
      
      {/* Main Screens */}
      <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
      <Stack.Screen name="MedicalRecordsScreen" component={MedicalRecordsScreen} />
      <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
      <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="PatientSettingsScreen" component={PatientSettingsScreen} />
      
      {/* Shared */}
      <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
    </Stack.Navigator>
  );
}