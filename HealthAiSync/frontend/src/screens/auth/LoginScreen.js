import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Import components and utilities
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { loginUser, clearAuthError } from '../../store/reducers/authReducer';

const LoginScreen = ({ navigation }) => {
  // Component state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient'); // Default to patient
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  // Validation effect
  useEffect(() => {
    validateForm();
  }, [email, password]);

  // Clear error on component unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearAuthError());
      }
    };
  }, []);

  // Show error alert if redux has an error
  useEffect(() => {
    if (error) {
      Alert.alert('Authentication Error', error);
      dispatch(clearAuthError());
    }
  }, [error]);

  // Validation functions
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validateForm = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    setIsFormValid(isEmailValid && isPasswordValid);
  };

  // Handlers
  const handleLogin = () => {
    if (isFormValid) {
      dispatch(loginUser(email, password, userType));
    } else {
      validateForm();
      Alert.alert('Validation Error', 'Please check your email and password.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  // UI for user type selection buttons
  const UserTypeButton = ({ type, label, icon }) => (
    <TouchableOpacity
      style={[
        styles.userTypeButton,
        userType === type && styles.userTypeButtonActive,
      ]}
      onPress={() => handleUserTypeSelect(type)}
    >
      <Ionicons
        name={icon}
        size={24}
        color={userType === type ? COLORS.white : COLORS.primary}
      />
      <Text
        style={[
          styles.userTypeText,
          userType === type && styles.userTypeTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Welcome Text */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome to HealthAI</Text>
            <Text style={styles.subText}>
              Sign in to access your personalized healthcare experience
            </Text>
          </View>

          {/* User Type Selection */}
          <View style={styles.userTypeContainer}>
            <Text style={styles.userTypeLabel}>I am a:</Text>
            <View style={styles.userTypeButtons}>
              <UserTypeButton
                type="patient"
                label="Patient"
                icon="person"
              />
              <UserTypeButton
                type="doctor"
                label="Doctor"
                icon="medkit"
              />
              <UserTypeButton
                type="caretaker"
                label="Caretaker"
                icon="people"
              />
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
              }
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secured={true}
              error={passwordError}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
              }
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              disabled={!isFormValid}
              style={styles.loginButton}
            />
          </View>

          {/* Register Option */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: SIZES.padding * 2,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SIZES.padding,
  },
  welcomeText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.h1,
    color: COLORS.primary,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  subText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: SIZES.padding,
  },
  userTypeContainer: {
    marginBottom: SIZES.md,
  },
  userTypeLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body1,
    color: COLORS.textDark,
    marginBottom: SIZES.xs,
  },
  userTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    marginHorizontal: SIZES.xs / 2,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
  },
  userTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  userTypeText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body3,
    color: COLORS.primary,
    marginLeft: SIZES.xs,
  },
  userTypeTextActive: {
    color: COLORS.white,
  },
  formContainer: {
    marginVertical: SIZES.padding,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.md,
  },
  forgotPasswordText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body3,
    color: COLORS.primary,
  },
  loginButton: {
    marginTop: SIZES.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.md,
  },
  registerText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body2,
    color: COLORS.textLight,
  },
  registerLink: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body2,
    color: COLORS.primary,
    marginLeft: SIZES.xs,
  },
});

export default LoginScreen;