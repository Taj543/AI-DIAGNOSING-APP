import { API_BASE_URL } from '../config/env';

// NOTE: Most medical text analysis features have been migrated to bioGptService.js
// This service now primarily handles image analysis features that require OpenAI

/**
 * Analyzes a medical image using OpenAI Vision
 * @param {string} base64Image - Base64 encoded image data
 * @param {string} prompt - The prompt for image analysis
 * @returns {Promise<string>} The analysis response
 */
export const analyzeMedicalImage = async (base64Image, prompt = "Analyze this medical image and describe what you observe.") => {
  try {
    const response = await fetch(`${API_BASE_URL}/openai/analyze-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        prompt,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to analyze medical image');
    }
    
    return data.response;
  } catch (error) {
    console.error('Error analyzing medical image:', error);
    throw error;
  }
};

// Note: These functions have been migrated to bioGptService.js
// The implementations are kept here for reference but should not be used

/**
 * Check if OpenAI API is configured and operational
 * @returns {Promise<boolean>} true if operational, false otherwise
 */
export const checkOpenAIStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/openai/status`);
    const data = await response.json();
    
    return data.status === 'operational';
  } catch (error) {
    console.error('Error checking OpenAI status:', error);
    return false;
  }
};