import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { Button, TextInput, Card, Chip } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { aiAPI } from '../../services/api';
import { AI_REQUEST_TYPES } from '../../services/config';
import ErrorHandler from '../../services/errorHandler';

/**
 * AI Contribution Screen
 * 
 * Allows doctors to submit patient data to AI processing queue
 */
export default function AIContributionScreen({ route, navigation }) {
    const { patientId, documentIds = [] } = route.params || {};

    const [selectedPatientId, setSelectedPatientId] = useState(patientId || '');
    const [selectedDocumentIds, setSelectedDocumentIds] = useState(documentIds);
    const [requestType, setRequestType] = useState(AI_REQUEST_TYPES.DIAGNOSIS_ASSIST);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Handle AI contribution submission
     */
    const handleSubmit = async () => {
        if (!selectedPatientId) {
            Alert.alert('Patient Required', 'Please select a patient');
            return;
        }

        if (selectedDocumentIds.length === 0 && !notes.trim()) {
            Alert.alert(
                'Data Required',
                'Please select at least one document or provide notes'
            );
            return;
        }

        setLoading(true);

        try {
            const dataPayload = {
                file_ids: selectedDocumentIds,
                notes: notes.trim(),
                analysis_type: requestType,
            };

            const response = await aiAPI.contributeToAI(
                selectedPatientId,
                dataPayload,
                requestType
            );

            Alert.alert(
                'Submitted to AI Queue',
                `Queue ID: ${response.data.queue_id}\n\nYour request has been queued for AI processing. You will be notified when the analysis is complete.`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.error('Submission error:', error);
            const errorInfo = ErrorHandler.handleError(error);

            if (errorInfo.statusCode === 403) {
                Alert.alert(
                    'Access Denied',
                    'You do not have permission to access this patient\'s data. The patient must grant access first.'
                );
            } else {
                Alert.alert('Submission Failed', errorInfo.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>AI Analysis Request</Text>
                    <Text style={styles.subtitle}>
                        Submit patient data for AI-assisted diagnosis and analysis
                    </Text>

                    {/* Patient ID Display */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Patient ID</Text>
                        <TextInput
                            value={selectedPatientId}
                            onChangeText={setSelectedPatientId}
                            mode="outlined"
                            style={styles.input}
                            disabled={!!patientId}
                            placeholder="Enter patient ID"
                        />
                    </View>

                    {/* Document IDs Display */}
                    {selectedDocumentIds.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.label}>Selected Documents</Text>
                            <View style={styles.chipContainer}>
                                {selectedDocumentIds.map((docId, index) => (
                                    <Chip
                                        key={docId}
                                        mode="outlined"
                                        style={styles.chip}
                                        onClose={() => {
                                            setSelectedDocumentIds(
                                                selectedDocumentIds.filter((id) => id !== docId)
                                            );
                                        }}
                                    >
                                        Document {index + 1}
                                    </Chip>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Request Type Picker */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Analysis Type *</Text>
                        <Picker
                            selectedValue={requestType}
                            onValueChange={(value) => setRequestType(value)}
                            enabled={!loading}
                            style={styles.picker}
                        >
                            <Picker.Item
                                label="Diagnosis Assistance"
                                value={AI_REQUEST_TYPES.DIAGNOSIS_ASSIST}
                            />
                            <Picker.Item
                                label="Treatment Recommendation"
                                value={AI_REQUEST_TYPES.TREATMENT_RECOMMENDATION}
                            />
                            <Picker.Item
                                label="Risk Assessment"
                                value={AI_REQUEST_TYPES.RISK_ASSESSMENT}
                            />
                        </Picker>
                    </View>

                    {/* Notes Input */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Clinical Notes</Text>
                        <TextInput
                            label="Notes"
                            value={notes}
                            onChangeText={setNotes}
                            mode="outlined"
                            multiline
                            numberOfLines={6}
                            style={styles.input}
                            disabled={loading}
                            placeholder="e.g., Patient presenting with chest pain. Please analyze ECG and blood work for cardiac risk assessment."
                        />
                    </View>

                    {/* Submit Button */}
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        disabled={loading}
                        loading={loading}
                        style={styles.submitButton}
                    >
                        {loading ? 'Submitting...' : 'Submit to AI Queue'}
                    </Button>

                    {/* Info Text */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>HIPAA Compliance Notice</Text>
                        <Text style={styles.infoText}>
                            • All patient data is encrypted and de-identified before AI processing
                            {'\n'}
                            • Access is logged and audited for compliance
                            {'\n'}
                            • Patient consent is verified before submission
                            {'\n'}
                            • Results are stored securely and accessible only to authorized personnel
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        margin: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
    },
    picker: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    submitButton: {
        marginTop: 8,
        marginBottom: 24,
    },
    infoContainer: {
        backgroundColor: '#e3f2fd',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#2196f3',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#1565c0',
        lineHeight: 20,
    },
});
