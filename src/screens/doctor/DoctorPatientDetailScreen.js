import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { doctorAPI } from '../../services/api';

export default function DoctorPatientDetailScreen({ route, navigation }) {
  const { patient, patientId } = route.params || {};
  const [activeTab, setActiveTab] = useState('Visits');
  const [loading, setLoading] = useState(false);
  const [visits, setVisits] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (patientId || patient?.id) {
      loadPatientDetails();
    }
  }, [patientId, patient?.id]);

  const loadPatientDetails = async () => {
    setLoading(true);
    const id = patientId || patient?.id;

    try {
      // Load visits/records
      try {
        const visitsResponse = await doctorAPI.getRecords(id);
        setVisits((visitsResponse.data || []).slice(0, 5)); // Top 5
      } catch (err) {
        console.log('No visits found');
        setVisits([]);
      }

      // Load documents
      try {
        const docsResponse = await doctorAPI.getPatientDocuments(id);
        const docsData = docsResponse.data?.documents || docsResponse.data;
        setDocuments(Array.isArray(docsData) ? docsData : []);
      } catch (err) {
        console.log('No documents found');
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error loading patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorPostVisitScreen', { patient })}>
            <Ionicons name="create-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#999" />
            </View>
          </View>
          <Text style={styles.patientName}>{patient?.name || 'Unknown Patient'}</Text>
          <Text style={styles.patientMeta}>MRN: {patient?.mrn || 'N/A'} - DOB: {patient?.dob || 'N/A'}</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Visits' && styles.activeTab]}
            onPress={() => setActiveTab('Visits')}
          >
            <Text style={[styles.tabText, activeTab === 'Visits' && styles.activeTabText]}>Visits</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'Documents' && styles.activeTab]}
            onPress={() => setActiveTab('Documents')}
          >
            <Text style={[styles.tabText, activeTab === 'Documents' && styles.activeTabText]}>Documents</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Visits' ? (
            <VisitsView navigation={navigation} visits={visits} loading={loading} />
          ) : (
            <DocumentsView documents={documents} loading={loading} />
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

// --- SUB-COMPONENTS ---

function VisitsView({ navigation, visits, loading }) {
  if (loading) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const visitsList = Array.isArray(visits) ? visits : [];

  if (visitsList.length === 0) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <Ionicons name="calendar-outline" size={50} color="#DDD" />
        <Text style={{ marginTop: 15, fontSize: 14, color: '#999' }}>No visits recorded</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionLabel}>RECENT VISITS (LAST 5)</Text>

      {visitsList.map((visit, index) => (
        <View key={visit.id || index} style={styles.visitCard}>
          <View style={styles.visitHeader}>
            <Text style={styles.visitDate}>
              {visit.visit_date || visit.created_at || 'No date'}
            </Text>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => navigation.navigate('DoctorPostVisitScreen', { visit })}
            >
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.visitTitle}>{visit.visit_type || visit.reason || 'General Visit'}</Text>
          <Text style={styles.visitDesc} numberOfLines={3}>
            {visit.notes || visit.description || 'No description available'}
          </Text>
        </View>
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

function DocumentsView({ documents, loading }) {
  if (loading) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const docsList = Array.isArray(documents) ? documents : [];

  if (docsList.length === 0) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <Ionicons name="document-outline" size={50} color="#DDD" />
        <Text style={{ marginTop: 15, fontSize: 14, color: '#999' }}>No documents uploaded</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionLabel}>UPLOADED DOCUMENTS</Text>

      {docsList.map((doc, index) => (
        <DocumentItem
          key={doc.id || index}
          title={doc.title || doc.filename || 'Document'}
          sub={`Uploaded ${doc.uploaded_at || doc.created_at || 'Unknown date'}`}
        />
      ))}
    </ScrollView>
  );
}

const DocumentItem = ({ title, sub }) => (
  <TouchableOpacity style={styles.docItem}>
    <View style={styles.pdfIcon}>
      <Ionicons name="document-text" size={24} color="#E53935" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.docTitle}>{title}</Text>
      <Text style={styles.docSub}>{sub}</Text>
    </View>
    <Ionicons name="eye-outline" size={20} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  profileHeader: { alignItems: 'center', marginBottom: 25 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F0F2F5', justifyItems: 'center', alignItems: 'center', justifyContent: 'center' },
  patientName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  patientMeta: { fontSize: 13, color: '#999' },

  tabContainer: { flexDirection: 'row', backgroundColor: '#E3E8ED', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: COLORS.primary, fontWeight: 'bold' },
  tabContent: { flex: 1 },

  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 15, marginTop: 5, letterSpacing: 0.5, textTransform: 'uppercase' },

  visitCard: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  visitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  visitDate: { fontSize: 11, color: '#999', fontWeight: '600', textTransform: 'uppercase' },
  viewBtn: { backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  viewBtnText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  visitTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  visitDesc: { fontSize: 13, color: '#555', lineHeight: 18 },

  docItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  pdfIcon: { width: 40, height: 40, backgroundColor: '#FFEBEE', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  docTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  docSub: { fontSize: 12, color: '#999', marginTop: 2 }
});