export const enforceString = (value: any) => {
  if (typeof value !== 'string') {
    throw new Error(`Expected string, got ${typeof value}`);
  }
};

export const enforceStringNumber = (value: any) => {
  enforceString(value);

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    throw new Error(`Expected number, got ${value}`);
  }
};
