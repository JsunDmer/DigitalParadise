import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors, borderRadius, elementSpacing, fontSizes, fontWeights } from '@/theme';

type FeedbackStateType = 'loading' | 'empty' | 'error';

interface FeedbackStateCardProps {
  type: FeedbackStateType;
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

const DEFAULT_COPY: Record<FeedbackStateType, { title: string; message: string }> = {
  loading: {
    title: '正在加载',
    message: '请稍等，我们正在准备内容。',
  },
  empty: {
    title: '暂无数据',
    message: '当前还没有可展示的内容。',
  },
  error: {
    title: '加载失败',
    message: '出现了一点问题，请稍后重试。',
  },
};

export default function FeedbackStateCard({
  type,
  title,
  message,
  retryLabel = '重试',
  onRetry,
  style,
}: FeedbackStateCardProps) {
  const copy = DEFAULT_COPY[type];
  const showRetry = type === 'error' && typeof onRetry === 'function';

  return (
    <View style={[styles.container, style]}>
      {type === 'loading' && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          accessibilityLabel="正在加载"
        />
      )}
      <Text style={styles.title}>{title ?? copy.title}</Text>
      <Text style={styles.message}>{message ?? copy.message}</Text>
      {showRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
        >
          <Text style={styles.retryText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: elementSpacing.relaxed,
    paddingVertical: 24,
  },
  title: {
    marginTop: 12,
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  message: {
    marginTop: 8,
    fontSize: fontSizes.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  retryText: {
    color: colors.surface,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.body.medium,
  },
});
