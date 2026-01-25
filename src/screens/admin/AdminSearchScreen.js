import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import AdminBottomNavBar from '../../components/AdminBottomNavBar';

export default function AdminSearchScreen({ navigation }) {
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.contentContainer}>

            {/* Search Header */}
            <View style={styles.searchHeader}>
               <View style={styles.searchBar}>
                  <Ionicons name="search-outline" size={20} color="#333" />
                  <TextInput
                     placeholder="Search users, logs, IPs..."
                     placeholderTextColor="#666"
                     style={styles.input}
                     autoFocus={true}
                  />
               </View>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.cancelText}>Cancel</Text>
               </TouchableOpacity>
            </View>

            {/* Admin Filters */}
            <View style={styles.filterRow}>
               <FilterChip label="All" active />
               <FilterChip label="Users" />
               <FilterChip label="System Logs" />
               <FilterChip label="Alerts" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

               {/* Section: USERS & STAFF */}
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>USERS & STAFF</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('AdminAccountManagementScreen')}>
                     <Text style={styles.seeAll}>Manage All</Text>
                  </TouchableOpacity>
               </View>

               <View style={styles.cardContainer}>
                  <SearchResultItem
                     title="Dr. Sarah Jenkins"
                     sub="Cardiologist • Active"
                     icon="person"
                     color="#E3F2FD"
                     iconColor="#1976D2"
                  />
                  <View style={styles.divider} />
                  <SearchResultItem
                     title="Admin Support"
                     sub="System Administrator"
                     icon="shield-checkmark"
                     color="#E8F5E9"
                     iconColor="#2E7D32"
                  />
               </View>

               {/* Section: RECENT LOGS */}
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>SYSTEM LOGS</Text>
               </View>

               <View style={styles.cardContainer}>
                  <SearchResultItem
                     title="Failed Login Attempt"
                     sub="IP: 192.168.1.45 • 2m ago"
                     icon="warning"
                     color="#FFF3E0"
                     iconColor="#F57C00"
                  />
                  <View style={styles.divider} />
                  <SearchResultItem
                     title="Bulk Data Export"
                     sub="User: Admin • 10:42 AM"
                     icon="cloud-download"
                     color="#F3E5F5"
                     iconColor="#7B1FA2"
                  />
                  <View style={styles.divider} />
                  <SearchResultItem
                     title="New User Registration"
                     sub="Dr. Emily Chen • Yesterday"
                     icon="person-add"
                     color="#E0F7FA"
                     iconColor="#006064"
                  />
               </View>

            </ScrollView>
         </View>

         <AdminBottomNavBar navigation={navigation} activeTab="Home" />
      </SafeAreaView>
   );
}

// Helper Components
const FilterChip = ({ label, active }) => (
   <TouchableOpacity style={[styles.chip, active && styles.chipActive]}>
      <Text style={active ? styles.chipTextActive : styles.chipText}>{label}</Text>
   </TouchableOpacity>
);

const SearchResultItem = ({ title, sub, icon, color, iconColor }) => (
   <TouchableOpacity style={styles.listItem}>
      <View style={[styles.iconPlaceholder, { backgroundColor: color }]}>
         <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
         <Text style={styles.itemTitle}>{title}</Text>
         <Text style={styles.itemSubtitle}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
   </TouchableOpacity>
);

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#F9FAFC' },
   contentContainer: { flex: 1, padding: 20 },

   searchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
   searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE', marginRight: 15 },
   input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
   cancelText: { color: COLORS.primary, fontWeight: '600' },

   filterRow: { flexDirection: 'row', marginBottom: 25 },
   chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
   chipActive: { backgroundColor: '#333', borderColor: '#333' }, // Darker theme for Admin
   chipText: { color: '#333', fontSize: 13, fontWeight: '500' },
   chipTextActive: { color: 'white', fontSize: 13, fontWeight: '600' },

   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 10 },
   sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', letterSpacing: 0.5 },
   seeAll: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },

   cardContainer: { backgroundColor: 'white', borderRadius: 16, padding: 5, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
   listItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
   divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 15 },

   iconPlaceholder: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
   textContainer: { flex: 1 },
   itemTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 2 },
   itemSubtitle: { fontSize: 12, color: '#666' }
});