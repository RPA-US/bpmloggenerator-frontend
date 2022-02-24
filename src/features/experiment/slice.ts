import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { Experiment, ExperimentError, ExperimentsState, ExperimentState, Pagination } from './types';
import ExperimentRepository from 'infrastructure/repositories/experiment';
import { ExperimentDTO } from 'infrastructure/http/dto/experiment';

export const repository = new ExperimentRepository();

const initialState: ExperimentsState =  {
  experiments: [],
  pagination: {
    page: 1,
    total : 0,
    hasNext: true
  },
  detail: null,
  isLoading: false,
  error: null,
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

const { setLoading, addExperiments, setExperiment, setExperiments, setError } = experimentsSlice.actions

export const experimentsSelector = (state: RootState) => state.experiment;

export function experimentDTOToExperimentType(experiment: ExperimentDTO): Experiment {
  let state: ExperimentState;
  if (experiment.is_being_processed === 0) {
    state = ExperimentState.NOT_LAUNCHED
  } else if (experiment.is_being_processed === 100) {
    state = ExperimentState.CREATED;
  } else {
    state = ExperimentState.CREATING;
  }

  return {
    id: experiment.id,
    name: experiment.name,
    description: experiment.description,
    launchDate: new Date(experiment.created_at),
    state,
  }
}

export const loadExperiments = (): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { auth, experiment } = getState();
  try {
    dispatch(setLoading(true))
    const currentPage = experiment.pagination.page;
    const experimentResponse = await repository.list(currentPage, auth.token ?? '');
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
  try {
    const experimentResponse = await repository.save(experimentData, auth.token ?? '');
    if (!hasPreviousId && experimentResponse.id != null) {
      const { experiments, pagination } = experiment;
      const savedExperimentData = await repository.get(experimentResponse.id, auth.token ?? '');
      dispatch(setExperiments({
        experiments: [experimentDTOToExperimentType(savedExperimentData)].concat(experiments),
        pagination,
      }));
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