import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, fontSizes, fontWeights, elementSpacing, pageMargin, layout, iconSizes } from '@/theme';
import { GameCard } from '@/components/ui';

const GAMES = [
  { id: 'counting', icon: '🔢', title: '数数乐园', color: colors.game.count, route: '/games/counting' },
  { id: 'matching', icon: '🎯', title: '数字配对', color: colors.game.match, route: '/matching-game' },
  { id: 'sequence', icon: '🔗', title: '数字接龙', color: colors.game.sequence, route: '/games/sequence' },
  { id: 'addition', icon: '➕', title: '趣味加法', color: colors.game.addition, route: '/games/addition' },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleGamePress = (route: string) => router.push(route as any);
  const handleSettingsPress = () => router.push('/settings' as any);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🔢</Text>
          <Text style={styles.logoText}>数字乐园</Text>
        </View>
        <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton} accessibilityRole="button" accessibilityLabel="设置">
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.gamesSection}>
          <Text style={styles.sectionTitle}>🎮 选择游戏</Text>
          <View style={styles.gamesGrid}>
            {GAMES.map((game) => (
              <GameCard key={game.id} icon={game.icon} title={game.title} color={game.color} onPress={() => handleGamePress(game.route)} style={styles.gameCard} accessibilityLabel={`进入${game.title}`} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { height: layout.header, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: pageMargin.mobile, backgroundColor: colors.background },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoEmoji: { fontSize: iconSizes.large, marginRight: 8 },
  logoText: { fontSize: fontSizes.title.small, fontWeight: fontWeights.bold, color: colors.primary },
  settingsButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 24 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: pageMargin.mobile, paddingBottom: elementSpacing.normal },
  gamesSection: { marginTop: elementSpacing.relaxed },
  sectionTitle: { fontSize: fontSizes.button.large, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: elementSpacing.normal },
  gamesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: elementSpacing.normal },
  gameCard: { width: '48%' },
});