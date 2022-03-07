import { getLoginLink, getAccessToken, getUser, getIssueByCreator, createIssue, getComments, getComment, createComment, deleteComment } from '@/api/github/github-api';
import { ref } from 'vue';
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
const commentList = ref<ICommentResult[]>();

const { historyRows, saveHistory } = useStockHistory();
const { pyramidConfigList, savePyramidConfig } = useGrid();

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
 * 获取备份列表
 */
const getBackupList = async () => {
  if (!loginUser.value) {
    ElMessage.error('请先登录');
    return;
  }
  const userIssues = await getIssueByCreator(CLIENT_ID, CLIENT_SECRETS, OWNER, REPO, loginUser.value.login);
  let userIssue: IIssueResult;
  const title = `db_stock_${loginUser.value.login}`;
  // console.log(`userIssues : `, userIssues);
  if (!userIssues || userIssues.length === 0) {
    const body = `当前为接口自动生成的备份数据，不要评论及修改`;
    userIssue = await createIssue(loginToken.value, OWNER, REPO, title, body);
    // console.log(`createIssue : `, userIssue);
  } else {
    const backupIssue = userIssues.find((x) => x.title === title);
    if (!backupIssue) {
      ElMessage.error('备份数据有误，请稍后重试');
      return;
    }
    userIssue = backupIssue;
    // console.log(`backupIssue : `, backupIssue);
  }
  loginUserIssue.value = userIssue;
  try {
    const comments = await getComments(loginToken.value, OWNER, REPO, userIssue.number);
    if (comments) {
      commentList.value = comments.filter((x) => x.body && x.body.split(',').every((x) => !Number.isNaN(+x))).reverse();
    } else {
      ElMessage.error('获取备份数据失败，请稍后重试');
    }
  } catch (error) {
    ElMessage.error(`获取备份数据失败，请稍后重试 : ${JSON.stringify(error)}`);
    return;
  }
  return commentList.value;
};

/**
 * 备份
 */
const backup = async () => {
  if (!loginUserIssue.value) {
    ElMessage.error('备份数据初始化异常，请稍后重试');
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
      ElMessage.error(`新增备份与 ${formatISO8601(existComment.updated_at, DATE_FORMAT)} 的备份一致，无需备份`);
      return;
    }
  }
  try {
    const createResult = await createComment(loginToken.value, OWNER, REPO, loginUserIssue.value.number, JSON.stringify(commentBody));
    if (!createResult.body) {
      ElMessage.error('备份失败，请稍后重试');
      return;
    }
    ElMessage.success('备份成功');
  } catch (error) {
    ElMessage.error(`备份失败，请稍后重试 : ${JSON.stringify(error)}`);
    return;
  }
};

/**
 * 还原备份
 */
const restore = async (backupId: number) => {
  if (!commentList.value) {
    ElMessage.error('备份数据初始化异常，请稍后重试');
    return;
  }
  const commentEnt = commentList.value.find((x) => x.id === backupId);
  if (!commentEnt || !commentEnt.body) {
    ElMessage.error(`未找到备份数据 - ${backupId}`);
    return;
  }
  const backupEnt = JSON.parse(unCompress(commentEnt.body)) as IBackupEnt;
  if (!backupEnt) {
    ElMessage.error(`备份数据 - ${backupId} 有误，请选择其他备份数据`);
    return;
  }
  historyRows.value = backupEnt.historys;
  pyramidConfigList.value = backupEnt.pyramids;
  saveHistory();
  savePyramidConfig();
  ElMessage.success(`已还原 ${formatISO8601(commentEnt.updated_at, DATE_FORMAT)} 的备份`);
};

/**
 * 删除备份
 */
const delBackup = async (backupId: number) => {
  if (!loginUserIssue.value) {
    ElMessage.error('备份数据初始化异常，请稍后重试');
    return;
  }
  try {
    await deleteComment(loginToken.value, OWNER, REPO, backupId);
    ElMessage.success('该备份已删除');
  } catch (error) {
    console.error(`delBackup : `, error);
    ElMessage.error('删除备份失败，请稍后重试');
  }
};

export default function useAuth() {
  return {
    isLogin,
    loginUser,
    commentList,
    initLoginStatus,
    toLogin,
    getBackupList,
    backup,
    restore,
    delBackup
  };
}
