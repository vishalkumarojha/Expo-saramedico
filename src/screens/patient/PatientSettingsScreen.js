import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image, Switch 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import SignOutModal from '../../components/SignOutModal';

export default function PatientSettingsScreen({ navigation }) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const handleSignOut = () => {
    setShowSignOut(false);
    // FIX: Reset to 'Auth' instead of 'Login'
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }], 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <View style={{width: 24}} /> 
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
           
           {/* Profile Header */}
           <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                 <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={40} color="#FFF" />
                 </View>
                 <View style={styles.editBadge}>
                    <Ionicons name="pencil" size={12} color="white" />
                 </View>
              </View>
              <Text style={styles.nameText}>Sara Shetty</Text>
              <Text style={styles.roleText}>Patient ID: 89120</Text>
           </View>

           {/* PERSONAL INFORMATION Section */}
           <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
           <View style={styles.card}>
              <SettingItem 
                icon="person-outline" 
                title="Personal Details" 
                sub="Name, DOB, Gender" 
                hasArrow 
              />
              <View style={styles.divider} />
              <SettingItem 
                icon="document-text-outline" 
                title="Insurance Info" 
                sub="Policy #9938221" 
                hasArrow 
              />
           </View>

           {/* SECURITY Section */}
           <Text style={styles.sectionLabel}>SECURITY</Text>
           <View style={styles.card}>
              <SettingItem 
                icon="lock-closed-outline" 
                title="Password" 
                sub="Last changed 3 months ago" 
                hasArrow 
              />
              <View style={styles.divider} />
              
              <View style={styles.row}>
                 <View style={styles.iconBox}><Ionicons name="shield-checkmark-outline" size={20} color="#555" /></View>
                 <View style={{flex: 1}}>
                    <Text style={styles.itemTitle}>Two-Factor Auth</Text>
                    <Text style={styles.itemSub}>Enabled (SMS)</Text>
                 </View>
                 <Switch 
                   value={is2FAEnabled} 
                   onValueChange={setIs2FAEnabled}
                   trackColor={{ false: "#DDD", true: COLORS.primary }}
                   thumbColor="white"
                 />
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                 <View style={styles.iconBox}><Ionicons name="happy-outline" size={20} color="#555" /></View>
                 <View style={{flex: 1}}>
                    <Text style={styles.itemTitle}>Face ID</Text>
                    <Text style={styles.itemSub}>Use FaceID to sign in</Text>
                 </View>
                 <Switch 
                   value={isFaceIDEnabled} 
                   onValueChange={setIsFaceIDEnabled}
                   trackColor={{ false: "#DDD", true: COLORS.primary }}
                   thumbColor="white"
                 />
              </View>
           </View>

           {/* CONTACT INFORMATION Section */}
           <Text style={styles.sectionLabel}>CONTACT</Text>
           <View style={styles.card}>
              <SettingItem 
                icon="mail-outline" 
                title="Email" 
                sub="sara.shetty@email.com" 
                hasArrow 
              />
              <View style={styles.divider} />
              <SettingItem 
                icon="call-outline" 
                title="Phone" 
                sub="+1 (555) 987-6543" 
                hasArrow 
              />
           </View>

           {/* Sign Out Button */}
           <TouchableOpacity style={styles.signOutBtn} onPress={() => setShowSignOut(true)}>
               <Ionicons name="log-out-outline" size={20} color="#D32F2F" style={{marginRight: 8}} />
               <Text style={styles.signOutText}>Sign Out</Text>
           </TouchableOpacity>

        </ScrollView>
      </View>

      <SignOutModal 
        visible={showSignOut} 
        onCancel={() => setShowSignOut(false)}
        onConfirm={handleSignOut}
      />
    </SafeAreaView>
  );
}

const SettingItem = ({ icon, title, sub, hasArrow }) => (
  <TouchableOpacity style={styles.row}>
     <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#555" />
     </View>
     <View style={{flex: 1}}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSub}>{sub}</Text>
     </View>
     {hasArrow && <Ionicons name="chevron-forward" size={18} color="#CCC" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { paddingBottom: 40 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#B39DDB', justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
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
  signOutText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 14 }
});