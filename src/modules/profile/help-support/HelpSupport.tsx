import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './HelpSupport.styles';

interface HelpSupportProps {
  onBack?: () => void;
}

export default function HelpSupport({ onBack }: HelpSupportProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleCallSupport}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="call-outline" size={18} color="#f7b638" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.menuText}>Phone Support</Text>
                <Text style={styles.contactValue}>+1 (234) 567-890</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleEmailSupport}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="mail-outline" size={18} color="#f7b638" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.menuText}>Email Support</Text>
                <Text style={styles.contactValue}>support@esalon.com</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
          </TouchableOpacity>
          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="time-outline" size={18} color="#f7b638" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.menuText}>Working Hours</Text>
                <Text style={styles.contactValue}>Mon - Fri: 9:00 AM - 6:00 PM</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="help-circle-outline" size={18} color="#f7b638" />
              </View>
              <Text style={styles.menuText}>How do I reset my password?</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="help-circle-outline" size={18} color="#f7b638" />
              </View>
              <Text style={styles.menuText}>How do I update my profile?</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="help-circle-outline" size={18} color="#f7b638" />
              </View>
              <Text style={styles.menuText}>How do I change my notification settings?</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Ionicons name="help-circle-outline" size={18} color="#f7b638" />
              </View>
              <Text style={styles.menuText}>How do I delete my account?</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#c7c7c7" />
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
              placeholderTextColor="#999999"
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
              placeholderTextColor="#999999"
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
    </View>
  );
}
