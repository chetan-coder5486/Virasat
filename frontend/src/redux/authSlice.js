import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser,logoutUser } from './authThunks.js'; // Import from thunks file

// The initial state now includes the user object
const initialState = {
  loading: false,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  isAuthenticated: localStorage.getItem('user') ? true : false,
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {}, // Synchronous actions can be added here if needed
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload; // Set the user data in the state
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null; // Clear the user data from the state
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        // Optionally keep the user logged in on the client if the server call fails
      });
  },
});

export default authSlice.reducer;