import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAppointments, setLoading, setError } = appointmentsSlice.actions;

export const fetchAppointments = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await axiosInstance.get('/patients/appointments');
    dispatch(setAppointments(response.data));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    dispatch(setError('Failed to load appointments.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default appointmentsSlice.reducer;
