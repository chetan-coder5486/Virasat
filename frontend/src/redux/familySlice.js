import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FAMILY_API_ENDPOINT } from '@/utils/constant';

// FIX 1: The async thunk now accepts `familyName` to match the backend schema.
export const createFamily = createAsyncThunk(
    'family/create',
    async ({ familyName, description }, { rejectWithValue }) => {
        try {
            // FIX 2: The payload sent to the API now uses the correct `familyName` key.
            const response = await axios.post(`${FAMILY_API_ENDPOINT}/create`,
                { familyName, description },
                { withCredentials: true }
            );
            toast.success("Family created successfully!");
            return response.data.family; // Return the new family object from the API
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create family.';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const familySlice = createSlice({
    name: 'family',
    initialState: {
        familyData: null, // IMPROVEMENT: Store the actual family data
        loading: false,
        isFamily: false, // Tracks if user has a family
        error: null,
    },
    reducers: {
        // You can add other reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(createFamily.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFamily.fulfilled, (state, action) => {
                state.loading = false;
                state.isFamily = true;
                // IMPROVEMENT: Store the family data in the state
                state.familyData = action.payload; 
            })
            .addCase(createFamily.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});



export default familySlice.reducer;