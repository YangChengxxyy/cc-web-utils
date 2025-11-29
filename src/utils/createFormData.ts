/**
 * 嵌套对象转FormData
 * @param formData
 * @param data
 * @param parentKey
 */
export const appendFormData = (formData: any, data: any, parentKey = '') => {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (Array.isArray(value)) {
        if (value.length > 0 && value[0] instanceof File) {
          // 如果是文件列表，文件列表需特殊处理
          value.forEach((file) => {
            formData.append(`${fullKey}`, file);
          });
        } else {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              appendFormData(formData, item, `${fullKey}[${index}]`);
            } else {
              formData.append(`${fullKey}[${index}]`, item); // 将数组值作为对象属性值直接添加到 FormData 中
            }
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        if (value instanceof File) {
          formData.append(fullKey, value);
        } else {
          appendFormData(formData, value, fullKey);
        }
      } else {
        if (value !== undefined && value !== null) {
          formData.append(fullKey, value);
        }
      }
    }
  }
};

const createFormData = (data: Record<string, any>): FormData => {
  const form = new FormData();
  appendFormData(form, data);
  return form;
};

export default createFormData;
