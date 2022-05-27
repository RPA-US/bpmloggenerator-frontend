import { GUIComponentType } from "./GUIComponentsCatalog/types";
import { GUIComponentDTO } from "infrastructure/http/dto/wizard";

export function guiComponentDTOToGUIComponent(guiComponent: GUIComponentDTO): GUIComponentType {

  return {
    id: guiComponent.id,
    idCode: guiComponent.id_code,
    category: guiComponent.gui_component_category,
    name: guiComponent.name,
    description: guiComponent.description ?? '',
    thumbnail: null,
    filename: guiComponent.filename,
    path: guiComponent.path
  }
}