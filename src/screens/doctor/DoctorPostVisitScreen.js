import React from 'react';
import { 
  View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export default function DoctorPostVisitScreen({ navigation }) {
  // Mock data matching the screenshot
  const patient = {
    name: 'Benjamin Dopel',
    details: '35, Male',
    img: 'https://i.pravatar.cc/100?img=12'
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Post-Visit Editor</Text>
            <View style={{width: 24}} /> 
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
           
           {/* Patient Info Header */}
           <View style={styles.patientRow}>
              <Image source={{uri: patient.img}} style={styles.avatar} />
              <View>
                 <Text style={styles.patientName}>{patient.name}</Text>
                 <Text style={styles.patientDetails}>{patient.details}</Text>
              </View>
           </View>

           {/* SOAP Note Sections */}
           
           {/* SUBJECTIVE */}
           <Text style={styles.sectionLabel}>SUBJECTIVE</Text>
           <View style={styles.card}>
              <Text style={styles.cardText}>
                Patient presents with persistent lower back pain. Reports stiffness in the mornings. States stretching exercises have been partially effective but notes radiating pain down the left thigh. Denies numbness or pain extending below the knees. Describes these issues with guidance.
              </Text>
           </View>

           {/* OBJECTIVE */}
           <Text style={styles.sectionLabel}>OBJECTIVE</Text>
           <View style={styles.card}>
              <Text style={styles.cardText}>
                Patient appears comfortable at rest but demonstrates guarded movement when standing. Range of motion in lumbar spine limited in flexion. No visible antalgic gait noted today.
              </Text>
           </View>

           {/* ASSESSMENT */}
           <Text style={styles.sectionLabel}>ASSESSMENT</Text>
           <View style={styles.card}>
              <Text style={styles.cardText}>
                Symptoms consistent with lumbar radiculopathy (L4-L5 Distribution). Unlikely disc herniation requiring surgical intervention at this stage given lack of neurological deficit.
              </Text>
           </View>

           {/* PLAN */}
           <Text style={styles.sectionLabel}>PLAN</Text>
           <View style={styles.card}>
              <View style={styles.bulletItem}>
                 <Text style={styles.bullet}>•</Text>
                 <Text style={styles.cardText}>Continue daily stretching regimen, modify to avoid pain.</Text>
              </View>
              <View style={styles.bulletItem}>
                 <Text style={styles.bullet}>•</Text>
                 <Text style={styles.cardText}>Increase Naproxen to 500mg BID with food.</Text>
              </View>
              <View style={styles.bulletItem}>
                 <Text style={styles.bullet}>•</Text>
                 <Text style={styles.cardText}>Follow up in 2 weeks.</Text>
              </View>
              <View style={styles.bulletItem}>
                 <Text style={styles.bullet}>•</Text>
                 <Text style={styles.cardText}>Refer to PT if no improvement.</Text>
              </View>
           </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },

  patientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  patientName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  patientDetails: { fontSize: 14, color: '#666' },

  sectionLabel: { fontSize: 13, fontWeight: 'bold', color: '#90CAF9', marginBottom: 10, marginTop: 10, letterSpacing: 0.5, textTransform: 'uppercase' }, // Light blue label color based on screenshot
  
  card: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' }, // No shadow, clean border as per UI
  cardText: { fontSize: 14, color: '#444', lineHeight: 22 },
  
  bulletItem: { flexDirection: 'row', marginBottom: 4 },
  bullet: { fontSize: 14, color: '#444', marginRight: 8, lineHeight: 22 }
});