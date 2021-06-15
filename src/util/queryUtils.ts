export const getParams = (query: string) => {
  if (!query) {
    return {};
  }

  return query
    .substring(1)
    .split('&')
    .map(v => v.split('='))
    .reduce((params, [key, value]) => {
      const newParam: { [index: string]: any } = {};
      newParam[key] = decodeURIComponent(value);
      return { ...params, ...newParam };
    }, {});
};
