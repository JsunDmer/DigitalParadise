import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';
import NumberBall from '@/components/game/NumberBall';
import CompletionModal from '@/components/game/CompletionModal';
import { useSequenceGameStore } from '@/stores/useSequenceGameStore';
import { colors, layout, spacing, borderRadius, fontSizes, fontWeights, elementSpacing } from '@/theme';
import { useSound, useSpeech } from '@/hooks';

const BALL_SIZE = 72;
const BALL_SPACING = 16;
const COLUMNS = 5;

export default function SequenceGameScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const columns = isLandscape ? 7 : COLUMNS;
  const gridGap = isLandscape ? 12 : BALL_SPACING;
  const [showModal, setShowModal] = useState(false);
  const { playClick, playSuccess, playError } = useSound();
  const { speakNumber, speakText } = useSpeech();

  const { numbers, currentNumber, totalNumbers, isCompleted, completedCount, level, initGame, clickNumber, resetGame } = useSequenceGameStore();

  useEffect(() => initGame(), [initGame]);

  useEffect(() => {
    if (isCompleted) {
      speakText('太棒了！你完成了数字接龙！');
      const timer = setTimeout(() => setShowModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, speakText]);

  const handleNumberPress = (number: number) => {
    playClick();
    const isCorrect = number === currentNumber;
    clickNumber(number);
    if (isCorrect) { playSuccess(); speakNumber(number); } else { playError(); }
  };

  const handleBackPress = () => router.back();
  const handleContinue = () => { setShowModal(false); resetGame(); };
  const handleClose = () => { setShowModal(false); router.back(); };

  const renderNumberBalls = () => numbers.map((ballState, index) => (
    <NumberBall key={`${ballState.number}-${index}`} number={ballState.number} isClicked={ballState.isClicked} isCorrect={ballState.isCorrect} onPress={() => handleNumberPress(ballState.number)} testID={`number-ball-${ballState.number}`} />
  ));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="🔗 数字接龙" showBack onBackPress={handleBackPress} />

      <View style={[styles.hintArea, isLandscape && styles.hintAreaLandscape]}>
        <Text style={styles.hintTitle}>按顺序点击数字！</Text>
        <View style={styles.nextNumberContainer}>
          <Text style={styles.nextNumberLabel}>下一个: </Text>
          <Text style={styles.nextNumber}>{currentNumber}</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={[styles.gridContainer, { gap: gridGap, maxWidth: columns * (BALL_SIZE + gridGap) }]}>
          {renderNumberBalls()}
        </View>
      </View>

      <CompletionModal visible={showModal} title="太棒了！" description="你完成了数字接龙！" stars={0} buttonText="再来一次" onClose={handleClose} onContinue={handleContinue} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hintArea: { height: layout.hintArea, backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: borderRadius.xxl, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  hintAreaLandscape: { height: 86, marginTop: spacing.sm },
  hintTitle: { fontSize: fontSizes.body.large, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: spacing.sm },
  nextNumberContainer: { flexDirection: 'row', alignItems: 'center' },
  nextNumberLabel: { fontSize: fontSizes.body.medium, color: colors.text.secondary },
  nextNumber: { fontSize: fontSizes.number.small, fontWeight: fontWeights.bold, color: colors.game.sequence },
  gameArea: { flex: 1, marginHorizontal: spacing.md, marginVertical: spacing.md, justifyContent: 'center', alignItems: 'center' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: BALL_SPACING },
});