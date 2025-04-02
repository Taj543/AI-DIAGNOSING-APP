// Health Reducer - Manages health records and symptoms
import { checkSymptoms } from '../../services/bioGptService';

// Action Types
export const ADD_HEALTH_RECORD = 'ADD_HEALTH_RECORD';
export const UPDATE_HEALTH_RECORD = 'UPDATE_HEALTH_RECORD';
export const DELETE_HEALTH_RECORD = 'DELETE_HEALTH_RECORD';
export const SET_HEALTH_RECORDS = 'SET_HEALTH_RECORDS';
export const ADD_SYMPTOM = 'ADD_SYMPTOM';
export const REMOVE_SYMPTOM = 'REMOVE_SYMPTOM';
export const CLEAR_SYMPTOMS = 'CLEAR_SYMPTOMS';
export const SET_SYMPTOM_ANALYSIS = 'SET_SYMPTOM_ANALYSIS';
export const HEALTH_ERROR = 'HEALTH_ERROR';
export const CLEAR_HEALTH_ERROR = 'CLEAR_HEALTH_ERROR';

// Initial State
const initialState = {
  healthRecords: [],
  currentSymptoms: [],
  symptomAnalysis: null,
  error: null,
  loading: false,
};

// Reducer
export default function healthReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_HEALTH_RECORD:
      return {
        ...state,
        healthRecords: [...state.healthRecords, action.payload],
      };
    case UPDATE_HEALTH_RECORD:
      return {
        ...state,
        healthRecords: state.healthRecords.map(record => 
          record.id === action.payload.id ? action.payload : record
        ),
      };
    case DELETE_HEALTH_RECORD:
      return {
        ...state,
        healthRecords: state.healthRecords.filter(record => 
          record.id !== action.payload
        ),
      };
    case SET_HEALTH_RECORDS:
      return {
        ...state,
        healthRecords: action.payload,
      };
    case ADD_SYMPTOM:
      if (state.currentSymptoms.includes(action.payload)) {
        return state; // Don't add duplicate symptoms
      }
      return {
        ...state,
        currentSymptoms: [...state.currentSymptoms, action.payload],
      };
    case REMOVE_SYMPTOM:
      return {
        ...state,
        currentSymptoms: state.currentSymptoms.filter(
          symptom => symptom !== action.payload
        ),
      };
    case CLEAR_SYMPTOMS:
      return {
        ...state,
        currentSymptoms: [],
        symptomAnalysis: null,
      };
    case SET_SYMPTOM_ANALYSIS:
      return {
        ...state,
        symptomAnalysis: action.payload,
        loading: false,
      };
    case HEALTH_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_HEALTH_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Action Creators
export const addHealthRecord = (record) => {
  return {
    type: ADD_HEALTH_RECORD,
    payload: record,
  };
};

export const updateHealthRecord = (record) => {
  return {
    type: UPDATE_HEALTH_RECORD,
    payload: record,
  };
};

export const deleteHealthRecord = (recordId) => {
  return {
    type: DELETE_HEALTH_RECORD,
    payload: recordId,
  };
};

export const setHealthRecords = (records) => {
  return {
    type: SET_HEALTH_RECORDS,
    payload: records,
  };
};

export const addSymptom = (symptom) => {
  return {
    type: ADD_SYMPTOM,
    payload: symptom,
  };
};

export const removeSymptom = (symptom) => {
  return {
    type: REMOVE_SYMPTOM,
    payload: symptom,
  };
};

export const clearSymptoms = () => {
  return {
    type: CLEAR_SYMPTOMS,
  };
};

export const setSymptomAnalysis = (analysis) => {
  return {
    type: SET_SYMPTOM_ANALYSIS,
    payload: analysis,
  };
};

export const setHealthError = (error) => {
  return {
    type: HEALTH_ERROR,
    payload: error,
  };
};

export const clearHealthError = () => {
  return {
    type: CLEAR_HEALTH_ERROR,
  };
};

// Thunk Actions

// Fetch health records (mock data for demo)
export const fetchHealthRecords = (userId) => {
  return async (dispatch) => {
    try {
      // For demo purposes, simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock health records
      const mockHealthRecords = [
        {
          id: 'hr1',
          userId,
          recordType: 'bloodPressure',
          date: '2023-06-15T10:30:00Z',
          systolic: 120,
          diastolic: 80,
          heartRate: 72,
          notes: 'Feeling good today.',
        },
        {
          id: 'hr2',
          userId,
          recordType: 'bloodSugar',
          date: '2023-06-10T08:15:00Z',
          level: 95,
          mealStatus: 'fasting',
          notes: 'Morning reading.',
        },
        {
          id: 'hr3',
          userId,
          recordType: 'weight',
          date: '2023-06-05T18:00:00Z',
          weight: 75.5,
          unit: 'kg',
          notes: 'After dinner.',
        },
        {
          id: 'hr4',
          userId,
          recordType: 'medication',
          date: '2023-06-01T09:00:00Z',
          medicationName: 'Aspirin',
          dosage: '100mg',
          notes: 'Took as prescribed.',
        },
      ];
      
      dispatch(setHealthRecords(mockHealthRecords));
      return true;
    } catch (error) {
      console.error('Fetch health records error:', error);
      dispatch(setHealthError('Failed to fetch health records. Please try again.'));
      return false;
    }
  };
};

// Analyze symptoms using BioGPT
export const analyzeSymptoms = (symptoms) => {
  return async (dispatch) => {
    try {
      if (!symptoms || symptoms.length === 0) {
        dispatch(setHealthError('Please add at least one symptom to analyze.'));
        return false;
      }
      
      // Call BioGPT API for symptom analysis
      const analysis = await checkSymptoms(symptoms);
      
      dispatch(setSymptomAnalysis(analysis));
      return true;
    } catch (error) {
      console.error('Symptom analysis error:', error);
      dispatch(setHealthError('Failed to analyze symptoms. Please try again later.'));
      return false;
    }
  };
};