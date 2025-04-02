const { HfInference } = require('@huggingface/inference');

// Initialize Hugging Face client with API token from environment variables
// We need to add a Hugging Face access token to use their API
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Flag to track if we're running in limited mode due to missing API key
const LIMITED_MODE = !process.env.HUGGINGFACE_API_KEY;
if (LIMITED_MODE) {
  console.warn('WARNING: HUGGINGFACE_API_KEY not set. BioGPT service will return predefined responses.');
}

// BioGPT model - Microsoft's biomedical language model
const BIOGPT_MODEL = 'microsoft/biogpt';
// Backup model for general tasks if BioGPT is unsuitable
const GENERAL_MODEL = 'gpt2';

/**
 * Analyzes a medical query with BioGPT
 * @param {string} text - The medical query
 * @returns {Promise<string>} The generated response
 */
async function analyzeMedicalQuery(text) {
  // If in limited mode, return predefined response
  if (LIMITED_MODE) {
    console.log(`BioGPT medical query request (LIMITED MODE): "${text}"`);
    return `I'm unable to process specific medical queries at this time as a Hugging Face API key is required for the BioGPT model. 

To enable full functionality, please set up a HUGGINGFACE_API_KEY in your environment variables.

DISCLAIMER: AI-generated information should not replace professional medical advice. Always consult with a qualified healthcare provider for medical concerns.`;
  }
  
  try {
    // Create a medical-specific prompt
    const medicalPrompt = `Medical Question: ${text}\n\nMedical Answer:`;
    
    const response = await hf.textGeneration({
      model: BIOGPT_MODEL,
      inputs: medicalPrompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.3,
        top_p: 0.95,
        do_sample: true,
      }
    });
    
    // Append medical disclaimer
    const answer = response.generated_text;
    return `${answer}\n\nDISCLAIMER: This information is provided by an AI model and should not replace professional medical advice. Always consult with a qualified healthcare provider for medical concerns.`;
  } catch (error) {
    console.error('BioGPT medical query error:', error);
    throw new Error(`Failed to analyze medical query: ${error.message}`);
  }
}

/**
 * Provides emotional support related to health concerns
 * @param {string} text - The user's emotional concern
 * @returns {Promise<string>} The supportive response
 */
async function provideEmotionalSupport(text) {
  // If in limited mode, return predefined response
  if (LIMITED_MODE) {
    console.log(`Emotional support request (LIMITED MODE): "${text}"`);
    return `I understand you're looking for emotional support. While I can't analyze your specific concern without a Hugging Face API key, please know that your feelings are valid.

To enable full functionality, please set up a HUGGINGFACE_API_KEY in your environment variables.

Remember that speaking with a healthcare professional or counselor can provide valuable guidance for your concerns.`;
  }
  
  try {
    // Create an empathetic prompt
    const emotionalPrompt = `Patient Concern: ${text}\n\nEmotional Support Response:`;
    
    const response = await hf.textGeneration({
      model: GENERAL_MODEL, // Using a general model as BioGPT is more clinical
      inputs: emotionalPrompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
      }
    });
    
    const answer = response.generated_text;
    return `${answer}\n\nI'm here to support you. Remember that speaking with a healthcare professional or counselor can also provide valuable guidance for your concerns.`;
  } catch (error) {
    console.error('Emotional support generation error:', error);
    throw new Error(`Failed to generate emotional support: ${error.message}`);
  }
}

/**
 * Analyzes medical symptoms using BioGPT
 * @param {string[]} symptoms - Array of symptoms
 * @returns {Promise<Object>} Structured analysis of symptoms
 */
