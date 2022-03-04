<script setup lang="ts">
import { formatISO8601 } from '@/helpers/DateHelper';
import { ElLoading } from 'element-plus';
import { onMounted, ref } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import useAuth from './hooks/useAuth';
import { queryParse } from '@/helpers/UrlHelper';

const isShowSync = ref(false);
const isShowBackupDialog = ref(false);
const isLoadingBackupList = ref(false);
const { isLogin, loginUser, commentList, initLoginStatus, toLogin, getBackupList, backup, delBackup, restore } = useAuth();

const init = async () => {
  await initLoginStatus();
  isShowSync.value = true;
  // console.log(`isLogin : `, isLogin.value);
  const { code } = queryParse();
  if (code && isLogin.value) {
    sync();
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
  loadBackupList();
};

const loadBackupList = async () => {
  isLoadingBackupList.value = true;
  await getBackupList();
  isLoadingBackupList.value = false;
}

const add = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '备份中'
  });
  await backup();
  loadBackupList();
  loadingInstance.close();
};

const del = async (backupId: number) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '删除中'
  });
  await delBackup(backupId);
  loadBackupList();
  loadingInstance.close();
};
</script>

<template>
  <div>
    <SvgIcon
      v-if="isShowSync"
      class="w-[2rem] h-[2rem] cursor-pointer fixed top-4 right-4"
      name="sync"
      color="#1296db"
      @click="sync"
    />
    <div
      v-if="isShowBackupDialog"
      class="fixed top-0 left-0 bg-black/70 w-full h-full flex justify-center items-center px-1 md:px-6 z-10 box-border cursor-not-allowed overflow-hidden"
      @touchmove.prevent
      @mousewheel.prevent
    >
      <div
        class="w-full p-[0.5rem] md:w-[24rem] bg-white rounded-md mx-auto text-left leading-none z-20 relative max-h-[80%] overflow-auto"
      >
        <SvgIcon
          class="w-[2rem] h-[2rem] absolute top-[0.1rem] right-[0.4rem] cursor-pointer z-30"
          name="close"
          color="#999"
          @click="isShowBackupDialog = false"
        />
        <el-button class="mb-2" type="primary" @click="add">新增备份</el-button>
        <el-table
          v-loading="isLoadingBackupList"
          :data="commentList"
          stripe
          border
          empty-text="暂无数据"
        >
          <el-table-column label="备份时间">
            <template #default="scope">
              <div>{{ formatISO8601(scope.row.updated_at, 'yyyy-MM-dd HH:mm:ss') }}</div>
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作">
            <template #default="scope">
              <el-button @click="restore(scope.row.id)">还原</el-button>
              <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
