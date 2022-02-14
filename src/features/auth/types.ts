import { User } from 'features/user/types';

export interface AuthError {
  code: string
}

export interface AuthState {
  isAuth: boolean
  currentUser?: User
  redirectPath: string
  isLoading: boolean
  token: string | null
  checked: boolean
  error: AuthError | null
}