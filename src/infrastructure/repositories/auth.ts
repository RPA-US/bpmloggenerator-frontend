import Http from "infrastructure/http/http";
import configuration from "infrastructure/util/configuration";

const buildURL = (path:string) => {
  let parsedPath = path.startsWith('/') ? path.substring(1) : path;
  return configuration.API_BASE_URL + parsedPath;
}

export interface AuthRequestError {
  message: string
}

export default class AuthRepository {

  async login(email: string, password: string) {
    try {
      return await Http.post(buildURL('/login'), {
        email,
        password
      })
    } catch (ex) {
      console.error('error caught in AuthRepository.login', ex);
      throw ex as AuthRequestError
    }
  }

  async logout() {

  }

}