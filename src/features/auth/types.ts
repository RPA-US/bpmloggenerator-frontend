import { User } from 'features/user/types';

export interface AuthError {
  message: string
}

export interface AuthState {
  isAuth: boolean
  currentUser?: User
  redirectPath: string
  isLoading: boolean
  error: AuthError | null
}