import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Import components and utilities
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { registerUser, clearAuthError } from '../../store/reducers/authReducer';

const RegisterScreen = ({ navigation }) => {
  // Component state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  
  const [userType, setUserType] = useState('patient');
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  
  const [isFormValid, setIsFormValid] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  // Update form data
  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Validate form on input change
  useEffect(() => {
    validateForm();
  }, [formData, userType]);

  // Show error alert if redux has an error
  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      dispatch(clearAuthError());
    }
  }, [error]);

  // Validation functions
  const validateForm = () => {
    let newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    };
    
    let valid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    // Phone validation (optional)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      valid = false;
    }

    setErrors(newErrors);
    setIsFormValid(valid);
    return valid;
  };

  // Handlers
  const handleRegister = () => {
    if (validateForm()) {
      // If user type is doctor, navigate to doctor verification
      if (userType === 'doctor') {
        navigation.navigate('DoctorVerification', { 
          userData: formData,
          userType: userType
        });
      } else {
        // Otherwise, register the user directly
        dispatch(registerUser(formData, userType));
      }
    } else {
      Alert.alert('Validation Error', 'Please check your form inputs.');
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  // UI for user type selection
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Create an Account</Text>
            <Text style={styles.subText}>
              Join HealthAI to access personalized healthcare services
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

          {/* Registration Form */}
          <View style={styles.formContainer}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              error={errors.name}
              leftIcon={
                <Ionicons name="person-outline" size={20} color={COLORS.gray} />
              }
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
              }
            />

            <Input
              label="Phone Number (Optional)"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
              error={errors.phone}
              leftIcon={
                <Ionicons name="call-outline" size={20} color={COLORS.gray} />
              }
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secured={true}
              error={errors.password}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
              }
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secured={true}
              error={errors.confirmPassword}
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
              }
            />

            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            <Button
              title="Create Account"
              onPress={handleRegister}
              disabled={!isFormValid}
              style={styles.registerButton}
            />
          </View>

          {/* Login Option */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    marginVertical: SIZES.padding,
  },
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.sm,
  },
  subText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
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
    marginVertical: SIZES.sm,
  },
  termsText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body3,
    color: COLORS.textLight,
    marginVertical: SIZES.md,
    textAlign: 'center',
  },
  termsLink: {
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  registerButton: {
    marginTop: SIZES.sm,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.md,
    marginBottom: SIZES.xl,
  },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body2,
    color: COLORS.textLight,
  },
  loginLink: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body2,
    color: COLORS.primary,
    marginLeft: SIZES.xs,
  },
});

export default RegisterScreen;