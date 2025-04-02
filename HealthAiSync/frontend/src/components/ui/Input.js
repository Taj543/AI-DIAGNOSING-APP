import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

/**
 * Reusable Input component
 * @param {string} label - Label text for the input
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Current input value
 * @param {function} onChangeText - Function to call when text changes
 * @param {boolean} secured - Whether input should be password field
 * @param {object} style - Additional styles to apply
 * @param {string} error - Error message to display
 * @param {function} onBlur - Function to call when input loses focus
 * @param {boolean} disabled - Whether input is disabled
 * @param {string} keyboardType - Type of keyboard to display
 * @param {boolean} multiline - Whether input is multiline
 * @param {JSX.Element} leftIcon - Icon to display on left side of input
 * @param {JSX.Element} rightIcon - Icon to display on right side of input
 * @param {boolean} autoCapitalize - Auto capitalize behavior
 * @param {string} helperText - Additional helper text
 */
const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secured = false,
  style,
  error,
  onBlur,
  disabled = false,
  keyboardType = 'default',
  multiline = false,
  leftIcon,
  rightIcon,
  autoCapitalize = 'sentences',
  helperText,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(!secured);

  const toggleSecureEntry = () => {
    setIsSecureTextVisible(!isSecureTextVisible);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInputContainer,
          error && styles.errorInputContainer,
          disabled && styles.disabledInputContainer,
          multiline && styles.multilineInputContainer,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            secured && styles.inputWithSecureToggle,
            multiline && styles.multilineInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secured && !isSecureTextVisible}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        
        {secured && (
          <TouchableOpacity
            style={styles.secureToggle}
            onPress={toggleSecureEntry}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isSecureTextVisible ? 'eye-off' : 'eye'}
              size={22}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text
          style={[styles.helperText, error ? styles.errorText : {}]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
    width: '100%',
  },
  label: {
    fontSize: FONTS.body3,
    fontFamily: FONTS.medium,
    color: COLORS.textDark,
    marginBottom: SIZES.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.sm,
    height: SIZES.inputHeight,
  },
  input: {
    flex: 1,
    fontSize: FONTS.body2,
    fontFamily: FONTS.regular,
    color: COLORS.inputText,
    paddingVertical: SIZES.xs,
  },
  helperText: {
    fontSize: FONTS.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: SIZES.xs,
  },
  errorText: {
    color: COLORS.error,
  },
  focusedInputContainer: {
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  errorInputContainer: {
    borderColor: COLORS.error,
  },
  disabledInputContainer: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.border,
  },
  leftIcon: {
    marginRight: SIZES.xs,
  },
  rightIcon: {
    marginLeft: SIZES.xs,
  },
  inputWithLeftIcon: {
    paddingLeft: SIZES.xs,
  },
  inputWithRightIcon: {
    paddingRight: SIZES.xs,
  },
  secureToggle: {
    padding: SIZES.xs,
  },
  inputWithSecureToggle: {
    paddingRight: SIZES.lg,
  },
  multilineInputContainer: {
    height: 100,
    alignItems: 'flex-start',
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: SIZES.sm,
    height: 80,
  },
});

export default Input;