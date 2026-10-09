import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LayoutDashboard, Calculator, ShoppingBag, Layers, ShieldCheck } from 'lucide-react-native';
import { getAppleTheme, ThemeMode } from '../theme/colors';
import { SANS_FONT } from '../theme/typography';

export type TabId = 'beranda' | 'kalkulator' | 'marketplace' | 'ketel' | 'escrow' | 'diagnosa';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  mode: ThemeMode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  mode,
}) => {
  const theme = getAppleTheme(mode);

  const tabs: { id: TabId; label: string; icon: (isActive: boolean) => React.ReactNode }[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: (isActive) => (
        <LayoutDashboard
          size={20}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
      ),
    },
    {
      id: 'kalkulator',
      label: 'Kalkulator',
      icon: (isActive) => (
        <Calculator
          size={20}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
      ),
    },
    {
      id: 'marketplace',
      label: 'Bursa',
      icon: (isActive) => (
        <ShoppingBag
          size={20}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
      ),
    },
    {
      id: 'ketel',
      label: 'Batch QR',
      icon: (isActive) => (
        <Layers
          size={20}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
      ),
    },
    {
      id: 'escrow',
      label: 'Escrow',
      icon: (isActive) => (
        <ShieldCheck
          size={20}
          color={isActive ? theme.accent : theme.textTertiary}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
      ),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => onChangeTab(tab.id)}
            style={styles.tabButton}
          >
            <View style={styles.iconContainer}>{tab.icon(isActive)}</View>
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? theme.accent : theme.textTertiary },
                isActive && { fontWeight: '600' },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingBottom: 22,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    marginTop: 3,
  },
});
