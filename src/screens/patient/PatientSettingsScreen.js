import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity,
  Switch, Modal, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import SignOutModal from '../../components/SignOutModal';
import { authAPI, patientAPI } from '../../services/api';

export default function PatientSettingsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState(null);

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Edit field states
  const [editValue, setEditValue] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      await authAPI.changePassword(oldPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully');
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password change error:', error);
      Alert.alert('Error', error.response?.data?.detail || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEditField = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue);
    setShowEditModal(true);
  };

  const saveFieldEdit = async () => {
    if (!editValue) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    try {
      setEditLoading(true);
      const updateData = {};
      updateData[editField] = editValue;

      await patientAPI.updateProfile(updateData);

      // Update local state
      setProfile({ ...profile, [editField]: editValue });

      Alert.alert('Success', 'Profile updated successfully');
      setShowEditModal(false);
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleSignOut = () => {
    setShowSignOut(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#FFF" />
              </View>
            </View>
            <Text style={styles.nameText}>{profile?.name || profile?.full_name || 'Patient'}</Text>
            <Text style={styles.roleText}>Patient ID: {profile?.id?.substring(0, 8) || 'N/A'}</Text>
          </View>

          {/* CONTACT INFORMATION Section */}
          <Text style={styles.sectionLabel}>CONTACT INFORMATION</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => handleEditField('email', profile?.email)}
            >
              <View style={styles.iconBox}><Ionicons name="mail-outline" size={20} color="#555" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>Email</Text>
                <Text style={styles.itemSub}>{profile?.email || 'Not set'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.row}
              onPress={() => handleEditField('phone_number', profile?.phone_number)}
            >
              <View style={styles.iconBox}><Ionicons name="call-outline" size={20} color="#555" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>Phone</Text>
                <Text style={styles.itemSub}>{profile?.phone_number || 'Not set'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>
          </View>

          {/* SECURITY Section */}
          <Text style={styles.sectionLabel}>SECURITY</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => setShowPasswordModal(true)}
            >
              <View style={styles.iconBox}><Ionicons name="lock-closed-outline" size={20} color="#555" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>Change Password</Text>
                <Text style={styles.itemSub}>Update your password</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.iconBox}><Ionicons name="shield-checkmark-outline" size={20} color="#555" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>Two-Factor Auth</Text>
                <Text style={styles.itemSub}>{is2FAEnabled ? 'Enabled' : 'Disabled'}</Text>
              </View>
              <Switch
                value={is2FAEnabled}
                onValueChange={setIs2FAEnabled}
                trackColor={{ false: "#DDD", true: COLORS.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          {/* PRIVACY & DATA Section */}
          <Text style={styles.sectionLabel}>PRIVACY & DATA</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('AuditLogScreen')}
            >
              <View style={styles.iconBox}><Ionicons name="list-outline" size={20} color="#555" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>Audit Logs</Text>
                <Text style={styles.itemSub}>View your activity history</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('DeleteAccountScreen')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="trash-outline" size={20} color="#D32F2F" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitle, { color: '#D32F2F' }]}>Delete Account</Text>
                <Text style={styles.itemSub}>Permanently delete your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity style={styles.signOutBtn} onPress={() => setShowSignOut(true)}>
            <Ionicons name="log-out-outline" size={20} color="#D32F2F" style={{ marginRight: 8 }} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Old Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleChangePassword}
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Field Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editField === 'email' ? 'Email' : 'Phone Number'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder={editField === 'email' ? 'Email' : 'Phone Number'}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType={editField === 'email' ? 'email-address' : 'phone-pad'}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveFieldEdit}
                disabled={editLoading}
              >
                {editLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SignOutModal
        visible={showSignOut}
        onCancel={() => setShowSignOut(false)}
        onConfirm={handleSignOut}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { paddingBottom: 40 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#B39DDB', justifyContent: 'center', alignItems: 'center' },
  nameText: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  roleText: { fontSize: 12, color: '#999', letterSpacing: 0.5 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 10, marginTop: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
  card: { backgroundColor: 'white', borderRadius: 12, paddingVertical: 5, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  iconBox: { width: 36, height: 36, backgroundColor: '#F5F7F9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  itemSub: { fontSize: 12, color: '#999', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 50 },
  signOutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#FFEBEE', paddingVertical: 15, borderRadius: 12, marginBottom: 20, marginTop: 10 },
  signOutText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 14 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  modalInput: { backgroundColor: '#F5F7F9', borderRadius: 10, padding: 15, marginBottom: 12, fontSize: 14, borderWidth: 1, borderColor: '#E0E0E0' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F5F5F5', marginRight: 8 },
  saveButton: { backgroundColor: COLORS.primary, marginLeft: 8 },
  cancelButtonText: { color: '#666', fontWeight: '600' },
  saveButtonText: { color: 'white', fontWeight: '600' }
});