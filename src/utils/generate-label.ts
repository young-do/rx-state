export const createLabelerWithCount = (label: string, initCount = 0) => {
  let count = initCount;
  return () => `#${count++}-${label}`;
};
