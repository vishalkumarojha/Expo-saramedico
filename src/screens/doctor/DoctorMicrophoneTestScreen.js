import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

export default function DoctorMicrophoneTestScreen({ navigation }) {

  const handleNextStep = () => {
    // Navigate directly to Dashboard (onboarding complete)
    navigation.navigate('DoctorDashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header: Back + Progress Bar (Step 2/4) */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>
        </View>

        <Text style={styles.title}>Test Your Microphone</Text>
        <Text style={styles.subtitle}>Please speak a short sentence to ensure accurate transcription</Text>

        {/* Mic Visualizer Area */}
        <View style={styles.micContainer}>
          <View style={styles.micCircleOuter}>
            <View style={styles.micCircleInner}>
              <Ionicons name="mic" size={40} color="white" />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <CustomButton title="Start Test" onPress={handleNextStep} />
          <TouchableOpacity
            style={{ alignItems: 'center', marginTop: 15 }}
            onPress={handleNextStep}
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

  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  progressBarTrack: { flex: 1, height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginLeft: 20 },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },

  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },

  micContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 50 },
  micCircleOuter: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  micCircleInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },

  footer: { marginTop: 'auto', paddingBottom: 10 }
});