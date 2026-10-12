import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownRight, ChevronRight, Calculator, ShoppingBag, Layers, Stethoscope, Clock, TrendingUp, Sparkles } from 'lucide-react-native';
import { BentoCard } from '../../shared/components/BentoCard';
import { InteractivePriceChart } from '../../shared/components/InteractivePriceChart';
import { REGIONAL_PRICES, RegionalPrice } from '../../data/mockData';
import { formatRupiah } from '../../shared/utils/formatters';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface MarketTickerScreenProps {
  mode: ThemeMode;
  onNavigateTab: (tab: 'kalkulator' | 'marketplace' | 'ketel' | 'escrow' | 'diagnosa') => void;
}

export const MarketTickerScreen: React.FC<MarketTickerScreenProps> = ({
  mode,
  onNavigateTab,
}) => {
  const theme = getAppleTheme(mode);
  const [selectedRegion, setSelectedRegion] = useState<RegionalPrice>(REGIONAL_PRICES[0]);

  // Calculate national average
  const totalSum = REGIONAL_PRICES.reduce((acc, curr) => acc + curr.pricePerKg, 0);
  const nationalAvg = Math.round(totalSum / REGIONAL_PRICES.length);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.canvas }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* iOS Large Title Section */}
      <View style={styles.titleSection}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.largeTitle, { color: theme.text }]}>Pasar Nilam</Text>
          <Text style={[styles.titleCaption, { color: theme.textSecondary }]}>
            Pembaruan bursa regional • {selectedRegion.lastUpdated}
          </Text>
        </View>
        <View style={[styles.liveStatusBadge, { backgroundColor: theme.accentTint }]}>
          <View style={[styles.liveDot, { backgroundColor: theme.accent }]} />
          <Text style={[styles.liveStatusText, { color: theme.accent }]}>Live SNI</Text>
        </View>
      </View>

      {/* National Overview Bento Bar */}
      <View style={[styles.nationalBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.nationalCell}>
          <Text style={[styles.nationalLabel, { color: theme.textSecondary }]}>Rata-Rata Nasional</Text>
          <Text style={[styles.nationalValue, { color: theme.text }]}>{formatRupiah(nationalAvg)}</Text>
        </View>
        <View style={[styles.nationalDivider, { backgroundColor: theme.border }]} />
        <View style={styles.nationalCell}>
          <Text style={[styles.nationalLabel, { color: theme.textSecondary }]}>Harga Tertinggi</Text>
          <Text style={[styles.nationalValue, { color: theme.accent }]}>Rp 1.420.000</Text>
          <Text style={[styles.nationalSub, { color: theme.textTertiary }]}>Aceh (PA 34%)</Text>
        </View>
        <View style={[styles.nationalDivider, { backgroundColor: theme.border }]} />
        <View style={styles.nationalCell}>
          <Text style={[styles.nationalLabel, { color: theme.textSecondary }]}>Tren Pasar</Text>
          <View style={styles.trendRow}>
            <TrendingUp size={13} color={theme.accent} strokeWidth={2.5} />
            <Text style={[styles.trendText, { color: theme.accent }]}>Stabil Naik</Text>
          </View>
          <Text style={[styles.nationalSub, { color: theme.textTertiary }]}>Permintaan Ekspor</Text>
        </View>
      </View>

      {/* Apple iOS Segmented Control */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: 18 }]}>
        SENTRA PRODUKSI REGIONAL
      </Text>
      <View style={[styles.segmentedControl, { backgroundColor: theme.surfaceSecondary }]}>
        {REGIONAL_PRICES.map((item) => {
          const isSelected = selectedRegion.id === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => setSelectedRegion(item)}
              style={[
                styles.segmentTab,
                isSelected && [styles.segmentActive, { backgroundColor: theme.surface }],
              ]}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  { color: isSelected ? theme.text : theme.textSecondary },
                  isSelected && { fontWeight: '700' },
                ]}
                numberOfLines={1}
              >
                {item.region.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Hero Price Inset Grouped Card with Interactive Chart */}
      <BentoCard mode={mode} style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={[styles.regionName, { color: theme.textSecondary }]}>
              {selectedRegion.region}, {selectedRegion.province}
            </Text>
            <Text style={[styles.priceValue, { color: theme.text }]}>
              {formatRupiah(selectedRegion.pricePerKg)}
              <Text style={[styles.priceUnit, { color: theme.textSecondary }]}> / kg</Text>
            </Text>
          </View>

          <View
            style={[
              styles.changeBadge,
              {
                backgroundColor: selectedRegion.trend === 'up' ? theme.accentTint : theme.dangerTint,
              },
            ]}
          >
            {selectedRegion.trend === 'up' ? (
              <ArrowUpRight size={14} color={theme.accent} strokeWidth={2.5} />
            ) : (
              <ArrowDownRight size={14} color={theme.danger} strokeWidth={2.5} />
            )}
            <Text
              style={[
                styles.changeText,
                { color: selectedRegion.trend === 'up' ? theme.accent : theme.danger },
              ]}
            >
              {selectedRegion.change24h > 0 ? `+${selectedRegion.change24h}%` : `${selectedRegion.change24h}%`}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Interactive 7D / 30D / 1Y Price Chart */}
        <InteractivePriceChart
          basePrice={selectedRegion.pricePerKg}
          mode={mode}
          regionName={selectedRegion.region}
        />

        {/* Quick Shortcut: Calculate with this price */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onNavigateTab('kalkulator')}
          style={[styles.calcShortcutBtn, { backgroundColor: theme.surfaceSecondary }]}
        >
          <Calculator size={15} color={theme.accent} strokeWidth={2} />
          <Text style={[styles.calcShortcutText, { color: theme.text }]}>
            Simulasi Laba dengan Harga {selectedRegion.region.split(' ')[0]}
          </Text>
          <ChevronRight size={15} color={theme.textTertiary} />
        </TouchableOpacity>
      </BentoCard>

      {/* Apple Inset Grouped Quick Actions */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: 22 }]}>
        MENU OPERASIONAL TANI
      </Text>
      
      <View style={[styles.groupedList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => onNavigateTab('kalkulator')}
          style={[styles.listItem, { borderBottomColor: theme.border }]}
        >
          <View style={[styles.listIconBox, { backgroundColor: theme.oilAmberTint }]}>
            <Calculator size={19} color={theme.oilAmber} strokeWidth={2} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: theme.text }]}>Kalkulator Rendemen & HPP</Text>
            <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
              Hitung rendemen daun, biaya suling, & margin laba
            </Text>
          </View>
          <ChevronRight size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => onNavigateTab('ketel')}
          style={[styles.listItem, { borderBottomColor: theme.border }]}
        >
          <View style={[styles.listIconBox, { backgroundColor: theme.surfaceSecondary }]}>
            <Clock size={19} color={theme.text} strokeWidth={2} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: theme.text }]}>Stopwatch Ketel & Batch Suling</Text>
            <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
              Monitoring fase distilasi 6-8 jam & Paspor QR
            </Text>
          </View>
          <ChevronRight size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => onNavigateTab('diagnosa')}
          style={[styles.listItem, { borderBottomColor: theme.border }]}
        >
          <View style={[styles.listIconBox, { backgroundColor: theme.accentTint }]}>
            <Stethoscope size={19} color={theme.accent} strokeWidth={2} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: theme.text }]}>Diagnosa Daun Nilam</Text>
            <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
              Inspeksi penyakit layu bakteri & kesiapan petik daun
            </Text>
          </View>
          <ChevronRight size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => onNavigateTab('marketplace')}
          style={[styles.listItem, { borderBottomWidth: 0 }]}
        >
          <View style={[styles.listIconBox, { backgroundColor: theme.accentTint }]}>
            <ShoppingBag size={19} color={theme.accent} strokeWidth={2} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: theme.text }]}>Bursa Minyak & Escrow</Text>
            <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
              Katalog lot minyak terverifikasi & transaksi aman
            </Text>
          </View>
          <ChevronRight size={18} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
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
    marginTop: 3,
  },
  liveStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveStatusText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  nationalBar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  nationalCell: {
    flex: 1,
    alignItems: 'center',
  },
  nationalLabel: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    fontWeight: '500',
  },
  nationalValue: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  nationalSub: {
    fontFamily: SANS_FONT,
    fontSize: 9,
    marginTop: 1,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  trendText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '700',
  },
  nationalDivider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  sectionHeading: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 8,
    marginLeft: 4,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 9,
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
  },
  heroCard: {
    padding: 16,
    borderRadius: 18,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  regionName: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '500',
  },
  priceValue: {
    fontFamily: SANS_FONT,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  priceUnit: {
    fontSize: 16,
    fontWeight: '400',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  calcShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  calcShortcutText: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  groupedList: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '600',
  },
  listSubtitle: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
});
