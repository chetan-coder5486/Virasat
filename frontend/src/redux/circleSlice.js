import { createSlice } from '@reduxjs/toolkit';
import { createCircle, getUserCircles } from './circleThunks'; // Import the thunk

const circlesSlice = createSlice({
    name: 'circles',
    initialState: {
        items: [], // An array to hold all the circles
        activeCircleId: null,
        loading: false,
        error: null,
    },
    reducers: {
        // Synchronous actions can go here
        setActiveCircleId: (state, action) => {
            state.activeCircleId = action.payload;
        },
        clearActiveCircleId: (state) => {
            state.activeCircleId = null;
        },
    },
    // This is where you handle the async thunk
    extraReducers: (builder) => {
        builder
            .addCase(createCircle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCircle.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new circle to the beginning of the items array
                state.items.unshift(action.payload);
                console.log("Circle created and added to state:", action.payload);
            })
            .addCase(createCircle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUserCircles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserCircles.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload; // Replace items with fetched circles
                console.log("Fetched user circles:", action.payload);
            })
            .addCase(getUserCircles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setActiveCircleId, clearActiveCircleId } = circlesSlice.actions;
export default circlesSlice.reducer;