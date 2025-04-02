import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import healthReducer from './reducers/healthReducer';
import medicationReducer from './reducers/medicationReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  health: healthReducer,
  medication: medicationReducer,
});

// Create store with middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;