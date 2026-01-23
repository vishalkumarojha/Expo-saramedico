import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function DoctorBottomNavBar({ navigation, activeTab, onFabPress }) {
  
  const handleNav = (screen) => {
    if (activeTab !== screen) {
      if (screen === 'Home') navigation.navigate('DoctorDashboard');
      // Patients Tab -> Links to Patient Directory (which serves as the record list)
      if (screen === 'Patients') navigation.navigate('DoctorPatientDirectoryScreen');
      // Schedule Tab -> Links to the newly created Schedule Screen
      if (screen === 'Schedule') navigation.navigate('DoctorScheduleScreen');
      // Alerts Tab -> Links to the newly created Alerts Screen
      if (screen === 'Alerts') navigation.navigate('DoctorAlertsScreen');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        
        {/* Left Side */}
        <NavIcon 
           name="home" 
           label="Home" 
           isActive={activeTab === 'Home'} 
           onPress={() => handleNav('Home')} 
        />
        <NavIcon 
           name="people" 
           label="Patients" 
           isActive={activeTab === 'Patients'} 
           onPress={() => handleNav('Patients')} 
        />

        {/* Center Space for FAB */}
        <View style={{ width: 60 }} /> 

        {/* Right Side */}
        <NavIcon 
           name="calendar" 
           label="Schedule" 
           isActive={activeTab === 'Schedule'} 
           onPress={() => handleNav('Schedule')} 
        />
        <NavIcon 
           name="notifications" 
           label="Alerts" 
           isActive={activeTab === 'Alerts'} 
           onPress={() => handleNav('Alerts')} 
        />
      </View>

      {/* Floating Action Button (+) */}
      <TouchableOpacity style={styles.fab} onPress={onFabPress} activeOpacity={0.9}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
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
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    height: 80, 
    backgroundColor: 'white', 
    borderTopWidth: 1, 
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingBottom: 10 
  },
  navItem: { alignItems: 'center', justifyContent: 'center', width: 60 },
  navLabel: { fontSize: 10, marginTop: 4, fontWeight: '500' },
  
  fab: { 
    position: 'absolute', 
    top: -25, 
    alignSelf: 'center', 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#2196F3', 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  }
});