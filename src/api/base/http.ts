import fetchJsonp from 'fetch-jsonp';

export function jsonp<T>(url: string, options?: fetchJsonp.Options) {
  return fetchJsonp(url, {
    timeout: 1000 * 1,
    jsonpCallback: 'cb',
    ...options
  }).then((res) => res.json<T>());
}
