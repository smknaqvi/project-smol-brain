import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { ApplicationState } from './types/state';

export default configureStore<ApplicationState>({
  reducer: {
    counter: counterReducer,
  },
});
