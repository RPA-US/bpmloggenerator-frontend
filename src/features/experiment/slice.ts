import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { Experiment, ExperimentError, ExperimentsState, Pagination } from './types';
import ExperimentRepository from 'infrastructure/repositories/experiment';
import { ExperimentDTO } from 'infrastructure/http/dto/experiment';
import { experimentDTOToExperimentType } from './utils';

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
  isLoading: false,
  error: null
}

export const experimentsSlice = createSlice({
  name: 'experiment',
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload
    },
    addExperiments: (state, { payload }: PayloadAction<{ experiments: Experiment[], pagination: Pagination}>) => {
      state.experiments = state.experiments.concat(payload.experiments)
      state.pagination = payload.pagination
    },
    setExperiments: (state, { payload }: PayloadAction<{ experiments: Experiment[], pagination: Pagination}>) => {
      state.experiments = payload.experiments
      state.pagination = payload.pagination
    },
    // setVariabilityConfiguration: (state, { payload }: PayloadAction<{ experiment: Experiment, seed: any}>) => {
    //   state.detail = payload.experiment
    //   state.seed = payload.seed
    // },
    setExperiment: (state, { payload }: PayloadAction<Experiment>) => {
      const index = state.experiments.findIndex(exp => exp.id === payload.id);
      if (index !== -1) {
        state.experiments[index] = payload
      }
    },
    setError: (state, { payload }: PayloadAction<ExperimentError>) => {
      state.error = payload
    }
  }
});

// ================================== ACTIONS ==================================

const { setLoading, addExperiments, setExperiment, setExperiments, setError } = experimentsSlice.actions

// ================================== Root STATE ==================================

export const experimentsSelector = (state: RootState) => state.experiment;

// ================================== THUNK middleware ==================================

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
  const hasPreviousId = experimentData.id;
  const seed = experimentData.seedLog;
  delete experimentData.seedLog;
  try {
    const experimentResponse = await experimentRepository.save(experimentData, auth.token ?? '');
    if (!hasPreviousId && experimentResponse.id != null) {
      const savedExperimentData = await experimentRepository.get(experimentResponse.id, auth.token ?? '');
      if(experimentResponse.status === "PRE_SAVED") {
        // dispatch(setVariabilityConfiguration({
        //   experiment: experimentDTOToExperimentType(savedExperimentData),
        //   seed: seed,
        // }));
      } else {
        const { experiments, pagination } = experiment;
        dispatch(setExperiments({
          experiments: [experimentDTOToExperimentType(savedExperimentData)].concat(experiments),
          pagination,
        }));
      } 
    } else {
      dispatch(setExperiment(experimentDTOToExperimentType(experimentData)));
    }
    actionFinishedCallback != null && actionFinishedCallback();
    } catch (error) {
      dispatch(setError(error as ExperimentError))
      actionFinishedCallback != null && actionFinishedCallback(error);
    }
}

export default experimentsSlice.reducer;