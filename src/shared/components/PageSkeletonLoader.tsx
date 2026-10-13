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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0.4)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const tabMeta = TAB_TITLES[targetTab] || TAB_TITLES.beranda;

  useEffect(() => {
    // 1. Smooth Fade In (110ms)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 110,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // 2. Gentle hairline progress fill
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 240,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    // 3. Calm shimmer loop for background placeholders
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.75,
          duration: 340,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.4,
          duration: 340,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    shimmerLoop.start();

    // 4. Smooth Fade Out (130ms) -> in and in-out transition
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 130,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        shimmerLoop.stop();
        if (onFinish) onFinish();
      });
    }, 180);

    return () => {
      clearTimeout(timer);
      shimmerLoop.stop();
    };
  }, []);

  const skeletonColor = theme.surfaceSecondary;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['10%', '100%'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          backgroundColor: theme.canvas,
          opacity: fadeAnim,
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
              { backgroundColor: skeletonColor, opacity: shimmerAnim },
            ]}
          />
        </View>

        {/* 2. Hero Brand Beacon Card (Simple, Pure, Serene) */}
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
          <View
            style={[
              styles.emblemBadge,
              {
                backgroundColor: theme.accentTint,
                borderColor: theme.border,
              },
            ]}
          >
            <Image
              source={require('../../../assets/logo_emblem.png')}
              style={styles.emblemIcon}
              resizeMode="contain"
            />
          </View>

          {/* Crisp Loading Subtitle */}
          <Text style={[styles.loadingLabel, { color: theme.textSecondary }]}>
            {tabMeta.subtitle}
          </Text>

          {/* Simple Hairline Accent Progress Track */}
          <View style={[styles.hairlineTrack, { backgroundColor: theme.surfaceSecondary }]}>
            <Animated.View
              style={[
                styles.hairlineBar,
                {
                  backgroundColor: theme.accent,
                  width: progressWidth,
                },
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
                  { backgroundColor: skeletonColor, opacity: shimmerAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.smallPillBar,
                  { backgroundColor: skeletonColor, opacity: shimmerAnim },
                ]}
              />
            </View>
            <Animated.View
              style={[
                styles.largeMetricBar,
                { backgroundColor: skeletonColor, opacity: shimmerAnim },
              ]}
            />
            <Animated.View
              style={[
                styles.metricDetailBar,
                { backgroundColor: skeletonColor, opacity: shimmerAnim },
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
                { backgroundColor: skeletonColor, opacity: shimmerAnim },
              ]}
            />
            <View style={styles.rowTextCol}>
              <Animated.View
                style={[
                  styles.rowTitleBar,
                  { backgroundColor: skeletonColor, opacity: shimmerAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.rowSubBar,
                  { backgroundColor: skeletonColor, opacity: shimmerAnim },
                ]}
              />
            </View>
            <Animated.View
              style={[
                styles.actionPillBar,
                { backgroundColor: skeletonColor, opacity: shimmerAnim },
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
    width: 60,
    height: 60,
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
    width: 38,
    height: 38,
  },
  loadingLabel: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 12,
    textAlign: 'center',
  },
  hairlineTrack: {
    width: 120,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 10,
  },
  hairlineBar: {
    height: '100%',
    borderRadius: 2,
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


