
export interface Experiment {
  id: number,
  name: string,
  description: string,
  launchDate: Date,
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
  experiments: Experiment[],
  pagination: Pagination,
  isLoading: boolean,
  error: ExperimentError | null
}

export interface ExperimentConfiguration {
  logSize: number[],
  numberOfScenarios: number,
  seedLog: string,
  variabilityConfig: string,
  scenarioConfig: string | null,

}

export interface UnbalancedVariantCase {
  variantKey: string,
  value: number,
}