import { API_BASE_URL } from '../config/env';

/**
 * Analyzes a medical query using BioGPT
 * @param {string} text - The medical query or question
 * @returns {Promise<string>} The AI response
 */
export const analyzeMedicalQuery = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/biogpt/medical-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to analyze medical query');
    }
    
    return data.response;
  } catch (error) {
    console.error('Error analyzing medical query:', error);
    throw error;
  }
};

/**
 * Provides emotional support using BioGPT
 * @param {string} text - The user's text expressing concerns or feelings
 * @returns {Promise<string>} The supportive response
 */
export const provideEmotionalSupport = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/biogpt/emotional-support`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get emotional support response');
    }
    
    return data.response;
  } catch (error) {
    console.error('Error getting emotional support:', error);
    throw error;
  }
};

/**
 * Checks symptoms using BioGPT's analysis
 * @param {string[]} symptoms - Array of symptoms to analyze
 * @returns {Promise<Object>} The symptoms analysis
 */
export const checkSymptoms = async (symptoms) => {
  try {
    const response = await fetch(`${API_BASE_URL}/biogpt/check-symptoms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to analyze symptoms');
    }
    
    return data.analysis;
  } catch (error) {
    console.error('Error checking symptoms:', error);
    throw error;
  }
};

/**
 * Gets medication information using BioGPT
 * @param {string} medicationName - The name of the medication
 * @returns {Promise<Object>} The medication information
 */
export const getMedicationInfo = async (medicationName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/biogpt/medication-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ medicationName }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get medication information');
    }
    
    return data.information;
  } catch (error) {
    console.error('Error getting medication info:', error);
    throw error;
  }
};

/**
 * Check if BioGPT API is configured and operational
 * @returns {Promise<boolean>} true if operational, false otherwise
 */
export const checkBioGptStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/biogpt/status`);
    const data = await response.json();
    
    return data.status === 'operational';
  } catch (error) {
    console.error('Error checking BioGPT status:', error);
    return false;
  }
};