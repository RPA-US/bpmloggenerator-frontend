import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { IElements, wizardState } from './types';
import GUIComponentCategoryRepository from 'infrastructure/repositories/gui-component-category';
import GUIComponentRepository from 'infrastructure/repositories/gui-component';
import VariabilityFunctionCategoryRepository from 'infrastructure/repositories/variability-function-category';
import VariabilityFunctionRepository from 'infrastructure/repositories/variability-function';
import ParamFunctionRepository from 'infrastructure/repositories/params';
import { CategoryDTO, FunctionParamDTO, GUIComponentDTO, VariabilityFunctionDTO } from 'infrastructure/http/dto/wizard';

export const guiComponentCategoryRepository = new GUIComponentCategoryRepository();
export const guiComponentRepository = new GUIComponentRepository();
export const variabilityFunctionCategoryRepository = new VariabilityFunctionCategoryRepository();
export const variabilityFunctionRepository = new VariabilityFunctionRepository();
export const paramFunctionCategoryRepository = new ParamFunctionRepository();

// ================================== REDUCERS ==================================



const { localStorage } = window;

// ================================== REDUCERS ==================================

const initialState: wizardState = {
  elements: {},
  seed: null,
  scenario_variability: null,
  case_variability: null,
  initialFunctions: new Map(),
  initialParams: new Map(),
  functions: null,
  params: null,
  category_functions: null,
  gui_components: null,
  category_gui_components: null,
  isLoading: false,
  error: null
}

export const wizardSlice = createSlice({
  name: "wizard",
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setElements: (state, { payload }: PayloadAction<IElements>) => {
      state.elements = payload;
    }, // variability configuration can be as case or scenario level
    setVariabilityConfiguration: (
      state,
      { payload }: PayloadAction<{ seed: any }>
    ) => {
      state.seed = payload;
    },
    setInitialParams: (
      state,
      { payload }: PayloadAction<Map<any,any>>
    ) => {
      state.initialParams = payload;
    },
    setInitialFunctions: (
      state,
      { payload }: PayloadAction<Map<any,any>>
    ) => {
      state.initialFunctions = payload;
    },
    setParams: (
      state,
      { payload }: PayloadAction<FunctionParamDTO[]>
    ) => {
      state.params = payload;
    },
    setFunctions: (
      state,
      { payload }: PayloadAction<VariabilityFunctionDTO[]>
    ) => {
      state.functions = payload;
    },
    setFunctionCategories: (
      state,
      { payload }: PayloadAction<CategoryDTO[]>
    ) => {
      state.category_functions = payload;
    },
    setGUIComponents: (
      state,
      { payload }: PayloadAction<GUIComponentDTO[]>
    ) => {
      state.gui_components = payload;
    },
    setGUIComponentCategories: (
      state,
      { payload }: PayloadAction<CategoryDTO[]>
    ) => {
      state.category_gui_components = payload;
    },
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    },
  },
});

  // ================================== ACTIONS ==================================
  
  const { setElements, setError, setLoading, setVariabilityConfiguration, setFunctions, setFunctionCategories, setGUIComponents, setGUIComponentCategories, setParams, setInitialParams, setInitialFunctions } = wizardSlice.actions

  // ================================== ROOT STATE ==================================
  
  export const wizardSelector = (state: RootState) => state.wizard;
  
  // ================================== THUNK middleware ==================================
  
  export const updateJsonConf = (variant: string, act: string, column: string, log_column_conf: any): AppThunk => async (dispatch: AppDispatch, getState) => {
    const { wizard } = getState();
    let json_conf = wizard.seed;
    dispatch(
      setVariabilityConfiguration({
          ...json_conf,
          [variant]: {
            ...json_conf[variant],
            [act]:{
              ...json_conf[variant][act],
              [column]: log_column_conf
            }
          }
    }));
  }

  export const loadFunctionsAndCategories = (variant: string, act: string): AppThunk => async (dispatch: AppDispatch, getState) => {
    const { auth, wizard } = getState();
    try {
      dispatch(setLoading(true))
      // const currentPage = experiment.pagination.page;
      if (wizard.functions === null) {
        const functionsResponse = await variabilityFunctionRepository.list(auth.token ?? '');
        dispatch(setFunctions(functionsResponse.results));
      }
      if (wizard.category_functions === null) {
        const functionCategoriesResponse = await variabilityFunctionCategoryRepository.list(auth.token ?? '');
        dispatch(setFunctionCategories(functionCategoriesResponse.results));
      }
      if (wizard.gui_components === null) {
        const guiComponentsResponse = await guiComponentRepository.list(auth.token ?? '');
        dispatch(setGUIComponents(guiComponentsResponse.results));
      }
      if (wizard.category_gui_components === null) {
        const guiComponentCategoriesResponse = await guiComponentCategoryRepository.list(auth.token ?? '');
        dispatch(setGUIComponentCategories(guiComponentCategoriesResponse.results));
      }
      if (wizard.params === null) {
        const paramsResponse = await paramFunctionCategoryRepository.list(auth.token ?? '');
        dispatch(setParams(paramsResponse.results));
      }
      
      let aux_params = new Map();
      let aux_functions = new Map();
      Object.entries({...wizard.seed[variant][act]}).forEach(entry => {
        const val: any = entry[1];
        aux_functions.set(entry[0], val.name);
        aux_params.set(entry[0], {
          possible_params: {},
          args: val.args
        });
      });
      dispatch(setInitialParams(aux_params));
      dispatch(setInitialFunctions(aux_functions));
    } catch (error) {  
      dispatch(setError(error as string))
    } finally {
      dispatch(setLoading(false))
    }
  }

  export default wizardSlice.reducer;
  