import { queryStringify } from '@/helpers/UrlHelper';
import { IAccessTokenResult } from './model/IAccessTokenResult';
import { IGithubUser } from './model/IGithubUser';

export async function fetchGithubByToken<T>(url: string, accessToken: string, method: 'GET' | 'POST' = 'GET', body?: string) {
  return fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `token ${accessToken}`
    },
    body
  }).then((res) => res.json() as any as T);
}

export async function fetchGithubByAuth<T>(url: string, clientID: string, clientSecret: string, method: 'GET' | 'POST' = 'GET') {
  return fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: 'Basic ' + window.btoa(`${clientID}:${clientSecret}`)
    }
  }).then((res) => res.json() as any as T);
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
  return fetchGithubByToken<IGithubUser>(url, accessToken);
}

export async function getIssueById(clientID: string, clientSecret: string, owner: string, repo: string, number: number) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;
  return fetchGithubByAuth(url, clientID, clientSecret, 'GET');
}

export async function getIssueByLabels(clientID: string, clientSecret: string, owner: string, repo: string, labels: string[]) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=${labels.join(',')}`;
  return fetchGithubByAuth(url, clientID, clientSecret, 'GET');
}

export async function createIssue(accessToken: string, owner: string, repo: string, title: string, body: string, labels: string[]) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
  const args = { title, body, labels };
  return fetchGithubByToken(url, accessToken, 'POST', JSON.stringify(args));
}

export async function getComments() {}

export async function createComment(accessToken: string) {
  const url = ``;
  return fetchGithubByToken(url, accessToken);
}

// https://docs.github.com/cn/rest/reference/issues#create-an-issue