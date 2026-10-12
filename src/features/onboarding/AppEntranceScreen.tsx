import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { ShieldCheck, TrendingUp, Calculator, QrCode, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { getAppleTheme, ThemeMode } from '../../shared/theme/colors';
import { SANS_FONT } from '../../shared/theme/typography';

interface AppEntranceScreenProps {
  mode: ThemeMode;
  onFinish: () => void;
}

export const AppEntranceScreen: React.FC<AppEntranceScreenProps> = ({ mode, onFinish }) => {
  const theme = getAppleTheme(mode);

  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [progressWidth] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showWelcome, setShowWelcome] = useState(false);

  const loadingSteps = [
    'Inisialisasi database penyimpanan lokal (AsyncStorage)...',
    'Memuat standar SNI 06-2385 & acuan bursa 4 regional...',
    'Menyiapkan modul kalkulator HPP & generator Paspor QR...',
    'Sistem siap digunakan 100% Offline!',
  ];

  useEffect(() => {
    // Fade in emblem
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: 1600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Step increments
    const t1 = setTimeout(() => setLoadingStep(1), 400);
    const t2 = setTimeout(() => setLoadingStep(2), 900);
    const t3 = setTimeout(() => setLoadingStep(3), 1400);
    const t4 = setTimeout(() => setShowWelcome(true), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const progressInterpolate = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas }]}>
      <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim }]}>
        {/* Brand Emblem */}
        <View style={styles.emblemContainer}>
          <View style={[styles.emblemIconBox, { backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
            <Image
              source={require('../../../assets/logo.png')}
              style={{ width: 62, height: 62, borderRadius: 14 }}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.brandTitle, { color: theme.text }]}>SulingTrace</Text>
          <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
            Patchouli Oil Management & Traceability System
          </Text>
          <View style={[styles.sniBadge, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
            <ShieldCheck size={12} color={theme.accent} strokeWidth={2.4} />
            <Text style={[styles.sniBadgeText, { color: theme.textSecondary }]}>
              Standar SNI 06-2385-2006 • Offline-First
            </Text>
          </View>
        </View>

        {!showWelcome ? (
          /* Loading Status State */
          <View style={[styles.loadingBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.loadingHeader}>
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                {loadingSteps[loadingStep]}
              </Text>
              <Text style={[styles.loadingPercent, { color: theme.accent }]}>
                {loadingStep === 3 ? '100%' : `${Math.min(95, (loadingStep + 1) * 30)}%`}
              </Text>
            </View>

            {/* Progress Track */}
            <View style={[styles.progressTrack, { backgroundColor: theme.surfaceSecondary }]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: progressInterpolate, backgroundColor: theme.accent },
                ]}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onFinish}
              style={styles.skipBtn}
            >
              <Text style={[styles.skipBtnText, { color: theme.textTertiary }]}>Lewati & Masuk</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Welcome Onboarding Feature Snapshot */
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeHeading, { color: theme.textSecondary }]}>
              FITUR UTAMA APLIKASI
            </Text>

            <View style={[styles.featureList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.featureItem, { borderBottomColor: theme.border }]}>
                <View style={[styles.featureIconBox, { backgroundColor: theme.accentTint }]}>
                  <TrendingUp size={18} color={theme.accent} strokeWidth={2.2} />
                </View>
                <View style={styles.featureTextWrapper}>
                  <Text style={[styles.featureTitle, { color: theme.text }]}>Transparansi Bursa Regional</Text>
                  <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                    Data acuan harga pasar di 4 sentra: Aceh, Kolaka, Pasaman, & Trenggalek
                  </Text>
                </View>
              </View>

              <View style={[styles.featureItem, { borderBottomColor: theme.border }]}>
                <View style={[styles.featureIconBox, { backgroundColor: theme.oilAmberTint }]}>
                  <Calculator size={18} color={theme.oilAmber} strokeWidth={2.2} />
                </View>
                <View style={styles.featureTextWrapper}>
                  <Text style={[styles.featureTitle, { color: theme.text }]}>Kalkulator Rendemen & HPP</Text>
                  <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                    Hitung laba bersih, konsumsi bahan bakar ketel, dan ekspor laporan ke WA
                  </Text>
                </View>
              </View>

              <View style={[styles.featureItem, { borderBottomWidth: 0 }]}>
                <View style={[styles.featureIconBox, { backgroundColor: theme.accentTint }]}>
                  <QrCode size={18} color={theme.accent} strokeWidth={2.2} />
                </View>
                <View style={styles.featureTextWrapper}>
                  <Text style={[styles.featureTitle, { color: theme.text }]}>Paspor Mutu Digital (QR Code)</Text>
                  <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                    Ketertelusuran kadar Patchouli Alcohol (PA%) pada setiap jeriken minyak
                  </Text>
                </View>
              </View>
            </View>

            {/* Launch Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onFinish}
              style={[styles.startBtn, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.startBtnText}>Mulai Aplikasi</Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  emblemContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emblemIconBox: {
    width: 76,
    height: 76,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  brandTitle: {
    fontFamily: SANS_FONT,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  brandSubtitle: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  sniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
  },
  sniBadgeText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
  },
  loadingBox: {
    width: '100%',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
  },
  loadingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  loadingText: {
    flex: 1,
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  loadingPercent: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  skipBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  skipBtnText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
  },
  welcomeContainer: {
    width: '100%',
  },
  welcomeHeading: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 8,
    marginLeft: 4,
  },
  featureList: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '700',
  },
  featureDesc: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  startBtnText: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
