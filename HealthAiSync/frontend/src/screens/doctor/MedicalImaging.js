import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import Colors from '../../constants/theme';
import { analyzeMedicalImage } from '../../services/openaiService';

const MedicalImaging = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('general'); // general, radiology, pathology, dermatology
  const scrollViewRef = useRef();

  // Request permissions and pick image
  const pickImage = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your media library.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
        setAnalysisResult(null); // Clear previous analysis
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  // Take a photo with camera
  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your camera.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
        setAnalysisResult(null); // Clear previous analysis
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo: ' + error.message);
    }
  };

  // Analyze the selected image with AI
  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image to analyze.');
      return;
    }

    setLoading(true);

    try {
      // Create appropriate prompt based on analysis type
      let prompt = "";
      switch (analysisType) {
        case 'radiology':
          prompt = "You are a highly experienced radiologist. Analyze this medical imaging scan in detail. Identify any abnormalities, potential diagnoses, and notable features. Provide a structured radiology report including: 1) Key findings, 2) Possible diagnoses/differential diagnoses, 3) Recommendations for follow-up or additional imaging if needed.";
          break;
        case 'pathology':
          prompt = "You are a skilled pathologist. Analyze this pathology specimen in detail. Describe cellular structures, tissue architecture, and any abnormalities. Identify potential pathological conditions and provide a structured assessment including: 1) Specimen description, 2) Microscopic findings, 3) Potential diagnoses.";
          break;
        case 'dermatology':
          prompt = "You are a dermatology specialist. Analyze this skin condition in detail. Describe the visual characteristics, potential diagnoses, and recommended treatments. Provide a structured assessment including: 1) Visual features, 2) Differential diagnoses, 3) Suggested treatments and follow-up.";
          break;
        default:
          prompt = "You are a medical imaging specialist. Analyze this medical image in detail. Describe what you observe, including any abnormalities or areas of concern. Provide a structured medical analysis with potential clinical implications.";
      }

      // Call OpenAI for analysis
      const response = await analyzeMedicalImage(selectedImage.base64, prompt);
      setAnalysisResult(response);
      
      // Scroll to results
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
    } catch (error) {
      Alert.alert('Analysis Failed', 'Error analyzing image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset the state
  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  // Render analysis type selector
  const renderAnalysisTypeSelector = () => {
    const types = [
      { id: 'general', label: 'General', icon: 'search' },
      { id: 'radiology', label: 'Radiology', icon: 'x-ray' },
      { id: 'pathology', label: 'Pathology', icon: 'microscope' },
      { id: 'dermatology', label: 'Dermatology', icon: 'fingerprint' }
    ];

    return (
      <View style={styles.analysisTypesContainer}>
        <Text style={styles.sectionTitle}>Analysis Type</Text>
        <View style={styles.typeButtons}>
          {types.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                analysisType === type.id && styles.selectedTypeButton
              ]}
              onPress={() => setAnalysisType(type.id)}
            >
              <MaterialCommunityIcons
                name={type.icon}
                size={22}
                color={analysisType === type.id ? Colors.white : Colors.doctorTheme}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  analysisType === type.id && styles.selectedTypeText
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      ref={scrollViewRef}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Medical Imaging Analysis</Text>
      </View>

      {renderAnalysisTypeSelector()}

      <Card style={styles.imageCard}>
        <Text style={styles.sectionTitle}>Select Medical Image</Text>
        
        {selectedImage ? (
          <View style={styles.selectedImageContainer}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.selectedImage}
            />
            <View style={styles.imageActions}>
              <TouchableOpacity 
                style={styles.imageActionButton}
                onPress={resetAnalysis}
              >
                <FontAwesome5 name="trash" size={16} color={Colors.danger} />
                <Text style={[styles.imageActionText, { color: Colors.danger }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity 
              style={styles.imagePickerButton}
              onPress={pickImage}
            >
              <MaterialCommunityIcons name="image-album" size={30} color={Colors.doctorTheme} />
              <Text style={styles.imagePickerText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.imagePickerButton}
              onPress={takePhoto}
            >
              <MaterialCommunityIcons name="camera" size={30} color={Colors.doctorTheme} />
              <Text style={styles.imagePickerText}>Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>

      {selectedImage && (
        <TouchableOpacity 
          style={[
            styles.analyzeButton,
            loading && styles.disabledButton
          ]}
          onPress={analyzeImage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <FontAwesome5 name="brain" size={16} color="#FFFFFF" />
              <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {analysisResult && (
        <Card style={styles.resultsCard}>
          <View style={styles.resultsHeader}>
            <MaterialCommunityIcons name="brain" size={24} color={Colors.doctorTheme} />
            <Text style={styles.resultsTitle}>Analysis Results</Text>
          </View>
          
          <Text style={styles.analysisTimestamp}>
            {new Date().toLocaleString()}
          </Text>
          
          <View style={styles.resultsType}>
            <Text style={styles.resultsMeta}>
              Analysis Type: <Text style={styles.resultsMetaBold}>{analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}</Text>
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.analysisText}>{analysisResult}</Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome5 name="save" size={16} color={Colors.doctorTheme} />
              <Text style={styles.actionButtonText}>Save to Records</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome5 name="share-alt" size={16} color={Colors.doctorTheme} />
              <Text style={styles.actionButtonText}>Share Analysis</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}
      
      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  analysisTypesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    minWidth: 80,
    ...Colors.Shadows.small,
  },
  selectedTypeButton: {
    backgroundColor: Colors.doctorTheme,
    borderColor: Colors.doctorTheme,
  },
  typeButtonText: {
    color: Colors.doctorTheme,
    fontSize: 12,
    fontFamily: 'roboto-medium',
    marginTop: 5,
  },
  selectedTypeText: {
    color: Colors.white,
  },
  imageCard: {
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 20,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  imagePickerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    color: Colors.doctorTheme,
    fontSize: 14,
    fontFamily: 'roboto-medium',
    marginTop: 10,
  },
  selectedImageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  imageActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'roboto-medium',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.doctorTheme,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    ...Colors.Shadows.default,
  },
  disabledButton: {
    backgroundColor: Colors.gray400,
  },
  analyzeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'roboto-bold',
    marginLeft: 10,
  },
  resultsCard: {
    marginHorizontal: 20,
    padding: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 20,
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  analysisTimestamp: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.textTertiary,
    marginBottom: 10,
  },
  resultsType: {
    marginBottom: 15,
  },
  resultsMeta: {
    fontSize: 14,
    fontFamily: 'roboto-regular',
    color: Colors.textSecondary,
  },
  resultsMetaBold: {
    fontFamily: 'roboto-bold',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 15,
  },
  analysisText: {
    fontSize: 15,
    fontFamily: 'roboto-regular',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: Colors.doctorTheme,
    marginLeft: 8,
  },
  footer: {
    height: 20,
  },
});

export default MedicalImaging;