import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import DoctorBottomNavBar from '../../components/DoctorBottomNavBar';

export default function DoctorAlertsScreen({ navigation }) {
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>

            <View style={styles.header}>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Notifications</Text>
               <View style={{ width: 24 }} />
            </View>

            {/* Filters */}
            <View style={styles.filterRow}>
               <TouchableOpacity style={[styles.chip, styles.chipActive]}><Text style={styles.chipTextActive}>All</Text></TouchableOpacity>
               <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Urgent</Text></TouchableOpacity>
               <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Insights</Text></TouchableOpacity>
               <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Patient</Text></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
               <Text style={styles.sectionHeader}>TODAY</Text>

               {/* Urgent Notification */}
               <View style={[styles.notifItem, styles.urgentItem]}>
                  <View style={{ flex: 1 }}>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.notifTitle}>Critical Lab Result</Text>
                        <Text style={[styles.timeText, { color: '#F44336' }]}>15m ago</Text>
                     </View>
                     <Text style={styles.notifBody}>Potassium levels elevated, Patient #8739. Immediate action required.</Text>
                  </View>
               </View>

               {/* Normal Notification */}
               <View style={styles.notifItem}>
                  <View style={{ flex: 1 }}>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.notifTitle}>Consultation summary ready</Text>
                        <Text style={styles.timeText}>42m ago</Text>
                     </View>
                     <Text style={styles.notifBody}>Patient Daniel Koshaer - AI Analysis complete. Key vitals extracted & chart updated.</Text>
                  </View>
               </View>

               <View style={styles.notifItem}>
                  <View style={{ flex: 1 }}>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.notifTitle}>Consultation summary ready</Text>
                        <Text style={styles.timeText}>42m ago</Text>
                     </View>
                     <Text style={styles.notifBody}>Hematology Report - Patient #2879</Text>
                  </View>
               </View>

               <Text style={styles.sectionHeader}>YESTERDAY</Text>

               <View style={styles.notifItem}>
                  <View style={{ flex: 1 }}>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.notifTitle, { color: '#999' }]}>New message received</Text>
                        <Text style={styles.timeText}>3:45 PM</Text>
                     </View>
                     <Text style={[styles.notifBody, { color: '#999' }]}>From Patient #2328. "Please review the cardio scans"</Text>
                  </View>
               </View>

            </ScrollView>

            <DoctorBottomNavBar
               activeTab="Alerts"
               navigation={navigation}
               onFabPress={() => { }}
            />
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: 'white' },
   content: { flex: 1, padding: 20, paddingBottom: 0 },
   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
   headerTitle: { fontSize: 18, fontWeight: 'bold' },

   filterRow: { flexDirection: 'row', marginBottom: 20 },
   chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
   chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
   chipText: { color: '#666', fontSize: 13 },
   chipTextActive: { color: 'white', fontWeight: 'bold' },

   sectionHeader: { fontSize: 12, color: '#999', marginBottom: 10, marginTop: 10, textTransform: 'uppercase' },

   notifItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
   urgentItem: { backgroundColor: '#FFEBEE', marginHorizontal: -20, paddingHorizontal: 20, borderBottomWidth: 0 },
   notifTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
   notifBody: { fontSize: 13, color: '#666', lineHeight: 20 },
   timeText: { fontSize: 11, color: '#999' },
});