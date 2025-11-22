export const id = (prefix?: string) => `${prefix || id}_` + Date.now();
export const target = (id: string) => `#${id}`;

export const str = (value: unknown, defaultValue?: string) =>
  value || defaultValue || "";
("");
export const num = (value: string) => {
  if (Number.isNaN(Number(value))) {
    return NaN;
  }
  return +value;
};
