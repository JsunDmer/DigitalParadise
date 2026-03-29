import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import Header from '@/components/layout/Header';
import NumberCard from '@/components/game/NumberCard';
import CompletionModal from '@/components/game/CompletionModal';
import { useMatchingGameStore, useProgressStore, useUserStore } from '@/stores';
import { useSound, useSpeech } from '@/hooks';
import { colors, layout, spacing, borderRadius, fontSizes, fontWeights } from '@/theme';

const { width, height } = Dimensions.get('window');
const CARD_GAP = 12;
const GRID_PADDING = 16;

// 计算卡片尺寸，适配横屏和竖屏
const calculateCardDimensions = () => {
  const isLandscape = width > height;
  const columns = isLandscape ? 8 : 4; // 横屏8列，竖屏4列
  const rows = isLandscape ? 2 : 4;    // 横屏2行，竖屏4行

  // 计算可用空间
  const availableWidth = width - GRID_PADDING * 2 - CARD_GAP * (columns - 1);
  const availableHeight = height - 200; // 减去header和hint区域的高度

  const cardWidth = availableWidth / columns;
  const cardHeight = (availableHeight - CARD_GAP * (rows - 1)) / rows;

  // 取较小值确保卡片是正方形或接近正方形
  const cardSize = Math.min(cardWidth, cardHeight * 0.8);

  return { cardSize, columns };
};

const { cardSize: CARD_SIZE, columns: COLUMNS } = calculateCardDimensions();

interface ShakingCardProps {
  children: React.ReactNode;
  isShaking: boolean;
}

function ShakingCard({ children, isShaking }: ShakingCardProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (isShaking) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [isShaking, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export default function MatchingGameScreen() {
  const router = useRouter();
  const [starsCount, setStarsCount] = useState(0);
  const [lastMatchedCount, setLastMatchedCount] = useState(0);
  const { playClick, playSuccess, playError } = useSound();
  const { speakNumber, speakText } = useSpeech();
  const completeLevel = useProgressStore((state) => state.completeLevel);
  const currentChild = useUserStore((state) => state.currentChild);

  const {
    cards,
    matchedPairs,
    totalPairs,
    moves,
    isCompleted,
    lastMatchedNumber,
    initializeGame,
    flipCard,
    resetGame,
  } = useMatchingGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // 监听配对成功
  useEffect(() => {
    if (matchedPairs > lastMatchedCount) {
      // 播放成功音效和语音播报
      playSuccess();
      if (lastMatchedNumber !== null) {
        speakNumber(lastMatchedNumber);
      }
      setLastMatchedCount(matchedPairs);
    }

    if (isCompleted) {
      // 保存进度：完成一关加1颗星
      if (currentChild) {
        completeLevel('matching-1', 1);
      }

      speakText('太棒了！你完成了所有配对！');
    }
  }, [matchedPairs, isCompleted, lastMatchedCount, playSuccess, speakNumber, speakText, lastMatchedNumber, currentChild, completeLevel]);

  const handleBackPress = () => {
    router.back();
  };

  const handleCardPress = (cardId: number) => {
    playClick();
    flipCard(cardId);
  };

  const handleContinue = () => {
    const stars = Math.min(5, Math.max(1, 6 - Math.floor(moves / 8)));
    setStarsCount(stars);
    resetGame();
  };

  const handleClose = () => {
    resetGame();
  };

  const remainingPairs = totalPairs - matchedPairs;

  return (
    <View style={styles.container}>
      <Header
        title="🎯 数字配对"
        showBack
        showStars
        starsCount={starsCount}
        onBackPress={handleBackPress}
      />

      <View style={styles.hintArea}>
        <Text style={styles.hintTitle}>找到相同的数字！</Text>
        <Text style={styles.hintSubtitle}>剩余: {remainingPairs} 对</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {cards.map((card, index) => (
            <View
              key={card.id}
              style={[
                styles.cardWrapper,
                { marginRight: (index + 1) % COLUMNS === 0 ? 0 : CARD_GAP },
              ]}
            >
              <ShakingCard isShaking={card.isShaking}>
                <NumberCard
                  number={card.number}
                  isClicked={card.isFlipped}
                  isMatched={card.isMatched}
                  onPress={() => handleCardPress(card.id)}
                  disabled={card.isMatched}
                  style={{ width: CARD_SIZE, height: CARD_SIZE * 1.2 }}
                />
              </ShakingCard>
            </View>
          ))}
        </View>
      </ScrollView>

      <CompletionModal
        visible={isCompleted}
        title="太棒了！"
        description={`你用 ${moves} 步完成了配对！`}
        stars={Math.min(5, Math.max(1, 6 - Math.floor(moves / 8)))}
        buttonText="继续挑战"
        onClose={handleClose}
        onContinue={handleContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hintArea: {
    height: layout.hintArea,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hintTitle: {
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  hintSubtitle: {
    fontSize: fontSizes.body.medium,
    color: colors.game.match,
    fontWeight: fontWeights.medium,
  },
  gridContainer: {
    flexGrow: 1,
    paddingHorizontal: GRID_PADDING,
    paddingVertical: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    marginBottom: CARD_GAP,
  },
});
