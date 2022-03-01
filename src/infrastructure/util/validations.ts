export default class Validations {
    
  static isBlank(str: string) {
    return str == null || str.trim() === '';
  }

}