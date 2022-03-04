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
import useAuth from './components/auth/hooks/useAuth';
import Sync from './components/auth/Sync.vue';
// import NextPriceTable from './components/predict/NextPriceTable.vue';

const nextPriceTimer = ref(0);
const defaultStocks = [
  '1.510050', // 上证50ETF
  '0.159602', // 中国A50ETF
  '1.561990', // 沪深300增强ETF
  '1.510500', // 中证500ETF
  '1.512100', // 中证1000ETF
  '1.516970', // 基建50ETF
  '0.159928', // 消费ETF
  '1.512670', // 国防ETF
  '1.512660', // 军工ETF
  '1.516110', // 汽车ETF
  '1.512000', // 券商ETF
  '1.512480', // 半导体ETF
  '1.516160', // 新能源ETF
  '1.515030', // 新能车ETF
  '1.515790', // 光伏ETF
  '0.159867', // 畜牧ETF
  '0.159790', // 碳中和ETF
  '1.512760', // 芯片ETF
  '1.516100', // 互联网金融ETF
  '0.159997', // 电子ETF
  '0.159755', // 电池ETF
  '1.512980', // 传媒ETF
  '0.159828', // 医疗ETF
  '1.512170', // 医疗ETF
  '0.159883', // 医疗器械ETF
  '1.513050', // 中概互联网ETF
  '1.513330', // 恒生互联网ETF
  '0.159967', // 创成长ETF
  '0.159745', // 建材ETF
  '1.512200', // 房地产ETF
  '0.159825', // 农业ETF
  '0.159996', // 家电ETF
  '0.159992', // 创新药ETF
  '1.515250', // 智能汽车ETF
  '1.516780', // 稀土ETF
  '1.516150', // 稀土ETF基金
  '1.511220', // 城投债ETF
  '1.511260', // 十年国债ETF
  '0.159905', // 深红利ETF
  '1.511380', // 可转债ETF
  '1.513500', // 标普500ETF
  '0.161834', // 银华鑫锐LOF
  '1.501022', // 银华鑫盛LOF
  '0.159981', // 能源化工ETF
  '1.512890', // 红利低波ETF
  '1.512690', // 酒ETF
  '1.513100', // 纳指ETF
  '1.513300', // 纳斯达克ETF
  '1.510650' // 金融地产ETF
];
const {
  isTradeTime,
  isShowNextSwitchChange,
  nextSwitch,
  nextPriceStyleList,
  nextPriceStyle,
  calcNext,
  getLastTradeDate,
  stockEvtSource,
  initStockEventSource,
  changeHistoryRowNext
} = usePredict();
let { historyRows, getHistory, rowFilters, rowSelectedFilter, rowSorts, rowSelectedSort } = useStockHistory();
const { isShowStockDetail } = useStockDetail();

const nextSwitchChange = async () => {
  changeHistoryRowNext();
};

const initNextPriceList = async () => {
  if (!historyRows.value || historyRows.value.length === 0) {
    await Promise.allSettled(defaultStocks.map((secid) => calcNext(secid)));
  }
  if (!historyRows.value || historyRows.value.length === 0) {
    return;
  }
  const lastTradeDate = await getLastTradeDate();
  if (historyRows.value[0].nowPrice.dateStr !== lastTradeDate) {
    await Promise.allSettled(historyRows.value.map((row) => calcNext(`${row.market}.${row.code}`)));
  }
  if (historyRows.value[0].nowPrice.dateStr === lastTradeDate && isTradeTime.value) {
    initStockEventSource();
  } else {
    changeHistoryRowNext();
  }
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
