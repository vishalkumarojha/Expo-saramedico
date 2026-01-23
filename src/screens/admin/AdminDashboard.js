import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  Switch 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import AdminBottomNavBar from '../../components/AdminBottomNavBar';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminDashboard({ navigation }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar Component */}
      <AdminSidebar 
        isVisible={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
        navigation={navigation} 
      />

      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
               <Ionicons name="menu-outline" size={28} color="#333" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
               <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="#333" /></TouchableOpacity>
               <Image source={{uri: 'https://i.pravatar.cc/100?img=8'}} style={styles.avatar} />
            </View>
          </View>

          <Text style={styles.pageTitle}>Dashboard Overview</Text>
          <Text style={styles.dateText}>Today is Tuesday, October 24, 2023</Text>

          {/* Search Bar -> Navigates to AdminSearchScreen */}
          <TouchableOpacity 
             style={styles.searchContainer} 
             activeOpacity={0.9}
             onPress={() => navigation.navigate('AdminSearchScreen')}
          >
            <Ionicons name="search-outline" size={20} color="#999" />
            <View pointerEvents="none" style={{flex: 1}}>
                <TextInput 
                  placeholder="Search visits, reports, notes..." 
                  placeholderTextColor="#999" 
                  style={styles.searchInput}
                  editable={false} // Disabled editing to force navigation
                />
            </View>
          </TouchableOpacity>

          {/* Alerts Section */}
          <Text style={styles.sectionTitle}>Alerts</Text>
          <View style={styles.alertCard}>
             <Text style={styles.alertTitle}>Consultation summary ready</Text>
             <Text style={styles.alertBody}>Patient Daniel Koshaer - AI Analysis complete. Key...</Text>
          </View>

          {/* Recent Activity */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {/* "View All" -> Navigates to Records (Account Management) */}
            <TouchableOpacity onPress={() => navigation.navigate('AdminAccountManagementScreen')}>
               <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
             <ActivityItem name="Dr. Arvind Shukla" time="20m ago" desc="Viewed MRI Analysis" color="#90CAF9" />
             <ActivityItem name="Dr. Govind Sharma" time="2h ago" desc="Viewed Lab Results" color="#9FA8DA" />
             <ActivityItem name="Dr. Avantika Gupta" time="6h ago" desc="Created a session" color="#B39DDB" />
          </View>

          {/* Security Section */}
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
             <View style={styles.securityRow}>
                <View>
                   <Text style={styles.secTitle}>Password</Text>
                   <Text style={styles.secSub}>Last changed 3 months ago</Text>
                </View>
                <TouchableOpacity style={styles.changeBtn}>
                   <Text style={styles.changeBtnText}>Change</Text>
                </TouchableOpacity>
             </View>
             
             <View style={styles.divider} />

             <View style={styles.securityRow}>
                <View>
                   <Text style={styles.secTitle}>Two-Factor Auth (2FA)</Text>
                   <Text style={[styles.secSub, {color: COLORS.success}]}>Enabled</Text>
                </View>
                <Switch 
                  value={is2FAEnabled} 
                  onValueChange={setIs2FAEnabled} 
                  trackColor={{ false: "#767577", true: COLORS.primary }}
                />
             </View>
          </View>

        </ScrollView>
      </View>

      <AdminBottomNavBar navigation={navigation} activeTab="Home" />
    </SafeAreaView>
  );
}

const ActivityItem = ({ name, time, desc, color }) => (
  <View style={styles.activityItem}>
     <View style={[styles.activityAvatar, {backgroundColor: color}]} />
     <View>
        <Text style={styles.actName}>{name}</Text>
        <Text style={styles.actDesc}><Ionicons name="time-outline" size={10} /> {time} • {desc}</Text>
     </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  contentContainer: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatar: { width: 35, height: 35, borderRadius: 17.5 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  dateText: { fontSize: 13, color: '#666', marginBottom: 20, marginTop: 5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE', marginBottom: 25 },
  searchInput: { flex: 1, marginLeft: 10, color: '#333' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  linkText: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  alertCard: { backgroundColor: '#FFF5F5', padding: 15, borderRadius: 12, marginBottom: 25 },
  alertTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  alertBody: { fontSize: 13, color: '#666' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 15, marginBottom: 25 },
  activityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  activityAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  actName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  actDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  securityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  secTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  secSub: { fontSize: 12, color: '#999', marginTop: 4 },
  changeBtn: { paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: '#DDD', borderRadius: 8 },
  changeBtnText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
});