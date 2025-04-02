import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View 
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

/**
 * Reusable Button component
 * @param {string} type - Type of button: 'primary', 'secondary', 'outline', 'text'
 * @param {string} size - Size of button: 'small', 'medium', 'large'
 * @param {boolean} disabled - Whether the button is disabled
 * @param {boolean} loading - Whether to show loading indicator
 * @param {function} onPress - Function to call on button press
 * @param {string} title - Text to display on button
 * @param {object} style - Additional styles to apply
 * @param {object} textStyle - Additional styles for button text
 * @param {JSX.Element} icon - Optional icon to display next to text
 * @param {string} iconPosition - Position of icon: 'left' or 'right'
 */
const Button = ({
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  title,
  style,
  textStyle,
  icon,
  iconPosition = 'left'
}) => {
  // Determine button style based on type
  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'text':
        return styles.textButton;
      default:
        return styles.primaryButton;
    }
  };

  // Determine button text style based on type
  const getTextStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryButtonText;
      case 'secondary':
        return styles.secondaryButtonText;
      case 'outline':
        return styles.outlineButtonText;
      case 'text':
        return styles.textButtonText;
      default:
        return styles.primaryButtonText;
    }
  };

  // Determine button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Determine text size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return styles.smallButtonText;
      case 'medium':
        return styles.mediumButtonText;
      case 'large':
        return styles.largeButtonText;
      default:
        return styles.mediumButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getButtonSize(),
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={type === 'outline' || type === 'text' ? COLORS.primary : COLORS.white} 
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && (
            <View style={styles.leftIcon}>{icon}</View>
          )}
          
          <Text style={[
            styles.buttonText,
            getTextStyle(),
            getTextSize(),
            disabled && styles.disabledButtonText,
            textStyle
          ]}>
            {title}
          </Text>
          
          {icon && iconPosition === 'right' && (
            <View style={styles.rightIcon}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  
  // Type Styles
  primaryButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.button,
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.button,
  },
  secondaryButtonText: {
    color: COLORS.white,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  outlineButtonText: {
    color: COLORS.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  textButtonText: {
    color: COLORS.primary,
  },
  
  // Size Styles
  smallButton: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    minWidth: 80,
    height: SIZES.buttonHeightSm,
  },
  mediumButton: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    minWidth: 120,
    height: SIZES.buttonHeight,
  },
  largeButton: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    minWidth: 160,
    height: SIZES.buttonHeightLg,
  },
  
  // Text Size Styles
  smallButtonText: {
    fontSize: FONTS.body3,
  },
  mediumButtonText: {
    fontSize: FONTS.body2,
  },
  largeButtonText: {
    fontSize: FONTS.body1,
  },
  
  // Disabled Styles
  disabledButton: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray,
    ...SHADOWS.small,
  },
  disabledButtonText: {
    color: COLORS.white,
  },
  
  // Icon Styles
  leftIcon: {
    marginRight: SIZES.xs,
  },
  rightIcon: {
    marginLeft: SIZES.xs,
  },
});

export default Button;