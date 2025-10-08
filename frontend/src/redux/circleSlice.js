import { createSlice } from '@reduxjs/toolkit';
import { createCircle } from './circleThunks'; // Import the thunk

const circlesSlice = createSlice({
    name: 'circles',
    initialState: {
        items: [], // An array to hold all the circles
        loading: false,
        error: null,
    },
    reducers: {
        // Synchronous actions can go here
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
            })
            .addCase(createCircle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default circlesSlice.reducer;