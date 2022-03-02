import { queryStringify } from '@/helpers/UrlHelper';
import { IAccessTokenResult } from './model/IAccessTokenResult';

export async function fetchGithub(url: string, accessToken: string, method: 'GET' | 'POST' = 'GET') {
  return fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `token ${accessToken}`
    }
  }).then((res) => res.json());
}

export function getLoginLink(clientID: string, redirectUri = window.location.href) {
  const githubOauthUrl = 'https://github.com/login/oauth/authorize';
  const query = {
    client_id: clientID,
    redirect_uri: redirectUri,
    scope: 'public_repo'
  };
  return `${githubOauthUrl}?${queryStringify(query)}`;
}

export async function getAccessToken(code: string, clientID: string, clientSecret: string) {
  const url = `https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token`;
  const query = {
    code,
    client_id: clientID,
    client_secret: clientSecret
  };
  return fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(query)
  }).then((res) => res.json() as any as IAccessTokenResult);
}

export async function getUser(accessToken: string) {
  const url = `https://api.github.com/user`;
  return fetchGithub(url, accessToken);
}
