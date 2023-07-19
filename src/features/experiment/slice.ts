import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { Experiment, ExperimentError, ExperimentsState, ExperimentState, Pagination } from './types';
import ExperimentRepository from 'infrastructure/repositories/experiment';
import { ExperimentDTO } from 'infrastructure/http/dto/experiment';
import { experimentDTOToExperimentType, csvLogToJSON } from './utils';
import { wizardSlice } from './wizard/slice';
import ExperimentStatusChecker from './ExperimentStatusChecker';

export const experimentRepository = new ExperimentRepository();

// ================================== REDUCERS ==================================

const initialState: ExperimentsState =  {
  experiments: [],
  pagination: {
    page: 1,
    total : 0,
    hasNext: true
  },
  detail: null,
  seed_log: null,
  isLoading: false,
  error: null
}

export const experimentsSlice = createSlice({
  name: "experiment",
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    addExperiments: (
      state,
      {
        payload,
      }: PayloadAction<{ experiments: Experiment[]; pagination: Pagination }>
    ) => {
      state.experiments = state.experiments.concat(payload.experiments);
      state.pagination = payload.pagination;
    },
    setExperiments: (
      state,
      {
        payload,
      }: PayloadAction<{ experiments: Experiment[]; pagination: Pagination }>
    ) => {
      state.experiments = payload.experiments;
      state.pagination = payload.pagination;
    },
    setExperimentInList: (state, { payload }: PayloadAction<Experiment>) => {
      const index = state.experiments.findIndex((exp) => exp.id === payload.id);
      if (index !== -1) {
        state.experiments[index] = payload;
      }
    },
    setExperiment: (
      state,
      { payload }: PayloadAction<{ detail: Experiment; seed_log: any }>
    ) => {
      state.detail = payload.detail;
      state.seed_log = payload.seed_log;
    },
    setError: (state, { payload }: PayloadAction<ExperimentError>) => {
      state.error = payload;
    },
  },
});

// ================================== ACTIONS ==================================

const { setLoading, addExperiments, setExperiment, setExperimentInList, setExperiments, setError } = experimentsSlice.actions

export { setExperimentInList };

// ================================== Root STATE ==================================

export const experimentsSelector = (state: RootState) => state.experiment;

// ================================== THUNK middleware ==================================

export const experimentStatusChecker = new ExperimentStatusChecker(
  async(id: number, authToken: string) => experimentDTOToExperimentType((await experimentRepository.get(id, authToken)).experiment)
);

export const loadExperiments = (): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { auth, experiment } = getState();
  try {
    dispatch(setLoading(true))
    const currentPage = experiment.pagination.page;
    const experimentResponse = await experimentRepository.list(currentPage, auth.token ?? '');
    if (experimentResponse.count !== experiment.experiments.length) {
      dispatch(addExperiments({
        experiments: experimentResponse.results
          .map((exp: ExperimentDTO, i) => experimentDTOToExperimentType(exp))
          .filter((exp, i, ls) => ls.findIndex(e => e.id === exp.id) === i),
        pagination: {
          page: currentPage + (experimentResponse.next != null ? 1 : 0),
          total: experimentResponse.count,
          hasNext: experimentResponse.next != null
        }
      }));
    }
  } catch (error) {  
    dispatch(setError(error as ExperimentError))
  } finally {
    dispatch(setLoading(false))
  }
}

export const addExperiment = (experimentOb: Experiment): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { experiment } = getState();
  if (!experiment.experiments.some(experiment => experiment.id === experimentOb.id)) {
    dispatch(addExperiments({
      experiments: [experimentOb],
      pagination: experiment.pagination
    }))
  }
}

export const saveExperiment = (experimentData: any, actionFinishedCallback: Function|null): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { auth, experiment } = getState();
  const hasPreviousId = experimentData.get("id") != null;
  
  // clear seed_log log attached data
  const seed_log = experimentData.get('seed_log') ?? '';
  // experimentData.delete('seed_log');

  // for first saving we unset execute_mode field
  const executeMode = experimentData.get('execute_mode') ?? 'false';
  experimentData.delete('execute_mode');

  try {
    const experimentResponse = await experimentRepository.save(experimentData, auth.token ?? '');
    const savedExperimentData = await experimentRepository.get(experimentResponse.id || experimentData.get("id"), auth.token ?? '');
    const typedExperiment = experimentDTOToExperimentType(savedExperimentData.experiment);

    if (executeMode === 'true') {
      experimentData.set('id', typedExperiment.id);
      experimentData.set('execute_mode', 'true');
      try {
        const experimentExecutionResponse = await experimentRepository.save(experimentData, auth.token ?? '');
        typedExperiment.state = ExperimentState.CREATING;
      } catch (ex) {
        // console.error('Error during project execution', ex);
        throw ex;
      }
    }

    if (!hasPreviousId && experimentResponse.id != null) {
      if(experimentResponse.status === "PRE_SAVED") {
        const { case_conf, scenario_conf } = csvLogToJSON(seed_log, experimentData.get("special_colnames"))
        dispatch(
          setExperiment({
            detail: typedExperiment,
            seed_log: case_conf
        }))
        dispatch(wizardSlice.actions.setVariabilityConfiguration(case_conf))
        dispatch(wizardSlice.actions.setScenarioConfiguration(scenario_conf))
      } else {
        const { experiments, pagination } = experiment;
        dispatch(setExperiments({
          experiments: [typedExperiment].concat(experiments),
          pagination,
        }));
      } 
    } else {
      dispatch(setExperimentInList(typedExperiment));
    }
    actionFinishedCallback != null && actionFinishedCallback(experimentResponse.status, null);
    } catch (error) {
      dispatch(setError(error as ExperimentError))
      actionFinishedCallback != null && actionFinishedCallback(null, error);
    }
}

export const getExperiments = async (token: any): Promise<Experiment[]> => {
  const experimentResponse = await experimentRepository.list(0, token ?? '');
  const experiments = experimentResponse.results
    .map((exp: ExperimentDTO, i) => experimentDTOToExperimentType(exp))
    .filter((exp, i, ls) => ls.findIndex(e => e.id === exp.id) === i)
  return experiments;
}

export const isNameInUse = (name: string, experiments: Experiment[]): Boolean => {
  return experiments.some((experiment) => experiment.name === name)
}

export default experimentsSlice.reducer;