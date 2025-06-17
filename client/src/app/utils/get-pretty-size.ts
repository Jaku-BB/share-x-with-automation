export const getPrettySize = (size: number) => {
  const units = ["B", "KB", "MB"];
  let unitIndex = 0;
  let currentSize = size;

  while (currentSize >= 1024) {
    currentSize /= 1024;
    unitIndex++;
  }

  return [Math.round(currentSize), units[unitIndex]] as const;
};
