import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import SignOutModal from './SignOutModal';
import { authAPI } from '../services/api';

export default function AdminSidebar({ isVisible, onClose, navigation }) {
  const [showSignOut, setShowSignOut] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      loadAdminData();
    }
  }, [isVisible]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      const firstName = response.data?.first_name || '';
      const lastName = response.data?.last_name || '';
      setAdminName(firstName && lastName ? `${firstName} ${lastName}` : 'Admin User');
    } catch (error) {
      console.log('Using default admin name');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (screenName) => {
    onClose();
    if (screenName) {
      navigation.navigate(screenName);
    }
  };

  const confirmSignOut = () => {
    setShowSignOut(false);
    onClose();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          {/* Transparent Layer */}
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalTransparentLayer} />
          </TouchableWithoutFeedback>

          {/* Sidebar Content */}
          <View style={styles.sidebarContainer}>
            {/* Header */}
            <View style={styles.sidebarHeader}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={28} color="#FFF" />
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginBottom: 30 }} />
            ) : (
              <>
                <Text style={styles.sidebarName}>{adminName}</Text>
                <Text style={styles.sidebarRole}>Administrator</Text>
              </>
            )}

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              <Text style={styles.sectionHeader}>NAVIGATION</Text>

              <MenuItem
                icon="home"
                label="Dashboard"
                onPress={() => handleNavigation('AdminDashboard')}
                active
              />
              <MenuItem
                icon="people-outline"
                label="Account Management"
                onPress={() => handleNavigation('AdminAccountManagementScreen')}
              />

              <Text style={styles.sectionHeader}>DIRECTORY</Text>

              <MenuItem
                icon="medical-outline"
                label="Doctors"
                onPress={() => handleNavigation('AdminDoctorsScreen')}
              />
              <MenuItem
                icon="business-outline"
                label="Organizations"
                onPress={() => handleNavigation('AdminOrganizationsScreen')}
              />
            </View>

            {/* Footer Items */}
            <View style={styles.sidebarFooter}>
              <MenuItem
                icon="settings-outline"
                label="Settings"
                onPress={() => handleNavigation('AdminSettingsScreen')}
              />
              <MenuItem
                icon="log-out-outline"
                label="Sign Out"
                onPress={() => setShowSignOut(true)}
                danger
              />
            </View>
          </View>
        </View>
      </Modal>

      <SignOutModal
        visible={showSignOut}
        onCancel={() => setShowSignOut(false)}
        onConfirm={confirmSignOut}
      />
    </>
  );
}

// Helper Component
const MenuItem = ({ icon, label, onPress, active, danger }) => (
  <TouchableOpacity style={[styles.menuItem, active && styles.menuItemActive]} onPress={onPress}>
    <Ionicons
      name={icon}
      size={22}
      color={danger ? '#F44336' : active ? COLORS.primary : '#333'}
    />
    <Text style={[
      styles.menuText,
      active && styles.menuTextActive,
      danger && { color: '#F44336' }
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalTransparentLayer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },

  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '75%',
    backgroundColor: 'white',
    padding: 25,
    elevation: 10,
  },

  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 40, marginBottom: 15 },
  avatarPlaceholder: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  sidebarName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  sidebarRole: { fontSize: 13, color: '#666', marginBottom: 25 },

  sectionHeader: { fontSize: 11, fontWeight: 'bold', color: '#999', marginTop: 15, marginBottom: 10, letterSpacing: 0.5 },

  menuContainer: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginBottom: 5 },
  menuItemActive: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, borderRadius: 10, marginLeft: -10 },
  menuText: { fontSize: 15, marginLeft: 15, color: '#333', fontWeight: '500' },
  menuTextActive: { color: COLORS.primary, fontWeight: '600' },

  sidebarFooter: { marginTop: 'auto', marginBottom: 20 },
});