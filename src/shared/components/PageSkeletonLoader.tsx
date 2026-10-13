import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { getAppleTheme, ThemeMode } from '../theme/colors';
import { SANS_FONT } from '../theme/typography';
import { TabId } from './BottomNav';

interface PageSkeletonLoaderProps {
  mode: ThemeMode;
  targetTab?: TabId;
  onFinish?: () => void;
}

const TAB_TITLES: Record<TabId, { title: string; subtitle: string }> = {
  beranda: {
    title: 'Beranda & Bursa',
    subtitle: 'Memuat data acuan harga regional...',
  },
  kalkulator: {
    title: 'Kalkulator Rendemen',
    subtitle: 'Menyiapkan modul simulasi HPP & laba...',
  },
  marketplace: {
    title: 'Direktori Bursa',
    subtitle: 'Memuat daftar pasokan minyak nilam...',
  },
  ketel: {
    title: 'Batch Distilasi',
    subtitle: 'Memuat log ketel & paspor digital...',
  },
  escrow: {
    title: 'Rekening Escrow',
    subtitle: 'Menyiapkan transaksi aman bersyarat...',
  },
  diagnosa: {
    title: 'Diagnosa Daun',
    subtitle: 'Menyiapkan scanner daun nilam...',
  },
};

export const PageSkeletonLoader: React.FC<PageSkeletonLoaderProps> = ({
  mode,
  targetTab = 'beranda',
  onFinish,
}) => {
  const theme = getAppleTheme(mode);
  const pulseAnim = useRef(new Animated.Value(0.35)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  // 3-dot wave pulse animators
  const dot1Anim = useRef(new Animated.Value(0.25)).current;
  const dot2Anim = useRef(new Animated.Value(0.25)).current;
  const dot3Anim = useRef(new Animated.Value(0.25)).current;

  const tabMeta = TAB_TITLES[targetTab] || TAB_TITLES.beranda;

  useEffect(() => {
    // 1. Shimmer pulse loop for skeleton blocks
    const loopPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 380,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 380,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loopPulse.start();

    // 2. Gentle breathing scale loop for logo emblem
    const loopScale = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 420,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.96,
          duration: 420,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loopScale.start();

    // 3. Staggered 3-dot wave animation
    const animateDot = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 220,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.25,
            duration: 220,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.delay(Math.max(0, 320 - delay)),
        ])
      );
    };

    const loopDot1 = animateDot(dot1Anim, 0);
    const loopDot2 = animateDot(dot2Anim, 120);
    const loopDot3 = animateDot(dot3Anim, 240);

    loopDot1.start();
    loopDot2.start();
    loopDot3.start();

    // 4. Snappy auto-transition timing (280ms active -> 100ms fadeout)
    const timer = setTimeout(() => {
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        loopPulse.stop();
        loopScale.stop();
        loopDot1.stop();
        loopDot2.stop();
        loopDot3.stop();
        if (onFinish) onFinish();
      });
    }, 280);

    return () => {
      clearTimeout(timer);
      loopPulse.stop();
      loopScale.stop();
      loopDot1.stop();
      loopDot2.stop();
      loopDot3.stop();
    };
  }, []);

  const skeletonColor = theme.surfaceSecondary;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          backgroundColor: theme.canvas,
          opacity: fadeOutAnim,
        },
      ]}
    >
      <View style={styles.innerWrapper}>
        {/* 1. Aligned Title & Subtitle Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.targetTitleText, { color: theme.text }]}>
            {tabMeta.title}
          </Text>
        <Animated.View
          style={[
            styles.subtitleSkeletonBar,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
      </View>

      {/* 2. Hero Brand Beacon Card (Pristine Symmetrical Island) */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.cardShadow,
          },
        ]}
      >
        {/* Isolated Textless Emblem Squircle */}
        <Animated.View
          style={[
            styles.emblemBadge,
            {
              backgroundColor: theme.accentTint,
              borderColor: theme.border,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../../../assets/logo_emblem.png')}
            style={styles.emblemIcon}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Crisp Loading Subtitle */}
        <Text style={[styles.loadingLabel, { color: theme.textSecondary }]}>
          {tabMeta.subtitle}
        </Text>

        {/* Apple 3-Dot Staggered Wave Pulse */}
        <View style={styles.dotsRow}>
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: theme.accent, opacity: dot1Anim },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: theme.accent, opacity: dot2Anim },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: theme.accent, opacity: dot3Anim },
            ]}
          />
        </View>
      </View>

      {/* 3. Symmetrical Bento Skeleton Cards */}
      <View style={styles.skeletonList}>
        {/* Metric Summary Skeleton */}
        <View
          style={[
            styles.metricCardSkeleton,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.metricTopRow}>
            <Animated.View
              style={[
                styles.smallBadgeBar,
                { backgroundColor: skeletonColor, opacity: pulseAnim },
              ]}
            />
            <Animated.View
              style={[
                styles.smallPillBar,
                { backgroundColor: skeletonColor, opacity: pulseAnim },
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.largeMetricBar,
              { backgroundColor: skeletonColor, opacity: pulseAnim },
            ]}
          />
          <Animated.View
            style={[
              styles.metricDetailBar,
              { backgroundColor: skeletonColor, opacity: pulseAnim },
            ]}
          />
        </View>

        {/* Symmetrical List Item Skeleton */}
        <View
          style={[
            styles.rowCardSkeleton,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Animated.View
            style={[
              styles.iconBoxSkeleton,
              { backgroundColor: skeletonColor, opacity: pulseAnim },
            ]}
          />
          <View style={styles.rowTextCol}>
            <Animated.View
              style={[
                styles.rowTitleBar,
                { backgroundColor: skeletonColor, opacity: pulseAnim },
              ]}
            />
            <Animated.View
              style={[
                styles.rowSubBar,
                { backgroundColor: skeletonColor, opacity: pulseAnim },
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.actionPillBar,
              { backgroundColor: skeletonColor, opacity: pulseAnim },
            ]}
          />
        </View>
      </View>
    </View>
  </Animated.View>
);
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: 'center',
  },
  innerWrapper: {
    width: '100%',
    maxWidth: 600,
  },
  titleSection: {
    marginBottom: 14,
  },
  targetTitleText: {
    fontFamily: SANS_FONT,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitleSkeletonBar: {
    width: '65%',
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emblemBadge: {
    width: 62,
    height: 62,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  emblemIcon: {
    width: 40,
    height: 40,
  },
  loadingLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 12,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3.5,
  },
  skeletonList: {
    gap: 12,
  },
  metricCardSkeleton: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  metricTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallBadgeBar: {
    width: 80,
    height: 12,
    borderRadius: 6,
  },
  smallPillBar: {
    width: 44,
    height: 12,
    borderRadius: 6,
  },
  largeMetricBar: {
    width: 130,
    height: 22,
    borderRadius: 6,
    marginTop: 12,
  },
  metricDetailBar: {
    width: '75%',
    height: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  rowCardSkeleton: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBoxSkeleton: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  rowTextCol: {
    flex: 1,
  },
  rowTitleBar: {
    width: '65%',
    height: 13,
    borderRadius: 5,
  },
  rowSubBar: {
    width: '42%',
    height: 10,
    borderRadius: 4,
    marginTop: 6,
  },
  actionPillBar: {
    width: 48,
    height: 20,
    borderRadius: 10,
  },
});

