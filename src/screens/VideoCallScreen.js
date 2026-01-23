// src/screens/VideoCallScreen.js
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function VideoCallScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Notes'); // 'Notes' or 'Chat'
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Mock Chat Data
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, can you hear me clearly?', sender: 'remote' },
    { id: 2, text: 'Yes, loud and clear.', sender: 'me' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setMessages([...messages, { id: Date.now(), text: chatInput, sender: 'me' }]);
      setChatInput('');
    }
  };

  const handleEndCall = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= VIDEO SECTION (Top 40%) ================= */}
      <View style={styles.videoContainer}>
        {/* Remote Video (Placeholder) */}
        <View style={styles.remoteVideo}>
           <Image 
             source={{uri: 'https://i.pravatar.cc/300?img=12'}} 
             style={styles.remoteImage} 
           />
           <View style={styles.remoteOverlay}>
              <Text style={styles.remoteName}>Sara Shetty</Text>
              <Text style={styles.timer}>05:23</Text>
           </View>
        </View>

        {/* Self Video (Floating) */}
        <View style={styles.selfVideo}>
           {!isVideoOff ? (
             <Image 
               source={{uri: 'https://i.pravatar.cc/300?img=11'}} 
               style={styles.selfImage} 
             />
           ) : (
             <View style={[styles.selfImage, {backgroundColor: '#333', justifyContent: 'center', alignItems: 'center'}]}>
                <Ionicons name="videocam-off" size={20} color="white" />
             </View>
           )}
        </View>

        {/* Call Controls */}
        <View style={styles.controlsBar}>
           <TouchableOpacity style={styles.controlBtn} onPress={() => setIsMuted(!isMuted)}>
              <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
           </TouchableOpacity>
           
           <TouchableOpacity style={[styles.controlBtn, styles.endCallBtn]} onPress={handleEndCall}>
              <Ionicons name="call" size={28} color="white" />
           </TouchableOpacity>

           <TouchableOpacity style={styles.controlBtn} onPress={() => setIsVideoOff(!isVideoOff)}>
              <Ionicons name={isVideoOff ? "videocam-off" : "videocam"} size={24} color="white" />
           </TouchableOpacity>
        </View>
      </View>

      {/* ================= TABS SECTION ================= */}
      <View style={styles.tabContainer}>
         <TouchableOpacity 
           style={[styles.tab, activeTab === 'Notes' && styles.activeTab]}
           onPress={() => setActiveTab('Notes')}
         >
            <Text style={[styles.tabText, activeTab === 'Notes' && styles.activeTabText]}>SOAP Notes</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={[styles.tab, activeTab === 'Chat' && styles.activeTab]}
           onPress={() => setActiveTab('Chat')}
         >
            <Text style={[styles.tabText, activeTab === 'Chat' && styles.activeTabText]}>Chat</Text>
         </TouchableOpacity>
      </View>

      {/* ================= CONTENT SECTION (Bottom 60%) ================= */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{flex: 1}}
      >
        <View style={styles.contentArea}>
           
           {/* --- SOAP NOTES VIEW --- */}
           {activeTab === 'Notes' && (
             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20}}>
                <Text style={styles.sectionTitle}>SUBJECTIVE</Text>
                <TextInput 
                  style={styles.inputArea} 
                  multiline 
                  placeholder="Patient's complaints..." 
                />

                <Text style={styles.sectionTitle}>OBJECTIVE</Text>
                <TextInput 
                  style={styles.inputArea} 
                  multiline 
                  placeholder="Vital signs, physical exam findings..." 
                />

                <Text style={styles.sectionTitle}>ASSESSMENT</Text>
                <TextInput 
                  style={styles.inputArea} 
                  multiline 
                  placeholder="Diagnosis..." 
                />

                <Text style={styles.sectionTitle}>PLAN</Text>
                <TextInput 
                  style={styles.inputArea} 
                  multiline 
                  placeholder="Treatment plan, prescriptions..." 
                />
                <View style={{height: 40}} />
             </ScrollView>
           )}

           {/* --- CHAT VIEW --- */}
           {activeTab === 'Chat' && (
             <View style={{flex: 1}}>
                <ScrollView 
                  style={{flex: 1, padding: 15}} 
                  contentContainerStyle={{paddingBottom: 20}}
                  showsVerticalScrollIndicator={false}
                >
                   {messages.map((msg) => (
                     <View 
                       key={msg.id} 
                       style={[
                         styles.msgBubble, 
                         msg.sender === 'me' ? styles.msgMe : styles.msgRemote
                       ]}
                     >
                        <Text style={[
                          styles.msgText, 
                          msg.sender === 'me' ? styles.msgTextMe : styles.msgTextRemote
                        ]}>
                          {msg.text}
                        </Text>
                     </View>
                   ))}
                </ScrollView>
                
                {/* Chat Input */}
                <View style={styles.chatInputRow}>
                   <TextInput 
                     style={styles.chatInput} 
                     placeholder="Type a message..." 
                     value={chatInput}
                     onChangeText={setChatInput}
                   />
                   <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                      <Ionicons name="send" size={20} color="white" />
                   </TouchableOpacity>
                </View>
             </View>
           )}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC' },
  
  // Video Styles
  videoContainer: { height: '40%', backgroundColor: '#000', position: 'relative' },
  remoteVideo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  remoteImage: { width: '100%', height: '100%', opacity: 0.8 },
  remoteOverlay: { position: 'absolute', top: 40, alignItems: 'center', width: '100%' },
  remoteName: { color: 'white', fontSize: 18, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 5 },
  timer: { color: '#EEE', fontSize: 14, marginTop: 5, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 8, borderRadius: 4 },
  
  selfVideo: { position: 'absolute', right: 20, top: 40, width: 90, height: 120, borderRadius: 12, borderWidth: 2, borderColor: 'white', overflow: 'hidden', backgroundColor: '#333' },
  selfImage: { width: '100%', height: '100%' },

  controlsBar: { position: 'absolute', bottom: 20, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 20 },
  controlBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' },
  endCallBtn: { backgroundColor: '#F44336', width: 60, height: 60, borderRadius: 30 },

  // Tab Styles
  tabContainer: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
  activeTabText: { color: COLORS.primary },

  // Content Styles
  contentArea: { flex: 1, backgroundColor: '#F9FAFC' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 8, marginTop: 15 },
  inputArea: { backgroundColor: 'white', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#EEE', fontSize: 14, color: '#333', minHeight: 60, textAlignVertical: 'top' },

  // Chat Styles
  msgBubble: { padding: 12, borderRadius: 12, marginBottom: 10, maxWidth: '80%' },
  msgMe: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
  msgRemote: { alignSelf: 'flex-start', backgroundColor: 'white', borderWidth: 1, borderColor: '#EEE', borderBottomLeftRadius: 2 },
  msgText: { fontSize: 14 },
  msgTextMe: { color: 'white' },
  msgTextRemote: { color: '#333' },
  
  chatInputRow: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#EEE' },
  chatInput: { flex: 1, backgroundColor: '#F5F6FA', borderRadius: 20, paddingHorizontal: 15, height: 45, marginRight: 10 },
  sendBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
});