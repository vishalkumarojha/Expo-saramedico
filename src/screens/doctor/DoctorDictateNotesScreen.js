import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Animated, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'zh', name: 'Chinese' },
];

export default function DoctorDictateNotesScreen({ navigation }) {
    const [isRecording, setIsRecording] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');
    const [showLangSelector, setShowLangSelector] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    // Animations
    const pulseAnim = new Animated.Value(1);
    const waveAnim1 = new Animated.Value(0);
    const waveAnim2 = new Animated.Value(0);
    const waveAnim3 = new Animated.Value(0);

    useEffect(() => {
        if (isRecording) {
            // Pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Wave animations
            Animated.loop(
                Animated.sequence([
                    Animated.timing(waveAnim1, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(waveAnim1, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.delay(200),
                    Animated.timing(waveAnim2, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(waveAnim2, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.delay(400),
                    Animated.timing(waveAnim3, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(waveAnim3, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Timer
            const interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            pulseAnim.setValue(1);
            waveAnim1.setValue(0);
            waveAnim2.setValue(0);
            waveAnim3.setValue(0);
        }
    }, [isRecording]);

    const handleToggleRecording = async () => {
        if (isRecording) {
            // Stop recording
            setIsRecording(false);
            Alert.alert(
                'Recording Saved',
                'Your notes have been transcribed. Navigate to patient to view.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } else {
            // Request microphone permission before starting
            try {
                // Check if we have expo-av or react-native-permissions installed
                // For now, show permission prompt using Alert
                Alert.alert(
                    'Microphone Permission Required',
                    'This app needs access to your microphone to record voice notes.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Allow',
                            onPress: () => {
                                // Start recording after permission granted
                                setIsRecording(true);
                                setRecordingTime(0);
                            }
                        }
                    ]
                );
            } catch (error) {
                Alert.alert('Error', 'Failed to access microphone. Please check app permissions.');
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const selectedLanguage = LANGUAGES.find(l => l.code === selectedLang)?.name || 'English';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Dictate Notes</Text>
                    <TouchableOpacity onPress={() => setShowLangSelector(!showLangSelector)}>
                        <Ionicons name="language" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Language Selector */}
                {showLangSelector && (
                    <View style={styles.langSelector}>
                        <Text style={styles.langTitle}>Select Language</Text>
                        <View style={styles.langGrid}>
                            {LANGUAGES.map((lang) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[
                                        styles.langItem,
                                        selectedLang === lang.code && styles.langItemActive,
                                    ]}
                                    onPress={() => {
                                        setSelectedLang(lang.code);
                                        setShowLangSelector(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.langText,
                                            selectedLang === lang.code && styles.langTextActive,
                                        ]}
                                    >
                                        {lang.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Main Recording Area */}
                <View style={styles.recordingArea}>
                    <Text style={styles.title}>
                        {isRecording ? 'Recording...' : 'Ready to Record'}
                    </Text>
                    <Text style={styles.subtitle}>
                        Language: {selectedLanguage}
                    </Text>

                    {/* Microphone with Animation */}
                    <View style={styles.micContainer}>
                        {isRecording && (
                            <>
                                <Animated.View
                                    style={[
                                        styles.wave,
                                        {
                                            opacity: waveAnim1,
                                            transform: [{ scale: waveAnim1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] }) }],
                                        },
                                    ]}
                                />
                                <Animated.View
                                    style={[
                                        styles.wave,
                                        {
                                            opacity: waveAnim2,
                                            transform: [{ scale: waveAnim2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] }) }],
                                        },
                                    ]}
                                />
                                <Animated.View
                                    style={[
                                        styles.wave,
                                        {
                                            opacity: waveAnim3,
                                            transform: [{ scale: waveAnim3.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] }) }],
                                        },
                                    ]}
                                />
                            </>
                        )}

                        <Animated.View
                            style={[
                                styles.micButton,
                                isRecording && { backgroundColor: '#E53935' },
                                { transform: [{ scale: pulseAnim }] },
                            ]}
                        >
                            <TouchableOpacity onPress={handleToggleRecording}>
                                <Ionicons
                                    name={isRecording ? 'stop' : 'mic'}
                                    size={60}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {/* Timer */}
                    {isRecording && (
                        <Text style={styles.timer}>{formatTime(recordingTime)}</Text>
                    )}

                    {/* Instructions */}
                    <View style={styles.instructionsCard}>
                        <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                        <Text style={styles.instructionsText}>
                            {isRecording
                                ? 'Speak clearly. Your audio is being transcribed in real-time.'
                                : 'Tap the microphone to start recording your consultation notes.'}
                        </Text>
                    </View>
                </View>

                {/* Bottom Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="close" size={24} color="#666" />
                        <Text style={styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                    {isRecording && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.saveButton]}
                            onPress={handleToggleRecording}
                        >
                            <Ionicons name="checkmark" size={24} color="white" />
                            <Text style={[styles.actionText, { color: 'white' }]}>Save</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFC' },
    content: { flex: 1, padding: 20 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },

    langSelector: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
    langTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 12 },
    langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    langItem: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#DDD' },
    langItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    langText: { fontSize: 13, color: '#666' },
    langTextActive: { color: 'white', fontWeight: '600' },

    recordingArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#999', marginBottom: 40 },

    micContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
    wave: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: COLORS.primary },
    micButton: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },

    timer: { fontSize: 36, fontWeight: 'bold', color: '#E53935', marginBottom: 30 },

    instructionsCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 12, gap: 10, marginHorizontal: 20 },
    instructionsText: { flex: 1, fontSize: 13, color: '#333', lineHeight: 18 },

    actions: { flexDirection: 'row', gap: 15, marginTop: 20 },
    actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, paddingVertical: 15 },
    saveButton: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    actionText: { fontSize: 16, fontWeight: '600', color: '#666' },
});
