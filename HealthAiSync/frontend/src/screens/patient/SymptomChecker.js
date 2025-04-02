import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Image,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Theme from '../../constants/theme';
import { analyzeSymptoms, resetDiagnosis } from '../../store/slices/patientSlice';

// Human body SVG component
const BodyMapSVG = () => (
  <View style={styles.bodyMapContainer}>
    <Text style={styles.bodyMapTitle}>Tap on the body to indicate pain areas</Text>
    <svg viewBox="0 0 200 400" width="200" height="350">
      <path
        id="head"
        d="M100,30 C120,30 130,50 130,65 C130,85 115,95 100,95 C85,95 70,85 70,65 C70,50 80,30 100,30"
        stroke="#CCD3E0" 
        strokeWidth="1" 
        fill="#EFF2F9" 
      />
      <path
        id="torso"
        d="M70,95 L70,200 L130,200 L130,95 C115,105 85,105 70,95"
        stroke="#CCD3E0" 
        strokeWidth="1" 
        fill="#EFF2F9" 
      />
      <path
        id="left_arm"
        d="M70,105 L50,105 L30,170 L40,175 L60,120 L70,120"
        stroke="#CCD3E0" 
        strokeWidth="1" 
        fill="#EFF2F9" 
      />
      <path
        id="right_arm"
        d="M130,105 L150,105 L170,170 L160,175 L140,120 L130,120"
        stroke="#CCD3E0" 
        strokeWidth="1" 
        fill="#EFF2F9" 
      />
      <path
        id="left_leg"
        d="M70,200 L70,320 L90,320 L90,200"
        stroke="#CCD3E0" 
        strokeWidth="1" 
        fill="#EFF2F9" 
      />
      <path
        id="right_leg"
        d="M110,200 L110,320 L130,320 L130,200"
        stroke="#CCD3E0" 
        strokeWidth="1" 
        fill="#EFF2F9" 
      />
    </svg>
  </View>
);

// Pain dots for body map
const PainPoint = ({ x, y, onRemove }) => (
  <View style={[styles.painPoint, { left: x - 10, top: y - 10 }]}>
    <TouchableOpacity style={styles.painPointRemove} onPress={onRemove}>
      <Ionicons name="close" size={12} color={Theme.white} />
    </TouchableOpacity>
  </View>
);

