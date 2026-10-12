import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { QrCode, Plus, CheckCircle2, X, Share2, Layers, Clock, MessageSquareShare, Sparkles, Flame, ShieldCheck, Minus } from 'lucide-react-native';
import { BentoCard } from '../../shared/components/BentoCard';
import { DistillationBatch } from '../../data/mockData';
import { formatKg, formatPercent, calculateRendemen } from '../../shared/utils/formatters';
import { loadSavedBatches, saveBatches } from '../../shared/utils/storage';
import { shareBatchToWhatsApp } from '../../shared/utils/shareReport';
import { DistillationTimerModal } from './DistillationTimerModal';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface DistillationBatchScreenProps {
  mode: ThemeMode;
}

export const DistillationBatchScreen: React.FC<DistillationBatchScreenProps> = ({ mode }) => {
  const theme = getAppleTheme(mode);
  const [batches, setBatches] = useState<DistillationBatch[]>([]);
  const [selectedQRBatch, setSelectedQRBatch] = useState<DistillationBatch | null>(null);

  // Timer modal state
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);

  // New batch form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [dryLeavesInput, setDryLeavesInput] = useState('500');
  const [oilYieldInput, setOilYieldInput] = useState('16.0');
  const [durationInput, setDurationInput] = useState('7.5');
  const [boilerChoice, setBoilerChoice] = useState<'Stainless Steel Food Grade' | 'Drum Besi Galvanis'>('Stainless Steel Food Grade');

  // Load persistent batches on mount
  useEffect(() => {
    loadSavedBatches().then((data) => {
      setBatches(data);
    });
  }, []);

  const leavesNum = Math.max(1, parseFloat(dryLeavesInput) || 0);
  const oilNum = Math.max(0, parseFloat(oilYieldInput) || 0);
  const computedRendemen = calculateRendemen(oilNum, leavesNum);

  const handleSaveBatch = async () => {
    const newBatch: DistillationBatch = {
      id: `batch-${Date.now()}`,
      batchCode: `NLM-SUL-${Math.floor(100 + Math.random() * 900)}`,
      farmerName: 'Petani Terverifikasi',
      location: 'Kebun Sentral Kolaka',
      distilledAt: 'Hari ini',
      dryLeavesKg: leavesNum,
      oilYieldKg: oilNum,
      rendemen: parseFloat(computedRendemen.toFixed(2)),
      durationHours: parseFloat(durationInput) || 7.5,
      boilerType: boilerChoice,
      fuelType: 'Biomassa Limbah Nilam',
      paPercentage: 33.6,
      labCertificateNo: `LAB-SNI-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Tersedia',
    };

    const updated = [newBatch, ...batches];
    setBatches(updated);
    await saveBatches(updated);
    setShowAddForm(false);
    setSelectedQRBatch(newBatch);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas }]}>
      {/* iOS Large Title Section with Actions */}
      <View style={styles.titleSection}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.largeTitle, { color: theme.text }]}>Batch Suling</Text>
          <Text style={[styles.titleCaption, { color: theme.textSecondary }]}>
            Dokumentasi mutu ketel & paspor QR jeriken
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowAddForm(true)}
          style={[styles.addBtn, { backgroundColor: theme.accent }]}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.addBtnText}>Catat Batch</Text>
        </TouchableOpacity>
      </View>

      {/* Active Boiler Stopwatch Prominent Banner */}
      <View style={styles.timerBannerContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowTimerModal(true)}
          style={[styles.timerBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <View style={[styles.timerIconBox, { backgroundColor: theme.oilAmberTint }]}>
            <Clock size={22} color={theme.oilAmber} strokeWidth={2.2} />
          </View>
          <View style={styles.timerTextContainer}>
            <View style={styles.timerHeaderRow}>
              <Text style={[styles.timerTitle, { color: theme.text }]}>Stopwatch Ketel Suling</Text>
              <View style={[styles.timerLivePill, { backgroundColor: theme.accentTint }]}>
                <View style={[styles.liveDot, { backgroundColor: theme.accent }]} />
                <Text style={[styles.timerLiveText, { color: theme.accent }]}>Siap Suling</Text>
              </View>
            </View>
            <Text style={[styles.timerSub, { color: theme.textSecondary }]}>
              Pantau 3 fase penyulingan (6-8 jam) & checklist SOP SNI
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Batch Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
          RIWAYAT BATCH TERDAFTAR ({batches.length})
        </Text>

        {batches.map((batch) => (
          <BentoCard key={batch.id} mode={mode} style={styles.batchCard}>
            <View style={styles.batchHeader}>
              <View>
                <Text style={[styles.batchCode, { color: theme.text }]}>{batch.batchCode}</Text>
                <Text style={[styles.batchSub, { color: theme.textSecondary }]}>
                  {batch.farmerName} • {batch.location}
                </Text>
              </View>

              <View style={[styles.paBadge, { backgroundColor: theme.accentTint }]}>
                <ShieldCheck size={12} color={theme.accent} strokeWidth={2.2} />
                <Text style={[styles.paBadgeText, { color: theme.accent }]}>PA {batch.paPercentage}%</Text>
              </View>
            </View>

            {/* Metrics Table */}
            <View style={[styles.metricsTable, { backgroundColor: theme.surfaceSecondary }]}>
              <View style={styles.metricCell}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Daun Suling</Text>
                <Text style={[styles.metricVal, { color: theme.text }]}>{formatKg(batch.dryLeavesKg)}</Text>
              </View>
              <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
              <View style={styles.metricCell}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Minyak Murni</Text>
                <Text style={[styles.metricVal, { color: theme.text }]}>{formatKg(batch.oilYieldKg)}</Text>
              </View>
              <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
              <View style={styles.metricCell}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Rendemen</Text>
                <Text style={[styles.metricVal, { color: theme.accent }]}>{formatPercent(batch.rendemen)}</Text>
              </View>
            </View>

            {/* Technical details & Action buttons */}
            <View style={styles.batchFooter}>
              <Text style={[styles.techText, { color: theme.textSecondary }]}>
                {batch.boilerType} • {batch.durationHours} Jam Suling
              </Text>

              <View style={styles.actionBtnsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => shareBatchToWhatsApp(batch)}
                  style={[styles.smallIconBtn, { backgroundColor: theme.surfaceSecondary }]}
                >
                  <MessageSquareShare size={15} color={theme.text} strokeWidth={2} />
                  <Text style={[styles.btnLabel, { color: theme.text }]}>WA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedQRBatch(batch)}
                  style={[styles.qrPassportBtn, { backgroundColor: theme.accent }]}
                >
                  <QrCode size={14} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={styles.qrPassportBtnText}>Lihat QR Passport</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BentoCard>
        ))}
      </ScrollView>

      {/* Modal 1: Catat Batch Baru */}
      <Modal visible={showAddForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Pencatatan Batch Suling</Text>
                <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                  Penerbitan nomor lot digital dan ketertelusuran SNI
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
              >
                <X size={18} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* Form Input: Daun Kering */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Berat Daun Kering (kg)
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.surfaceSecondary }]}>
                  <TextInput
                    value={dryLeavesInput}
                    onChangeText={setDryLeavesInput}
                    keyboardType="numeric"
                    style={[styles.inputField, { color: theme.text }]}
                  />
                  <Text style={[styles.inputUnit, { color: theme.textSecondary }]}>kg</Text>
                </View>
              </View>

              {/* Form Input: Minyak */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Minyak Dihasilkan (kg)
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.surfaceSecondary }]}>
                  <TextInput
                    value={oilYieldInput}
                    onChangeText={setOilYieldInput}
                    keyboardType="numeric"
                    style={[styles.inputField, { color: theme.text }]}
                  />
                  <Text style={[styles.inputUnit, { color: theme.textSecondary }]}>kg</Text>
                </View>
              </View>

              {/* Live Preview Rendemen Pill */}
              <View style={[styles.previewRendemenBox, { backgroundColor: theme.accentTint }]}>
                <Sparkles size={15} color={theme.accent} strokeWidth={2.2} />
                <Text style={[styles.previewRendemenText, { color: theme.accent }]}>
                  Estimasi Rendemen Batch: {computedRendemen.toFixed(2)}%
                </Text>
              </View>

              {/* Durasi Suling */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Lama Waktu Suling (Jam)
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.surfaceSecondary }]}>
                  <TextInput
                    value={durationInput}
                    onChangeText={setDurationInput}
                    keyboardType="numeric"
                    style={[styles.inputField, { color: theme.text }]}
                  />
                  <Text style={[styles.inputUnit, { color: theme.textSecondary }]}>Jam</Text>
                </View>
              </View>

              {/* Tipe Ketel */}
              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Jenis Ketel Suling</Text>
                <View style={styles.boilerToggleRow}>
                  <TouchableOpacity
                    onPress={() => setBoilerChoice('Stainless Steel Food Grade')}
                    style={[
                      styles.boilerChoiceBtn,
                      { backgroundColor: theme.surfaceSecondary },
                      boilerChoice === 'Stainless Steel Food Grade' && {
                        backgroundColor: theme.accentTint,
                        borderColor: theme.accent,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.boilerChoiceText,
                        { color: boilerChoice === 'Stainless Steel Food Grade' ? theme.accent : theme.text },
                      ]}
                    >
                      Stainless Steel 304
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setBoilerChoice('Drum Besi Galvanis')}
                    style={[
                      styles.boilerChoiceBtn,
                      { backgroundColor: theme.surfaceSecondary },
                      boilerChoice === 'Drum Besi Galvanis' && {
                        backgroundColor: theme.accentTint,
                        borderColor: theme.accent,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.boilerChoiceText,
                        { color: boilerChoice === 'Drum Besi Galvanis' ? theme.accent : theme.text },
                      ]}
                    >
                      Drum Besi
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveBatch}
              style={[styles.saveSubmitBtn, { backgroundColor: theme.accent }]}
            >
              <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.saveSubmitText}>Simpan & Terbitkan QR Passport</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal 2: QR Passport View */}
      {selectedQRBatch && (
        <Modal visible={true} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.qrModalSheet, { backgroundColor: theme.surface }]}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Digital QR Passport</Text>
                  <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                    Standar Ketertelusuran Mutu SNI 06-2385-2006
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedQRBatch(null)}
                  style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
                >
                  <X size={18} color={theme.text} />
                </TouchableOpacity>
              </View>

              {/* QR Representation */}
              <View style={styles.qrCodeBox}>
                <View style={styles.qrFrame}>
                  <QrCode size={180} color="#000000" strokeWidth={1.8} />
                </View>
                <Text style={[styles.qrCodeNumber, { color: theme.text }]}>
                  {selectedQRBatch.batchCode}
                </Text>
                <Text style={[styles.qrLabCert, { color: theme.textSecondary }]}>
                  Sertifikat: {selectedQRBatch.labCertificateNo}
                </Text>
              </View>

              <View style={[styles.qrSpecsCard, { backgroundColor: theme.surfaceSecondary }]}>
                <View style={styles.specRow}>
                  <Text style={[styles.specTitle, { color: theme.textSecondary }]}>Kadar Patchouli Alcohol</Text>
                  <Text style={[styles.specValue, { color: theme.accent }]}>
                    {selectedQRBatch.paPercentage}% (Super SNI)
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specTitle, { color: theme.textSecondary }]}>Kapasitas Daun</Text>
                  <Text style={[styles.specValue, { color: theme.text }]}>
                    {selectedQRBatch.dryLeavesKg} kg &rarr; {selectedQRBatch.oilYieldKg} kg Minyak
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specTitle, { color: theme.textSecondary }]}>Jenis Ketel Suling</Text>
                  <Text style={[styles.specValue, { color: theme.text }]}>
                    {selectedQRBatch.boilerType}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  shareBatchToWhatsApp(selectedQRBatch);
                  setSelectedQRBatch(null);
                }}
                style={[styles.saveSubmitBtn, { backgroundColor: theme.accent, marginTop: 14 }]}
              >
                <MessageSquareShare size={18} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.saveSubmitText}>Kirim Paspor ke WhatsApp Pembeli</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Stopwatch Timer Full Modal */}
      <DistillationTimerModal
        visible={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        mode={mode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 10,
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  addBtnText: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timerBannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  timerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  timerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timerTextContainer: {
    flex: 1,
  },
  timerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerTitle: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '700',
  },
  timerLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timerLiveText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  timerSub: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
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
    paddingBottom: 120, // Keep clean clearance above bottom nav bar
  },
  batchCard: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  batchCode: {
    fontFamily: SANS_FONT,
    fontSize: 16,
    fontWeight: '700',
  },
  batchSub: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 2,
  },
  paBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paBadgeText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  metricsTable: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 10,
    marginVertical: 10,
  },
  metricCell: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '500',
  },
  metricVal: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  metricDivider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 2,
  },
  batchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techText: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 11,
  },
  actionBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  btnLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
  },
  qrPassportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  qrPassportBtnText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
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
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputField: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 10,
  },
  inputUnit: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '500',
  },
  previewRendemenBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  previewRendemenText: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '700',
  },
  boilerToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  boilerChoiceBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  boilerChoiceText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
  },
  saveSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  saveSubmitText: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  qrModalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  qrCodeBox: {
    alignItems: 'center',
    marginVertical: 14,
  },
  qrFrame: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeNumber: {
    fontFamily: SANS_FONT,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  qrLabCert: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 2,
  },
  qrSpecsCard: {
    padding: 14,
    borderRadius: 14,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  specTitle: {
    fontFamily: SANS_FONT,
    fontSize: 12,
  },
  specValue: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '700',
  },
});
