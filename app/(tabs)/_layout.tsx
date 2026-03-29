import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 80,
          backgroundColor: colors.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 8,
          paddingBottom: 20,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={28} />,
        }}
      />

      <Tabs.Screen
        name="achievements"
        options={{
          title: '成就',
          tabBarIcon: ({ color }) => <Ionicons name="trophy" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
