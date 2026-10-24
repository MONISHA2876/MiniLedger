import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { apiRequest } from '../services/api';
import BackTract_btn from '@/components/BackTract_btn';

const PURPLE = '#9482DB';
const BG = '#F7F6FC';
const DARK = '#24213A';
const MUTED = '#85829A';
const RED = '#E45D6A';
const GREEN = '#319B78';

type Loan = {
  id: number;
  friend_name: string;
  amount: number | string;
  due_date: string;
  is_repaid: boolean;
  is_overdue?: boolean;
  repaid_at?: string | null;
  created_at?: string;
};

type Filter = 'All' | 'Pending' | 'Overdue' | 'Repaid';

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

function isLoanOverdue(loan: Loan) {
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  return (
    !loan.is_repaid &&
    (loan.is_overdue ?? loan.due_date.slice(0, 10) < todayString)
  );
}

export default function LoansScreen() {
  const router = useRouter();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [filter, setFilter] = useState<Filter>('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [repayingId, setRepayingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadLoans = useCallback(async () => {
    try {
      setError('');

      const result = await apiRequest<{ loans: Loan[] }>('/api/loans', {
        method: 'GET',
        authenticated: true,
      });

      setLoans(result.loans ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load your loans.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLoans();
    }, [loadLoans])
  );

  const markRepaid = (loan: Loan) => {
    Alert.alert(
      'Mark as repaid?',
      `Confirm that ${loan.friend_name} has returned ${money(loan.amount)}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, repaid',
          onPress: async () => {
            try {
              setRepayingId(loan.id);

              await apiRequest(`/api/loans/${loan.id}/repay`, {
                method: 'PATCH',
                authenticated: true,
              });

              await loadLoans();

              Alert.alert('Success', 'Loan marked as repaid.');
            } catch (err) {
              Alert.alert(
                'Could not update loan',
                err instanceof Error ? err.message : 'Please try again.'
              );
            } finally {
              setRepayingId(null);
            }
          },
        },
      ]
    );
  };

  const counts: Record<Filter, number> = {
    All: loans.length,
    Pending: loans.filter((loan) => !loan.is_repaid && !isLoanOverdue(loan)).length,
    Overdue: loans.filter(isLoanOverdue).length,
    Repaid: loans.filter((loan) => loan.is_repaid).length,
  };

  const filteredLoans = loans.filter((loan) => {
    if (filter === 'Pending') return !loan.is_repaid && !isLoanOverdue(loan);
    if (filter === 'Overdue') return isLoanOverdue(loan);
    if (filter === 'Repaid') return loan.is_repaid;
    return true;
  });

  const totalOutstanding = loans
    .filter((loan) => !loan.is_repaid)
    .reduce((sum, loan) => sum + Number(loan.amount), 0);

  return (
    <View style={styles.screen}>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadLoans();
            }}
            tintColor={PURPLE}
          />
        }
      >
        <BackTract_btn />
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>My Loans</Text>
            <Text style={styles.subtitle}>
              Every loan, all in one place.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add a loan"
            style={styles.addIcon}
            onPress={() => router.push('/add-loan')}
          >
            <Text style={styles.addIconText}>+</Text>
          </Pressable>
        </View>

        {/* Outstanding overview */}
        <View style={[styles.overviewCard, styles.clayCard]}>
          <View style={styles.overviewTop}>
            <Text style={styles.overviewLabel}>TOTAL OUTSTANDING</Text>
            <View style={styles.overviewIcon}>
              <Text style={styles.overviewIconText}>₹</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color="#FFFFFF" style={{ alignSelf: 'flex-start', marginTop: 15 }} />
          ) : (
            <Text style={styles.overviewAmount}>
              {money(totalOutstanding)}
            </Text>
          )}

          <Text style={styles.overviewHint}>
            {counts.Overdue} overdue · {counts.Pending} pending
          </Text>
        </View>

        {/* Filters */}
        <View style={styles.filterHeading}>
          <Text style={styles.sectionTitle}>All transactions</Text>
          <Text style={styles.totalCount}>{loans.length} total</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {(['All', 'Pending', 'Overdue', 'Repaid'] as Filter[]).map((item) => {
            const active = filter === item;

            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={[styles.filterChip, active && styles.activeFilter]}
              >
                <Text style={[styles.filterText, active && styles.activeFilterText]}>
                  {item}
                </Text>
                <Text
                  style={[
                    styles.filterCount,
                    active && styles.activeFilterText,
                  ]}
                >
                  {counts[item]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Loan list */}
        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color={PURPLE} size="large" />
            <Text style={styles.stateText}>Loading your loans...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateEmoji}>⚠️</Text>
            <Text style={styles.emptyTitle}>Couldn't load loans</Text>
            <Text style={styles.stateText}>{error}</Text>
            <Pressable style={styles.primaryButton} onPress={loadLoans}>
              <Text style={styles.primaryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : filteredLoans.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateEmoji}>
              {loans.length === 0 ? '🪙' : '🔎'}
            </Text>
            <Text style={styles.emptyTitle}>
              {loans.length === 0 ? 'No loans yet' : `No ${filter.toLowerCase()} loans`}
            </Text>
            <Text style={styles.stateText}>
              {loans.length === 0
                ? 'Add a loan to start tracking money lent to friends.'
                : 'Try selecting another filter to see your loans.'}
            </Text>

            {loans.length === 0 && (
              <Pressable
                style={styles.primaryButton}
                onPress={() => router.push('/add-loan')}
              >
                <Text style={styles.primaryButtonText}>Add your first loan</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.loanList}>
            {filteredLoans.map((loan) => {
              const overdue = isLoanOverdue(loan);
              const busy = repayingId === loan.id;

              return (
                <View
                  key={loan.id}
                  style={[
                    styles.loanCard,
                    overdue && styles.overdueCard,
                  ]}
                >
                  <View style={styles.loanTop}>
                    <View
                      style={[
                        styles.avatar,
                        overdue && styles.overdueAvatar,
                        loan.is_repaid && styles.repaidAvatar,
                      ]}
                    >
                      <Text
                        style={[
                          styles.avatarText,
                          overdue && { color: RED },
                          loan.is_repaid && { color: GREEN },
                        ]}
                      >
                        {loan.friend_name.trim().charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.loanInfo}>
                      <Text style={styles.friendName} numberOfLines={1}>
                        {loan.friend_name}
                      </Text>
                      <Text style={styles.dueDate}>
                        {loan.is_repaid ? 'Due' : 'Due'} {formatDate(loan.due_date)}
                      </Text>
                    </View>

                    <View style={styles.amountInfo}>
                      <Text
                        style={[
                          styles.loanAmount,
                          overdue && { color: RED },
                          loan.is_repaid && { color: GREEN },
                        ]}
                      >
                        {money(loan.amount)}
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
                            ? 'REPAID'
                            : overdue
                              ? 'OVERDUE'
                              : 'PENDING'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {!loan.is_repaid && (
                    <Pressable
                      disabled={busy || repayingId !== null}
                      onPress={() => markRepaid(loan)}
                      style={({ pressed }) => [
                        styles.repayButton,
                        overdue && styles.overdueRepayButton,
                        pressed && { opacity: 0.8 },
                        (busy || repayingId !== null) && { opacity: 0.6 },
                      ]}
                    >
                      {busy ? (
                        <ActivityIndicator color={PURPLE} size="small" />
                      ) : (
                        <>
                          <Text style={styles.repayCheck}>✓</Text>
                          <Text
                            style={[
                              styles.repayText,
                              overdue && { color: RED },
                            ]}
                          >
                            Mark as repaid
                          </Text>
                        </>
                      )}
                    </Pressable>
                  )}
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
    paddingTop: 16,
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
    paddingTop: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: DARK,
    fontSize: 29,
    fontWeight: '800',
  },
  subtitle: {
    color: MUTED,
    fontSize: 13,
    marginTop: 5,
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  addIconText: {
    color: '#FFFFFF',
    fontSize: 29,
    lineHeight: 33,
  },
  overviewCard: {
    backgroundColor: PURPLE,
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewLabel: {
    color: '#F0EDFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  overviewIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewIconText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },
  overviewAmount: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '800',
    marginTop: 14,
  },
  overviewHint: {
    color: '#F0EDFF',
    fontSize: 12,
    marginTop: 12,
  },
  filterHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
  },
  totalCount: {
    color: MUTED,
    fontSize: 12,
  },
  filters: {
    gap: 9,
    paddingBottom: 17,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEAF6',
  },
  activeFilter: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  filterText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  filterCount: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '800',
  },
  loanList: {
    gap: 12,
  },
  loanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFEDF7',
  },
  overdueCard: {
    backgroundColor: '#FFFAFB',
    borderColor: '#F5D9DE',
  },
  loanTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#EDE8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overdueAvatar: {
    backgroundColor: '#FCE6E9',
  },
  repaidAvatar: {
    backgroundColor: '#E1F5EB',
  },
  avatarText: {
    color: PURPLE,
    fontSize: 18,
    fontWeight: '800',
  },
  loanInfo: {
    flex: 1,
    minWidth: 0,
  },
  friendName: {
    color: DARK,
    fontSize: 14,
    fontWeight: '800',
  },
  dueDate: {
    color: MUTED,
    fontSize: 10,
    marginTop: 5,
  },
  amountInfo: {
    alignItems: 'flex-end',
    maxWidth: '45%',
  },
  loanAmount: {
    color: DARK,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
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
  repayButton: {
    minHeight: 42,
    marginTop: 15,
    borderRadius: 12,
    backgroundColor: '#F0ECFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  overdueRepayButton: {
    backgroundColor: '#FCEBED',
  },
  repayCheck: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: '900',
  },
  repayText: {
    color: PURPLE,
    fontSize: 12,
    fontWeight: '800',
  },
  stateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEDF7',
  },
  stateEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateText: {
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 9,
  },
  primaryButton: {
    backgroundColor: PURPLE,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    color: '#AAA6BC',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 26,
  },
});