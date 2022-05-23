import { GUIComponentDTO, GUIComponentResponse } from "infrastructure/http/dto/wizard";
import Http from "infrastructure/http/http";

export default class GUIComponentRepository {

  async list(token: string) {
    try {
      return await Http.get<GUIComponentResponse>(Http.buildURL('/gui-component/'), Http.authHeader(token))
    } catch (ex) {
      console.error('error caught in GUIComponentCategoryRepository.list', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }

  async ownedByUser(token: string) {
    try {
      const params = { profile: true };
      return await Http.get<GUIComponentResponse>(Http.buildURL('/gui-component/', params), Http.authHeader(token))
    } catch (ex) {
      console.error('error caught in GUIComponentCategoryRepository.list', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }

  async get(id: number, token: string) {
    try {
      return await Http.get<GUIComponentDTO>(Http.buildURL(`/gui-component/${id}/`), Http.authHeader(token))
    } catch (ex) {
      console.error('error caught in GUIComponentCategoryRepository.list', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }

  async save(categoryData: FormData, token: string) {
    try {
      if (categoryData.has('id')) {
        return await Http.put<any>(Http.buildURL(`/gui-component/${categoryData.get("id")}/`), categoryData, Http.authHeader(token))
      } else {
        return await Http.post<GUIComponentDTO>(Http.buildURL('/gui-component/'), categoryData, Http.authHeader(token)) 
      }
    } catch (ex) {
      console.error('error caught in ExperimentRepository.create', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }
}

