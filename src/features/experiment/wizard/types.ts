

export interface IParams {
    [id: string]: any
  }
  
  export interface ICoordinates {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    resolutionIMG: Array<Number>,
    randomColor: string,
    processed: boolean,
    function_variability: number,
    gui_component: number,
    params: IParams,
    dependency:IDependency
  }
  
  export interface IElements {
    [name: string]: ICoordinates
  }

  export interface ElementError {
    code: string
  }
  
  export interface wizardState{
    elements: {[name: string]: ICoordinates},
    seed: any,
    scenario_variability: any,
    case_variability: any
  }

export interface IArguments{
    id: number,
    coordinates: number[],
    name: string,
    dependency?: IDependency,
    args: IParams
}

export interface IScreenshot{
  [name: string]: IArguments[]
}

export interface IDependency{
  Activity: string,
  V: number,
  id: number
}