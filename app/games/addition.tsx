import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
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
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
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
        starsCount={completedCount}
        onBackPress={handleBack}
      />

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentScrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
          <Text style={styles.progressText}>
            已完成 {completedCount} 次，再完成 {5 - (completedCount % 5)} 次升级！
          </Text>
        </View>

        {/* 故事场景卡片 */}
        <View style={[styles.storyCard, isLandscape && styles.storyCardLandscape]}>
          <Text style={styles.storyText}>
            小明有 {num1} 个{itemIcon1}，又得到了 {num2} 个{itemIcon1}
          </Text>
          <Text style={styles.storyQuestion}>一共有多少个呢？</Text>
        </View>

        {/* 物品分组展示 */}
        <View style={[styles.groupsContainer, isLandscape && styles.groupsContainerLandscape]}>
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
      </ScrollView>

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
  contentScroll: {
    flex: 1,
  },
  contentScrollContainer: {
    paddingBottom: elementSpacing.relaxed,
  },
  storyCard: {
    backgroundColor: colors.game.addition,
    marginHorizontal: elementSpacing.normal,
    marginTop: elementSpacing.tight,
    padding: elementSpacing.normal,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    shadowColor: colors.game.addition,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  storyCardLandscape: {
    marginTop: elementSpacing.normal,
    paddingVertical: elementSpacing.tight,
  },
  storyText: {
    fontSize: fontSizes.caption,
    color: colors.surface,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: elementSpacing.tight / 2,
  },
  storyQuestion: {
    fontSize: fontSizes.body.small,
    fontWeight: fontWeights.bold,
    color: colors.surface,
  },
  groupsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: elementSpacing.normal,
    marginTop: elementSpacing.tight,
  },
  groupsContainerLandscape: {
    justifyContent: 'space-between',
  },
  groupBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: elementSpacing.tight,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  groupLabel: {
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    marginBottom: elementSpacing.tight / 2,
  },
  groupItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: elementSpacing.tight / 4,
    marginBottom: elementSpacing.tight / 2,
  },
  itemIcon: {
    fontSize: fontSizes.body.large,
  },
  groupCount: {
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.bold,
    color: colors.game.addition,
  },
  plusSign: {
    fontSize: fontSizes.title.small,
    fontWeight: fontWeights.bold,
    color: colors.game.addition,
  },
  answersContainer: {
    justifyContent: 'center',
    paddingHorizontal: elementSpacing.normal,
    marginTop: elementSpacing.normal,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: elementSpacing.normal,
    gap: elementSpacing.normal,
  },
  progressContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: elementSpacing.normal,
    marginBottom: elementSpacing.normal,
    padding: elementSpacing.tight,
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
    fontSize: fontSizes.body.small,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  countText: {
    fontSize: fontSizes.caption,
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
    backgroundColor: colors.game.addition,
    borderRadius: 4,
  },
  progressText: {
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
