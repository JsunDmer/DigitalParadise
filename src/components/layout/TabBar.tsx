import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Animated } from 'react-native';
import { useRef } from 'react';
import { colors, layout, borderRadius, iconSizes, fontSizes, fontWeights } from '../../theme';
import type { Href } from 'expo-router';

interface TabItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
}

const tabs: TabItem[] = [
  {
    name: 'home',
    icon: 'home-outline',
    iconActive: 'home',
    label: '首页',
    route: '/',
  },
  {
    name: 'games',
    icon: 'game-controller-outline',
    iconActive: 'game-controller',
    label: '游戏',
    route: '/games',
  },
  {
    name: 'achievements',
    icon: 'trophy-outline',
    iconActive: 'trophy',
    label: '成就',
    route: '/achievements',
  },
  {
    name: 'profile',
    icon: 'person-outline',
    iconActive: 'person',
    label: '我的',
    route: '/profile',
  },
];

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const scaleAnims = useRef(tabs.map(() => new Animated.Value(1))).current;

  const handlePressIn = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handleTabPress = (route: string, _index: number) => {
    router.push(route as Href);
  };

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname.startsWith(route);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const active = isActive(tab.route);
        return (
          <Animated.View
            key={tab.name}
            style={{ transform: [{ scale: scaleAnims[index] }] }}
          >
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.route, index)}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              activeOpacity={1}
            >
              <Ionicons
                name={active ? tab.iconActive : tab.icon}
                size={iconSizes.small}
                color={active ? colors.primary : colors.text.secondary}
              />
              <Text
                style={[
                  styles.label,
                  active && styles.labelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.bottomNav,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    paddingBottom: 8,
    paddingTop: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  label: {
    fontSize: fontSizes.body.small,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginTop: 4,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
});
