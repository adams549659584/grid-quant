import fetchJsonp from 'fetch-jsonp';

export function jsonp<T>(url: string, options?: fetchJsonp.Options) {
  return fetchJsonp(
    url,
    options || {
      timeout: 1000 * 5,
      jsonpCallback: 'cb'
    }
  ).then((res) => res.json<T>());
}
