import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAQ_DATA = [
    {
        category: 'General',
        icon: 'information-circle',
        questions: [
            {
                q: 'What is Saramedico?',
                a: 'Saramedico is an AI-powered clinical documentation and decision-support platform designed to help healthcare providers reduce documentation burden, improve accuracy, and streamline patient care workflows—without disrupting existing clinical systems.',
            },
            {
                q: 'Who is Saramedico designed for?',
                a: 'Saramedico is designed for:\n• Physicians (Primary care & specialists)\n• Clinics and hospitals\n• Telehealth providers\n• Care coordinators and clinical teams',
            },
            {
                q: 'Does Saramedico replace doctors or clinical judgment?',
                a: 'No. Saramedico is a clinical support tool, not a diagnostic replacement. All outputs are meant to assist clinicians, who retain full medical responsibility and final decision-making authority.',
            },
        ],
    },
    {
        category: 'Security, Privacy & Compliance',
        icon: 'shield-checkmark',
        questions: [
            {
                q: 'Is my data secure?',
                a: 'Yes. Saramedico follows industry-standard security practices, including:\n• End-to-end encryption (in transit and at rest)\n• Role-based access control (RBAC)\n• Secure audit logs\n• Continuous monitoring and intrusion detection',
            },
            {
                q: 'Is Saramedico HIPAA compliant?',
                a: 'Yes. Saramedico is fully HIPAA compliant and signs a Business Associate Agreement (BAA) with all eligible customers.',
            },
            {
                q: 'Where is patient data stored?',
                a: 'Patient data is stored in secure, HIPAA-compliant cloud infrastructure located in approved regions within the United States.',
            },
            {
                q: 'Does Saramedico train AI models on my patient data?',
                a: 'No. Patient data is never used to train shared or public AI models. Your data remains private to your organization.',
            },
            {
                q: 'Can Saramedico support SOC 2 or enterprise security reviews?',
                a: 'Yes. Enterprise customers can request security documentation, architecture summaries, and compliance attestations during onboarding.',
            },
        ],
    },
    {
        category: 'Audio Recording & Transcription',
        icon: 'mic',
        questions: [
            {
                q: 'Does Saramedico record patient conversations?',
                a: 'Only if explicitly enabled by the clinician. Recording starts and stops under full user control.',
            },
            {
                q: 'Are patients notified when recording is active?',
                a: 'Yes. Saramedico supports configurable consent prompts and visual indicators to ensure patient awareness and compliance with consent laws.',
            },
            {
                q: 'How accurate is transcription?',
                a: 'Saramedico uses advanced medical-grade transcription optimized for clinical terminology, accents, and conversational speech.',
            },
            {
                q: 'Can I edit transcripts?',
                a: 'Yes. All transcripts are fully editable before approval and storage.',
            },
        ],
    },
    {
        category: 'Clinical Notes & Summaries',
        icon: 'document-text',
        questions: [
            {
                q: 'What types of notes can Saramedico generate?',
                a: 'Saramedico can generate:\n• SOAP notes\n• Visit summaries\n• Follow-up instructions\n• Assessment & plan drafts\n• Patient-friendly summaries',
            },
            {
                q: 'Can I customize note formats?',
                a: 'Yes. Templates are configurable by specialty, clinic, or individual provider.',
            },
            {
                q: 'Are summaries auto-saved to the medical record?',
                a: 'Only after clinician review and approval. Nothing is finalized automatically.',
            },
            {
                q: 'Does it work for telehealth visits?',
                a: 'Yes. Saramedico supports both in-person and virtual consultations.',
            },
        ],
    },
    {
        category: 'User Management & Access',
        icon: 'people',
        questions: [
            {
                q: 'Can multiple clinicians use one account?',
                a: 'Yes. Saramedico supports multi-user organizations with:\n• Admin roles\n• Provider roles\n• Read-only roles',
            },
            {
                q: 'Can I restrict access to specific patient records?',
                a: 'Yes. Role-based permissions allow fine-grained access control.',
            },
        ],
    },
    {
        category: 'Pricing & Plans',
        icon: 'card',
        questions: [
            {
                q: 'What plans does Saramedico offer?',
                a: 'Saramedico offers:\n• Starter (individual clinicians)\n• Clinic / Team plans\n• Enterprise plans (custom)',
            },
            {
                q: 'Do you offer a free trial?',
                a: 'Yes. A 14-day free trial is available for Premium plans.',
            },
            {
                q: 'Can I cancel anytime?',
                a: 'Yes. There are no long-term contracts unless explicitly agreed for enterprise customers.',
            },
            {
                q: 'Can I switch plans later?',
                a: 'Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.',
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept major credit cards (Visa, Mastercard, American Express) and invoice billing for eligible organizations.',
            },
        ],
    },
    {
        category: 'Data Ownership & Export',
        icon: 'cloud-download',
        questions: [
            {
                q: 'Who owns the data?',
                a: 'You do. Saramedico does not claim ownership of your patient or clinical data.',
            },
            {
                q: 'Can I export my data?',
                a: 'Yes. You can export notes, transcripts, and summaries in standard formats at any time.',
            },
            {
                q: 'What happens to my data if I cancel?',
                a: 'Your data remains accessible for a limited retention period, after which it is securely deleted upon request.',
            },
        ],
    },
    {
        category: 'Support & Reliability',
        icon: 'headset',
        questions: [
            {
                q: 'What support options are available?',
                a: 'Email support (all plans)\nPriority support (Premium)\nDedicated account manager (Enterprise)',
            },
            {
                q: 'Is Saramedico reliable?',
                a: 'Saramedico is built for high availability with redundancy, monitoring, and automated failover mechanisms.',
            },
            {
                q: 'Do you provide onboarding or training?',
                a: 'Yes. We offer guided onboarding, documentation, and optional live training for teams.',
            },
        ],
    },
    {
        category: 'Legal & Compliance',
        icon: 'document',
        questions: [
            {
                q: 'Is Saramedico FDA-approved?',
                a: 'Saramedico is classified as a clinical documentation and decision-support tool, not a medical device. Regulatory positioning is continuously reviewed as features evolve.',
            },
            {
                q: 'Does Saramedico provide medical advice?',
                a: 'No. Saramedico provides informational support only. All medical decisions remain with licensed clinicians.',
            },
        ],
    },
    {
        category: 'Roadmap & Future',
        icon: 'rocket',
        questions: [
            {
                q: 'Will Saramedico add more AI features?',
                a: 'Yes. Future features may include deeper specialty support, predictive insights, and advanced workflow automation—always with clinician oversight.',
            },
            {
                q: 'Can customers request features?',
                a: 'Yes. Customer feedback directly influences our roadmap.',
            },
        ],
    },
];

