<script setup lang="ts">
import { onMounted } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import useStockDetail from './hooks/useStockDetail';
import KLineDetail from './KLineDetail.vue';

const { isShowStockDetail, stockActiveInfo, klineTypes, stockActiveTab, lastStockActiveTab, tabChange, fundHoldDetails, isLoadingHoldDetails } = useStockDetail();
const closeStockDetail = () => (isShowStockDetail.value = false);


onMounted(() => { });
</script>

<template>
  <div
    class="fixed -top-[999rem] -left-[999rem] md:top-0 md:left-0 bg-black/70 w-full h-full flex justify-center items-center px-1 md:px-6 z-10 box-border cursor-not-allowed overflow-hidden"
    @touchmove.prevent
    @mousewheel.prevent
  >
    <div
      class="w-full p-[0.5rem] md:w-[50rem] bg-white rounded-md mx-auto text-center leading-none z-20 relative"
    >
      <SvgIcon
        class="w-[2rem] h-[2rem] absolute top-[0.1rem] right-[0.4rem] cursor-pointer z-3"
        name="close"
        color="#999"
        @click="closeStockDetail"
      />
      <div class="w-full">
        <h1
          class="p-2 pb-4"
          v-if="stockActiveInfo"
        >{{ `${stockActiveInfo.code} ${stockActiveInfo.name}` }}</h1>
        <main>
          <el-tabs
            type="border-card"
            v-model="stockActiveTab"
            class="demo-tabs"
            @tab-click="tabChange"
          >
            <el-tab-pane v-for="item in klineTypes" :label="item" :name="item" lazy>
              <div v-if="item === '持仓明细'">
                <el-table
                  v-loading="isLoadingHoldDetails"
                  :data="fundHoldDetails"
                  stripe
                  border
                  empty-text="暂无相关持仓数据"
                >
                  <el-table-column prop="code" label="代码" />
                  <el-table-column prop="name" label="名称" />
                  <el-table-column prop="holdPercentage" label="持仓占比" />
                  <el-table-column prop="holdCount" label="持股数（万股）" />
                  <el-table-column prop="holdAmt" label="持仓市值（万元）" />
                </el-table>
              </div>
              <KLineDetail v-else class="w-full h-96" />
            </el-tab-pane>
          </el-tabs>
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
