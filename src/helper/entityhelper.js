export const filterAvail = (propertiesName, json) => {
  const data = {};
  Object.entries(json).map(([key, value]) => {
    if (propertiesName.includes(key)) {
      if (value === false || value === 0) {
      } else {
        if (!value) value = null;
      }

      data[key] = value;
    }
  });
  return data;
};
