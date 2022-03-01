import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { User } from 'features/user/types';
import { IElements, wizardState } from './types';
import { UserDTO } from 'infrastructure/http/dto/auth';

export const SESSION_TOKEN_ITEM = "agosuirpa.auth";

const { localStorage } = window;

const initialState: wizardState = {
    elements: {},
    seed: null,
    scenario_variability: null,
    case_variability: null
}

export const wizardSlice = createSlice({
    name: 'wizard',
    initialState,
    reducers: {
        setElements: (state, { payload }: PayloadAction<IElements>) => {
            state.elements = payload;
        }
    }
})

export const elementSelector = (state: RootState) => state.wizard.elements;

export default wizardSlice.reducer;