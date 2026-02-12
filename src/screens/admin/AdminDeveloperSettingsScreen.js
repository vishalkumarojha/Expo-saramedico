import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Switch,
    Alert,
    ActivityIndicator,
    Clipboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import AdminBottomNavBar from '../../components/AdminBottomNavBar';
import { adminAPI } from '../../services/api';

export default function AdminDeveloperSettingsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        apiKey: '',
        webhookUrl: '',
        rateLimitPerMinute: '60',
        debugMode: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getSettings();
            const devSettings = response.data?.developer || {};

            setSettings({
                apiKey: devSettings.api_key || '',
                webhookUrl: devSettings.webhook_url || '',
                rateLimitPerMinute: String(devSettings.rate_limit || 60),
                debugMode: devSettings.debug_mode || false
            });
        } catch (error) {
            console.error('Error loading settings:', error);
            Alert.alert('Error', 'Failed to load developer settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const rateLimit = parseInt(settings.rateLimitPerMinute);
        if (isNaN(rateLimit) || rateLimit < 1 || rateLimit > 1000) {
            Alert.alert('Error', 'Rate limit must be between 1 and 1000');
            return;
        }

        setSaving(true);
        try {
            await adminAPI.updateDeveloperSettings({
                webhook_url: settings.webhookUrl,
                rate_limit: rateLimit,
                debug_mode: settings.debugMode
            });

            Alert.alert('Success', 'Developer settings updated successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            const message = error.response?.data?.detail || 'Failed to update settings';
            Alert.alert('Error', message);
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = (text, label) => {
        Clipboard.setString(text);
        Alert.alert('Copied', `${label} copied to clipboard`);
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
                    <Text style={styles.headerTitle}>Developer Settings</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* API Key Section */}
                    <Text style={styles.sectionTitle}>API CREDENTIALS</Text>

                    <View style={styles.card}>
                        <View style={styles.apiKeyRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>API Key</Text>
                                <Text style={styles.apiKeyText} numberOfLines={1}>
                                    {settings.apiKey || 'Not generated'}
                                </Text>
                            </View>
                            {settings.apiKey && (
                                <TouchableOpacity
                                    style={styles.copyButton}
                                    onPress={() => copyToClipboard(settings.apiKey, 'API Key')}
                                >
                                    <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.warningBox}>
                            <Ionicons name="warning" size={16} color="#F59E0B" />
                            <Text style={styles.warningText}>
                                Keep your API key secure. Do not share it publicly.
                            </Text>
                        </View>
                    </View>

                    {/* Webhook Configuration */}
                    <Text style={styles.sectionTitle}>WEBHOOK CONFIGURATION</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Webhook URL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://your-server.com/webhook"
                            placeholderTextColor="#999"
                            keyboardType="url"
                            autoCapitalize="none"
                            value={settings.webhookUrl}
                            onChangeText={(text) => setSettings({ ...settings, webhookUrl: text })}
                        />
                        <Text style={styles.hint}>
                            Receive real-time notifications for events
                        </Text>
                    </View>

                    {/* Rate Limiting */}
                    <Text style={styles.sectionTitle}>RATE LIMITING</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Requests Per Minute</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="60"
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            value={settings.rateLimitPerMinute}
                            onChangeText={(text) => setSettings({ ...settings, rateLimitPerMinute: text })}
                        />
                        <Text style={styles.hint}>
                            Maximum API requests allowed per minute (1-1000)
                        </Text>
                    </View>

                    {/* Debug Mode */}
                    <Text style={styles.sectionTitle}>DEBUGGING</Text>

                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.settingTitle}>Debug Mode</Text>
                                <Text style={styles.settingSubtitle}>
                                    Enable detailed logging for API requests
                                </Text>
                            </View>
                            <Switch
                                value={settings.debugMode}
                                onValueChange={(value) => setSettings({ ...settings, debugMode: value })}
                                trackColor={{ false: "#E0E0E0", true: COLORS.primary }}
                            />
                        </View>

                        {settings.debugMode && (
                            <View style={[styles.warningBox, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="information-circle" size={16} color="#F59E0B" />
                                <Text style={styles.warningText}>
                                    Debug mode may impact performance. Use only for troubleshooting.
                                </Text>
                            </View>
                        )}
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

    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 15, marginTop: 20, letterSpacing: 0.5 },

    card: { backgroundColor: 'white', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 15 },

    apiKeyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    label: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 5 },
    apiKeyText: { fontSize: 14, fontFamily: 'monospace', color: '#333', backgroundColor: '#F5F5F5', padding: 8, borderRadius: 6 },
    copyButton: { padding: 10, backgroundColor: '#E3F2FD', borderRadius: 8, marginLeft: 10 },

    warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8, marginTop: 10 },
    warningText: { fontSize: 12, color: '#92400E', marginLeft: 8, flex: 1 },

    inputGroup: { marginBottom: 20 },
    input: { backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50, fontSize: 15, borderWidth: 1, borderColor: '#E0E0E0' },
    hint: { fontSize: 12, color: '#999', marginTop: 5 },

    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    settingTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
    settingSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },

    saveButton: { flexDirection: 'row', backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
    buttonDisabled: { opacity: 0.6 },
});
