import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Switch, TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

export default function DoctorNewMeetModal({ visible, onClose, navigation }) {
  const [captureMode, setCaptureMode] = useState('audio'); // 'audio' or 'manual'
  const [waitroomEnabled, setWaitroomEnabled] = useState(false);

  const handleStart = () => {
    onClose();
    // UPDATED: Navigate to the shared Video Call Screen
    navigation.navigate('VideoCallScreen');
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <View style={styles.dragHandle} />
          
          <Text style={styles.title}>Start New Consultation</Text>
          <Text style={styles.subtitle}>Select patient and capture mode</Text>

          {/* Patient Selection */}
          <Text style={styles.label}>PATIENT</Text>
          <View style={styles.patientRow}>
            <View style={styles.searchBox}>
               <Ionicons name="search" size={18} color="#999" />
               <TextInput placeholder="Search name, ID..." style={styles.input} />
            </View>
            <TouchableOpacity style={styles.addNewBtn}>
               <Text style={styles.addNewText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {/* Capture Mode */}
          <Text style={styles.label}>CAPTURE MODE</Text>
          <View style={styles.captureRow}>
             <TouchableOpacity 
               style={[styles.captureBtn, captureMode === 'audio' && styles.captureBtnActive]}
               onPress={() => setCaptureMode('audio')}
             >
                <Ionicons name="mic" size={24} color={captureMode === 'audio' ? COLORS.primary : '#666'} />
                <Text style={[styles.captureText, captureMode === 'audio' && styles.captureTextActive]}>Live Audio</Text>
             </TouchableOpacity>

             <TouchableOpacity 
               style={[styles.captureBtn, captureMode === 'manual' && styles.captureBtnActive]}
               onPress={() => setCaptureMode('manual')}
             >
                <Ionicons name="create" size={24} color={captureMode === 'manual' ? COLORS.primary : '#666'} />
                <Text style={[styles.captureText, captureMode === 'manual' && styles.captureTextActive]}>Manual Notes</Text>
             </TouchableOpacity>
          </View>

          {/* Room Settings */}
          <Text style={styles.label}>ROOM</Text>
          <View style={styles.roomRow}>
             <View style={styles.durationDropdown}>
                <Text style={{fontWeight:'600'}}>30 min</Text>
                <Ionicons name="chevron-down" size={16} color="#333" />
             </View>
             <TextInput placeholder="Room Name (Optional)" style={styles.roomInput} />
          </View>

          {/* Waitroom Toggle */}
          <View style={styles.toggleRow}>
             <View style={{flexDirection:'row', alignItems:'center'}}>
                <Ionicons name="log-in-outline" size={20} color="#666" style={{marginRight:8}} />
                <Text style={styles.toggleText}>Waitroom Enabled</Text>
             </View>
             <Switch 
               value={waitroomEnabled} 
               onValueChange={setWaitroomEnabled}
               trackColor={{ false: "#DDD", true: COLORS.primary }}
             />
          </View>

          {/* Start Button */}
          <CustomButton title="Start" onPress={handleStart} style={{marginTop: 20}} />

          {/* Close X Button */}
          <TouchableOpacity style={styles.closeCircle} onPress={onClose}>
             <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  backdrop: { flex: 1 },
  modalContent: { backgroundColor: '#F9FAFC', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25 },
  dragHandle: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25 },

  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 8, marginTop: 15 },
  
  patientRow: { flexDirection: 'row', gap: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, paddingHorizontal: 10, height: 45 },
  input: { flex: 1, marginLeft: 8 },
  addNewBtn: { backgroundColor: '#E3F2FD', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8 },
  addNewText: { color: COLORS.primary, fontWeight: 'bold' },

  captureRow: { flexDirection: 'row', gap: 15 },
  captureBtn: { flex: 1, backgroundColor: 'white', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  captureBtnActive: { borderColor: COLORS.primary, backgroundColor: '#F4F9FF' },
  captureText: { marginTop: 8, fontWeight: '600', color: '#666' },
  captureTextActive: { color: COLORS.primary },

  roomRow: { flexDirection: 'row', gap: 10 },
  durationDropdown: { width: 90, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, paddingHorizontal: 10, height: 45 },
  roomInput: { flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, paddingHorizontal: 10, height: 45 },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 12, marginTop: 15, borderWidth: 1, borderColor: '#EEE' },
  toggleText: { color: '#333', fontWeight: '500' },

  closeCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1A2A3A', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 20 }
});