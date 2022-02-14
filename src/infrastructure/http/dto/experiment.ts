export interface ExperimentDTO {
  size_balance: any,
  name: string,
  description: string,
  number_scenarios: number,
  variability_conf: any,
  generation_mode: string,
  special_colnames: any,
  screenshot_name_generation_function: string
}

export interface ExperimentResponse {
  count: number
  next: string
  previous: null
  results: ExperimentDTO[]
}