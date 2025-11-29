function getImageDimensions(
  file: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = file;
  });
}

export default getImageDimensions;
