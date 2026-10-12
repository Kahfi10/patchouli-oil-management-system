import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, ChevronRight, Stethoscope, Droplets, Info, Check, Flame } from 'lucide-react-native';
import { BentoCard } from '../../shared/components/BentoCard';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface DiseaseCase {
  id: string;
  name: string;
  scientificName: string;
  status: 'OPTIMAL' | 'CRITICAL' | 'WARNING';
  shortTag: string;
  visualSymptoms: string;
  yieldImpact: string;
  solutionAction: string[];
  preventionTip: string;
}

const LEAF_CASES: DiseaseCase[] = [
  {
    id: 'healthy-wilted',
    name: 'Daun Cukup Layur (Siap Suling)',
    scientificName: 'Fase Pra-Destilasi Optimal',
    status: 'OPTIMAL',
    shortTag: 'Siap Masuk Ketel',
    visualSymptoms: 'Daun lemas elastis, tidak patah saat diremas, kadar air 12–15%, aroma khas nilam mulai tajam keluar.',
    yieldImpact: 'Rendemen Tertinggi: 3.2% – 3.8% (Kadar Patchouli Alcohol > 32%).',
    solutionAction: [
      'Segera masukkan ke dalam ketel suling tanpa ditunda.',
      'Tumpuk merata di atas angsang ketel tanpa dipadatkan berlebihan agar uap panas menembus sempurna.',
      'Jaga api ketel stabil pada fase awal kondensasi.',
    ],
    preventionTip: 'Jemur di tempat teduh beraerasi baik selama 2–3 hari. Hindari sinar matahari terik langsung agar minyak atsiri tidak menguap bebas ke udara.',
  },
  {
    id: 'bacterial-wilt',
    name: 'Penyakit Layu Bakteri',
    scientificName: 'Ralstonia solanacearum',
    status: 'CRITICAL',
    shortTag: 'Bahaya Kebun',
    visualSymptoms: 'Tanaman layu mendadak dalam 1–2 hari tetapi daun tetap berwarna hijau segar (tidak menguning). Pembuluh kayu pada pangkal batang berwarna cokelat gelap berlendir.',
    yieldImpact: 'Kematian Tanaman 100%. Risiko menular cepat ke seluruh petak kebun melalui air tanah.',
    solutionAction: [
      'Cabut dan musnahkan tanaman yang terinfeksi segera dengan dibakar di luar kebun.',
      'Taburkan kapur tohor (dolomit) sebanyak 100-200 gram pada lubang tanah bekas tanaman.',
      'Jangan mengalirkan air parit dari petak yang sakit ke petak yang sehat.',
    ],
    preventionTip: 'Gunakan bibit bersertifikat bebas bakteri. Aplikasikan agens hayati Trichoderma sp. atau Pseudomonas fluorescens sejak olah tanah.',
  },
  {
    id: 'budok-virus',
    name: 'Penyakit Budok / Mosaik',
    scientificName: 'Patchouli Mosaic Virus (Potyvirus)',
    status: 'WARNING',
    shortTag: 'Menurunkan PA%',
    visualSymptoms: 'Permukaan helai daun berkerut kasar, menebal, tepi daun menggulung ke atas, ruas daun memendek sehingga tanaman tampak kerdil.',
    yieldImpact: 'Penurunan rendemen minyak hingga 50%–70% dan kadar PA anjlok di bawah 28%.',
    solutionAction: [
      'Pangkas bagian tanaman yang berkerut dan isolasi dari tanaman lain.',
      'Kendalikan hama vektor penular (kutu daun/aphids) dengan insektisida nabati.',
      'Beri pupuk daun tinggi kalium untuk memperkuat daya tahan jaringan.',
    ],
    preventionTip: 'Sterilisasi pisau/gunting pangkas dengan alkohol 70% sebelum berpindah tanaman. Hindari memperbanyak setek dari tanaman yang berkerut.',
  },
  {
    id: 'wet-fermentation',
    name: 'Daun Terlalu Basah / Fermentasi',
    scientificName: 'Kadar Air Berlebih (> 25%)',
    status: 'WARNING',
    shortTag: 'Minyak Hitam',
    visualSymptoms: 'Daun berlendir, lembek kehijauan gelap, aroma masam atau apek busuk akibat ditumpuk tebal saat masih basah air hujan.',
    yieldImpact: 'Minyak suling berwarna gelap/kehitaman, berbau asam tajam, dan sulit memisah dari air di dekanter.',
    solutionAction: [
      'Bongkar tumpukan daun segera dan tebarkan tipis-tipis.',
      'Anginkan di atas terpal beratap dengan sirkulasi udara kencang hingga kadar air turun ke 14%.',
      'Jangan dicampur dengan daun kering yang sudah siap suling.',
    ],
    preventionTip: 'Hindari memanen daun nilam saat hujan lebat. Pastikan daun bebas dari embun pagi sebelum proses perajangan.',
  },
];

interface LeafDiagnosticScreenProps {
  mode: ThemeMode;
  onBack?: () => void;
}

