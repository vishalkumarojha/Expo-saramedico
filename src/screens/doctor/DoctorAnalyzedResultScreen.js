import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';

export default function DoctorAnalyzedResultScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Timeline'); // 'Timeline' or 'Chat'

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Analyzed Document</Text>
            <View style={{width: 24}} /> 
        </View>

        {/* Document Preview (Mock) */}
        <View style={styles.docPreview}>
           <Text style={styles.docHeader}>MEDICAL REPORT</Text>
           <View style={styles.docLine} />
           <Text style={styles.docText}><Text style={{fontWeight:'bold'}}>PATIENT:</Text> John Doe (ID: 4520)</Text>
           <Text style={styles.docText}><Text style={{fontWeight:'bold'}}>EXAM:</Text> MRI LEFT KNEE</Text>
           <Text style={styles.docText}><Text style={{fontWeight:'bold'}}>FINDINGS:</Text>{'\n'}The medial meniscus demonstrates a complex tear involving the posterior horn.</Text>
           <View style={styles.highlight}><Text style={styles.highlightText}>There is moderate joint effusion present. The anterior cruciate ligament appears intact.</Text></View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
           <TouchableOpacity 
             style={[styles.tab, activeTab === 'Timeline' && styles.activeTab]}
             onPress={() => setActiveTab('Timeline')}
           >
              <Text style={[styles.tabText, activeTab === 'Timeline' && styles.activeTabText]}>Timeline</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             style={[styles.tab, activeTab === 'Chat' && styles.activeTab]}
             onPress={() => setActiveTab('Chat')}
           >
              <Text style={[styles.tabText, activeTab === 'Chat' && styles.activeTabText]}>Chat</Text>
           </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
           {activeTab === 'Timeline' ? <TimelineView /> : <ChatView navigation={navigation} />}
        </View>

      </View>
    </SafeAreaView>
  );
}

// --- SUB-COMPONENTS ---

function TimelineView() {
  const events = [
    { date: 'Oct 12, 2024', title: 'MRI Left Knee Report', desc: 'Complex tear of the posterior horn of the medial meniscus. Moderate joint effusion.' },
    { date: 'Sept 24, 2024', title: 'Orthopedic Consultation', desc: 'Patient presented with persistent knee pain following a fall. Physical exam suggested meniscal injury.' },
    { date: 'Oct 12, 2024', title: 'MRI Left Knee Report', desc: 'Complex tear of the posterior horn of the medial meniscus. Moderate joint effusion.' },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{paddingTop: 10}}>
       {events.map((e, i) => (
         <View key={i} style={styles.timelineItem}>
            {/* Timeline Line */}
            <View style={styles.timelineLeft}>
               <View style={styles.dot} />
               {i !== events.length - 1 && <View style={styles.line} />}
            </View>
            
            {/* Content Card */}
            <View style={styles.timelineCard}>
               <Text style={styles.timeDate}>{e.date}</Text>
               <Text style={styles.timeTitle}>{e.title}</Text>
               <Text style={styles.timeDesc}>{e.desc}</Text>
            </View>
         </View>
       ))}
       <View style={{height: 20}} />
    </ScrollView>
  );
}

function ChatView({ navigation }) {
  return (
    <View style={{flex: 1}}>
       <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {/* AI Message */}
          <View style={styles.aiMsg}>
             <Text style={styles.aiText}>I've analyzed the patient's radiology report. I can help you identify key findings, extracting dates, or summarizing the diagnosis.</Text>
          </View>

          {/* User Suggestion Chip */}
          <View style={{alignItems: 'flex-end', marginTop: 10}}>
             <TouchableOpacity style={styles.suggestionChip}>
                <Text style={styles.suggestionText}>What does the Patient go through?</Text>
             </TouchableOpacity>
          </View>
       </ScrollView>

       {/* Chat Input */}
       <View style={styles.chatInputRow}>
           <TouchableOpacity>
             <Ionicons name="add-circle-outline" size={24} color="#999" />
           </TouchableOpacity>
           <TextInput placeholder="Ask anything about the document..." style={styles.chatInput} />
           <TouchableOpacity style={styles.sendBtn} onPress={() => navigation.navigate('DoctorDashboard')}>
             <Ionicons name="send" size={18} color="white" />
           </TouchableOpacity>
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  // Document Preview
  docPreview: { backgroundColor: '#E8ECEF', padding: 20, borderRadius: 12, marginBottom: 20, height: 200 },
  docHeader: { fontSize: 18, fontWeight: 'bold', fontFamily: 'serif', marginBottom: 5 },
  docLine: { height: 2, backgroundColor: '#333', marginBottom: 10 },
  docText: { fontSize: 12, fontFamily: 'serif', marginBottom: 6, color: '#333' },
  highlight: { backgroundColor: '#B3D4FC', padding: 4, borderRadius: 4, marginTop: 5 },
  highlightText: { fontSize: 11, fontFamily: 'serif', color: '#000' },

  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: '#E3E8ED', borderRadius: 12, padding: 4, marginBottom: 15 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: COLORS.primary, fontWeight: 'bold' },

  tabContent: { flex: 1 },

  // Timeline Styles
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', width: 30 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary, borderWidth: 2, borderColor: '#D1E3FF', marginTop: 15 },
  line: { width: 2, backgroundColor: '#D1E3FF', flex: 1, marginTop: 0 },
  timelineCard: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  timeDate: { fontSize: 12, color: '#2196F3', fontWeight: 'bold', marginBottom: 4 },
  timeTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  timeDesc: { fontSize: 13, color: '#666', lineHeight: 18 },

  // Chat Styles
  aiMsg: { backgroundColor: 'white', padding: 15, borderRadius: 12, borderBottomLeftRadius: 2, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  aiText: { fontSize: 14, color: '#333', lineHeight: 20 },
  suggestionChip: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20 },
  suggestionText: { color: 'white', fontSize: 13, fontWeight: '500' },
  
  chatInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingVertical: 5 },
  chatInput: { flex: 1, backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: '#EEE', paddingHorizontal: 15, height: 45, marginHorizontal: 10 },
  sendBtn: { width: 45, height: 45, borderRadius: 12, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }
});