import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';
import { getAppleTheme, ThemeMode } from '../theme/colors';

interface PageSkeletonLoaderProps {
  mode: ThemeMode;
  onFinish?: () => void;
}

export const PageSkeletonLoader: React.FC<PageSkeletonLoaderProps> = ({ mode, onFinish }) => {
  const theme = getAppleTheme(mode);
  const pulseAnim = useRef(new Animated.Value(0.35)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Smooth pulsing shimmer animation
    const loopPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.75,
          duration: 320,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 320,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loopPulse.start();

    // 2. Snappy, minimalist auto-transition (300ms)
    const timer = setTimeout(() => {
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        loopPulse.stop();
        if (onFinish) onFinish();
      });
    }, 280);

    return () => {
      clearTimeout(timer);
      loopPulse.stop();
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
      {/* 1. Title Bar Skeleton */}
      <View style={styles.titleSection}>
        <Animated.View
          style={[
            styles.skeletonBlock,
            styles.largeTitleSkeleton,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonBlock,
            styles.subtitleSkeleton,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
      </View>

      {/* 2. Segmented Pill Tab Bar Skeleton */}
      <Animated.View
        style={[
          styles.segmentedSkeleton,
          { backgroundColor: skeletonColor, opacity: pulseAnim },
        ]}
      />

      {/* 3. Hero Card Skeleton with Minimalist Centered Emblem */}
      <View
        style={[
          styles.heroCardSkeleton,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Animated.View
          style={[
            styles.skeletonBlock,
            styles.heroHeaderBar,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonBlock,
            styles.heroMetricBar,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />

        {/* Minimalist Centered Textless Logo Pulse (Simple & Clean) */}
        <Animated.View
          style={[
            styles.centerEmblemWrapper,
            { opacity: pulseAnim },
          ]}
        >
          <Image
            source={require('../../../assets/logo_emblem.png')}
            style={styles.emblemIcon}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.skeletonBlock,
            styles.heroBottomBar,
            { backgroundColor: skeletonColor, opacity: pulseAnim },
          ]}
        />
      </View>

      {/* 4. List Items Skeletons */}
      <View style={styles.listSkeletonSection}>
        {[1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.itemSkeletonRow,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Animated.View
              style={[
                styles.iconBoxSkeleton,
                { backgroundColor: skeletonColor, opacity: pulseAnim },
              ]}
            />
            <View style={styles.itemTextContainer}>
              <Animated.View
                style={[
                  styles.skeletonBlock,
                  styles.itemTitleBar,
                  { backgroundColor: skeletonColor, opacity: pulseAnim },
                ]}
              />
              <Animated.View
                style={[
                  styles.skeletonBlock,
                  styles.itemSubBar,
                  { backgroundColor: skeletonColor, opacity: pulseAnim },
                ]}
              />
            </View>
          </View>
        ))}
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
    zIndex: 999,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  skeletonBlock: {
    borderRadius: 8,
  },
  titleSection: {
    marginBottom: 16,
  },
  largeTitleSkeleton: {
    width: '55%',
    height: 24,
    borderRadius: 7,
  },
  subtitleSkeleton: {
    width: '78%',
    height: 12,
    marginTop: 8,
    borderRadius: 5,
  },
  segmentedSkeleton: {
    height: 34,
    borderRadius: 12,
    marginBottom: 16,
  },
  heroCardSkeleton: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    height: 165,
    marginBottom: 16,
    justifyContent: 'space-between',
    position: 'relative',
  },
  heroHeaderBar: {
    width: '40%',
    height: 14,
  },
  heroMetricBar: {
    width: '60%',
    height: 26,
    borderRadius: 6,
  },
  centerEmblemWrapper: {
    position: 'absolute',
    top: 55,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemIcon: {
    width: 48,
    height: 48,
  },
  heroBottomBar: {
    width: '85%',
    height: 10,
  },
  listSkeletonSection: {
    gap: 10,
  },
  itemSkeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  iconBoxSkeleton: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  itemTextContainer: {
    flex: 1,
    gap: 6,
  },
  itemTitleBar: {
    width: '65%',
    height: 14,
  },
  itemSubBar: {
    width: '85%',
    height: 10,
  },
});