const FAQItem = ({ question, answer, isExpanded, onToggle }) => {
    return (
        <TouchableOpacity
            style={styles.faqItem}
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View style={styles.faqHeader}>
                <Text style={styles.question}>{question}</Text>
                <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#0066CC"
                />
            </View>
            {isExpanded && (
                <Text style={styles.answer}>{answer}</Text>
            )}
        </TouchableOpacity>
    );
};

const FAQCategory = ({ category, icon, questions, expandedItems, onToggle }) => {
    return (
        <View style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
                <Ionicons name={icon} size={24} color="#0066CC" />
                <Text style={styles.categoryTitle}>{category}</Text>
            </View>
            {questions.map((item, index) => (
                <FAQItem
                    key={index}
                    question={item.q}
                    answer={item.a}
                    isExpanded={expandedItems[`${category}-${index}`]}
                    onToggle={() => onToggle(`${category}-${index}`)}
                />
            ))}
        </View>
    );
};

export default function FAQScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItems, setExpandedItems] = useState({});

    const toggleItem = (key) => {
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return FAQ_DATA;

        const query = searchQuery.toLowerCase();
        return FAQ_DATA.map(category => ({
            ...category,
            questions: category.questions.filter(
                item =>
                    item.q.toLowerCase().includes(query) ||
                    item.a.toLowerCase().includes(query)
            ),
        })).filter(category => category.questions.length > 0);
    }, [searchQuery]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {/* FAQ List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredData.length > 0 ? (
                    filteredData.map((category, index) => (
                        <FAQCategory
                            key={index}
                            category={category.category}
                            icon={category.icon}
                            questions={category.questions}
                            expandedItems={expandedItems}
                            onToggle={toggleItem}
                        />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="search" size={64} color="#CCC" />
                        <Text style={styles.emptyText}>No FAQs found</Text>
                        <Text style={styles.emptySubtext}>Try a different search term</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    placeholder: {
        width: 32,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    categoryContainer: {
        marginBottom: 24,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#0066CC',
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 8,
    },
    faqItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    question: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginRight: 8,
    },
    answer: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#D1D5DB',
        marginTop: 4,
    },
});
