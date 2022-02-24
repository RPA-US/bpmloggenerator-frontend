
export const downloadFile = function downloadFile(filename: string, blob: Blob) {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    filename,
  );
  document.body.appendChild(link);
  link.click();
  link?.parentNode?.removeChild(link);
}