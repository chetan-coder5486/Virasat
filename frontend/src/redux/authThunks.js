import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { USER_API_ENDPOINT } from '@/utils/constant';


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
