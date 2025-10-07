import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import familySlice from './familySlice';
import memorySlice from './memorySlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        family: familySlice,
        memories: memorySlice,
    },
    devTools: true,
});
export default store;