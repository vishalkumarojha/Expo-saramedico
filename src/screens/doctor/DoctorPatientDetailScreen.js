import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export default function DoctorPatientDetailScreen({ route, navigation }) {
  // Get patient data passed from directory
  const { patient } = route.params || {}; 
  const [activeTab, setActiveTab] = useState('Visits'); // 'Visits' or 'Documents'

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Patient Profile</Text>
            <View style={{width: 24}} /> 
        </View>

        {/* Profile Info */}
        <View style={styles.profileHeader}>
           <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                 <Ionicons name="camera" size={30} color="#999" />
              </View>
              <View style={styles.editBadge}>
                 <Ionicons name="pencil" size={12} color="white" />
              </View>
           </View>
           <Text style={styles.patientName}>{patient?.name || 'Sara Shetty'}</Text>
           <Text style={styles.patientMeta}>35y Female - MRN {patient?.mrn || '89120'}</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
           <TouchableOpacity 
             style={[styles.tab, activeTab === 'Visits' && styles.activeTab]}
             onPress={() => setActiveTab('Visits')}
           >
              <Text style={[styles.tabText, activeTab === 'Visits' && styles.activeTabText]}>Visits</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             style={[styles.tab, activeTab === 'Documents' && styles.activeTab]}
             onPress={() => setActiveTab('Documents')}
           >
              <Text style={[styles.tabText, activeTab === 'Documents' && styles.activeTabText]}>Documents</Text>
           </TouchableOpacity>
        </View>

        {/* Tab Content - Navigation passed to VisitsView */}
        <View style={styles.tabContent}>
           {activeTab === 'Visits' ? (
             <VisitsView navigation={navigation} /> 
           ) : (
             <DocumentsView />
           )}
        </View>

      </View>
    </SafeAreaView>
  );
}

// --- SUB-COMPONENTS ---

function VisitsView({ navigation }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
       <Text style={styles.sectionLabel}>RECENT HISTORY</Text>
       
       {/* Visit Card 1 */}
       <View style={styles.visitCard}>
          <View style={styles.visitHeader}>
             <Text style={styles.visitDate}>OCT 14, 2023 - 2:30 PM</Text>
             {/* LINKED VIEW BUTTON */}
             <TouchableOpacity 
               style={styles.viewBtn} 
               onPress={() => navigation.navigate('DoctorPostVisitScreen')}
             >
                <Text style={styles.viewBtnText}>View</Text>
             </TouchableOpacity>
          </View>
          <Text style={styles.visitTitle}>Cardiology Follow-up</Text>
          <Text style={styles.visitDesc}>Patient reports reduced palpitations since starting the new routine.</Text>
          <View style={styles.bulletPoint}><Text style={styles.bulletText}>• BP is unstable</Text></View>
          <View style={styles.bulletPoint}><Text style={styles.bulletText}>• Frequent Fever</Text></View>
       </View>

       {/* Visit Card 2 */}
       <View style={styles.visitCard}>
          <View style={styles.visitHeader}>
             <Text style={styles.visitDate}>SEPT 12, 2023 - 2:30 PM</Text>
             {/* LINKED VIEW BUTTON */}
             <TouchableOpacity 
               style={styles.viewBtn}
               onPress={() => navigation.navigate('DoctorPostVisitScreen')}
             >
                <Text style={styles.viewBtnText}>View</Text>
             </TouchableOpacity>
          </View>
          <Text style={styles.visitTitle}>General Check-up</Text>
          <Text style={styles.visitDesc}>Routine Checkup, Patient expressed concerns about knee pain during exercises.</Text>
          <View style={styles.bulletPoint}><Text style={styles.bulletText}>• High Blood Pressure</Text></View>
          <View style={styles.bulletPoint}><Text style={styles.bulletText}>• No Fever</Text></View>
       </View>
       <View style={{height: 20}} />
    </ScrollView>
  );
}

function DocumentsView() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
       <Text style={styles.sectionLabel}>RECENT DOCUMENTS</Text>
       
       <DocumentItem 
         title="Lab_Result_Bloodwork.pdf" 
         sub="Uploaded Oct 10 - 2.5 MB" 
       />
       <DocumentItem 
         title="Routine_Check.pdf" 
         sub="Uploaded Sept 14 - 4.4 MB" 
       />
       <DocumentItem 
         title="MRI_Scan_Report.pdf" 
         sub="Uploaded Aug 20 - 12 MB" 
       />
    </ScrollView>
  );
}

const DocumentItem = ({ title, sub }) => (
  <TouchableOpacity style={styles.docItem}>
     <View style={styles.pdfIcon}>
        <Ionicons name="document-text" size={24} color="#E53935" />
     </View>
     <View style={{flex: 1}}>
        <Text style={styles.docTitle}>{title}</Text>
        <Text style={styles.docSub}>{sub}</Text>
     </View>
     <Ionicons name="ellipsis-vertical" size={20} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  profileHeader: { alignItems: 'center', marginBottom: 25 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F0F2F5', justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  patientName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  patientMeta: { fontSize: 13, color: '#999' },

  tabContainer: { flexDirection: 'row', backgroundColor: '#E3E8ED', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: COLORS.primary, fontWeight: 'bold' },
  tabContent: { flex: 1 },

  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 15, marginTop: 5, letterSpacing: 0.5, textTransform: 'uppercase' },

  visitCard: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  visitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  visitDate: { fontSize: 11, color: '#999', fontWeight: '600', textTransform: 'uppercase' },
  viewBtn: { backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  viewBtnText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  visitTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  visitDesc: { fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 10 },
  bulletPoint: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  bulletText: { fontSize: 13, color: '#444' },

  docItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  pdfIcon: { width: 40, height: 40, backgroundColor: '#FFEBEE', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  docTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  docSub: { fontSize: 12, color: '#999', marginTop: 2 }
});