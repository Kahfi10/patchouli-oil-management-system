import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LayoutDashboard, Calculator, ShoppingBag, Layers, ShieldCheck } from 'lucide-react-native';
import { getAppleTheme, ThemeMode } from '../theme/colors';
import { SANS_FONT } from '../theme/typography';

export type TabId = 'beranda' | 'kalkulator' | 'marketplace' | 'ketel' | 'escrow' | 'diagnosa';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  mode: ThemeMode;
}

interface TabDef {
  id: TabId;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
}

interface BottomNavItemProps {
  tab: TabDef;
  isActive: boolean;
  onPress: () => void;
  theme: ReturnType<typeof getAppleTheme>;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  tab,
  isActive,
  onPress,
  theme,
}) => {
  const pillOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(pillOpacity, {
      toValue: isActive ? 1 : 0,
      duration: 140,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.tabButton}
    >
      <View style={styles.iconContainer}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.activeIconPill,
            {
              backgroundColor: theme.accentTint,
              opacity: pillOpacity,
            },
          ]}
        />
        {tab.icon(isActive)}
      </View>
      <Text
        style={[
          styles.tabLabel,
          { color: isActive ? theme.accent : theme.textTertiary },
          isActive && { fontWeight: '700' },
        ]}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  mode,
}) => {
  const theme = getAppleTheme(mode);

  const tabs: TabDef[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: (isActive) => (
        <LayoutDashboard
          size={19}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.3 : 1.8}
        />
      ),
    },
    {
      id: 'kalkulator',
      label: 'Kalkulator',
      icon: (isActive) => (
        <Calculator
          size={19}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.3 : 1.8}
        />
      ),
    },
    {
      id: 'marketplace',
      label: 'Bursa',
      icon: (isActive) => (
        <ShoppingBag
          size={19}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.3 : 1.8}
        />
      ),
    },
    {
      id: 'ketel',
      label: 'Batch QR',
      icon: (isActive) => (
        <Layers
          size={19}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.3 : 1.8}
        />
      ),
    },
    {
      id: 'escrow',
      label: 'Escrow',
      icon: (isActive) => (
        <ShieldCheck
          size={19}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.3 : 1.8}
        />
      ),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {tabs.map((tab) => (
        <BottomNavItem
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onPress={() => onChangeTab(tab.id)}
          theme={theme}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 7,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    height: 30,
    width: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconPill: {
    borderRadius: 15,
  },
  tabLabel: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    marginTop: 2,
  },
});

