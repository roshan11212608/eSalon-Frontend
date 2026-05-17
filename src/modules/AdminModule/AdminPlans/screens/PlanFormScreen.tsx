import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Switch, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { AdminPlanService } from '../services/adminPlanService';
import { MOCK_PLANS, PLAN_COLORS } from '../data/mockPlans';
import {
  CreatePlanForm,
  PlanStatus, SubscriptionPlan,
} from '../types/plan.types';

interface Props {
  planId?: number;
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
    name: p.name, description: p.description,
    monthlyPrice: String(p.monthlyPrice), yearlyPrice: String(p.yearlyPrice),
    employeeLimit: p.employeeLimit === null ? '' : String(p.employeeLimit),
    color: p.color, isPopular: p.isPopular, status: p.status,
    featureIds: [], // All features auto-included
  };
}

const PLANS_ROUTE = '/(admin-tabs)/plans' as const;

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function PlanFormScreen({ planId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreatePlanForm>(defaultForm());
  const [durationInDays, setDurationInDays] = useState('30');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const plans = queryClient.getQueryData<SubscriptionPlan[]>(['admin', 'plans']) ?? MOCK_PLANS;
  const existingPlan = planId !== undefined ? plans.find(p => p.id === planId) ?? null : null;

  const isEdit = planId !== undefined;

  useEffect(() => {
    if (existingPlan) setForm(planToForm(existingPlan));
    // planId is the stable key; existingPlan derives from it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  const set = <K extends keyof CreatePlanForm>(key: K, val: CreatePlanForm[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const navigateBack = useCallback(() => router.replace(PLANS_ROUTE), [router]);

  const handleSave = useCallback(async () => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Plan name is required.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      // Calculate yearly price from entered price
      const monthlyPrice = parseFloat(form.monthlyPrice) || 0;
      const yearlyPrice = monthlyPrice * 12;
      const durationInDaysValue = parseInt(durationInDays) || 30;
      
      const saveForm: CreatePlanForm = {
        ...form,
        monthlyPrice: String(monthlyPrice),
        yearlyPrice: String(yearlyPrice),
        featureIds: [], // All features auto-included
      };

      if (isEdit && existingPlan) {
        const saved = await AdminPlanService.updatePlan(planId!, saveForm, existingPlan.tier, durationInDaysValue);
        queryClient.setQueryData<SubscriptionPlan[]>(['admin', 'plans'], (old = []) =>
          old.map(p => p.id === planId ? { ...p, ...saved, durationInDays: durationInDaysValue } : p)
        );
      } else {
        const created = await AdminPlanService.createPlan(saveForm, durationInDaysValue);
        queryClient.setQueryData<SubscriptionPlan[]>(['admin', 'plans'], (old = []) =>
          [...old, { ...created, durationInDays: durationInDaysValue }]
        );
      }
      setSaved(true);
      navTimer.current = setTimeout(navigateBack, 900);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  }, [form, durationInDays, isEdit, existingPlan, planId, queryClient, navigateBack]);

  useEffect(() => () => { if (navTimer.current) clearTimeout(navTimer.current); }, []);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={navigateBack} disabled={saved || saving}>
          <Ionicons name="arrow-back" size={18} color={saved || saving ? '#D1D5DB' : '#1a1a1a'} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>{isEdit ? 'Edit ' : 'New '}<Text style={s.headerAccent}>Plan</Text></Text>
        <TouchableOpacity
          style={[s.saveBtn, { backgroundColor: saved ? '#059669' : saving ? '#9CA3AF' : '#f7b638' }]}
          onPress={handleSave}
          disabled={saved || saving}
          activeOpacity={0.85}
        >
          {saved ? (
            <View style={s.saveBtnInner}>
              <Ionicons name="checkmark" size={13} color="#FFF" />
              <Text style={s.saveBtnText}>Saved!</Text>
            </View>
          ) : saving ? (
            <Text style={s.saveBtnText}>Saving...</Text>
          ) : (
            <Text style={s.saveBtnText}>{isEdit ? 'Update' : 'Create'}</Text>
          )}
        </TouchableOpacity>
      </View>
      {saveError ? (
        <View style={s.errorBanner}>
          <Ionicons name="alert-circle-outline" size={14} color="#FFF" />
          <Text style={s.errorBannerText}>{saveError}</Text>
        </View>
      ) : null}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <SectionHeader title="Basic Information" />
          <Field label="Plan Name *">
            <TextInput style={s.input} value={form.name} onChangeText={v => set('name', v)}
              placeholder="e.g. Professional Plan" placeholderTextColor="#9CA3AF" />
          </Field>
          <Field label="Description">
            <TextInput style={[s.input, s.multiline]} value={form.description}
              onChangeText={v => set('description', v)}
              placeholder="Describe what this plan includes..."
              placeholderTextColor="#9CA3AF" multiline numberOfLines={3} textAlignVertical="top" />
          </Field>

          <SectionHeader title="Pricing and Duration" />
          <Field label="Price (₹) *">
            <TextInput style={s.input} value={form.monthlyPrice}
              onChangeText={v => set('monthlyPrice', v)} placeholder="499"
              placeholderTextColor="#9CA3AF" keyboardType="numeric" />
          </Field>
          <Field label="Duration (days)">
            <TextInput style={s.input} value={durationInDays}
              onChangeText={setDurationInDays} placeholder="30 (30 days = 1 month)"
              placeholderTextColor="#9CA3AF" keyboardType="numeric" />
          </Field>

          <SectionHeader title="Limits" />
          <Field label="Employee Limit">
            <TextInput style={s.input} value={form.employeeLimit}
              onChangeText={v => set('employeeLimit', v)} placeholder="Leave blank = Unlimited"
              placeholderTextColor="#9CA3AF" keyboardType="numeric" />
          </Field>

          <SectionHeader title="Settings" />
          <View style={s.toggleRow}>
            <View style={s.toggleInfo}>
              <Text style={s.toggleLabel}>Mark as Popular</Text>
              <Text style={s.toggleSub}>Highlights this plan with a Popular badge</Text>
            </View>
            <Switch value={form.isPopular} onValueChange={v => set('isPopular', v)}
              trackColor={{ false: '#E5E7EB', true: '#7C3AED' }} thumbColor="#FFF" />
          </View>
          <View style={s.toggleRow}>
            <View style={s.toggleInfo}>
              <Text style={s.toggleLabel}>Active Status</Text>
              <Text style={s.toggleSub}>Makes this plan visible and subscribable</Text>
            </View>
            <Switch value={form.status === 'active'}
              onValueChange={v => set('status', (v ? 'active' : 'inactive') as PlanStatus)}
              trackColor={{ false: '#E5E7EB', true: '#059669' }} thumbColor="#FFF" />
          </View>

          <Field label="Plan Color">
            <View style={s.colorRow}>
              {PLAN_COLORS.map(c => (
                <TouchableOpacity key={c} style={[s.colorDot, { backgroundColor: c },
                  form.color === c && s.colorDotActive]} onPress={() => set('color', c)}>
                  {form.color === c && <Ionicons name="checkmark" size={14} color="#FFF" />}
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 8,
    backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#e5e5e5',
  },
  backBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', letterSpacing: 0.5 },
  headerAccent: { color: '#f7b638' },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, minWidth: 70, alignItems: 'center' },
  saveBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  saveBtnText: { fontSize: 12, fontWeight: '700', color: '#1a1a1a' },
  scroll: { flex: 1 },
  scrollContent: { padding: 14 },
  sectionHeader: { marginTop: 16, marginBottom: 8, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.6 },
  field: { marginBottom: 10 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 5 },
  input: {
    backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 13, color: '#1a1a1a', borderWidth: 1, borderColor: '#e0e0e0',
  },
  multiline: { height: 72, paddingTop: 10 },
  row: { flexDirection: 'row', gap: 10 },
  halfInput: { flex: 1 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#ffffff', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#e0e0e0',
  },
  toggleInfo: { flex: 1, marginRight: 12 },
  toggleLabel: { fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
  toggleSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  colorRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  colorDot: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  colorDotActive: { borderColor: '#1a1a1a', transform: [{ scale: 1.1 }] },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 8,
  },
  errorBannerText: { flex: 1, fontSize: 12, color: '#FFF', fontWeight: '500' },
});
