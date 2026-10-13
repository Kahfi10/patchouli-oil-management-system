import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform, Animated, Easing } from 'react-native';
import { HeaderBar } from './src/shared/components/HeaderBar';
import { BottomNav, TabId } from './src/shared/components/BottomNav';
import { MarketTickerScreen } from './src/features/market-ticker/MarketTickerScreen';
import { YieldCalculatorScreen } from './src/features/yield-calculator/YieldCalculatorScreen';
import { MarketplaceScreen } from './src/features/marketplace/MarketplaceScreen';
import { DistillationBatchScreen } from './src/features/distillation-batch/DistillationBatchScreen';
import { EscrowOrdersScreen } from './src/features/escrow-orders/EscrowOrdersScreen';
import { LeafDiagnosticScreen } from './src/features/leaf-diagnostic/LeafDiagnosticScreen';
import { AppEntranceScreen } from './src/features/onboarding/AppEntranceScreen';
import { NotificationsModal } from './src/shared/components/NotificationsModal';
import { PageSkeletonLoader } from './src/shared/components/PageSkeletonLoader';
import { MOCK_NOTIFICATIONS, AppNotification } from './src/data/mockData';
import { loadSavedNotifications, saveNotifications } from './src/shared/utils/storage';
import { getAppleTheme, ThemeMode } from './src/shared/theme/colors';

export default function App() {
  // Apple standard clean light mode by default
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [activeTab, setActiveTab] = useState<TabId>('beranda');
  const [showEntrance, setShowEntrance] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  // Simple, silky Fade In and Out screen transitions
  const contentFadeAnim = useRef(new Animated.Value(1)).current;
  const [isPageTransitioning, setIsPageTransitioning] = useState<boolean>(false);
  const [transitionTargetTab, setTransitionTargetTab] = useState<TabId>('beranda');

  const theme = getAppleTheme(themeMode);

  // Load offline persisted notifications
  useEffect(() => {
    loadSavedNotifications().then((saved) => {
      if (saved && saved.length > 0) {
        setNotifications(saved);
      }
    });
  }, []);

  const toggleThemeMode = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSwitchTab = (newTab: TabId) => {
    if (newTab === activeTab) return;
    setTransitionTargetTab(newTab);
    setIsPageTransitioning(true);

    // 1. Smooth Fade Out of current screen (120ms)
    Animated.timing(contentFadeAnim, {
      toValue: 0,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      // 2. Switch tab content while invisible
      setActiveTab(newTab);

      // 3. Smooth Fade In of new screen (160ms)
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 160,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setIsPageTransitioning(false);
      });
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    await saveNotifications(updated);
  };

  const handleSelectNotification = async (item: AppNotification) => {
    const updated = notifications.map((n) => (n.id === item.id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    await saveNotifications(updated);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'beranda':
        return (
          <MarketTickerScreen
            mode={themeMode}
            onNavigateTab={(tab) => handleSwitchTab(tab)}
          />
        );
      case 'kalkulator':
        return <YieldCalculatorScreen mode={themeMode} />;
      case 'marketplace':
        return (
          <MarketplaceScreen
            mode={themeMode}
            onNavigateToEscrow={() => handleSwitchTab('escrow')}
          />
        );
      case 'ketel':
        return <DistillationBatchScreen mode={themeMode} />;
      case 'escrow':
        return <EscrowOrdersScreen mode={themeMode} />;
      case 'diagnosa':
        return <LeafDiagnosticScreen mode={themeMode} onBack={() => handleSwitchTab('beranda')} />;
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
            onOpenNotifications={() => setShowNotifications(true)}
            activeNotificationsCount={unreadCount}
          />

          {/* Content Body with Silky Fade In & Fade Out Transition */}
          <View style={styles.body}>
            <Animated.View style={[styles.screenWrapper, { opacity: contentFadeAnim }]}>
              {renderActiveScreen()}
            </Animated.View>
            {isPageTransitioning && (
              <PageSkeletonLoader
                mode={themeMode}
                targetTab={transitionTargetTab}
                onFinish={() => setIsPageTransitioning(false)}
              />
            )}
          </View>

          {/* Bottom Apple Style Tab Bar */}
          <BottomNav
            activeTab={activeTab}
            onChangeTab={handleSwitchTab}
            mode={themeMode}
          />

          {/* Interactive Notifications Modal */}
          <NotificationsModal
            visible={showNotifications}
            onClose={() => setShowNotifications(false)}
            mode={themeMode}
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onSelectNotification={handleSelectNotification}
            onNavigateTab={(tab) => handleSwitchTab(tab)}
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
    position: 'relative',
    overflow: 'hidden',
  },
  screenWrapper: {
    flex: 1,
  },
});
