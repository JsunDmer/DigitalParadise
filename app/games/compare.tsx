import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, fontSizes, fontWeights, borderRadius, elementSpacing } from '@/theme';
import Header from '@/components/layout/Header';
import CompletionModal from '@/components/game/CompletionModal';
import { useSound, useSpeech } from '@/hooks';

const ITEM_ICONS = ['🍎', '🍊', '🍋', '🍇', '🍓', '⭐'];
const STREAK_TO_UPGRADE = 3;

const getRangeByLevel = (level: number): { min: number; max: number } => {
  if (level === 1) return { min: 1, max: 5 };
  if (level === 2) return { min: 1, max: 10 };
  return { min: 1, max: 20 };
};

const generatePair = (level: number): { left: number; right: number } => {
  const range = getRangeByLevel(level);
  const min = range.min;
  const max = range.max;
  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  while (num1 === num2) {
    num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return num1 < num2 ? { left: num1, right: num2 } : { left: num1, right: num2 };
};

const renderItems = (count: number, icon: string) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(<Text key={i} style={styles.itemIcon}>{icon}</Text>);
  }
  return items;
};

export default function CompareGame() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width > 500;
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [pair, setPair] = useState(generatePair(1));
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [itemIcon] = useState(ITEM_ICONS[Math.floor(Math.random() * ITEM_ICONS.length)]);
  const { playClick, playSuccess, playError } = useSound();
  const { speakText } = useSpeech();

  const correctAnswer = pair.left > pair.right ? 'left' : 'right';

  const handleSelect = useCallback((side: 'left' | 'right') => {
    if (selectedSide !== null) return;
    setSelectedSide(side);
    const isAnswerCorrect = side === correctAnswer;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setTotalCorrect(totalCorrect + 1);
      if (newStreak >= STREAK_TO_UPGRADE) {
        const newLevel = Math.min(level + 1, 3);
        setLevel(newLevel);
        setStreak(0);
      }
      speakText('正确！');
      setTimeout(() => {
        const newPair = generatePair(level);
        setPair(newPair);
        setSelectedSide(null);
        setIsCorrect(null);
      }, 1000);
    } else {
      playError();
      speakText('再试试！');
      setStreak(0);
      setTimeout(() => {
        setShowModal(true);
      }, 1000);
    }
  }, [selectedSide, correctAnswer, streak, level, totalCorrect, playSuccess, playError, speakText]);

  const handleBack = () => router.back();

  const handleContinue = () => {
    setShowModal(false);
    setLevel(1);
    setStreak(0);
    setTotalCorrect(0);
    setPair(generatePair(1));
    setSelectedSide(null);
    setIsCorrect(null);
  };

  const handleRestart = () => {
    setShowModal(false);
    setLevel(1);
    setStreak(0);
    setTotalCorrect(0);
    setPair(generatePair(1));
    setSelectedSide(null);
    setIsCorrect(null);
  };

  const leftStyles = selectedSide === 'left' ? (isCorrect !== null && correctAnswer === 'left' ? [styles.sideCard, styles.sideCorrect] : [styles.sideCard, styles.sideWrong]) : [styles.sideCard];
  const rightStyles = selectedSide === 'right' ? (isCorrect !== null && correctAnswer === 'right' ? [styles.sideCard, styles.sideCorrect] : [styles.sideCard, styles.sideWrong]) : [styles.sideCard];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="⚖️ 比大小" showBack onBackPress={handleBack} />

      <View style={styles.progressBar}>
        <Text style={styles.progressText}>难度 {level} · 连续正确 {streak}/{STREAK_TO_UPGRADE}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(streak / STREAK_TO_UPGRADE) * 100}%` }]} />
        </View>
      </View>

      <View style={[styles.content, isWide && styles.contentWide]}>
        <Text style={styles.questionText}>哪边物品更多？</Text>

        <View style={[styles.sidesContainer, isWide && styles.sidesContainerWide]}>
          <TouchableOpacity
            style={leftStyles}
            onPress={() => handleSelect('left')}
            disabled={selectedSide !== null}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="选择左边"
          >
            <View style={styles.itemsRow}>{renderItems(pair.left, itemIcon)}</View>
            <Text style={styles.numberText}>{pair.left}</Text>
          </TouchableOpacity>

          <Text style={styles.vsText}>VS</Text>

          <TouchableOpacity
            style={rightStyles}
            onPress={() => handleSelect('right')}
            disabled={selectedSide !== null}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="选择右边"
          >
            <View style={styles.itemsRow}>{renderItems(pair.right, itemIcon)}</View>
            <Text style={styles.numberText}>{pair.right}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.scoreText}>正确: {totalCorrect} 题</Text>
      </View>

      <CompletionModal
        visible={showModal}
        title="游戏结束"
        description={`你答对了 ${totalCorrect} 题！`}
        stars={0}
        buttonText="再玩一次"
        onClose={handleRestart}
        onContinue={handleContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressBar: { paddingHorizontal: elementSpacing.normal, paddingVertical: elementSpacing.tight },
  progressText: { fontSize: fontSizes.body.medium, color: colors.text.secondary, marginBottom: 8, textAlign: 'center' },
  progressTrack: { height: 8, backgroundColor: colors.surface, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: colors.game.match, borderRadius: 4 },
  content: { flex: 1, padding: elementSpacing.normal, justifyContent: 'center' },
  contentWide: { flexDirection: 'row', alignItems: 'center' },
  questionText: { fontSize: fontSizes.title.small, fontWeight: fontWeights.bold, color: colors.text.primary, textAlign: 'center', marginBottom: elementSpacing.xl },
  sidesContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: elementSpacing.lg },
  sidesContainerWide: { flex: 1 },
  sideCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: elementSpacing.lg, alignItems: 'center', minWidth: 120, minHeight: 150, justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  sideCorrect: { backgroundColor: colors.success },
  sideWrong: { backgroundColor: colors.error },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4, marginBottom: elementSpacing.tight },
  itemIcon: { fontSize: 24 },
  numberText: { fontSize: 36, fontWeight: fontWeights.bold, color: colors.game.compare },
  vsText: { fontSize: fontSizes.title.small, fontWeight: fontWeights.bold, color: colors.text.secondary },
  scoreText: { fontSize: fontSizes.body.large, color: colors.text.secondary, textAlign: 'center', marginTop: elementSpacing.xl },
});