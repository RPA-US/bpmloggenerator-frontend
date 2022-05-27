
export const objectToFormData = (data: any, fileContents: any, fieldTransformFunction?: Function): FormData => {
  const formData = new FormData();
    Object.keys(data)
      .forEach(key => {
        const value = (fileContents as any)[key] ?? data[key];
        const parsedKey = typeof fieldTransformFunction === 'function' ? fieldTransformFunction(key): key;
        if (value instanceof FileList) {
          if (value[0] != null) {
            formData.append(parsedKey, value[0])
          }
        } else if (value != null) {
          if (typeof value === 'string') {
            if (value.trim() !== '') formData.append(parsedKey, value.trim())
          } else if (typeof value === 'object') {
            formData.append(parsedKey, JSON.stringify(value))
          } else {
            formData.append(parsedKey, value)
          }
        }
      });

    return formData;
}

export const camelToSnakeCase = (str: string) => str
  .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  .substring(1);