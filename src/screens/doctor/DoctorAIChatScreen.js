import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { aiChatAPI, doctorAPI } from '../../services/api';

export default function DoctorAIChatScreen({ navigation, route }) {
    const { patientId: initialPatientId } = route.params || {};

    const [chatMode, setChatMode] = useState(initialPatientId ? 'patient' : 'general');
    const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || '');
    const [patients, setPatients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [showPatientPicker, setShowPatientPicker] = useState(false);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        loadPatients();
        if (chatMode === 'general') {
            loadChatHistory();
        }
    }, []);

    useEffect(() => {
        if (chatMode === 'patient' && selectedPatientId) {
            loadChatHistory();
        } else if (chatMode === 'general') {
            loadChatHistory();
        }
    }, [chatMode, selectedPatientId]);

    const loadPatients = async () => {
        try {
            const response = await doctorAPI.getPatients();
            const patientsData = response.data?.patients || response.data || [];
            setPatients(patientsData);
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    };

    const loadChatHistory = async () => {
        setLoadingHistory(true);
        try {
            let response;
            if (chatMode === 'patient' && selectedPatientId) {
                response = await aiChatAPI.getPatientChatHistory(selectedPatientId);
            } else if (chatMode === 'general') {
                response = await aiChatAPI.getDoctorChatHistory();
            }

            const history = response?.data?.messages || response?.data || [];
            setMessages(history);
        } catch (error) {
            console.error('Error loading chat history:', error);
            setMessages([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        if (chatMode === 'patient' && !selectedPatientId) {
            Alert.alert('Patient Required', 'Please select a patient first');
            return;
        }

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            let response;
            if (chatMode === 'patient') {
                response = await aiChatAPI.chatAboutPatient(selectedPatientId, inputMessage.trim());
            } else {
                response = await aiChatAPI.chatWithAI(inputMessage.trim());
            }

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data?.response || response.data?.message || 'I apologize, but I could not process your request.',
                timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message. Please try again.');

            // Remove the user message if sending failed
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        } finally {
            setLoading(false);
        }
    };

    const handleModeChange = (mode) => {
        setChatMode(mode);
        setMessages([]);
        if (mode === 'general') {
            setSelectedPatientId('');
        }
    };

    const getSelectedPatientName = () => {
        if (!selectedPatientId) return 'Select Patient';
        const patient = patients.find(p => p.id === selectedPatientId);
        return patient?.name || patient?.full_name || 'Unknown Patient';
    };

    const renderMessage = (message, index) => {
        const isUser = message.role === 'user';

        return (
            <View
                key={message.id || index}
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessageContainer : styles.aiMessageContainer
                ]}
            >
                <View style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.aiBubble
                ]}>
                    {!isUser && (
                        <View style={styles.aiHeader}>
                            <Ionicons name="sparkles" size={16} color="#9C27B0" />
                            <Text style={styles.aiLabel}>AI Assistant</Text>
                        </View>
                    )}
                    <Text style={[
                        styles.messageText,
                        isUser ? styles.userMessageText : styles.aiMessageText
                    ]}>
                        {message.content}
                    </Text>
                    <Text style={styles.timestamp}>
                        {new Date(message.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>AI Assistant</Text>
                    <Text style={styles.headerSubtitle}>
                        {chatMode === 'patient' ? getSelectedPatientName() : 'General Consultation'}
                    </Text>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
                <TouchableOpacity
                    style={[styles.modeButton, chatMode === 'general' && styles.modeButtonActive]}
                    onPress={() => handleModeChange('general')}
                >
                    <Ionicons
                        name="chatbubbles"
                        size={18}
                        color={chatMode === 'general' ? '#FFFFFF' : '#666'}
                    />
                    <Text style={[
                        styles.modeButtonText,
                        chatMode === 'general' && styles.modeButtonTextActive
                    ]}>
                        General Chat
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeButton, chatMode === 'patient' && styles.modeButtonActive]}
                    onPress={() => handleModeChange('patient')}
                >
                    <Ionicons
                        name="person"
                        size={18}
                        color={chatMode === 'patient' ? '#FFFFFF' : '#666'}
                    />
                    <Text style={[
                        styles.modeButtonText,
                        chatMode === 'patient' && styles.modeButtonTextActive
                    ]}>
                        Patient Chat
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Patient Selector */}
            {chatMode === 'patient' && (
                <TouchableOpacity
                    style={styles.patientSelector}
                    onPress={() => setShowPatientPicker(!showPatientPicker)}
                >
                    <Ionicons name="person-circle-outline" size={20} color="#666" />
                    <Text style={styles.patientSelectorText}>{getSelectedPatientName()}</Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
            )}

            {/* Patient Picker Dropdown */}
            {showPatientPicker && chatMode === 'patient' && (
                <View style={styles.patientPicker}>
                    <ScrollView style={styles.patientList}>
                        {patients.map((patient) => (
                            <TouchableOpacity
                                key={patient.id}
                                style={styles.patientItem}
                                onPress={() => {
                                    setSelectedPatientId(patient.id);
                                    setShowPatientPicker(false);
                                }}
                            >
                                <Text style={styles.patientName}>
                                    {patient.name || patient.full_name}
                                </Text>
                                {patient.mrn && (
                                    <Text style={styles.patientMRN}>MRN: {patient.mrn}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Messages */}
            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {loadingHistory ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Loading chat history...</Text>
                    </View>
                ) : messages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={60} color="#DDD" />
                        <Text style={styles.emptyText}>Start a conversation</Text>
                        <Text style={styles.emptySubtext}>
                            {chatMode === 'patient'
                                ? 'Ask questions about your patient\'s condition'
                                : 'Ask me anything about medical topics'}
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesScroll}
                        contentContainerStyle={styles.messagesContent}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((message, index) => renderMessage(message, index))}
                        {loading && (
                            <View style={styles.typingIndicator}>
                                <View style={styles.typingDot} />
                                <View style={styles.typingDot} />
                                <View style={styles.typingDot} />
                            </View>
                        )}
                    </ScrollView>
                )}

                {/* HIPAA Notice */}
                <View style={styles.hipaaNotice}>
                    <Ionicons name="shield-checkmark" size={14} color="#4CAF50" />
                    <Text style={styles.hipaaText}>HIPAA Compliant • End-to-end encrypted</Text>
                </View>

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={chatMode === 'patient' ? 'Ask about patient...' : 'Type your message...'}
                        placeholderTextColor="#999"
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        multiline
                        maxLength={1000}
                        editable={!loading}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!inputMessage.trim() || loading) && styles.sendButtonDisabled]}
                        onPress={handleSendMessage}
                        disabled={!inputMessage.trim() || loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    headerCenter: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    menuButton: {
        padding: 4,
    },
    modeToggle: {
        flexDirection: 'row',
        padding: 12,
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        gap: 6,
    },
    modeButtonActive: {
        backgroundColor: COLORS.primary,
    },
    modeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    modeButtonTextActive: {
        color: '#FFFFFF',
    },
    patientSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        gap: 8,
    },
    patientSelectorText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    patientPicker: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        maxHeight: 200,
    },
    patientList: {
        maxHeight: 200,
    },
    patientItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    patientName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    patientMRN: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    chatContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
        textAlign: 'center',
    },
    messagesScroll: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 8,
    },
    messageContainer: {
        marginBottom: 16,
    },
    userMessageContainer: {
        alignItems: 'flex-end',
    },
    aiMessageContainer: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: 16,
        padding: 12,
    },
    userBubble: {
        backgroundColor: '#E3F2FD',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: '#F3E5F5',
        borderBottomLeftRadius: 4,
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 4,
    },
    aiLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9C27B0',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    userMessageText: {
        color: '#1565C0',
    },
    aiMessageText: {
        color: '#4A148C',
    },
    timestamp: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 4,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#9C27B0',
        opacity: 0.6,
    },
    hipaaNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F0F9FF',
        gap: 6,
    },
    hipaaText: {
        fontSize: 11,
        color: '#2E7D32',
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 8,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        fontSize: 15,
        color: '#333',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
});
