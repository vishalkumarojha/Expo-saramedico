import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import DoctorBottomNavBar from '../../components/DoctorBottomNavBar';
import { doctorAPI } from '../../services/api';

export default function DoctorSearchScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ patients: [], doctors: [], documents: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeout = useRef(null);

  const filters = ['All', 'Patients', 'Doctors', 'Documents'];

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeout.current = setTimeout(() => {
        performSearch(searchQuery, activeFilter);
      }, 300);
    } else {
      setSearchResults({ patients: [], doctors: [], documents: [] });
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, activeFilter]);

  const performSearch = async (query, filter) => {
    setLoading(true);
    setError(null);
    try {
      let response;

      // Call appropriate API based on filter
      switch (filter) {
        case 'Patients':
          response = await doctorAPI.searchPatients(query);
          setSearchResults({ patients: response.data || [], doctors: [], documents: [] });
          break;
        case 'Doctors':
          response = await doctorAPI.searchDoctors(query);
          setSearchResults({ patients: [], doctors: response.data || [], documents: [] });
          break;
        case 'Documents':
          response = await doctorAPI.searchDocuments(query);
          setSearchResults({ patients: [], doctors: [], documents: response.data || [] });
          break;
        default: // 'All'
          response = await doctorAPI.searchAll(query);
          setSearchResults({
            patients: response.data?.patients || [],
            doctors: response.data?.doctors || [],
            documents: response.data?.documents || []
          });
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
      setSearchResults({ patients: [], doctors: [], documents: [] });
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    navigation.navigate('DoctorPatientDetailScreen', {
      patientId: patient.id,
      patient: patient
    });
  };

  const handleDocumentClick = (document) => {
    // Navigate to document viewer or show document details
    console.log('View document:', document);
    // TODO: Implement document viewer
  };

  const filteredResults = () => {
    switch (activeFilter) {
      case 'Patients':
        return { patients: searchResults.patients, doctors: [], documents: [] };
      case 'Doctors':
        return { patients: [], doctors: searchResults.doctors, documents: [] };
      case 'Documents':
        return { patients: [], doctors: [], documents: searchResults.documents };
      default:
        return searchResults;
    }
  };

  const results = filteredResults();
  const hasResults = results.patients.length > 0 || results.doctors.length > 0 || results.documents.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Search Header with Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search patients, doctors, documents..."
              placeholderTextColor="#999"
              style={styles.input}
              autoFocus={true}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
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

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && searchQuery.length >= 2 && !hasResults && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubText}>Try different keywords</Text>
          </View>
        )}

        {!loading && searchQuery.length < 2 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>Start typing to search</Text>
            <Text style={styles.emptySubText}>Search for patients, doctors, or documents</Text>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

          {/* Patient Matches */}
          {results.patients.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>PATIENTS ({results.patients.length})</Text>
              </View>

              <View style={styles.card}>
                {results.patients.map((patient, index) => (
                  <React.Fragment key={patient.id || index}>
                    {index > 0 && <View style={styles.divider} />}
                    <PatientMatchItem
                      patient={patient}
                      onPress={() => handlePatientClick(patient)}
                    />
                  </React.Fragment>
                ))}
              </View>
            </>
          )}

          {/* Doctor Matches */}
          {results.doctors.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>DOCTORS ({results.doctors.length})</Text>
              </View>

              <View style={styles.card}>
                {results.doctors.map((doctor, index) => (
                  <React.Fragment key={doctor.id || index}>
                    {index > 0 && <View style={styles.divider} />}
                    <DoctorMatchItem doctor={doctor} />
                  </React.Fragment>
                ))}
              </View>
            </>
          )}

          {/* Documents */}
          {results.documents.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>DOCUMENTS ({results.documents.length})</Text>
              </View>

              <View style={styles.card}>
                {results.documents.map((doc, index) => (
                  <React.Fragment key={doc.id || index}>
                    {index > 0 && <View style={styles.divider} />}
                    <DocumentMatchItem
                      document={doc}
                      onPress={() => handleDocumentClick(doc)}
                    />
                  </React.Fragment>
                ))}
              </View>
            </>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Nav - Always Visible */}
        <DoctorBottomNavBar
          navigation={navigation}
          activeTab="Home"
          onFabPress={() => { }}
        />
      </View>
    </SafeAreaView>
  );
}

// --- Helper Components ---

const PatientMatchItem = ({ patient, onPress }) => (
  <TouchableOpacity style={styles.matchItem} onPress={onPress}>
    <View style={[styles.avatar, { backgroundColor: '#E3F2FD' }]}>
      <Ionicons name="person" size={20} color="#2196F3" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.matchName}>{patient.full_name || patient.name || 'Unknown Patient'}</Text>
      <Text style={styles.matchSub}>MRN: {patient.mrn || patient.id || 'N/A'}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#CCC" />
  </TouchableOpacity>
);

const DoctorMatchItem = ({ doctor }) => (
  <TouchableOpacity style={styles.matchItem}>
    <View style={[styles.avatar, { backgroundColor: '#E8F5E9' }]}>
      <Ionicons name="medical" size={20} color="#4CAF50" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.matchName}>Dr. {doctor.full_name || doctor.name || 'Unknown'}</Text>
      <Text style={styles.matchSub}>{doctor.specialty || 'General Practice'}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#CCC" />
  </TouchableOpacity>
);

const DocumentMatchItem = ({ document, onPress }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <TouchableOpacity style={styles.matchItem} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: '#FFF3E0' }]}>
        <Ionicons name="document-text" size={20} color="#FF9800" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.matchName}>{document.title || document.filename || 'Document'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{document.file_type || document.type || 'PDF'}</Text>
          </View>
          <Text style={styles.matchSub}>
            {formatDate(document.uploaded_at || document.created_at)}
            {document.file_size && ` • ${formatSize(document.file_size)}`}
          </Text>
        </View>
        {document.uploaded_by && (
          <Text style={styles.uploaderText}>
            Uploaded by: {document.uploaded_by.full_name || document.uploaded_by.name || 'Unknown'}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1 },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    gap: 10
  },
  backButton: {
    padding: 5
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: '#333' },

  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: '#666', fontSize: 12 },
  chipTextActive: { color: 'white', fontWeight: 'bold' },

  scrollView: { flex: 1, paddingHorizontal: 20 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 14 },

  errorContainer: { padding: 20, alignItems: 'center' },
  errorText: { color: '#F44336', fontSize: 14 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#999', marginTop: 15 },
  emptySubText: { fontSize: 13, color: '#BBB', marginTop: 5 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 15 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },

  card: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
  matchItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 65 },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  matchName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  matchSub: { fontSize: 12, color: '#999' },
  uploaderText: { fontSize: 11, color: '#666', marginTop: 2, fontStyle: 'italic' },

  typeTag: { backgroundColor: '#ECEFF1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6 },
  typeText: { fontSize: 10, fontWeight: 'bold', color: '#455A64' },
});