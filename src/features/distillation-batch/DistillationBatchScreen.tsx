import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { QrCode, Plus, CheckCircle2, X, Share2, Layers, Clock, MessageSquareShare } from 'lucide-react-native';
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
  const [dryLeavesInput, setDryLeavesInput] = useState('400');
  const [oilYieldInput, setOilYieldInput] = useState('13.2');
  const [durationInput, setDurationInput] = useState('7');
  const [boilerChoice, setBoilerChoice] = useState<'Stainless Steel Food Grade' | 'Drum Besi Galvanis'>('Stainless Steel Food Grade');

  // Load persistent batches on mount
  useEffect(() => {
    loadSavedBatches().then((data) => {
      setBatches(data);
    });
  }, []);

  const leavesNum = parseFloat(dryLeavesInput) || 0;
  const oilNum = parseFloat(oilYieldInput) || 0;
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
      durationHours: parseFloat(durationInput) || 7,
      boilerType: boilerChoice,
      fuelType: 'Biomassa Limbah Nilam',
      paPercentage: 33.4,
      labCertificateNo: `LAB-SNI-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Tersedia',
    };

    const updated = [newBatch, ...batches];
    setBatches(updated);
    await saveBatches(updated); // Persist to AsyncStorage!
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
            Riwayat ketel dan penerbitan QR Passport mutu jeriken
          </Text>
        </View>

        <View style={styles.topActionsRow}>
          {/* Active Timer Trigger */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowTimerModal(true)}
            style={[styles.timerIconBtn, { backgroundColor: theme.surfaceSecondary }]}
          >
            <Clock size={16} color={theme.text} strokeWidth={2} />
          </TouchableOpacity>

          {/* Plus Add Batch */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowAddForm(true)}
            style={[styles.addBtn, { backgroundColor: theme.accent }]}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.addBtnText}>Tambah</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Batch Inset Grouped Cards Feed */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {batches.map((batch) => (
          <BentoCard key={batch.id} mode={mode} style={styles.batchCard}>
            <View style={styles.batchHeader}>
              <View>
                <Text style={[styles.batchCode, { color: theme.text }]}>{batch.batchCode}</Text>
                <Text style={[styles.batchSub, { color: theme.textSecondary }]}>
                  {batch.farmerName} • {batch.location}
                </Text>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: theme.accentTint }]}>
                <Text style={[styles.statusText, { color: theme.accent }]}>{batch.status}</Text>
              </View>
            </View>

            {/* Metrics Row */}
            <View style={[styles.metricsTable, { backgroundColor: theme.surfaceSecondary }]}>
              <View style={styles.metricCell}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Daun Kering</Text>
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
              <View style={{ flex: 1 }}>
                <Text style={[styles.techText, { color: theme.textSecondary }]}>
                  {batch.boilerType} • {batch.durationHours} Jam Suling
                </Text>
                <Text style={[styles.paText, { color: theme.oilAmber }]}>
                  PA {batch.paPercentage}% (Sertifikat {batch.labCertificateNo})
                </Text>
              </View>

              <View style={styles.footerBtns}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => shareBatchToWhatsApp(batch)}
                  style={[styles.smallBtn, { backgroundColor: theme.surfaceSecondary }]}
                >
                  <MessageSquareShare size={14} color={theme.text} strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedQRBatch(batch)}
                  style={[styles.qrBtn, { backgroundColor: theme.surfaceSecondary }]}
                >
                  <QrCode size={14} color={theme.text} strokeWidth={2} />
                  <Text style={[styles.qrBtnText, { color: theme.text }]}>QR Passport</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BentoCard>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Distillation Active Stopwatch / Timer Modal */}
      <DistillationTimerModal
        visible={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        mode={mode}
      />

      {/* Add New Batch Form Modal */}
      <Modal visible={showAddForm} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Catat Siklus Ketel Suling</Text>
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
              >
                <X size={18} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Inset Form Fields */}
            <View style={[styles.modalForm, { backgroundColor: theme.surfaceSecondary }]}>
              <View style={styles.formRow}>
                <Text style={[styles.fLabel, { color: theme.text }]}>Berat Daun Kering (kg)</Text>
                <TextInput
                  keyboardType="numeric"
                  value={dryLeavesInput}
                  onChangeText={setDryLeavesInput}
                  style={[styles.fInput, { color: theme.text }]}
                />
              </View>

              <View style={[styles.fDivider, { backgroundColor: theme.border }]} />

              <View style={styles.formRow}>
                <Text style={[styles.fLabel, { color: theme.text }]}>Minyak Tertampung (kg)</Text>
                <TextInput
                  keyboardType="numeric"
                  value={oilYieldInput}
                  onChangeText={setOilYieldInput}
                  style={[styles.fInput, { color: theme.text }]}
                />
              </View>

              <View style={[styles.fDivider, { backgroundColor: theme.border }]} />

              <View style={styles.formRow}>
                <Text style={[styles.fLabel, { color: theme.text }]}>Durasi Suling (Jam)</Text>
                <TextInput
                  keyboardType="numeric"
                  value={durationInput}
                  onChangeText={setDurationInput}
                  style={[styles.fInput, { color: theme.text }]}
                />
              </View>
            </View>

            {/* Rendemen Preview Box */}
            <View style={[styles.yieldPreviewBox, { backgroundColor: theme.accentTint }]}>
              <Text style={[styles.yieldPreviewLabel, { color: theme.accent }]}>
                Rendemen Terhitung Otomatis
              </Text>
              <Text style={[styles.yieldPreviewVal, { color: theme.accent }]}>
                {computedRendemen.toFixed(2)}%
              </Text>
            </View>

            {/* Boiler Choice Segmented Control */}
            <Text style={[styles.boilerLabel, { color: theme.textSecondary }]}>TIPE KETEL SULING</Text>
            <View style={[styles.segmentedControl, { backgroundColor: theme.surfaceSecondary }]}>
              <TouchableOpacity
                onPress={() => setBoilerChoice('Stainless Steel Food Grade')}
                style={[
                  styles.segmentTab,
                  boilerChoice.includes('Stainless') && [styles.segmentActive, { backgroundColor: theme.surface }],
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: boilerChoice.includes('Stainless') ? theme.text : theme.textSecondary },
                  ]}
                >
                  Stainless 304/316
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setBoilerChoice('Drum Besi Galvanis')}
                style={[
                  styles.segmentTab,
                  boilerChoice.includes('Drum') && [styles.segmentActive, { backgroundColor: theme.surface }],
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: boilerChoice.includes('Drum') ? theme.text : theme.textSecondary },
                  ]}
                >
                  Drum Galvanis
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveBatch}
              style={[styles.actionBtn, { backgroundColor: theme.accent }]}
            >
              <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.actionBtnText}>Simpan & Terbitkan QR Passport</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Passport Viewer Modal */}
      {selectedQRBatch && (
        <Modal visible={!!selectedQRBatch} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={[styles.qrModalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Paspor Mutu Digital</Text>
                  <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                    Standar Telusur SNI 06-2385
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedQRBatch(null)}
                  style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
                >
                  <X size={18} color={theme.text} />
                </TouchableOpacity>
              </View>

              {/* Clean Black and White QR Code Box */}
              <View style={styles.qrCanvasBox}>
                <QrCode size={130} color="#000000" strokeWidth={2} />
                <Text style={styles.qrCodeLabel}>{selectedQRBatch.batchCode}</Text>
                <Text style={styles.qrCodeHint}>
                  Pindai untuk verifikasi integritas batch di laboratorium
                </Text>
              </View>

              {/* Inset Specs Table */}
              <View style={[styles.passportTable, { backgroundColor: theme.surfaceSecondary }]}>
                <View style={styles.pRow}>
                  <Text style={[styles.pLabel, { color: theme.textSecondary }]}>Kadar Patchouli Alcohol</Text>
                  <Text style={[styles.pVal, { color: theme.accent, fontWeight: '700' }]}>
                    {selectedQRBatch.paPercentage}% (SNI A)
                  </Text>
                </View>
                <View style={[styles.pDivider, { backgroundColor: theme.border }]} />
                <View style={styles.pRow}>
                  <Text style={[styles.pLabel, { color: theme.textSecondary }]}>Volume Bersih</Text>
                  <Text style={[styles.pVal, { color: theme.text }]}>
                    {formatKg(selectedQRBatch.oilYieldKg)}
                  </Text>
                </View>
                <View style={[styles.pDivider, { backgroundColor: theme.border }]} />
                <View style={styles.pRow}>
                  <Text style={[styles.pLabel, { color: theme.textSecondary }]}>Rendemen Suling</Text>
                  <Text style={[styles.pVal, { color: theme.text }]}>
                    {formatPercent(selectedQRBatch.rendemen)}
                  </Text>
                </View>
              </View>

              <View style={styles.qrActionButtons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => shareBatchToWhatsApp(selectedQRBatch)}
                  style={[styles.waBtn, { backgroundColor: '#25D366' }]}
                >
                  <MessageSquareShare size={16} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={styles.waBtnText}>Kirim ke WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedQRBatch(null)}
                  style={[styles.actionBtn, { backgroundColor: theme.accent, flex: 1 }]}
                >
                  <Share2 size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.actionBtnText}>Cetak Label QR</Text>
                </TouchableOpacity>
              </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addBtnText: {
    fontFamily: SANS_FONT,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  batchCard: {
    marginBottom: 14,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  batchCode: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '700',
  },
  batchSub: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  metricsTable: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  metricCell: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    marginBottom: 2,
  },
  metricVal: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '600',
  },
  metricDivider: {
    width: StyleSheet.hairlineWidth,
    height: 20,
  },
  batchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
  },
  paText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  footerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smallBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  qrBtnText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
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
    marginBottom: 14,
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
  modalForm: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  fLabel: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '500',
  },
  fInput: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 70,
    padding: 0,
  },
  fDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 12,
  },
  yieldPreviewBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  yieldPreviewLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '500',
  },
  yieldPreviewVal: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '700',
  },
  boilerLabel: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
    marginBottom: 16,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
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
  qrModalCard: {
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignSelf: 'center',
    width: '90%',
  },
  qrCanvasBox: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 14,
  },
  qrCodeLabel: {
    fontFamily: SANS_FONT,
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  qrCodeHint: {
    fontFamily: SANS_FONT,
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 2,
  },
  passportTable: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  pRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  pLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
  },
  pVal: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
  },
  pDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  qrActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  waBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  waBtnText: {
    fontFamily: SANS_FONT,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
