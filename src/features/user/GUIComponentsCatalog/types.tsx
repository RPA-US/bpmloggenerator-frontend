
export interface GUIComponentType {
  id: number | null
  idCode: string
  category: number
  name: string
  description?: string
  thumbnail: Blob |  null
  filename?: string,
  path?: string
}

export interface GUIComponentCategoryType {
  id: number,
  name: string
  description: string
}