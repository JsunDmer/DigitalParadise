import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, fontSizes, fontWeights, borderRadius, elementSpacing } from '@/theme';
import Header from '@/components/layout/Header';
import CompletionModal from '@/components/game/CompletionModal';
import { useSound, useSpeech } from '@/hooks';

const ITEM_ICONS = ['🍎', '🍊', '🍋', '🍇', '🍓', '⭐'];

const generatePair = (): { left: number; right: number } => {
  const min = 1;
  const max = 10;
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
  const [pair, setPair] = useState(generatePair());
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [itemIcon] = useState(ITEM_ICONS[Math.floor(Math.random() * ITEM_ICONS.length)]);
  const { playSuccess, playError } = useSound();
  const { speakText } = useSpeech();

  const correctAnswer = pair.left > pair.right ? 'left' : 'right';

  const handleSelect = useCallback((side: 'left' | 'right') => {
    if (selectedSide !== null) return;
    setSelectedSide(side);
    const isAnswerCorrect = side === correctAnswer;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      playSuccess();
      setTotalCorrect(totalCorrect + 1);
      speakText('正确！');
      setTimeout(() => {
        setPair(generatePair());
        setSelectedSide(null);
        setIsCorrect(null);
      }, 1000);
    } else {
      playError();
      speakText('再试试！');
      setTimeout(() => {
        setShowModal(true);
      }, 1000);
    }
  }, [selectedSide, correctAnswer, totalCorrect, playSuccess, playError, speakText]);

  const handleBack = () => router.back();

  const handleRestart = () => {
    setShowModal(false);
    setTotalCorrect(0);
    setPair(generatePair());
    setSelectedSide(null);
    setIsCorrect(null);
  };

  const leftStyles = selectedSide === 'left' ? (isCorrect !== null && correctAnswer === 'left' ? [styles.sideCard, styles.sideCorrect] : [styles.sideCard, styles.sideWrong]) : [styles.sideCard];
  const rightStyles = selectedSide === 'right' ? (isCorrect !== null && correctAnswer === 'right' ? [styles.sideCard, styles.sideCorrect] : [styles.sideCard, styles.sideWrong]) : [styles.sideCard];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="⚖️ 比大小" showBack onBackPress={handleBack} />

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
        onContinue={handleRestart}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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