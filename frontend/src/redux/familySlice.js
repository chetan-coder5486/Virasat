import { createSlice } from '@reduxjs/toolkit';
import { createFamily, getFamilyDetails } from './familyThunks'; // Import from thunks file
import { loginUser } from './authThunks';      // Import from thunks file


const familySlice = createSlice({
    name: 'family',
    initialState: {
        familyData: null,
        loading: false,
        isFamily: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createFamily.fulfilled, (state, action) => {
                state.isFamily = true;
                state.familyData = action.payload;
                state.loading = false;
            })
            // This part will now work correctly
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isFamily = action.payload.isFamily;
                state.familyData = action.payload.family || null; // Assume login payload might have family data
            })
            // Add pending/rejected cases for robustness
            .addCase(createFamily.pending, (state) => {
                state.loading = true;
            })
            .addCase(createFamily.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle getFamilyDetails actions
            .addCase(getFamilyDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFamilyDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.familyData = action.payload; // <-- PERSISTENCE!
                state.isFamily = true; // Ensure this is also set
            })
            .addCase(getFamilyDetails.rejected, (state) => {
                state.loading = false;
                state.isFamily = false;
                state.familyData = null;
            });
    }
});

export default familySlice.reducer;