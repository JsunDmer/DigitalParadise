import React from 'react';
import { View, Text, StyleSheet, Switch, ViewStyle } from 'react-native';
import { colors, borderRadius, fontSizes, fontWeights, iconSizes, layout } from '../../theme';

interface SettingSwitchProps {
  icon: string;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
}

export default function SettingSwitch({
  icon,
  label,
  value,
  onValueChange,
  style,
}: SettingSwitchProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E0E0E0', true: colors.primaryLight }}
        thumbColor={value ? colors.primary : '#F4F3F4'}
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.settingItem,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: iconSizes.medium,
    height: iconSizes.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: iconSizes.medium,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  switch: {
    width: 56,
    height: 32,
  },
});
