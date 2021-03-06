import { getLoginLink, getAccessToken, getUser, getIssueByCreator, createIssue, getComments, getComment, createComment, deleteComment } from '@/api/github/github-api';
import { computed, ref } from 'vue';
import { queryParse } from '@/helpers/UrlHelper';
import { IGithubUser } from '@/api/github/model/IGithubUser';
import { ElMessage } from 'element-plus';
import { IIssueResult } from '@/api/github/model/IIssueResult';
import { ICommentResult } from '@/api/github/model/ICommentResult';
import useStockHistory from '@/components/history/hooks/useStockHistory';
import useGrid from '@/components/grid/hooks/useGrid';
import { IBackupEnt } from '@/api/github/model/IBackupEnt';
import { formatISO8601 } from '@/helpers/DateHelper';
import { compress, unCompress } from '@/helpers/CompressHelper';
import usePredict from '@/components/predict/hooks/usePredict';

const CLIENT_ID = import.meta.env.PROD ? 'a49f39a4ff0992e4a4e1' : 'e8b074f95d61ad093415';
const CLIENT_SECRETS = import.meta.env.PROD ? 'ec0a698bc1d4f5671956902ebd6b602fbddf5876' : 'e7fe47f759271189442d69a4a66592563a3fd5ea';
const ACCESS_TOKEN_CACHE_KEY = 'access_token';
const OWNER = 'adams549659584';
const REPO = 'grid-quant';
const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

const isLogin = ref(false);
const loginToken = ref('');
const loginUser = ref<IGithubUser>();
const loginUserIssue = ref<IIssueResult>();
const isQueryOtherBackup = ref(false);
const otherBackupCreator = ref('');
const myCommentList = ref<ICommentResult[]>();
const otherCommentList = ref<ICommentResult[]>();
const commentList = computed(() => {
  return isQueryOtherBackup.value ? otherCommentList.value : myCommentList.value;
});

const { historyRows, saveHistory } = useStockHistory();
const { pyramidConfigList, savePyramidConfig } = useGrid();
const { calcNext, getLastTradeDate } = usePredict();

const toLogin = () => {
  // window.location.href;
  const redirectUri = `${location.origin}${location.pathname}`;
  const loginUrl = getLoginLink(CLIENT_ID, redirectUri);
  return (window.location.href = loginUrl);
};
const initLoginStatus = async () => {
  let token = localStorage.getItem(ACCESS_TOKEN_CACHE_KEY) || '';
  if (token) {
    loginToken.value = token;
    loginUser.value = await getUser(token);
    if (loginUser.value.login) {
      isLogin.value = true;
      return;
    }
  }
  const { code } = queryParse();
  if (code) {
    const tokenResult = await getAccessToken(code, CLIENT_ID, CLIENT_SECRETS);
    if (tokenResult && tokenResult.access_token) {
      token = tokenResult.access_token;
      localStorage.setItem(ACCESS_TOKEN_CACHE_KEY, token);
      loginToken.value = token;
      loginUser.value = await getUser(token);
      isLogin.value = true;
    }
  }
};

/**
 * ??????????????????
 */
const getBackupList = async () => {
  if (!loginUser.value) {
    ElMessage.error('????????????');
    return;
  }
  const userIssues = await getIssueByCreator(CLIENT_ID, CLIENT_SECRETS, OWNER, REPO, loginUser.value.login);
  let userIssue: IIssueResult;
  const title = `db_stock_${loginUser.value.login}`;
  // console.log(`userIssues : `, userIssues);
  if (!userIssues || userIssues.length === 0) {
    const body = `??????????????????????????????????????????????????????????????????`;
    userIssue = await createIssue(loginToken.value, OWNER, REPO, title, body);
    // console.log(`createIssue : `, userIssue);
  } else {
    const backupIssue = userIssues.find((x) => x.title === title);
    if (!backupIssue) {
      ElMessage.error('????????????????????????????????????');
      return;
    }
    userIssue = backupIssue;
    // console.log(`backupIssue : `, backupIssue);
  }
  loginUserIssue.value = userIssue;
  try {
    const comments = await getComments(loginToken.value, OWNER, REPO, userIssue.number);
    if (comments) {
      myCommentList.value = comments.filter((x) => x.body && x.body.split(',').every((x) => !Number.isNaN(+x))).reverse();
    } else {
      ElMessage.error('??????????????????????????????????????????');
    }
  } catch (error) {
    ElMessage.error(`?????????????????????????????????????????? : ${JSON.stringify(error)}`);
    return;
  }
  return myCommentList.value;
};

