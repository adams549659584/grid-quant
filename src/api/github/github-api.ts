import { queryStringify } from '@/helpers/UrlHelper';
import { IAccessTokenResult } from './model/IAccessTokenResult';
import { ICommentResult } from './model/ICommentResult';
import { IGithubUser } from './model/IGithubUser';
import { IIssueResult } from './model/IIssueResult';

export async function fetchGithubByToken<T>(
  url: string,
  accessToken: string,
  method: 'GET' | 'POST' | 'DELETE' = 'GET',
  body = '',
  headerAccept: 'application/json' | 'application/vnd.github.v3.full+json' = 'application/json'
) {
  const opts: RequestInit = {
    method,
    headers: {
      Accept: headerAccept,
      Authorization: `token ${accessToken}`
    }
  };
  if (method === 'POST' && body) {
    opts.body = body;
  }
  return fetch(url, opts).then((res) => {
    if (method === 'DELETE') {
      return res.text() as any as T;
    }
    return res.json() as any as T;
  });
}

export async function fetchGithubByAuth<T>(url: string, clientID: string, clientSecret: string, method: 'GET' | 'POST' | 'DELETE' = 'GET') {
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
  const url = `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token`;
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

export async function getIssueByCreator(clientID: string, clientSecret: string, owner: string, repo: string, labels: string[], creator: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=${labels.join(',')}&creator=${creator}`;
  return fetchGithubByAuth<IIssueResult[]>(url, clientID, clientSecret, 'GET');
}

export async function createIssue(accessToken: string, owner: string, repo: string, title: string, body: string, labels: string[]) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
  const args = { title, body, labels };
  return fetchGithubByToken<IIssueResult>(url, accessToken, 'POST', JSON.stringify(args));
}

export async function getComments(accessToken: string, owner: string, repo: string, issueNumber: number) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
  return fetchGithubByToken<ICommentResult[]>(url, accessToken, 'GET', undefined, 'application/vnd.github.v3.full+json');
}
export async function getComment(accessToken: string, owner: string, repo: string, commentId: number) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/comments/${commentId}`;
  return fetchGithubByToken<ICommentResult>(url, accessToken, 'GET', undefined, 'application/vnd.github.v3.full+json');
}

export async function createComment(accessToken: string, owner: string, repo: string, issueNumber: number, body: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
  return fetchGithubByToken<ICommentResult>(url, accessToken, 'POST', body, 'application/vnd.github.v3.full+json');
}

export async function deleteComment(accessToken: string, owner: string, repo: string, commentId: number) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/comments/${commentId}`;
  return fetchGithubByToken(url, accessToken, 'DELETE', undefined, 'application/vnd.github.v3.full+json');
}

// https://docs.github.com/cn/rest/reference/issues#create-an-issue
