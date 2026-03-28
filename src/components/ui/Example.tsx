import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, GameCard, CircleButton, StatsCard } from './index';
import { colors, spacing } from '../../theme';

export default function UIComponentsExample() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Button 组件示例</Text>
      
      <View style={styles.row}>
        <Button
          title="主要按钮"
          onPress={() => console.log('Primary pressed')}
          variant="primary"
        />
      </View>

      <View style={styles.row}>
        <Button
          title="次要按钮"
          onPress={() => console.log('Secondary pressed')}
          variant="secondary"
        />
      </View>

      <View style={styles.row}>
        <Button
          title="轮廓按钮"
          onPress={() => console.log('Outline pressed')}
          variant="outline"
        />
      </View>

      <View style={styles.row}>
        <Button
          title="禁用状态"
          onPress={() => {}}
          disabled
        />
      </View>

      <Text style={styles.sectionTitle}>GameCard 组件示例</Text>
      
      <View style={styles.gameCardsRow}>
        <GameCard
          icon="🔢"
          title="数数乐园"
          stars={3}
          onPress={() => console.log('数数乐园')}
          color={colors.game.count}
        />
        <GameCard
          icon="🎯"
          title="数字配对"
          stars={4}
          onPress={() => console.log('数字配对')}
          color={colors.game.match}
        />
      </View>

      <Text style={styles.sectionTitle}>CircleButton 组件示例</Text>
      
      <View style={styles.row}>
        <CircleButton
          icon="←"
          onPress={() => console.log('返回')}
          size="small"
        />
        <CircleButton
          icon="⚙️"
          onPress={() => console.log('设置')}
          size="medium"
        />
        <CircleButton
          icon="▶️"
          onPress={() => console.log('播放')}
          size="large"
          backgroundColor={colors.primary}
          iconColor="#FFFFFF"
        />
      </View>

      <Text style={styles.sectionTitle}>StatsCard 组件示例</Text>
      
      <StatsCard
        icon="⭐"
        label="获得星星"
        value="328颗"
        color={colors.star}
        style={styles.statsCard}
      />
      
      <StatsCard
        icon="🎯"
        label="完成关卡"
        value="156关"
        color={colors.primary}
        style={styles.statsCard}
      />
      
      <StatsCard
        icon="🔥"
        label="连续学习"
        value="7天"
        color={colors.game.match}
        style={styles.statsCard}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  gameCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statsCard: {
    marginVertical: spacing.sm,
  },
});
