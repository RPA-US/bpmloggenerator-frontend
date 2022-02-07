
export interface Experiment {
  id: number,
  name: string,
  launchDate: Date,
}

export interface ExperimentError {
  message: string
}

export interface ExperimentsState {
  experiments: Experiment[],
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