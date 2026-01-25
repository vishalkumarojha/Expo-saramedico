import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

export default function DoctorUploadScreen({ navigation }) {
  const [isRedactEnabled, setIsRedactEnabled] = useState(true);

  const handleAnalyze = () => {
    navigation.navigate('DoctorAnalyzedScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header: Back + Progress Bar (Step 3/4) */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '85%' }]} />
          </View>
        </View>

        {/* Upload Zone */}
        <View style={styles.uploadZone}>
          <View style={styles.uploadIconCircle}>
            <Ionicons name="cloud-upload" size={28} color="#555" />
          </View>
          <Text style={styles.uploadTitle}>Upload Sample Documents</Text>
          <Text style={styles.uploadSub}>Tap to browse files.{'\n'}Supports PDF, JPG, PNG Max 100MB.</Text>

          <TouchableOpacity style={styles.browseBtn}>
            <Text style={styles.browseText}>Browse Files</Text>
          </TouchableOpacity>
        </View>

        {/* Document Category Dropdown (Mock) */}
        <Text style={styles.label}>Document Category</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Clinical Report</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Auto-Redact Toggle */}
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Auto-Redact PII <Ionicons name="information-circle" size={14} color="#999" /></Text>
            <Text style={styles.toggleSub}>Mask Patient names & dates automatically</Text>
          </View>
          <Switch
            value={isRedactEnabled}
            onValueChange={setIsRedactEnabled}
            trackColor={{ false: "#767577", true: COLORS.primary }}
          />
        </View>

        {/* Accepted Examples */}
        <Text style={styles.label}>Accepted Examples</Text>
        <View style={styles.exampleRow}>
          <View style={styles.exampleChip}>
            <Ionicons name="document-text" size={16} color={COLORS.primary} />
            <Text style={styles.exampleText}>Clinical Note</Text>
          </View>
          <View style={styles.exampleChip}>
            <Ionicons name="document-text" size={16} color={COLORS.primary} />
            <Text style={styles.exampleText}>Diagnose Report</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <CustomButton title="Analyze →" onPress={handleAnalyze} />
          <TouchableOpacity
            style={{ alignItems: 'center', marginTop: 15 }}
            onPress={handleAnalyze} // Skip behavior
          >
            <Text style={{ color: '#999', fontSize: 13 }}>Skip for now</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, padding: 25 },

  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  progressBarTrack: { flex: 1, height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginLeft: 20 },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },

  uploadZone: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 20, padding: 30, alignItems: 'center', backgroundColor: '#F9FAFB', marginBottom: 25 },
  uploadIconCircle: { width: 60, height: 60, backgroundColor: '#EDF2F7', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  uploadTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  uploadSub: { fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  browseBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 10, borderRadius: 8 },
  browseText: { color: 'white', fontWeight: '600', fontSize: 14 },

  label: { fontSize: 13, color: '#444', marginBottom: 10, marginTop: 10 },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 10, paddingHorizontal: 15, height: 50 },
  dropdownText: { fontSize: 15, color: '#333' },

  toggleRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 10, padding: 15, marginTop: 20, marginBottom: 20 },
  toggleTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  toggleSub: { fontSize: 11, color: '#999' },

  exampleRow: { flexDirection: 'row', marginBottom: 20 },
  exampleChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 10 },
  exampleText: { fontSize: 12, color: '#555', marginLeft: 6 },

  footer: { marginTop: 'auto', paddingBottom: 10 }
});