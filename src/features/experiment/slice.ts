import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { Experiment, ExperimentError, ExperimentsState, Pagination } from './types';
import ExperimentRepository from 'infrastructure/repositories/experiment';
import { ExperimentDTO } from 'infrastructure/http/dto/experiment';

const repository = new ExperimentRepository();

const initialState: ExperimentsState =  {
  experiments: [],
  pagination: {
    page: 1,
    total : 0,
    hasNext: true
  },
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
    setError: (state, { payload }: PayloadAction<ExperimentError>) => {
      state.error = payload
    }
  }
});

const { setLoading, addExperiments, setError } = experimentsSlice.actions

export const experimentsSelector = (state: RootState) => state.experiment;

function experimentDTOToExperimentType(id: number, experiment: ExperimentDTO): Experiment {
  return {
    id,
    name: experiment.name,
    description: experiment.description,
    launchDate: new Date()
  }
}

export const loadExperiments = (): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { auth, experiment } = getState();
  try {
    dispatch(setLoading(true))
    // TODO fetch experiments
    console.log('EXPERIMENT SLICE: LOAD EXPERIMENTS FROM USER WITH ID ', auth.currentUser?.id);
    const currentPage = experiment.pagination.page;
    const experimentResponse = await repository.list(currentPage, auth.token ?? '');
    dispatch(addExperiments({
      experiments: experimentResponse.results.map((exp: ExperimentDTO, i) => experimentDTOToExperimentType(i+1, exp)),
      pagination: {
        page: currentPage + 1,
        total: experimentResponse.count,
        hasNext: experimentResponse.next != null
      }
    }));
  } catch (error) {
    dispatch(setError(error as ExperimentError))
  } finally {
    dispatch(setLoading(false))
  }
}

export default experimentsSlice.reducer;