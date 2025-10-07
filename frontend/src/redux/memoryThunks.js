import axios from 'axios';
import { FAMILY_API_ENDPOINT } from '@/utils/constant';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMemories = createAsyncThunk(
    'memories/fetch',
    async ({ searchTerm, filters }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${FAMILY_API_ENDPOINT}/memories`, {
                params: {
                    search: searchTerm,
                    ...filters,
                },
                withCredentials: true,
            });
            return response.data.memories;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);