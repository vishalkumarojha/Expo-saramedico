import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import BottomNavBar from '../../components/BottomNavBar';
import Sidebar from '../../components/Sidebar'; 

export default function PatientDashboard({ navigation }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      
      <Sidebar 
        isVisible={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
        navigation={navigation}
      />

      <View style={styles.contentContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
                 <Ionicons name="menu-outline" size={28} color="#333" />
              </TouchableOpacity>
              <View style={{marginTop: 15}}>
                <Text style={styles.greetingTitle}>Good Morning, Daniel</Text>
                <Text style={styles.dateText}>Today is Tuesday, October 24, 2023</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
               <TouchableOpacity style={{marginRight: 15}}>
                 <Ionicons name="notifications-outline" size={24} color="#333" />
               </TouchableOpacity>
               <View style={styles.avatar}>
                 <Image source={{uri: 'https://i.pravatar.cc/100?img=11'}} style={styles.avatarImage} />
               </View>
            </View>
          </View>

          {/* --- SEARCH BAR --- */}
          <TouchableOpacity 
             style={styles.searchContainer} 
             activeOpacity={0.9}
             onPress={() => navigation.navigate('SearchScreen')}
          >
            <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
            <View pointerEvents="none" style={{flex: 1}}>
                <TextInput 
                  placeholder="Search visits, reports, notes..." 
                  placeholderTextColor="#999"
                  style={styles.searchInput}
                  editable={false} 
                />
            </View>
          </TouchableOpacity>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionRow}>
             <View style={styles.actionCard}>
                <View style={[styles.iconBox, {backgroundColor: '#FFEBEE'}]}><Ionicons name="heart" size={24} color="#F44336" /></View>
                <View><Text style={styles.actionLabel}>Heart Rate</Text><Text style={styles.actionValue}>72 bpm</Text></View>
             </View>
             <View style={styles.actionCard}>
                <View style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]}><Ionicons name="pulse" size={24} color="#2196F3" /></View>
                <View><Text style={styles.actionLabel}>BP</Text><Text style={styles.actionValue}>120/80</Text></View>
             </View>
             <View style={[styles.actionCard, {width: 60, marginRight: 20}]}>
               <View style={[styles.iconBox, {backgroundColor: '#FFF3E0'}]}><Ionicons name="wifi" size={24} color="#FF9800" /></View>
             </View>
          </ScrollView>

          {/* Up Next Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ScheduleScreen')}>
                <Text style={styles.linkText}>View Calendar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.appointmentCard}>
             <View style={styles.apptHeader}>
                <View>
                   <Text style={styles.apptTitle}>Annual Physical Examination</Text>
                   <View style={styles.apptSubRow}>
                      <View style={styles.tag}><Text style={styles.tagText}>In-Person Visit</Text></View>
                      <Text style={styles.docName}>with Dr. Emily Chen</Text>
                   </View>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                   <Text style={styles.timeText}>10:30</Text>
                   <Text style={styles.amPmText}>AM</Text>
                </View>
             </View>
             
             <View style={styles.apptActions}>
                {/* UPDATED: Check-in button now navigates to Video Call */}
                <TouchableOpacity 
                  style={styles.checkInBtn}
                  onPress={() => navigation.navigate('VideoCallScreen')}
                >
                  <Text style={styles.checkInText}>Check-in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.detailsBtn}>
                  <Text style={styles.detailsText}>Details</Text>
                </TouchableOpacity>
             </View>
          </View>

          {/* Recent Visits Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Visits</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MedicalRecordsScreen')}>
                <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.visitList}>
             <VisitItem name="Dr. Arvind Shukla" info="20m ago • MRI Analysis" status="Ready" statusColor="#E8F5E9" textColor="#2E7D32" color="#90CAF9" />
             <VisitItem name="Dr. Govind Sharma" info="2h ago • Lab Results" status="Pending" statusColor="#FFF8E1" textColor="#FBC02D" color="#9FA8DA" />
             <VisitItem name="Dr. Avantika Gupta" info="6h ago • Check-Up" status="Closed" statusColor="#EEEEEE" textColor="#757575" color="#B39DDB" />
          </View>

        </ScrollView>
      </View>

      <BottomNavBar navigation={navigation} activeTab="Home" />
    </SafeAreaView>
  );
}

const VisitItem = ({ name, info, status, statusColor, textColor, color }) => (
  <View style={styles.visitItem}>
     <View style={{flexDirection: 'row', alignItems: 'center'}}>
       <View style={[styles.visitAvatar, {backgroundColor: color}]} />
       <View><Text style={styles.visitName}>{name}</Text><Text style={styles.visitInfo}>{info}</Text></View>
     </View>
     <View style={[styles.statusBadge, {backgroundColor: statusColor}]}><Text style={[styles.statusText, {color: textColor}]}>• {status}</Text></View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  contentContainer: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  greetingTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  dateText: { fontSize: 13, color: '#666', marginTop: 4 },
  avatar: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', backgroundColor: '#ddd' },
  avatarImage: { width: '100%', height: '100%' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 25, borderWidth: 1, borderColor: '#F0F0F0' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#333' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  linkText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  quickActionRow: { flexDirection: 'row', marginBottom: 25 },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 16, marginRight: 15, width: 150, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 2 },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  actionLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  actionValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  appointmentCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: COLORS.primary, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  apptHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  apptTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  apptSubRow: { flexDirection: 'row', alignItems: 'center' },
  tag: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 10 },
  tagText: { color: COLORS.primary, fontSize: 11, fontWeight: '600' },
  docName: { color: '#666', fontSize: 13 },
  timeText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  amPmText: { fontSize: 12, color: '#999' },
  apptActions: { flexDirection: 'row', justifyContent: 'space-between' },
  checkInBtn: { backgroundColor: COLORS.primary, flex: 1, paddingVertical: 12, borderRadius: 10, marginRight: 10, alignItems: 'center' },
  checkInText: { color: 'white', fontWeight: '600' },
  detailsBtn: { backgroundColor: '#F5F5F5', flex: 1, paddingVertical: 12, borderRadius: 10, marginLeft: 10, alignItems: 'center' },
  detailsText: { color: '#333', fontWeight: '600' },
  visitList: { backgroundColor: 'white', borderRadius: 20, padding: 15 },
  visitItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  visitAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  visitName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  visitInfo: { fontSize: 12, color: '#999', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  statusText: { fontSize: 11, fontWeight: '600' },
});