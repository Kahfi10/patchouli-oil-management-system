import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { ShieldCheck, CheckCircle2, ChevronRight, X, Lock, Sparkles, Filter } from 'lucide-react-native';
import { BentoCard } from '../../shared/components/BentoCard';
import { MOCK_LISTINGS, MarketListing } from '../../data/mockData';
import { formatRupiah, formatKg, evaluatePatchouliQuality } from '../../shared/utils/formatters';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface MarketplaceScreenProps {
  mode: ThemeMode;
  onNavigateToEscrow: () => void;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  mode,
  onNavigateToEscrow,
}) => {
  const theme = getAppleTheme(mode);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PA_SUPER' | 'STAINLESS'>('ALL');
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);
  const [dealSuccess, setDealSuccess] = useState(false);

  const filteredListings = MOCK_LISTINGS.filter((item) => {
    if (activeFilter === 'PA_SUPER') return item.paPercentage >= 33.5;
    if (activeFilter === 'STAINLESS') return item.boilerType.includes('Stainless');
    return true;
  });

  const handleOrderViaEscrow = () => {
    setDealSuccess(true);
    setTimeout(() => {
      setDealSuccess(false);
      setSelectedListing(null);
      onNavigateToEscrow();
    }, 1100);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas }]}>
      {/* iOS Large Title Section */}
      <View style={styles.titleSection}>
        <Text style={[styles.largeTitle, { color: theme.text }]}>Bursa Nilam</Text>
        <Text style={[styles.titleCaption, { color: theme.textSecondary }]}>
          Katalog lot minyak terverifikasi lab & garansi pembayaran aman
        </Text>
      </View>

      {/* Apple Segmented Control Filter */}
      <View style={[styles.filterContainer, { backgroundColor: theme.surfaceSecondary }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveFilter('ALL')}
          style={[styles.filterTab, activeFilter === 'ALL' && [styles.filterTabActive, { backgroundColor: theme.surface }]]}
        >
          <Text style={[styles.filterLabel, { color: activeFilter === 'ALL' ? theme.text : theme.textSecondary }, activeFilter === 'ALL' && { fontWeight: '700' }]}>
            Semua Lot ({MOCK_LISTINGS.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveFilter('PA_SUPER')}
          style={[styles.filterTab, activeFilter === 'PA_SUPER' && [styles.filterTabActive, { backgroundColor: theme.surface }]]}
        >
          <Text style={[styles.filterLabel, { color: activeFilter === 'PA_SUPER' ? theme.text : theme.textSecondary }, activeFilter === 'PA_SUPER' && { fontWeight: '700' }]}>
            PA &ge; 33.5%
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveFilter('STAINLESS')}
          style={[styles.filterTab, activeFilter === 'STAINLESS' && [styles.filterTabActive, { backgroundColor: theme.surface }]]}
        >
          <Text style={[styles.filterLabel, { color: activeFilter === 'STAINLESS' ? theme.text : theme.textSecondary }, activeFilter === 'STAINLESS' && { fontWeight: '700' }]}>
            Ketel Stainless
          </Text>
        </TouchableOpacity>
      </View>

      {/* Listings Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
          PENAWARAN TERBUKA ({filteredListings.length} LOT)
        </Text>

        {filteredListings.map((listing) => {
          const totalVal = listing.volumeKg * listing.pricePerKg;

          return (
            <BentoCard
              key={listing.id}
              mode={mode}
              style={styles.listingCard}
              onPress={() => setSelectedListing(listing)}
            >
              {/* Header: Seller & PA Grade */}
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.sellerRow}>
                    <Text style={[styles.sellerName, { color: theme.text }]}>{listing.sellerName}</Text>
                    {listing.verifiedKYC && (
                      <View style={[styles.kycBadge, { backgroundColor: theme.accentTint }]}>
                        <ShieldCheck size={11} color={theme.accent} strokeWidth={2.4} />
                        <Text style={[styles.kycText, { color: theme.accent }]}>KYC</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.regionText, { color: theme.textSecondary }]}>
                    {listing.region} • Rating {listing.sellerRating} ★
                  </Text>
                </View>

                {/* PA Badge */}
                <View style={[styles.paBadge, { backgroundColor: theme.accentTint }]}>
                  <Text style={[styles.paText, { color: theme.accent }]}>
                    PA {listing.paPercentage}%
                  </Text>
                </View>
              </View>

              {/* Specs Table */}
              <View style={[styles.specsTable, { backgroundColor: theme.surfaceSecondary }]}>
                <View style={styles.specCell}>
                  <Text style={[styles.specLabel, { color: theme.textSecondary }]}>Stok Tersedia</Text>
                  <Text style={[styles.specVal, { color: theme.text }]}>{formatKg(listing.volumeKg)}</Text>
                </View>
                <View style={[styles.specDivider, { backgroundColor: theme.border }]} />
                <View style={styles.specCell}>
                  <Text style={[styles.specLabel, { color: theme.textSecondary }]}>Ketel Suling</Text>
                  <Text style={[styles.specVal, { color: theme.text }]} numberOfLines={1}>
                    {listing.boilerType.split(' ')[0]} {listing.boilerType.split(' ')[1] || ''}
                  </Text>
                </View>
                <View style={[styles.specDivider, { backgroundColor: theme.border }]} />
                <View style={styles.specCell}>
                  <Text style={[styles.specLabel, { color: theme.textSecondary }]}>Sertifikasi</Text>
                  <Text style={[styles.specVal, { color: theme.accent }]}>SNI Mutu 1</Text>
                </View>
              </View>

              {/* Price & Action */}
              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={[styles.priceTag, { color: theme.text }]}>
                    {formatRupiah(listing.pricePerKg)}
                    <Text style={[styles.priceUnit, { color: theme.textSecondary }]}> / kg</Text>
                  </Text>
                  <Text style={[styles.totalTag, { color: theme.textTertiary }]}>
                    Total Lot: {formatRupiah(totalVal)}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedListing(listing)}
                  style={[styles.orderBtn, { backgroundColor: theme.accent }]}
                >
                  <Lock size={13} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.orderBtnText}>Pesan Escrow</Text>
                </TouchableOpacity>
              </View>
            </BentoCard>
          );
        })}
      </ScrollView>

      {/* Escrow Detail Sheet Modal */}
      {selectedListing && (
        <Modal visible={true} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { backgroundColor: theme.surface }]}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Konfirmasi Pesanan Escrow</Text>
                  <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                    Garansi dana tertahan aman hingga uji lab selesai
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedListing(null)}
                  style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
                >
                  <X size={18} color={theme.text} />
                </TouchableOpacity>
              </View>

              {/* Order Summary Inset */}
              <View style={[styles.orderSummaryCard, { backgroundColor: theme.surfaceSecondary }]}>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Penjual</Text>
                  <Text style={[styles.summaryValue, { color: theme.text }]}>
                    {selectedListing.sellerName} ({selectedListing.region})
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Volume Minyak</Text>
                  <Text style={[styles.summaryValue, { color: theme.text }]}>
                    {selectedListing.volumeKg} kg (Jeriken Segel)
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Kadar Terverifikasi</Text>
                  <Text style={[styles.summaryValue, { color: theme.accent }]}>
                    PA {selectedListing.paPercentage}% (SNI Mutu Super)
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Harga Satuan</Text>
                  <Text style={[styles.summaryValue, { color: theme.text }]}>
                    {formatRupiah(selectedListing.pricePerKg)} / kg
                  </Text>
                </View>

                <View style={[styles.sheetDivider, { backgroundColor: theme.border }]} />

                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabelBold, { color: theme.text }]}>Total Nilai Transaksi</Text>
                  <Text style={[styles.summaryValHighlight, { color: theme.accent }]}>
                    {formatRupiah(selectedListing.volumeKg * selectedListing.pricePerKg)}
                  </Text>
                </View>
              </View>

              {/* Escrow Guarantee Notice */}
              <View style={[styles.guaranteeBox, { backgroundColor: theme.accentTint }]}>
                <Lock size={16} color={theme.accent} strokeWidth={2.2} />
                <Text style={[styles.guaranteeText, { color: theme.accent }]}>
                  Dana Anda disimpan di Rekening Escrow Terpercaya. Dana hanya akan diteruskan ke penjual setelah jeriken sampai dan hasil uji kadar PA% diverifikasi pembeli.
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleOrderViaEscrow}
                disabled={dealSuccess}
                style={[
                  styles.confirmBtn,
                  { backgroundColor: dealSuccess ? theme.accent : theme.accent },
                ]}
              >
                {dealSuccess ? (
                  <>
                    <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.confirmBtnText}>Pesanan Escrow Dibuat!</Text>
                  </>
                ) : (
                  <>
                    <Lock size={17} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.confirmBtnText}>Kunci Pesanan ke Vault Escrow</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
    lineHeight: 18,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 3,
    marginBottom: 10,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 9,
  },
  filterTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  filterLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
  },
  sectionHeading: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 8,
    marginLeft: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  listingCard: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerName: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '700',
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  kycText: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    fontWeight: '700',
  },
  regionText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 2,
  },
  paBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '700',
  },
  specsTable: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 9,
    marginVertical: 10,
  },
  specCell: {
    flex: 1,
    alignItems: 'center',
  },
  specLabel: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    fontWeight: '500',
  },
  specVal: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  specDivider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    fontFamily: SANS_FONT,
    fontSize: 16,
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  totalTag: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    marginTop: 1,
  },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  orderBtnText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: SANS_FONT,
    fontSize: 18,
    fontWeight: '700',
  },
  modalSub: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderSummaryCard: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
  },
  summaryValue: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
  },
  sheetDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  summaryLabelBold: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryValHighlight: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '800',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  guaranteeText: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  confirmBtnText: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
