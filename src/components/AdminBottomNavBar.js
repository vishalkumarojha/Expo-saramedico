import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function AdminBottomNavBar({ navigation, activeTab }) {
  
  const handleNav = (screen) => {
    if (activeTab !== screen) {
      if (screen === 'Home') navigation.navigate('AdminDashboard');
      if (screen === 'Records') navigation.navigate('AdminAccountManagementScreen');
      if (screen === 'Appointments') navigation.navigate('AdminScheduleScreen'); // NEW
      if (screen === 'Messages') navigation.navigate('AdminMessagesScreen');     // NEW
      if (screen === 'Settings') navigation.navigate('AdminSettingsScreen');     // NEW
    }
  };

  return (
    <View style={styles.bottomNav}>
       <NavIcon name="home" label="Home" isActive={activeTab === 'Home'} onPress={() => handleNav('Home')} />
       <NavIcon name="people" label="Records" isActive={activeTab === 'Records'} onPress={() => handleNav('Records')} />
       <NavIcon name="calendar" label="Appointments" isActive={activeTab === 'Appointments'} onPress={() => handleNav('Appointments')} />
       <NavIcon name="chatbubbles" label="Messages" isActive={activeTab === 'Messages'} onPress={() => handleNav('Messages')} />
       <NavIcon name="settings" label="Settings" isActive={activeTab === 'Settings'} onPress={() => handleNav('Settings')} />
    </View>
  );
}

const NavIcon = ({ name, label, isActive, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
     <Ionicons name={isActive ? name : `${name}-outline`} size={24} color={isActive ? COLORS.primary : '#999'} />
     <Text style={[styles.navLabel, {color: isActive ? COLORS.primary : '#999'}]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  navItem: { alignItems: 'center', padding: 10 },
  navLabel: { fontSize: 10, marginTop: 4 }
});