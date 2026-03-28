import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  colors,
  layout,
  fontSizes,
  fontWeights,
  borderRadius,
  elementSpacing,
} from '@/theme';
import Header from '@/components/layout/Header';
import OptionCard from '@/components/game/OptionCard';
import CompletionModal from '@/components/game/CompletionModal';
import { useAdditionGameStore } from '@/stores';

export default function AdditionGame() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const {
    num1,
    num2,
    options,
    selectedAnswer,
    isCorrect,
    isCompleted,
    level,
    stars,
    itemIcon1,
    itemIcon2,
    initGame,
    selectAnswer,
    nextLevel,
    resetGame,
  } = useAdditionGameStore();

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (isCompleted && isCorrect) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, isCorrect]);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    setShowModal(false);
    nextLevel();
  };

  const handleRestart = () => {
    setShowModal(false);
    resetGame();
  };

  const renderItems = (count: number, icon: string) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(
        <Text key={i} style={styles.itemIcon}>
          {icon}
        </Text>
      );
    }
    return items;
  };

  const renderOptions = () => {
    const rows: number[][] = [];
    for (let i = 0; i < options.length; i += 3) {
      rows.push(options.slice(i, i + 3));
    }

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.optionRow}>
        {row.map((number) => (
          <OptionCard
            key={number}
            number={number}
            isSelected={selectedAnswer === number}
            isCorrect={selectedAnswer === number && isCorrect === true}
            onPress={() => selectAnswer(number)}
            disabled={isCompleted}
            testID={`option-card-${number}`}
          />
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="➕ 趣味加法"
        showBack
        showStars
        starsCount={level * 5}
        onBackPress={handleBack}
      />

      <View style={styles.questionCard}>
        <View style={styles.equationContainer}>
          <Text style={styles.equation}>{num1} + {num2} = ?</Text>
        </View>
        
        <View style={styles.itemsContainer}>
          <View style={styles.itemsGroup}>
            {renderItems(num1, itemIcon1)}
          </View>
          <Text style={styles.plusSign}>+</Text>
          <View style={styles.itemsGroup}>
            {renderItems(num2, itemIcon2)}
          </View>
        </View>
      </View>

      <View style={styles.optionsArea}>
        <View style={styles.optionsGrid}>
          {renderOptions()}
        </View>
      </View>

      <View style={styles.hintArea}>
        <Text style={styles.hintText}>
          {isCompleted 
            ? (isCorrect ? '🎉 太棒了！回答正确！' : '😅 再试一次吧！')
            : '👆 点击正确的答案！'
          }
        </Text>
      </View>

      <CompletionModal
        visible={showModal}
        title="太棒了!"
        description={`你完成了第 ${level} 关加法！`}
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
  questionCard: {
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
  equationContainer: {
    marginBottom: 16,
  },
  equation: {
    fontSize: fontSizes.number.counter,
    fontWeight: fontWeights.bold,
    color: colors.game.addition,
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 200,
  },
  itemIcon: {
    fontSize: 48,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  plusSign: {
    fontSize: 48,
    fontWeight: fontWeights.bold,
    color: colors.game.addition,
    marginHorizontal: 16,
  },
  optionsArea: {
    flex: 1,
    paddingHorizontal: elementSpacing.normal,
    justifyContent: 'center',
  },
  optionsGrid: {
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: elementSpacing.normal,
    gap: elementSpacing.normal,
  },
  hintArea: {
    height: layout.hintArea,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingHorizontal: elementSpacing.normal,
    paddingVertical: elementSpacing.tight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hintText: {
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
});
