<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import StockSearch from './components/search/StockSearch.vue';
import useStockHistory from './components/history/hooks/useStockHistory';
import usePredict from './components/predict/hooks/usePredict';
import NextPriceBox from './components/predict/NextPriceBox.vue';

const nextPriceTimer = ref<NodeJS.Timeout>();
const { isTradeTime, isShowNextSwitchChange, nextSwitch, calcNext } = usePredict();

const nextSwitchChange = async () => {
  initNextPriceList();
};

const initNextPriceList = async () => {
  const { historyRows, getHistory } = useStockHistory();
  historyRows.value = getHistory();
  if (historyRows.value.length > 0) {
    historyRows.value.forEach((row) => calcNext(`${row.market}.${row.code}`));
  } else {
    [
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
    ].forEach((secid) => calcNext(secid));
  }
  if (isTradeTime) {
    nextPriceTimer.value = setTimeout(() => {
      initNextPriceList();
    }, 1000 * 30);
  }
};

const init = () => {
  initNextPriceList();
};
init();

onBeforeUnmount(() => {
  if (nextPriceTimer.value) {
    clearTimeout(nextPriceTimer.value);
  }
});
</script>

<template>
  <div>
    <header>
      <h1 class="flex justify-center items-center flex-wrap">
        <span class="text-3xl font-bold p-4">价格预测</span>
        <a class="cursor-pointer" href="https://github.com/adams549659584/grid-quant" target="_blank">
          <img src="./assets/images/github.png" alt="https://github.com/adams549659584/grid-quant" />
        </a>
      </h1>
    </header>
    <main>
      <header class="flex justify-center items-center flex-wrap space-x-4">
        <el-switch v-if="isShowNextSwitchChange" v-model="nextSwitch" inline-prompt active-text="预" inactive-text="回" @change="nextSwitchChange" />
        <stock-search />
        <!-- <el-button class="btn-backtesting"
                   size="large"
                   type="danger"
        @click="backtesting">回测</el-button>-->
      </header>
      <main>
        <!-- <div v-if="historyRows" class="flex-center justify-around">
          <div v-for="(row, index) in historyRows" :key="index" class="border p-3 w-[11rem]">
            <div class="w-full truncate">{{ `${row.name}(${row.nowPrice.closePrice.toFixed(3)})` }}</div>
            <div>{{ row.nextPrice.highSalePrice.toFixed(3) }}(+{{ row.nextPrice.highSaleRate.toFixed(2) }}%)</div>
            <div>{{ row.nextPrice.firstSalePrice.toFixed(3) }}(+{{ row.nextPrice.firstSaleRate.toFixed(2) }}%)</div>
            <div>{{ row.nextPrice.firstBuyPrice.toFixed(3) }}(-{{ row.nextPrice.firstBuyRate.toFixed(2) }}%)</div>
            <div>{{ row.nextPrice.lowBuyPrice.toFixed(3) }}(-{{ row.nextPrice.lowBuyRate.toFixed(2) }}%)</div>
          </div>
        </div> -->
        <next-price-box />
      </main>
    </main>
    <footer>
      <div class="p-4 text-gray-400">
        <p class="flex-center space-x-2">
          <span>MIT Licensed | Copyright © 2022</span>
          <a href="https://github.com/adams549659584" target="_blank">adams549659584</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss"></style>
