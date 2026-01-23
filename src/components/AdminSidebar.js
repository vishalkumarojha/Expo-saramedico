import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Modal, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import SignOutModal from './SignOutModal';

export default function AdminSidebar({ isVisible, onClose, navigation }) {
  const [showSignOut, setShowSignOut] = useState(false);

  const handleNavigation = (screenName) => {
    onClose(); 
    if (screenName) {
      navigation.navigate(screenName);
    }
  };

  const onSignOutClick = () => {
    setShowSignOut(true);
  };

  const confirmSignOut = () => {
    setShowSignOut(false);
    onClose();
    // FIX: Reset navigation stack to Auth
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
                 <Image 
                   source={{uri: 'https://i.pravatar.cc/100?img=8'}} 
                   style={styles.sidebarAvatar} 
                 />
                 <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color="#333" />
                 </TouchableOpacity>
              </View>
              
              <Text style={styles.sidebarName}>Admin User</Text>

              {/* Menu Items */}
              <View style={styles.menuContainer}>
                  <MenuItem 
                    icon="home" 
                    label="Home" 
                    onPress={() => handleNavigation('AdminDashboard')} 
                  />
                  <MenuItem 
                    icon="people-outline" 
                    label="My Records" 
                    onPress={() => handleNavigation('AdminAccountManagementScreen')} 
                  />
                  <MenuItem 
                    icon="calendar-outline" 
                    label="Appointments" 
                    onPress={() => handleNavigation('AdminScheduleScreen')} 
                  />
                  <MenuItem 
                    icon="chatbubbles-outline" 
                    label="Messages" 
                    onPress={() => handleNavigation('AdminMessagesScreen')} 
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
                    onPress={onSignOutClick} 
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
const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
     <Ionicons name={icon} size={22} color="#333" />
     <Text style={styles.menuText}>{label}</Text>
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
    shadowColor: "#000", 
    elevation: 10,
    zIndex: 1000 
  },
  
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 15 },
  sidebarAvatar: { width: 55, height: 55, borderRadius: 27.5 },
  sidebarName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 35 },
  
  menuContainer: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuText: { fontSize: 16, marginLeft: 15, color: '#333', fontWeight: '500' },
  
  sidebarFooter: { marginTop: 'auto', marginBottom: 20 },
});