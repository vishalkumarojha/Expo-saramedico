import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Hospital Screens
import HospitalDashboard from '../screens/hospital/HospitalDashboard';
import HospitalTeamScreen from '../screens/hospital/HospitalTeamScreen';
import HospitalInviteTeamScreen from '../screens/hospital/HospitalInviteTeamScreen';
import HospitalScheduleScreen from '../screens/hospital/HospitalScheduleScreen';
import HospitalSettingsScreen from '../screens/hospital/HospitalSettingsScreen';
import HospitalDepartmentsScreen from '../screens/hospital/HospitalDepartmentsScreen';

const Stack = createStackNavigator();

export default function HospitalNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HospitalDashboard"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {/* Main Screens */}
      <Stack.Screen name="HospitalDashboard" component={HospitalDashboard} />
      <Stack.Screen name="HospitalTeamScreen" component={HospitalTeamScreen} />
      <Stack.Screen name="HospitalScheduleScreen" component={HospitalScheduleScreen} />
      <Stack.Screen name="HospitalSettingsScreen" component={HospitalSettingsScreen} />

      {/* Secondary Screens */}
      <Stack.Screen name="HospitalInviteTeamScreen" component={HospitalInviteTeamScreen} />
      <Stack.Screen name="HospitalDepartmentsScreen" component={HospitalDepartmentsScreen} />
    </Stack.Navigator>
  );
}