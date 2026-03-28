import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';
import NumberBall from '@/components/game/NumberBall';
import CompletionModal from '@/components/game/CompletionModal';
import { useSequenceGameStore } from '@/stores/useSequenceGameStore';
import { colors, layout, spacing, borderRadius, fontSizes, fontWeights } from '@/theme';

const BALL_SIZE = 72;
const BALL_SPACING = 16;
const COLUMNS = 5;

export default function SequenceGameScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const {
    numbers,
    currentNumber,
    totalNumbers,
    isCompleted,
    initGame,
    clickNumber,
    resetGame,
    getProgress,
  } = useSequenceGameStore();

  useEffect(() => {
    initGame(15);
  }, [initGame]);

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  const handleNumberPress = (number: number) => {
    clickNumber(number);
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleContinue = () => {
    setShowModal(false);
    resetGame();
  };

  const handleClose = () => {
    setShowModal(false);
    router.back();
  };

  const progress = getProgress();
  const progressPercent = Math.round(progress * 100);

  const renderNumberBalls = () => {
    return numbers.map((ballState, index) => (
      <NumberBall
        key={`${ballState.number}-${index}`}
        number={ballState.number}
        isClicked={ballState.isClicked}
        isCorrect={ballState.isCorrect}
        onPress={() => handleNumberPress(ballState.number)}
        testID={`number-ball-${ballState.number}`}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="🔗 数字接龙"
        showBack
        showStars
        starsCount={5}
        onBackPress={handleBackPress}
      />

      <View style={styles.hintArea}>
        <Text style={styles.hintTitle}>按顺序点击数字！</Text>
        <View style={styles.nextNumberContainer}>
          <Text style={styles.nextNumberLabel}>下一个: </Text>
          <Text style={styles.nextNumber}>{currentNumber}</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.gridContainer}>{renderNumberBalls()}</View>
      </View>

      <View style={styles.progressArea}>
        <Text style={styles.progressText}>
          进度: {progressPercent}% ({currentNumber - 1}/{totalNumbers})
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      <CompletionModal
        visible={showModal}
        title="太棒了！"
        description="你完成了数字接龙！"
        stars={5}
        buttonText="继续挑战"
        onClose={handleClose}
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
    marginBottom: spacing.sm,
  },
  nextNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextNumberLabel: {
    fontSize: fontSizes.body.medium,
    color: colors.text.secondary,
  },
  nextNumber: {
    fontSize: fontSizes.number.small,
    fontWeight: fontWeights.bold,
    color: colors.game.sequence,
  },
  gameArea: {
    flex: 1,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: BALL_SPACING,
    maxWidth: COLUMNS * (BALL_SIZE + BALL_SPACING),
  },
  progressArea: {
    height: layout.progressArea,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    fontSize: fontSizes.body.medium,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  progressBarContainer: {
    height: 24,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.game.sequence,
    borderRadius: borderRadius.md,
  },
});
