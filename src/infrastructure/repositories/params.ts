import { FunctionParamDTO, FunctionParamResponse } from "infrastructure/http/dto/wizard";
import Http from "infrastructure/http/http";

export default class ParamFunctionRepository {

    async list(token: string) {
      try {
        return await Http.get<FunctionParamResponse>(Http.buildURL('/function-param/'), Http.authHeader(token))
      } catch (ex) {
        console.error('error caught in ParamFunctionRepository.list', ex);
        // TODO handle session caduced error
        throw ex;
      }
    }
  
    async get(id: number, token: string) {
      try {
        return await Http.get<FunctionParamDTO>(Http.buildURL(`/function-param/${id}/`), Http.authHeader(token))
      } catch (ex) {
        console.error('error caught in ParamFunctionRepository.list', ex);
        // TODO handle session caduced error
        throw ex;
      }
    }

  }