import React, { useState } from 'react';
import {
   View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

export default function DoctorAddPatientScreen({ navigation }) {

   const handleSave = () => {
      // Logic to save patient would go here
      navigation.goBack(); // Return to Directory
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>

            {/* Header */}
            <View style={styles.header}>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Add New Patient</Text>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.cancelText}>Cancel</Text>
               </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

               {/* Import EMR Card */}
               <View style={styles.emrCard}>
                  <View style={styles.emrHeader}>
                     <View style={styles.emrIconBox}>
                        <Ionicons name="download-outline" size={20} color="#2196F3" />
                     </View>
                     <View style={{ flex: 1 }}>
                        <Text style={styles.emrTitle}>Import from EMR</Text>
                        <Text style={styles.emrSub}>Connect to Epic, Cerner, or Allscripts to auto populate patient data.</Text>
                     </View>
                  </View>
                  <TouchableOpacity style={styles.syncBtn}>
                     <Ionicons name="sync" size={16} color="#333" style={{ marginRight: 6 }} />
                     <Text style={styles.syncBtnText}>Sync Patient Details</Text>
                  </TouchableOpacity>
               </View>

               {/* Divider */}
               <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR ENTER MANUALLY</Text>
                  <View style={styles.dividerLine} />
               </View>

               {/* Photo Upload */}
               <View style={styles.photoContainer}>
                  <View style={styles.photoCircle}>
                     <Ionicons name="camera" size={30} color="#999" />
                     <View style={styles.editBadge}>
                        <Ionicons name="pencil" size={12} color="white" />
                     </View>
                  </View>
               </View>

               {/* Form Fields */}
               <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>

               <Text style={styles.label}>Full Name</Text>
               <TextInput placeholder="Your Name" style={styles.input} />

               <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                     <Text style={styles.label}>Date of Birth</Text>
                     <View style={styles.dateInput}>
                        <Text style={{ color: '#999' }}>mm/dd/yyyy</Text>
                        <Ionicons name="calendar-outline" size={18} color="#999" />
                     </View>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                     <Text style={styles.label}>Gender</Text>
                     <View style={styles.dateInput}>
                        <Text style={{ color: '#333' }}>Select</Text>
                        <Ionicons name="chevron-down" size={18} color="#999" />
                     </View>
                  </View>
               </View>

               <Text style={[styles.sectionLabel, { marginTop: 25 }]}>CLINICAL IDENTIFIERS</Text>

               <Text style={styles.label}>MRN (Medical Record Number)</Text>
               <View style={styles.iconInput}>
                  <Ionicons name="card-outline" size={20} color="#999" style={{ marginRight: 10 }} />
                  <TextInput placeholder="#######" style={{ flex: 1 }} />
               </View>

               <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
               <CustomButton title="Save" onPress={handleSave} />
            </View>

         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#F9FAFC' },
   content: { flex: 1, padding: 20 },

   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
   headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
   cancelText: { color: COLORS.primary, fontWeight: '600' },

   emrCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', marginBottom: 25 },
   emrHeader: { flexDirection: 'row', marginBottom: 15 },
   emrIconBox: { width: 36, height: 36, backgroundColor: '#E3F2FD', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
   emrTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
   emrSub: { fontSize: 11, color: '#666', marginTop: 2, lineHeight: 16 },
   syncBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 8 },
   syncBtnText: { fontSize: 13, fontWeight: '600', color: '#333' },

   dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
   dividerLine: { flex: 1, height: 1, backgroundColor: '#DDD' },
   dividerText: { marginHorizontal: 10, fontSize: 11, color: '#999', fontWeight: '600' },

   photoContainer: { alignItems: 'center', marginBottom: 30 },
   photoCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F0F2F5', justifyContent: 'center', alignItems: 'center', position: 'relative' },
   editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },

   sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 15, letterSpacing: 0.5 },
   label: { fontSize: 13, color: '#333', marginBottom: 8, fontWeight: '500' },

   input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, paddingHorizontal: 15, height: 48, marginBottom: 20 },

   row: { flexDirection: 'row' },
   dateInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, paddingHorizontal: 15, height: 48 },

   iconInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderRadius: 8, paddingHorizontal: 15, height: 48 },

   footer: { position: 'absolute', bottom: 20, left: 20, right: 20 }
});