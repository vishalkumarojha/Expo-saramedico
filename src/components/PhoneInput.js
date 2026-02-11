import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';
import { parsePhoneNumber, AsYouType } from 'libphonenumber-js';
import { COLORS } from '../constants/theme';

export default function PhoneInput({
    value,
    onChangeText,
    onChangeE164,
    error,
    style,
}) {
    const [countryCode, setCountryCode] = useState('IN'); // Default to India based on screenshot
    const [callingCode, setCallingCode] = useState('91');
    const [showPicker, setShowPicker] = useState(false);
    const [formattedValue, setFormattedValue] = useState('');

    // Initialize from value prop
    useEffect(() => {
        if (value && !formattedValue) {
            setFormattedValue(value);
        }
    }, [value, formattedValue]);

    const handleCountrySelect = (country) => {
        setCountryCode(country.cca2);
        setCallingCode(country.callingCode[0]);
        setShowPicker(false);
        // Reset the phone number when country changes
        setFormattedValue('');
        onChangeText('');
        if (onChangeE164) {
            onChangeE164('');
        }
    };

    const handlePhoneChange = (text) => {
        try {
            // Use AsYouType for auto-formatting
            const formatter = new AsYouType(countryCode);
            const formatted = formatter.input(text);

            setFormattedValue(formatted);
            onChangeText(formatted);

            // Try to parse and get E.164 format
            try {
                const phoneNumber = parsePhoneNumber(formatted, countryCode);
                if (phoneNumber && phoneNumber.isValid()) {
                    if (onChangeE164) {
                        onChangeE164(phoneNumber.format('E.164'));
                    }
                } else {
                    // Even if not fully valid, try to construct E.164 format
                    // This helps with partial numbers during typing
                    if (onChangeE164) {
                        // Send the formatted number with country code
                        const partialE164 = `+${callingCode}${text.replace(/\D/g, '')}`;
                        onChangeE164(partialE164);
                    }
                }
            } catch (parseError) {
                // Not yet a valid number, send partial E.164
                if (onChangeE164) {
                    const partialE164 = `+${callingCode}${text.replace(/\D/g, '')}`;
                    onChangeE164(partialE164);
                }
            }
        } catch (error) {
            // Fallback to plain text
            setFormattedValue(text);
            onChangeText(text);
            if (onChangeE164) {
                const partialE164 = `+${callingCode}${text.replace(/\D/g, '')}`;
                onChangeE164(partialE164);
            }
        }
    };

    const getPlaceholder = () => {
        const placeholders = {
            US: '(202) 555-0111',
            GB: '07400 123456',
            IN: '091234 56789',
            CA: '(204) 555-0111',
            AU: '0412 345 678',
            DE: '0151 23456789',
            FR: '06 12 34 56 78',
            JP: '090-1234-5678',
            CN: '138 0013 8000',
        };
        return placeholders[countryCode] || '123456789';
    };

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
                {/* Country Picker */}
                <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowPicker(true)}
                >
                    <CountryPicker
                        countryCode={countryCode}
                        withFilter
                        withFlag
                        withCallingCode
                        withEmoji
                        onSelect={handleCountrySelect}
                        visible={showPicker}
                        onClose={() => setShowPicker(false)}
                    />
                    <Text style={styles.callingCode}>+{callingCode}</Text>
                    <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>

                {/* Phone Input */}
                <TextInput
                    style={styles.input}
                    placeholder={getPlaceholder()}
                    placeholderTextColor="#999"
                    value={formattedValue}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    accessibilityLabel="Phone number input"
                    accessibilityHint="Enter your phone number"
                />

                {/* Icon */}
                <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
            </View>

            {/* Helper Text */}
            <Text style={styles.helperText}>
                Used only for verification and security.
            </Text>

            {/* Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
    },
    inputError: {
        borderColor: '#FF3B30',
        borderWidth: 2,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        borderRightWidth: 1,
        borderRightColor: '#E8E8E8',
        marginRight: 10,
        minWidth: 80,
    },
    callingCode: {
        fontSize: 16,
        color: '#333',
        marginLeft: 5,
        marginRight: 3,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 0,
    },
    icon: {
        marginLeft: 10,
    },
    helperText: {
        fontSize: 11,
        color: '#666',
        marginTop: 5,
        marginLeft: 5,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 5,
    },
    errorText: {
        fontSize: 12,
        color: '#FF3B30',
        marginLeft: 5,
    },
});
