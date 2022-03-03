import * as githubApi from '@/api/github/github-api';
import { ref } from 'vue';
import { queryParse } from '@/helpers/UrlHelper';

const CLIENT_ID = import.meta.env.PROD ? 'a49f39a4ff0992e4a4e1' : 'e8b074f95d61ad093415';
const CLIENT_SECRETS = import.meta.env.PROD ? 'ec0a698bc1d4f5671956902ebd6b602fbddf5876' : 'e7fe47f759271189442d69a4a66592563a3fd5ea';
const ACCESS_TOKEN_CACHE_KEY = 'access_token';
const OWNER = 'adams549659584';
const REPO = 'grid-quant';

const isLogin = ref(false);

const getAuthToken = () => localStorage.getItem(ACCESS_TOKEN_CACHE_KEY) || '';

const toLogin = () => {
  const loginUrl = githubApi.getLoginLink(CLIENT_ID, window.location.href);
  return (window.location.href = loginUrl);
};
const initLoginStatus = async () => {
  let token = getAuthToken();
  if (token) {
    isLogin.value = true;
    return;
  }
  const { code } = queryParse();
  if (code) {
    const tokenResult = await githubApi.getAccessToken(code, CLIENT_ID, CLIENT_SECRETS);
    if (tokenResult && tokenResult.access_token) {
      token = tokenResult.access_token;
      localStorage.setItem(ACCESS_TOKEN_CACHE_KEY, token);
      isLogin.value = true;
    }
  }
};

const getUserInfo = async () => {
  return githubApi.getUser(getAuthToken());
};

const getIssueById = async (issueNumber: number) => {
  return githubApi.getIssueById(CLIENT_ID, CLIENT_SECRETS, OWNER, REPO, issueNumber);
};

export default function useAuth() {
  return {
    isLogin,
    initLoginStatus,
    toLogin,
    getUserInfo,
    getIssueById
  };
}
