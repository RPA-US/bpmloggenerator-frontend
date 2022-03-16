export default class Validations {
    
  static isBlank(str: string) {
    return str == null || str.trim() === '';
  }

  static isPositiveInteger(str: string) {
    const num = Number(str);
    if (Number.isInteger(num) && num >= 0) {
      return true;
    }
    return false;
  }

}