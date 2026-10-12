import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, ChevronRight, Stethoscope, Droplets } from 'lucide-react-native';
import { BentoCard } from '../../shared/components/BentoCard';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface DiseaseCase {
  id: string;
  name: string;
  scientificName: string;
  status: 'OPTIMAL' | 'CRITICAL' | 'WARNING';
  visualSymptoms: string;
  yieldImpact: string;
  solutionAction: string;
  preventionTip: string;
}

const LEAF_CASES: DiseaseCase[] = [
  {
    id: 'healthy-wilted',
    name: 'Daun Cukup Layur (Siap Suling)',
    scientificName: 'Tahap Pra-Destilasi Optimal',
    status: 'OPTIMAL',
    visualSymptoms: 'Daun lemas elastis, tidak mudah patah saat diremas, kadar air 12-15%, aroma khas nilam mulai tajam.',
    yieldImpact: 'Rendemen Optimal: 3.2% - 3.6% (Kadar PA > 32%).',
    solutionAction: 'Masukkan segera ke ketel suling. Tumpuk merata tanpa dipadatkan berlebihan agar uap panas menembus sempurna.',
    preventionTip: 'Jemur di tempat teduh beraerasi baik selama 2-3 hari. Hindari sinar matahari terik langsung agar minyak atsiri tidak menguap di udara.',
  },
  {
    id: 'bacterial-wilt',
    name: 'Penyakit Layu Bakteri',
    scientificName: 'Ralstonia solanacearum',
    status: 'CRITICAL',
    visualSymptoms: 'Tanaman layu mendadak dalam 1-2 hari tetapi daun tetap hijau (tidak menguning). Pembuluh kayu pada batang bawah berwarna cokelat gelap berlendir.',
    yieldImpact: 'Kematian Tanaman 100%. Risiko menular ke seluruh petak kebun.',
    solutionAction: 'Cabut dan musnahkan tanaman yang terinfeksi segera dengan dibakar di luar kebun. Taburkan kapur tohor (dolomit) pada lubang tanah bekas tanaman.',
    preventionTip: 'Gunakan bibit bersertifikat bebas bakteri. Aplikasikan agens hayati Trichoderma sp. atau Pseudomonas fluorescens sejak olah tanah.',
  },
  {
    id: 'budok-virus',
    name: 'Penyakit Budok / Mosaik',
    scientificName: 'Patchouli Mosaic Virus (Potyvirus)',
    status: 'WARNING',
    visualSymptoms: 'Permukaan daun berkerut kasar, menebal, tepi daun menggulung ke atas, ruas daun memendek (tanaman kerdil).',
    yieldImpact: 'Penurunan rendemen minyak hingga 50-70% (Kadar PA < 28%).',
    solutionAction: 'Pangkas bagian tanaman yang berkerut dan isolasi dari tanaman lain. Kendalikan hama vektor (kutu daun/aphids).',
    preventionTip: 'Sanitasi pisau/gunting pangkas dengan alkohol 70% sebelum berpindah tanaman. Jangan gunakan setek dari tanaman yang berkerut.',
  },
  {
    id: 'wet-fermentation',
    name: 'Daun Terlalu Basah / Busuk Fermentasi',
    scientificName: 'Kadar Air Berlebih (> 25%)',
    status: 'WARNING',
    visualSymptoms: 'Daun berlendir, lembek kehijauan gelap, aroma masam/apek busuk akibat ditumpuk saat masih basah air hujan.',
    yieldImpact: 'Minyak suling berwarna hitam pekat, bau asam tajam, sulit dipisahkan dari air suling di dekanter.',
    solutionAction: 'Bongkar tumpukan daun segera. Anginkan di atas terpal beratap dengan sirkulasi udara kencang hingga kadar air turun ke 14%.',
    preventionTip: 'Jangan pernah memanen daun nilam saat hujan lebat. Pastikan daun bebas dari embun pagi sebelum proses perajangan.',
  },
];

interface LeafDiagnosticScreenProps {
  mode: ThemeMode;
  onBack?: () => void;
}

