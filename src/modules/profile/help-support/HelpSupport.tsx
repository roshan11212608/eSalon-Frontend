import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './HelpSupport.styles';

export default function HelpSupport() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleContactSupport = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to send support request
      console.log('Sending support request:', { subject, message });
      // await supportService.sendSupportRequest({ subject, message });
      
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'Your support request has been sent. We will get back to you soon.');
        setSubject('');
        setMessage('');
      }, 1000);
    } catch (error) {
      console.error('Error sending support request:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to send support request. Please try again.');
    }
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@esalon.com');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Help & Support</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <TouchableOpacity style={styles.contactItem} onPress={handleCallSupport}>
              <Text style={styles.contactLabel}>Phone Support</Text>
              <Text style={styles.contactValue}>+1 (234) 567-890</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmailSupport}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>support@esalon.com</Text>
            </TouchableOpacity>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Working Hours</Text>
              <Text style={styles.contactValue}>Mon - Fri: 9:00 AM - 6:00 PM</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I reset my password?</Text>
              <Text style={styles.faqArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I update my profile?</Text>
              <Text style={styles.faqArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I change my notification settings?</Text>
              <Text style={styles.faqArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I delete my account?</Text>
              <Text style={styles.faqArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send us a message</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter subject"
                value={subject}
                onChangeText={setSubject}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your issue"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleContactSupport}
              disabled={loading}
            >
              <Text style={styles.sendButtonText}>
                {loading ? 'Sending...' : 'Send Message'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
