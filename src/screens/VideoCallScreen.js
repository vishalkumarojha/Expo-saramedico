import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import zoomService from '../services/zoomService';
import { getUserData } from '../services/api';

/**
 * VideoCallScreen - Embedded Zoom video call
 * 
 * Doctor Flow: Auto-join with account credentials
 * Patient Flow: Enter name → join as participant
 */
export default function VideoCallScreen({ route, navigation }) {
  const { appointment, role } = route.params; // appointment contains meeting details

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const data = await getUserData();
    setUserData(data);

    // Auto-set name for doctor
    if (data && data.role === 'doctor') {
      setUserName(`Dr. ${data.first_name} ${data.last_name}`);
    } else if (data) {
      setUserName(`${data.first_name} ${data.last_name}`);
    }
  };

  /**
   * Extract meeting number from Zoom URL or use meeting_id
   */
  const getMeetingNumber = () => {
    if (appointment.meeting_id) {
      return appointment.meeting_id;
    }

    // Extract from join_url if needed
    // Example: https://zoom.us/j/1234567890?pwd=xxx
    const match = appointment.join_url?.match(/\/j\/(\d+)/);
    return match ? match[1] : null;
  };

  /**
   * Handle joining the meeting
   */
  const handleJoinMeeting = async () => {
    if (!userName.trim()) {
      Alert.alert('Name Required', 'Please enter your name to join the meeting');
      return;
    }

    setLoading(true);

    try {
      const meetingNumber = getMeetingNumber();

      if (!meetingNumber) {
        throw new Error('Invalid meeting number');
      }

      const meetingData = {
        meetingNumber: meetingNumber,
        password: appointment.meeting_password || '',
        displayName: userName.trim(),
      };

      let result;

      // Doctor joins as host with ZAK token (if available)
      if (userData?.role === 'doctor' && appointment.zak_token) {
        meetingData.zoomAccessToken = appointment.zak_token;
        result = await zoomService.joinMeetingAsHost(meetingData);
      } else {
        // Patient joins as participant
        result = await zoomService.joinMeetingAsParticipant(meetingData);
      }

      if (result.success) {
        setIsInMeeting(true);
      } else {
        Alert.alert('Failed to Join', result.error || 'Could not join the meeting');
      }
    } catch (error) {
      console.error('Join meeting error:', error);
      Alert.alert('Error', error.message || 'Failed to join meeting');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle leaving the meeting
   */
  const handleLeaveMeeting = async () => {
    const result = await zoomService.leaveMeeting();
    if (result.success) {
      setIsInMeeting(false);
      navigation.goBack();
    }
  };

  // If doctor, auto-join
  useEffect(() => {
    if (userData?.role === 'doctor' && userName && !isInMeeting && !loading) {
      handleJoinMeeting();
    }
  }, [userData, userName]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Call</Text>
        <View style={{ width: 40 }} />
      </View>

      {!isInMeeting ? (
        <View style={styles.preJoinContainer}>
          <Ionicons name="videocam" size={80} color={COLORS.primary} />
          <Text style={styles.meetingTitle}>
            {userData?.role === 'doctor' ? 'Starting consultation...' : 'Join Consultation'}
          </Text>

          {userData?.role !== 'doctor' && (
            <>
              <Text style={styles.instructionText}>
                Enter your name to join the video call
              </Text>

              <TextInput
                style={styles.nameInput}
                placeholder="Your Full Name"
                value={userName}
                onChangeText={setUserName}
                editable={!loading}
                autoCapitalize="words"
              />
            </>
          )}

          {userData?.role !== 'doctor' && (
            <TouchableOpacity
              style={[styles.joinButton, loading && styles.joinButtonDisabled]}
              onPress={handleJoinMeeting}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="videocam" size={24} color="white" />
                  <Text style={styles.joinButtonText}>Join Meeting</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {userData?.role === 'doctor' && loading && (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
          )}

          <View style={styles.meetingInfo}>
            <Text style={styles.infoLabel}>Meeting ID:</Text>
            <Text style={styles.infoValue}>{getMeetingNumber()}</Text>
            {appointment.meeting_password && (
              <>
                <Text style={styles.infoLabel}>Password:</Text>
                <Text style={styles.infoValue}>{appointment.meeting_password}</Text>
              </>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.inMeetingContainer}>
          {/* Zoom SDK will render the meeting UI here */}
          <Text style={styles.inMeetingText}>Meeting in progress...</Text>

          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveMeeting}
          >
            <Ionicons name="exit" size={24} color="white" />
            <Text style={styles.leaveButtonText}>Leave Meeting</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  preJoinContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  meetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  nameInput: {
    width: '100%',
    maxWidth: 400,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 24,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    minWidth: 200,
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  meetingInfo: {
    marginTop: 40,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inMeetingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inMeetingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  leaveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});