import { AuthDTO, UserDTO } from "infrastructure/http/dto/auth";
import Http from "infrastructure/http/http";

export interface AuthRequestError {
  message: string
  code: string
}

export class AuthError extends Error implements AuthRequestError {
  public code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export default class AuthRepository {

  async login(email: string, password: string) {
    try {
      return await Http.post<AuthDTO>(Http.buildURL('/users/auth/login/'), {
        email,
        password
      });
    } catch (error) {
      if (error instanceof Response) {
        if (error.status === 400) {
          throw new AuthError('invalid.credentials', 'invalid user credentials')
        }
        throw new AuthError('unhandled', error.statusText);
      }
      console.error('error in AuthRepository.login', error);
      throw error;
    }
  }

  async signup(email: string, password1: string, password2: string) {
    try {
      return await Http.post<AuthDTO>(Http.buildURL('/users/auth/register/'), {
        email,
        password1,
        password2
      });
    } catch (error) {
      if (error instanceof Response) {
        if (error.status === 400) {
          throw new AuthError('invalid.credentials', 'invalid user credentials')
        }
        throw new AuthError('unhandled', error.statusText);
      }
      console.error('error in AuthRepository.login', error);
      throw error;
    }
  }

  async logout(token: string) {
    try {
      return await Http.post(Http.buildURL('/users/auth/logout/'), Http.authHeader(token));
    } catch (error) {
      console.error('error in AuthRepository.logout', error);
      throw error;
    }
  }

  async userData(token: string) {
    try {
      return await Http.get<UserDTO>(Http.buildURL('/users/auth/user/'), Http.authHeader(token))
    } catch (error) {
      if (error instanceof Response) {
        if (error.status === 400) {
          throw new AuthError('session.expired', 'session token expired')
        }
        throw new AuthError('unhandled', error.statusText);
      }
      console.error('error in AuthRepository.userData', error);
      throw error;
    }
  }

}