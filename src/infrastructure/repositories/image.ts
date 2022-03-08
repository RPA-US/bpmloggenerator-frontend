import Http from "infrastructure/http/http";

export default class ScreenshotRepository {


  async get(path: string, token: string) {
    try {
      const headers = new Headers();
      headers.set('Authorization', `Token ${token}`);
      return fetch(Http.buildURL(`/private-media/${path}`), { headers });
    } catch (ex) {
      console.error('error caught in Screenshot get', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }

}
