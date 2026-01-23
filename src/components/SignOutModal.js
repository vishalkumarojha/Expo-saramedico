import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function SignOutModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
         <View style={styles.modalContainer}>
            
            {/* Icon Bubble */}
            <View style={styles.iconBubble}>
               <Ionicons name="lock-closed" size={24} color="#333" />
               <View style={styles.badge}>
                  <Ionicons name="person" size={10} color="white" />
               </View>
            </View>

            <Text style={styles.title}>Sign Out?</Text>
            <Text style={styles.subText}>You will be logged out of this app</Text>

            <View style={styles.buttonRow}>
               <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                  <Text style={styles.confirmText}>Confirm</Text>
               </TouchableOpacity>
               
               <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
               </TouchableOpacity>
            </View>

         </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  
  iconBubble: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginBottom: 15, position: 'relative' },
  badge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#333', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },

  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  subText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25 },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  
  confirmBtn: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 10, marginRight: 10, alignItems: 'center' },
  confirmText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  cancelBtn: { flex: 1, backgroundColor: '#F5F7FA', paddingVertical: 12, borderRadius: 10, marginLeft: 10, alignItems: 'center' },
  cancelText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }
});