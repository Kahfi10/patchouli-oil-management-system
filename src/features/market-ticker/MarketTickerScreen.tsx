import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownRight, ChevronRight, Calculator, ShoppingBag, Layers, Stethoscope } from 'lucide-react-native';
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.canvas }]} showsVerticalScrollIndicator={false}>
      {/* iOS Large Title Section */}
      <View style={styles.titleSection}>
        <Text style={[styles.largeTitle, { color: theme.text }]}>Pasar Nilam</Text>
        <Text style={[styles.titleCaption, { color: theme.textSecondary }]}>
          Pembaruan {selectedRegion.lastUpdated}
        </Text>
      </View>

      {/* Apple iOS Segmented Control */}
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
                  isSelected && { fontWeight: '600' },
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
      </BentoCard>

      {/* Apple Inset Grouped Quick Actions */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>OPERASIONAL TANI</Text>
      
      <View style={[styles.groupedList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => onNavigateTab('kalkulator')}
          style={[styles.listItem, { borderBottomColor: theme.border }]}
        >
          <View style={[styles.listIconBox, { backgroundColor: theme.oilAmberTint }]}>
            <Calculator size={18} color={theme.oilAmber} strokeWidth={2} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: theme.text }]}>Kalkulator Rendemen & HPP</Text>
            <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
              Simulasi hasil minyak dan biaya operasional suling
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
            <Stethoscope size={18} color={theme.accent} strokeWidth={2} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: theme.text }]}>Diagnosa Daun Nilam</Text>
            <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
              Inspeksi penyakit layu bakteri (Ralstonia) & kesiapan suling
            </Text>
          </View>
          <ChevronRight size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => onNavigateTab('marketplace')}
          style={[styles.listItem, { borderBottomColor: theme.border }]}
        >
          <View style={[styles.listIconBox, { backgroundColor: theme.surfaceSecondary }]}>
            <ShoppingBag size={18} color={theme.text} strokeWidth={2} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: theme.text }]}>Bursa Penawaran Terbuka</Text>
            <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
              Daftar lot minyak nilam terverifikasi laboratorium
            </Text>
          </View>
          <ChevronRight size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => onNavigateTab('ketel')}
          style={styles.listItem}
        >
          <View style={[styles.listIconBox, { backgroundColor: theme.surfaceSecondary }]}>
            <Layers size={18} color={theme.text} strokeWidth={2} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: theme.text }]}>Batch Suling & QR Passport</Text>
            <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
              Pencatatan produksi, stopwatch suling & label QR
            </Text>
          </View>
          <ChevronRight size={18} color={theme.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* SNI Quality Standard Note Card */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: 24 }]}>STANDAR MUTU SNI 06-2385-2006</Text>
      <BentoCard mode={mode} style={styles.sniCard}>
        <View style={styles.sniRow}>
          <View style={styles.sniItem}>
            <Text style={[styles.sniLabel, { color: theme.textSecondary }]}>Kadar PA Minimal</Text>
            <Text style={[styles.sniVal, { color: theme.text }]}>&ge; 30.0%</Text>
          </View>
          <View style={[styles.sniDivider, { backgroundColor: theme.border }]} />
          <View style={styles.sniItem}>
            <Text style={[styles.sniLabel, { color: theme.textSecondary }]}>Kadar Air Maksimal</Text>
            <Text style={[styles.sniVal, { color: theme.text }]}>&le; 1.0%</Text>
          </View>
          <View style={[styles.sniDivider, { backgroundColor: theme.border }]} />
          <View style={styles.sniItem}>
            <Text style={[styles.sniLabel, { color: theme.textSecondary }]}>Indeks Bias (20C)</Text>
            <Text style={[styles.sniVal, { color: theme.text }]}>1.507 - 1.515</Text>
          </View>
        </View>
      </BentoCard>

      <View style={{ height: 32 }} />
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
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 9,
    padding: 2,
    marginBottom: 14,
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
  heroCard: {
    marginBottom: 18,
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
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: SANS_FONT,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  priceUnit: {
    fontSize: 15,
    fontWeight: '400',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    marginBottom: 2,
  },
  metaValue: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeading: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  groupedList: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
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
  },
  sniCard: {
    paddingVertical: 14,
  },
  sniRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sniItem: {
    flex: 1,
    alignItems: 'center',
  },
  sniLabel: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    marginBottom: 3,
  },
  sniVal: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '700',
  },
  sniDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
  },
});
