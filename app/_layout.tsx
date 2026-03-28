import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/theme';
import { initService } from '@/services';
import { useUserStore } from '@/stores';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addChild = useUserStore((state) => state.addChild);
  const setCurrentChild = useUserStore((state) => state.setCurrentChild);

  useEffect(() => {
    async function prepare() {
      try {
        const result = await initService.initialize();
        
        if (!result.success) {
          setError(result.error || '初始化失败');
          return;
        }

        if (!result.hasChildren) {
          addChild({
            id: '1',
            name: '小明',
            age: 5,
            createdAt: new Date().toISOString(),
          });
          
          setCurrentChild({
            id: '1',
            name: '小明',
            age: 5,
            createdAt: new Date().toISOString(),
          });
        }

        setIsReady(true);
      } catch (e) {
        console.error('Initialization error:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    }

    prepare();
  }, [addChild, setCurrentChild]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>应用启动失败</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
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
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
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
});
