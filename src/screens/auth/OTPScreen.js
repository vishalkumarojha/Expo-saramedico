import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

export default function OTPScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header: Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.centerContent}>
          
          {/* Lock Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={30} color="#333" />
            <View style={styles.badgeContainer}>
               <Ionicons name="person" size={10} color="white" />
            </View>
          </View>

          {/* Text */}
          <Text style={styles.heading}>Check your Inbox</Text>
          <Text style={styles.subText}>
            We sent a code to <Text style={styles.boldText}>+1(222) xxx-xxx89</Text>.
          </Text>
          <Text style={styles.subText}>
            Enter the code below to reset the password.
          </Text>

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
             <View style={[styles.otpBox, styles.otpBoxActive]}>
               <Text style={styles.cursor}>|</Text> 
             </View>
             {[2,3,4,5,6].map((_, i) => (
               <View key={i} style={styles.otpBox} />
             ))}
          </View>

          {/* --- FIX: Wrapped Button to force 100% Width --- */}
          <View style={styles.verifyBtnWrapper}>
            <CustomButton 
              title="Verify" 
              onPress={() => navigation.navigate('ResetPassword')} 
            />
          </View>
          
          {/* Resend Code */}
          <TouchableOpacity style={styles.resendContainer}>
            <Ionicons name="refresh" size={16} color="#333" style={{marginRight: 6}} />
            <Text style={styles.resendText}>Resend code in 00:50</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4FF' }, 
  content: { padding: 25, flex: 1 },
  
  backButton: { marginTop: 10, alignSelf: 'flex-start' },
  
  centerContent: { alignItems: 'center', marginTop: 50, width: '100%' },
  
  iconCircle: { 
    width: 80, height: 80, borderRadius: 40, 
    backgroundColor: '#D9D9D9', 
    justifyContent: 'center', alignItems: 'center', 
    marginBottom: 25,
    position: 'relative'
  },
  badgeContainer: {
    position: 'absolute', bottom: 22, right: 22,
    backgroundColor: '#666', borderRadius: 10, width: 16, height: 16,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D9D9D9'
  },

  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#1A1A1A' },
  subText: { color: '#555', textAlign: 'center', fontSize: 14, marginBottom: 4, lineHeight: 20 },
  boldText: { fontWeight: 'bold', color: '#1A1A1A' },
  
  otpContainer: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    width: '100%', marginTop: 30, marginBottom: 30 
  },
  otpBox: { 
    width: 45, height: 55, 
    borderWidth: 1, borderColor: '#E0E0E0', 
    borderRadius: 10, backgroundColor: 'white',
    justifyContent: 'center', alignItems: 'center' 
  },
  otpBoxActive: { 
    borderColor: COLORS.primary, borderWidth: 2,
    shadowColor: COLORS.primary, shadowOpacity: 0.2, shadowRadius: 4
  },
  cursor: { fontSize: 24, color: COLORS.primary, fontWeight: '300' },

  // --- FIX: Ensure button wrapper is full width ---
  verifyBtnWrapper: {
    width: '100%',
  },

  resendContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 25 },
  resendText: { color: '#333', fontSize: 14, fontWeight: '500' },
});