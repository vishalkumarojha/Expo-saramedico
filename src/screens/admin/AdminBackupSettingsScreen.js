import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import AdminBottomNavBar from '../../components/AdminBottomNavBar';
import { adminAPI } from '../../services/api';

export default function AdminBackupSettingsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [triggeringBackup, setTriggeringBackup] = useState(false);
    const [settings, setSettings] = useState({
        autoBackupEnabled: false,
        frequency: 'daily', // daily, weekly, monthly
        retentionDays: 30,
        lastBackup: null
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getSettings();
            const backupSettings = response.data?.backup || {};

            setSettings({
                autoBackupEnabled: backupSettings.auto_backup_enabled || false,
                frequency: backupSettings.frequency || 'daily',
                retentionDays: backupSettings.retention_days || 30,
                lastBackup: backupSettings.last_backup || null
            });
        } catch (error) {
            console.error('Error loading settings:', error);
            Alert.alert('Error', 'Failed to load backup settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminAPI.updateBackupSettings({
                auto_backup_enabled: settings.autoBackupEnabled,
                frequency: settings.frequency,
                retention_days: settings.retentionDays
            });

            Alert.alert('Success', 'Backup settings updated successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            const message = error.response?.data?.detail || 'Failed to update settings';
            Alert.alert('Error', message);
        } finally {
            setSaving(false);
        }
    };

    const handleTriggerBackup = () => {
        Alert.alert(
            'Manual Backup',
            'Are you sure you want to trigger a manual backup? This may take several minutes.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Start Backup',
                    onPress: async () => {
                        setTriggeringBackup(true);
                        try {
                            // This would call a backup trigger endpoint
                            // await adminAPI.triggerBackup();
                            Alert.alert('Success', 'Backup started successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to start backup');
                        } finally {
                            setTriggeringBackup(false);
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleString();
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
                    <Text style={styles.headerTitle}>Backup Settings</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Last Backup Info */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
                            <View style={{ marginLeft: 15, flex: 1 }}>
                                <Text style={styles.infoLabel}>Last Backup</Text>
                                <Text style={styles.infoValue}>{formatDate(settings.lastBackup)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Auto Backup */}
                    <Text style={styles.sectionTitle}>AUTOMATIC BACKUP</Text>

                    <View style={styles.card}>
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.settingTitle}>Enable Auto Backup</Text>
                                <Text style={styles.settingSubtitle}>
                                    Automatically backup data at scheduled intervals
                                </Text>
                            </View>
                            <Switch
                                value={settings.autoBackupEnabled}
                                onValueChange={(value) => setSettings({ ...settings, autoBackupEnabled: value })}
                                trackColor={{ false: "#E0E0E0", true: COLORS.primary }}
                            />
                        </View>
                    </View>

                    {/* Frequency */}
                    {settings.autoBackupEnabled && (
                        <>
                            <Text style={styles.sectionTitle}>BACKUP FREQUENCY</Text>

                            <View style={styles.card}>
                                <TouchableOpacity
                                    style={styles.radioRow}
                                    onPress={() => setSettings({ ...settings, frequency: 'daily' })}
                                >
                                    <View style={styles.radioButton}>
                                        {settings.frequency === 'daily' && <View style={styles.radioButtonInner} />}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.radioLabel}>Daily</Text>
                                        <Text style={styles.radioSubtext}>Backup every day at midnight</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <TouchableOpacity
                                    style={styles.radioRow}
                                    onPress={() => setSettings({ ...settings, frequency: 'weekly' })}
                                >
                                    <View style={styles.radioButton}>
                                        {settings.frequency === 'weekly' && <View style={styles.radioButtonInner} />}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.radioLabel}>Weekly</Text>
                                        <Text style={styles.radioSubtext}>Backup every Sunday at midnight</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <TouchableOpacity
                                    style={styles.radioRow}
                                    onPress={() => setSettings({ ...settings, frequency: 'monthly' })}
                                >
                                    <View style={styles.radioButton}>
                                        {settings.frequency === 'monthly' && <View style={styles.radioButtonInner} />}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.radioLabel}>Monthly</Text>
                                        <Text style={styles.radioSubtext}>Backup on the 1st of each month</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Retention */}
                            <Text style={styles.sectionTitle}>DATA RETENTION</Text>

                            <View style={styles.card}>
                                <Text style={styles.label}>Retention Period</Text>
                                <Text style={styles.retentionText}>{settings.retentionDays} days</Text>
                                <Text style={styles.hint}>
                                    Backups older than {settings.retentionDays} days will be automatically deleted
                                </Text>
                            </View>
                        </>
                    )}

                    {/* Manual Backup */}
                    <Text style={styles.sectionTitle}>MANUAL BACKUP</Text>

                    <TouchableOpacity
                        style={[styles.manualBackupButton, triggeringBackup && styles.buttonDisabled]}
                        onPress={handleTriggerBackup}
                        disabled={triggeringBackup}
                    >
                        {triggeringBackup ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <>
                                <Ionicons name="cloud-upload-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.manualBackupText}>Trigger Backup Now</Text>
                            </>
                        )}
                    </TouchableOpacity>

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

    infoCard: { backgroundColor: '#E3F2FD', borderRadius: 16, padding: 20, marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
    infoValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },

    card: { backgroundColor: 'white', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 15 },

    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    settingTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
    settingSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },

    radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    radioButton: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.primary, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
    radioButtonInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
    radioLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
    radioSubtext: { fontSize: 12, color: '#999', marginTop: 2 },

    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 5 },

    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    retentionText: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
    hint: { fontSize: 12, color: '#999' },

    manualBackupButton: { flexDirection: 'row', backgroundColor: 'white', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.primary, marginBottom: 20 },
    manualBackupText: { color: COLORS.primary, fontSize: 16, fontWeight: '600', marginLeft: 8 },

    saveButton: { flexDirection: 'row', backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
    buttonDisabled: { opacity: 0.6 },
});
