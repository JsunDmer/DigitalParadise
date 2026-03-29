import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';
import NumberBall from '@/components/game/NumberBall';
import CompletionModal from '@/components/game/CompletionModal';
import { useSequenceGameStore } from '@/stores/useSequenceGameStore';
import { useProgressStore, useUserStore } from '@/stores';
import { colors, layout, spacing, borderRadius, fontSizes, fontWeights, elementSpacing } from '@/theme';
import { useSound, useSpeech } from '@/hooks';

const BALL_SIZE = 72;
const BALL_SPACING = 16;
const COLUMNS = 5;

export default function SequenceGameScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { playClick, playSuccess, playError } = useSound();
  const { speakNumber, speakText } = useSpeech();
  const completeLevel = useProgressStore((state) => state.completeLevel);
  const currentChild = useUserStore((state) => state.currentChild);

  const {
    numbers,
    currentNumber,
    totalNumbers,
    isCompleted,
    completedCount,
    level,
    initGame,
    clickNumber,
    resetGame,
  } = useSequenceGameStore();

  useEffect(() => {
    initGame(15);
  }, [initGame]);

  useEffect(() => {
    if (isCompleted) {
      // 每完成5次算一关，达到5次倍数时保存进度
      if (currentChild && (completedCount + 1) % 5 === 0) {
        completeLevel(`sequence-${level}`, 1);
      }

      speakText('太棒了！你完成了数字接龙！');
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, speakText, currentChild, completeLevel, completedCount, level]);

  const handleNumberPress = (number: number) => {
    playClick();
    const isCorrect = number === currentNumber;
    clickNumber(number);
    
    if (isCorrect) {
      playSuccess();
      speakNumber(number);
    } else {
      playError();
    }
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
        starsCount={completedCount}
        onBackPress={handleBackPress}
      />

      {/* 关卡进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.levelRow}>
          <Text style={styles.levelText}>第 {level} 关</Text>
          <Text style={styles.countText}>{completedCount % 5}/5</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((completedCount % 5) / 5) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressHintText}>
          已完成 {completedCount} 次，再完成 {5 - (completedCount % 5)} 次升级！
        </Text>
      </View>

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
  progressContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: elementSpacing.normal,
    marginBottom: elementSpacing.normal,
    padding: 16,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  countText: {
    fontSize: 14,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: colors.game.sequence,
    borderRadius: 4,
  },
  progressHintText: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
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
});
