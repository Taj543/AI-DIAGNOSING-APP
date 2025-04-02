import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Import components and utilities
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { registerUser } from '../../store/reducers/authReducer';

const DoctorVerificationScreen = ({ route, navigation }) => {
  // Get user data from registration
  const { userData, userType } = route.params;
  
  // Component state
  const [formData, setFormData] = useState({
    specialization: '',
    licenseNumber: '',
    experience: '',
    hospital: '',
    bio: '',
  });
  
  const [errors, setErrors] = useState({
    specialization: '',
    licenseNumber: '',
    experience: '',
    hospital: '',
    bio: '',
  });
  
  const [licenseImage, setLicenseImage] = useState(null);
  const [licenseImageError, setLicenseImageError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Redux
  const dispatch = useDispatch();

  // Update form data
  const updateFormData = (field, value) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };
    
    setFormData(newFormData);
    validateForm(newFormData);
  };

  // Image picker function
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload your license.');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setLicenseImage(result.assets[0].uri);
        setLicenseImageError('');
        validateForm(formData, result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Validation function
  const validateForm = (data = formData, image = licenseImage) => {
    let newErrors = {
      specialization: '',
      licenseNumber: '',
      experience: '',
      hospital: '',
      bio: '',
    };
    
    let valid = true;
    let licenseImgError = '';

    // Required field validation
    if (!data.specialization) {
      newErrors.specialization = 'Specialization is required';
      valid = false;
    }

    if (!data.licenseNumber) {
      newErrors.licenseNumber = 'License number is required';
      valid = false;
    }

    if (!data.experience) {
      newErrors.experience = 'Years of experience is required';
      valid = false;
    } else if (isNaN(data.experience) || parseInt(data.experience) < 0) {
      newErrors.experience = 'Please enter a valid number';
      valid = false;
    }

    if (!data.hospital) {
      newErrors.hospital = 'Hospital or clinic name is required';
      valid = false;
    }

    if (!data.bio) {
      newErrors.bio = 'Professional bio is required';
      valid = false;
    } else if (data.bio.length < 20) {
      newErrors.bio = 'Bio should be at least 20 characters';
      valid = false;
    }

    // License image validation
    if (!image) {
      licenseImgError = 'Please upload an image of your medical license';
      valid = false;
    }

    setErrors(newErrors);
    setLicenseImageError(licenseImgError);
    setIsFormValid(valid);
    
    return valid;
  };

  // Submit verification
  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, we would upload the image and send verification data
      // For this demo, we'll just register the user with the additional doctor info
      const fullUserData = {
        ...userData,
        ...formData,
        licenseImageUrl: licenseImage, // In real app, this would be the URL after upload
        verificationStatus: 'pending', // New doctors start as pending verification
      };
      
      // Register the doctor
      dispatch(registerUser(fullUserData, userType));
      
      // Show success message
      Alert.alert(
        'Verification Submitted',
        'Your doctor verification has been submitted for review. You will receive access once approved.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Validation Error', 'Please check your form inputs.');
    }
  };

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
            <Text style={styles.headerText}>Doctor Verification</Text>
            <Text style={styles.subText}>
              Please provide your medical credentials for verification
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Input
              label="Medical Specialization"
              placeholder="e.g., Cardiology, Pediatrics"
              value={formData.specialization}
              onChangeText={(value) => updateFormData('specialization', value)}
              error={errors.specialization}
              leftIcon={
                <MaterialIcons name="local-hospital" size={20} color={COLORS.gray} />
              }
            />

            <Input
              label="License Number"
              placeholder="Enter your medical license number"
              value={formData.licenseNumber}
              onChangeText={(value) => updateFormData('licenseNumber', value)}
              error={errors.licenseNumber}
              leftIcon={
                <MaterialIcons name="badge" size={20} color={COLORS.gray} />
              }
            />

            <Input
              label="Years of Experience"
              placeholder="Enter years of medical practice"
              value={formData.experience}
              onChangeText={(value) => updateFormData('experience', value)}
              keyboardType="numeric"
              error={errors.experience}
              leftIcon={
                <MaterialIcons name="access-time" size={20} color={COLORS.gray} />
              }
            />

            <Input
              label="Hospital/Clinic"
              placeholder="Enter your primary practice location"
              value={formData.hospital}
              onChangeText={(value) => updateFormData('hospital', value)}
              error={errors.hospital}
              leftIcon={
                <Ionicons name="business" size={20} color={COLORS.gray} />
              }
            />

            <Input
              label="Professional Bio"
              placeholder="Briefly describe your qualifications and experience"
              value={formData.bio}
              onChangeText={(value) => updateFormData('bio', value)}
              multiline={true}
              error={errors.bio}
              leftIcon={
                <MaterialIcons name="description" size={20} color={COLORS.gray} />
              }
            />

            {/* License Image Upload */}
            <Card
              title="Medical License"
              subtitle="Upload a clear image of your medical license"
              leftIcon={<MaterialIcons name="file-upload" size={24} color={COLORS.primary} />}
              style={styles.uploadCard}
            >
              <TouchableOpacity 
                style={styles.uploadContainer} 
                onPress={pickImage}
              >
                {licenseImage ? (
                  <Image
                    source={{ uri: licenseImage }}
                    style={styles.licenseImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <MaterialIcons name="add-photo-alternate" size={40} color={COLORS.gray} />
                    <Text style={styles.uploadText}>Upload License Image</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {licenseImageError ? (
                <Text style={styles.errorText}>{licenseImageError}</Text>
              ) : null}
              
              <Text style={styles.helperText}>
                The image should clearly show your name, license number, and issue/expiry dates
              </Text>
            </Card>

            {/* Submit Button */}
            <Button
              title="Submit for Verification"
              onPress={handleSubmit}
              disabled={!isFormValid}
              style={styles.submitButton}
            />
          </View>
          
          {/* Privacy Note */}
          <View style={styles.privacyContainer}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
            <Text style={styles.privacyText}>
              Your credentials will be securely stored and reviewed by our team.
              This information will not be shared with patients.
            </Text>
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
  formContainer: {
    marginVertical: SIZES.sm,
  },
  uploadCard: {
    marginVertical: SIZES.md,
  },
  uploadContainer: {
    width: '100%',
    height: 200,
    marginVertical: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
  },
  uploadText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body2,
    color: COLORS.gray,
    marginTop: SIZES.sm,
  },
  licenseImage: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body3,
    color: COLORS.error,
    marginTop: SIZES.xs,
  },
  helperText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body3,
    color: COLORS.textLight,
    marginTop: SIZES.xs,
  },
  submitButton: {
    marginTop: SIZES.lg,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    marginVertical: SIZES.md,
  },
  privacyText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body3,
    color: COLORS.textLight,
    marginLeft: SIZES.sm,
    flex: 1,
  },
});

export default DoctorVerificationScreen;