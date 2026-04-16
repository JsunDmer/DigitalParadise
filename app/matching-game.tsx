import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSequence, withTiming, useSharedValue } from 'react-native-reanimated';
import Header from '@/components/layout/Header';
import NumberCard from '@/components/game/NumberCard';
import CompletionModal from '@/components/game/CompletionModal';
import { useMatchingGameStore } from '@/stores';
import { useSound, useSpeech } from '@/hooks';
import { colors, layout, spacing, borderRadius, fontSizes, fontWeights } from '@/theme';

const CARD_GAP = 12;
const GRID_PADDING = 16;

const calculateCardDimensions = (width: number, height: number) => {
  const isLandscape = width > height;
  const columns = isLandscape ? 8 : 4;
  const rows = isLandscape ? 2 : 4;
  const availableWidth = width - GRID_PADDING * 2 - CARD_GAP * (columns - 1);
  const availableHeight = height - 200;
  const cardWidth = availableWidth / columns;
  const cardHeight = (availableHeight - CARD_GAP * (rows - 1)) / rows;
  const cardSize = Math.min(cardWidth, cardHeight * 0.8);
  return { cardSize, columns };
};

function ShakingCard({ children, isShaking }: { children: React.ReactNode; isShaking: boolean }) {
  const translateX = useSharedValue(0);
  useEffect(() => {
    if (isShaking) {
      translateX.value = withSequence(withTiming(-10, { duration: 100 }), withTiming(10, { duration: 100 }), withTiming(-10, { duration: 100 }), withTiming(10, { duration: 100 }), withTiming(0, { duration: 100 }));
    }
  }, [isShaking, translateX]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export default function MatchingGameScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [lastMatchedCount, setLastMatchedCount] = useState(0);
  const { playClick, playSuccess } = useSound();
  const { speakNumber, speakText } = useSpeech();

  const { cards, matchedPairs, totalPairs, isCompleted, lastMatchedNumber, initializeGame, flipCard, resetGame } = useMatchingGameStore();
  const { cardSize, columns } = useMemo(() => calculateCardDimensions(width, height), [width, height]);

  useEffect(() => initializeGame(), [initializeGame]);

  useEffect(() => {
    if (matchedPairs > lastMatchedCount) {
      playSuccess();
      if (lastMatchedNumber !== null) speakNumber(lastMatchedNumber);
      setLastMatchedCount(matchedPairs);
    }
    if (isCompleted) speakText('太棒了！你完成了所有配对！');
  }, [matchedPairs, isCompleted, lastMatchedCount, playSuccess, speakNumber, speakText, lastMatchedNumber]);

  const handleBackPress = () => router.back();
  const handleCardPress = (cardId: number) => { playClick(); flipCard(cardId); };
  const handleContinue = () => resetGame();
  const handleClose = () => resetGame();
  const remainingPairs = totalPairs - matchedPairs;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="🎯 数字配对" showBack onBackPress={handleBackPress} />
      <View style={styles.hintArea}>
        <Text style={styles.hintTitle}>找到相同的数字！</Text>
        <Text style={styles.hintSubtitle}>剩余: {remainingPairs} 对</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {cards.map((card, index) => (
            <View key={card.id} style={[styles.cardWrapper, { marginRight: (index + 1) % columns === 0 ? 0 : CARD_GAP }]}>
              <ShakingCard isShaking={card.isShaking}>
                <NumberCard number={card.number} isClicked={card.isFlipped} isMatched={card.isMatched} onPress={() => handleCardPress(card.id)} disabled={card.isMatched} style={{ width: cardSize, height: cardSize * 1.2 }} />
              </ShakingCard>
            </View>
          ))}
        </View>
      </ScrollView>

      <CompletionModal visible={isCompleted} title="太棒了！" description={`你完成了配对！`} stars={0} buttonText="再来一次" onClose={handleClose} onContinue={handleContinue} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hintArea: { height: layout.hintArea, backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: borderRadius.xxl, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  hintTitle: { fontSize: fontSizes.body.large, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: spacing.xs },
  hintSubtitle: { fontSize: fontSizes.body.medium, color: colors.game.match, fontWeight: fontWeights.medium },
  gridContainer: { flexGrow: 1, paddingHorizontal: GRID_PADDING, paddingVertical: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  cardWrapper: { marginBottom: CARD_GAP },
});