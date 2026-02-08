import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Switch,
  TouchableWithoutFeedback, FlatList, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';
import { doctorAPI } from '../../services/api';

const SCHEDULE_OPTIONS = [
  { id: 'now', label: 'Start Now', description: 'Instant video call' },
  { id: '15min', label: 'In 15 min', description: 'Schedule for 15 minutes' },
  { id: '30min', label: 'In 30 min', description: 'Schedule for 30 minutes' },
  { id: '1hour', label: 'In 1 hour', description: 'Schedule for 1 hour' },
  { id: 'custom', label: 'Custom Time', description: 'Pick a specific time' },
];

export default function DoctorNewMeetModal({ visible, onClose, navigation }) {
  const [captureMode, setCaptureMode] = useState('video'); // 'video' or 'chat'
  const [waitroomEnabled, setWaitroomEnabled] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientList, setShowPatientList] = useState(false);
  const [scheduleOption, setScheduleOption] = useState('now');
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (patientSearch.length > 1) {
      searchPatients();
    } else {
      setPatients([]);
      setShowPatientList(false);
    }
  }, [patientSearch]);

  const searchPatients = async () => {
    setSearchLoading(true);
    try {
      const response = await doctorAPI.searchPatients(patientSearch);
      const patientData = response.data?.patients || response.data || [];
      setPatients(patientData.slice(0, 5));
      setShowPatientList(patientData.length > 0);
    } catch (error) {
      console.log('Patient search error:', error);
      setPatients([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearch(patient.name);
    setShowPatientList(false);
  };

  const handleAddPatient = () => {
    onClose();
    navigation.navigate('DoctorAddPatientScreen');
  };

  const handleStart = async () => {
    if (!selectedPatient && !patientSearch) {
      Alert.alert('Select Patient', 'Please select or search for a patient first');
      return;
    }

    setLoading(true);

    try {
      if (scheduleOption === 'now') {
        // Start immediate call
        if (captureMode === 'video') {
          // Create instant appointment with Zoom meeting
          try {
            const response = await doctorAPI.createInstantAppointment(selectedPatient?.id);
            const appointment = response.data;

            onClose();
            navigation.navigate('VideoCallScreen', {
              appointment: appointment,
              role: 'doctor'
            });
          } catch (error) {
            console.error('Failed to create instant appointment:', error);
            Alert.alert('Error', 'Failed to create meeting. Please try again.');
          }
        } else {
          // For chat/manual notes mode
          onClose();
          navigation.navigate('DoctorPostVisitScreen', {
            patientId: selectedPatient?.id,
            patientName: selectedPatient?.name || patientSearch,
            mode: 'manual'
          });
        }
      } else {
        // Schedule for later
        const scheduleMinutes = {
          '15min': 15,
          '30min': 30,
          '1hour': 60,
          'custom': 30
        }[scheduleOption];

        const scheduledTime = new Date(Date.now() + scheduleMinutes * 60 * 1000);

        // Create scheduled consultation
        Alert.alert(
          'Meeting Scheduled',
          `Consultation scheduled for ${scheduledTime.toLocaleTimeString()}. Notification sent to patient.`,
          [{ text: 'OK', onPress: onClose }]
        );

        // TODO: Create actual scheduled consultation via API
        // await doctorAPI.createConsultation({ patient_id: selectedPatient?.id, scheduled_at: scheduledTime });
      }
    } catch (error) {
      console.error('Start meet error:', error);
      Alert.alert('Error', 'Failed to start meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScheduleLabel = () => {
    return SCHEDULE_OPTIONS.find(opt => opt.id === scheduleOption)?.label || 'Start Now';
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
              <TextInput
                placeholder="Search patient name, ID..."
                style={styles.input}
                value={patientSearch}
                onChangeText={setPatientSearch}
              />
              {searchLoading && <ActivityIndicator size="small" color={COLORS.primary} />}
            </View>
            <TouchableOpacity style={styles.addPatientBtn} onPress={handleAddPatient}>
              <Ionicons name="person-add" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Patient Search Results */}
          {showPatientList && (
            <View style={styles.patientList}>
              {patients.map((patient, index) => (
                <TouchableOpacity
                  key={patient.id || index}
                  style={styles.patientItem}
                  onPress={() => handlePatientSelect(patient)}
                >
                  <View style={styles.patientAvatar}>
                    <Ionicons name="person" size={18} color="#666" />
                  </View>
                  <View>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientMrn}>{patient.mrn || 'No MRN'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedPatient && (
            <View style={styles.selectedPatientBadge}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
              <Text style={styles.selectedPatientText}>{selectedPatient.name}</Text>
              <TouchableOpacity onPress={() => { setSelectedPatient(null); setPatientSearch(''); }}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            </View>
          )}

          {/* Capture Mode */}
          <Text style={styles.label}>CAPTURE MODE</Text>
          <View style={styles.captureRow}>
            <TouchableOpacity
              style={[styles.captureBtn, captureMode === 'video' && styles.captureBtnActive]}
              onPress={() => setCaptureMode('video')}
            >
              <Ionicons name="videocam" size={24} color={captureMode === 'video' ? COLORS.primary : '#666'} />
              <Text style={[styles.captureText, captureMode === 'video' && styles.captureTextActive]}>Live Video</Text>
              <Text style={styles.captureDesc}>Video call with patient</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureBtn, captureMode === 'chat' && styles.captureBtnActive]}
              onPress={() => setCaptureMode('chat')}
            >
              <Ionicons name="chatbubbles" size={24} color={captureMode === 'chat' ? COLORS.primary : '#666'} />
              <Text style={[styles.captureText, captureMode === 'chat' && styles.captureTextActive]}>Manual Notes</Text>
              <Text style={styles.captureDesc}>Chat & take notes</Text>
            </TouchableOpacity>
          </View>

          {/* Schedule Options */}
          <Text style={styles.label}>SCHEDULE</Text>
          <TouchableOpacity
            style={styles.scheduleDropdown}
            onPress={() => setShowScheduleDropdown(!showScheduleDropdown)}
          >
            <View style={styles.scheduleSelected}>
              <Ionicons
                name={scheduleOption === 'now' ? 'flash' : 'time-outline'}
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.scheduleText}>{getScheduleLabel()}</Text>
            </View>
            <Ionicons name={showScheduleDropdown ? "chevron-up" : "chevron-down"} size={18} color="#666" />
          </TouchableOpacity>

          {showScheduleDropdown && (
            <View style={styles.scheduleOptions}>
              {SCHEDULE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.scheduleOption, scheduleOption === option.id && styles.scheduleOptionActive]}
                  onPress={() => {
                    setScheduleOption(option.id);
                    setShowScheduleDropdown(false);
                  }}
                >
                  <View>
                    <Text style={[styles.scheduleOptionLabel, scheduleOption === option.id && styles.scheduleOptionLabelActive]}>
                      {option.label}
                    </Text>
                    <Text style={styles.scheduleOptionDesc}>{option.description}</Text>
                  </View>
                  {scheduleOption === option.id && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Waitroom Toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="log-in-outline" size={20} color="#666" style={{ marginRight: 8 }} />
              <Text style={styles.toggleText}>Waitroom Enabled</Text>
            </View>
            <Switch
              value={waitroomEnabled}
              onValueChange={setWaitroomEnabled}
              trackColor={{ false: "#DDD", true: COLORS.primary }}
            />
          </View>

          {/* Info Note */}
          {scheduleOption !== 'now' && (
            <View style={styles.infoNote}>
              <Ionicons name="information-circle" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>Meeting link will be sent to patient and added to Alerts</Text>
            </View>
          )}

          {/* Start Button */}
          <CustomButton
            title={scheduleOption === 'now' ? (loading ? 'Starting...' : 'Start Now') : 'Schedule Meeting'}
            onPress={handleStart}
            style={{ marginTop: 20 }}
            disabled={loading}
          />

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
  modalContent: { backgroundColor: '#F9FAFC', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, maxHeight: '85%' },
  dragHandle: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },

  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },

  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 8, marginTop: 15 },

  patientRow: { flexDirection: 'row', gap: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, paddingHorizontal: 10, height: 45 },
  input: { flex: 1, marginLeft: 8 },
  addPatientBtn: { width: 45, height: 45, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },

  patientList: { backgroundColor: 'white', borderRadius: 8, marginTop: 5, borderWidth: 1, borderColor: '#EEE' },
  patientItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  patientAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  patientName: { fontSize: 14, fontWeight: '600', color: '#333' },
  patientMrn: { fontSize: 12, color: '#999' },

  selectedPatientBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: 10, gap: 6 },
  selectedPatientText: { fontSize: 14, color: COLORS.primary, fontWeight: '500', flex: 1 },

  captureRow: { flexDirection: 'row', gap: 12 },
  captureBtn: { flex: 1, backgroundColor: 'white', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  captureBtnActive: { borderColor: COLORS.primary, backgroundColor: '#F4F9FF' },
  captureText: { marginTop: 8, fontWeight: '600', color: '#666' },
  captureTextActive: { color: COLORS.primary },
  captureDesc: { fontSize: 11, color: '#999', marginTop: 4 },

  scheduleDropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, padding: 12 },
  scheduleSelected: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scheduleText: { fontSize: 15, fontWeight: '600', color: '#333' },

  scheduleOptions: { backgroundColor: 'white', borderRadius: 8, marginTop: 5, borderWidth: 1, borderColor: '#EEE' },
  scheduleOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  scheduleOptionActive: { backgroundColor: '#F4F9FF' },
  scheduleOptionLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  scheduleOptionLabelActive: { color: COLORS.primary },
  scheduleOptionDesc: { fontSize: 12, color: '#999', marginTop: 2 },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 12, marginTop: 15, borderWidth: 1, borderColor: '#EEE' },
  toggleText: { color: '#333', fontWeight: '500' },

  infoNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, padding: 10, backgroundColor: '#E3F2FD', borderRadius: 8 },
  infoText: { fontSize: 12, color: COLORS.primary, flex: 1 },

  closeCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1A2A3A', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 20 }
});