const queryOtherBackupList = async (creator: string) => {
  const otherIssues = await getIssueByCreator(CLIENT_ID, CLIENT_SECRETS, OWNER, REPO, creator);
  if (otherIssues && otherIssues.length > 0) {
    const title = `db_stock_${creator}`;
    const otherIssue = otherIssues.find((x) => x.title === title);
    if (!otherIssue) {
      ElMessage.error(`????????? ${creator} ???????????????`);
      return;
    }
    const comments = await getComments(loginToken.value, OWNER, REPO, otherIssue.number);
    if (comments) {
      otherCommentList.value = comments.filter((x) => x.body && x.body.split(',').every((x) => !Number.isNaN(+x))).reverse();
    } else {
      ElMessage.error(`${creator} ???????????????????????????????????????`);
    }
  } else {
    ElMessage.error(`????????? ${creator} ???????????????`);
  }
};

/**
 * ??????
 */
const backup = async () => {
  if (!loginUserIssue.value) {
    ElMessage.error('?????????????????????????????????????????????');
    return;
  }
  const backupEnt: IBackupEnt = {
    historys: historyRows.value || [],
    pyramids: pyramidConfigList.value
  };
  const commentBody = {
    body: compress(JSON.stringify(backupEnt))
  };
  if (commentList.value && commentList.value.length > 0) {
    const existComment = commentList.value.find((x) => x.body === commentBody.body);
    if (existComment) {
      ElMessage.error(`??????????????? ${formatISO8601(existComment.updated_at, DATE_FORMAT)} ??????????????????????????????`);
      return;
    }
  }
  try {
    const createResult = await createComment(loginToken.value, OWNER, REPO, loginUserIssue.value.number, JSON.stringify(commentBody));
    if (!createResult.body) {
      ElMessage.error('??????????????????????????????');
      return;
    }
    ElMessage.success('????????????');
    myCommentList.value = [createResult, ...(myCommentList.value || [])];
  } catch (error) {
    ElMessage.error(`?????????????????????????????? : ${JSON.stringify(error)}`);
    return;
  }
};

/**
 * ????????????
 */
const restoreBackup = async (backupId: number) => {
  if (!commentList.value) {
    ElMessage.error('?????????????????????????????????????????????');
    return;
  }
  const commentEnt = commentList.value.find((x) => x.id === backupId);
  if (!commentEnt || !commentEnt.body) {
    ElMessage.error(`????????????????????? - ${backupId}`);
    return;
  }
  const backupEnt = JSON.parse(unCompress(commentEnt.body)) as IBackupEnt;
  if (!backupEnt) {
    ElMessage.error(`???????????? - ${backupId} ????????????????????????????????????`);
    return;
  }
  historyRows.value = backupEnt.historys;
  pyramidConfigList.value = backupEnt.pyramids;
  saveHistory();
  savePyramidConfig();
  ElMessage.success(`????????? ${formatISO8601(commentEnt.updated_at, DATE_FORMAT)} ?????????`);
  // ??????????????????????????????
  const lastTradeDate = await getLastTradeDate();
  const expiredRows = historyRows.value.filter((x) => x.nowPrice.dateStr !== lastTradeDate);
  if (expiredRows && expiredRows.length > 0) {
    await Promise.allSettled(expiredRows.map((row) => calcNext(`${row.market}.${row.code}`)));
  }
};

/**
 * ????????????
 */
const delBackup = async (backupId: number) => {
  if (!loginUserIssue.value) {
    ElMessage.error('?????????????????????????????????????????????');
    return;
  }
  try {
    await deleteComment(loginToken.value, OWNER, REPO, backupId);
    ElMessage.success('??????????????????');
    if (myCommentList.value) {
      myCommentList.value = myCommentList.value.filter((x) => x.id !== backupId);
    }
  } catch (error) {
    console.error(`delBackup : `, error);
    ElMessage.error('????????????????????????????????????');
  }
};

export default function useAuth() {
  return {
    isLogin,
    loginUser,
    myCommentList,
    otherCommentList,
    commentList,
    isQueryOtherBackup,
    otherBackupCreator,
    initLoginStatus,
    toLogin,
    getBackupList,
    backup,
    restoreBackup,
    delBackup,
    queryOtherBackupList
  };
}
