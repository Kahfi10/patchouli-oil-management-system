import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, X, CheckCheck, Clock, TrendingUp, ShieldCheck, Sparkles, ChevronRight, Check } from 'lucide-react-native';
import { AppNotification } from '../../data/mockData';
import { getAppleTheme, ThemeMode } from '../theme/colors';
import { SANS_FONT } from '../theme/typography';
import { TabId } from './BottomNav';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  mode: ThemeMode;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: AppNotification) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  mode,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
  onNavigateTab,
}) => {
  const theme = getAppleTheme(mode);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ketel' | 'pasar' | 'escrow'>('ALL');

  const filteredNotifs = notifications.filter((n) => {
    if (selectedFilter === 'ALL') return true;
    return n.category === selectedFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'ketel':
        return <Clock size={16} color={theme.oilAmber} strokeWidth={2.2} />;
      case 'pasar':
        return <TrendingUp size={16} color={theme.accent} strokeWidth={2.2} />;
      case 'escrow':
        return <ShieldCheck size={16} color={theme.accent} strokeWidth={2.2} />;
      case 'sistem':
      default:
        return <Sparkles size={16} color={theme.accent} strokeWidth={2.2} />;
    }
  };

  const getCategoryBadgeBg = (category: AppNotification['category']) => {
    switch (category) {
      case 'ketel':
        return theme.oilAmberTint;
      case 'pasar':
      case 'escrow':
      case 'sistem':
      default:
        return theme.accentTint;
    }
  };

  const handleNotificationPress = (item: AppNotification) => {
    onSelectNotification(item);
    if (item.actionTab) {
      onClose();
      onNavigateTab(item.actionTab);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWithBadge}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Pusat Notifikasi</Text>
              {unreadCount > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: theme.accentTint }]}>
                  <Text style={[styles.unreadBadgeText, { color: theme.accent }]}>
                    {unreadCount} Baru
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onMarkAllAsRead}
                  style={[styles.markReadBtn, { backgroundColor: theme.surfaceSecondary }]}
                >
                  <CheckCheck size={14} color={theme.text} strokeWidth={2.2} />
                  <Text style={[styles.markReadText, { color: theme.text }]}>Tandai Dibaca</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
              >
                <X size={17} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Filter Tabs */}
          <View style={[styles.filterBar, { backgroundColor: theme.surfaceSecondary }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedFilter('ALL')}
              style={[
                styles.filterTab,
                selectedFilter === 'ALL' && [styles.filterTabActive, { backgroundColor: theme.surface }],
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: selectedFilter === 'ALL' ? theme.text : theme.textSecondary },
                  selectedFilter === 'ALL' && { fontWeight: '700' },
                ]}
              >
                Semua ({notifications.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedFilter('ketel')}
              style={[
                styles.filterTab,
                selectedFilter === 'ketel' && [styles.filterTabActive, { backgroundColor: theme.surface }],
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: selectedFilter === 'ketel' ? theme.text : theme.textSecondary },
                  selectedFilter === 'ketel' && { fontWeight: '700' },
                ]}
              >
                Ketel Suling
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedFilter('pasar')}
              style={[
                styles.filterTab,
                selectedFilter === 'pasar' && [styles.filterTabActive, { backgroundColor: theme.surface }],
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: selectedFilter === 'pasar' ? theme.text : theme.textSecondary },
                  selectedFilter === 'pasar' && { fontWeight: '700' },
                ]}
              >
                Pasar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedFilter('escrow')}
              style={[
                styles.filterTab,
                selectedFilter === 'escrow' && [styles.filterTabActive, { backgroundColor: theme.surface }],
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: selectedFilter === 'escrow' ? theme.text : theme.textSecondary },
                  selectedFilter === 'escrow' && { fontWeight: '700' },
                ]}
              >
                Escrow
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notifications Scroll Feed */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {filteredNotifs.length === 0 ? (
              <View style={styles.emptyBox}>
                <Bell size={32} color={theme.textTertiary} strokeWidth={1.5} />
                <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>
                  Tidak Ada Notifikasi
                </Text>
                <Text style={[styles.emptySub, { color: theme.textTertiary }]}>
                  Seluruh pembaruan bursa dan fase ketel akan muncul di sini.
                </Text>
              </View>
            ) : (
              filteredNotifs.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.75}
                  onPress={() => handleNotificationPress(item)}
                  style={[
                    styles.notifCard,
                    {
                      backgroundColor: item.isRead ? theme.surfaceSecondary : theme.surface,
                      borderColor: item.isRead ? theme.border : theme.accent,
                      borderWidth: item.isRead ? 1 : 1.5,
                    },
                  ]}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.categoryTitleRow}>
                      <View style={[styles.iconBox, { backgroundColor: getCategoryBadgeBg(item.category) }]}>
                        {getCategoryIcon(item.category)}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.notifTitle, { color: theme.text }]}>{item.title}</Text>
                        <Text style={[styles.timestampText, { color: theme.textTertiary }]}>
                          {item.timestamp}
                        </Text>
                      </View>
                    </View>

                    {!item.isRead && (
                      <View style={[styles.dotIndicator, { backgroundColor: theme.accent }]} />
                    )}
                  </View>

                  <Text style={[styles.notifBody, { color: theme.textSecondary }]}>
                    {item.message}
                  </Text>

                  {item.actionTab && (
                    <View style={styles.actionFooter}>
                      <Text style={[styles.actionText, { color: theme.accent }]}>
                        Buka Halaman {item.actionTab.toUpperCase()} &rarr;
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    maxHeight: '82%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontFamily: SANS_FONT,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  unreadBadgeText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 10,
  },
  markReadText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 9,
  },
  filterTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  filterLabel: {
    fontFamily: SANS_FONT,
    fontSize: 11,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
  },
  emptyTitle: {
    fontFamily: SANS_FONT,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  emptySub: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  notifCard: {
    padding: 13,
    borderRadius: 14,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '700',
  },
  timestampText: {
    fontFamily: SANS_FONT,
    fontSize: 10,
    marginTop: 1,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
    marginLeft: 6,
  },
  notifBody: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 17,
  },
  actionFooter: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
  },
  actionText: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
});
