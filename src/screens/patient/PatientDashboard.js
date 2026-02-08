import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import BottomNavBar from '../../components/BottomNavBar';
import Sidebar from '../../components/Sidebar';
import { patientAPI, authAPI } from '../../services/api';

export default function PatientDashboard({ navigation }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [nextAppointment, setNextAppointment] = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch patient profile
      const profileRes = await authAPI.getCurrentUser();
      const fullName = profileRes.data?.name || profileRes.data?.full_name || 'Patient';
      setPatientName(fullName);

      // Fetch next approved appointment
      try {
        const appointmentsRes = await patientAPI.getMyAppointments();
        const appointments = appointmentsRes.data || [];

        // Filter accepted appointments and get the next one
        const acceptedApts = appointments
          .filter(apt => apt.status === 'accepted')
          .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

        if (acceptedApts.length > 0) {
          setNextAppointment(acceptedApts[0]);
        }
      } catch (err) {
        console.log('No appointments found');
      }

      // Fetch last 10 consultations
      try {
        const consultationsRes = await patientAPI.getMyConsultations(10);
        // Backend returns { consultations: [], total: 0 }
        const consultations = consultationsRes.data?.consultations || consultationsRes.data || [];
        setRecentVisits(Array.isArray(consultations) ? consultations : []);
      } catch (err) {
        console.log('No consultations found');
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTodayDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return `Today is ${new Date().toLocaleDateString('en-US', options)}`;
  };

  const handleCheckIn = () => {
    if (!nextAppointment) return;

    const appointmentTime = new Date(nextAppointment.scheduled_at);
    const now = new Date();
    const timeDiff = (appointmentTime - now) / (1000 * 60); // minutes

    // Allow check-in 15 minutes before appointment
    if (timeDiff > 15) {
      Alert.alert(
        'Too Early',
        `Your appointment is at ${appointmentTime.toLocaleTimeString()}. You can check in 15 minutes before.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Navigate to video call
    navigation.navigate('VideoCallScreen', {
      appointmentId: nextAppointment.id,
      doctorName: nextAppointment.doctor?.full_name || 'Doctor'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        navigation={navigation}
      />

      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
                <Ionicons name="menu-outline" size={28} color="#333" />
              </TouchableOpacity>
              <View style={{ marginTop: 15 }}>
                <Text style={styles.greetingTitle}>{getGreeting()}, {patientName}</Text>
                <Text style={styles.dateText}>{getTodayDate()}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('PatientNotificationsScreen')}
              >
                <Ionicons name="notifications-outline" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('PatientSettingsScreen')}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionRow}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#E3F2FD' }]}
              onPress={() => navigation.navigate('ScheduleScreen')}
            >
              <View style={styles.iconBox}>
                <Ionicons name="calendar" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Book Appointment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#FFF3E0' }]}
              onPress={() => navigation.navigate('MedicalRecordsScreen')}
            >
              <View style={styles.iconBox}>
                <Ionicons name="document-text" size={28} color="#FF9800" />
              </View>
              <Text style={styles.actionLabel}>My Records</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#F3E5F5' }]}
              onPress={() => navigation.navigate('MessagesScreen')}
            >
              <View style={styles.iconBox}>
                <Ionicons name="chatbubbles" size={28} color="#9C27B0" />
              </View>
              <Text style={styles.actionLabel}>Messages</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Up Next Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ScheduleScreen')}>
              <Text style={styles.linkText}>View Calendar</Text>
            </TouchableOpacity>
          </View>

          {nextAppointment ? (
            <View style={styles.appointmentCard}>
              <View style={styles.apptHeader}>
                <View>
                  <Text style={styles.apptTitle}>
                    {nextAppointment.reason || 'Consultation'}
                  </Text>
                  <View style={styles.apptSubRow}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{nextAppointment.consultation_type || 'Video Call'}</Text>
                    </View>
                    <Text style={styles.docName}>
                      with Dr. {nextAppointment.doctor?.full_name || 'Doctor'}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.timeText}>
                    {new Date(nextAppointment.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.amPmText}>
                    {new Date(nextAppointment.scheduled_at).toLocaleString('en-US', { weekday: 'short' })}
                  </Text>
                </View>
              </View>

              <View style={styles.apptActions}>
                <TouchableOpacity
                  style={styles.checkInBtn}
                  onPress={handleCheckIn}
                >
                  <Text style={styles.checkInText}>Check-in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => navigation.navigate('DoctorProfile', { doctorId: nextAppointment.doctor_id })}
                >
                  <Text style={styles.detailsText}>Doctor Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={40} color="#CCC" />
              <Text style={styles.emptyText}>No upcoming appointments</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ScheduleScreen')}>
                <Text style={styles.linkText}>Book an Appointment</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Recent Visits Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Visits</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MedicalRecordsScreen')}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.visitList}>
            {recentVisits.length > 0 ? (
              recentVisits.slice(0, 5).map((visit, index) => (
                <VisitItem
                  key={visit.id || index}
                  visit={visit}
                  navigation={navigation}
                />
              ))
            ) : (
              <View style={styles.emptyVisits}>
                <Text style={styles.emptyText}>No recent visits</Text>
              </View>
            )}
          </View>

        </ScrollView>
      </View>

      <BottomNavBar navigation={navigation} activeTab="Home" />
    </SafeAreaView>
  );
}

const VisitItem = ({ visit, navigation }) => {
  const doctorName = visit.doctor?.full_name || 'Doctor';
  const visitDate = new Date(visit.created_at || visit.consultationDate);
  const timeAgo = getTimeAgo(visitDate);

  return (
    <TouchableOpacity
      style={styles.visitItem}
      onPress={() => navigation.navigate('ConsultationDetails', { consultationId: visit.id })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.visitAvatar, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="medical" size={20} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.visitName}>Dr. {doctorName}</Text>
          <Text style={styles.visitInfo}>{timeAgo} • {visit.visitType || 'Consultation'}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
        <Text style={[styles.statusText, { color: '#2E7D32' }]}>• Completed</Text>
      </View>
    </TouchableOpacity>
  );
};

const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  contentContainer: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  greetingTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  dateText: { fontSize: 13, color: '#666', marginTop: 4 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  linkText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  quickActionRow: { flexDirection: 'row', marginBottom: 25 },
  actionCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginRight: 15,
    width: 140,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  iconBox: { marginBottom: 10 },
  actionLabel: { fontSize: 13, color: '#333', fontWeight: '600', textAlign: 'center' },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 10
  },
  emptyText: { fontSize: 14, color: '#999', marginTop: 10 },
  apptHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  apptTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  apptSubRow: { flexDirection: 'row', alignItems: 'center' },
  tag: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 10 },
  tagText: { color: COLORS.primary, fontSize: 11, fontWeight: '600' },
  docName: { color: '#666', fontSize: 13 },
  timeText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  amPmText: { fontSize: 12, color: '#999' },
  apptActions: { flexDirection: 'row', justifyContent: 'space-between' },
  checkInBtn: { backgroundColor: COLORS.primary, flex: 1, paddingVertical: 12, borderRadius: 10, marginRight: 10, alignItems: 'center' },
  checkInText: { color: 'white', fontWeight: '600' },
  detailsBtn: { backgroundColor: '#F5F5F5', flex: 1, paddingVertical: 12, borderRadius: 10, marginLeft: 10, alignItems: 'center' },
  detailsText: { color: '#333', fontWeight: '600' },
  visitList: { backgroundColor: 'white', borderRadius: 20, padding: 15 },
  visitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  visitAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  visitName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  visitInfo: { fontSize: 12, color: '#999', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  statusText: { fontSize: 11, fontWeight: '600' },
  emptyVisits: { padding: 20, alignItems: 'center' }
});