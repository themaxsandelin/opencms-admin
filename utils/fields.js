export function getLocalizedInputDefaultValue() {
  return {
    type: 'localized-input',
    values: {}
  };
}

export function convertStringToLocalizedValue(stringValue) {
  const value = getLocalizedInputDefaultValue();
  value.values.previous = stringValue;
  return value;
}
