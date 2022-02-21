export interface ExperimentDTO {
  id: number,
  size_balance: any,
  name: string,
  description: string,
  number_scenarios: number,
  variability_conf: any,
  special_colnames: any,
  screenshot_name_generation_function: string
}

export interface ExperimentResponse {
  count: number
  next: string
  previous: null
  results: ExperimentDTO[]
}