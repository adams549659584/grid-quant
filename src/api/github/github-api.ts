import { queryStringify } from '@/helpers/UrlHelper';

// ### Client ID
// > a49f39a4ff0992e4a4e1
// ### Client secrets
// > ec0a698bc1d4f5671956902ebd6b602fbddf5876

export async function fetchGithub(url: string, accessToken: string) {
  return fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `token ${accessToken}`
    }
  }).then((res) => res.json());
}

export async function getLoginLink(clientID: string, redirectUri = window.location.href) {
  const githubOauthUrl = 'https://github.com/login/oauth/authorize';
  const query = {
    client_id: clientID,
    redirect_uri: redirectUri,
    scope: 'public_repo'
  };
  return `${githubOauthUrl}?${queryStringify(query)}`;
}

export async function getUser(accessToken: string) {
  return fetchGithub(`https://api.github.com/user`, accessToken);
}
