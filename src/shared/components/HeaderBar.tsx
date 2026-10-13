import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { Bell, Sun, Moon, ShieldCheck, HelpCircle } from 'lucide-react-native';
import { getAppleTheme, ThemeMode } from '../theme/colors';
import { SANS_FONT } from '../theme/typography';

interface HeaderBarProps {
  mode: ThemeMode;
  onToggleMode: () => void;
  onOpenEntrance?: () => void;
  onOpenNotifications?: () => void;
  activeNotificationsCount?: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  mode,
  onToggleMode,
  onOpenEntrance,
  onOpenNotifications,
  activeNotificationsCount = 2,
}) => {
  const theme = getAppleTheme(mode);

  // Animated values
  const modeRotateAnim = useRef(new Animated.Value(mode === 'dark' ? 1 : 0)).current;
  const bellScaleAnim = useRef(new Animated.Value(1)).current;
  const emblemScaleAnim = useRef(new Animated.Value(1)).current;

  // 1. Emblem subtle breathing animation
  useEffect(() => {
    const loopEmblem = Animated.loop(
      Animated.sequence([
        Animated.timing(emblemScaleAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(emblemScaleAnim, {
          toValue: 0.95,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loopEmblem.start();
    return () => loopEmblem.stop();
  }, []);

  // 2. Animate theme icon rotation on mode change
  useEffect(() => {
    Animated.spring(modeRotateAnim, {
      toValue: mode === 'dark' ? 1 : 0,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [mode]);

  // 3. Subtle notification pulse if unread exists
  useEffect(() => {
    if (activeNotificationsCount > 0) {
      const loopBell = Animated.loop(
        Animated.sequence([
          Animated.delay(3500),
          Animated.timing(bellScaleAnim, {
            toValue: 1.25,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(bellScaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 200,
            useNativeDriver: true,
          }),
        ])
      );
      loopBell.start();
      return () => loopBell.stop();
    }
  }, [activeNotificationsCount]);

  const spin = modeRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      {/* Brand & Subtitle - Clean Apple Typography */}
      <View style={styles.brandContainer}>
        <View style={styles.titleRow}>
          <Animated.View style={{ transform: [{ scale: emblemScaleAnim }] }}>
            <Image
              source={require('../../../assets/logo_emblem.png')}
              style={{ width: 24, height: 24, marginRight: 4 }}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={[styles.brandTitle, { color: theme.text }]}>SulingTrace</Text>
          <View style={[styles.verifiedBadge, { backgroundColor: theme.accentTint }]}>
            <ShieldCheck size={11} color={theme.accent} strokeWidth={2.2} />
            <Text style={[styles.verifiedText, { color: theme.accent }]}>SNI 06-2385</Text>
          </View>
        </View>
        <Text style={[styles.locationText, { color: theme.textSecondary }]}>
          Sistem Pengelolaan Minyak Nilam
        </Text>
      </View>

      {/* Apple Style Icon Buttons */}
      <View style={styles.actionsRow}>
        {onOpenEntrance && (
          <TouchableOpacity
            activeOpacity={0.65}
            onPress={onOpenEntrance}
            style={[styles.iconButton, { backgroundColor: theme.surfaceSecondary }]}
          >
            <HelpCircle size={17} color={theme.text} strokeWidth={2} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.65}
          onPress={onToggleMode}
          style={[styles.iconButton, { backgroundColor: theme.surfaceSecondary }]}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            {mode === 'dark' ? (
              <Sun size={17} color={theme.text} strokeWidth={2} />
            ) : (
              <Moon size={17} color={theme.text} strokeWidth={2} />
            )}
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.65}
          onPress={onOpenNotifications}
          style={[styles.iconButton, { backgroundColor: theme.surfaceSecondary }]}
        >
          <Bell size={17} color={theme.text} strokeWidth={2} />
          {activeNotificationsCount > 0 && (
            <Animated.View
              style={[
                styles.notifBadge,
                { transform: [{ scale: bellScaleAnim }] },
              ]}
            >
              <Text style={styles.notifText}>{activeNotificationsCount}</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontFamily: SANS_FONT,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    fontWeight: '600',
  },
  locationText: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notifText: {
    fontFamily: SANS_FONT,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
