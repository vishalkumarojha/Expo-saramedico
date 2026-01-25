import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import DoctorBottomNavBar from '../../components/DoctorBottomNavBar';

export default function DoctorSearchScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Logins', 'Experts', 'Patient Data'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Search Header */}
        <View style={styles.headerContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search Term"
              placeholderTextColor="#999"
              style={styles.input}
              autoFocus={true}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Top Patient Matches */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TOP PATIENT MATCHES</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>

          <View style={styles.card}>
            <PatientMatchItem name="Patient Name" mrn="MRN #3927" />
            <View style={styles.divider} />
            <PatientMatchItem name="Patient Name" mrn="MRN #3927" />
          </View>

          {/* Documents */}
          <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 10 }]}>DOCUMENTS</Text>

          <View style={styles.card}>
            <DocumentMatchItem
              name="Patient Data"
              type="PDF"
              details="Oct 24 - 14 MB"
              time="10:42 AM"
            />
            <View style={styles.divider} />
            <DocumentMatchItem
              name="Patient Data"
              type="CSV"
              details="Oct 24 - 14 MB"
              time="10:42 AM"
            />
          </View>

        </ScrollView>

        {/* Bottom Nav */}
        <DoctorBottomNavBar
          navigation={navigation}
          activeTab="Home" // Keeping Home active or null since it's an overlay
          onFabPress={() => { }}
        />
      </View>
    </SafeAreaView>
  );
}

// --- Helpers ---

const PatientMatchItem = ({ name, mrn }) => (
  <TouchableOpacity style={styles.matchItem}>
    <View style={styles.avatar} />
    <View style={{ flex: 1 }}>
      <Text style={styles.matchName}>{name}</Text>
      <Text style={styles.matchSub}>{mrn}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#CCC" />
  </TouchableOpacity>
);

const DocumentMatchItem = ({ name, type, details, time }) => (
  <TouchableOpacity style={styles.matchItem}>
    <View style={styles.avatar} />
    <View style={{ flex: 1 }}>
      <Text style={styles.matchName}>{name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.typeTag}><Text style={styles.typeText}>{type}</Text></View>
        <Text style={styles.matchSub}>{details}</Text>
      </View>
    </View>
    <Text style={styles.timeText}>{time}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20, paddingBottom: 0 },

  headerContainer: { marginBottom: 15 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE' },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: '#333' },

  filterRow: { flexDirection: 'row', marginBottom: 25 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: '#666', fontSize: 12 },
  chipTextActive: { color: 'white', fontWeight: 'bold' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  seeAll: { color: '#2196F3', fontSize: 12, fontWeight: 'bold' },

  card: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
  matchItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 65 },

  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3E5F5', marginRight: 15 },
  matchName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  matchSub: { fontSize: 12, color: '#999' },

  typeTag: { backgroundColor: '#ECEFF1', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginRight: 6 },
  typeText: { fontSize: 10, fontWeight: 'bold', color: '#455A64' },
  timeText: { fontSize: 12, color: '#999' }
});