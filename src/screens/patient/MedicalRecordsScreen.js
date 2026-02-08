import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import BottomNavBar from '../../components/BottomNavBar';
import { patientAPI } from '../../services/api';

export default function MedicalRecordsScreen({ navigation }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getMyConsultations(10);
      const consultationsData = response.data?.consultations || response.data || [];
      setConsultations(Array.isArray(consultationsData) ? consultationsData : []);
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medical Records</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>Last 10 Consultations</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : consultations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#DDD" />
            <Text style={styles.emptyText}>No consultations yet</Text>
            <Text style={styles.emptySubtext}>Your consultation history will appear here</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {consultations.map((consultation, index) => (
              <TouchableOpacity
                key={consultation.id || index}
                style={styles.card}
                onPress={() => navigation.navigate('ConsultationDetails', { consultationId: consultation.id })}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.doctorAvatar, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="medical" size={24} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.doctorName}>
                      Dr. {consultation.doctor?.full_name || 'Doctor'}
                    </Text>
                    <Text style={styles.specialty}>
                      {consultation.doctor?.specialty || 'General Practice'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {formatDate(consultation.created_at || consultation.consultationDate)}
                    </Text>
                  </View>

                  {consultation.diagnosis && (
                    <View style={styles.infoRow}>
                      <Ionicons name="clipboard-outline" size={16} color="#666" />
                      <Text style={styles.infoText} numberOfLines={1}>
                        {consultation.diagnosis}
                      </Text>
                    </View>
                  )}

                  <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
                      <Text style={[styles.statusText, { color: '#2E7D32' }]}>• Completed</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <View style={{ height: 100 }} />
          </ScrollView>
        )}

      </View>

      <BottomNavBar navigation={navigation} activeTab="Records" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#666', marginTop: 15 },
  emptySubtext: { fontSize: 13, color: '#999', marginTop: 5, textAlign: 'center' },
  scrollView: { flex: 1 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  doctorAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  doctorName: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  specialty: { fontSize: 12, color: '#999' },
  cardBody: { marginTop: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#666', marginLeft: 8, flex: 1 },
  statusRow: { flexDirection: 'row', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600' }
});