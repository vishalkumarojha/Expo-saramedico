import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

export default function DoctorQuickUploadScreen({ navigation }) {

  const handleAnalyze = () => {
    // Navigate to the new Result Screen (Timeline/Chat)
    navigation.navigate('DoctorAnalyzedResultScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={{flexDirection:'row', gap:15}}>
              <Ionicons name="notifications" size={24} color="#333" />
              <View style={styles.avatar} />
           </View>
        </View>

        {/* Upload Card */}
        <View style={styles.uploadCard}>
           <View style={styles.iconCircle}>
              <Ionicons name="cloud-upload" size={24} color="#333" />
           </View>
           <Text style={styles.cardTitle}>Upload Documents</Text>
           <Text style={styles.cardSub}>Tap to browse files.{'\n'}Supports PDF, JPG, PNG Max 100MB.</Text>
           
           <TouchableOpacity style={styles.browseBtn}>
              <Text style={styles.browseText}>Browse Files</Text>
           </TouchableOpacity>
        </View>

        {/* Settings */}
        <Text style={styles.label}>Upload Settings</Text>
        <Text style={styles.subLabel}>Document Category</Text>
        <View style={styles.dropdown}>
           <Text style={{color:'#333'}}>Clinical Report</Text>
           <Ionicons name="chevron-down" size={20} color="#666" />
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
           {/* Triggers navigation to the Result Screen */}
           <CustomButton title="Analyze →" onPress={handleAnalyze} />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  avatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#DDD' },

  uploadCard: { backgroundColor: 'white', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#DDD', padding: 30, alignItems: 'center', marginBottom: 30 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cardSub: { textAlign: 'center', color: '#666', marginBottom: 20, lineHeight: 20 },
  browseBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8 },
  browseText: { color: 'white', fontWeight: 'bold' },

  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  subLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE' },

  footer: { marginTop: 'auto' }
});