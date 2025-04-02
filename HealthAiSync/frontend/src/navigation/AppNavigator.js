import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

// Import theme
import { COLORS, FONTS, SIZES } from '../constants/theme';

// Import auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DoctorVerificationScreen from '../screens/auth/DoctorVerificationScreen';

// Import patient screens
import PatientDashboard from '../screens/patient/PatientDashboard';
import HealthRecords from '../screens/patient/HealthRecords';
import MedicationManager from '../screens/patient/MedicationManager';
import SymptomChecker from '../screens/patient/SymptomChecker';
import AIChat from '../screens/patient/AIChat';

// Import doctor screens
import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import PatientList from '../screens/doctor/PatientList';
import Telemedicine from '../screens/doctor/Telemedicine';
import MedicalImaging from '../screens/doctor/MedicalImaging';

// Import caretaker screens
import CaretakerDashboard from '../screens/caretaker/CaretakerDashboard';
import PatientMonitoring from '../screens/caretaker/PatientMonitoring';
import MedicationSchedule from '../screens/caretaker/MedicationSchedule';

// Create stack and tab navigators
const Stack = createStackNavigator();
const PatientTab = createBottomTabNavigator();
const DoctorTab = createBottomTabNavigator();
const CaretakerTab = createBottomTabNavigator();

// Custom tab bar label component
const TabLabel = ({ label, focused }) => (
  <Text
    style={{
      fontSize: SIZES.sm,
      fontFamily: focused ? FONTS.medium : FONTS.regular,
      color: focused ? COLORS.primary : COLORS.gray,
      marginBottom: 4,
    }}
  >
    {label}
  </Text>
);

// Patient Tab Navigator
const PatientTabNavigator = () => {
  return (
    <PatientTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <PatientTab.Screen
        name="PatientDashboard"
        component={PatientDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-home" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Dashboard" focused={focused} />
          ),
        }}
      />
      <PatientTab.Screen
        name="HealthRecords"
        component={HealthRecords}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="file-text-o" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Records" focused={focused} />
          ),
        }}
      />
      <PatientTab.Screen
        name="MedicationManager"
        component={MedicationManager}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="medication" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Medication" focused={focused} />
          ),
        }}
      />
      <PatientTab.Screen
        name="SymptomChecker"
        component={SymptomChecker}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="stethoscope" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Symptoms" focused={focused} />
          ),
        }}
      />
      <PatientTab.Screen
        name="AIChat"
        component={AIChat}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="AI Chat" focused={focused} />
          ),
        }}
      />
    </PatientTab.Navigator>
  );
};

// Doctor Tab Navigator
const DoctorTabNavigator = () => {
  return (
    <DoctorTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <DoctorTab.Screen
        name="DoctorDashboard"
        component={DoctorDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-home" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Dashboard" focused={focused} />
          ),
        }}
      />
      <DoctorTab.Screen
        name="PatientList"
        component={PatientList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Patients" focused={focused} />
          ),
        }}
      />
      <DoctorTab.Screen
        name="Telemedicine"
        component={Telemedicine}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="videocam" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Telehealth" focused={focused} />
          ),
        }}
      />
      <DoctorTab.Screen
        name="MedicalImaging"
        component={MedicalImaging}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="image-search" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Imaging" focused={focused} />
          ),
        }}
      />
    </DoctorTab.Navigator>
  );
};

// Caretaker Tab Navigator
const CaretakerTabNavigator = () => {
  return (
    <CaretakerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <CaretakerTab.Screen
        name="CaretakerDashboard"
        component={CaretakerDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-home" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Dashboard" focused={focused} />
          ),
        }}
      />
      <CaretakerTab.Screen
        name="PatientMonitoring"
        component={PatientMonitoring}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Monitoring" focused={focused} />
          ),
        }}
      />
      <CaretakerTab.Screen
        name="MedicationSchedule"
        component={MedicationSchedule}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="schedule" size={size} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Medications" focused={focused} />
          ),
        }}
      />
    </CaretakerTab.Navigator>
  );
};

// Main Navigation Container
const AppNavigator = () => {
  // Get authentication state from Redux
  const { isAuthenticated, userType } = useSelector((state) => state.auth);

  // Global header styling options
  const screenOptions = {
    headerStyle: {
      backgroundColor: COLORS.primary,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: COLORS.white,
    headerTitleStyle: {
      fontFamily: FONTS.medium,
      fontSize: FONTS.h4,
    },
    headerBackTitleVisible: false,
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isAuthenticated ? (
        // Auth Flow
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Create Account' }}
          />
          <Stack.Screen 
            name="DoctorVerification" 
            component={DoctorVerificationScreen} 
            options={{ title: 'Doctor Verification' }}
          />
        </>
      ) : (
        // User type specific flows
        <>
          {userType === 'patient' && (
            <Stack.Screen
              name="PatientTab"
              component={PatientTabNavigator}
              options={{ headerShown: false }}
            />
          )}
          
          {userType === 'doctor' && (
            <Stack.Screen
              name="DoctorTab"
              component={DoctorTabNavigator}
              options={{ headerShown: false }}
            />
          )}
          
          {userType === 'caretaker' && (
            <Stack.Screen
              name="CaretakerTab"
              component={CaretakerTabNavigator}
              options={{ headerShown: false }}
            />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: SIZES.tabBarHeight,
    backgroundColor: COLORS.white,
    paddingBottom: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default AppNavigator;