export const getParams = (query: string): Record<string, string> => {
  if (!query) {
    return {};
  }

  return query
    .substring(1)
    .split('&')
    .map(v => [...v.split('=', 1), v.substring(v.indexOf('=') + 1)])
    .reduce((params, [key, value]) => {
      const newParam: Record<string, string> = {};
      newParam[key] = decodeURIComponent(value);
      return { ...params, ...newParam };
    }, {});
};
