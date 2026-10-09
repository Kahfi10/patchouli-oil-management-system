import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { CheckCircle2, MessageSquareShare } from 'lucide-react-native';
import { BentoCard } from '../../shared/components/BentoCard';
import { formatRupiah, formatPercent } from '../../shared/utils/formatters';
import { shareYieldCalculation } from '../../shared/utils/shareReport';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface YieldCalculatorScreenProps {
  mode: ThemeMode;
}

export const YieldCalculatorScreen: React.FC<YieldCalculatorScreenProps> = ({ mode }) => {
  const theme = getAppleTheme(mode);

  // States
  const [dryLeavesKg, setDryLeavesKg] = useState<string>('500');
  const [yieldRatePreset, setYieldRatePreset] = useState<number>(3.2); // 3.2% rendemen
  const [fuelCost, setFuelCost] = useState<string>('350000'); // Biaya bahan bakar
  const [laborCost, setLaborCost] = useState<string>('150000'); // Upah operator
  const [expectedPricePerKg, setExpectedPricePerKg] = useState<string>('1380000'); // Harga acuan

  // Numeric parse
  const leaves = parseFloat(dryLeavesKg) || 0;
  const fuel = parseFloat(fuelCost) || 0;
  const labor = parseFloat(laborCost) || 0;
  const priceKg = parseFloat(expectedPricePerKg) || 0;

  // Computations
  const estimatedOilKg = (leaves * yieldRatePreset) / 100;
  const totalCost = fuel + labor;
  const hppPerKg = estimatedOilKg > 0 ? totalCost / estimatedOilKg : 0;
  const grossRevenue = estimatedOilKg * priceKg;
  const netProfit = grossRevenue - totalCost;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  const presets = [
    { label: 'Konservatif', rate: 2.8 },
    { label: 'Standar', rate: 3.2 },
    { label: 'Optimal', rate: 3.6 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.canvas }]} showsVerticalScrollIndicator={false}>
      {/* iOS Large Title */}
      <View style={styles.titleSection}>
        <Text style={[styles.largeTitle, { color: theme.text }]}>Kalkulator Suling</Text>
        <Text style={[styles.titleCaption, { color: theme.textSecondary }]}>
          Simulasi rendemen ketel dan biaya pokok produksi (HPP)
        </Text>
      </View>

      {/* 1. Inset Grouped Section: Kapasitas Bahan Baku */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>BAHAN BAKU DAUN KERING</Text>
      <View style={[styles.groupedForm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.formRow}>
          <Text style={[styles.formLabel, { color: theme.text }]}>Berat Daun Kering</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              keyboardType="numeric"
              value={dryLeavesKg}
              onChangeText={setDryLeavesKg}
              style={[styles.numericInput, { color: theme.text }]}
              placeholder="500"
              placeholderTextColor={theme.textTertiary}
            />
            <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>kg</Text>
          </View>
        </View>

        <View style={[styles.rowDivider, { backgroundColor: theme.border }]} />

        {/* Preset Rendemen Segmented Control */}
        <View style={styles.formRowVertical}>
          <Text style={[styles.formLabel, { color: theme.text, marginBottom: 8 }]}>
            Target Rendemen Minyak:
          </Text>
          <View style={[styles.segmentedControl, { backgroundColor: theme.surfaceSecondary }]}>
            {presets.map((p) => {
              const isSelected = yieldRatePreset === p.rate;
              return (
                <TouchableOpacity
                  key={p.rate}
                  activeOpacity={0.8}
                  onPress={() => setYieldRatePreset(p.rate)}
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
                  >
                    {p.rate}% ({p.label})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* 2. Inset Grouped Section: Biaya Operasional Suling */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: 18 }]}>
        BIAYA OPERASIONAL (6-8 JAM SULING)
      </Text>
      <View style={[styles.groupedForm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.formRow}>
          <Text style={[styles.formLabel, { color: theme.text }]}>Bahan Bakar (Kayu/LPG)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              keyboardType="numeric"
              value={fuelCost}
              onChangeText={setFuelCost}
              style={[styles.numericInput, { color: theme.text }]}
            />
            <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>Rp</Text>
          </View>
        </View>

        <View style={[styles.rowDivider, { backgroundColor: theme.border }]} />

        <View style={styles.formRow}>
          <Text style={[styles.formLabel, { color: theme.text }]}>Upah Operator Ketel</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              keyboardType="numeric"
              value={laborCost}
              onChangeText={setLaborCost}
              style={[styles.numericInput, { color: theme.text }]}
            />
            <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>Rp</Text>
          </View>
        </View>

        <View style={[styles.rowDivider, { backgroundColor: theme.border }]} />

        <View style={styles.formRow}>
          <Text style={[styles.formLabel, { color: theme.text }]}>Target Harga Jual / kg</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              keyboardType="numeric"
              value={expectedPricePerKg}
              onChangeText={setExpectedPricePerKg}
              style={[styles.numericInput, { color: theme.text }]}
            />
            <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>Rp</Text>
          </View>
        </View>
      </View>

      {/* 3. Output Summary Inset Grouped Card */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: 18 }]}>
        HASIL SIMULASI PRODUKSI
      </Text>
      <BentoCard mode={mode} style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Text style={[styles.resultCardTitle, { color: theme.textSecondary }]}>
            Estimasi Minyak Murni
          </Text>
          <View style={[styles.rendemenBadge, { backgroundColor: theme.oilAmberTint }]}>
            <Text style={[styles.rendemenBadgeText, { color: theme.oilAmber }]}>
              {formatPercent(yieldRatePreset)} Rendemen
            </Text>
          </View>
        </View>

        <View style={styles.resultHeroRow}>
          <Text style={[styles.oilNumber, { color: theme.text }]}>
            {estimatedOilKg.toFixed(2)}{' '}
            <Text style={[styles.oilUnit, { color: theme.textSecondary }]}>kg</Text>
          </Text>
          <Text style={[styles.oilLiter, { color: theme.textSecondary }]}>
            &asymp; {(estimatedOilKg * 1.05).toFixed(1)} Liter
          </Text>
        </View>

        <View style={[styles.rowDivider, { backgroundColor: theme.border, marginVertical: 12 }]} />

        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Laba Bersih Per Siklus</Text>
          <Text style={[styles.statValue, { color: theme.accent }]}>
            {formatRupiah(netProfit)} ({profitMargin.toFixed(1)}%)
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>HPP Operasional / kg</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatRupiah(hppPerKg)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Biaya Suling</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatRupiah(totalCost)}
          </Text>
        </View>

        <View style={[styles.adviceNotice, { backgroundColor: theme.accentTint }]}>
          <CheckCircle2 size={15} color={theme.accent} strokeWidth={2.2} />
          <Text style={[styles.adviceText, { color: theme.accent }]}>
            Rendemen {yieldRatePreset}% tergolong sehat. Jaga tekanan uap ketel stabil di 1.5–2.0 bar untuk menjaga warna jernih minyak.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            shareYieldCalculation({
              dryLeavesKg: leaves,
              yieldRate: yieldRatePreset,
              oilKg: estimatedOilKg,
              fuelCost: fuel,
              laborCost: labor,
              expectedPrice: priceKg,
              netProfit: netProfit,
            })
          }
          style={styles.waShareBtn}
        >
          <MessageSquareShare size={16} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.waShareBtnText}>Bagikan Rincian HPP ke WhatsApp</Text>
        </TouchableOpacity>
      </BentoCard>

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
  sectionHeading: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 6,
    marginLeft: 4,
  },
  groupedForm: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  formRowVertical: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  formLabel: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  numericInput: {
    fontFamily: SANS_FONT,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 80,
    padding: 0,
  },
  unitLabel: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '500',
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 14,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 9,
    padding: 2,
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
    fontSize: 11,
  },
  resultCard: {
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCardTitle: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
  },
  rendemenBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rendemenBadgeText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  resultHeroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 8,
  },
  oilNumber: {
    fontFamily: SANS_FONT,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  oilUnit: {
    fontSize: 18,
    fontWeight: '400',
  },
  oilLiter: {
    fontFamily: SANS_FONT,
    fontSize: 13,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontFamily: SANS_FONT,
    fontSize: 13,
  },
  statValue: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '600',
  },
  adviceNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  adviceText: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  waShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  waShareBtnText: {
    fontFamily: SANS_FONT,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
