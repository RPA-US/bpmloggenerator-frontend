import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { IElements, wizardState } from './types';
import GUIComponentCategoryRepository from 'infrastructure/repositories/gui-component-category';
import GUIComponentRepository from 'infrastructure/repositories/gui-component';
import VariabilityFunctionCategoryRepository from 'infrastructure/repositories/variability-function-category';
import VariabilityFunctionRepository from 'infrastructure/repositories/variability-function';

export const guiComponentCategoryRepository = new GUIComponentCategoryRepository();
export const guiComponentRepository = new GUIComponentRepository();
export const variabilityFunctionCategoryRepository = new VariabilityFunctionCategoryRepository();
// ================================== REDUCERS ==================================
export const variabilityFunctionRepository = new VariabilityFunctionRepository();



const { localStorage } = window;

// ================================== REDUCERS ==================================

const initialState: wizardState = {
  elements: {},
  seed: null,
  scenario_variability: null,
  case_variability: null,
}

export const wizardSlice = createSlice({
  name: "wizard",
  initialState,
  reducers: {
    setElements: (state, { payload }: PayloadAction<IElements>) => {
      state.elements = payload;
    },
    setVariabilityConfiguration: (
      state,
      { payload }: PayloadAction<{ seed: any }>
    ) => {
      state.seed = payload.seed;
    },
  },
});

  // ================================== ACTIONS ==================================
  
  const { setElements, setVariabilityConfiguration } = wizardSlice.actions

  // ================================== ROOT STATE ==================================
  
  export const wizardSelector = (state: RootState) => state.wizard;
  
  // ================================== THUNK middleware ==================================
  
  export const updateJsonConf = (variant: string, act: string, event: any): AppThunk => async (dispatch: AppDispatch, getState) => {
    const { wizard } = getState();
    let seed = wizard.seed;
    dispatch(
      setVariabilityConfiguration({
        seed
    }));
  }
 

  export default wizardSlice.reducer;
  