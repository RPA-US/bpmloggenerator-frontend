export interface VariabilityFunctionDTO {
    id: number
    id_code: string
    function_name: string
    filename: string
    path: string
    description: string
    params: number[]
    variability_function_category: CategoryDTO[]
}

export interface GUIComponentDTO {
    id: number
    name: string
    id_code: string
    filename: string
    path: string
    description: string
    gui_component_category: number
}

export interface FunctionParamDTO {
    id: number
    label: string
    placeholder: string
    data_type: string
    description: string
    validation_needs: any
}

export interface CategoryDTO {
    id: number
    name: string
    description: string
}

export interface CategoryResponsePaginated {
    count: number
    next: string
    previous: null
    results: CategoryDTO[]
}

export interface CategoryResponse {
    results: CategoryDTO[]
}

export interface VariabilityFunctionResponse {
    results: VariabilityFunctionDTO[]
}

export interface GUIComponentResponse {
    results: GUIComponentDTO[]
}

export interface FunctionParamResponse {
    results: FunctionParamDTO[]
}