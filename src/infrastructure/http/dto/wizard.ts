export interface VariabilityFunctionDTO {
    id: number
    id_code: string
    function_name: string
    filename: string
    path: string
    description: string
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

export interface FunctionParamCategoryDTO {
    id: number
    label: string
    placeholder: string
    data_type: string
    description: string
    validation_needs: any
}

export interface FunctionParamDTO {
    id: number
    order: number
    id_code: string
    description: string
    function_param_category: FunctionParamCategoryDTO
    validation_needs: any
    variability_function: VariabilityFunctionDTO
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

export interface FunctionParamCategoryResponse {
    results: FunctionParamCategoryDTO[]
}
