<script setup lang="ts">
import { formatISO8601 } from '@/helpers/DateHelper';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import useAuth from './hooks/useAuth';
import { queryParse } from '@/helpers/UrlHelper';
import useStockHistory from '../history/hooks/useStockHistory';
import usePredict from '../predict/hooks/usePredict';

const isShowSync = ref(false);
const isShowBackupDialog = ref(false);
const isLoadingBackupList = ref(false);
const {
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
  delBackup,
  restoreBackup,
  queryOtherBackupList
} = useAuth();

const init = async () => {
  await initLoginStatus();
  isShowSync.value = true;
  // console.log(`isLogin : `, isLogin.value);
  const { code } = queryParse();
  if (code && isLogin.value) {
    sync();
    window.history.replaceState(null, '', window.location.pathname);
  }
};

onMounted(() => {
  init();
});

const sync = async () => {
  // const loadingInstance = ElLoading.service({
  //   lock: true,
  //   text: '授权中'
  // });
  if (!isLogin.value) {
    return toLogin();
  }
  // console.log(`loginUser : `, loginUser.value);
  // loadingInstance.close();
  isShowBackupDialog.value = true;
  loadBackupList(!myCommentList.value || myCommentList.value.length === 0);
};

const loadBackupList = async (isLoading = true) => {
  isLoadingBackupList.value = isLoading;
  if (isQueryOtherBackup.value) {
    await queryOtherBackupList(otherBackupCreator.value);
  } else {
    await getBackupList();
  }
  isLoadingBackupList.value = false;
};

const add = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '备份中'
  });
  await backup();
  loadBackupList(false);
  loadingInstance.close();
};

const del = async (backupId: number) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '删除中'
  });
  await delBackup(backupId);
  loadBackupList(false);
  loadingInstance.close();
};

const restore = async (backupId: number) => {
  restoreBackup(backupId).then((res) => {
    const { initNextPriceList } = usePredict();
    initNextPriceList();
  });
};

const toMyBackup = async () => {
  isQueryOtherBackup.value = false;
  loadBackupList(!myCommentList.value || myCommentList.value.length === 0);
};
const queryOtherBackup = async () => {
  const { isMobileScreen } = useStockHistory();
  if (isMobileScreen) {
    const creator = window.prompt('请输入大佬的ID');
    if (creator) {
      isQueryOtherBackup.value = true;
      console.log(`creator : `, creator);
      console.log(`otherBackupCreator : `, otherBackupCreator.value);
      const isLoading = otherBackupCreator.value !== creator;
      otherBackupCreator.value = creator.trim();
      if (isLoading) {
        otherCommentList.value = [];
      }
      await loadBackupList(isLoading);
    } else {
      ElMessage.info('已返回我的备份');
    }
  } else {
    ElMessageBox.prompt('请输入大佬的ID', undefined, {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(async ({ value }) => {
        isQueryOtherBackup.value = true;
        const isLoading = otherBackupCreator.value !== value;
        otherBackupCreator.value = value.trim();
        if (isLoading) {
          otherCommentList.value = [];
        }
        await loadBackupList(isLoading);
      })
      .catch(() => {
        ElMessage.info('已返回我的备份');
      });
  }
};
</script>

<template>
  <div>
    <div class="cursor-pointer absolute top-4 right-4 flex justify-center items-center space-x-1">
      <h1 v-if="loginUser" class="hidden md:block text-gray-500">{{ loginUser.login }}</h1>
      <SvgIcon class="w-[2rem] h-[2rem]" v-if="isShowSync" name="sync" color="#1296db" @click="sync" />
    </div>
    <div
      v-if="isShowBackupDialog"
      class="fixed top-0 left-0 bg-black/70 w-full h-full flex justify-center items-center px-1 md:px-6 z-10 box-border cursor-not-allowed overflow-hidden"
      @touchmove.prevent
      @mousewheel.prevent
    >
      <div class="w-full p-[0.5rem] md:w-[24rem] bg-white rounded-md mx-auto text-left leading-none z-20 relative max-h-[80%] overflow-auto">
        <SvgIcon class="w-[2rem] h-[2rem] absolute top-[0.1rem] right-[0.4rem] cursor-pointer z-30" name="close" color="#999" @click="isShowBackupDialog = false" />
        <el-button v-if="isQueryOtherBackup" class="mb-2" type="success" @click="toMyBackup">返回我的备份</el-button>
        <el-button v-else class="mb-2" type="success" @click="queryOtherBackup">查看大佬备份</el-button>
        <el-button v-if="!isQueryOtherBackup" class="mb-2" type="primary" @click="add">新增备份</el-button>
        <el-table v-loading="isLoadingBackupList" :data="commentList" stripe border empty-text="暂无数据">
          <el-table-column label="备份时间">
            <template #default="scope">
              <div>{{ formatISO8601(scope.row.updated_at, 'yyyy-MM-dd HH:mm:ss') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作">
            <template #default="scope">
              <el-button @click="restore(scope.row.id)">还原</el-button>
              <el-button v-if="!isQueryOtherBackup" type="danger" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
