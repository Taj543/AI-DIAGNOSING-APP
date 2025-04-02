// Auth Reducer - Manages authentication state
import { API_BASE_URL } from '../../config/env';

// Action Types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const AUTH_ERROR = 'AUTH_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

// Initial State
const initialState = {
  isAuthenticated: false,
  user: null,
  userType: null, // 'patient', 'doctor', 'caretaker'
  token: null,
  error: null,
  loading: false,
};

// Reducer
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        token: action.payload.token,
        error: null,
        loading: false,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case AUTH_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Action Creators
export const login = (userData, userType, token) => {
  return {
    type: LOGIN,
    payload: {
      user: userData,
      userType,
      token,
    },
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const updateProfile = (updatedData) => {
  return {
    type: UPDATE_PROFILE,
    payload: updatedData,
  };
};

export const setAuthError = (errorMessage) => {
  return {
    type: AUTH_ERROR,
    payload: errorMessage,
  };
};

export const clearAuthError = () => {
  return {
    type: CLEAR_ERROR,
  };
};

// Thunk Actions

// Login User - For demo purposes, we're just using mock data
export const loginUser = (email, password, userType) => {
  return async (dispatch) => {
    try {
      // For demo purposes, simulate API call with timeout
      // In a real app, this would be an API call to authenticate
      
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock response based on user type
      const mockUserData = {
        patient: {
          id: 'p1',
          name: 'John Doe',
          email,
          phoneNumber: '+123456789',
          dateOfBirth: '1990-01-01',
          gender: 'male',
          medicalConditions: ['Hypertension', 'Asthma'],
          allergies: ['Penicillin'],
        },
        doctor: {
          id: 'd1',
          name: 'Dr. Sarah Smith',
          email,
          phoneNumber: '+987654321',
          specialization: 'Cardiology',
          licenseNumber: 'MED123456',
          hospitalAffiliation: 'City General Hospital',
        },
        caretaker: {
          id: 'c1',
          name: 'Michael Johnson',
          email,
          phoneNumber: '+1122334455',
          patientsUnderCare: [
            { id: 'p1', name: 'John Doe', relationship: 'Father' },
            { id: 'p2', name: 'Emma Wilson', relationship: 'Neighbor' },
          ],
        },
      };
      
      // Validate email/password (simplified for demo)
      if (email && password) {
        const userData = mockUserData[userType];
        if (userData) {
          // Generate a mock token
          const token = `mock-jwt-token-${Date.now()}`;
          
          // Dispatch login action
          dispatch(login(userData, userType, token));
          
          // Store auth data in localStorage or AsyncStorage in a real app
          return true;
        }
      }
      
      // If validation failed
      dispatch(setAuthError('Invalid credentials or user type'));
      return false;
    } catch (error) {
      console.error('Login error:', error);
      dispatch(setAuthError('Failed to login. Please try again.'));
      return false;
    }
  };
};

// Register User - For demo purposes, we're just using mock data
export const registerUser = (userData, userType) => {
  return async (dispatch) => {
    try {
      // For demo purposes, simulate API call with timeout
      // In a real app, this would be an API call to register
      
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simplified validation
      if (userData && userData.email && userData.password) {
        // Generate a fake ID
        const id = `${userType[0]}${Date.now()}`;
        
        // Create user object with ID
        const user = {
          ...userData,
          id,
        };
        
        // Generate a mock token
        const token = `mock-jwt-token-${Date.now()}`;
        
        // Dispatch login action
        dispatch(login(user, userType, token));
        
        // Store auth data in localStorage or AsyncStorage in a real app
        return true;
      }
      
      // If validation failed
      dispatch(setAuthError('Invalid registration data'));
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      dispatch(setAuthError('Failed to register. Please try again.'));
      return false;
    }
  };
};