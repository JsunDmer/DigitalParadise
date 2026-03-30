// WeakRef polyfill for HarmonyOS compatibility
if (typeof WeakRef === 'undefined') {
  require('@ungap/weakrefs');
}

import { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { colors } from '@/theme';
import { initService } from '@/services';
import { useUserStore } from '@/stores';
import { childService } from '@/services';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addChild = useUserStore((state) => state.addChild);
  const setCurrentChild = useUserStore((state) => state.setCurrentChild);

  const getErrorMessage = (e: unknown) => {
    if (e instanceof Error && e.message.trim()) {
      return e.message;
    }
    return '未知错误，请稍后重试';
  };

  const prepare = useCallback(async () => {
    setError(null);
    setIsReady(false);
    setIsInitializing(true);
    try {
      const result = await initService.initialize();

      if (!result.success) {
        setError(result.error || '初始化失败，请重试');
        return;
      }

      if (!result.hasChildren) {
        const defaultChild = await childService.create({
          name: '小明',
          birthDate: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          parentId: 'default_parent',
        });

        const childProfile = {
          id: defaultChild.id,
          name: defaultChild.name,
          avatar: defaultChild.avatar,
          age: 5,
          createdAt: defaultChild.createdAt,
        };
        addChild(childProfile);
        setCurrentChild(childProfile);
      }

      setIsReady(true);
    } catch (e) {
      console.error('Initialization error:', e);
      setError(getErrorMessage(e));
    } finally {
      setIsInitializing(false);
    }
  }, [addChild, setCurrentChild]);

  useEffect(() => {
    // 解锁屏幕方向，支持横竖屏
    ScreenOrientation.unlockAsync();
    prepare();
  }, [prepare]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>应用启动失败</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, isInitializing && styles.retryButtonDisabled]}
          onPress={prepare}
          disabled={isInitializing}
          activeOpacity={0.85}
        >
          <Text style={styles.retryButtonText}>{isInitializing ? '重试中...' : '重试'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isReady || isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="matching-game" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="games/counting" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="games/sequence" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="games/addition" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="achievements" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  retryButtonDisabled: {
    opacity: 0.6,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
