import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, fontSizes, fontWeights, iconSizes, layout } from '../../theme';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  style?: ViewStyle;
  color?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  style,
  color = colors.primary,
}: StatsCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 64,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 32,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 20,
    fontWeight: fontWeights.bold,
  },
});
