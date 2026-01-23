import React, { useState } from 'react';
import { 
  View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image, Modal, TouchableWithoutFeedback 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import DoctorBottomNavBar from '../../components/DoctorBottomNavBar';
import DoctorNewMeetModal from './DoctorNewMeetModal'; 
import DoctorSidebar from '../../components/DoctorSidebar';

export default function DoctorDashboard({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const openNewMeet = () => { setModalVisible(false); setShowMeetModal(true); };
  const openAddPatient = () => { setModalVisible(false); navigation.navigate('DoctorPatientDirectoryScreen'); };
  const openUpload = () => { setModalVisible(false); navigation.navigate('DoctorQuickUploadScreen'); };

  return (
    <SafeAreaView style={styles.container}>
      
      <DoctorSidebar 
        isVisible={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
        navigation={navigation}
      />

      <View style={styles.contentContainer}>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
             <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
                <Ionicons name="menu-outline" size={28} color="#333" />
             </TouchableOpacity>
             <View style={styles.headerRight}>
                <TouchableOpacity><Ionicons name="notifications" size={24} color="#333" /></TouchableOpacity>
                <View style={styles.avatar} />
             </View>
          </View>

          <Text style={styles.greeting}>Good Morning, Dr. Rajeev</Text>
          <Text style={styles.subGreeting}>You have <Text style={{fontWeight:'bold'}}>5 appointments</Text> today</Text>

          {/* LINKED SEARCH BAR */}
          <TouchableOpacity 
            style={styles.searchContainer} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('DoctorSearchScreen')}
          >
             <Ionicons name="search-outline" size={20} color="#999" />
             <Text style={styles.placeholderText}>Search patients, reports, notes...</Text>
          </TouchableOpacity>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickRow}>
             <QuickActionItem icon="videocam" label="New Meet" color="#2196F3" bg="#E3F2FD" onPress={openNewMeet} />
             <QuickActionItem icon="person-add" label="Add Patient" color="#2196F3" bg="#E3F2FD" onPress={openAddPatient} />
             <QuickActionItem icon="mic" label="Dictate Note" color="#2196F3" bg="#E3F2FD" onPress={() => {}} />
             <QuickActionItem icon="document-text" label="Upload Doc" color="#2196F3" bg="#E3F2FD" onPress={openUpload} />
          </View>

          {/* Up Next */}
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Up Next</Text>
             <TouchableOpacity onPress={() => navigation.navigate('DoctorScheduleScreen')}>
                <Text style={styles.linkText}>View Calendar</Text>
             </TouchableOpacity>
          </View>

          <View style={styles.apptCard}>
             <View style={styles.apptRow}>
                <View style={styles.blueLine} />
                <View style={{flex:1}}>
                   <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                      <Text style={styles.patientName}>Abhinav Singh</Text>
                      <Text style={styles.timeText}>10:30</Text>
                   </View>
                   <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                       <View style={{flexDirection:'row', alignItems:'center'}}>
                          <View style={styles.tag}><Text style={styles.tagText}>Follow-Up</Text></View>
                          <Text style={styles.reasonText}>Post-op check</Text>
                       </View>
                       <Text style={styles.ampmText}>AM</Text>
                   </View>
                </View>
             </View>
             
             {/* LINKED BUTTONS */}
             <View style={styles.btnRow}>
                <TouchableOpacity 
                  style={styles.startBtn} 
                  onPress={() => navigation.navigate('DoctorPatientDetailScreen', { patient: { name: 'Abhinav Singh', mrn: 'N/A' } })}
                >
                    <Text style={styles.startBtnText}>Start Visit</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.detailsBtn} 
                  onPress={() => navigation.navigate('DoctorQuickUploadScreen')}
                >
                    <Text style={styles.detailsBtnText}>Details</Text>
                </TouchableOpacity>
             </View>
          </View>

          {/* Recent Patients */}
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Recent Patients</Text>
             <TouchableOpacity onPress={() => navigation.navigate('DoctorPatientDirectoryScreen')}>
                <Text style={styles.linkText}>View All</Text>
             </TouchableOpacity>
          </View>

          <View style={styles.recentCard}>
             <View style={styles.recentItem}>
                <View style={styles.recentAvatar} />
                <Text style={styles.recentName}>Arvind Shukla</Text>
                <View style={styles.statusBadge}><Text style={styles.statusText}>• Ready</Text></View>
             </View>
          </View>
          <View style={{height: 100}} /> 
        </ScrollView>

        <DoctorBottomNavBar 
           activeTab="Home" 
           onFabPress={() => setModalVisible(true)} 
           navigation={navigation}
        />
      </View>

      {/* Quick Actions Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
           <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalTransparentLayer} />
           </TouchableWithoutFeedback>
           <View style={styles.modalContent}>
              <View style={styles.dragHandle} />
              <Text style={styles.modalTitle}>Quick Actions</Text>
              <Text style={styles.modalSub}>Select an action to proceed</Text>
              <TouchableOpacity style={styles.modalItem} onPress={openNewMeet}>
                 <View style={styles.modalIconBox}><Ionicons name="videocam" size={24} color="#2196F3" /></View>
                 <View style={{flex:1}}><Text style={styles.modalItemTitle}>Start New Meet</Text><Text style={styles.modalItemSub}>Begin a new session with a patient</Text></View>
                 <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={openAddPatient}>
                 <View style={styles.modalIconBox}><Ionicons name="person-add" size={24} color="#2196F3" /></View>
                 <View style={{flex:1}}><Text style={styles.modalItemTitle}>Add Patient</Text><Text style={styles.modalItemSub}>Manually add a new Patient</Text></View>
                 <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={openUpload}>
                 <View style={styles.modalIconBox}><Ionicons name="document-text" size={24} color="#2196F3" /></View>
                 <View style={{flex:1}}><Text style={styles.modalItemTitle}>Upload Documents</Text><Text style={styles.modalItemSub}>Scan or import medical files</Text></View>
                 <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                 <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
           </View>
        </View>
      </Modal>

      <DoctorNewMeetModal visible={showMeetModal} onClose={() => setShowMeetModal(false)} navigation={navigation} />
    </SafeAreaView>
  );
}

const QuickActionItem = ({ icon, label, color, bg, onPress }) => (
  <TouchableOpacity style={styles.quickItem} onPress={onPress}>
     <View style={[styles.quickIconBox, {backgroundColor: bg}]}>
        <Ionicons name={icon} size={24} color={color} />
     </View>
     <Text style={styles.quickLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  contentContainer: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#DDD' },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subGreeting: { fontSize: 13, color: '#666', marginBottom: 20, marginTop: 4 },
  
  // Search Container as Touchable
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE', marginBottom: 25 },
  placeholderText: { flex: 1, marginLeft: 10, color: '#999' }, // Replaced Input with Text

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  quickItem: { alignItems: 'center', width: 75 },
  quickIconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 11, color: '#333', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  linkText: { color: '#2196F3', fontWeight: '600', fontSize: 13 },
  apptCard: { backgroundColor: 'white', borderRadius: 16, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  apptRow: { flexDirection: 'row', marginBottom: 15 },
  blueLine: { width: 4, backgroundColor: '#2196F3', borderRadius: 2, marginRight: 15, height: '100%' },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  timeText: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  tag: { backgroundColor: '#E3F2FD', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  tagText: { fontSize: 10, color: '#2196F3', fontWeight: 'bold' },
  reasonText: { fontSize: 12, color: '#666' },
  ampmText: { fontSize: 12, color: '#999' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  startBtn: { flex: 1, backgroundColor: '#2196F3', paddingVertical: 10, borderRadius: 8, marginRight: 10, alignItems: 'center' },
  startBtnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  detailsBtn: { flex: 1, backgroundColor: '#F5F5F5', paddingVertical: 10, borderRadius: 8, marginLeft: 10, alignItems: 'center' },
  detailsBtnText: { color: '#333', fontWeight: 'bold', fontSize: 13 },
  recentCard: { backgroundColor: 'white', borderRadius: 16, padding: 15 },
  recentItem: { flexDirection: 'row', alignItems: 'center' },
  recentAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#90CAF9', marginRight: 12 },
  recentName: { flex: 1, fontSize: 14, fontWeight: 'bold' },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: '#2E7D32', fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalTransparentLayer: { flex: 1 },
  modalContent: { backgroundColor: '#F9FAFC', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, alignItems: 'center' },
  dragHandle: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  modalSub: { fontSize: 13, color: '#666', marginBottom: 25 },
  modalItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', width: '100%', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  modalIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  modalItemTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  modalItemSub: { fontSize: 11, color: '#666', marginTop: 2 },
  closeBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1A2A3A', justifyContent: 'center', alignItems: 'center', marginTop: 10 }
});