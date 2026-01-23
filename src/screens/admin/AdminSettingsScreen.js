import React from 'react';
import { 
  View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import AdminBottomNavBar from '../../components/AdminBottomNavBar';

export default function AdminSettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={{width: 24}} /> 
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="camera-outline" size={30} color="#999" />
                    </View>
                    <View style={styles.editBadge}>
                        <Ionicons name="pencil" size={12} color="white" />
                    </View>
                </View>
                <Text style={styles.userName}>Sara Shetty</Text>
                <Text style={styles.userMeta}>35y Female - MRN 89120</Text>
            </View>

            {/* EMR & EHR Connections */}
            <Text style={styles.sectionHeader}>EMR & EHR Connections</Text>
            <View style={styles.card}>
                {/* Connection 1 */}
                <View style={styles.connectionRow}>
                    <View style={styles.lockIconBox}>
                        <Ionicons name="lock-closed" size={18} color="#333" />
                    </View>
                    <View>
                        <Text style={styles.connTitle}>EPIC Systems</Text>
                        <Text style={styles.connSub}>Last Sync - 2 mins ago • FHIR R4</Text>
                    </View>
                </View>
                
                <View style={styles.divider} />

                {/* Connection 2 */}
                <View style={styles.connectionRow}>
                    <View style={styles.lockIconBox}>
                        <Ionicons name="lock-closed" size={18} color="#333" />
                    </View>
                    <View>
                        <Text style={styles.connTitle}>Oracle Cerner</Text>
                        <Text style={styles.connSub}>HL7 v2.x Interface</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Add Button */}
                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add-circle" size={18} color="#666" style={{marginRight: 8}} />
                    <Text style={styles.addBtnText}>Add New EMR Connection</Text>
                </TouchableOpacity>
            </View>

            {/* API & Webhooks */}
            <Text style={styles.sectionHeader}>API & Webhooks</Text>
            <View style={styles.card}>
                <Text style={styles.label}>API Key Name</Text>
                <TextInput placeholder="Production Server 01" style={styles.input} />

                <Text style={styles.label}>Scope</Text>
                <TextInput placeholder="Read/Write (Full Access)" style={styles.input} />
                
                <Text style={styles.label}>Webhook URL</Text>
                <TextInput placeholder="https://api.hospital.org/v1/hooks" style={styles.input} />
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

            <View style={{height: 40}} />
        </ScrollView>
      </View>
      
      {/* Admin Bottom Bar - Settings Tab Active */}
      <AdminBottomNavBar navigation={navigation} activeTab="Settings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  contentContainer: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  profileSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { width: 90, height: 90, marginBottom: 15, position: 'relative' },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  userMeta: { fontSize: 13, color: '#999', marginTop: 4 },

  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
  card: { backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#EEE', padding: 15, marginBottom: 20 },
  
  connectionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  lockIconBox: { width: 36, height: 36, backgroundColor: '#E3F2FD', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  connTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  connSub: { fontSize: 11, color: '#666', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  
  addBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, marginTop: 5 },
  addBtnText: { color: '#666', fontWeight: '500' },

  label: { fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#FAFAFA', borderRadius: 8, borderWidth: 1, borderColor: '#EEE', paddingHorizontal: 12, height: 45 },

  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  cancelText: { fontWeight: 'bold', color: '#333', fontSize: 16, marginLeft: 20 },
  saveBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  saveText: { color: 'white', fontWeight: 'bold' }
});