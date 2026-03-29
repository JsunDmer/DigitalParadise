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
import { useAdditionGameStore, useProgressStore, useUserStore } from '@/stores';
import { useSound, useSpeech } from '@/hooks';

export default function AdditionGame() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { playClick, playSuccess, playError } = useSound();
  const { speakNumber, speakText } = useSpeech();
  const completeLevel = useProgressStore((state) => state.completeLevel);
  const currentChild = useUserStore((state) => state.currentChild);

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
    completedCount,
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
      // 每完成5次算一关，达到5次倍数时保存进度
      if (currentChild && (completedCount + 1) % 5 === 0) {
        completeLevel(`addition-${level}`, 1);
      }

      // 判断是否通关所有关卡（假设10关为通关）
      if (level >= 10) {
        speakText('恭喜你！你已完成趣味加法的所有关卡！真棒！');
      } else {
        speakText(`太棒了！${num1}加${num2}等于${num1 + num2}！`);
      }
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isCompleted && !isCorrect) {
      playError();
    }
  }, [isCompleted, isCorrect, playError, speakText, num1, num2, level, currentChild, completeLevel, completedCount]);

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
            onPress={() => {
              playClick();
              selectAnswer(number);
              if (number === num1 + num2) {
                playSuccess();
                speakNumber(number);
              } else {
                playError();
              }
            }}
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

      {/* 故事场景卡片 */}
      <View style={styles.storyCard}>
        <Text style={styles.storyText}>
          小明有 {num1} 个{itemIcon1}，又得到了 {num2} 个{itemIcon1}
        </Text>
        <Text style={styles.storyQuestion}>一共有多少个呢？</Text>
      </View>

      {/* 物品分组展示 */}
      <View style={styles.groupsContainer}>
        <View style={styles.groupBox}>
          <Text style={styles.groupLabel}>第一组</Text>
          <View style={styles.groupItems}>
            {renderItems(num1, itemIcon1)}
          </View>
          <Text style={styles.groupCount}>{num1}</Text>
        </View>

        <Text style={styles.plusSign}>+</Text>

        <View style={styles.groupBox}>
          <Text style={styles.groupLabel}>第二组</Text>
          <View style={styles.groupItems}>
            {renderItems(num2, itemIcon1)}
          </View>
          <Text style={styles.groupCount}>{num2}</Text>
        </View>
      </View>

      {/* 答案选项 */}
      <View style={styles.answersContainer}>
        {renderOptions()}
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
  storyCard: {
    backgroundColor: colors.game.addition,
    marginHorizontal: elementSpacing.normal,
    marginTop: elementSpacing.normal,
    borderRadius: borderRadius.xl,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.game.addition,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  storyText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  storyQuestion: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
  },
  groupsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: elementSpacing.normal,
    marginTop: elementSpacing.normal,
  },
  groupBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 16,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  groupLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  groupItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },
  itemIcon: {
    fontSize: 28,
  },
  groupCount: {
    fontSize: 24,
    fontWeight: fontWeights.bold,
    color: colors.game.addition,
  },
  plusSign: {
    fontSize: 36,
    fontWeight: fontWeights.bold,
    color: colors.game.addition,
  },
  answersContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: elementSpacing.normal,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: elementSpacing.normal,
    gap: elementSpacing.normal,
  },
});
