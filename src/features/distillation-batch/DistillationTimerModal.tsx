import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Play, Pause, RotateCcw, X, CheckSquare, Square, Clock, ShieldAlert } from 'lucide-react-native';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface DistillationTimerModalProps {
  visible: boolean;
  onClose: () => void;
  mode: ThemeMode;
}

export const DistillationTimerModal: React.FC<DistillationTimerModalProps> = ({
  visible,
  onClose,
  mode,
}) => {
  const theme = getAppleTheme(mode);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // SOP Checkboxes
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    chk1: false, // Air pendingin kondensor lancar
    chk2: false, // Paking ketel & leher angsa rapat
    chk3: false, // Tekanan uap stabil 1.5 - 2.0 bar
    chk4: false, // Tabung dekanter terpasang bersih
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Determine Current Distillation Phase based on simulated hours
  // For demo/real use: hours mapped to standard 8-hour cycle
  const currentPhase =
    hours < 1.5
      ? {
          title: 'Fase 1: Pemanasan Boiler & Uap Awal',
          target: 'Jam 0.0 - 1.5',
          desc: 'Uap panas mulai menembus tumpukan daun. Cek tetesan awal di kondensor. Pastikan tidak ada uap bocor di paking.',
        }
      : hours < 4.5
      ? {
          title: 'Fase 2: Puncak Aliran Minyak Atsiri',
          target: 'Jam 1.5 - 4.5',
          desc: 'Rendemen tertinggi mengalir ke dekanter. Jaga suhu air pendingin kondensor tetap dingin di bawah 40°C.',
        }
      : hours < 7.0
      ? {
          title: 'Fase 3: Ekstraksi Fraksi Berat Patchouli Alcohol',
          target: 'Jam 4.5 - 7.0',
          desc: 'Komponen aroma berat (Patchouli Alcohol) keluar. Pertahankan pembakaran stabil agar uap tetap konstan.',
        }
      : {
          title: 'Fase 4: Penurunan & Pemisahan Dekanter',
          target: 'Jam 7.0 - 8.0',
          desc: 'Aliran minyak melambat. Siapkan kran dekanter untuk memisahkan minyak nilam murni dari air suling.',
        };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Stopwatch Ketel Suling</Text>
              <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                Pemantauan siklus suling 6-8 jam & checklist SOP
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
            >
              <X size={18} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Stopwatch Big Digital Display */}
            <View style={[styles.timerBox, { backgroundColor: theme.surfaceSecondary }]}>
              <Text style={[styles.timerNumbers, { color: theme.text }]}>
                {pad(hours)}:{pad(mins)}:{pad(secs)}
              </Text>
              <Text style={[styles.timerUnit, { color: theme.textSecondary }]}>
                Jam : Menit : Detik
              </Text>

              {/* Controls */}
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsRunning(!isRunning)}
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: isRunning ? theme.oilAmber : theme.accent },
                  ]}
                >
                  {isRunning ? (
                    <>
                      <Pause size={16} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={styles.btnText}>Jeda Suling</Text>
                    </>
                  ) : (
                    <>
                      <Play size={16} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={styles.btnText}>Mulai Siklus Suling</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleReset}
                  style={[styles.resetBtn, { backgroundColor: theme.surfaceTertiary }]}
                >
                  <RotateCcw size={16} color={theme.text} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Current Phase Card */}
            <View style={[styles.phaseCard, { backgroundColor: theme.accentTint }]}>
              <View style={styles.phaseHeader}>
                <Clock size={16} color={theme.accent} strokeWidth={2.2} />
                <Text style={[styles.phaseTitle, { color: theme.accent }]}>{currentPhase.title}</Text>
              </View>
              <Text style={[styles.phaseTarget, { color: theme.accent }]}>
                Target: {currentPhase.target}
              </Text>
              <Text style={[styles.phaseDesc, { color: theme.accent }]}>{currentPhase.desc}</Text>
            </View>

            {/* SOP Checklist Section */}
            <Text style={[styles.checklistHeading, { color: theme.textSecondary }]}>
              CHECKLIST OPERASIONAL KETEL
            </Text>

            <View style={[styles.checklistGroup, { backgroundColor: theme.surfaceSecondary }]}>
              {[
                { key: 'chk1', label: 'Debit air pendingin kondensor mengalir lancar (suhu < 40C)' },
                { key: 'chk2', label: 'Paking leher angsa dan tutup ketel tidak ada kebocoran uap' },
                { key: 'chk3', label: 'Tekanan uap boiler stabil di 1.5 - 2.0 bar' },
                { key: 'chk4', label: 'Tabung dekanter pemisah minyak terpasang bersih' },
              ].map((item, idx) => {
                const checked = checklist[item.key];
                return (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.7}
                    onPress={() => toggleCheck(item.key)}
                    style={[
                      styles.checkRow,
                      idx > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
                    ]}
                  >
                    {checked ? (
                      <CheckSquare size={18} color={theme.accent} strokeWidth={2.2} />
                    ) : (
                      <Square size={18} color={theme.textTertiary} strokeWidth={1.8} />
                    )}
                    <Text
                      style={[
                        styles.checkLabel,
                        { color: checked ? theme.text : theme.textSecondary },
                        checked && { fontWeight: '600' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ height: 16 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    padding: 20,
    maxHeight: '90%',
  },
  headerRow: {
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
  modalSubtitle: {
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
  timerBox: {
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  timerNumbers: {
    fontFamily: SANS_FONT,
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timerUnit: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: {
    fontFamily: SANS_FONT,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  phaseTitle: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '700',
  },
  phaseTarget: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  phaseDesc: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 16,
  },
  checklistHeading: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 6,
    marginLeft: 4,
  },
  checklistGroup: {
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
  },
  checkLabel: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 16,
  },
});
