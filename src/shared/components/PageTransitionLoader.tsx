import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { getAppleTheme, ThemeMode } from '../theme/colors';
import { SANS_FONT } from '../theme/typography';
import { TabId } from './BottomNav';

interface PageTransitionLoaderProps {
  targetTab: TabId;
  mode: ThemeMode;
  onFinish: () => void;
}

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  targetTab,
  mode,
  onFinish,
}) => {
  const theme = getAppleTheme(mode);

  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getTabLabel = (tab: TabId): string => {
    switch (tab) {
      case 'kalkulator':
        return 'Menyiapkan Kalkulator Rendemen...';
      case 'marketplace':
        return 'Memuat Bursa Nilam & Escrow...';
      case 'ketel':
        return 'Sinkronisasi Log Ketel & Batch...';
      case 'escrow':
        return 'Membuka Vault Transaksi Escrow...';
      case 'diagnosa':
        return 'Menyiapkan Diagnosa Daun...';
      case 'beranda':
      default:
        return 'Memperbarui Bursa Regional...';
    }
  };

  useEffect(() => {
    // 1. Fade in quickly
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();

    // 2. Pulse scale animation on the leaf emblem
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
        duration: 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 140,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Auto dismiss after quick, snappy transition (320ms)
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 320);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.overlay,
        {
          backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.65)' : 'rgba(255, 255, 255, 0.75)',
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.loaderCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glowing Aura Ring with Emblem */}
        <View style={[styles.emblemContainer, { backgroundColor: theme.accentTint }]}>
          <Image
            source={require('../../../assets/logo_emblem.png')}
            style={styles.emblemImage}
            resizeMode="contain"
          />
        </View>

        {/* Dynamic Contextual Text */}
        <Text style={[styles.loadingLabel, { color: theme.text }]}>
          {getTabLabel(targetTab)}
        </Text>

        {/* Micro Dots Track */}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, { backgroundColor: theme.accent }]} />
          <View style={[styles.dot, { backgroundColor: theme.accent, opacity: 0.7 }]} />
          <View style={[styles.dot, { backgroundColor: theme.accent, opacity: 0.4 }]} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCard: {
    paddingVertical: 20,
    paddingHorizontal: 26,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    minWidth: 220,
  },
  emblemContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emblemImage: {
    width: 44,
    height: 44,
  },
  loadingLabel: {
    fontFamily: SANS_FONT,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
