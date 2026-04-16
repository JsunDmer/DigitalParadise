// WeakRef polyfill for HarmonyOS compatibility
if (typeof WeakRef === 'undefined') {
  require('@ungap/weakrefs');
}

import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { colors } from '@/theme';
import { initService } from '@/services';
import { markPerfEnd, markPerfStart } from '@/utils';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (e: unknown) => {
    if (e instanceof Error && e.message.trim()) return e.message;
    return '未知错误，请稍后重试';
  };

  const prepare = async () => {
    const perfStart = markPerfStart('app_bootstrap_ms');
    setError(null);
    setIsReady(false);
    setIsInitializing(true);
    try {
      const result = await initService.initialize();
      if (!result.success) {
        setError(result.error || '初始化失败，请重试');
        markPerfEnd('app_bootstrap_ms', perfStart);
        setIsInitializing(false);
        return;
      }
      setIsReady(true);
      markPerfEnd('app_bootstrap_ms', perfStart);
    } catch (e) {
      console.error('Initialization error:', e);
      setError(getErrorMessage(e));
      markPerfEnd('app_bootstrap_ms', perfStart);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    prepare();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>应用启动失败</Text>
        <Text style={styles.errorDetail}>{error}</Text>
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
      <Stack.Screen name="matching-game" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="games/counting" options={{ headerShown: false }} />
      <Stack.Screen name="games/sequence" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="games/addition" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="games/compare" options={{ headerShown: false, animation: 'slide_from_right' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.text.secondary },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 },
  errorText: { fontSize: 18, fontWeight: 'bold', color: colors.error, marginBottom: 8 },
  errorDetail: { fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
});