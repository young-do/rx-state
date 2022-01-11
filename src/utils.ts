export const itself = <T>(value: T) => value;
export const is_empty = (obj: {}) => Object.keys(obj).length === 0;
export const is_not_same_date = (a: any, b: any) => a instanceof Date && b instanceof Date && +a !== +b;
export const safe_not_equal = (a: any, b: any) =>
  a !== a
    ? b === b
    : a !== b ||
      is_not_same_date(a, b) ||
      (a && (typeof a === 'object' || typeof a === 'function') && !is_empty(a) && !is_empty(b));
export const __array_unique = <T>(array: T[], callback: (item: T) => any = itself): T[] => {
  const check = Object.create(null);
  const result: T[] = [];

  array.forEach(item => {
    const key = callback(item);
    if (!check[key]) {
      check[key] = true;
      result.push(item);
    }
  });

  return result;
};
