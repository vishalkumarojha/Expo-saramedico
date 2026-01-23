import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StyleSheet, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomInput, CustomButton } from '../../components/CustomComponents';

export default function SignUpScreen({ navigation }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header: Back Button & Progress Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          {/* Progress Bar from Screenshot */}
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        <Text style={styles.screenTitle}>Saramedico</Text>

        {/* Tabs: Login / Sign Up */}
        <View style={styles.tabContainer}>
           <TouchableOpacity 
             style={styles.inactiveTab} 
             onPress={() => navigation.navigate('Login')}
           >
             <Text style={styles.inactiveTabText}>Login</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.activeTab}>
             <Text style={styles.activeTabText}>Sign Up</Text>
           </TouchableOpacity>
        </View>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <CustomInput placeholder="Your Name" icon="person-outline"/>
        
        {/* Work Email */}
        <Text style={styles.label}>Work Email</Text>
        <CustomInput placeholder="dr.name@hospital.org" icon="mail-outline"/>

        {/* Phone Number Input (Custom Layout) */}
        <Text style={styles.label}>Phone</Text>
        <View style={styles.phoneRow}>
           <View style={styles.countryCodeContainer}>
             {/* Placeholder for US Flag */}
             <Text style={{fontSize: 18, marginRight: 5}}>🇺🇸</Text>
             <Text style={styles.countryCodeText}>+1</Text>
             <Ionicons name="chevron-down" size={12} color="#666" style={{marginLeft: 5}}/>
           </View>
           <View style={{width: 10}} />
           <View style={styles.phoneInputContainer}>
              <CustomInput placeholder="202-555-0111" icon="call-outline"/>
           </View>
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <CustomInput placeholder="••••••••••••" isPassword />
        
        {/* Password Strength Bar */}
        <View style={styles.strengthContainer}>
          <View style={[styles.strengthBar, { backgroundColor: COLORS.success }]} />
          <View style={[styles.strengthBar, { backgroundColor: COLORS.success }]} />
          <View style={[styles.strengthBar, { backgroundColor: '#E0E0E0' }]} />
          <View style={[styles.strengthBar, { backgroundColor: '#E0E0E0' }]} />
        </View>
        <Text style={styles.helperText}>Must contain a mix of letters, numbers & symbols.</Text>
        
        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <CustomInput placeholder="Securities password" isPassword />

        {/* Terms Checkbox */}
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setIsChecked(!isChecked)}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.linkText}>Terms & Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <CustomButton title="Sign Up" onPress={() => navigation.navigate('OTP')} />

        {/* Social Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={20} color="black" />
            <Text style={styles.socialBtnText}>Continue with Apple ID</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={20} color="black" />
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20, paddingBottom: 40 },
  
  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  progressBarBg: { height: 6, width: 100, backgroundColor: '#E0E0E0', borderRadius: 3 },
  progressBarFill: { height: '100%', width: '30%', backgroundColor: COLORS.primary, borderRadius: 3 },
  
  screenTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },

  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 25, padding: 4, marginBottom: 20 },
  activeTab: { flex: 1, backgroundColor: COLORS.white, borderRadius: 20, paddingVertical: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  inactiveTab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeTabText: { fontWeight: 'bold', color: '#333' },
  inactiveTabText: { color: '#666' },

  // Forms
  label: { fontSize: 14, color: '#333', marginBottom: 8, marginTop: 10, fontWeight: '500' },
  
  // Phone Row
  phoneRow: { flexDirection: 'row' },
  countryCodeContainer: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.inputBg, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, paddingHorizontal: 10, height: 50, width: 90
  },
  countryCodeText: { fontWeight: '600', color: '#333' },
  phoneInputContainer: { flex: 1, marginTop: -15 }, // Negative margin to align with CustomInput's internal margin

  // Password Strength
  strengthContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -5, marginBottom: 5 },
  strengthBar: { height: 4, flex: 1, borderRadius: 2, marginHorizontal: 2 },
  helperText: { fontSize: 11, color: '#666', marginBottom: 10 },

  // Checkbox
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkboxText: { fontSize: 12, color: '#666', flex: 1 },
  linkText: { color: COLORS.primary, fontWeight: '600' },

  // Footer Socials
  footer: { marginTop: 20 },
  socialButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 50, borderRadius: 30, borderWidth: 1, borderColor: '#E0E0E0', 
    backgroundColor: 'white', marginBottom: 12 
  },
  socialBtnText: { marginLeft: 10, fontSize: 14, fontWeight: '600', color: '#333' }
});