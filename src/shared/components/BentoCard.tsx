import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Animated } from 'react-native';
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
  const pressScale = useRef(new Animated.Value(1)).current;

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
    const handlePressIn = () => {
      Animated.timing(pressScale, {
        toValue: 0.982,
        duration: 90,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 6,
        tension: 180,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={cardStyle}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
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

