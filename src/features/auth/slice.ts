import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, AppDispatch, RootState } from 'store/store';
import { User } from 'features/user/types';
import { AuthError, AuthState } from './types';
import AuthRepository from 'infrastructure/repositories/auth';
import { UserDTO } from 'infrastructure/http/dto/auth';

export const SESSION_TOKEN_ITEM = "agosuirpa.auth";

const { localStorage } = window;

const repository = new AuthRepository();

const initialState: AuthState = {
  isAuth: false,
  isLoading: false,
  checked: false,
  redirectPath: '/',
  token: localStorage.getItem(SESSION_TOKEN_ITEM),
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setAuthSuccess: (state, { payload }: PayloadAction<{ user: User, token: string, checked?: boolean}>) => {
      state.currentUser = payload.user;
      state.token = payload.token;
      state.isAuth = true;
      if (typeof payload.checked === 'boolean') {
        state.checked = payload.checked;
      }
    },
    setAuthFailed: (state, { payload }: PayloadAction<AuthError>) => {
      state.error = payload;
      state.isAuth = false;
    },
    setLogOut: (state) => {
      state.isAuth = false;
      state.currentUser = undefined;
      state.token = null;
    },
    setRedirectPath: (state, { payload }: PayloadAction<string>) => {
      state.redirectPath = payload;
    },
    setChecked: (state, { payload }: PayloadAction<boolean>) => {
      state.checked = payload;
    },
  }
})


const { setAuthSuccess, setLogOut, setLoading, setAuthFailed, setRedirectPath, setChecked } = authSlice.actions

export const authSelector = (state: RootState) => state.auth;

function userDTOToUserType(userData: UserDTO): User {
  return {
    id: `${userData.pk}`,
    email: userData.email,
    displayName: userData.username,
  }
}

export const checkSession = (): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { auth } = getState();
  if (!auth.checked) {
    const currentToken = auth.token;
    if (typeof currentToken === 'string' && currentToken.trim() !== '') {
      try {
        const userData = await repository.userData(currentToken);
        dispatch(setAuthSuccess({
          token: currentToken,
          user: userDTOToUserType(userData),
          checked: true
        }))
      } catch (error) {
        dispatch(setAuthFailed(error as AuthError))
      }
    } else {
      dispatch(setChecked(true))
    }
  }
}

export const login = (loginData: any):AppThunk => async (dispatch: AppDispatch) => {
  const { email, password } = loginData;
  try {
    dispatch(setLoading(true))
    const authResponse = await repository.login(email, password);
    const userData = await repository.userData(authResponse.key);
    dispatch(setAuthSuccess({
      token: authResponse.key,
      user: userDTOToUserType(userData),
    }))
  } catch (error) {
    console.log('error', error);
    dispatch(setAuthFailed(error as AuthError));
  } finally {
    dispatch(setLoading(false));
  }
}

export const logout = (redirectPath?: string): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { auth } = getState();
  try {
    dispatch(setLoading(true))
    await repository.logout(auth.token ?? '');
    dispatch(setRedirectPath(redirectPath || '/'))
    dispatch(setLogOut())
  } catch (error) {
    dispatch(setAuthFailed(error as AuthError));
  } finally {
    dispatch(setLoading(false));
  }
  localStorage.removeItem(SESSION_TOKEN_ITEM);
}

export const updateRedirectPath = (redirectPath: string = ''): AppThunk => async (dispatch: AppDispatch) => {
  dispatch(setRedirectPath(redirectPath));
}

export default authSlice.reducer;