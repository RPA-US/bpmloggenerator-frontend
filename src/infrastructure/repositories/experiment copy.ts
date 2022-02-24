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

  async get(id: number, token: string) {
    try {
      return await Http.get<ExperimentDTO>(Http.buildURL(`/experiments/${id}/`), Http.authHeader(token))
    } catch (ex) {
      console.error('error caught in ExperimentRepository.list', ex);
      // TODO handle session caduced error
      throw ex;
    }
  }

  async save(id: number | null, experimentData: any, token: string) {
    return new Promise<ExperimentDTO>((resolve) => {
      setTimeout(() => {
        resolve(({
          id,
          ...JSON.parse(`{"created_at":"2022-02-21T10:43:05.983339Z","size_balance":{"balance":{"Balanced":[0.7,0.3],"Imbalanced":[0.4,0.2]},"size_secuence":[10,50,100]},"name":"Template basic experiment","description":"Template basic experiment","number_scenarios":1,"variability_conf":{"trace":{"1":{"A":{"Click":{"args":[],"name":"","variate":0,"initValue":1},"Coor_X":{"args":[146,1280,978],"name":"function11","variate":1,"initValue":"580"},"Coor_Y":{"args":[193,800,77],"name":"function12","variate":1,"initValue":"200"},"MorKeyb":{"args":[],"name":"function1","variate":0,"initValue":1},"NameApp":{"args":[],"name":"function9","variate":0,"initValue":"Firefox"},"TextInput":{"args":[],"name":"function3","variate":0,"initValue":"NaN"},"Timestamp":{"args":[],"name":"function10","variate":1,"initValue":0},"Screenshot":{"args":{},"name":"function_copy_without_root","variate":0,"initValue":"resources\\\\template_experiments\\\\Template basic experiment1644406442168\\\\scenario_1\\\\scenario_1_V1_image0001.png"}},"B":{"Click":{"args":[],"name":"","variate":0,"initValue":1},"Coor_X":{"args":[567,1280,100],"name":"function11","variate":1,"initValue":"568"},"Coor_Y":{"args":[244,800,60],"name":"function12","variate":1,"initValue":"255"},"MorKeyb":{"args":[],"name":"function1","variate":0,"initValue":1},"NameApp":{"args":[],"name":"function9","variate":0,"initValue":"Firefox"},"TextInput":{"args":[],"name":"function3","variate":0,"initValue":"NaN"},"Timestamp":{"args":[],"name":"function10","variate":1,"initValue":1},"Screenshot":{"args":{"ImageView":[{"id":1,"args":["id_card_1","id_card_2","id_card_3","id_card_4","id_card_5","id_card_6","id_card_7","id_card_8","id_card_9","id_card_10"],"name":"function21","coordinates":[499,210,598,278]}]},"name":"","variate":1,"initValue":"resources\\\\template_experiments\\\\Template basic experiment1644406442168\\\\scenario_1\\\\scenario_1_V1_image0003.png"}},"C":{"Click":{"args":[],"name":"","variate":0,"initValue":"NaN"},"Coor_X":{"args":[138,1280,544],"name":"function11","variate":1,"initValue":"NaN"},"Coor_Y":{"args":[361,800,322],"name":"function12","variate":1,"initValue":"NaN"},"MorKeyb":{"args":[],"name":"function1","variate":0,"initValue":0},"NameApp":{"args":[],"name":"function9","variate":0,"initValue":"Firefox"},"TextInput":{"args":[],"name":"function3","variate":0,"initValue":"key.ALT+key.TAB"},"Timestamp":{"args":[],"name":"function10","variate":1,"initValue":2},"Screenshot":{"args":{"ImageView":[{"id":1,"args":["id_card_1","id_card_2","id_card_3","id_card_4","id_card_5","id_card_6","id_card_7","id_card_8","id_card_9","id_card_10"],"name":"function24","dependency":{"V":1,"id":1,"Activity":"B"},"coordinates":[[116,311,606,609],[499,210,598,278]]}]},"name":"","variate":1,"initValue":"resources\\\\template_experiments\\\\Template basic experiment1644406442168\\\\scenario_1\\\\scenario_1_V1_image0004.png"}},"D":{"Click":{"args":[],"name":"","variate":0,"initValue":0},"Coor_X":{"args":[0,1280,230],"name":"function11","variate":0,"initValue":"NaN"},"Coor_Y":{"args":[260,800,30],"name":"function12","variate":0,"initValue":"NaN"},"MorKeyb":{"args":[],"name":"function1","variate":0,"initValue":0},"NameApp":{"args":[],"name":"function9","variate":0,"initValue":"Firefox"},"TextInput":{"args":[],"name":"function3","variate":1,"initValue":"Carmen"},"Timestamp":{"args":[],"name":"function10","variate":1,"initValue":3},"Screenshot":{"args":{"Checkbox":[{"id":2,"args":["checked_1","checked_2","checked_3","checked_4","checked_5","checked_6","checked_7","checked_8","checked_9","checked_10","checked_11","checked_12","checked_13","checked_14","checked_15","checked_16","checked_17","checked_18","checked_19","checked_20","checked_21","checked_22","checked_23","checked_24","checked_25","checked_26","checked_27","checked_28","checked_29","checked_30","checked_31"],"name":"function21","coordinates":[379,420,419,458]}],"TextInput":[{"id":1,"args":["resources/Roboto-Black.ttf",20,"#000000"],"name":"function22","coordinates":[385,228,831,246]}]},"name":"","variate":1,"initValue":"resources\\\\template_experiments\\\\Template basic experiment1644406442168\\\\scenario_1\\\\scenario_1_V1_image0005.png"}}},"2":{"A":{"Click":{"args":[],"name":"","variate":0,"initValue":1},"Coor_X":{"args":[146,1280,978],"name":"function11","variate":1,"initValue":"200"},"Coor_Y":{"args":[193,800,77],"name":"function12","variate":1,"initValue":"211"},"MorKeyb":{"args":[],"name":"function1","variate":0,"initValue":1},"NameApp":{"args":[],"name":"function9","variate":0,"initValue":"Firefox"},"TextInput":{"args":[],"name":"function3","variate":0,"initValue":"NaN"},"Timestamp":{"args":[],"name":"function10","variate":1,"initValue":4},"Screenshot":{"args":{},"name":"function_copy_without_root","variate":0,"initValue":"resources\\\\template_experiments\\\\Template basic experiment1644406442168\\\\scenario_1\\\\scenario_1_V2_image0001.png"}},"B":{"Click":{"args":[],"name":"","variate":0,"initValue":1},"Coor_X":{"args":[1006,1280,110],"name":"function11","variate":1,"initValue":"1050"},"Coor_Y":{"args":[41,800,110],"name":"function12","variate":1,"initValue":"68"},"MorKeyb":{"args":[],"name":"function1","variate":0,"initValue":1},"NameApp":{"args":[],"name":"function9","variate":0,"initValue":"Firefox"},"TextInput":{"args":[],"name":"function3","variate":0,"initValue":"NaN"},"Timestamp":{"args":[],"name":"function10","variate":1,"initValue":5},"Screenshot":{"args":{},"name":"function_copy_without_root","variate":0,"initValue":"resources\\\\template_experiments\\\\Template basic experiment1644406442168\\\\scenario_1\\\\scenario_1_V2_image0003.png"}},"E":{"Click":{"args":[],"name":"","variate":0,"initValue":"NaN"},"Coor_X":{"args":[0,1280,230],"name":"function11","variate":0,"initValue":"NaN"},"Coor_Y":{"args":[260,800,30],"name":"function12","variate":0,"initValue":"NaN"},"MorKeyb":{"args":[],"name":"function1","variate":0,"initValue":0},"NameApp":{"args":[],"name":"function9","variate":0,"initValue":"Firefox"},"TextInput":{"args":[4],"name":"function7","variate":1,"initValue":"key.ALT+key.TAB"},"Timestamp":{"args":[],"name":"function10","variate":1,"initValue":6},"Screenshot":{"args":{"ImageView":[{"id":1,"args":["#ffffff"],"name":"function23","coordinates":[109,309,993,613]}],"TextInput":[{"id":2,"args":["resources/Roboto-Black.ttf",20,"#000000"],"name":"function22","coordinates":[121,349,980,605]}]},"name":"","variate":1,"initValue":"resources\\\\template_experiments\\\\Template basic experiment1644406442168\\\\scenario_1\\\\scenario_1_V2_image0004.png"}}}},"condition":{"ID2":"B.Screenshot == 'Attached'","activityDecision":"B"},"GUIElements":["Button","ImageView","Checkbox","TextInput"],"columnsNames":["Timestamp","MorKeyb","Coor_X","Coor_Y","Click","TextInput","NameApp","Screenshot"]},"scenarios_conf":null,"special_colnames":{"Case":"Case","Variant":"Variant","Activity":"Activity","Screenshot":"Screenshot"},"is_being_processed":0,"is_active":true,"screenshots_path":null,"foldername":"resources\\\\template_experiments\\\\Template basic experiment1644406442168","screenshot_name_generation_function":"function25"}`)
        }) as ExperimentDTO)
      }, 2500)
    })
  }

  async launch(id: number, token: string) {
    try {
      return await Http.put<ExperimentDTO>(Http.buildURL(`/experiments/${id}/`), null, Http.authHeader(token))
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
