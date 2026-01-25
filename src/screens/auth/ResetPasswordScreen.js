import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomInput, CustomButton } from '../../components/CustomComponents';

export default function ResetPasswordScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.headerCenter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="medkit" size={35} color={COLORS.primary} />
            <Text style={styles.headerTitle}>Saramedico</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          {/* New Password Input */}
          <Text style={styles.label}>New Password</Text>
          <CustomInput placeholder="••••••••••••" isPassword icon="key-outline" />

          {/* Strength Bars (Matching screenshot: 2 green, 2 gray) */}
          <View style={styles.strengthContainer}>
            <View style={[styles.strengthBar, { backgroundColor: COLORS.success }]} />
            <View style={[styles.strengthBar, { backgroundColor: COLORS.success }]} />
            <View style={[styles.strengthBar, { backgroundColor: '#BDBDBD' }]} />
            <View style={[styles.strengthBar, { backgroundColor: '#BDBDBD' }]} />
          </View>

          <Text style={styles.helperTitle}>Use 8+ chars with a mix of letters, numbers & symbols.</Text>

          {/* Requirements List (All Green as per screenshot) */}
          <View style={styles.reqList}>
            <ReqItem text="At least 8 characters" valid={true} />
            <ReqItem text="One Uppercase letter" valid={true} />
            <ReqItem text="One lowercase letter" valid={true} />
            <ReqItem text="One Number" valid={true} />
            <ReqItem text="One special character (!@#$%)" valid={true} />
          </View>

          {/* Confirm Password Input */}
          <Text style={styles.label}>Confirm Password</Text>
          {/* Using a custom icon 'checkmark-circle' inside the input */}
          <View style={styles.confirmInputWrapper}>
            <CustomInput placeholder="Re-enter password" />
            <View style={styles.confirmIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#999" />
            </View>
          </View>

          {/* Confirm Button */}
          <View style={{ marginTop: 30 }}>
            <CustomButton title="Confirm" onPress={() => navigation.navigate('Login')} />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

// Helper Component for the Checklist
const ReqItem = ({ text, valid }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
    <Ionicons name="checkmark" size={14} color={valid ? COLORS.success : '#ccc'} />
    <Text style={[styles.reqText, valid && { color: COLORS.success }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  content: { padding: 25, flex: 1 },

  headerCenter: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#00A3FF', marginLeft: 10 },

  label: { fontSize: 14, color: '#333', marginBottom: 8, marginTop: 10, fontWeight: '500' },

  // Strength Bars
  strengthContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 10 },
  strengthBar: { height: 4, flex: 1, borderRadius: 2, marginHorizontal: 2 },

  helperTitle: { fontSize: 12, color: '#555', marginBottom: 10 },

  // Checklist
  reqList: { marginBottom: 15 },
  reqText: { fontSize: 12, color: '#999', marginLeft: 8 },

  // Confirm Input Overlay
  confirmInputWrapper: { position: 'relative' },
  confirmIcon: { position: 'absolute', right: 15, top: 15 }
});