import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import familySlice from './familySlice';
import memorySlice from './memorySlice';
import circleSlice from './circleSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        family: familySlice,
        memories: memorySlice,
        circle: circleSlice
    },
    devTools: true,
});
export default store;