import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import AdminBottomNavBar from '../../components/AdminBottomNavBar';
import { adminAPI } from '../../services/api';

export default function AdminOrganizationSettingsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        organizationName: '',
        contactEmail: '',
        phoneNumber: '',
        address: '',
        website: ''
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getSettings();
            const orgSettings = response.data?.organization || {};

            setSettings({
                organizationName: orgSettings.name || '',
                contactEmail: orgSettings.contact_email || '',
                phoneNumber: orgSettings.phone || '',
                address: orgSettings.address || '',
                website: orgSettings.website || ''
            });
        } catch (error) {
            console.error('Error loading settings:', error);
            Alert.alert('Error', 'Failed to load organization settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings.organizationName.trim()) {
            Alert.alert('Error', 'Organization name is required');
            return;
        }

        if (!settings.contactEmail.trim()) {
            Alert.alert('Error', 'Contact email is required');
            return;
        }

        setSaving(true);
        try {
            await adminAPI.updateOrganizationSettings({
                name: settings.organizationName,
                contact_email: settings.contactEmail,
                phone: settings.phoneNumber,
                address: settings.address,
                website: settings.website
            });

            Alert.alert('Success', 'Organization settings updated successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            const message = error.response?.data?.detail || 'Failed to update settings';
            Alert.alert('Error', message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading settings...</Text>
                </View>
                <AdminBottomNavBar navigation={navigation} activeTab="Settings" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Organization Settings</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>ORGANIZATION DETAILS</Text>

                    {/* Organization Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Organization Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter organization name"
                            placeholderTextColor="#999"
                            value={settings.organizationName}
                            onChangeText={(text) => setSettings({ ...settings, organizationName: text })}
                        />
                    </View>

                    {/* Contact Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contact Email *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="contact@example.com"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={settings.contactEmail}
                            onChangeText={(text) => setSettings({ ...settings, contactEmail: text })}
                        />
                    </View>

                    {/* Phone Number */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+1 (555) 123-4567"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            value={settings.phoneNumber}
                            onChangeText={(text) => setSettings({ ...settings, phoneNumber: text })}
                        />
                    </View>

                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter organization address"
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={3}
                            value={settings.address}
                            onChangeText={(text) => setSettings({ ...settings, address: text })}
                        />
                    </View>

                    {/* Website */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Website</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://example.com"
                            placeholderTextColor="#999"
                            keyboardType="url"
                            autoCapitalize="none"
                            value={settings.website}
                            onChangeText={(text) => setSettings({ ...settings, website: text })}
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, saving && styles.buttonDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle" size={20} color="white" />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>

            <AdminBottomNavBar navigation={navigation} activeTab="Settings" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFC' },
    contentContainer: { flex: 1, padding: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 15, color: '#666', fontSize: 14 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 15, marginTop: 10, letterSpacing: 0.5 },

    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: { backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, fontSize: 15, borderWidth: 1, borderColor: '#E0E0E0' },
    textArea: { height: 100, paddingTop: 15, textAlignVertical: 'top' },

    saveButton: { flexDirection: 'row', backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
    buttonDisabled: { opacity: 0.6 },
});
