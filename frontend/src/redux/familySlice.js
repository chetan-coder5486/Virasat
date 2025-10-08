import { createSlice } from '@reduxjs/toolkit';
import { createFamily, getFamilyDetails, acceptInvite } from './familyThunks'; // Import from thunks file
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
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isFamily = action.payload.isFamily;
            state.familyData = action.payload.family || null; // Assume login payload might have family data
        })
        .addCase(createFamily.fulfilled, (state, action) => {
            state.isFamily = true;
            state.familyData = action.payload;
            state.loading = false;
        })
        // This part will now work correctly
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
                const newData = action.payload;
                const oldData = state.familyData;
                // Update only if the family data has changed
                if (!oldData || oldData._id !== newData._id) {
                    state.familyData = newData;
                }
                state.isFamily = true; // Ensure this is also set
            })
            .addCase(getFamilyDetails.rejected, (state) => {
                state.loading = false;
                state.isFamily = false;
                state.familyData = null;
            })
            // 2. Add cases for the acceptInvite lifecycle
            .addCase(acceptInvite.pending, (state) => {
                state.loading = true;
            })
            .addCase(acceptInvite.fulfilled, (state, action) => {
                state.loading = false;
                state.isFamily = true;
                state.familyData = action.payload.family; // Store the new family's data
            })
            .addCase(acceptInvite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default familySlice.reducer;