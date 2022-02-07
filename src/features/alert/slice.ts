import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Alert {
  type?: string,
  message?: string,
}

export interface AlertShowPayloadAction {
  message: string,
}

const initialState: Alert = {}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showSuccess(state, action: PayloadAction<AlertShowPayloadAction>) {
      state.type = 'alert-success';
      state.message= '';
    }
  }
})

export const { showSuccess } = alertSlice.actions;

export default alertSlice.reducer;