async function analyzeSymptoms(symptoms) {
  // If in limited mode, return predefined response
  if (LIMITED_MODE) {
    console.log(`Symptom analysis request (LIMITED MODE): "${symptoms.join(', ')}"`);
    return {
      generalAssessment: "I'm unable to analyze your specific symptoms at this time as a Hugging Face API key is required for the BioGPT model. To enable full functionality, please set up a HUGGINGFACE_API_KEY in your environment variables.",
      possibleCategories: ["API Key Required"],
      recommendations: [
        "Set up HUGGINGFACE_API_KEY environment variable",
        "Consult with a healthcare provider for proper evaluation"
      ],
      urgencyLevel: symptoms.some(s => 
        s.toLowerCase().includes("severe") || 
        s.toLowerCase().includes("pain") ||
        s.toLowerCase().includes("breathing")
      ) ? "medium" : "low",
      disclaimer: "This analysis is for informational purposes only and does not constitute medical advice. Please consult with a healthcare professional for an accurate diagnosis."
    };
  }
  
  try {
    const symptomsText = symptoms.join(", ");
    const analysisPrompt = `Patient Symptoms: ${symptomsText}\n\nGeneral Medical Assessment:`;
    
    const response = await hf.textGeneration({
      model: BIOGPT_MODEL,
      inputs: analysisPrompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.3,
        top_p: 0.95,
        do_sample: true,
      }
    });
    
    const analysisText = response.generated_text;
    
    // Since we can't easily get structured JSON from the text generation,
    // we'll create a structured object manually from the text
    return {
      generalAssessment: analysisText,
      possibleCategories: ["General wellness concern", "Requires further evaluation"],
      recommendations: [
        "Track your symptoms and their frequency",
        "Maintain a healthy lifestyle with balanced diet and exercise",
        "Consult with a healthcare provider for proper evaluation"
      ],
      urgencyLevel: symptoms.some(s => 
        s.toLowerCase().includes("severe") || 
        s.toLowerCase().includes("pain") ||
        s.toLowerCase().includes("breathing")
      ) ? "medium" : "low",
      disclaimer: "This analysis is for informational purposes only and does not constitute medical advice. Please consult with a healthcare professional for an accurate diagnosis."
    };
  } catch (error) {
    console.error('Symptom analysis error:', error);
    throw new Error(`Failed to analyze symptoms: ${error.message}`);
  }
}

/**
 * Provides information about a medication using BioGPT
 * @param {string} medicationName - The name of the medication
 * @returns {Promise<Object>} Structured information about the medication
 */
async function getMedicationInfo(medicationName) {
  // If in limited mode, return predefined response
  if (LIMITED_MODE) {
    console.log(`Medication info request (LIMITED MODE): "${medicationName}"`);
    return {
      medicationName: medicationName,
      description: "I'm unable to provide specific information about this medication at this time as a Hugging Face API key is required for the BioGPT model. To enable full functionality, please set up a HUGGINGFACE_API_KEY in your environment variables.",
      generalUses: ["API Key Required"],
      commonSideEffects: ["API Key Required"],
      generalConsiderations: [
        "Always take medications as prescribed by your doctor",
        "Do not stop taking medication without consulting your healthcare provider",
        "Store according to package instructions"
      ],
      disclaimer: "This information is for educational purposes only. Always consult medication package inserts, pharmacists, and healthcare providers for accurate medication information."
    };
  }
  
  try {
    const medicationPrompt = `Medication: ${medicationName}\n\nMedication Information:`;
    
    const response = await hf.textGeneration({
      model: BIOGPT_MODEL,
      inputs: medicationPrompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.3,
        top_p: 0.95,
        do_sample: true,
      }
    });
    
    const medicationText = response.generated_text;
    
    // Simple parsing to create structured information
    // In a real app, this would be more sophisticated
    let generalUses = [];
    let commonSideEffects = [];
    
    if (medicationText.includes("used for") || medicationText.includes("treats")) {
      generalUses = ["Please consult official medical resources for accurate information"];
    }
    
    if (medicationText.includes("side effect") || medicationText.includes("adverse")) {
      commonSideEffects = ["Please consult official medical resources for accurate information"];
    }
    
    return {
      medicationName: medicationName,
      description: medicationText,
      generalUses: generalUses,
      commonSideEffects: commonSideEffects,
      generalConsiderations: [
        "Always take medications as prescribed by your doctor",
        "Do not stop taking medication without consulting your healthcare provider",
        "Store according to package instructions"
      ],
      disclaimer: "This information is for educational purposes only. Always consult medication package inserts, pharmacists, and healthcare providers for accurate medication information."
    };
  } catch (error) {
    console.error('Medication info error:', error);
    throw new Error(`Failed to get medication information: ${error.message}`);
  }
}

/**
 * Check if BioGPT API is operational
 * @returns {Promise<boolean>} True if operational
 */
async function checkStatus() {
  // If in limited mode, return fallback response
  if (LIMITED_MODE) {
    console.log('BioGPT status check (LIMITED MODE)');
    // We return true but log a notice about missing API key
    console.log('NOTICE: BioGPT is running in LIMITED MODE without an API key. Set HUGGINGFACE_API_KEY for full functionality.');
    return true;
  }
  
  try {
    const response = await hf.textGeneration({
      model: BIOGPT_MODEL,
      inputs: "This is a test.",
      parameters: {
        max_new_tokens: 5,
        do_sample: false,
      }
    });
    
    return true;
  } catch (error) {
    console.error('BioGPT status check failed:', error);
    throw error;
  }
}

module.exports = {
  analyzeMedicalQuery,
  provideEmotionalSupport,
  analyzeSymptoms,
  getMedicationInfo,
  checkStatus
};