export const LeafDiagnosticScreen: React.FC<LeafDiagnosticScreenProps> = ({ mode, onBack }) => {
  const theme = getAppleTheme(mode);
  const [selectedCase, setSelectedCase] = useState<DiseaseCase>(LEAF_CASES[0]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.canvas }]} showsVerticalScrollIndicator={false}>
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
          Panduan inspeksi kesehatan daun dan kesiapan ketel suling
        </Text>
      </View>

      {/* Selector Cards (Inset Grouped) */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>PILIH GEJALA TANAMAN</Text>
      <View style={[styles.groupedList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {LEAF_CASES.map((item, idx) => {
          const isSelected = selectedCase.id === item.id;
          const isOptimal = item.status === 'OPTIMAL';
          const isCritical = item.status === 'CRITICAL';

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => setSelectedCase(item)}
              style={[
                styles.listItem,
                { borderBottomColor: theme.border },
                idx === LEAF_CASES.length - 1 && { borderBottomWidth: 0 },
                isSelected && { backgroundColor: theme.surfaceSecondary },
              ]}
            >
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: isOptimal
                      ? theme.accent
                      : isCritical
                      ? theme.danger
                      : theme.oilAmber,
                  },
                ]}
              />

              <View style={styles.listTextContainer}>
                <Text
                  style={[
                    styles.itemTitle,
                    { color: theme.text },
                    isSelected && { fontWeight: '700' },
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={[styles.itemSub, { color: theme.textSecondary }]}>
                  {item.scientificName}
                </Text>
              </View>

              <ChevronRight
                size={16}
                color={isSelected ? theme.accent : theme.textTertiary}
                strokeWidth={2}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Diagnostic Detail Bento Card */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary, marginTop: 18 }]}>
        HASIL ANALISA & PANDUAN PENANGANAN
      </Text>

      <BentoCard mode={mode} style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <View>
            <Text style={[styles.detailTitle, { color: theme.text }]}>{selectedCase.name}</Text>
            <Text style={[styles.detailScientific, { color: theme.textSecondary }]}>
              {selectedCase.scientificName}
            </Text>
          </View>

          <View
            style={[
              styles.statusChip,
              {
                backgroundColor:
                  selectedCase.status === 'OPTIMAL'
                    ? theme.accentTint
                    : selectedCase.status === 'CRITICAL'
                    ? theme.dangerTint
                    : theme.oilAmberTint,
              },
            ]}
          >
            <Text
              style={[
                styles.statusChipText,
                {
                  color:
                    selectedCase.status === 'OPTIMAL'
                      ? theme.accent
                      : selectedCase.status === 'CRITICAL'
                      ? theme.danger
                      : theme.oilAmber,
                },
              ]}
            >
              {selectedCase.status}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Ciri Visual */}
        <View style={styles.specSection}>
          <Text style={[styles.specHeading, { color: theme.textSecondary }]}>CIRI VISUAL:</Text>
          <Text style={[styles.specBody, { color: theme.text }]}>
            {selectedCase.visualSymptoms}
          </Text>
        </View>

        {/* Dampak Rendemen */}
        <View style={[styles.noticeBox, { backgroundColor: theme.surfaceSecondary }]}>
          <Droplets size={16} color={theme.oilAmber} strokeWidth={2} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.noticeTitle, { color: theme.text }]}>Dampak Terhadap Minyak:</Text>
            <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
              {selectedCase.yieldImpact}
            </Text>
          </View>
        </View>

        {/* Solusi Operasional Lapangan */}
        <View style={[styles.actionBox, { backgroundColor: theme.accentTint }]}>
          <CheckCircle2 size={16} color={theme.accent} strokeWidth={2.2} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: theme.accent }]}>Tindakan Petani:</Text>
            <Text style={[styles.actionText, { color: theme.accent }]}>
              {selectedCase.solutionAction}
            </Text>
          </View>
        </View>

        {/* Tips Pencegahan */}
        <View style={styles.preventionBox}>
          <Text style={[styles.prevHeading, { color: theme.textSecondary }]}>SOP Pencegahan:</Text>
          <Text style={[styles.prevText, { color: theme.textSecondary }]}>
            {selectedCase.preventionTip}
          </Text>
        </View>
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
  backNavBtn: {
    paddingVertical: 6,
    marginBottom: 4,
  },
  backNavText: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '600',
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
    marginBottom: 8,
    marginLeft: 4,
  },
  groupedList: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  listTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '500',
  },
  itemSub: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 1,
  },
  detailCard: {
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailTitle: {
    fontFamily: SANS_FONT,
    fontSize: 17,
    fontWeight: '700',
  },
  detailScientific: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusChipText: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  specSection: {
    marginBottom: 12,
  },
  specHeading: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  specBody: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    lineHeight: 18,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  noticeTitle: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  noticeText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 16,
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionTitle: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  preventionBox: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  prevHeading: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  prevText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 16,
  },
});
