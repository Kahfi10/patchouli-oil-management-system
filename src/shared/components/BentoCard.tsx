import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { getAppleTheme, ThemeMode } from '../theme/colors';

interface BentoCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  mode?: ThemeMode;
  onPress?: () => void;
  accentBorder?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  style,
  mode = 'light',
  onPress,
  accentBorder = false,
}) => {
  const theme = getAppleTheme(mode);

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.surface,
      borderColor: accentBorder ? theme.accent : theme.border,
      shadowColor: theme.cardShadow,
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
});
