import { ExperimentDTO } from 'infrastructure/http/dto/experiment';
import { Experiment, ExperimentState } from './types';

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
    specialColnames: experiment.description,
    status: null
  }
}
