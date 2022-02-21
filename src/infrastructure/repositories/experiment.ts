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
    try {
      const response = await Http.request('GET', Http.buildURL(`/experiments/download/${id}/`), {
        ...Http.authHeader(token)
      });

      const { headers } = response;
      const contentDisposition = headers.get('Content-Disposition');
      let filename = 'file.zip';
      if (contentDisposition != null) {
        filename = contentDisposition.replace(/.*filename=\"(.*)\"$/i, '$1')
      }

      const blob = await response.blob();
      return {
        filename,
        blob,
      }
    } catch (ex) {
      console.error('error caught in ExperimentRepository.download', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }

}
