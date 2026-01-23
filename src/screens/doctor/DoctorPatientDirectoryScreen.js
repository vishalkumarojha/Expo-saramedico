import React from 'react';
import { 
  View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import DoctorBottomNavBar from '../../components/DoctorBottomNavBar';

const PATIENTS = [
  { name: 'Rohit Sharma', dob: '01/12/90', mrn: '882-921', status: 'Analysis Ready', statusColor: COLORS.primary },
  { name: 'Sara Shetty', dob: '08/08/90', mrn: '882-921', status: 'Check-up pending', statusColor: '#999' },
  { name: 'John Peak', dob: '12/10/90', mrn: '882-521', status: 'Post-op', statusColor: '#666' },
  { name: 'Hamilton', dob: '12/10/80', mrn: '862-521', status: 'Operation', statusColor: '#666' },
  { name: 'Vama Rev', dob: '12/10/90', mrn: '862-521', status: 'Cardiology', statusColor: '#666' },
  { name: 'Vama Rev', dob: '12/10/90', mrn: '862-521', status: 'Review Needed', statusColor: '#F9A825' },
];

export default function DoctorPatientDirectoryScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="menu-outline" size={28} color="#333" />
           </TouchableOpacity>
           <View style={{flexDirection:'row', gap:15}}>
              <Ionicons name="notifications" size={24} color="#333" />
              <View style={styles.avatar} />
           </View>
        </View>

        <Text style={styles.title}>Patient Directory</Text>

        {/* Search & Add Button */}
        <View style={styles.searchRow}>
           <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="#999" />
              <TextInput 
                placeholder="Search patients, reports, notes..." 
                placeholderTextColor="#999"
                style={styles.input} 
              />
           </View>
           
           {/* Add Patient Button */}
           <TouchableOpacity 
             style={styles.addBtn} 
             onPress={() => navigation.navigate('DoctorAddPatientScreen')}
           >
              <Ionicons name="person-add" size={20} color="white" />
           </TouchableOpacity>
        </View>

        {/* List Header */}
        <View style={styles.listHeader}>
           <Text style={[styles.headerText, {flex: 2}]}>NAME</Text>
           <Text style={[styles.headerText, {flex: 1}]}>DOB</Text>
           <Text style={[styles.headerText, {flex: 1, textAlign: 'right', marginRight: 20}]}>MRN</Text>
        </View>

        {/* Patient List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
           {PATIENTS.map((p, i) => (
             <TouchableOpacity 
               key={i} 
               style={styles.row}
               // --- NAVIGATION ACTION ADDED HERE ---
               onPress={() => navigation.navigate('DoctorPatientDetailScreen', { patient: p })}
             >
                <View style={{flex: 2}}>
                   <Text style={styles.nameText}>{p.name}</Text>
                   <Text style={[styles.statusText, {color: p.statusColor}]}>{p.status}</Text>
                </View>
                <Text style={[styles.dateText, {flex: 1}]}>{p.dob}</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Text style={styles.mrnText}>{p.mrn}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#CCC" style={{marginLeft: 10}} />
                </View>
             </TouchableOpacity>
           ))}
        </ScrollView>
        
        {/* Bottom Navigation */}
        <DoctorBottomNavBar 
           navigation={navigation} 
           activeTab="Patients" 
           onFabPress={() => { /* Quick Actions Logic */ }} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20, paddingBottom: 0 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#DDD' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1A1A1A' },
  
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE' },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: '#333' },
  
  addBtn: { width: 50, height: 50, backgroundColor: COLORS.primary, borderRadius: 10, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },

  listHeader: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 10 },
  headerText: { fontSize: 11, fontWeight: 'bold', color: '#999', letterSpacing: 0.5 },

  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  nameText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  statusText: { fontSize: 11, marginTop: 4, fontWeight: '500' },
  dateText: { fontSize: 13, color: '#666' },
  mrnText: { fontSize: 13, color: '#666' }
});