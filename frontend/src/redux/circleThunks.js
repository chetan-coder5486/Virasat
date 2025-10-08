import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CIRCLE_API_ENDPOINT } from "@/utils/constant";

export const createCircle = createAsyncThunk(
    'family/createCircle',
    async ({ circleName, members }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${CIRCLE_API_ENDPOINT}/create`,
                { circleName, members },
                { withCredentials: true }
            );
            toast.success("Circle created successfully!");
            return response.data.circle; // Return the newly created circle
        }
        catch (error) {
            const message = error.response?.data?.message || 'Failed to create circle.';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);
