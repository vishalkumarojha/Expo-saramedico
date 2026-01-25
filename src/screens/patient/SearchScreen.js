import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import BottomNavBar from '../../components/BottomNavBar';

export default function SearchScreen({ navigation }) {
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.contentContainer}>

            {/* Search Input Area */}
            <View style={styles.searchHeader}>
               <View style={styles.searchBar}>
                  <Ionicons name="search-outline" size={20} color="#333" />
                  <TextInput
                     placeholder="Search Term"
                     placeholderTextColor="#666"
                     style={styles.input}
                     autoFocus={true} // Auto focus when screen opens
                  />
               </View>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterRow}>
               <TouchableOpacity style={[styles.chip, styles.chipActive]}>
                  <Text style={styles.chipTextActive}>All</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.chip}>
                  <Text style={styles.chipText}>Logins</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.chip}>
                  <Text style={styles.chipText}>Exports</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.chip}>
                  <Text style={styles.chipText}>Patient Data</Text>
               </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

               {/* Section: TOP MATCHES */}
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>TOP MATCHES</Text>
                  <TouchableOpacity>
                     <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
               </View>

               <View style={styles.cardContainer}>
                  {/* Doctor 1 */}
                  <TouchableOpacity style={styles.listItem}>
                     <View style={[styles.avatarPlaceholder, { backgroundColor: '#F3E5F5' }]} />
                     <View style={styles.textContainer}>
                        <Text style={styles.itemTitle}>Doctor Name</Text>
                        <Text style={styles.itemSubtitle}>Cardiologist</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  {/* Doctor 2 */}
                  <TouchableOpacity style={styles.listItem}>
                     <View style={[styles.avatarPlaceholder, { backgroundColor: '#F3E5F5' }]} />
                     <View style={styles.textContainer}>
                        <Text style={styles.itemTitle}>Doctor Name</Text>
                        <Text style={styles.itemSubtitle}>Psychologist</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
               </View>

               {/* Section: DOCUMENTS */}
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>DOCUMENTS</Text>
               </View>

               <View style={styles.cardContainer}>
                  {/* Document 1 */}
                  <TouchableOpacity style={styles.listItem}>
                     <View style={[styles.avatarPlaceholder, { backgroundColor: '#F3E5F5' }]} />
                     <View style={styles.textContainer}>
                        <Text style={styles.itemTitle}>Patient Data</Text>
                        <Text style={styles.itemSubtitle}>
                           <Text style={{ fontWeight: 'bold' }}>PDF</Text> Oct 24 - 14 MB
                        </Text>
                     </View>
                     <Text style={styles.timeText}>10:42 AM</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  {/* Document 2 */}
                  <TouchableOpacity style={styles.listItem}>
                     <View style={[styles.avatarPlaceholder, { backgroundColor: '#F3E5F5' }]} />
                     <View style={styles.textContainer}>
                        <Text style={styles.itemTitle}>Patient Data</Text>
                        <Text style={styles.itemSubtitle}>
                           <Text style={{ fontWeight: 'bold' }}>CSV</Text> Oct 24 - 14 MB
                        </Text>
                     </View>
                     <Text style={styles.timeText}>10:42 AM</Text>
                  </TouchableOpacity>
               </View>

            </ScrollView>
         </View>

         <BottomNavBar navigation={navigation} activeTab="Home" />
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#F9FAFC' },
   contentContainer: { flex: 1, padding: 20 },

   searchHeader: { marginBottom: 15 },
   searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE' },
   input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },

   filterRow: { flexDirection: 'row', marginBottom: 25 },
   chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
   chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
   chipText: { color: '#333', fontSize: 13, fontWeight: '500' },
   chipTextActive: { color: 'white', fontSize: 13, fontWeight: '600' },

   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 10 },
   sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', letterSpacing: 0.5 },
   seeAll: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },

   cardContainer: { backgroundColor: 'white', borderRadius: 16, padding: 5, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
   listItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
   divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 15 },

   avatarPlaceholder: { width: 45, height: 45, borderRadius: 22.5, marginRight: 15 },
   textContainer: { flex: 1 },
   itemTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
   itemSubtitle: { fontSize: 12, color: '#666' },
   timeText: { fontSize: 12, color: '#999' }
});