// src/screens/patient/MessagesScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';

export default function MessagesScreen({ navigation }) {
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.contentContainer}>
            <View style={styles.header}>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Messages</Text>
               <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
               <Text style={styles.sectionHeader}>TODAY</Text>

               <View style={[styles.messageItem, styles.urgentItem]}>
                  <View style={{ flex: 1 }}>
                     <Text style={styles.msgTitle}>Critical Lab Result</Text>
                     <Text style={styles.msgBody}>Potassium levels elevated, Patient #8739. Immediate action required.</Text>
                  </View>
                  <Text style={[styles.timeText, { color: '#F44336' }]}>15m ago</Text>
               </View>

               <View style={styles.messageItem}>
                  <View style={{ flex: 1 }}>
                     <Text style={styles.msgTitle}>Consultation summary ready</Text>
                     <Text style={styles.msgBody}>Patient Daniel Koshaer - AI Analysis complete. Key vitals extracted & chart updated.</Text>
                  </View>
                  <Text style={styles.timeText}>42m ago</Text>
               </View>

               <View style={styles.messageItem}>
                  <View style={{ flex: 1 }}>
                     <Text style={styles.msgTitle}>Consultation summary ready</Text>
                     <Text style={styles.msgBody}>Hematology Report - Patient #2878</Text>
                  </View>
                  <Text style={styles.timeText}>42m ago</Text>
               </View>

               <Text style={styles.sectionHeader}>YESTERDAY</Text>

               <View style={styles.messageItem}>
                  <View style={{ flex: 1 }}>
                     <Text style={[styles.msgTitle, { color: '#999' }]}>New message received</Text>
                     <Text style={styles.msgBody}>From Patient #2328. "Please review the cardio scans"</Text>
                  </View>
                  <Text style={styles.timeText}>3:45 PM</Text>
               </View>

            </ScrollView>
         </View>

         <BottomNavBar navigation={navigation} activeTab="Messages" />
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: 'white' },
   contentContainer: { flex: 1, padding: 20 },
   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
   headerTitle: { fontSize: 18, fontWeight: 'bold' },

   sectionHeader: { fontSize: 12, color: '#999', marginBottom: 10, marginTop: 10, textTransform: 'uppercase' },

   messageItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
   urgentItem: { backgroundColor: '#FFEBEE', marginHorizontal: -20, paddingHorizontal: 20, borderBottomWidth: 0 }, // Light red background extension

   msgTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
   msgBody: { fontSize: 13, color: '#666', lineHeight: 18 },
   timeText: { fontSize: 11, color: '#999', marginLeft: 10 },
});