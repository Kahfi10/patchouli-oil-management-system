import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { HeaderBar } from './src/shared/components/HeaderBar';
import { BottomNav, TabId } from './src/shared/components/BottomNav';
import { MarketTickerScreen } from './src/features/market-ticker/MarketTickerScreen';
import { YieldCalculatorScreen } from './src/features/yield-calculator/YieldCalculatorScreen';
import { MarketplaceScreen } from './src/features/marketplace/MarketplaceScreen';
import { DistillationBatchScreen } from './src/features/distillation-batch/DistillationBatchScreen';
import { EscrowOrdersScreen } from './src/features/escrow-orders/EscrowOrdersScreen';
import { LeafDiagnosticScreen } from './src/features/leaf-diagnostic/LeafDiagnosticScreen';
import { AppEntranceScreen } from './src/features/onboarding/AppEntranceScreen';
import { getAppleTheme, ThemeMode } from './src/shared/theme/colors';

export default function App() {
  // Apple standard clean light mode by default
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [activeTab, setActiveTab] = useState<TabId>('beranda');
  const [showEntrance, setShowEntrance] = useState<boolean>(true);

  const theme = getAppleTheme(themeMode);

  const toggleThemeMode = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'beranda':
        return (
          <MarketTickerScreen
            mode={themeMode}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'kalkulator':
        return <YieldCalculatorScreen mode={themeMode} />;
      case 'marketplace':
        return (
          <MarketplaceScreen
            mode={themeMode}
            onNavigateToEscrow={() => setActiveTab('escrow')}
          />
        );
      case 'ketel':
        return <DistillationBatchScreen mode={themeMode} />;
      case 'escrow':
        return <EscrowOrdersScreen mode={themeMode} />;
      case 'diagnosa':
        return <LeafDiagnosticScreen mode={themeMode} onBack={() => setActiveTab('beranda')} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      <StatusBar
        barStyle={themeMode === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.surface}
      />

      {showEntrance ? (
        /* Splash & Initial Onboarding Sequence */
        <AppEntranceScreen
          mode={themeMode}
          onFinish={() => setShowEntrance(false)}
        />
      ) : (
        /* Main Application Workspace */
        <View style={[styles.container, { backgroundColor: theme.canvas }]}>
          {/* Top Apple Style Header */}
          <HeaderBar
            mode={themeMode}
            onToggleMode={toggleThemeMode}
            onOpenEntrance={() => setShowEntrance(true)}
            activeNotificationsCount={2}
          />

          {/* Content Body */}
          <View style={styles.body}>{renderActiveScreen()}</View>

          {/* Bottom Apple Style Tab Bar */}
          <BottomNav
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            mode={themeMode}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
});
