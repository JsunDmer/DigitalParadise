import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  colors,
  layout,
  fontSizes,
  fontWeights,
  borderRadius,
  elementSpacing,
  gameItem,
} from '@/theme';
import Header from '@/components/layout/Header';
import GameItem from '@/components/game/GameItem';
import CompletionModal from '@/components/game/CompletionModal';
import { useCountingGameStore, CountingItem } from '@/stores';

const GAME_ITEMS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🌟', '🎈', '🎁', '🧸'];

export default function CountingGame() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [itemIcon, setItemIcon] = useState('🍎');

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
    initGame(5, randomIcon);
  }, []);

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    setShowModal(false);
    const randomIcon = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
    setItemIcon(randomIcon);
    nextLevel();
    initGame(getRandomTarget(), randomIcon);
  };

  const handleRestart = () => {
    setShowModal(false);
    const randomIcon = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
    setItemIcon(randomIcon);
    resetGame();
    initGame(5, randomIcon);
  };

  const getRandomTarget = () => {
    return Math.floor(Math.random() * 8) + 3;
  };

  const renderItems = () => {
    const itemsPerRow = Math.min(4, targetNumber);
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
            onPress={() => clickItem(item.id)}
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
        <View
          key={i}
          style={[
            styles.counterBlock,
            isClicked && styles.counterBlockActive,
          ]}
        >
          <Text style={styles.counterNumber}>{i}</Text>
          {isClicked && <Text style={styles.counterCheck}>✓</Text>}
        </View>
      );
    }
    return blocks;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="🔢 数数乐园"
        showBack
        showStars
        starsCount={level * 5}
        onBackPress={handleBack}
      />

      <View style={styles.targetCard}>
        <Text style={styles.targetLabel}>请 数 到</Text>
        <Text style={styles.targetNumber}>{targetNumber}</Text>
        <Text style={styles.targetHint}>👆 点击{itemIcon}数一数！</Text>
      </View>

      <ScrollView
        style={styles.gameArea}
        contentContainerStyle={styles.gameAreaContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemsGrid}>{renderItems()}</View>
      </ScrollView>

      <View style={styles.counterArea}>
        <Text style={styles.counterLabel}>当前计数: {currentCount}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.counterBlocksContainer}
        >
          {renderCounterBlocks()}
        </ScrollView>
      </View>

      <CompletionModal
        visible={showModal}
        title="太棒了!"
        description={`你完成了第 ${level} 关数数！`}
        stars={stars}
        buttonText="继续挑战"
        onClose={handleRestart}
        onContinue={handleContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  targetCard: {
    height: layout.targetCard,
    backgroundColor: colors.surface,
    marginHorizontal: elementSpacing.normal,
    marginVertical: elementSpacing.normal,
    borderRadius: borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  targetLabel: {
    fontSize: fontSizes.body.large,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  targetNumber: {
    fontSize: fontSizes.number.huge,
    fontWeight: fontWeights.bold,
    color: colors.game.count,
    lineHeight: fontSizes.number.huge * 1.1,
  },
  targetHint: {
    fontSize: fontSizes.body.medium,
    color: colors.text.secondary,
    marginTop: 8,
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: elementSpacing.normal,
  },
  gameAreaContent: {
    paddingVertical: elementSpacing.normal,
    flexGrow: 1,
  },
  itemsGrid: {
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: elementSpacing.normal,
    gap: elementSpacing.normal,
  },
  counterArea: {
    height: layout.counterArea,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingHorizontal: elementSpacing.normal,
    paddingVertical: elementSpacing.tight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  counterLabel: {
    fontSize: fontSizes.number.counter,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  counterBlocksContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
  },
  counterBlock: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBlockActive: {
    backgroundColor: colors.success,
  },
  counterNumber: {
    fontSize: fontSizes.number.small,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  counterCheck: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    fontSize: 16,
    color: colors.surface,
    fontWeight: fontWeights.bold,
  },
});
