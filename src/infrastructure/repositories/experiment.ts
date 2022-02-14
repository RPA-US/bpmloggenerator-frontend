import { ExperimentResponse } from "infrastructure/http/dto/experiment";
import Http from "infrastructure/http/http";

export default class ExperimentRepository {

  async list(page: number, token: string) {
    try {
      return await Http.get<ExperimentResponse>(Http.buildURL('/experiments/', { page }), Http.authHeader(token))
    } catch (ex) {
      console.error('error caught in AuthRepository.userData', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }

  async create() {}

  async delete() {}

  async download() {}

}