export const LeafDiagnosticScreen: React.FC<LeafDiagnosticScreenProps> = ({ mode, onBack }) => {
  const theme = getAppleTheme(mode);
  const [selectedCase, setSelectedCase] = useState<DiseaseCase>(LEAF_CASES[0]);

  const isOptimal = selectedCase.status === 'OPTIMAL';
  const isCritical = selectedCase.status === 'CRITICAL';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.canvas }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button if opened from home */}
      {onBack && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.backNavBtn}
        >
          <Text style={[styles.backNavText, { color: theme.accent }]}>&larr; Kembali ke Beranda</Text>
        </TouchableOpacity>
      )}

      {/* iOS Large Title */}
      <View style={styles.titleSection}>
        <Text style={[styles.largeTitle, { color: theme.text }]}>Diagnosa Daun Nilam</Text>
        <Text style={[styles.titleCaption, { color: theme.textSecondary }]}>
          Panduan inspeksi visual patologi tanaman dan mutu bahan baku suling
        </Text>
      </View>

      {/* Quick Interactive Symptom Triage Buttons */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
        PILIH KONDISI / GEJALA FISIK DAUN
      </Text>
      <View style={styles.triageGrid}>
        {LEAF_CASES.map((item) => {
          const isSelected = selectedCase.id === item.id;
          const statusColor =
            item.status === 'OPTIMAL'
              ? theme.accent
              : item.status === 'CRITICAL'
              ? theme.danger
              : theme.oilAmber;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => setSelectedCase(item)}
              style={[
                styles.triageBtn,
                { backgroundColor: theme.surface, borderColor: theme.border },
                isSelected && {
                  borderColor: statusColor,
                  borderWidth: 2,
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text
                style={[
                  styles.triageBtnText,
                  { color: theme.text },
                  isSelected && { fontWeight: '700' },
                ]}
                numberOfLines={1}
              >
                {item.name.split(' ')[0]} {item.name.split(' ')[1] || ''}
              </Text>
              <Text style={[styles.triageBtnSub, { color: statusColor }]}>
                {item.shortTag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Detailed Diagnosis Card */}
      <BentoCard mode={mode} style={styles.detailCard}>
        {/* Header with Case Title and Status Pill */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.caseName, { color: theme.text }]}>{selectedCase.name}</Text>
            <Text style={[styles.caseScientific, { color: theme.textSecondary }]}>
              {selectedCase.scientificName}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isOptimal
                  ? theme.accentTint
                  : isCritical
                  ? theme.dangerTint
                  : theme.oilAmberTint,
              },
            ]}
          >
            {isOptimal ? (
              <CheckCircle2 size={13} color={theme.accent} strokeWidth={2.5} />
            ) : isCritical ? (
              <AlertTriangle size={13} color={theme.danger} strokeWidth={2.5} />
            ) : (
              <ShieldAlert size={13} color={theme.oilAmber} strokeWidth={2.5} />
            )}
            <Text
              style={[
                styles.statusBadgeText,
                {
                  color: isOptimal
                    ? theme.accent
                    : isCritical
                    ? theme.danger
                    : theme.oilAmber,
                },
              ]}
            >
              {selectedCase.status}
            </Text>
          </View>
        </View>

        <View style={[styles.cardDivider, { backgroundColor: theme.border }]} />

        {/* Gejala Visual */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoHeading, { color: theme.textSecondary }]}>
            GEJALA VISUAL PADA TANAMAN
          </Text>
          <Text style={[styles.infoBody, { color: theme.text }]}>
            {selectedCase.visualSymptoms}
          </Text>
        </View>

        {/* Dampak Rendemen */}
        <View style={[styles.yieldBox, { backgroundColor: theme.surfaceSecondary }]}>
          <Text style={[styles.yieldHeading, { color: theme.textSecondary }]}>
            Dampak Terhadap Rendemen & Mutu:
          </Text>
          <Text
            style={[
              styles.yieldVal,
              { color: isOptimal ? theme.accent : isCritical ? theme.danger : theme.oilAmber },
            ]}
          >
            {selectedCase.yieldImpact}
          </Text>
        </View>

        {/* Langkah Solusi Praktis */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoHeading, { color: theme.textSecondary, marginBottom: 8 }]}>
            TINDAKAN SEGERA (SOP PENANGANAN)
          </Text>
          {selectedCase.solutionAction.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={[styles.stepNumberCircle, { backgroundColor: theme.accentTint }]}>
                <Text style={[styles.stepNumberText, { color: theme.accent }]}>{idx + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.text }]}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Tips Pencegahan Kebun */}
        <View style={[styles.preventionBox, { backgroundColor: theme.accentTint }]}>
          <Sparkles size={16} color={theme.accent} strokeWidth={2.2} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.preventionTitle, { color: theme.accent }]}>
              Tips Budidaya Kebun Berkelanjutan
            </Text>
            <Text style={[styles.preventionBody, { color: theme.accent }]}>
              {selectedCase.preventionTip}
            </Text>
          </View>
        </View>
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
    paddingBottom: 120,
  },
  backNavBtn: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  backNavText: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '600',
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
    marginTop: 2,
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
  triageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  triageBtn: {
    flex: 1,
    minWidth: '47%',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  triageBtnText: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '600',
  },
  triageBtnSub: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  detailCard: {
    padding: 16,
    borderRadius: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  caseName: {
    fontFamily: SANS_FONT,
    fontSize: 18,
    fontWeight: '700',
  },
  caseScientific: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
  },
  infoSection: {
    marginBottom: 14,
  },
  infoHeading: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  infoBody: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    lineHeight: 20,
  },
  yieldBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  yieldHeading: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '500',
  },
  yieldVal: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
    lineHeight: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  stepNumberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 13,
    lineHeight: 18,
  },
  preventionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 14,
  },
  preventionTitle: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  preventionBody: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
});
