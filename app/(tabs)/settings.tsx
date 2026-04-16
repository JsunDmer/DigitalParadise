import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '@/components/layout/Header';
import { SettingSwitch } from '@/components/ui';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { colors, spacing, fontSizes, fontWeights } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { soundEnabled, musicEnabled, notificationsEnabled, toggleSound, toggleMusic, toggleNotifications } = useSettingsStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="⚙️ 设置" showBack onBackPress={() => router.back()} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 声音设置</Text>
          <SettingSwitch icon="🎵" label="音效" value={soundEnabled} onValueChange={toggleSound} style={styles.settingItem} />
          <SettingSwitch icon="🔊" label="背景音乐" value={musicEnabled} onValueChange={toggleMusic} style={styles.settingItem} />
          <SettingSwitch icon="🔔" label="通知" value={notificationsEnabled} onValueChange={toggleNotifications} style={styles.settingItem} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl, paddingHorizontal: spacing.md },
  section: { marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSizes.body.large, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: spacing.md },
  settingItem: { marginBottom: spacing.sm },
});