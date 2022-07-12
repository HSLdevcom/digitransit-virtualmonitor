export const getParams: any = (query: string) => {
  if (!query) {
    return {};
  }

  return query
    .substring(1)
    .split('&')
    .map(v => [...v.split('=', 1), v.substring(v.indexOf('=') + 1)])
    .reduce((params, [key, value]) => {
      const newParam: { [index: string]: any } = {};
      newParam[key] = decodeURIComponent(value);
      return { ...params, ...newParam };
    }, {});
};
