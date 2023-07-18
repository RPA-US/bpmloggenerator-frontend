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

export const checkPassword = (password: string) => {
  //Check the password has at least 8 characters, one capital letter, one lower case letter, one number and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
  if (passwordRegex.test(password)) {
    return true;
  }
  return false;
}