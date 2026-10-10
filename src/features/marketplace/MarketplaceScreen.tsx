import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { ShieldCheck, CheckCircle2, ChevronRight, X, Lock } from 'lucide-react-native';
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
    }, 1200);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas }]}>
      {/* iOS Large Title Section */}
      <View style={styles.titleSection}>
        <Text style={[styles.largeTitle, { color: theme.text }]}>Bursa Nilam</Text>
        <Text style={[styles.titleCaption, { color: theme.textSecondary }]}>
          Penawaran terbuka dengan verifikasi laboratorium dan garansi escrow
        </Text>
      </View>

      {/* Apple Segmented Control Filter */}
      <View style={[styles.segmentedControl, { backgroundColor: theme.surfaceSecondary }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveFilter('ALL')}
          style={[styles.segmentTab, activeFilter === 'ALL' && [styles.segmentActive, { backgroundColor: theme.surface }]]}
        >
          <Text style={[styles.segmentLabel, { color: activeFilter === 'ALL' ? theme.text : theme.textSecondary }]}>
            Semua Lot ({MOCK_LISTINGS.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveFilter('PA_SUPER')}
          style={[styles.segmentTab, activeFilter === 'PA_SUPER' && [styles.segmentActive, { backgroundColor: theme.surface }]]}
        >
          <Text style={[styles.segmentLabel, { color: activeFilter === 'PA_SUPER' ? theme.text : theme.textSecondary }]}>
            PA &ge; 33.5%
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveFilter('STAINLESS')}
          style={[styles.segmentTab, activeFilter === 'STAINLESS' && [styles.segmentActive, { backgroundColor: theme.surface }]]}
        >
          <Text style={[styles.segmentLabel, { color: activeFilter === 'STAINLESS' ? theme.text : theme.textSecondary }]}>
            Ketel Stainless
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feed List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {filteredListings.map((listing) => {
          const quality = evaluatePatchouliQuality(listing.paPercentage);
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
                        <ShieldCheck size={11} color={theme.accent} strokeWidth={2.2} />
                        <Text style={[styles.kycText, { color: theme.accent }]}>KYC</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.regionText, { color: theme.textSecondary }]}>
                    {listing.region} • Rating {listing.sellerRating}
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
                  <Text style={[styles.specLabel, { color: theme.textSecondary }]}>Jenis Ketel</Text>
                  <Text style={[styles.specVal, { color: theme.text }]} numberOfLines={1}>
                    {listing.boilerType}
                  </Text>
                </View>
                <View style={[styles.specDivider, { backgroundColor: theme.border }]} />
                <View style={styles.specCell}>
                  <Text style={[styles.specLabel, { color: theme.textSecondary }]}>Sertifikasi</Text>
                  <Text style={[styles.specVal, { color: theme.accent }]}>SNI A</Text>
                </View>
              </View>

              {/* Price & Purchase Action */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={[styles.priceValue, { color: theme.text }]}>
                    {formatRupiah(listing.pricePerKg)}
                    <Text style={[styles.priceUnit, { color: theme.textSecondary }]}> / kg</Text>
                  </Text>
                  <Text style={[styles.totalBatchVal, { color: theme.textSecondary }]}>
                    Total Lot: {formatRupiah(totalVal)}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedListing(listing)}
                  style={[styles.buyBtn, { backgroundColor: theme.accent }]}
                >
                  <Text style={styles.buyBtnText}>Pesan via Escrow</Text>
                  <ChevronRight size={14} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </BentoCard>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Apple Sheet Style Order Modal */}
      {selectedListing && (
        <Modal visible={!!selectedListing} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Konfirmasi Pesanan</Text>
                  <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                    {selectedListing.sellerName} ({selectedListing.region})
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedListing(null)}
                  style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
                >
                  <X size={18} color={theme.text} />
                </TouchableOpacity>
              </View>

              <View style={[styles.summaryBox, { backgroundColor: theme.surfaceSecondary }]}>
                <View style={styles.sumRow}>
                  <Text style={[styles.sumLabel, { color: theme.textSecondary }]}>Volume Minyak</Text>
                  <Text style={[styles.sumVal, { color: theme.text }]}>{formatKg(selectedListing.volumeKg)}</Text>
                </View>
                <View style={styles.sumRow}>
                  <Text style={[styles.sumLabel, { color: theme.textSecondary }]}>Kadar Patchouli Alcohol</Text>
                  <Text style={[styles.sumVal, { color: theme.accent, fontWeight: '700' }]}>
                    {selectedListing.paPercentage}%
                  </Text>
                </View>
                <View style={styles.sumRow}>
                  <Text style={[styles.sumLabel, { color: theme.textSecondary }]}>Harga Satuan</Text>
                  <Text style={[styles.sumVal, { color: theme.text }]}>{formatRupiah(selectedListing.pricePerKg)} / kg</Text>
                </View>
                <View style={[styles.sumDivider, { backgroundColor: theme.border }]} />
                <View style={styles.sumRow}>
                  <Text style={[styles.sumLabel, { color: theme.text, fontWeight: '600' }]}>Total Nilai Escrow</Text>
                  <Text style={[styles.sumTotal, { color: theme.text }]}>
                    {formatRupiah(selectedListing.volumeKg * selectedListing.pricePerKg)}
                  </Text>
                </View>
              </View>

              <View style={[styles.escrowNotice, { backgroundColor: theme.accentTint }]}>
                <Lock size={16} color={theme.accent} strokeWidth={2.2} />
                <Text style={[styles.escrowNoticeText, { color: theme.accent }]}>
                  Dana diamankan di Rekening Bersama. Pencairan otomatis setelah uji mutu dan timbangan fisik diverifikasi di sentra hub.
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleOrderViaEscrow}
                disabled={dealSuccess}
                style={[styles.actionBtn, { backgroundColor: theme.accent }]}
              >
                {dealSuccess ? (
                  <>
                    <CheckCircle2 size={18} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>Pesanan Escrow Dibuat</Text>
                  </>
                ) : (
                  <Text style={styles.actionBtnText}>Kunci Dana di Rekening Bersama</Text>
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
    paddingTop: 12,
  },
  titleSection: {
    paddingHorizontal: 16,
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
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 9,
    padding: 2,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 7,
  },
  segmentActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listingCard: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerName: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '600',
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  kycText: {
    fontFamily: SANS_FONT,
    fontSize: 9,
    fontWeight: '700',
  },
  regionText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 2,
  },
  paBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '700',
  },
  specsTable: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  specCell: {
    flex: 1,
    alignItems: 'center',
  },
  specLabel: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    marginBottom: 2,
  },
  specVal: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
  },
  specDivider: {
    width: StyleSheet.hairlineWidth,
    height: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceValue: {
    fontFamily: SANS_FONT,
    fontSize: 18,
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: 13,
    fontWeight: '400',
  },
  totalBatchVal: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    marginTop: 1,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyBtnText: {
    fontFamily: SANS_FONT,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    padding: 20,
    paddingBottom: 36,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBox: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sumLabel: {
    fontFamily: SANS_FONT,
    fontSize: 13,
  },
  sumVal: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '600',
  },
  sumDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 6,
  },
  sumTotal: {
    fontFamily: SANS_FONT,
    fontSize: 16,
    fontWeight: '700',
  },
  escrowNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  escrowNoticeText: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 11,
    lineHeight: 15,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnText: {
    fontFamily: SANS_FONT,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
