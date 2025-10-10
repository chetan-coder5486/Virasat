import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import familySlice from './familySlice';
import memorySlice from './memorySlice';
import circleSlice from './circleSlice';
import timelineSlice from './timelineSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        family: familySlice,
        memories: memorySlice,
        circle: circleSlice,
        timeline: timelineSlice,
    },
    devTools: true,
});
export default store;