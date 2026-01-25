import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

const SPECIALTIES = [
  { id: 'derm', name: 'Dermatology', icon: 'water' },
  { id: 'card', name: 'Cardiology', icon: 'heart' },
  { id: 'neur', name: 'Neurology', icon: 'fitness' }, // Neurology specialty icon
  { id: 'radi', name: 'Radiology', icon: 'man' },
  { id: 'pedi', name: 'Pediatrics', icon: 'happy' },
];

export default function DoctorSpecialtyScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState('card'); // Default 'Cardiology' selected for demo

  const handleContinue = () => {
    navigation.navigate('DoctorMicrophoneTestScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header: Back + Progress Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '30%' }]} />
          </View>
        </View>

        <Text style={styles.title}>Choose your Speciality</Text>
        <Text style={styles.subtitle}>We'll tailor the platform according to your specialty.</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            placeholder="Search speciality (e.g. Neurology)"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        {/* Most Common Chips */}
        <Text style={styles.sectionLabel}>Most Common</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>General Physician</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.chip, styles.chipActive]}><Text style={styles.chipTextActive}>Cardiology</Text></TouchableOpacity>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Pediatrics</Text></TouchableOpacity>
        </View>

        {/* All Specialties List */}
        <Text style={styles.sectionLabel}>All Specialties</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {SPECIALTIES.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, isSelected && styles.cardActive]}
                onPress={() => setSelectedId(item.id)}
                activeOpacity={0.9}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconBox}>
                    <Ionicons name={item.icon} size={20} color="#555" />
                  </View>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleActive]}>{item.name}</Text>
                </View>

                {/* Radio Button Logic */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <CustomButton title="Continue" onPress={handleContinue} />
          <TouchableOpacity style={{ alignItems: 'center', marginTop: 15 }}>
            <Text style={{ color: '#999', fontSize: 13 }}>I don't see my speciality</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, padding: 25 },

  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  progressBarTrack: { flex: 1, height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginLeft: 20 },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },

  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 20 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 25 },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },

  sectionLabel: { fontSize: 14, color: '#999', marginBottom: 15 },
  chipRow: { flexDirection: 'row', marginBottom: 25 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: '#EEE', borderRadius: 20, marginRight: 10 },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: '#333', fontSize: 13 },
  chipTextActive: { color: 'white', fontSize: 13, fontWeight: '600' },

  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', marginBottom: 12 },
  cardActive: { borderColor: COLORS.primary, borderWidth: 1.5 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, backgroundColor: '#F5F5F5', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTitle: { fontSize: 16, fontWeight: '500', color: '#333' },
  cardTitleActive: { fontWeight: 'bold', color: '#1A1A1A' },

  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  radioOuterActive: { borderColor: COLORS.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },

  footer: { position: 'absolute', bottom: 30, left: 25, right: 25 }
});