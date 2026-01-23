import React, { useState } from 'react';
import { 
  View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import AdminBottomNavBar from '../../components/AdminBottomNavBar';

export default function AdminInviteMemberScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState('Member'); // Default selection

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Invite Members</Text>
            <View style={{width: 24}} /> 
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
            {/* Form Fields */}
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput placeholder="Your name" style={styles.input} />

            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput placeholder="yourmail@gmail.com" style={styles.input} />

            {/* User Role Selection */}
            <Text style={styles.sectionHeader}>User Role</Text>
            <View style={styles.roleContainer}>
                {/* Administrator Card */}
                <RoleCard 
                   title="Administrator" 
                   sub="Full Platform Access" 
                   icon="lock-closed" 
                   isActive={selectedRole === 'Administrator'} 
                   onPress={() => setSelectedRole('Administrator')}
                   features={[
                       {text: 'Manage team & billing', allowed: true},
                       {text: 'Full patient record access', allowed: true},
                       {text: 'Configure AI settings', allowed: true},
                   ]}
                />
                
                {/* Member Card */}
                <RoleCard 
                   title="Member" 
                   sub="Clinician & Staff" 
                   icon="lock-closed" 
                   isActive={selectedRole === 'Member'} 
                   onPress={() => setSelectedRole('Member')}
                   features={[
                       {text: 'View assigned patients', allowed: true},
                       {text: 'Use AI diagnostic tool', allowed: true},
                       {text: 'No billing access', allowed: false},
                   ]}
                />
            </View>

            {/* Security Notice */}
            <View style={styles.securityNotice}>
                <Ionicons name="information-circle" size={24} color="#2196F3" style={{marginRight: 10}} />
                <View style={{flex: 1}}>
                    <Text style={styles.noticeTitle}>Security Notice</Text>
                    <Text style={styles.noticeText}>
                        The user will receive an email to join the Team. The invitation link expired in 48hours. They will be required to set up Two-Factor Authentication (2FA) upon their first login.
                    </Text>
                </View>
            </View>

            {/* Footer Buttons */}
            <View style={styles.footerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn}>
                    <Text style={styles.saveText}>Save Invite</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
      </View>
      <AdminBottomNavBar navigation={navigation} activeTab="Records" />
    </SafeAreaView>
  );
}

// Helper Component for Role Cards
const RoleCard = ({ title, sub, icon, isActive, onPress, features }) => (
    <TouchableOpacity 
       style={[styles.roleCard, isActive && styles.roleCardActive]} 
       onPress={onPress}
       activeOpacity={0.8}
    >
        <View style={styles.roleHeader}>
            <View style={styles.iconBox}>
               <Ionicons name={icon} size={16} color="#333" />
            </View>
            <View>
                <Text style={styles.roleTitle}>{title}</Text>
                <Text style={styles.roleSub}>{sub}</Text>
            </View>
        </View>

        <View style={styles.divider} />

        {features.map((f, i) => (
            <View key={i} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                <Ionicons 
                  name={f.allowed ? "checkmark" : "close"} 
                  size={14} 
                  color={f.allowed ? COLORS.success : '#999'} 
                  style={{marginRight: 6}}
                />
                <Text style={{fontSize: 11, color: '#666'}}>{f.text}</Text>
            </View>
        ))}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  contentContainer: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  label: { fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: '#EEE', paddingHorizontal: 15, height: 50, marginBottom: 20 },

  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  
  roleCard: { width: '48%', backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EEE' },
  roleCardActive: { borderColor: COLORS.primary, borderWidth: 1.5 },
  
  roleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconBox: { width: 30, height: 30, backgroundColor: '#E3F2FD', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  roleTitle: { fontSize: 13, fontWeight: 'bold' },
  roleSub: { fontSize: 10, color: '#666' },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 10 },

  securityNotice: { flexDirection: 'row', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 12, marginBottom: 30 },
  noticeTitle: { fontWeight: 'bold', fontSize: 13, marginBottom: 4, color: '#333' },
  noticeText: { fontSize: 12, color: '#555', lineHeight: 18 },

  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 40 },
  cancelText: { fontWeight: 'bold', color: '#333', fontSize: 16, marginLeft: 20 },
  saveBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  saveText: { color: 'white', fontWeight: 'bold' }
});