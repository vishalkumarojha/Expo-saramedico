import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const TAB_ITEMS = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', screen: 'HospitalDashboard' },
    { name: 'Team', icon: 'people-outline', activeIcon: 'people', screen: 'HospitalTeamScreen' },
    { name: 'Schedule', icon: 'calendar-outline', activeIcon: 'calendar', screen: 'HospitalScheduleScreen' },
    { name: 'Settings', icon: 'settings-outline', activeIcon: 'settings', screen: 'HospitalSettingsScreen' },
];

export default function HospitalBottomNavBar({ navigation, activeTab }) {
    return (
        <View style={styles.navBar}>
            {TAB_ITEMS.map((item) => (
                <TouchableOpacity
                    key={item.name}
                    style={styles.navItem}
                    onPress={() => navigation.navigate(item.screen)}
                >
                    <Ionicons
                        name={activeTab === item.name ? item.activeIcon : item.icon}
                        size={24}
                        color={activeTab === item.name ? COLORS.primary : '#999'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
});
