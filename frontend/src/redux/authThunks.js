import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { USER_API_ENDPOINT } from '@/utils/constant';
import { updateUser } from './authSlice'; // Import the slice action

export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
      try {
          const response = await axios.post(`${USER_API_ENDPOINT}/login`, loginData, { withCredentials: true });
          localStorage.setItem('user', JSON.stringify(response.data.user));
          toast.success(response.data.message);
          // Return the entire payload so other slices can use it
          return response.data; 
      } catch (error) {
          const message = error.response?.data?.message || 'Login failed.';
          toast.error(message);
          return rejectWithValue(message);
      }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}/logout`, { withCredentials: true });
      // Remove the user object from localStorage
      localStorage.removeItem('user');
      toast.success(response.data.message);
      return;
    } catch (error) {
      const message = error.response?.data?.message || 'Logout failed.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(
        `${USER_API_ENDPOINT}/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Update Redux store
      dispatch(updateUser(response.data.user));

      toast.success(response.data.message || 'Profile updated successfully!');
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);