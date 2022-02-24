export interface ExperimentDTO {
  id: number
  name: string
  description: string
  number_scenarios: number
  variability_conf: any
  special_colnames: any
  screenshot_name_generation_function: string
  is_being_processed: number
  created_at: string
  foldername: string
  is_active: boolean
  scenarios_conf: any
  screenshots_path: string
}

export interface ExperimentResponse {
  count: number
  next: string
  previous: null
  results: ExperimentDTO[]
}