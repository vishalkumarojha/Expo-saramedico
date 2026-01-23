import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import DoctorBottomNavBar from '../../components/DoctorBottomNavBar';
import DoctorNewMeetModal from './DoctorNewMeetModal'; // Reusing the modal

export default function DoctorScheduleScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('14');
  const [modalVisible, setModalVisible] = useState(false); // For Quick Actions FAB
  
  // Mock Data for the calendar strip
  const dates = [
    { day: 'Mon', date: '12' },
    { day: 'Tue', date: '13' },
    { day: 'Wed', date: '14' },
    { day: 'Thu', date: '15' },
    { day: 'Fri', date: '16' },
    { day: 'Sat', date: '17' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Schedule</Text>
            <View style={{width: 24}} /> 
        </View>

        {/* Date Strip */}
        <View style={styles.calendarStrip}>
           {dates.map((item, i) => {
              const isActive = item.date === selectedDate;
              return (
                <TouchableOpacity 
                  key={i} 
                  style={[styles.dateBox, isActive && styles.activeDateBox]}
                  onPress={() => setSelectedDate(item.date)}
                >
                   <Text style={[styles.dateText, isActive && styles.activeDateText]}>{item.day}</Text>
                   <Text style={[styles.dateNum, isActive && styles.activeDateText]}>{item.date}</Text>
                </TouchableOpacity>
              );
           })}
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
            <TouchableOpacity style={[styles.chip, styles.chipActive]}><Text style={styles.chipTextActive}>All</Text></TouchableOpacity>
            <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Consultation</Text></TouchableOpacity>
            <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Procedures</Text></TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
           {/* Appointment 1 */}
           <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>09:00{'\n'}AM</Text>
              <View style={styles.timelineLine} />
              <View style={styles.card}>
                 <View style={styles.cardHeader}>
                    <Image source={{uri: 'https://i.pravatar.cc/100?img=12'}} style={styles.avatar} />
                    <View style={{flex: 1, marginLeft: 10}}>
                       <Text style={styles.docName}>Sarah Jenkins</Text>
                       <Text style={styles.docType}>General Consultation</Text>
                    </View>
                    <View style={[styles.statusBadge, {backgroundColor: '#E3F2FD'}]}>
                        <Text style={[styles.statusText, {color: COLORS.primary}]}>CONFIRMED</Text>
                    </View>
                 </View>
                 <Text style={styles.duration}>54 min</Text>
              </View>
           </View>

           {/* Appointment 2 */}
           <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>10:00{'\n'}AM</Text>
              <View style={styles.timelineLine} />
              <View style={styles.card}>
                 <View style={styles.cardHeader}>
                    <Image source={{uri: 'https://i.pravatar.cc/100?img=33'}} style={styles.avatar} />
                    <View style={{flex: 1, marginLeft: 10}}>
                       <Text style={styles.docName}>Michael Ross</Text>
                       <Text style={styles.docType}>Post-Op Follow-Up</Text>
                    </View>
                    <View style={[styles.statusBadge, {backgroundColor: '#E8F5E9'}]}>
                        <Text style={[styles.statusText, {color: '#2E7D32'}]}>CHECKED-IN</Text>
                    </View>
                 </View>
                 <Text style={styles.duration}>54 min</Text>
              </View>
           </View>

           {/* Current Time Indicator */}
           <View style={styles.currentTimeRow}>
              <Text style={styles.currentTimeText}>11:35</Text>
              <View style={styles.dot} />
              <View style={styles.line} />
           </View>

           {/* Appointment 3 */}
           <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>11:30{'\n'}AM</Text>
              <View style={styles.timelineLine} />
              <View style={styles.card}>
                 <View style={styles.cardHeader}>
                    <Image source={{uri: 'https://i.pravatar.cc/100?img=14'}} style={styles.avatar} />
                    <View style={{flex: 1, marginLeft: 10}}>
                       <Text style={styles.docName}>Rosevelt de Francis</Text>
                       <Text style={styles.docType}>Radiology Review</Text>
                    </View>
                    <View style={[styles.statusBadge, {backgroundColor: '#FFF8E1'}]}>
                        <Text style={[styles.statusText, {color: '#F9A825'}]}>CHECKED-IN</Text>
                    </View>
                 </View>
                 <Text style={styles.duration}>54 min</Text>
              </View>
           </View>
        </ScrollView>

        {/* Plus Button Floating on Screen (Optional, or rely on Bottom Bar FAB) */}
        <TouchableOpacity style={styles.floatingPlus}>
            <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        {/* Bottom Nav Bar */}
        <DoctorBottomNavBar 
           activeTab="Schedule" 
           navigation={navigation}
           onFabPress={() => { /* Handle Quick Actions */ }} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20, paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  calendarStrip: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dateBox: { alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: 'white', minWidth: 50 },
  activeDateBox: { backgroundColor: COLORS.primary },
  dateText: { fontSize: 12, color: '#666', marginBottom: 4 },
  dateNum: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  activeDateText: { color: 'white' },

  filterRow: { flexDirection: 'row', marginBottom: 20 },
  chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: '#666', fontSize: 13 },
  chipTextActive: { color: 'white', fontWeight: 'bold' },

  timeRow: { flexDirection: 'row', marginBottom: 20 },
  timeLabel: { width: 50, fontSize: 12, color: '#999', textAlign: 'center', marginTop: 10 },
  timelineLine: { width: 1, backgroundColor: '#DDD', marginHorizontal: 10 },
  card: { flex: 1, backgroundColor: 'white', borderRadius: 15, padding: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  docName: { fontWeight: 'bold', fontSize: 14 },
  docType: { color: '#666', fontSize: 12 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  duration: { fontSize: 12, color: '#999', marginTop: 5 },

  currentTimeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  currentTimeText: { width: 50, fontSize: 12, color: COLORS.primary, fontWeight: 'bold', textAlign: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary, marginLeft: 6 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.primary },

  floatingPlus: { position: 'absolute', bottom: 100, right: 20, width: 50, height: 50, borderRadius: 12, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
});