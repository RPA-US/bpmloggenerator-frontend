import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { Experiment, ExperimentError, ExperimentsState } from './types';

const initialState: ExperimentsState =  {
  experiments: [],
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
    setExperiments: (state, { payload }: PayloadAction<Experiment[]>) => {
      state.experiments = payload
    },
    setError: (state, { payload }: PayloadAction<ExperimentError>) => {
      state.error = payload
    }
  }
});

const { setLoading, setExperiments, setError } = experimentsSlice.actions

export const experimentsSelector = (state: RootState) => state.experiment;

const mockCallDelay = () => new Promise((resolve) => setTimeout(resolve, 3000));

export const loadExperiments = (): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { auth } = getState();
  try {
    dispatch(setLoading(true))
    // TODO fetch experiments
    console.log('EXPERIMENT SLICE: LOAD EXPERIMENTS FROM USER WITH ID ', auth.currentUser?.id);
    await mockCallDelay();
    dispatch(setExperiments(
      [
        { id: 1, name: 'First sample experiment', launchDate: new Date('2022-02-01T09:00:00') },
        { id: 2, name: 'Second sample experiment', launchDate: new Date('2022-02-01T10:00:00') },
        { id: 3, name: 'Third sample experiment', launchDate: new Date('2022-02-02T11:30:00') },
      ]
    ));

  } catch (error) {
    dispatch(setError(error as ExperimentError))
  } finally {
    dispatch(setLoading(false))
  }
}

export default experimentsSlice.reducer;