import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native';
import { CheckCircle2, MessageSquareShare, Plus, Minus, Sparkles, TrendingUp, DollarSign, Scale, Flame } from 'lucide-react-native';
import { BentoCard } from '../../shared/components/BentoCard';
import { formatRupiah, formatPercent } from '../../shared/utils/formatters';
import { shareYieldCalculation } from '../../shared/utils/shareReport';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface YieldCalculatorScreenProps {
  mode: ThemeMode;
}

type LeafMoistureState = 'kering' | 'layu' | 'basah';

export const YieldCalculatorScreen: React.FC<YieldCalculatorScreenProps> = ({ mode }) => {
  const theme = getAppleTheme(mode);

  // States
  const [dryLeavesKg, setDryLeavesKg] = useState<string>('500');
  const [leafState, setLeafState] = useState<LeafMoistureState>('kering');
  const [yieldRatePreset, setYieldRatePreset] = useState<number>(3.2); // 3.2% rendemen
  const [fuelCost, setFuelCost] = useState<string>('350000'); // Biaya bahan bakar
  const [laborCost, setLaborCost] = useState<string>('150000'); // Upah operator
  const [expectedPricePerKg, setExpectedPricePerKg] = useState<string>('1380000'); // Harga acuan

  // Numeric parse
  const leaves = Math.max(0, parseFloat(dryLeavesKg) || 0);
  const fuel = Math.max(0, parseFloat(fuelCost) || 0);
  const labor = Math.max(0, parseFloat(laborCost) || 0);
  const priceKg = Math.max(0, parseFloat(expectedPricePerKg) || 0);

  // Computations
  const estimatedOilKg = (leaves * yieldRatePreset) / 100;
  const totalCost = fuel + labor;
  const hppPerKg = estimatedOilKg > 0 ? totalCost / estimatedOilKg : 0;
  const grossRevenue = estimatedOilKg * priceKg;
  const netProfit = grossRevenue - totalCost;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  // Reactive result pop animator
  const resultScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(resultScaleAnim, {
        toValue: 1.05,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(resultScaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [estimatedOilKg, netProfit]);

  // Presets
  const quickWeightPresets = [250, 500, 750, 1000];

  const presets = [
    { label: 'Konservatif', rate: 2.8 },
    { label: 'Standar SNI', rate: 3.2 },
    { label: 'Optimal Super', rate: 3.6 },
  ];

  const handleAdjustWeight = (delta: number) => {
    const nextVal = Math.max(0, leaves + delta);
    setDryLeavesKg(nextVal.toString());
  };

  const handleSelectLeafCondition = (state: LeafMoistureState) => {
    setLeafState(state);
    if (state === 'kering') setYieldRatePreset(3.4);
    else if (state === 'layu') setYieldRatePreset(2.8);
    else if (state === 'basah') setYieldRatePreset(1.8);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.canvas }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* iOS Large Title */}
      <View style={styles.titleSection}>
        <Text style={[styles.largeTitle, { color: theme.text }]}>Kalkulator Suling</Text>
        <Text style={[styles.titleCaption, { color: theme.textSecondary }]}>
          Simulasi rendemen biomassa dan Harga Pokok Produksi (HPP) per kg
        </Text>
      </View>

      {/* 1. Kondisi Fisik Daun Nilam (Quick Leaf State) */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>KONDISI DAUN DI KEBUN</Text>
      <View style={[styles.leafStateRow, { backgroundColor: theme.surfaceSecondary }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSelectLeafCondition('kering')}
          style={[
            styles.leafStateTab,
            leafState === 'kering' && [styles.leafStateActive, { backgroundColor: theme.surface }],
          ]}
        >
          <Text
            style={[
              styles.leafStateTitle,
              { color: leafState === 'kering' ? theme.accent : theme.textSecondary },
              leafState === 'kering' && { fontWeight: '700' },
            ]}
          >
            Kering Angin
          </Text>
          <Text style={[styles.leafStateSub, { color: theme.textTertiary }]}>Air 12-15% • Suling</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSelectLeafCondition('layu')}
          style={[
            styles.leafStateTab,
            leafState === 'layu' && [styles.leafStateActive, { backgroundColor: theme.surface }],
          ]}
        >
          <Text
            style={[
              styles.leafStateTitle,
              { color: leafState === 'layu' ? theme.oilAmber : theme.textSecondary },
              leafState === 'layu' && { fontWeight: '700' },
            ]}
          >
            Layu Sebagian
          </Text>
          <Text style={[styles.leafStateSub, { color: theme.textTertiary }]}>Air 20-30%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleSelectLeafCondition('basah')}
          style={[
            styles.leafStateTab,
            leafState === 'basah' && [styles.leafStateActive, { backgroundColor: theme.surface }],
          ]}
        >
          <Text
            style={[
              styles.leafStateTitle,
              { color: leafState === 'basah' ? theme.danger : theme.textSecondary },
              leafState === 'basah' && { fontWeight: '700' },
            ]}
          >
            Basah Segar
          </Text>
          <Text style={[styles.leafStateSub, { color: theme.textTertiary }]}>Perlu dianginkan</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Kapasitas Bahan Baku Daun */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: 18 }]}>
        KAPASITAS KETEL SULING
      </Text>
      <View style={[styles.groupedForm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.formRow}>
          <View style={styles.labelWithIcon}>
            <Scale size={18} color={theme.accent} strokeWidth={2} />
            <Text style={[styles.formLabel, { color: theme.text }]}>Berat Daun Kering</Text>
          </View>

          <View style={styles.stepperInputWrapper}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => handleAdjustWeight(-50)}
              style={[styles.stepperBtn, { backgroundColor: theme.surfaceSecondary }]}
            >
              <Minus size={14} color={theme.text} strokeWidth={2.5} />
            </TouchableOpacity>

            <TextInput
              keyboardType="numeric"
              value={dryLeavesKg}
              onChangeText={setDryLeavesKg}
              style={[styles.numericInput, { color: theme.text }]}
              placeholder="500"
              placeholderTextColor={theme.textTertiary}
            />
            <Text style={[styles.unitLabel, { color: theme.textSecondary }]}>kg</Text>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => handleAdjustWeight(50)}
              style={[styles.stepperBtn, { backgroundColor: theme.surfaceSecondary }]}
            >
              <Plus size={14} color={theme.text} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Chips */}
        <View style={styles.quickChipsRow}>
          {quickWeightPresets.map((weight) => (
            <TouchableOpacity
              key={weight}
              activeOpacity={0.7}
              onPress={() => setDryLeavesKg(weight.toString())}
              style={[
                styles.quickChip,
                { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
                leaves === weight && { backgroundColor: theme.accentTint, borderColor: theme.accent },
              ]}
            >
              <Text
                style={[
                  styles.quickChipText,
                  { color: leaves === weight ? theme.accent : theme.textSecondary },
                  leaves === weight && { fontWeight: '700' },
                ]}
              >
                {weight} kg
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.rowDivider, { backgroundColor: theme.border }]} />

        {/* Preset Rendemen Segmented Control */}
        <View style={styles.formRowVertical}>
          <View style={styles.rendemenTitleRow}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Target Rendemen Minyak:</Text>
            <Text style={[styles.rendemenValHighlight, { color: theme.oilAmber }]}>
              {yieldRatePreset.toFixed(1)}%
            </Text>
          </View>

          <View style={[styles.segmentedControl, { backgroundColor: theme.surfaceSecondary }]}>
            {presets.map((p) => {
              const isSelected = Math.abs(yieldRatePreset - p.rate) < 0.05;
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

      {/* 3. Inset Grouped Section: Biaya Operasional Suling */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: 18 }]}>
        BIAYA OPERASIONAL SULING (6-8 JAM)
      </Text>
      <View style={[styles.groupedForm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.formRow}>
          <View style={styles.labelWithIcon}>
            <Flame size={17} color={theme.oilAmber} strokeWidth={2} />
            <Text style={[styles.formLabel, { color: theme.text }]}>Bahan Bakar (Kayu/LPG)</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={[styles.currencyPrefix, { color: theme.textSecondary }]}>Rp</Text>
            <TextInput
              keyboardType="numeric"
              value={fuelCost}
              onChangeText={setFuelCost}
              style={[styles.numericInput, { color: theme.text }]}
            />
          </View>
        </View>

        <View style={[styles.rowDivider, { backgroundColor: theme.border }]} />

        <View style={styles.formRow}>
          <View style={styles.labelWithIcon}>
            <DollarSign size={17} color={theme.accent} strokeWidth={2} />
            <Text style={[styles.formLabel, { color: theme.text }]}>Upah Operator Ketel</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={[styles.currencyPrefix, { color: theme.textSecondary }]}>Rp</Text>
            <TextInput
              keyboardType="numeric"
              value={laborCost}
              onChangeText={setLaborCost}
              style={[styles.numericInput, { color: theme.text }]}
            />
          </View>
        </View>

        <View style={[styles.rowDivider, { backgroundColor: theme.border }]} />

        <View style={styles.formRow}>
          <View style={styles.labelWithIcon}>
            <TrendingUp size={17} color={theme.accent} strokeWidth={2} />
            <Text style={[styles.formLabel, { color: theme.text }]}>Target Harga Jual / kg</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={[styles.currencyPrefix, { color: theme.textSecondary }]}>Rp</Text>
            <TextInput
              keyboardType="numeric"
              value={expectedPricePerKg}
              onChangeText={setExpectedPricePerKg}
              style={[styles.numericInput, { color: theme.text }]}
            />
          </View>
        </View>
      </View>

      {/* 4. Output Summary Inset Grouped Card */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: 18 }]}>
        HASIL SIMULASI PRODUKSI
      </Text>
      <BentoCard mode={mode} style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View>
            <Text style={[styles.resultCardTitle, { color: theme.textSecondary }]}>
              Hasil Ekstraksi Minyak
            </Text>
            <Text style={[styles.resultCardSubtitle, { color: theme.textTertiary }]}>
              Basis {leaves} kg biomassa
            </Text>
          </View>
          <View style={[styles.rendemenBadge, { backgroundColor: theme.oilAmberTint }]}>
            <Sparkles size={13} color={theme.oilAmber} strokeWidth={2.2} />
            <Text style={[styles.rendemenBadgeText, { color: theme.oilAmber }]}>
              {formatPercent(yieldRatePreset)} Rendemen
            </Text>
          </View>
        </View>

        <Animated.View style={[styles.resultHeroRow, { transform: [{ scale: resultScaleAnim }] }]}>
          <Text style={[styles.oilNumber, { color: theme.text }]}>
            {estimatedOilKg.toFixed(2)}{' '}
            <Text style={[styles.oilUnit, { color: theme.textSecondary }]}>kg</Text>
          </Text>
          <View style={[styles.literPill, { backgroundColor: theme.surfaceSecondary }]}>
            <Text style={[styles.oilLiter, { color: theme.textSecondary }]}>
              &asymp; {(estimatedOilKg * 1.05).toFixed(1)} Liter
            </Text>
          </View>
        </Animated.View>

        <View style={[styles.rowDivider, { backgroundColor: theme.border, marginVertical: 14 }]} />

        {/* 4-Box Financial Bento Metrics */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricBox, { backgroundColor: theme.surfaceSecondary }]}>
            <Text style={[styles.boxLabel, { color: theme.textSecondary }]}>HPP per Kg</Text>
            <Text style={[styles.boxVal, { color: theme.text }]}>{formatRupiah(hppPerKg)}</Text>
            <Text style={[styles.boxSub, { color: theme.textTertiary }]}>Biaya dasar</Text>
          </View>

          <View style={[styles.metricBox, { backgroundColor: theme.surfaceSecondary }]}>
            <Text style={[styles.boxLabel, { color: theme.textSecondary }]}>Total Biaya</Text>
            <Text style={[styles.boxVal, { color: theme.text }]}>{formatRupiah(totalCost)}</Text>
            <Text style={[styles.boxSub, { color: theme.textTertiary }]}>Kayu + Tenaga</Text>
          </View>

          <View style={[styles.metricBox, { backgroundColor: theme.surfaceSecondary }]}>
            <Text style={[styles.boxLabel, { color: theme.textSecondary }]}>Omset Kotor</Text>
            <Text style={[styles.boxVal, { color: theme.text }]}>{formatRupiah(grossRevenue)}</Text>
            <Text style={[styles.boxSub, { color: theme.textTertiary }]}>Harga jual acuan</Text>
          </View>

          <View style={[styles.metricBox, { backgroundColor: theme.accentTint }]}>
            <Text style={[styles.boxLabel, { color: theme.accent }]}>Laba Bersih</Text>
            <Text style={[styles.boxVal, { color: theme.accent }]}>{formatRupiah(netProfit)}</Text>
            <Text style={[styles.boxSub, { color: theme.accent }]}>Margin {profitMargin.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={[styles.adviceNotice, { backgroundColor: theme.accentTint }]}>
          <CheckCircle2 size={16} color={theme.accent} strokeWidth={2.2} />
          <Text style={[styles.adviceText, { color: theme.accent }]}>
            Rendemen {yieldRatePreset}% sangat ideal. Pastikan api ketel stabil agar uap fraksi berat (Patchouli Alcohol) terekstraksi maksimal tanpa gosong.
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
          style={[styles.waShareBtn, { backgroundColor: theme.accent }]}
        >
          <MessageSquareShare size={18} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.waShareBtnText}>Bagikan Rincian HPP ke WhatsApp</Text>
        </TouchableOpacity>
      </BentoCard>
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
    paddingBottom: 110, // Generous padding so bottom bar never obscures content!
  },
  titleSection: {
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
    lineHeight: 18,
  },
  sectionHeading: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 8,
    marginLeft: 4,
  },
  leafStateRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    marginBottom: 4,
  },
  leafStateTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 11,
  },
  leafStateActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  leafStateTitle: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
  },
  leafStateSub: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    marginTop: 2,
  },
  groupedForm: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: 4,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formRowVertical: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  rendemenTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rendemenValHighlight: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '700',
  },
  formLabel: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '500',
  },
  stepperInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyPrefix: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '500',
  },
  numericInput: {
    fontFamily: SANS_FONT,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 70,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  unitLabel: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '500',
  },
  quickChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8,
  },
  quickChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickChipText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '500',
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
  },
  resultCard: {
    padding: 16,
    borderRadius: 18,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultCardTitle: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '600',
  },
  resultCardSubtitle: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    marginTop: 2,
  },
  rendemenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rendemenBadgeText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '700',
  },
  resultHeroRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  oilNumber: {
    fontFamily: SANS_FONT,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  oilUnit: {
    fontSize: 18,
    fontWeight: '500',
  },
  literPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  oilLiter: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    minWidth: '46%',
    padding: 12,
    borderRadius: 12,
  },
  boxLabel: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '500',
  },
  boxVal: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  boxSub: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    marginTop: 2,
  },
  adviceNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  adviceText: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  waShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 13,
  },
  waShareBtnText: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
