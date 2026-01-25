import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Onboarding
import DoctorSpecialtyScreen from '../screens/doctor/DoctorSpecialtyScreen';
import DoctorMicrophoneTestScreen from '../screens/doctor/DoctorMicrophoneTestScreen';
import DoctorUploadScreen from '../screens/doctor/DoctorUploadScreen';
import DoctorAnalyzedScreen from '../screens/doctor/DoctorAnalyzedScreen';

// Dashboard & Main
import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import DoctorSearchScreen from '../screens/doctor/DoctorSearchScreen';
import DoctorSettingsScreen from '../screens/doctor/DoctorSettingsScreen';

// Patient Management
import DoctorPatientDirectoryScreen from '../screens/doctor/DoctorPatientDirectoryScreen';
import DoctorAddPatientScreen from '../screens/doctor/DoctorAddPatientScreen';
import DoctorPatientDetailScreen from '../screens/doctor/DoctorPatientDetailScreen';
import DoctorPostVisitScreen from '../screens/doctor/DoctorPostVisitScreen';

// Tools & Schedule
import DoctorQuickUploadScreen from '../screens/doctor/DoctorQuickUploadScreen';
import DoctorAnalyzedResultScreen from '../screens/doctor/DoctorAnalyzedResultScreen';
import DoctorScheduleScreen from '../screens/doctor/DoctorScheduleScreen';
import DoctorAlertsScreen from '../screens/doctor/DoctorAlertsScreen';

// Shared
import VideoCallScreen from '../screens/VideoCallScreen';

const Stack = createStackNavigator();

export default function DoctorNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="DoctorSpecialty" // Maps to SpecialtyScreen
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {/* 1. Onboarding Flow */}
      <Stack.Screen name="DoctorSpecialty" component={DoctorSpecialtyScreen} />
      <Stack.Screen name="DoctorSpecialtyScreen" component={DoctorSpecialtyScreen} />
      <Stack.Screen name="DoctorMicrophoneTestScreen" component={DoctorMicrophoneTestScreen} />
      <Stack.Screen name="DoctorUploadScreen" component={DoctorUploadScreen} />
      <Stack.Screen name="DoctorAnalyzedScreen" component={DoctorAnalyzedScreen} />

      {/* 2. Main Dashboard */}
      <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
      <Stack.Screen name="DoctorSearchScreen" component={DoctorSearchScreen} />
      <Stack.Screen name="DoctorSettingsScreen" component={DoctorSettingsScreen} />

      {/* 3. Patient Management */}
      <Stack.Screen name="DoctorPatientDirectoryScreen" component={DoctorPatientDirectoryScreen} />
      <Stack.Screen name="DoctorAddPatientScreen" component={DoctorAddPatientScreen} />
      <Stack.Screen name="DoctorPatientDetailScreen" component={DoctorPatientDetailScreen} />
      <Stack.Screen name="DoctorPostVisitScreen" component={DoctorPostVisitScreen} />

      {/* 4. Clinical Tools */}
      <Stack.Screen name="DoctorQuickUploadScreen" component={DoctorQuickUploadScreen} />
      <Stack.Screen name="DoctorAnalyzedResultScreen" component={DoctorAnalyzedResultScreen} />

      {/* 5. Schedule & Alerts */}
      <Stack.Screen name="DoctorScheduleScreen" component={DoctorScheduleScreen} />
      <Stack.Screen name="DoctorAlertsScreen" component={DoctorAlertsScreen} />

      {/* Shared */}
      <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
    </Stack.Navigator>
  );
}