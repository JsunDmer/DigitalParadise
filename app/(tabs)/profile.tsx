import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../../src/components/layout/Header';
import { StatsCard, SettingSwitch } from '../../src/components/ui';
import { useUserStore } from '../../src/stores/useUserStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { useProgressStore } from '../../src/stores/useProgressStore';
import {
  colors,
  borderRadius,
  fontSizes,
  fontWeights,
  iconSizes,
  layout,
  spacing,
} from '../../src/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentChild, updateChild } = useUserStore();
  const {
    soundEnabled,
    musicEnabled,
    notificationsEnabled,
    toggleSound,
    toggleMusic,
    toggleNotifications,
  } = useSettingsStore();
  const { totalStars, completedLevels } = useProgressStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentChild?.name || '');
  const [editAge, setEditAge] = useState(currentChild?.age?.toString() || '5');

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  };

  // 游戏时长：根据完成关卡数估算，每关约5分钟
  const totalPlayTime = completedLevels * 5;

  const getAgeText = (age: number) => {
    if (age <= 3) return '小班';
    if (age <= 4) return '中班';
    return '大班';
  };

  const handleSaveProfile = () => {
    if (currentChild && editName.trim()) {
      updateChild(currentChild.id, {
        name: editName.trim(),
        age: parseInt(editAge) || 5,
      });
      setIsEditing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="👤 我的档案"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.avatarSection}
          onPress={() => setIsEditing(true)}
          accessibilityRole="button"
          accessibilityLabel="编辑小朋友信息"
          accessibilityHint="点击修改姓名和年龄"
        >
          <View style={styles.avatarContainer}>
            {currentChild?.avatar ? (
              <Image source={{ uri: currentChild.avatar }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarPlaceholder}>👶</Text>
            )}
          </View>
          <Text style={styles.name}>
            {currentChild?.name || '小朋友'}
          </Text>
          <Text style={styles.age}>
            {currentChild?.age || 5}岁 · {getAgeText(currentChild?.age || 5)}
          </Text>
          <Text style={styles.editHint}>点击修改信息</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 学习统计</Text>
          <View style={styles.statsContainer}>
            <StatsCard
              icon="⏱️"
              label="总游戏时长"
              value={formatPlayTime(totalPlayTime)}
              color={colors.game.count}
              style={styles.statsCard}
            />
            <StatsCard
              icon="🎯"
              label="完成关卡数"
              value={`${completedLevels}关`}
              color={colors.game.match}
              style={styles.statsCard}
            />
            <StatsCard
              icon="⭐"
              label="获得星星数"
              value={`${totalStars}颗`}
              color={colors.star}
              style={styles.statsCard}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ 设置</Text>
          <View style={styles.settingsContainer}>
            <SettingSwitch
              icon="🎵"
              label="音效"
              value={soundEnabled}
              onValueChange={toggleSound}
              style={styles.settingItem}
            />
            <SettingSwitch
              icon="🔊"
              label="音乐"
              value={musicEnabled}
              onValueChange={toggleMusic}
              style={styles.settingItem}
            />
            <SettingSwitch
              icon="🔔"
              label="通知"
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              style={styles.settingItem}
            />
          </View>
        </View>
      </ScrollView>

      {/* 编辑信息弹窗 */}
      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>修改小朋友信息</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>姓名</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="请输入姓名"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>年龄</Text>
              <TextInput
                style={styles.input}
                value={editAge}
                onChangeText={setEditAge}
                placeholder="请输入年龄"
                placeholderTextColor={colors.text.secondary}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
                accessibilityRole="button"
                accessibilityLabel="取消编辑"
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
                accessibilityRole="button"
                accessibilityLabel="保存信息"
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  avatarSection: {
    height: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.circle,
  },
  avatarPlaceholder: {
    fontSize: 40,
  },
  name: {
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  age: {
    fontSize: fontSizes.caption,
    color: colors.text.secondary,
  },
  section: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsContainer: {
    gap: spacing.sm,
  },
  statsCard: {
    marginBottom: spacing.sm,
  },
  settingsContainer: {
    gap: spacing.sm,
  },
  settingItem: {
    marginBottom: spacing.sm,
  },
  editHint: {
    fontSize: fontSizes.caption,
    color: colors.primary,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: fontSizes.title.small,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSizes.body.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSizes.body.large,
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: fontSizes.body.large,
    color: colors.text.secondary,
    fontWeight: fontWeights.medium,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: fontSizes.body.large,
    color: colors.surface,
    fontWeight: fontWeights.bold,
  },
});
