import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, FONTS } from './src/constants/theme';
import { checkOpenAIStatus } from './src/services/openaiService';
import { validateEnv } from './src/config/env';
import store from './src/store';

// Screens
import AIChat from './src/screens/patient/AIChat';

// For development purposes, just showing the AIChat screen
const Stack = createStackNavigator();

// Main App component
export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialization
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Validate environment variables 
        const envValid = validateEnv();
        if (!envValid) {
          console.warn('Environment validation failed - some features may be limited');
        }
        
        // Check if OpenAI API is configured
        const apiStatus = await checkOpenAIStatus();
        setIsApiReady(apiStatus);
        
        if (!apiStatus) {
          console.warn('OpenAI API is not configured or not accessible. AI features will be limited.');
          // Don't set error, as the app can still function with limited AI features
        }
        
        // Simulate loading delay for demonstration purposes
        setTimeout(() => {
          setIsReady(true);
        }, 1000);
      } catch (err) {
        console.error('App initialization error:', err);
        setError('Failed to initialize the app. Please check your connection and try again.');
      }
    };

    initializeApp();
  }, []);

  // Show loading screen while initializing
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Initializing HealthAI...</Text>
      </View>
    );
  }

  // Show error screen if initialization failed
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
          
          {!isApiReady && (
            <View style={styles.apiWarning}>
              <Text style={styles.apiWarningText}>
                AI features are limited due to API connectivity issues
              </Text>
            </View>
          )}
          
          <Stack.Navigator 
            initialRouteName="AIChat"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="AIChat" component={AIChat} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
  },
  loadingText: {
    marginTop: 20,
    fontFamily: FONTS.medium,
    fontSize: FONTS.body2,
    color: COLORS.textDark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: 20,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body2,
    color: COLORS.error,
    textAlign: 'center',
  },
  apiWarning: {
    backgroundColor: COLORS.warning,
    padding: 10,
    alignItems: 'center',
  },
  apiWarningText: {
    color: COLORS.textDark,
    fontFamily: FONTS.medium,
    fontSize: FONTS.body3,
  },
});