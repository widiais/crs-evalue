export const generatePIN = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}; 