
export const objectToFormData = (data: any, fileContents: any): FormData => {
  const formData = new FormData();
    Object.keys(data)
      .forEach(key => {
        const value = (fileContents as any)[key] ?? data[key];
        if (value instanceof FileList) {
          if (value[0] != null) {
            formData.append(key, value[0])
          }
        } else if (value != null) {
          if (typeof value === 'string') {
            if (value.trim() !== '') formData.append(key, value.trim())
          } else {
            formData.append(key, value)
          }
        }
      });

    return formData;
}