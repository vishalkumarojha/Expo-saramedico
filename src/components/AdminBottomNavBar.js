import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const TAB_ITEMS = [
  { name: 'Home', icon: 'home', screen: 'AdminDashboard' },
  { name: 'Accounts', icon: 'people', screen: 'AdminAccountManagementScreen' },
  { name: 'Settings', icon: 'settings', screen: 'AdminSettingsScreen' },
];

export default function AdminBottomNavBar({ navigation, activeTab }) {

  const handleNav = (tab) => {
    if (activeTab !== tab.name) {
      navigation.navigate(tab.screen);
    }
  };

  return (
    <View style={styles.bottomNav}>
      {TAB_ITEMS.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.navItem}
          onPress={() => handleNav(tab)}
        >
          <Ionicons
            name={activeTab === tab.name ? tab.icon : `${tab.icon}-outline`}
            size={24}
            color={activeTab === tab.name ? COLORS.primary : '#999'}
          />
          <Text style={[
            styles.navLabel,
            { color: activeTab === tab.name ? COLORS.primary : '#999' }
          ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  navItem: { alignItems: 'center', padding: 10, flex: 1 },
  navLabel: { fontSize: 11, marginTop: 4, fontWeight: '500' }
});