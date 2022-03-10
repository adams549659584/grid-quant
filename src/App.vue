<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
import StockSearch from './components/search/StockSearch.vue';
import useStockHistory from './components/history/hooks/useStockHistory';
import usePredict from './components/predict/hooks/usePredict';
import GridHeader from './components/header/GridHeader.vue';
import GridFooter from './components/footer/GridFooter.vue';
import NextPriceCard from './components/predict/NextPriceCard.vue';
import MiniNextPriceCard from './components/predict/MiniNextPriceCard.vue';
import StockDetail from './components/stockDetail/StockDetail.vue';
import useStockDetail from './components/stockDetail/hooks/useStockDetail';
import Sync from './components/auth/Sync.vue';
// import NextPriceTable from './components/predict/NextPriceTable.vue';

const nextPriceTimer = ref(0);
const {
  isTradeTime,
  isShowNextSwitchChange,
  nextSwitch,
  nextPriceStyleList,
  nextPriceStyle,
  stockEvtSource,
  initNextPriceList,
  changeHistoryRowNext
} = usePredict();
let { historyRows, getHistory, rowFilters, rowSelectedFilter, rowSorts, rowSelectedSort } = useStockHistory();
const { isShowStockDetail } = useStockDetail();

const nextSwitchChange = async () => {
  changeHistoryRowNext();
};

const init = async () => {
  historyRows.value = getHistory();
  initNextPriceList();
};

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  if (nextPriceTimer.value) {
    clearTimeout(nextPriceTimer.value);
  }
  if (stockEvtSource.value) {
    stockEvtSource.value.close();
  }
});
</script>

<template>
  <div>
    <Sync />
    <grid-header />
    <main class="min-h-[80vh]">
      <header class="flex justify-center items-center space-x-1 md:space-x-4 overflow-hidden flex-wrap">
        <el-switch v-if="isShowNextSwitchChange" v-model="nextSwitch" inline-prompt active-text="预" inactive-text="回" @change="nextSwitchChange" />
        <stock-search />
        <div class="flex justify-center items-center space-x-1 md:space-x-4 overflow-hidden flex-wrap mt-4 md:mt-0">
          <el-select class="w-[6.5rem]" v-model="nextPriceStyle">
            <el-option v-for="item in nextPriceStyleList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select class="w-[6.5rem]" v-model="rowSelectedFilter">
            <el-option v-for="item in rowFilters" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select class="w-[5.5rem]" v-model="rowSelectedSort">
            <el-option v-for="item in rowSorts" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </header>
      <main>
        <NextPriceCard v-if="nextPriceStyle === 'Card'" />
        <MiniNextPriceCard v-else-if="nextPriceStyle === 'MiniCard'" />
        <!-- <NextPriceTable v-else-if="nextPriceStyle === 'Table'" /> -->
        <StockDetail v-if="isShowStockDetail" />
      </main>
    </main>
    <grid-footer />
  </div>
</template>

<style lang="scss"></style>
