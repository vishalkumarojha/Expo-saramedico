// src/components/CustomComponents.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export const CustomInput = ({ placeholder, isPassword, icon, value, onChangeText }) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={isPassword && !showPass}
        placeholderTextColor={COLORS.placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons name={showPass ? "eye-off" : "eye"} size={20} color={COLORS.placeholder} />
        </TouchableOpacity>
      )}
      {icon && <Ionicons name={icon} size={20} color={COLORS.placeholder} style={{ marginLeft: 10 }} />}
    </View>
  );
};

export const CustomButton = ({ title, onPress, type = 'PRIMARY' }) => {
  return (
    <TouchableOpacity
      style={[styles.button, type === 'SECONDARY' ? styles.btnSecondary : styles.btnPrimary]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.btnText, type === 'SECONDARY' ? styles.btnTextSec : styles.btnTextPri]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 10, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: COLORS.border, marginBottom: 15 },
  input: { flex: 1, height: '100%', color: COLORS.text },
  button: { borderRadius: 30, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnSecondary: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#DDD' },
  btnText: { fontSize: 16, fontWeight: '600' },
  btnTextPri: { color: COLORS.white },
  btnTextSec: { color: '#333' },
});