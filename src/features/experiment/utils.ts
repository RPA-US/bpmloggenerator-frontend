import { ExperimentDTO } from 'infrastructure/http/dto/experiment';
import { Experiment, ExperimentState } from './types';
import Papa from 'papaparse';
import { objectToFormData } from 'infrastructure/util/form';

export const downloadFile = function downloadFile(filename: string, blob: Blob) {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link?.parentNode?.removeChild(link);
}


export function getByID(obj: any, idO: number) {
  return obj.find((o: { id: number; }) => (o.id === idO) ? o : null)
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
    id: experiment.id ?? null,
    name: experiment.name ?? '',
    description: experiment.description ?? '',
    creationDate: new Date(experiment.created_at),
    executionStart: new Date(experiment.execution_start),
    executionEnd: new Date(experiment.execution_finish),
    lastEditionDate: new Date(experiment.last_edition),
    state,
    numberScenarios: experiment.number_scenarios ?? 0,
    variabilityConf: experiment.variability_conf ?? undefined,
    scenariosConf: experiment.scenarios_conf ?? undefined,
    foldername: experiment.foldername ?? '',
    isActive: experiment.is_active ?? false,
    isBeingProcessed: experiment.is_being_processed ?? -1,
    screenshotNameGenerationFunction: experiment.screenshot_name_generation_function ?? '',
    screenshotsPath: experiment.screenshots_path ?? '',
    sizeBalance: experiment.size_balance ?? undefined,
    specialColnames: experiment.special_colnames ?? '',
    status: '',
    isPublic: experiment.public,
    author: experiment.user != null ? `${experiment.user.first_name} ${experiment.user.last_name}` : experiment.user
  }
}

export function experimentToFormData(experiment: Experiment): FormData {
  if (experiment != null) {
    return objectToFormData({
      'id': `${experiment.id}`,
      // 'created_at': experiment.creationDate,
      'description': experiment.description,
      // 'execution_finish': experiment.executionEnd,
      // 'execution_start': experiment.executionStart,
      'foldername': experiment.foldername,
      // 'is_active': experiment.isActive ?? 'true',
      // 'is_being_processed': experiment.isBeingProcessed ?? '0',
      // 'last_edition': experiment.lastEditionDate,
      'name': experiment.name,
      // 'number_scenarios': experiment.numberScenarios ?? '0',
      'scenarios_conf': experiment.scenariosConf,
      'screenshot_name_generation_function': experiment.screenshotNameGenerationFunction,
      'screenshots_path': experiment.screenshotsPath,
      'size_balance': experiment.sizeBalance,
      'special_colnames': experiment.specialColnames,
      'status': experiment.status ?? '',
      'variability_conf': experiment.variabilityConf
    }, {})
  }
  return new FormData();
}

export function csvLogToJSON(seed: any, specialColnames: any): any {
  const colnames = JSON.parse(specialColnames);
  const screenshot_col_name = colnames["Screenshot"];
  delete colnames["Screenshot"];
  let case_conf: {[key:string]: any} = {};
  let scenario_conf: {[key:string]: any} = {};
  const results = Papa.parse(seed, { header: true, skipEmptyLines: true }) // object with { data, errors, meta }
  const rows = results.data // array of objects
  let variant: string = "";
  let id = 0;
  rows.forEach((row: any, index: number) => {
    if(variant!=row[colnames.Variant]){
      id = 1;
    } else {
      id++;
    }
    let columns_conf: {[key:string]: any} = {};
    let scenario_columns_conf: {[key:string]: any} = {};
    let has_values: boolean = false;
    Object.entries(row).forEach((col: any) => {
      if (col[0] != "" && !Object.values(colnames).includes(col[0])) {
        const this_column_conf: {[key:string]: any} = {
          "initValue": col[1],
          "variate": 0,
          "name": "",
          "args": {} // TODO: old versions of agosuirpa (backend) only support '[]'
        };
        columns_conf[col[0]] = this_column_conf;
        has_values = true;
        if(col[0]===screenshot_col_name){
          scenario_columns_conf[col[0]] = this_column_conf;
        }
      }
    });
    variant = row[colnames.Variant];
    const activity: string = id+"_"+row[colnames.Activity];
    if(has_values){
      if (!case_conf.hasOwnProperty(variant)) {
        let aux: { [key: string]: any } = {};
        aux[activity] = columns_conf;
        case_conf[variant] = aux;
      } else {
        case_conf[variant][activity] = columns_conf;
      }
      if (!scenario_conf.hasOwnProperty(variant)) {
        let sc_aux: { [key: string]: any } = {};
        sc_aux[activity] = scenario_columns_conf;
        scenario_conf[variant] = sc_aux;
      } else {
        scenario_conf[variant][activity] = scenario_columns_conf;
      }
    }
  });
  if(case_conf.hasOwnProperty("")){
    delete case_conf[""]
  }
  if(scenario_conf.hasOwnProperty("")){
    delete scenario_conf[""]
  }
  return { case_conf, scenario_conf };
}

function fallbackCopyTextToClipboard(text: string) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

export function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}