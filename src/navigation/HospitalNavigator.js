import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Hospital Screens
import HospitalDashboard from '../screens/hospital/HospitalDashboard';
import HospitalTeamScreen from '../screens/hospital/HospitalTeamScreen';
import HospitalInviteTeamScreen from '../screens/hospital/HospitalInviteTeamScreen';
import HospitalScheduleScreen from '../screens/hospital/HospitalScheduleScreen';
import HospitalSettingsScreen from '../screens/hospital/HospitalSettingsScreen';
import HospitalDepartmentsScreen from '../screens/hospital/HospitalDepartmentsScreen';
import HospitalSurgeryScreen from '../screens/hospital/HospitalSurgeryScreen';
import HospitalAnalyticsScreen from '../screens/hospital/HospitalAnalyticsScreen';
import HospitalMessagesScreen from '../screens/hospital/HospitalMessagesScreen';
import HospitalDoctorsScreen from '../screens/hospital/HospitalDoctorsScreen';
import HospitalNursesScreen from '../screens/hospital/HospitalNursesScreen';
import FAQScreen from '../screens/common/FAQScreen';

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
      <Stack.Screen name="HospitalSurgeryScreen" component={HospitalSurgeryScreen} />
      <Stack.Screen name="HospitalAnalyticsScreen" component={HospitalAnalyticsScreen} />
      <Stack.Screen name="HospitalMessagesScreen" component={HospitalMessagesScreen} />
      <Stack.Screen name="HospitalDoctorsScreen" component={HospitalDoctorsScreen} />
      <Stack.Screen name="HospitalNursesScreen" component={HospitalNursesScreen} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
    </Stack.Navigator>
  );
}