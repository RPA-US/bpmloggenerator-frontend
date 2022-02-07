import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { User } from 'features/user/types';
import { AuthError, AuthState } from './types';

const initialState: AuthState = {
  isAuth: false,
  isLoading: false,
  redirectPath: '/',
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setAuthSuccess: (state, { payload }: PayloadAction<User>) => {
      state.currentUser = payload;
      state.isAuth = true;
    },
    setAuthFailed: (state, { payload }: PayloadAction<AuthError>) => {
      state.error = payload;
      state.isAuth = false;
    },
    setLogOut: (state) => {
      state.isAuth = false;
      state.currentUser = undefined;
    },
    setRedirectPath: (state, { payload }: PayloadAction<string>) => {
      state.redirectPath = payload;
    }
  }
})


const { setAuthSuccess, setLogOut, setLoading, setAuthFailed, setRedirectPath} = authSlice.actions

export const authSelector = (state: RootState) => state.auth;

const mockCallDelay = () => setTimeout(() => Promise.resolve, 1300);

export const login = (loginData: any):AppThunk => async (dispatch: AppDispatch) => {
  const { email, password } = loginData;
  try {
    dispatch(setLoading(true))
    await mockCallDelay()
    dispatch(setAuthSuccess({
      id: '1',
      email,
      displayName: 'Sample User'
    }))
  } catch (error) {
    dispatch(setAuthFailed(error as AuthError));
  } finally {
    dispatch(setLoading(false));
  }
}

export const logout = (redirectPath?: string): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true))
    await mockCallDelay()
    dispatch(setRedirectPath(redirectPath || ''))
    dispatch(setLogOut())
  } catch (error) {
    dispatch(setAuthFailed(error as AuthError));
  } finally {
    dispatch(setLoading(false));
  }
}

export const updateRedirectPath = (redirectPath: string = ''): AppThunk => async (dispatch: AppDispatch) => {
  dispatch(setRedirectPath(redirectPath));
}

export default authSlice.reducer;