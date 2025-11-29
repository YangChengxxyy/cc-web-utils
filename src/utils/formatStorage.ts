export const formatStorage = (bytes: number): string => {
  const gbSize = bytes / (1024 * 1024);
  if (gbSize >= 1) {
    return Math.floor(gbSize) + 'GB';
  } else {
    return Math.floor(bytes / 1024) + 'MB';
  }
};
