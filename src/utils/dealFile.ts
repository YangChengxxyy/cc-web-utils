export const createFormData = (data: Record<string, any>): FormData => {
  const form = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value !== undefined && value !== null) {
      if (Array.isArray(value) && value.every((item) => item instanceof File)) {
        value.forEach((item) => {
          form.append(key, item);
        });
      } else {
        form.append(key, value);
      }
    }
  });
  return form;
};

const dealFileKey = (obj: Record<string, any>, key: string) => {
  const newObj = { ...obj };
  const value = newObj[key];
  if (Array.isArray(value) && value.every((item) => item instanceof File)) {
    newObj.imgs = value;
    if (key !== 'imgs') {
      delete newObj[key];
    }
  } else {
    newObj.imgIds = Array.isArray(value) ? value : [value];
    if (key !== 'imgIds') {
      delete newObj[key];
    }
  }
  return createFormData(newObj);
};

export default dealFileKey;
