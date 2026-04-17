import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, borderRadius, elementSpacing } from '@/theme';
import Header from '@/components/layout/Header';
import GameItem from '@/components/game/GameItem';
import CompletionModal from '@/components/game/CompletionModal';
import { useCountingGameStore, CountingItem } from '@/stores';
import { useSound, useSpeech } from '@/hooks';

const GAME_ITEMS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🌟', '🎈', '🎁', '🧸'];

export default function CountingGame() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const targetNumberSize = Math.min(72, Math.max(48, Math.floor(Math.min(width, height) * 0.16)));
  const [showModal, setShowModal] = useState(false);
  const [itemIcon, setItemIcon] = useState('🍎');
  const { playClick, playSuccess } = useSound();
  const { speakNumber, speakText } = useSpeech();

  const {
    targetNumber,
    items,
    currentCount,
    isCompleted,
    level,
    stars,
    initGame,
    clickItem,
    nextLevel,
    resetGame,
  } = useCountingGameStore();

  useEffect(() => {
    const randomIcon = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
    setItemIcon(randomIcon);
    initGame(getRandomTarget(), randomIcon);
  }, []);

  useEffect(() => {
    if (isCompleted) {
      speakText(`太棒了！你数到了${targetNumber}！`);
      const timer = setTimeout(() => setShowModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, speakText, targetNumber]);

  const handleBack = () => router.back();

  const handleContinue = () => {
    setShowModal(false);
    nextLevel();
    setItemIcon(GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)]);
  };

  const handleRestart = () => {
    setShowModal(false);
    setItemIcon(GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)]);
    resetGame();
  };

  const getRandomTarget = () => Math.floor(Math.random() * 8) + 3;

  const renderItems = () => {
    const itemsPerRow = Math.min(isLandscape ? 6 : 4, targetNumber);
    const rows: CountingItem[][] = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow));
    }
    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.itemRow}>
        {row.map((item) => (
          <GameItem
            key={item.id}
            icon={itemIcon}
            isClicked={item.isClicked}
            onPress={() => {
              playClick();
              clickItem(item.id);
              const currentNumber = items.filter((i) => i.isClicked || i.id === item.id).length;
              speakNumber(currentNumber);
              playSuccess();
            }}
            testID={`game-item-${item.id}`}
          />
        ))}
      </View>
    ));
  };

  const renderCounterBlocks = () => {
    const blocks = [];
    for (let i = 1; i <= targetNumber; i++) {
      const isClicked = i <= currentCount;
      blocks.push(
        <View key={i} style={[styles.counterBlock, isClicked && styles.counterBlockActive]}>
          <Text style={styles.counterNumber}>{i}</Text>
          {isClicked && <Text style={styles.counterCheck}>✓</Text>}
        </View>
      );
    }
    return blocks;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="🔢 数数乐园" showBack onBackPress={handleBack} />

      <View style={[styles.targetCard, isLandscape && styles.targetCardLandscape]}>
        <Text style={styles.targetLabel}>请 数 到</Text>
        <Text style={[styles.targetNumber, { fontSize: targetNumberSize, lineHeight: targetNumberSize + 8 }]}>
          {targetNumber}
        </Text>
        <Text style={styles.targetHint}>👆 点击{itemIcon}数一数！</Text>
      </View>

      <ScrollView style={styles.gameArea} contentContainerStyle={styles.gameAreaContent} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsGrid}>{renderItems()}</View>
      </ScrollView>

      <View style={[styles.counterArea, isLandscape && styles.counterAreaLandscape]}>
        <Text style={styles.counterLabel}>当前计数: {currentCount}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.counterBlocksContainer}>
          {renderCounterBlocks()}
        </ScrollView>
      </View>

      <CompletionModal visible={showModal} title="太棒了!" description={`你数到了${targetNumber}！`} stars={0} buttonText="再来一次" onClose={handleRestart} onContinue={handleContinue} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  targetCard: { height: 140, backgroundColor: colors.surface, marginHorizontal: elementSpacing.normal, marginVertical: elementSpacing.normal, borderRadius: borderRadius.xl, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  targetCardLandscape: { height: 120 },
  targetLabel: { fontSize: 18, color: colors.text.secondary, marginBottom: 4 },
  targetNumber: { fontSize: 72, fontWeight: 'bold', color: colors.game.count, lineHeight: 80 },
  targetHint: { fontSize: 14, color: colors.text.secondary, marginTop: 4 },
  gameArea: { flex: 1, paddingHorizontal: elementSpacing.normal },
  gameAreaContent: { paddingVertical: elementSpacing.normal, flexGrow: 1 },
  itemsGrid: { alignItems: 'center' },
  itemRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: elementSpacing.normal, gap: elementSpacing.normal },
  counterArea: { height: 100, backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, paddingHorizontal: elementSpacing.normal, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  counterAreaLandscape: { height: 84 },
  counterLabel: { fontSize: 20, fontWeight: 'bold', color: colors.text.primary, marginBottom: 6, textAlign: 'center' },
  counterBlocksContainer: { flexDirection: 'row', gap: 6, paddingHorizontal: 8 },
  counterBlock: { width: 48, height: 48, borderRadius: borderRadius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  counterBlockActive: { backgroundColor: colors.success },
  counterNumber: { fontSize: 20, fontWeight: 'bold', color: colors.text.primary },
  counterCheck: { position: 'absolute', bottom: 2, right: 2, fontSize: 12, color: colors.surface, fontWeight: 'bold' },
});