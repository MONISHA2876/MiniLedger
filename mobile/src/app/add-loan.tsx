import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiRequest } from '../services/api';
import BackTract_btn from '@/components/BackTract_btn';
import { styles_ext } from '@/components/clay_card';

const PURPLE = '#9482DB';
const BG = '#F7F6FC';
const DARK = '#24213A';
const MUTED = '#85829A';
const BORDER = '#E9E5F4';

export default function AddLoan() {
  const router = useRouter();

  const [friendName, setFriendName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  const validateDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      value >= minDate
    );
  };

  const handleSubmit = async () => {
    const name = friendName.trim();
    const numericAmount = Number(amount);

    if (!name) {
      Alert.alert('Missing name', 'Enter your friend’s name.');
      return;
    }

    if (name.length > 100) {
      Alert.alert('Name too long', 'Keep the name under 100 characters.');
      return;
    }

    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter an amount greater than ₹0.');
      return;
    }

    if (!validateDate(dueDate)) {
      Alert.alert(
        'Invalid due date',
        'Enter a valid date today or later in YYYY-MM-DD format.'
      );
      return;
    }

    try {
      setSaving(true);

      await apiRequest('/api/loans', {
        method: 'POST',
        authenticated: true,
        body: {
          friendName: name,
          amount: numericAmount,
          dueDate,
        },
      });

      Alert.alert('Loan added!', `₹${numericAmount.toLocaleString('en-IN')} lent to ${name}.`, [
        {
          text: 'Done',
          onPress: () => router.replace('/(tabs)/dashboard'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Could not add loan',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackTract_btn />

        <View>
          <Text style={styles.heading}>Add a loan</Text>
          <Text style={styles.subtitle}>
            Keep track of money you lend to friends.
          </Text>
        </View>

        {/* Amount preview */}
        <View style={[styles.amountCard, styles_ext.clayCard]}>
          <Text style={styles.amountLabel}>YOU ARE LENDING</Text>
          <View style={styles.amountPreview}>
            <Text style={styles.rupee}>₹</Text>
            <Text style={styles.amountValue}>
              {amount && Number(amount) > 0
                ? Number(amount).toLocaleString('en-IN')
                : '0'}
            </Text>
          </View>
          <Text style={styles.amountHint}>
            Every loan, neatly accounted for.
          </Text>
        </View>

        {/* Form */}
        <View style={[styles.formCard, styles_ext.clayCard]}>
          <Text style={styles.formTitle}>Loan details</Text>

          <Text style={styles.label}>FRIEND'S NAME</Text>
          <TextInput
            value={friendName}
            onChangeText={setFriendName}
            placeholder="e.g. Rahul Sharma"
            placeholderTextColor="#AAA6BC"
            style={[styles.input]}
            autoCapitalize="words"
            maxLength={100}
            returnKeyType="next"
          />

          <Text style={styles.label}>AMOUNT (₹)</Text>
          <View style={styles.amountInputWrap}>
            <Text style={styles.inputRupee}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={(value) => {
                // Allow a positive decimal amount with up to 2 decimal places.
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  setAmount(value);
                }
              }}
              placeholder="Enter amount"
              placeholderTextColor="#AAA6BC"
              keyboardType="decimal-pad"
              style={styles.amountInput}
              returnKeyType="done"
            />
          </View>

          <Text style={styles.label}>DUE DATE</Text>
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DD (e.g. 2026-11-15)"
            placeholderTextColor="#AAA6BC"
            style={styles.input}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
          <Text style={styles.dateHint}>
            Use year-month-day format. The date must be today or later.
          </Text>

          <Pressable
            onPress={handleSubmit}
            disabled={saving}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && !saving && { opacity: 0.88 },
              saving && { opacity: 0.7 },
            ]}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitText}>Save loan</Text>
                <Text style={styles.submitArrow}>→</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.secureNote}>
            🔒 Your loan is saved privately to your account.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 16,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 15,
    paddingBottom: 35,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backArrow: {
    color: DARK,
    fontSize: 34,
    lineHeight: 36,
    marginRight: 7,
  },
  backText: {
    color: DARK,
    fontSize: 14,
    fontWeight: '600',
  },
  headingIcon: {
    width: 49,
    height: 49,
    borderRadius: 17,
    backgroundColor: '#E9E3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  headingIconText: {
    color: PURPLE,
    fontSize: 30,
    lineHeight: 34,
  },
  heading: {
    color: DARK,
    fontSize: 29,
    fontWeight: '800',
  },
  subtitle: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
    marginVertical: 7,
  },
  amountCard: {
    backgroundColor: PURPLE,
    borderRadius: 23,
    padding: 21,
    marginBottom: 22,
  },
  amountLabel: {
    color: '#F0EDFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  amountPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  rupee: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '700',
    marginRight: 6,
  },
  amountValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },
  amountHint: {
    color: '#F0EDFF',
    fontSize: 11,
    marginTop: 10,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 20,
    paddingVertical: 32,
  },
  formTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 23,
  },
  label: {
    color: '#6E6985',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 9,
  },
  input: {
    backgroundColor: '#FAF9FE',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: DARK,
    marginBottom: 21,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FE',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    paddingHorizontal: 14,
    marginBottom: 21,
  },
  inputRupee: {
    fontSize: 16,
    color: PURPLE,
    fontWeight: '800',
    marginRight: 9,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: DARK,
  },
  dateHint: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
    marginTop: -13,
    marginBottom: 21,
  },
  submitButton: {
    minHeight: 53,
    backgroundColor: PURPLE,
    borderRadius: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  submitArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 10,
  },
  secureNote: {
    textAlign: 'center',
    color: MUTED,
    fontSize: 10,
    marginTop: 16,
  },
});