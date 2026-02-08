import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   TextInput,
   ScrollView,
   StyleSheet,
   TouchableOpacity,
   ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { doctorAPI, organizationAPI, adminAPI } from '../../services/api';

export default function AdminSearchScreen({ navigation }) {
   const [searchQuery, setSearchQuery] = useState('');
   const [activeFilter, setActiveFilter] = useState('All');
   const [loading, setLoading] = useState(false);
   const [doctors, setDoctors] = useState([]);
   const [organizations, setOrganizations] = useState([]);
   const [users, setUsers] = useState([]);

   useEffect(() => {
      loadInitialData();
   }, []);

   const loadInitialData = async () => {
      setLoading(true);
      try {
         // Load doctors
         try {
            const docRes = await doctorAPI.getAllDoctors();
            setDoctors(docRes.data?.slice(0, 5) || []);
         } catch (e) {
            setDoctors([
               { id: '1', first_name: 'Arvind', last_name: 'Shukla', specialty: 'Cardiology' },
               { id: '2', first_name: 'Avantika', last_name: 'Gupta', specialty: 'Pediatrics' },
            ]);
         }

         // Load organizations
         try {
            const orgRes = await organizationAPI.getOrganizations();
            setOrganizations(orgRes.data?.slice(0, 5) || []);
         } catch (e) {
            setOrganizations([
               { id: '1', name: 'City General Hospital', type: 'hospital' },
               { id: '2', name: 'Metro Clinic', type: 'clinic' },
            ]);
         }

         // Load users
         try {
            const usersRes = await adminAPI.getAccounts({ limit: 5 });
            setUsers(usersRes.data?.items || usersRes.data || []);
         } catch (e) {
            setUsers([
               { id: '1', first_name: 'John', last_name: 'Doe', role: 'patient' },
               { id: '2', first_name: 'Jane', last_name: 'Smith', role: 'admin' },
            ]);
         }
      } catch (error) {
         console.log('Search data load:', error.message);
      } finally {
         setLoading(false);
      }
   };

   const filterResults = (items, fields) => {
      if (!searchQuery) return items;
      const query = searchQuery.toLowerCase();
      return items.filter(item =>
         fields.some(field => {
            const value = field.split('.').reduce((obj, key) => obj?.[key], item);
            return value?.toLowerCase().includes(query);
         })
      );
   };

   const filteredDoctors = filterResults(doctors, ['first_name', 'last_name', 'specialty']);
   const filteredOrgs = filterResults(organizations, ['name', 'type']);
   const filteredUsers = filterResults(users, ['first_name', 'last_name', 'email', 'role']);

   const filters = ['All', 'Doctors', 'Hospitals', 'Users'];

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.contentContainer}>
            {/* Search Header */}
            <View style={styles.searchHeader}>
               <View style={styles.searchBar}>
                  <Ionicons name="search-outline" size={20} color="#333" />
                  <TextInput
                     placeholder="Search doctors, hospitals, users..."
                     placeholderTextColor="#666"
                     style={styles.input}
                     autoFocus={true}
                     value={searchQuery}
                     onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                     <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#999" />
                     </TouchableOpacity>
                  )}
               </View>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.cancelText}>Cancel</Text>
               </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={styles.filterRow}>
               {filters.map(filter => (
                  <TouchableOpacity
                     key={filter}
                     style={[styles.chip, activeFilter === filter && styles.chipActive]}
                     onPress={() => setActiveFilter(filter)}
                  >
                     <Text style={activeFilter === filter ? styles.chipTextActive : styles.chipText}>
                        {filter}
                     </Text>
                  </TouchableOpacity>
               ))}
            </View>

            {loading ? (
               <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
               </View>
            ) : (
               <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Doctors Section */}
                  {(activeFilter === 'All' || activeFilter === 'Doctors') && filteredDoctors.length > 0 && (
                     <>
                        <View style={styles.sectionHeader}>
                           <Text style={styles.sectionTitle}>DOCTORS</Text>
                           <TouchableOpacity onPress={() => navigation.navigate('AdminDoctorsScreen')}>
                              <Text style={styles.seeAll}>See All</Text>
                           </TouchableOpacity>
                        </View>
                        <View style={styles.cardContainer}>
                           {filteredDoctors.map((doc, idx) => (
                              <React.Fragment key={doc.id || idx}>
                                 {idx > 0 && <View style={styles.divider} />}
                                 <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => navigation.navigate('AdminEditUserScreen', { user: doc, userType: 'doctor' })}
                                 >
                                    <View style={[styles.iconPlaceholder, { backgroundColor: '#E8F5E9' }]}>
                                       <Ionicons name="medical" size={20} color="#4CAF50" />
                                    </View>
                                    <View style={styles.textContainer}>
                                       <Text style={styles.itemTitle}>Dr. {doc.first_name} {doc.last_name}</Text>
                                       <Text style={styles.itemSubtitle}>{doc.specialty || 'General'}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                                 </TouchableOpacity>
                              </React.Fragment>
                           ))}
                        </View>
                     </>
                  )}

                  {/* Organizations Section */}
                  {(activeFilter === 'All' || activeFilter === 'Hospitals') && filteredOrgs.length > 0 && (
                     <>
                        <View style={styles.sectionHeader}>
                           <Text style={styles.sectionTitle}>ORGANIZATIONS</Text>
                           <TouchableOpacity onPress={() => navigation.navigate('AdminOrganizationsScreen')}>
                              <Text style={styles.seeAll}>See All</Text>
                           </TouchableOpacity>
                        </View>
                        <View style={styles.cardContainer}>
                           {filteredOrgs.map((org, idx) => (
                              <React.Fragment key={org.id || idx}>
                                 {idx > 0 && <View style={styles.divider} />}
                                 <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => navigation.navigate('AdminOrgDetailScreen', { organization: org })}
                                 >
                                    <View style={[styles.iconPlaceholder, { backgroundColor: '#F3E5F5' }]}>
                                       <Ionicons name="business" size={20} color="#9C27B0" />
                                    </View>
                                    <View style={styles.textContainer}>
                                       <Text style={styles.itemTitle}>{org.name}</Text>
                                       <Text style={styles.itemSubtitle}>{org.type || 'Organization'}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                                 </TouchableOpacity>
                              </React.Fragment>
                           ))}
                        </View>
                     </>
                  )}

                  {/* Users Section */}
                  {(activeFilter === 'All' || activeFilter === 'Users') && filteredUsers.length > 0 && (
                     <>
                        <View style={styles.sectionHeader}>
                           <Text style={styles.sectionTitle}>USERS</Text>
                           <TouchableOpacity onPress={() => navigation.navigate('AdminAccountManagementScreen')}>
                              <Text style={styles.seeAll}>Manage All</Text>
                           </TouchableOpacity>
                        </View>
                        <View style={styles.cardContainer}>
                           {filteredUsers.map((user, idx) => (
                              <React.Fragment key={user.id || idx}>
                                 {idx > 0 && <View style={styles.divider} />}
                                 <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => navigation.navigate('AdminEditUserScreen', { user })}
                                 >
                                    <View style={[styles.iconPlaceholder, { backgroundColor: '#E3F2FD' }]}>
                                       <Ionicons name="person" size={20} color="#2196F3" />
                                    </View>
                                    <View style={styles.textContainer}>
                                       <Text style={styles.itemTitle}>{user.first_name} {user.last_name}</Text>
                                       <Text style={styles.itemSubtitle}>{user.role || 'User'}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                                 </TouchableOpacity>
                              </React.Fragment>
                           ))}
                        </View>
                     </>
                  )}

                  {/* No Results */}
                  {searchQuery && filteredDoctors.length === 0 && filteredOrgs.length === 0 && filteredUsers.length === 0 && (
                     <View style={styles.noResults}>
                        <Ionicons name="search-outline" size={50} color="#DDD" />
                        <Text style={styles.noResultsTitle}>No results found</Text>
                        <Text style={styles.noResultsText}>Try different keywords</Text>
                     </View>
                  )}

                  <View style={{ height: 100 }} />
               </ScrollView>
            )}
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#F9FAFC' },
   contentContainer: { flex: 1, padding: 20 },
   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

   searchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
   searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE', marginRight: 15 },
   input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
   cancelText: { color: COLORS.primary, fontWeight: '600' },

   filterRow: { flexDirection: 'row', marginBottom: 20 },
   chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
   chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
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
   itemSubtitle: { fontSize: 12, color: '#666', textTransform: 'capitalize' },

   noResults: { alignItems: 'center', paddingTop: 50 },
   noResultsTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginTop: 15 },
   noResultsText: { fontSize: 13, color: '#999', marginTop: 5 },
});