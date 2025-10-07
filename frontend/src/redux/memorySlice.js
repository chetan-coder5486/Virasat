import { createSlice } from '@reduxjs/toolkit';
<<<<<<< HEAD
import { createMemory, fetchMemories } from './memoryThunks';
=======
import { fetchMemories } from './memoryThunks';
>>>>>>> 39dbe1ea1c50897f39e9aa49b0373cb084aaad8f

const memorySlice = createSlice({
    name: 'memories',
    initialState: {
        items: [],
        loading: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMemories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMemories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMemories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
<<<<<<< HEAD
            })
            .addCase(createMemory.pending, (state) => {
                state.loading = true;
            })
            .addCase(createMemory.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new memory to the beginning of the items array
                state.items.unshift(action.payload);
            })
            .addCase(createMemory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
=======
>>>>>>> 39dbe1ea1c50897f39e9aa49b0373cb084aaad8f
            });
    }
});

export default memorySlice.reducer;