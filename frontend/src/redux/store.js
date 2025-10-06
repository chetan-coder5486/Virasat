import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import familySlice from './familySlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        family: familySlice,
    },
    devTools: true,
});
export default store;