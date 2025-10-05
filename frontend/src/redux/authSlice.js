import {createSlice} from '@reduxjs/toolkit';   

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        isLogged : false
    },
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        loginSuccess(state, action){
            state.isLogged = true;
        },
        logoutSuccess(state, action){
            state.isLogged = false;
        }
    }
});

export const {setLoading,loginSuccess,logoutSuccess} = authSlice.actions;
export default authSlice.reducer;