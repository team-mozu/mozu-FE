type EnableFalsyType = string | number | boolean;

export const isTruthValues = (values: EnableFalsyType | EnableFalsyType[]) => {
  if (Array.isArray(values)) {
    const { length } = values;
    const filteredValues = values.filter((value) => value);
    if (filteredValues.length === length) {
      return true;
    }
  } else if (values) return true;

  return false;
};
