<script setup lang="ts">
import { IFundStock } from '@/api/stock/model/IFundHoldDetailResult';
import { getFundHoldDetail } from '@/api/stock/stock-api';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import useStockDetail from './hooks/useStockDetail';
import KLineDetail from './KLineDetail.vue';

const { isShowStockDetail, stockActiveInfo, klineTypes, stockActiveTab } = useStockDetail();
const closeStockDetail = () => (isShowStockDetail.value = false);
const lastStockActiveTab = ref(stockActiveTab.value);
const fundHoldDetails = ref<IFundStock[]>();
const fundHoldDetailLastUpdateTime = ref('');

const tabClick = async () => {
  if (!stockActiveInfo.value) {
    ElMessage.error('股票信息有误！');
    return;
  }
  // if (stockActiveTab.value === '持仓明细') {
  //   const fundHoldDetailResult = await getFundHoldDetail(stockActiveInfo.value.code);
  //   if (fundHoldDetailResult.Datas && fundHoldDetailResult.Datas.fundStocks && fundHoldDetailResult.Datas.fundStocks.length > 0) {
  //     fundHoldDetails.value = fundHoldDetailResult.Datas.fundStocks;
  //     fundHoldDetailLastUpdateTime.value = fundHoldDetailResult.Expansion;
  //   }
  // }
  if (stockActiveTab.value === lastStockActiveTab.value) {
    console.log(`已打开 : `, lastStockActiveTab.value);
  } else {
    lastStockActiveTab.value = stockActiveTab.value;
    console.log(`切换 ： `, stockActiveTab.value);
  }
};

onMounted(() => {});
</script>

<template>
  <div
    class="fixed -top-[999rem] -left-[999rem] md:top-0 md:left-0 bg-black/70 w-full h-full flex justify-center items-center px-1 md:px-6 z-10 box-border cursor-not-allowed overflow-hidden"
    @touchmove.prevent
    @mousewheel.prevent
  >
    <div class="w-full p-[0.5rem] md:w-[50rem] bg-white rounded-md mx-auto text-center leading-none z-20 relative">
      <SvgIcon class="w-[2rem] h-[2rem] absolute top-[0.1rem] right-[0.4rem] cursor-pointer z-3" name="close" color="#999" @click="closeStockDetail" />
      <div class="w-full">
        <h1 class="p-2 pb-4" v-if="stockActiveInfo">{{ `${stockActiveInfo.code} ${stockActiveInfo.name}` }}</h1>
        <main>
          <el-tabs type="border-card" v-model="stockActiveTab" class="demo-tabs" @tab-click="tabClick">
            <el-tab-pane v-for="item in klineTypes" :label="item" :name="item" lazy>
              <!-- <div v-if="item === '持仓明细'">
                <div v-if="fundHoldDetails && fundHoldDetails.length > 0">
                  <h1>截止日期：{{ fundHoldDetailLastUpdateTime }}</h1>
                  <el-table :data="fundHoldDetails" stripe :border="true">
                    <el-table-column prop="GPDM" label="代码" />
                    <el-table-column prop="GPJC" label="名称" />
                    <el-table-column prop="JZBL" label="持仓占比" />
                    <el-table-column prop="PCTNVCHG" label="较上期" />
                  </el-table>
                </div>
              </div> -->
              <KLineDetail class="w-full h-96" />
            </el-tab-pane>
          </el-tabs>
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
