<script setup lang="ts">
import { formatISO8601 } from '@/helpers/DateHelper';
import { compress, unCompress } from '@/helpers/CompressHelper';
import { ElLoading } from 'element-plus';
import { onMounted, ref } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import useAuth from './hooks/useAuth';

const isShowSync = ref(false);
const isShowBackupDialog = ref(false);
const { isLogin, loginUser, commentList, initLoginStatus, toLogin, getBackupList, backup, delBackup, restore } = useAuth();

const init = async () => {
  await initLoginStatus();
  isShowSync.value = true;
  console.log(`isLogin : `, isLogin.value);
};

onMounted(() => {
  init();
  const str = compress('testzho中啊ad,okdakkl:jkahd');
  console.log(`str : `, str);
  const rawStr = unCompress(str);
  console.log(`raw str : `, rawStr);
});

const sync = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '授权中'
  });
  if (!isLogin.value) {
    return toLogin();
  }
  console.log(`loginUser : `, loginUser.value);
  isShowBackupDialog.value = true;
  getBackupList();
  loadingInstance.close();
};

const add = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '备份中'
  });
  await backup();
  getBackupList();
  loadingInstance.close();
};

const del = async (backupId: number) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '删除中'
  });
  await delBackup(backupId);
  getBackupList();
  loadingInstance.close();
};
</script>

<template>
  <div>
    <SvgIcon v-if="isShowSync" class="w-[2rem] h-[2rem] cursor-pointer fixed top-4 right-4" name="sync" color="#1296db" @click="sync" />
    <el-dialog v-model="isShowBackupDialog" title="云备份">
      <el-button class="my-4" type="primary" @click="add">新增备份</el-button>
      <el-table :data="commentList" stripe border empty-text="暂无数据">
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
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
