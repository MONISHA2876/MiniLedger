
import React, { useCallback, useState } from 'react';
import {ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View,} from 'react-native';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import { apiRequest } from '../../services/api';

const PURPLE = '#9482DB';
const BG = '#F7F6FC';
const DARK = '#24213A';
const MUTED = '#85829A';
const RED = '#E45D6A';
const GREEN = '#319B78';

type Loan = {
  id: number;
  friend_name: string;
  amount: string | number;
  due_date: string;
  is_repaid: boolean;
  is_overdue?: boolean;
};

type Summary = {
  totalLent: number;
  totalRepaid: number;
  overdueAmount: number;
};

const emptySummary: Summary = {
  totalLent: 0,
  totalRepaid: 0,
  overdueAmount: 0,
};

function money(value: number | string) {
  return Number(value).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const router = useRouter();

  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    try {
      setError('');

      const [summaryData, loanData] = await Promise.all([
        apiRequest<Summary>('/api/summary', {
          method: 'GET',
          authenticated: true,
        }),
        apiRequest<{ loans: Loan[] }>('/api/loans', {
          method: 'GET',
          authenticated: true,
        }),
      ]);

      setSummary(summaryData);
      setLoans(loanData.loans ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load your dashboard.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const recentLoans = [...loans]
    .sort(
      (a, b) =>
        new Date(b.due_date).getTime() -
        new Date(a.due_date).getTime()
    )
    .slice(0, 4);

  const openLoans = loans.filter((loan) => !loan.is_repaid).length;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadDashboard();
            }}
            tintColor={PURPLE}
          />
        }
      >
      
      <Text style={{marginTop: 32, fontWeight: 'bold', fontSize: 32, marginBottom: 16 }}>Dashboard</Text>

        {/* Total lent card */}
        <View style={[styles.heroCard, styles.clayCard]}>
          <View style={styles.heroTop}>
            <Text style={{color: '#F0EDFF', fontSize: 11, fontWeight: '700',letterSpacing: 1.1,}}>TOTAL MONEY LENT</Text>
            <View style={styles.heroIcon}>
              <Text style={styles.heroIconText}>₹</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color="#FFFFFF" style={styles.loader} />
          ) : (
            <Text style={styles.heroAmount}>
              {money(summary.totalLent)}
            </Text>
          )}

          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterText}>
              {openLoans} unpaid {openLoans === 1 ? 'loan' : 'loans'}
            </Text>
            <Text style={styles.heroArrow}>↗</Text>
          </View>
        </View>

        {/* Summary cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your summary</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.repaidCard, styles.clayCard]}>
            <View style={[styles.smallIcon, { backgroundColor: '#DDF4E9' }]}>
              <Text style={{ color: GREEN, fontSize: 19 }}>✓</Text>
            </View>
            <Text style={styles.cardLabel}>Repaid</Text>
            <Text style={styles.cardAmount}>
              {loading ? '—' : money(summary.totalRepaid)}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.overdueCard, styles.clayCard]}>
            <View style={[styles.smallIcon, { backgroundColor: '#FCE5E8' }]}>
              <Text style={{ color: RED, fontSize: 19 }}>!</Text>
            </View>
            <Text style={styles.cardLabel}>Overdue</Text>
            <Text style={[styles.cardAmount, { color: RED }]}>
              {loading ? '—' : money(summary.overdueAmount)}
            </Text>
          </View>
        </View>

        {/* Quick action */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && { opacity: 0.85 },
            styles.clayCard,
          ]}
          onPress={() => router.push('/add-loan' as Href)}
        >
          <View style={styles.plusCircle}>
            <Text style={styles.plusText}>+</Text>
          </View>
          <View style={styles.addTextWrap}>
            <Text style={styles.addTitle}>Record a new loan</Text>
            <Text style={styles.addSubtitle}>
              Keep track of money you lend
            </Text>
          </View>
          <Text style={styles.addArrow}>→</Text>
        </Pressable>

        {/* Recent loans */}
        <View style={[styles.sectionHeader]}>
          <Text style={styles.sectionTitle}>Recent loans</Text>
          <Pressable onPress={() => router.push('/loans' as Href)}>
            <Text style={styles.viewAll}>View all →</Text>
          </Pressable>
        </View>

        {error ? (
          <View style={styles.messageCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={loadDashboard}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : loading ? (
          <View style={styles.messageCard}>
            <ActivityIndicator color={PURPLE} size="large" />
            <Text style={styles.emptySubtitle}>Loading your loans...</Text>
          </View>
        ) : recentLoans.length === 0 ? (
          <View style={[styles.emptyCard, styles.clayCard]}>
            <Text style={styles.emptyEmoji}>🪙</Text>
            <Text style={styles.emptyTitle}>No loans yet</Text>
            <Text style={styles.emptySubtitle}>
              Your lending activity will show up here.
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => router.push('/add-loan' as Href)}
            >
              <Text style={styles.emptyButtonText}>Add your first loan</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.loanList}>
            {recentLoans.map((loan) => {
              const overdue =
                !loan.is_repaid &&
                (loan.is_overdue ??
                  loan.due_date.slice(0, 10) <
                    new Date().toLocaleDateString('en-CA'));

              return (
                <View key={loan.id} style={styles.loanItem}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {loan.friend_name.trim().charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.loanDetails}>
                    <Text numberOfLines={1} style={styles.friendName}>
                      {loan.friend_name}
                    </Text>
                    <Text style={styles.dueDate}>
                      Due {formatDate(loan.due_date)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        loan.is_repaid
                          ? styles.repaidBadge
                          : overdue
                            ? styles.overdueBadge
                            : styles.pendingBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: loan.is_repaid
                              ? GREEN
                              : overdue
                                ? RED
                                : '#92722B',
                          },
                        ]}
                      >
                        {loan.is_repaid
                          ? 'Repaid'
                          : overdue
                            ? 'Overdue'
                            : 'Pending'}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.loanAmount,
                      overdue && { color: RED },
                    ]}
                  >
                    {money(loan.amount)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.footer}>MiniLedger · Every rupee counts.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  clayCard: {
    boxShadow: [
      {
        offsetX: 8,
        offsetY: 12,
        blurRadius: 16,
        color: 'rgba(0, 0, 0, 0.2)',
      },
      {
        offsetX: 6,
        offsetY: 6,
        blurRadius: 10,
        color: 'rgba(255, 255, 255, 0.45)',
        inset: true,
      },
      {
        offsetX: -8,
        offsetY: -8,
        blurRadius: 12,
        color: 'rgba(0, 0, 0, 0.25)',
        inset: true,
      },
    ],
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 36,
  },
  subtitle: {
    color: MUTED,
    fontSize: 13,
    marginTop: 5,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: '#E8E2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: PURPLE,
  },
  heroCard: {
    backgroundColor: PURPLE,
    borderRadius: 25,
    padding: 22,
    minHeight: 176,
    marginBottom: 28,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 12,
  },
  loader: {
    alignSelf: 'flex-start',
    marginTop: 22,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.22)',
  },
  heroFooterText: {
    color: '#F0EDFF',
    fontSize: 12,
  },
  heroArrow: {
    color: '#FFFFFF',
    fontSize: 19,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  summaryCard: {
    flex: 1,
    minWidth: 0,
    padding: 15,
    paddingBottom: 30,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  repaidCard: {
    backgroundColor: '#FBFEFC',
  },
  overdueCard: {
    backgroundColor: '#FFFBFB',
  },
  smallIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  cardLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '600',
  },
  cardAmount: {
    color: DARK,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 5,
  },
  cardHint: {
    color: MUTED,
    fontSize: 10,
    marginTop: 6,
  },
  addButton: {
    backgroundColor: '#EFEBFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  plusCircle: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 31,
  },
  addTextWrap: {
    flex: 1,
    marginLeft: 13,
  },
  addTitle: {
    color: DARK,
    fontWeight: '800',
    fontSize: 14,
  },
  addSubtitle: {
    color: MUTED,
    fontSize: 11,
    marginTop: 4,
  },
  addArrow: {
    color: PURPLE,
    fontSize: 23,
    marginLeft: 8,
  },
  viewAll: {
    color: PURPLE,
    fontSize: 12,
    fontWeight: '700',
  },
  loanList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EFEDF7',
  },
  loanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#F1EFF7',
    gap: 11,
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: '#EDE8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: PURPLE,
    fontSize: 18,
    fontWeight: '800',
  },
  loanDetails: {
    flex: 1,
    minWidth: 0,
  },
  friendName: {
    color: DARK,
    fontSize: 13,
    fontWeight: '800',
  },
  dueDate: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    marginTop: 7,
  },
  repaidBadge: {
    backgroundColor: '#E1F5EB',
  },
  overdueBadge: {
    backgroundColor: '#FCE6E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF3D9',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  loanAmount: {
    color: DARK,
    fontSize: 13,
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center'
  },
  emptyEmoji: {
    fontSize: 34,
    marginBottom: 12,
  },
  emptyTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    color: MUTED,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 17,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: RED,
    fontSize: 12,
    textAlign: 'center',
  },
  retryText: {
    color: PURPLE,
    fontWeight: '800',
    fontSize: 13,
  },
  footer: {
    color: '#AAA6BC',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 26,
  },
});
