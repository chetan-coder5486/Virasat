import { createSlice } from '@reduxjs/toolkit';
import { fetchMemories } from './memoryThunks';

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
            });
    }
});

export default memorySlice.reducer;