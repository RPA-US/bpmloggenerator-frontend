

export interface IParams {
    [id: number]: any
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
    params: IParams
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
