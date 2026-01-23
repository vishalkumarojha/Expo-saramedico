import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import AdminBottomNavBar from '../../components/AdminBottomNavBar';

// Mock Data
const ACCOUNTS = [
  { id: 1, name: 'Rohit Sharma', role: 'Doctor', status: 'Active' },
  { id: 2, name: 'Sara Shetty', role: 'Doctor', status: 'Active' },
  { id: 3, name: 'John Peak', role: 'Doctor', status: 'Active' },
  { id: 4, name: 'Hamilton', role: 'Doctor', status: 'Active' },
  { id: 5, name: 'Vama Rev', role: 'Doctor', status: 'Active' },
  { id: 6, name: 'Vama Rev', role: 'Doctor', status: 'Active' },
  { id: 7, name: 'Vama Rev', role: 'Doctor', status: 'Active' },
  { id: 8, name: 'Vama Rev', role: 'Doctor', status: 'Active' },
  { id: 9, name: 'Vama Rev', role: 'Doctor', status: 'Active' },
];

export default function AdminAccountManagementScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="menu-outline" size={28} color="#333" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
               <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="#333" /></TouchableOpacity>
               <View style={styles.avatar} />
            </View>
        </View>
        
        <Text style={styles.pageTitle}>Account Management</Text>

        {/* Search Row */}
        <View style={styles.searchRow}>
           <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#999" />
              <TextInput 
                placeholder="Search patients, reports, notes..." 
                placeholderTextColor="#999" 
                style={styles.searchInput} 
              />
           </View>

           {/* --- NAVIGATE TO INVITE SCREEN --- */}
           <TouchableOpacity 
             style={styles.addButton}
             onPress={() => navigation.navigate('AdminInviteMemberScreen')}
           >
              <Ionicons name="person-add" size={20} color="white" />
           </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
           <Text style={[styles.headerText, {flex: 2}]}>USER</Text>
           <Text style={[styles.headerText, {flex: 1, textAlign: 'center'}]}>ROLE</Text>
           <Text style={[styles.headerText, {flex: 1, textAlign: 'right', marginRight: 20}]}>STATUS</Text>
           <View style={{width: 10}} /> 
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {ACCOUNTS.map((item, index) => (
            // --- NAVIGATE TO EDIT SCREEN ---
            <TouchableOpacity 
               key={`${item.id}-${index}`} 
               style={styles.row}
               onPress={() => navigation.navigate('AdminEditUserScreen')}
            >
               <Text style={[styles.cellTextBold, {flex: 2}]}>{item.name}</Text>
               <Text style={[styles.cellText, {flex: 1, textAlign: 'center'}]}>{item.role}</Text>
               
               <View style={{flex: 1, alignItems: 'flex-end', marginRight: 10}}>
                 <View style={styles.statusBadge}>
                    <Ionicons name="checkmark-circle" size={12} color={COLORS.success} style={{marginRight: 4}} />
                    <Text style={styles.statusText}>{item.status}</Text>
                 </View>
               </View>

               <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
          <View style={{height: 20}} />
        </ScrollView>
      </View>

      <AdminBottomNavBar navigation={navigation} activeTab="Records" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  contentContainer: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#ddd' },
  pageTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1A1A1A' },
  searchRow: { flexDirection: 'row', marginBottom: 25 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, height: 50, marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, marginLeft: 10, color: '#333' },
  addButton: { width: 50, height: 50, backgroundColor: COLORS.primary, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  tableHeader: { flexDirection: 'row', marginBottom: 15, paddingHorizontal: 10 },
  headerText: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  cellTextBold: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  cellText: { color: '#999', fontSize: 14 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: COLORS.success, fontSize: 12, fontWeight: 'bold' }
});