import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Assuming you use react-hot-toast or a similar library
import { USER_API_ENDPOINT } from '@/utils/constant';

// 1. Create the async thunk for the logout API call
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            // All side effects (API call, toast, localStorage) happen here
            const response = await axios.get(`${USER_API_ENDPOINT}/logout`, { withCredentials: true });

            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.removeItem('isLogged');
                return response.data; // This will be the action.payload in `fulfilled`
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Logout failed';
            toast.error(errorMessage);
            return rejectWithValue(errorMessage); // This will be the action.payload in `rejected`
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        // Simplified this check, as the comparison already returns a boolean
        isLogged: localStorage.getItem('isLogged') === 'true'
    },
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        loginSuccess(state) {
            state.isLogged = true;
            localStorage.setItem('isLogged', 'true');
        },
        // The old logoutSuccess reducer is removed from here
    },
    // 2. Handle the thunk's lifecycle states (pending, fulfilled, rejected)
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                // 3. The actual state update is a pure function
                state.isLogged = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
                // Optionally handle a failed logout, e.g., show an error state
            });
    }
});

// Export the synchronous actions
export const { setLoading, loginSuccess } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;