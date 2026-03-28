import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDeviceType, useTabletAdaptation } from '../../hooks';
import { getResponsiveTheme, getResponsivePageMargin } from '../../theme/responsive';

export function TabletAdaptationExample() {
  const deviceInfo = useDeviceType();
  const tabletAdaptation = useTabletAdaptation();
  const responsiveTheme = getResponsiveTheme();
  const pageMargin = getResponsivePageMargin();

  return (
    <View style={[styles.container, { margin: pageMargin }]}>
      <Text style={styles.title}>设备适配信息</Text>
      
      <View style={styles.infoBlock}>
        <Text style={styles.label}>设备类型:</Text>
        <Text style={styles.value}>{deviceInfo.deviceType}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>是否平板:</Text>
        <Text style={styles.value}>{deviceInfo.isTablet ? '是' : '否'}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>屏幕尺寸:</Text>
        <Text style={styles.value}>
          {deviceInfo.screenWidth} x {deviceInfo.screenHeight}
        </Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>方向:</Text>
        <Text style={styles.value}>{deviceInfo.orientation}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>平台:</Text>
        <Text style={styles.value}>{deviceInfo.platform}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.title}>适配参数</Text>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>页面边距:</Text>
        <Text style={styles.value}>{tabletAdaptation.pageMargin}px</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>字体放大倍数:</Text>
        <Text style={styles.value}>{tabletAdaptation.fontSizeMultiplier}x</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>最小触摸区域:</Text>
        <Text style={styles.value}>
          {tabletAdaptation.touchTarget.minimum}×{tabletAdaptation.touchTarget.minimum}px
        </Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>按钮触摸区域:</Text>
        <Text style={styles.value}>
          {tabletAdaptation.touchTarget.button}px 宽
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.title}>响应式字体示例</Text>

      <Text style={[styles.sampleText, { fontSize: responsiveTheme.fontSizes.title.large }]}>
        大标题 ({responsiveTheme.fontSizes.title.large}px)
      </Text>

      <Text style={[styles.sampleText, { fontSize: responsiveTheme.fontSizes.body.large }]}>
        大正文 ({responsiveTheme.fontSizes.body.large}px)
      </Text>

      <Text style={[styles.sampleText, { fontSize: responsiveTheme.fontSizes.button.medium }]}>
        中按钮 ({responsiveTheme.fontSizes.button.medium}px)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF9F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2D3436',
  },
  infoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#DFE6E9',
    marginVertical: 20,
  },
  sampleText: {
    marginBottom: 12,
    color: '#2D3436',
  },
});
