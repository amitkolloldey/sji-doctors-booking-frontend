import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setUser, logout, updateUser } = authSlice.actions;

export const updateProfile = (formData) => async (dispatch, getState) => {
  const { role } = getState().auth;

  let endpoint = '';
  if (role === 'doctor') {
    endpoint = '/doctors/profile/update';
  } else if (role === 'patient') {
    endpoint = '/patients/profile/update';
  } else {
    throw new Error('Role not defined');
  }

  try {
    const response = await axiosInstance.put(endpoint, formData);
    dispatch(updateUser(response.data));
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export default authSlice.reducer;
