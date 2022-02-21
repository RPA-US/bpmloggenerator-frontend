import { ExperimentDTO, ExperimentResponse } from "infrastructure/http/dto/experiment";
import Http from "infrastructure/http/http";

export default class ExperimentRepository {

  async list(page: number, token: string) {
    try {
      return await Http.get<ExperimentResponse>(Http.buildURL('/experiments/', { page }), Http.authHeader(token))
    } catch (ex) {
      console.error('error caught in ExperimentRepository.list', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }

  async create(experimentData: any, token: string) {
    try {
      return await Http.post<ExperimentDTO>(Http.buildURL('/experiments/'), experimentData, Http.authHeader(token))
    } catch (ex) {
      console.error('error caught in ExperimentRepository.create', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }

  async delete() {}

  async download(id: number, token: string) {
    return Http.get(Http.buildURL(`/experiments/download/${id}`), {
      ...Http.authHeader(token),
      'Content-Disposition': `attachment; filename='experiment-${id}-results.zip'`,
      'Content-Type': 'application/zip'
    });
  }

}
