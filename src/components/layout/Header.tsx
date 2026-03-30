import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import BackButton from './BackButton';
import { colors, layout, fontSizes, fontWeights, iconSizes } from '../../theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showStars?: boolean;
  starsCount?: number;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
}

export default function Header({
  title,
  showBack = false,
  showStars = false,
  starsCount = 0,
  onBackPress,
  rightComponent,
  style,
}: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        {showBack && <BackButton onPress={onBackPress} />}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        {showStars && (
          <View
            style={styles.starsContainer}
            accessibilityRole="text"
            accessibilityLabel={`当前星星数${starsCount}`}
          >
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starsCount}>{starsCount}</Text>
          </View>
        )}
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.header,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: fontSizes.title.small,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  starIcon: {
    fontSize: iconSizes.small,
    marginRight: 4,
  },
  starsCount: {
    fontSize: fontSizes.body.large,
    fontWeight: fontWeights.bold,
    color: colors.star,
  },
});
