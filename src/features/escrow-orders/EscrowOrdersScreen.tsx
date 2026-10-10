import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ShieldCheck, CheckCircle2, Clock, Check } from 'lucide-react-native';
import { BentoCard } from '../../shared/components/BentoCard';
import { MOCK_ESCROW_ORDERS, EscrowOrder } from '../../data/mockData';
import { formatRupiah, formatKg } from '../../shared/utils/formatters';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface EscrowOrdersScreenProps {
  mode: ThemeMode;
}

export const EscrowOrdersScreen: React.FC<EscrowOrdersScreenProps> = ({ mode }) => {
  const theme = getAppleTheme(mode);
  const [orders, setOrders] = useState<EscrowOrder[]>(MOCK_ESCROW_ORDERS);

  const handleSimulateApproval = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            stage: 'FUNDS_RELEASED',
            stageTitle: 'Tahap 4: Dana Berhasil Dicairkan ke Penjual',
            stageDesc: 'Hasil uji lab terbukti lolos mutu SNI. Dana otomatis diteruskan ke rekening Bank BRI penjual.',
          };
        }
        return o;
      })
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.canvas }]} showsVerticalScrollIndicator={false}>
      {/* iOS Large Title Section */}
      <View style={styles.titleSection}>
        <Text style={[styles.largeTitle, { color: theme.text }]}>Rekening Bersama</Text>
        <Text style={[styles.titleCaption, { color: theme.textSecondary }]}>
          Pengamanan transaksi dan pencairan bertahap berbasis hasil uji mutu
        </Text>
      </View>

      {/* 1. Vault Balance Inset Card */}
      <BentoCard mode={mode} style={styles.vaultCard}>
        <View style={styles.vaultHeader}>
          <Text style={[styles.vaultTitle, { color: theme.textSecondary }]}>
            SALDO TERKUNCI ESCROW
          </Text>
          <View style={[styles.ojkBadge, { backgroundColor: theme.surfaceSecondary }]}>
            <ShieldCheck size={11} color={theme.accent} strokeWidth={2.2} />
            <Text style={[styles.ojkText, { color: theme.textSecondary }]}>Mitra Perbankan</Text>
          </View>
        </View>

        <Text style={[styles.vaultAmount, { color: theme.text }]}>
          Rp 45.020.000
        </Text>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.vaultStatsRow}>
          <View style={styles.vaultStat}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Transaksi Aktif</Text>
            <Text style={[styles.statVal, { color: theme.text }]}>2 Lot Minyak</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.vaultStat}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Tingkat Keberhasilan</Text>
            <Text style={[styles.statVal, { color: theme.accent }]}>100% Terverifikasi</Text>
          </View>
        </View>
      </BentoCard>

      {/* 2. List of Active Escrow Orders */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>DAFTAR TRANSAKSI AKTIF</Text>

      {orders.map((order) => {
        const isDone = order.stage === 'FUNDS_RELEASED';

        return (
          <BentoCard key={order.id} mode={mode} style={styles.orderCard}>
            <View style={styles.orderTop}>
              <View>
                <Text style={[styles.orderNumber, { color: theme.text }]}>{order.orderNumber}</Text>
                <Text style={[styles.orderDate, { color: theme.textSecondary }]}>
                  Dibuat: {order.createdAt}
                </Text>
              </View>

              <View
                style={[
                  styles.statusChip,
                  { backgroundColor: isDone ? theme.accentTint : theme.oilAmberTint },
                ]}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    { color: isDone ? theme.accent : theme.oilAmber },
                  ]}
                >
                  {isDone ? 'Dana Dicairkan' : 'Proses Uji Mutu'}
                </Text>
              </View>
            </View>

            <Text style={[styles.listingTitle, { color: theme.text }]}>{order.listingTitle}</Text>

            {/* Inset Grouped Detail Table */}
            <View style={[styles.detailsTable, { backgroundColor: theme.surfaceSecondary }]}>
              <View style={styles.dRow}>
                <Text style={[styles.dLabel, { color: theme.textSecondary }]}>Pembeli / Eksportir</Text>
                <Text style={[styles.dVal, { color: theme.text }]}>{order.buyerName}</Text>
              </View>
              <View style={[styles.dDivider, { backgroundColor: theme.border }]} />
              <View style={styles.dRow}>
                <Text style={[styles.dLabel, { color: theme.textSecondary }]}>Penjual / Penyuling</Text>
                <Text style={[styles.dVal, { color: theme.text }]}>{order.sellerName}</Text>
              </View>
              <View style={[styles.dDivider, { backgroundColor: theme.border }]} />
              <View style={styles.dRow}>
                <Text style={[styles.dLabel, { color: theme.textSecondary }]}>Volume & Nilai</Text>
                <Text style={[styles.dVal, { color: theme.text, fontWeight: '700' }]}>
                  {formatKg(order.volumeKg)} ({formatRupiah(order.totalAmount)})
                </Text>
              </View>
              <View style={[styles.dDivider, { backgroundColor: theme.border }]} />
              <View style={styles.dRow}>
                <Text style={[styles.dLabel, { color: theme.textSecondary }]}>Collection Hub</Text>
                <Text style={[styles.dVal, { color: theme.text }]}>{order.hubLocation}</Text>
              </View>
            </View>

            {/* Stage Timeline Description */}
            <View style={[styles.stageBox, { backgroundColor: isDone ? theme.accentTint : theme.surfaceSecondary }]}>
              <View style={styles.stageHeader}>
                {isDone ? (
                  <Check size={14} color={theme.accent} strokeWidth={2.5} />
                ) : (
                  <Clock size={14} color={theme.oilAmber} strokeWidth={2.5} />
                )}
                <Text
                  style={[
                    styles.stageTitle,
                    { color: isDone ? theme.accent : theme.text },
                  ]}
                >
                  {order.stageTitle}
                </Text>
              </View>
              <Text
                style={[
                  styles.stageDesc,
                  { color: isDone ? theme.accent : theme.textSecondary },
                ]}
              >
                {order.stageDesc}
              </Text>
            </View>

            {/* Action Bar */}
            {!isDone ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSimulateApproval(order.id)}
                style={[styles.actionBtn, { backgroundColor: theme.accent }]}
              >
                <Text style={styles.actionBtnText}>Simulasikan Uji Lolos & Cairkan Dana</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.releasedNotice, { backgroundColor: theme.accentTint }]}>
                <CheckCircle2 size={16} color={theme.accent} strokeWidth={2.2} />
                <Text style={[styles.releasedNoticeText, { color: theme.accent }]}>
                  Dana {formatRupiah(order.totalAmount)} telah berhasil ditransfer ke penjual
                </Text>
              </View>
            )}
          </BentoCard>
        );
      })}

      <View style={{ height: 36 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  titleSection: {
    marginBottom: 12,
  },
  largeTitle: {
    fontFamily: SANS_FONT,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  titleCaption: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    marginTop: 2,
  },
  vaultCard: {
    marginBottom: 18,
  },
  vaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vaultTitle: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  ojkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ojkText: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    fontWeight: '600',
  },
  vaultAmount: {
    fontFamily: SANS_FONT,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  vaultStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vaultStat: {
    flex: 1,
  },
  statLabel: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    marginBottom: 2,
  },
  statVal: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '600',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    marginHorizontal: 10,
  },
  sectionHeading: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  orderCard: {
    marginBottom: 14,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  orderNumber: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '700',
  },
  orderDate: {
    fontFamily: SANS_FONT,
    fontSize: 11,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusChipText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  listingTitle: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailsTable: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  dRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  dLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
  },
  dVal: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '500',
  },
  dDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 3,
  },
  stageBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  stageTitle: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
  },
  stageDesc: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    lineHeight: 15,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionBtnText: {
    fontFamily: SANS_FONT,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  releasedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  releasedNoticeText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
  },
});
