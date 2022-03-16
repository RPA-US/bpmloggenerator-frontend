import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { IElements, wizardState, InitialValues } from './types';
import GUIComponentCategoryRepository from 'infrastructure/repositories/gui-component-category';
import GUIComponentRepository from 'infrastructure/repositories/gui-component';
import VariabilityFunctionCategoryRepository from 'infrastructure/repositories/variability-function-category';
import VariabilityFunctionRepository from 'infrastructure/repositories/variability-function';
import ParamFunctionRepository from 'infrastructure/repositories/params';
import ScreenshotRepository from 'infrastructure/repositories/image';
import { CategoryDTO, FunctionParamDTO, GUIComponentDTO, VariabilityFunctionDTO } from 'infrastructure/http/dto/wizard';

export const guiComponentCategoryRepository = new GUIComponentCategoryRepository();
export const guiComponentRepository = new GUIComponentRepository();
export const variabilityFunctionCategoryRepository = new VariabilityFunctionCategoryRepository();
export const variabilityFunctionRepository = new VariabilityFunctionRepository();
export const paramFunctionCategoryRepository = new ParamFunctionRepository();
export const screenshotRepository = new ScreenshotRepository();

// ================================== REDUCERS ==================================

const { localStorage } = window;

// ================================== REDUCERS ==================================

