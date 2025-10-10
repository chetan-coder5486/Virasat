import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FAMILY_API_ENDPOINT } from '@/utils/constant';

export const fetchTimelineEvents = createAsyncThunk(
    'timeline/fetchEvents',
    async ({ sort = 'asc' } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${FAMILY_API_ENDPOINT}/timeline`, {
                params: { sort },
                withCredentials: true,
            });
            return response.data.events;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);