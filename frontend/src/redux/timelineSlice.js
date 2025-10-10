import { createSlice } from '@reduxjs/toolkit';
import { fetchTimelineEvents } from './timelineThunks';

const timelineSlice = createSlice({
    name: 'timeline',
    initialState: {
        events: [],
        loading: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTimelineEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTimelineEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchTimelineEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default timelineSlice.reducer;