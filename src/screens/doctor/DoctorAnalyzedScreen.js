import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

export default function DoctorAnalyzedScreen({ navigation }) {
  
  const handleContinue = () => {
    // End of Onboarding -> Go to Dashboard
    navigation.replace('DoctorDashboard'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '100%' }]} />
          </View>
        </View>

        <Text style={styles.title}>Analyzed Document</Text>

        {/* Placeholder for Document Preview / Analysis Result */}
        <View style={styles.previewContainer}>
           {/* In a real app, the PDF or analysis results would render here */}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
           <CustomButton title="Continue to Dashboard →" onPress={handleContinue} />
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

  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 20 },

  previewContainer: { flex: 1, backgroundColor: '#F8F9FA', borderRadius: 15, marginBottom: 20 },

  footer: { marginTop: 'auto', paddingBottom: 10 }
});