import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

export default function OnboardingScreen({ navigation }) {

    const handleAccept = () => {
        navigation.replace('Auth'); // Navigate to Auth stack (Login)
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.appTitle}>SaraMedico</Text>
                </View>

                {/* Content Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Vision</Text>
                    <Text style={styles.sectionText}>
                        To revolutionize healthcare accessibility by bridging the gap between patients and specialized medical care through cutting-edge technology and AI-driven solutions.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why We Started</Text>
                    <Text style={styles.sectionText}>
                        SaraMedico was born from a simple realization: quality healthcare should be accessible to everyone, everywhere. We saw the challenges patients face in finding the right specialists and managing their health records, and we built a solution to simplify it all.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Goals</Text>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Simplify patient-doctor appointments.</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Provide secure and instant access to medical records.</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Enhance diagnosis with AI assistance.</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Ensure data privacy and compliance.</Text>
                    </View>
                </View>

                <View style={styles.spacing} />

            </ScrollView>

            {/* Footer with Accept Button */}
            <View style={styles.footer}>
                <Text style={styles.termsText}>
                    By continuing, you verify that you have read and accept our Mission and Goals.
                </Text>
                <CustomButton
                    title="Accept & Continue"
                    onPress={handleAccept}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        textAlign: 'justify',
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 6,
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 16,
        color: COLORS.primary,
        marginRight: 8,
        marginTop: 2,
    },
    bulletText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        flex: 1,
    },
    spacing: {
        height: 80, // Space for footer
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    termsText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginBottom: 15,
    }
});
