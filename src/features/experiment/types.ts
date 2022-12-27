
export enum ExperimentState {
  NOT_LAUNCHED, // PRE_SAVED
  CREATING, // LAUNCHED
  CREATED, // SAVED
}
export interface Experiment {
  id: number
  name: string
  description: string
  creationDate: Date
  executionStart: Date
  executionEnd: Date
  lastEditionDate: Date
  state: ExperimentState
  numberScenarios: number
  variabilityConf: any
  scenariosConf: any
  foldername: string
  isActive: boolean
  isBeingProcessed: number
  screenshotNameGenerationFunction: string
  screenshotsPath: string
  sizeBalance: any
  specialColnames: any
  status: string | null
  isPublic: boolean
  author?: string
}

export interface ExperimentError {
  message: string
}

export interface Pagination {
  page: number
  total: number
  size?: number
  hasNext: boolean
}

export interface ExperimentsState {
  experiments: Experiment[]
  pagination: Pagination
  isLoading: boolean
  error: ExperimentError | null
  detail: Experiment | null
  seed_log: any | null
}

export interface ExperimentConfiguration {
  logSize: number[]
  numberOfScenarios: number
  seedLog: string
  variabilityConfig: string
  scenarioConfig: string | null

}

export interface UnbalancedVariantCase {
  variantKey: string
  value: number
}