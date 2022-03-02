import { ExperimentDTO } from 'infrastructure/http/dto/experiment';
import { Experiment, ExperimentState } from './types';
import Papa from 'papaparse';
import { keys } from '@mui/system';
import { init } from 'i18next';

export const downloadFile = function downloadFile(filename: string, blob: Blob) {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    filename,
  );
  document.body.appendChild(link);
  link.click();
  link?.parentNode?.removeChild(link);
}


export function experimentDTOToExperimentType(experiment: ExperimentDTO): Experiment {
  let state: ExperimentState;
  if (experiment.is_being_processed === 0) {
    state = ExperimentState.NOT_LAUNCHED
  } else if (experiment.is_being_processed === 100) {
    state = ExperimentState.CREATED;
  } else {
    state = ExperimentState.CREATING;
  }

  return {
    id: experiment.id,
    name: experiment.name,
    description: experiment.description,
    creationDate: new Date(experiment.created_at),
    executionStart: new Date(experiment.execution_start),
    executionEnd: new Date(experiment.execution_finish),
    lastEditionDate: new Date(experiment.last_edition),
    state,
    numberScenarios: experiment.number_scenarios,
    variabilityConf: experiment.variability_conf,
    scenariosConf: experiment.scenarios_conf,
    foldername: experiment.foldername,
    isActive: experiment.is_active,
    isBeingProcessed: experiment.is_being_processed,
    screenshotNameGenerationFunction: experiment.screenshot_name_generation_function,
    screenshotsPath: experiment.screenshots_path,
    sizeBalance: experiment.size_balance,
    specialColnames: experiment.special_colnames,
    status: null
  }
}

export function csvLogToJSON(seed: any, specialColnames: any): any {
  const colnames = JSON.parse(specialColnames);
  delete colnames["Screenshot"]
  let res: {[key:string]: any} = {};
  const results = Papa.parse(seed, { header: true, skipEmptyLines: true }) // object with { data, errors, meta }
  const rows = results.data // array of objects
  rows.forEach((row: any, index: number) => {
    let columns_conf: {[key:string]: any} = {};
    let has_values: boolean = false;
    Object.entries(row).forEach((col: any) => {
      if (col[0] != "" && !Object.values(colnames).includes(col[0])) {
        const this_column_conf: {[key:string]: any} = {
          "initValue": col[1],
          "variate": 0,
          "name": "",
          "args": []
        };
        columns_conf[col[0]] = this_column_conf;
        has_values = true;
      }
    });
    const variant: string = row[colnames.Variant];
    const activity: string = row[colnames.Activity];
    if(has_values){
      if (!res.hasOwnProperty(variant)) {
        let aux: { [key: string]: any } = {};
        aux[activity] = columns_conf;
        res[variant] = aux;
      } else {
        res[variant][activity] = columns_conf;
      }
    }
    // Object.entries(row).forEach((c: any) => {
    //     const key = c[0];
    //     const value = c[1];

    //     switch (key) {
    //       case colnames.Case:
    //         cases.push(value)
    //         break;
    //       case colnames.Activity:
    //         activities.push(index+"_"+value)
    //         break;
    //       case colnames.Variant:
    //         variants.push(value)
    //         break;
    //       default:
    //         if (index === 0 && key !="") { // && !Object.values(colnames).includes(key)
    //           headers.push(c)
    //         }
    //         break;
    //     }
    //   });
  });
  if(res.hasOwnProperty("")){
    delete res[""]
  }
  return res;
}