const initialState: wizardState = {
  elements: {},
  seed: null,
  scenario_variability: null,
  initialValues: {},
  functions: [],
  params: [],
  screenshot_functions: [],
  category_functions: [],
  gui_components: [],
  category_gui_components: [],
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
    setScenarioConfiguration: (
      state,
      { payload }: PayloadAction<{ scenario_conf: any }>
    ) => {
      state.scenario_variability = payload;
    },
    setColumnVariabilityConfiguration: (
      state,
      { payload }: PayloadAction<{ variant: string, act: string, column: string, columnValue: any }>
    ) => {
      const { seed } = state;
      const { variant, act, column, columnValue } = payload;
      const actObject = [variant, act].reduce((ob, key) => ob[key] || {}, seed);
      if (actObject[column] != null) {
        actObject[column] = columnValue;
      }
    },
    setFunctionNameVariabilityFunction: (
      state,
      { payload }: PayloadAction<{ variant: string, act: string, column: string, function_name: string }>
    ) => {
      const { seed } = state;
      const { variant, act, column, function_name } = payload;
      const value = [variant, act, column].reduce((ob, key) => ob[key] || {}, seed);
      if (typeof value.name === 'string') {
        value.name = function_name;
      }
    },
    setPossibleParamsInitialValues: (
      state,
      { payload }: PayloadAction<{column: string, function_selected: any}>
    ) => {
      const { initialValues } = state;
      const { function_selected, column } = payload;
      if ( initialValues[column] != null){
        initialValues[column].params.possible_params = function_selected.params
      }
    },
    setParamsColumnVariabilityColumn: (
      state,
      { payload }: PayloadAction<{variant: string, act: string, column: string, param_column: string, param_args: any}>
    ) => {
      const { seed, initialValues } = state;
      const { variant, act, column, param_column, param_args } = payload;
      const actObject = [variant, act, column].reduce((ob, key) => ob[key] || {}, seed);
      if (actObject.args != null){
        const aux = {...actObject.args};
        actObject.args = {
          aux,
          [param_column]: param_args
        };
      }
      if (initialValues[column] != null){
        initialValues[column].params.possible_params = param_args
      }
    },
    setVariateVariabilityConfiguration: (
      state,
      { payload }: PayloadAction<{ variant: string, act: string, column: string, variate: number }>
    ) => {
      const { seed } = state;
      const { variant, act, column, variate } = payload;
      const value = [variant, act, column].reduce((ob, key) => ob[key] || {}, seed);
      if (typeof value.variate === 'number') {
        value.variate = variate;
      }
    },
    setInitialValues: (
      state,
      { payload }: PayloadAction<any>
    ) => {
      state.initialValues = payload;
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
    setScreenshotFunctions: (
      state,
      { payload }: PayloadAction<VariabilityFunctionDTO[]>
    ) => {
      state.screenshot_functions = payload;
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
    setLogFormData: (
      state,
      { payload }: PayloadAction<{
        category_functions: CategoryDTO[],
        functions: VariabilityFunctionDTO[],
        functions_screenshot: VariabilityFunctionDTO[],
        gui_components: GUIComponentDTO[],
        params: FunctionParamDTO[]
      }>
    ) => {
      const {
        category_functions,
        functions,
        functions_screenshot,
        gui_components,
        params,
      } = payload;
      state.category_functions = category_functions;
      state.functions = functions;
      state.screenshot_functions = functions_screenshot;
      state.gui_components = gui_components;
      state.params = params;
    },
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    },
  },
});

  // ================================== ACTIONS ==================================
  
  const { setError, setLoading, setVariabilityConfiguration, setVariateVariabilityConfiguration,
    setScenarioConfiguration, setLogFormData, setInitialValues } = wizardSlice.actions

  // ================================== ROOT STATE ==================================
  
  export const wizardSelector = (state: RootState) => state.wizard;
  
  // ================================== THUNK middleware ==================================
  
  // export const updateJsonConf = (variant: string, act: string, column: string, log_column_conf: any): AppThunk => async (dispatch: AppDispatch, getState) => {
  //   const { wizard } = getState();
  //   let json_conf = wizard.seed;
  //   dispatch(
  //     setVariabilityConfiguration({
  //         ...json_conf,
  //         [variant]: {
  //           ...json_conf[variant],
  //           [act]:{
  //             ...json_conf[variant][act],
  //             [column]: log_column_conf
  //           }
  //         }
  //   }));
  // }

  export const updateVariateValue = (variant: string, act: string, column: string, variate_value: number): AppThunk => async (dispatch: AppDispatch, getState) => {
    dispatch(
      setVariateVariabilityConfiguration({ variant, act, column, variate: variate_value })
    );
  }

  // export const loadInitValues = (variant: string, act: string): AppThunk => async (dispatch: AppDispatch, getState) => {
  //     const { wizard } = getState();
  //     try {
  //       dispatch(setLoading(true))
  //       let aux_values = {};
  //         Object.entries({...wizard.seed[variant][act]}).forEach((entry: [string, any]) => {
  //           aux_values = {
  //             ...aux_values,
  //             [entry[0]]: {
  //               function: entry[1].name,
  //               params: {
  //                 possible_params: wizard.initialValues[entry[0]] ? wizard.initialValues[entry[0]].params.possible_params : {},
  //                 args: entry[1].args
  //               },
  //               variate: entry[1].variate
  //             }
  //           };
  //         });
  //         setInitialValues(aux_values);
  //     } catch (error) {  
  //       dispatch(setError(error as string))
  //     } finally {
  //       dispatch(setLoading(false))
  //     }
  // }
  export const loadDataAndInitValues = (variant: string, act: string, initValuesCond: boolean): AppThunk => async (dispatch: AppDispatch, getState) => {
    const { auth, wizard } = getState();
    try {
      dispatch(setLoading(true))

      if(initValuesCond){
        // Load InitValues
        console.log("Initial Values Updated!")
        let aux_values = {};
        Object.entries({...wizard.seed[variant][act]}).forEach((entry: [string, any]) => {
        aux_values = {
            ...aux_values,
            [entry[0]]: {
              function: entry[1].name,
              params: {
                possible_params: wizard.initialValues[entry[0]] ? wizard.initialValues[entry[0]].params.possible_params : {},
                args: entry[1].args
              },
              variate: entry[1].variate
            }
          };
        });
        dispatch(setInitialValues(aux_values));
      }

      const functionCategoriesResponse = await variabilityFunctionCategoryRepository.list(auth.token ?? '');
      const functionsResponse = await variabilityFunctionRepository.list(auth.token ?? '');
      const screenshot_function_categories: any = functionCategoriesResponse.results.filter(c => c.name==="features.experiment.function_category.name.screenshot_rename");
      let functions_screenshot: VariabilityFunctionDTO[] = []
      let functions_no_screenshot: VariabilityFunctionDTO[] = []
      if(screenshot_function_categories.length===0){
        const general_screenshot_function_categories: any = functionCategoriesResponse.results.filter(c => c.name==="features.experiment.function_category.name.screenshot");
        functions_no_screenshot = general_screenshot_function_categories.length > 0 ? functionsResponse.results.filter(f => f.variability_function_category!==general_screenshot_function_categories[0].id) : functionsResponse.results;
      } else {
        functions_screenshot = functionsResponse.results.filter(f => f.variability_function_category===screenshot_function_categories[0].id);
        functions_no_screenshot = functionsResponse.results.filter(f => f.variability_function_category!==screenshot_function_categories.id);
      }
      const guiComponentsResponse = await guiComponentRepository.list(auth.token ?? '');
      const paramsResponse = await paramFunctionCategoryRepository.list(auth.token ?? '');
      dispatch(setLogFormData({
        category_functions: functionCategoriesResponse.results,
        functions: functions_no_screenshot,
        functions_screenshot: functions_screenshot,
        gui_components: guiComponentsResponse.results,
        params: paramsResponse.results
      }))
    } catch (error) {  
      dispatch(setError(error as string))
    } finally {
      dispatch(setLoading(false))
    }
  }

  export default wizardSlice.reducer;
  