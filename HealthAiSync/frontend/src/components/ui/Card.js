import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

/**
 * Reusable Card component
 * @param {string} title - Title of the card
 * @param {string} subtitle - Subtitle text
 * @param {JSX.Element} children - Card content
 * @param {JSX.Element} leftIcon - Icon to display on the left of title
 * @param {JSX.Element} rightIcon - Icon to display on the right of title
 * @param {function} onPress - Function to call when card is pressed
 * @param {string} variant - Card variant: 'default', 'outlined', 'elevated'
 * @param {object} style - Additional styles for the card container
 * @param {object} contentStyle - Additional styles for the content area
 * @param {boolean} disabled - Whether the card is disabled
 */
const Card = ({
  title,
  subtitle,
  children,
  leftIcon,
  rightIcon,
  onPress,
  variant = 'default',
  style,
  contentStyle,
  disabled = false,
}) => {
  // Determine card style based on variant
  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.outlinedCard;
      case 'elevated':
        return styles.elevatedCard;
      default:
        return styles.defaultCard;
    }
  };

  // Determine if the card is pressable
  const isCardPressable = onPress && !disabled;

  // Card component
  const cardComponent = (
    <View
      style={[
        styles.container,
        getCardStyle(),
        disabled && styles.disabledCard,
        style,
      ]}
    >
      {/* Card header with title, subtitle and icons */}
      {(title || leftIcon || rightIcon) && (
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            
            {(title || subtitle) && (
              <View style={styles.titleTextContainer}>
                {title && (
                  <Text
                    style={[styles.title, disabled && styles.disabledText]}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                )}
                
                {subtitle && (
                  <Text
                    style={[styles.subtitle, disabled && styles.disabledText]}
                    numberOfLines={2}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
            )}
          </View>
          
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
      
      {/* Card content */}
      {children && (
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      )}
    </View>
  );

  // Return wrapped in TouchableOpacity if pressable
  if (isCardPressable) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled}
      >
        {cardComponent}
      </TouchableOpacity>
    );
  }

  // Otherwise return as View
  return cardComponent;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.cardBorderRadius,
    backgroundColor: COLORS.cardBg,
    overflow: 'hidden',
    marginBottom: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.cardPadding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.h4,
    fontFamily: FONTS.medium,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FONTS.body3,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  content: {
    padding: SIZES.cardPadding,
  },
  leftIcon: {
    marginRight: SIZES.sm,
  },
  rightIcon: {
    marginLeft: SIZES.sm,
  },
  // Variant styles
  defaultCard: {
    backgroundColor: COLORS.cardBg,
    ...SHADOWS.small,
  },
  outlinedCard: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  elevatedCard: {
    backgroundColor: COLORS.cardBg,
    ...SHADOWS.medium,
  },
  // Disabled styles
  disabledCard: {
    backgroundColor: COLORS.backgroundDark,
    opacity: 0.7,
  },
  disabledText: {
    color: COLORS.textLight,
  },
});

export default Card;