export type IDict<T = string> = { [key in string]: T };

export const queryParse = (search = window.location.search) => {
  if (!search) return {};
  const queryString = search[0] === '?' ? search.substring(1) : search;
  const query: IDict = {};
  queryString.split('&').forEach((queryStr) => {
    const [key, value] = queryStr.split('=');
    if (key) query[decodeURIComponent(key)] = decodeURIComponent(value);
  });

  return query;
};

export const queryStringify = (query: IDict) => {
  const queryString = Object.keys(query)
    .map((key) => `${key}=${encodeURIComponent(query[key] || '')}`)
    .join('&');
  return queryString;
};
