import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminAccountManagementScreen from '../screens/admin/AdminAccountManagementScreen';
import AdminScheduleScreen from '../screens/admin/AdminScheduleScreen';
import AdminMessagesScreen from '../screens/admin/AdminMessagesScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import AdminInviteMemberScreen from '../screens/admin/AdminInviteMemberScreen';
import AdminEditUserScreen from '../screens/admin/AdminEditUserScreen';
import AdminSearchScreen from '../screens/admin/AdminSearchScreen';

const Stack = createStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="AdminFlow"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
      }}
    >
      <Stack.Screen name="AdminFlow" component={AdminDashboard} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="AdminAccountManagementScreen" component={AdminAccountManagementScreen} />
      <Stack.Screen name="AdminScheduleScreen" component={AdminScheduleScreen} />
      <Stack.Screen name="AdminMessagesScreen" component={AdminMessagesScreen} />
      <Stack.Screen name="AdminSettingsScreen" component={AdminSettingsScreen} />
      <Stack.Screen name="AdminInviteMemberScreen" component={AdminInviteMemberScreen} />
      <Stack.Screen name="AdminEditUserScreen" component={AdminEditUserScreen} />
      <Stack.Screen name="AdminSearchScreen" component={AdminSearchScreen} />
    </Stack.Navigator>
  );
}