import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function PatientBottomNavBar({ navigation, activeTab }) {
  
  const handleNav = (screen) => {
    if (activeTab !== screen) {
      if (screen === 'Home') navigation.navigate('PatientDashboard');
      if (screen === 'Records') navigation.navigate('MedicalRecordsScreen');
      if (screen === 'Schedule') navigation.navigate('ScheduleScreen');
      // Link to Settings Screen
      if (screen === 'Settings') navigation.navigate('PatientSettingsScreen');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <NavIcon name="home" label="Home" isActive={activeTab === 'Home'} onPress={() => handleNav('Home')} />
        <NavIcon name="folder-open" label="Records" isActive={activeTab === 'Records'} onPress={() => handleNav('Records')} />
        <NavIcon name="calendar" label="Schedule" isActive={activeTab === 'Schedule'} onPress={() => handleNav('Schedule')} />
        <NavIcon name="settings" label="Settings" isActive={activeTab === 'Settings'} onPress={() => handleNav('Settings')} />
      </View>
    </View>
  );
}

const NavIcon = ({ name, label, isActive, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
     <Ionicons 
       name={isActive ? name : `${name}-outline`} 
       size={24} 
       color={isActive ? COLORS.primary : '#999'} 
     />
     <Text style={[styles.navLabel, {color: isActive ? COLORS.primary : '#999'}]}>
        {label}
     </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  bar: { 
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    height: 70, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F0F0F0',
    paddingBottom: 10 
  },
  navItem: { alignItems: 'center', justifyContent: 'center', width: 60 },
  navLabel: { fontSize: 10, marginTop: 4, fontWeight: '500' },
});