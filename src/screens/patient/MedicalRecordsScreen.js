// src/screens/patient/MedicalRecordsScreen.js
import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import BottomNavBar from '../../components/BottomNavBar';

export default function MedicalRecordsScreen({ navigation }) {
  const records = [
    { id: 1, provider: 'Rohit Sharma', date: '01/12/80', purpose: 'Checkup' },
    { id: 2, provider: 'Sara Shetty', date: '08/06/80', purpose: 'Checkup' },
    { id: 3, provider: 'John Peak', date: '12/10/80', purpose: 'Checkup' },
    { id: 4, provider: 'Hamilton', date: '12/10/80', purpose: 'Checkup' },
    { id: 5, provider: 'Vama Rev', date: '12/10/80', purpose: 'Checkup' },
    { id: 6, provider: 'Dr. Strange', date: '12/10/80', purpose: 'Checkup' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="menu-outline" size={28} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity>
               <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
        </View>
        
        <Text style={styles.pageTitle}>Medical Records</Text>

        {/* Search Row */}
        <View style={styles.searchRow}>
           <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#999" />
              <TextInput placeholder="Search patients, reports, notes..." style={styles.searchInput} />
           </View>
           <TouchableOpacity style={styles.addButton}>
              <Ionicons name="person-add" size={20} color="white" />
           </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
           <Text style={[styles.headerText, {flex: 2}]}>PROVIDER</Text>
           <Text style={[styles.headerText, {flex: 1, textAlign: 'center'}]}>VISIT</Text>
           <Text style={[styles.headerText, {flex: 1, textAlign: 'right'}]}>PURPOSE</Text>
           <View style={{width: 20}} /> 
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {records.map((item) => (
            <View key={item.id} style={styles.row}>
               <Text style={[styles.cellTextBold, {flex: 2}]}>{item.provider}</Text>
               <Text style={[styles.cellText, {flex: 1, textAlign: 'center'}]}>{item.date}</Text>
               <Text style={[styles.cellText, {flex: 1, textAlign: 'right'}]}>{item.purpose}</Text>
               <Ionicons name="chevron-forward" size={16} color="#ccc" style={{marginLeft: 10}}/>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Navigation */}
      <BottomNavBar navigation={navigation} activeTab="Records" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  contentContainer: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  
  searchRow: { flexDirection: 'row', marginBottom: 25 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, height: 50, marginRight: 10 },
  searchInput: { flex: 1, marginLeft: 10 },
  addButton: { width: 50, height: 50, backgroundColor: COLORS.primary, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  tableHeader: { flexDirection: 'row', marginBottom: 15, paddingHorizontal: 10 },
  headerText: { fontSize: 12, fontWeight: 'bold', color: '#666' },

  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10 },
  cellTextBold: { fontWeight: 'bold', color: '#333' },
  cellText: { color: '#666', fontSize: 13 }
});