const SymptomChecker = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, diagnosisResults } = useSelector(state => state.patient);
  
  const [symptomText, setSymptomText] = useState('');
  const [painPoints, setPainPoints] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [recording, setRecording] = useState(false);
  
  // Animation for results
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (diagnosisResults) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
    
    return () => {
      // Clean up by stopping any ongoing speech
      Speech.stop();
    };
  }, [diagnosisResults]);

  // Handle body map touch
  const handleBodyTouch = (evt) => {
    // Extract touch coordinates
    const { locationX, locationY } = evt.nativeEvent;
    setPainPoints([...painPoints, { id: Date.now(), x: locationX, y: locationY }]);
  };

  const removePainPoint = (id) => {
    setPainPoints(painPoints.filter(point => point.id !== id));
  };

  // Handle symptom selection
  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Common symptoms list
  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 
    'Sore Throat', 'Difficulty Breathing', 'Chest Pain', 
    'Abdominal Pain', 'Back Pain', 'Joint Pain', 'Rash',
    'Dizziness', 'Vomiting', 'Diarrhea'
  ];

  // Handle speech to text
  const startRecording = () => {
    setRecording(true);
    // In a real implementation, this would use speech recognition
    // For now, we'll simulate it after a delay
    setTimeout(() => {
      setSymptomText(prevText => 
        prevText + (prevText ? ' ' : '') + 
        "I've been experiencing a constant headache for 3 days and feeling fatigued."
      );
      setRecording(false);
    }, 2000);
  };

  // Handle diagnosis submission
  const handleSubmitDiagnosis = () => {
    const symptoms = {
      description: symptomText,
      painPoints: painPoints.map(p => ({ x: p.x, y: p.y })),
      selectedSymptoms,
      duration,
      severity
    };
    
    dispatch(analyzeSymptoms(symptoms));
    setCurrentStep(3);
  };

  // Speak diagnosis results
  const speakResults = () => {
    if (diagnosisResults && diagnosisResults.possibleConditions) {
      let speechText = `Based on your symptoms, the most likely conditions are: `;
      diagnosisResults.possibleConditions.slice(0, 3).forEach((condition, index) => {
        speechText += `${condition.name} with ${condition.probability}% probability${index < 2 ? ', ' : '.'}`;
      });
      
      Speech.speak(speechText, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9
      });
    }
  };

  // Reset and start over
  const handleReset = () => {
    dispatch(resetDiagnosis());
    setSymptomText('');
    setPainPoints([]);
    setSelectedSymptoms([]);
    setDuration('');
    setSeverity(0);
    setCurrentStep(1);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepLine}>
        <View style={[styles.stepProgress, { width: `${((currentStep - 1) / 2) * 100}%` }]} />
      </View>
      <View style={styles.stepsContainer}>
        <View style={[styles.step, currentStep >= 1 && styles.activeStep]}>
          <Text style={[styles.stepText, currentStep >= 1 && styles.activeStepText]}>1</Text>
        </View>
        <View style={[styles.step, currentStep >= 2 && styles.activeStep]}>
          <Text style={[styles.stepText, currentStep >= 2 && styles.activeStepText]}>2</Text>
        </View>
        <View style={[styles.step, currentStep >= 3 && styles.activeStep]}>
          <Text style={[styles.stepText, currentStep >= 3 && styles.activeStepText]}>3</Text>
        </View>
      </View>
      <View style={styles.stepsLabelContainer}>
        <Text style={[styles.stepLabel, currentStep === 1 && styles.activeStepLabel]}>Describe Symptoms</Text>
        <Text style={[styles.stepLabel, currentStep === 2 && styles.activeStepLabel]}>Additional Details</Text>
        <Text style={[styles.stepLabel, currentStep === 3 && styles.activeStepLabel]}>Results</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Describe Your Symptoms</Text>
      <Text style={styles.stepSubtitle}>Please provide detailed information about what you're experiencing</Text>
      
      <Card style={styles.inputCard} elevation="small">
        <Text style={styles.inputLabel}>What symptoms are you experiencing?</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Describe your symptoms in detail..."
            value={symptomText}
            onChangeText={setSymptomText}
          />
          <TouchableOpacity 
            style={styles.micButton}
            onPress={startRecording}
            disabled={recording}
          >
            <Ionicons 
              name={recording ? "radio" : "mic-outline"} 
              size={22} 
              color={recording ? Theme.danger : Theme.patientTheme} 
            />
          </TouchableOpacity>
        </View>
        {recording && (
          <Text style={styles.recordingText}>Recording... Please speak clearly</Text>
        )}
      </Card>
      
      <Card style={styles.symptomsCard} elevation="small">
        <Text style={styles.inputLabel}>Common Symptoms</Text>
        <Text style={styles.helperText}>Select all that apply:</Text>
        
        <View style={styles.symptomsGrid}>
          {commonSymptoms.map((symptom, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.symptomTag,
                selectedSymptoms.includes(symptom) && styles.selectedSymptomTag
              ]}
              onPress={() => toggleSymptom(symptom)}
            >
              <Text style={[
                styles.symptomTagText,
                selectedSymptoms.includes(symptom) && styles.selectedSymptomTagText
              ]}>
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
      
      <Card style={styles.bodyMapCard} elevation="small">
        <Text style={styles.inputLabel}>Mark Areas of Pain or Discomfort</Text>
        
        <TouchableOpacity 
          style={styles.bodyMapTouchable}
          onPress={handleBodyTouch}
        >
          <BodyMapSVG />
          {painPoints.map(point => (
            <PainPoint 
              key={point.id} 
              x={point.x} 
              y={point.y}
              onRemove={() => removePainPoint(point.id)}
            />
          ))}
        </TouchableOpacity>
      </Card>
      
      <View style={styles.buttonsContainer}>
        <Button
          title="Next"
          type="patientTheme"
          size="large"
          fullWidth
          onPress={() => setCurrentStep(2)}
          disabled={!symptomText.trim() && selectedSymptoms.length === 0 && painPoints.length === 0}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Additional Details</Text>
      <Text style={styles.stepSubtitle}>Help us understand your symptoms better</Text>
      
      <Card style={styles.inputCard} elevation="small">
        <Text style={styles.inputLabel}>How long have you been experiencing these symptoms?</Text>
        <View style={styles.radioButtonsContainer}>
          <TouchableOpacity 
            style={[styles.radioButton, duration === 'Less than 24 hours' && styles.selectedRadioButton]}
            onPress={() => setDuration('Less than 24 hours')}
          >
            <View style={styles.radioOuterCircle}>
              {duration === 'Less than 24 hours' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={styles.radioText}>Less than 24 hours</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.radioButton, duration === '1-3 days' && styles.selectedRadioButton]}
            onPress={() => setDuration('1-3 days')}
          >
            <View style={styles.radioOuterCircle}>
              {duration === '1-3 days' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={styles.radioText}>1-3 days</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.radioButton, duration === '4-7 days' && styles.selectedRadioButton]}
            onPress={() => setDuration('4-7 days')}
          >
            <View style={styles.radioOuterCircle}>
              {duration === '4-7 days' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={styles.radioText}>4-7 days</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.radioButton, duration === 'More than a week' && styles.selectedRadioButton]}
            onPress={() => setDuration('More than a week')}
          >
            <View style={styles.radioOuterCircle}>
              {duration === 'More than a week' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={styles.radioText}>More than a week</Text>
          </TouchableOpacity>
        </View>
      </Card>
      
      <Card style={styles.inputCard} elevation="small">
        <Text style={styles.inputLabel}>Rate the severity of your symptoms</Text>
        <Text style={styles.severityValue}>{severity}/10</Text>
        
        <View style={styles.sliderContainer}>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 0 && styles.activeSliderMark]}
            onPress={() => setSeverity(0)}
          >
            <Text style={[styles.sliderMarkText, severity === 0 && styles.activeSliderMarkText]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 1 && styles.activeSliderMark]}
            onPress={() => setSeverity(1)}
          >
            <Text style={[styles.sliderMarkText, severity === 1 && styles.activeSliderMarkText]}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 2 && styles.activeSliderMark]}
            onPress={() => setSeverity(2)}
          >
            <Text style={[styles.sliderMarkText, severity === 2 && styles.activeSliderMarkText]}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 3 && styles.activeSliderMark]}
            onPress={() => setSeverity(3)}
          >
            <Text style={[styles.sliderMarkText, severity === 3 && styles.activeSliderMarkText]}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 4 && styles.activeSliderMark]}
            onPress={() => setSeverity(4)}
          >
            <Text style={[styles.sliderMarkText, severity === 4 && styles.activeSliderMarkText]}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 5 && styles.activeSliderMark]}
            onPress={() => setSeverity(5)}
          >
            <Text style={[styles.sliderMarkText, severity === 5 && styles.activeSliderMarkText]}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 6 && styles.activeSliderMark]}
            onPress={() => setSeverity(6)}
          >
            <Text style={[styles.sliderMarkText, severity === 6 && styles.activeSliderMarkText]}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 7 && styles.activeSliderMark]}
            onPress={() => setSeverity(7)}
          >
            <Text style={[styles.sliderMarkText, severity === 7 && styles.activeSliderMarkText]}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 8 && styles.activeSliderMark]}
            onPress={() => setSeverity(8)}
          >
            <Text style={[styles.sliderMarkText, severity === 8 && styles.activeSliderMarkText]}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 9 && styles.activeSliderMark]}
            onPress={() => setSeverity(9)}
          >
            <Text style={[styles.sliderMarkText, severity === 9 && styles.activeSliderMarkText]}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sliderMark, severity === 10 && styles.activeSliderMark]}
            onPress={() => setSeverity(10)}
          >
            <Text style={[styles.sliderMarkText, severity === 10 && styles.activeSliderMarkText]}>10</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.severityLabels}>
          <Text style={styles.severityLabelText}>Mild</Text>
          <Text style={styles.severityLabelText}>Moderate</Text>
          <Text style={styles.severityLabelText}>Severe</Text>
        </View>
      </Card>
      
      <View style={styles.buttonsContainer}>
        <Button
          title="Back"
          type="secondary"
          size="large"
          outlined
          style={styles.backButton}
          onPress={() => setCurrentStep(1)}
        />
        <Button
          title="Analyze Symptoms"
          type="patientTheme"
          size="large"
          style={styles.nextButton}
          onPress={handleSubmitDiagnosis}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>AI Analysis Results</Text>
      <Text style={styles.stepSubtitle}>Based on the information you provided</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.patientTheme} />
          <Text style={styles.loadingText}>Analyzing your symptoms...</Text>
          <Text style={styles.loadingSubtext}>Our AI is processing your data</Text>
        </View>
      ) : diagnosisResults ? (
        <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
          <Card style={styles.diagnosisCard} elevation="medium" type="patient">
            <View style={styles.diagnosisHeaderRow}>
              <Text style={styles.diagnosisTitle}>Possible Conditions</Text>
              <TouchableOpacity style={styles.speakButton} onPress={speakResults}>
                <Ionicons name="volume-high" size={22} color={Theme.patientTheme} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.diagnosisDisclaimer}>
              Note: This is not a medical diagnosis. Please consult a healthcare professional.
            </Text>
            
            {diagnosisResults.possibleConditions.map((condition, index) => (
              <View key={index} style={styles.conditionRow}>
                <View style={styles.conditionInfo}>
                  <Text style={styles.conditionName}>{condition.name}</Text>
                  <Text style={styles.conditionDescription}>{condition.description}</Text>
                </View>
                <View style={styles.probabilityContainer}>
                  <Text style={[
                    styles.probabilityText,
                    condition.probability > 70 ? styles.highProbability :
                    condition.probability > 40 ? styles.mediumProbability :
                    styles.lowProbability
                  ]}>
                    {condition.probability}%
                  </Text>
                  <View style={styles.probabilityBar}>
                    <View 
                      style={[
                        styles.probabilityFill,
                        { width: `${condition.probability}%` },
                        condition.probability > 70 ? styles.highProbabilityFill :
                        condition.probability > 40 ? styles.mediumProbabilityFill :
                        styles.lowProbabilityFill
                      ]} 
                    />
                  </View>
                </View>
              </View>
            ))}
          </Card>
          
          <Card style={styles.recommendationsCard} elevation="medium">
            <Text style={styles.recommendationsTitle}>Recommendations</Text>
            
            <View style={styles.recommendationItem}>
              <View style={styles.recommendationIcon}>
                <Ionicons name="medkit" size={20} color={Theme.white} />
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationText}>
                  {diagnosisResults.recommendations.professional}
                </Text>
              </View>
            </View>
            
            <View style={styles.recommendationItem}>
              <View style={[styles.recommendationIcon, { backgroundColor: Theme.success }]}>
                <Ionicons name="fitness" size={20} color={Theme.white} />
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationText}>
                  {diagnosisResults.recommendations.selfCare}
                </Text>
              </View>
            </View>
            
            <View style={styles.recommendationItem}>
              <View style={[styles.recommendationIcon, { backgroundColor: Theme.warning }]}>
                <Ionicons name="alert-circle" size={20} color={Theme.white} />
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationText}>
                  {diagnosisResults.recommendations.urgency}
                </Text>
              </View>
            </View>
          </Card>
          
          <View style={styles.actionsContainer}>
            <Button
              title="Book Doctor Appointment"
              type="patientTheme"
              size="medium"
              icon={{ 
                component: Ionicons,
                name: "calendar",
                props: { size: 18 }
              }}
              style={styles.actionButton}
            />
            <Button
              title="Share with Doctor"
              type="secondary"
              outlined
              size="medium"
              icon={{ 
                component: Ionicons,
                name: "share-outline",
                props: { size: 18 }
              }}
              style={styles.actionButton}
            />
          </View>
          
          <Button
            title="Start New Symptom Check"
            type="success"
            size="medium"
            fullWidth
            icon={{ 
              component: Ionicons,
              name: "refresh",
              props: { size: 18 }
            }}
            style={styles.resetButton}
            onPress={handleReset}
          />
        </Animated.View>
      ) : (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Theme.danger} />
          <Text style={styles.errorText}>Failed to analyze symptoms</Text>
          <Text style={styles.errorSubtext}>Please try again or contact support</Text>
          <Button
            title="Try Again"
            type="patientTheme"
            size="medium"
            onPress={handleSubmitDiagnosis}
            style={styles.tryAgainButton}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Symptom Checker</Text>
      </View>
      
      {renderStepIndicator()}
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  header: {
    paddingHorizontal: Theme.Spacing.large,
    paddingVertical: Theme.Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
    backgroundColor: Theme.white,
  },
  headerTitle: {
    ...Theme.Typography.h3,
    color: Theme.patientTheme,
  },
  scrollContent: {
    padding: Theme.Spacing.medium,
    paddingBottom: Theme.Spacing.xxl,
  },
  
  // Step Indicator
  stepIndicator: {
    padding: Theme.Spacing.medium,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
  },
  stepLine: {
    height: 4,
    backgroundColor: Theme.gray300,
    borderRadius: 2,
    marginBottom: Theme.Spacing.small,
  },
  stepProgress: {
    height: '100%',
    backgroundColor: Theme.patientTheme,
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.small,
  },
  step: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.white,
    borderWidth: 2,
    borderColor: Theme.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    backgroundColor: Theme.patientTheme,
    borderColor: Theme.patientTheme,
  },
  stepText: {
    fontSize: 12,
    fontFamily: 'roboto-medium',
    color: Theme.gray500,
  },
  activeStepText: {
    color: Theme.white,
  },
  stepsLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: 12,
    color: Theme.gray500,
    maxWidth: '30%',
    textAlign: 'center',
  },
  activeStepLabel: {
    color: Theme.patientTheme,
    fontFamily: 'roboto-medium',
  },
  
  // Step Content
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    ...Theme.Typography.h3,
    marginBottom: Theme.Spacing.small,
  },
  stepSubtitle: {
    ...Theme.Typography.body,
    color: Theme.textSecondary,
    marginBottom: Theme.Spacing.large,
  },
  
  // Input Card
  inputCard: {
    marginBottom: Theme.Spacing.medium,
    padding: Theme.Spacing.medium,
  },
  inputLabel: {
    ...Theme.Typography.subtitle,
    marginBottom: Theme.Spacing.small,
  },
  helperText: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
    marginBottom: Theme.Spacing.small,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    backgroundColor: Theme.white,
  },
  textInput: {
    flex: 1,
    minHeight: 100,
    padding: Theme.Spacing.medium,
    fontFamily: 'roboto-regular',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  micButton: {
    padding: Theme.Spacing.medium,
  },
  recordingText: {
    ...Theme.Typography.bodySmall,
    color: Theme.danger,
    marginTop: Theme.Spacing.small,
    textAlign: 'center',
  },
  
  // Symptoms Grid
  symptomsCard: {
    marginBottom: Theme.Spacing.medium,
    padding: Theme.Spacing.medium,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  symptomTag: {
    backgroundColor: Theme.white,
    borderWidth: 1,
    borderColor: Theme.inputBorder,
    borderRadius: Theme.BorderRadius.default,
    paddingHorizontal: Theme.Spacing.medium,
    paddingVertical: Theme.Spacing.small,
    margin: Theme.Spacing.xs,
  },
  selectedSymptomTag: {
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    borderColor: Theme.patientTheme,
  },
  symptomTagText: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  selectedSymptomTagText: {
    color: Theme.patientTheme,
    fontFamily: 'roboto-medium',
  },
  
  // Body Map
  bodyMapCard: {
    marginBottom: Theme.Spacing.large,
    padding: Theme.Spacing.medium,
  },
  bodyMapContainer: {
    alignItems: 'center',
  },
  bodyMapTitle: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
    marginBottom: Theme.Spacing.medium,
  },
  bodyMapTouchable: {
    position: 'relative',
  },
  painPoint: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Theme.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  painPointRemove: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Duration Radio Buttons
  radioButtonsContainer: {
    marginVertical: Theme.Spacing.small,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.medium,
  },
  selectedRadioButton: {
    // Additional styling if needed
  },
  radioOuterCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Theme.patientTheme,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.Spacing.medium,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.patientTheme,
  },
  radioText: {
    ...Theme.Typography.body,
  },
  
  // Severity Slider
  severityValue: {
    ...Theme.Typography.h2,
    color: Theme.patientTheme,
    textAlign: 'center',
    marginVertical: Theme.Spacing.medium,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.small,
  },
  sliderMark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Theme.white,
    borderWidth: 1,
    borderColor: Theme.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSliderMark: {
    backgroundColor: Theme.patientTheme,
    borderColor: Theme.patientTheme,
  },
  sliderMarkText: {
    fontSize: 12,
    color: Theme.gray600,
  },
  activeSliderMarkText: {
    color: Theme.white,
  },
  severityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.Spacing.medium,
  },
  severityLabelText: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  
  // Buttons
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.Spacing.medium,
    marginBottom: Theme.Spacing.xl,
  },
  backButton: {
    flex: 1,
    marginRight: Theme.Spacing.small,
  },
  nextButton: {
    flex: 2,
    marginLeft: Theme.Spacing.small,
  },
  
  // Loading State
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.Spacing.xxl,
  },
  loadingText: {
    ...Theme.Typography.h4,
    color: Theme.patientTheme,
    marginTop: Theme.Spacing.large,
    marginBottom: Theme.Spacing.small,
  },
  loadingSubtext: {
    ...Theme.Typography.body,
    color: Theme.textSecondary,
  },
  
  // Results
  resultsContainer: {
    // Container for animated results
  },
  diagnosisCard: {
    marginBottom: Theme.Spacing.medium,
    padding: Theme.Spacing.medium,
  },
  diagnosisHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.small,
  },
  diagnosisTitle: {
    ...Theme.Typography.h4,
  },
  speakButton: {
    padding: Theme.Spacing.small,
  },
  diagnosisDisclaimer: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
    fontStyle: 'italic',
    marginBottom: Theme.Spacing.medium,
  },
  conditionRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Theme.divider,
    paddingVertical: Theme.Spacing.medium,
  },
  conditionInfo: {
    flex: 2,
    paddingRight: Theme.Spacing.medium,
  },
  conditionName: {
    ...Theme.Typography.subtitle,
    marginBottom: Theme.Spacing.xs,
  },
  conditionDescription: {
    ...Theme.Typography.bodySmall,
    color: Theme.textSecondary,
  },
  probabilityContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  probabilityText: {
    ...Theme.Typography.h4,
    marginBottom: Theme.Spacing.xs,
  },
  highProbability: {
    color: Theme.danger,
  },
  mediumProbability: {
    color: Theme.warning,
  },
  lowProbability: {
    color: Theme.success,
  },
  probabilityBar: {
    width: '100%',
    height: 6,
    backgroundColor: Theme.gray200,
    borderRadius: 3,
  },
  probabilityFill: {
    height: '100%',
    borderRadius: 3,
  },
  highProbabilityFill: {
    backgroundColor: Theme.danger,
  },
  mediumProbabilityFill: {
    backgroundColor: Theme.warning,
  },
  lowProbabilityFill: {
    backgroundColor: Theme.success,
  },
  
  // Recommendations
  recommendationsCard: {
    marginBottom: Theme.Spacing.large,
    padding: Theme.Spacing.medium,
  },
  recommendationsTitle: {
    ...Theme.Typography.h4,
    marginBottom: Theme.Spacing.medium,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: Theme.Spacing.medium,
  },
  recommendationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.patientTheme,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.Spacing.medium,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationText: {
    ...Theme.Typography.body,
  },
  
  // Actions
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.medium,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Theme.Spacing.xs,
  },
  resetButton: {
    marginTop: Theme.Spacing.small,
  },
  
  // Error State
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.Spacing.xxl,
  },
  errorText: {
    ...Theme.Typography.h4,
    color: Theme.danger,
    marginTop: Theme.Spacing.medium,
    marginBottom: Theme.Spacing.small,
  },
  errorSubtext: {
    ...Theme.Typography.body,
    color: Theme.textSecondary,
    marginBottom: Theme.Spacing.large,
  },
  tryAgainButton: {
    minWidth: 150,
  },
});

export default SymptomChecker;
