import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, Platform, ScrollView,
  StyleSheet, Switch, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PLAN_COLORS } from '../data/mockPlans';
import { CreatePlanForm, PlanStatus, SubscriptionPlan } from '../types/plan.types';

interface Props {
  visible: boolean;
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSave: (form: CreatePlanForm, id?: number, durationInDays?: number) => void;
}

function defaultForm(): CreatePlanForm {
  return {
    name: '', description: '', monthlyPrice: '', yearlyPrice: '',
    employeeLimit: '',
    color: PLAN_COLORS[0], isPopular: false, status: 'active', featureIds: [],
  };
}

function planToForm(p: SubscriptionPlan): CreatePlanForm {
  return {
    name: p.name,
    description: p.description,
    monthlyPrice: String(p.monthlyPrice),
    yearlyPrice: String(p.yearlyPrice),
    employeeLimit: p.employeeLimit === null ? '' : String(p.employeeLimit),
    color: p.color,
    isPopular: p.isPopular,
    status: p.status,
    featureIds: [], // All features auto-included
  };
}

export const CreateEditPlanModal: React.FC<Props> = ({ visible, plan, onClose, onSave }) => {
  const [form, setForm] = useState<CreatePlanForm>(defaultForm());
  const [durationInDays, setDurationInDays] = useState('30');

  useEffect(() => {
    setForm(plan ? planToForm(plan) : defaultForm());
  }, [plan, visible]);

  const set = <K extends keyof CreatePlanForm>(key: K, val: CreatePlanForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Plan name is required.');
      return;
    }
    const monthlyPrice = parseFloat(form.monthlyPrice) || 0;
    const yearlyPrice = monthlyPrice * 12;
    const durationInDaysValue = parseInt(durationInDays) || 30;
    
    const saveForm: CreatePlanForm = {
      ...form,
      monthlyPrice: String(monthlyPrice),
      yearlyPrice: String(yearlyPrice),
      featureIds: [], // All features auto-included
    };
    onSave(saveForm, plan?.id, durationInDaysValue);
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      {children}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={s.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{plan ? 'Edit Plan' : 'Create New Plan'}</Text>
          <TouchableOpacity style={[s.saveBtn, { backgroundColor: form.color }]} onPress={handleSave}>
            <Text style={s.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Basic Info */}
            <SectionHeader title="Basic Information" />
            <Field label="Plan Name *">
              <TextInput
                style={s.input}
                value={form.name}
                onChangeText={(v) => set('name', v)}
                placeholder="e.g. Professional Plan"
                placeholderTextColor="#9CA3AF"
              />
            </Field>
            <Field label="Description">
              <TextInput
                style={[s.input, s.multiline]}
                value={form.description}
                onChangeText={(v) => set('description', v)}
                placeholder="Describe what this plan includes..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </Field>

            {/* Pricing and Duration */}
            <SectionHeader title="Pricing and Duration" />
            <Field label="Price (₹) *">
              <TextInput
                style={s.input}
                value={form.monthlyPrice}
                onChangeText={(v) => set('monthlyPrice', v)}
                placeholder="499"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </Field>
            <Field label="Duration (days)">
              <TextInput
                style={s.input}
                value={durationInDays}
                onChangeText={setDurationInDays}
                placeholder="30 (30 days = 1 month)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </Field>

            {/* Limits */}
            <SectionHeader title="Limits" />
            <Field label="Employee Limit">
              <TextInput
                style={s.input}
                value={form.employeeLimit}
                onChangeText={(v) => set('employeeLimit', v)}
                placeholder="Leave blank = Unlimited"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </Field>

            {/* Settings */}
            <SectionHeader title="Settings" />
            <View style={s.toggleRow}>
              <View style={s.toggleInfo}>
                <Text style={s.toggleLabel}>Mark as Popular</Text>
                <Text style={s.toggleSub}>Highlights this plan with a Popular badge</Text>
              </View>
              <Switch
                value={form.isPopular}
                onValueChange={(v) => set('isPopular', v)}
                trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                thumbColor="#FFF"
              />
            </View>
            <View style={s.toggleRow}>
              <View style={s.toggleInfo}>
                <Text style={s.toggleLabel}>Active Status</Text>
                <Text style={s.toggleSub}>Makes this plan visible and subscribable</Text>
              </View>
              <Switch
                value={form.status === 'active'}
                onValueChange={(v) => set('status', v ? 'active' : 'inactive' as PlanStatus)}
                trackColor={{ false: '#E5E7EB', true: '#059669' }}
                thumbColor="#FFF"
              />
            </View>

            {/* Plan Color */}
            <Field label="Plan Color">
              <View style={s.colorRow}>
                {PLAN_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[s.colorDot, { backgroundColor: c }, form.color === c && s.colorDotActive]}
                    onPress={() => set('color', c)}
                  >
                    {form.color === c && <Ionicons name="checkmark" size={14} color="#FFF" />}
                  </TouchableOpacity>
                ))}
              </View>
            </Field>

            <View style={{ height: 32 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6F3' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#111827', letterSpacing: -0.3 },
  saveBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  sectionHeader: {
    marginTop: 20, marginBottom: 10, paddingBottom: 6,
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB',
  },
  multiline: { height: 80, paddingTop: 11 },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  toggleInfo: { flex: 1, marginRight: 12 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
  toggleSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  colorRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorDot: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  colorDotActive: { borderColor: '#111827', transform: [{ scale: 1.1 }] },
});
