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
    setError: (state, { payload }: PayloadAction<ExperimentError>) => {
      state.error = payload
    }
  }
});

const { setLoading, addExperiments, setExperiments, setError } = experimentsSlice.actions

export const experimentsSelector = (state: RootState) => state.experiment;

function experimentDTOToExperimentType(experiment: ExperimentDTO): Experiment {
  return {
    id: experiment.id,
    name: experiment.name,
    description: experiment.description,
    launchDate: new Date(),
    state: experiment.id === 1 ? ExperimentState.CREATING : ExperimentState.CREATED
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

export const createExperiment = (experimentData: any): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { auth, experiment } = getState();
  try {
    const experimentResponse = await repository.create(experimentData, auth.token ?? '');
    const { experiments, pagination } = experiment;
    const hasNext = pagination.total > experiments.length + 1;
    dispatch(setExperiments({
      experiments: [experimentDTOToExperimentType(experimentResponse)].concat(experiments),
      pagination: {
        page: hasNext ? 2 : 1,
        total: experiments.length + 1,
        hasNext
      }
    }));
  } catch (error) {
    dispatch(setError(error as ExperimentError))
  }
}

export default experimentsSlice.reducer;