// Medication Reducer - Manages medications and related information
import { getMedicationInfo } from '../../services/bioGptService';

// Action Types
export const ADD_MEDICATION = 'ADD_MEDICATION';
export const UPDATE_MEDICATION = 'UPDATE_MEDICATION';
export const DELETE_MEDICATION = 'DELETE_MEDICATION';
export const SET_MEDICATIONS = 'SET_MEDICATIONS';
export const SET_MEDICATION_DETAILS = 'SET_MEDICATION_DETAILS';
export const MEDICATION_ERROR = 'MEDICATION_ERROR';
export const CLEAR_MEDICATION_ERROR = 'CLEAR_MEDICATION_ERROR';

// Initial State
const initialState = {
  medications: [],
  medicationDetails: {}, // Map of medication name to details
  error: null,
  loading: false,
};

// Reducer
export default function medicationReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MEDICATION:
      return {
        ...state,
        medications: [...state.medications, action.payload],
      };
    case UPDATE_MEDICATION:
      return {
        ...state,
        medications: state.medications.map(med => 
          med.id === action.payload.id ? action.payload : med
        ),
      };
    case DELETE_MEDICATION:
      return {
        ...state,
        medications: state.medications.filter(med => 
          med.id !== action.payload
        ),
      };
    case SET_MEDICATIONS:
      return {
        ...state,
        medications: action.payload,
      };
    case SET_MEDICATION_DETAILS:
      return {
        ...state,
        medicationDetails: {
          ...state.medicationDetails,
          [action.payload.name]: action.payload.details,
        },
        loading: false,
      };
    case MEDICATION_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_MEDICATION_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Action Creators
export const addMedication = (medication) => {
  return {
    type: ADD_MEDICATION,
    payload: medication,
  };
};

export const updateMedication = (medication) => {
  return {
    type: UPDATE_MEDICATION,
    payload: medication,
  };
};

export const deleteMedication = (medicationId) => {
  return {
    type: DELETE_MEDICATION,
    payload: medicationId,
  };
};

export const setMedications = (medications) => {
  return {
    type: SET_MEDICATIONS,
    payload: medications,
  };
};

export const setMedicationDetails = (name, details) => {
  return {
    type: SET_MEDICATION_DETAILS,
    payload: { name, details },
  };
};

export const setMedicationError = (error) => {
  return {
    type: MEDICATION_ERROR,
    payload: error,
  };
};

export const clearMedicationError = () => {
  return {
    type: CLEAR_MEDICATION_ERROR,
  };
};

// Thunk Actions

// Fetch medications (mock data for demo)
export const fetchMedications = (userId) => {
  return async (dispatch) => {
    try {
      // For demo purposes, simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock medications
      const mockMedications = [
        {
          id: 'med1',
          userId,
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          startDate: '2023-01-15',
          endDate: null,
          prescribedBy: 'Dr. Sarah Smith',
          notes: 'Take in the morning with food',
          reminderTime: '08:00',
          reminderEnabled: true,
        },
        {
          id: 'med2',
          userId,
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          startDate: '2023-02-10',
          endDate: null,
          prescribedBy: 'Dr. Sarah Smith',
          notes: 'Take with meals',
          reminderTime: ['08:00', '18:00'],
          reminderEnabled: true,
        },
        {
          id: 'med3',
          userId,
          name: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily',
          startDate: '2023-03-05',
          endDate: null,
          prescribedBy: 'Dr. Robert Johnson',
          notes: 'Take at bedtime',
          reminderTime: '21:00',
          reminderEnabled: true,
        },
      ];
      
      dispatch(setMedications(mockMedications));
      return true;
    } catch (error) {
      console.error('Fetch medications error:', error);
      dispatch(setMedicationError('Failed to fetch medications. Please try again.'));
      return false;
    }
  };
};

// Fetch medication details using BioGPT
export const fetchMedicationDetails = (medicationName) => {
  return async (dispatch, getState) => {
    try {
      // Check if we already have the details cached
      const { medicationDetails } = getState().medication;
      if (medicationDetails[medicationName]) {
        return medicationDetails[medicationName];
      }
      
      // Call BioGPT API for medication information
      const details = await getMedicationInfo(medicationName);
      
      dispatch(setMedicationDetails(medicationName, details));
      return details;
    } catch (error) {
      console.error('Medication details error:', error);
      dispatch(setMedicationError(`Failed to get information about ${medicationName}. Please try again later.`));
      return null;
    }
  };
};