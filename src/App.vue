<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import { computed, ref } from 'vue'
import { ISearchResultRow } from './api/stock/model/ISearchResult';
import { search, getKLineM5, getKLineD1 } from './api/stock/stock-api';
import { formatNow } from './helpers/DateHelper';
import { calcNextPrice, INextPrice, mathRound } from './helpers/StockHelper';

const historySearchResultKey = 'history_search_results';
const searchKeyword = ref('');
const searchResultRows = ref<ISearchResultRow[]>();
const loading = ref(false);
const nextPrice = ref<INextPrice>();
// 最小网格比例0.8%
const minGridRate = 0.008;
const minGridOptCount = ref(5);
// 最小持仓
const minHoldCount = ref(1000);
const gridCount = ref(400);
const holdCount = ref(0);
const totalMoney = ref(100000);
const secid = computed(() => {
  if (!searchKeyword.value) {
    return '';
  }
  return searchKeyword.value.split('_')[0];
})

const query = async (keyword: string) => {
  if (keyword) {
    loading.value = true;
    const searchResults = await search(keyword);
    searchResultRows.value = searchResults.Data || [];
    loading.value = false;
  } else {
    searchResultRows.value = [];
  }
}
const getSearchHistory = () => {
  const historyStr = localStorage.getItem(historySearchResultKey);
  if (!historyStr) {
    return;
  }
  return JSON.parse(historyStr) as ISearchResultRow[];
};
const addSearchHistory = () => {
  let historys = getSearchHistory();
  if (!historys) {
    historys = [];
  }
  const existSearch = historys.find(x => `${x.MktNum}.${x.Code}_${x.Name}` === searchKeyword.value);
  if (!existSearch) {
    const currSearch = searchResultRows.value?.find(x => `${x.MktNum}.${x.Code}_${x.Name}` === searchKeyword.value);
    if (currSearch) {
      historys.push(currSearch);
    }
    localStorage.setItem(historySearchResultKey, JSON.stringify(historys));
  }
}

// 下次价格预测
const calcNext = async () => {
  if (secid.value) {
    addSearchHistory();
  }
  const defaultSecid = '1.000001';
  const klineD1 = await getKLineD1(secid.value || defaultSecid, 2);
  if (klineD1 && klineD1.data && klineD1.data.klineDatas && klineD1.data.klineDatas.length === 2) {
    const klineDatas = klineD1.data.klineDatas;
    const dateNowStr = formatNow('yyyy-MM-dd');
    // 当日收盘前
    if (klineDatas[1].dateStr === dateNowStr && (new Date()).getHours() < 15) {
      nextPrice.value = calcNextPrice(klineDatas[0].closePrice, klineDatas[0].highPrice, klineDatas[0].lowPrice);
    } else {
      nextPrice.value = calcNextPrice(klineDatas[1].closePrice, klineDatas[1].highPrice, klineDatas[1].lowPrice);
    }
    const dayOptRate = mathRound((nextPrice.value.highSalePrice - nextPrice.value.lowBuyPrice) / ((nextPrice.value.highSalePrice + nextPrice.value.lowBuyPrice) / 2), 2);
    let gridRate = mathRound(dayOptRate / minGridOptCount.value);
    if (gridRate < minGridRate) {
      gridRate = minGridRate;
    }
  } else {
    ElMessage.error('获取K线数据异常');
  }
}

// 回测
const backtesting = async () => {
  if (!secid.value) {
    ElMessage.error('请先选择股票/基金');
    return;
  }
  const loadingInstance = ElLoading.service({ lock: true });
  const klineM5 = await getKLineM5(secid.value);
  if (klineM5 && klineM5.data && klineM5.data.klineDatas && klineM5.data.klineDatas.length > 0) {
    holdCount.value = 0;
    totalMoney.value = 100000;
    console.log(`初始持仓 ${holdCount.value} ，  余额 ￥${totalMoney.value}`);
    const klineDatas = klineM5.data.klineDatas;
    const firstKline = klineDatas[0];
    let dateStr = firstKline.dateStr;
    let lastHighPrice = firstKline.highPrice;
    let lastLowPrice = firstKline.lowPrice;
    let lastClosePrice = firstKline.closePrice;
    let klineNextPrice = calcNextPrice(lastClosePrice, lastHighPrice, lastLowPrice);
    let optRate = mathRound((klineNextPrice.firstSalePrice - klineNextPrice.firstBuyPrice) / ((klineNextPrice.firstSalePrice + klineNextPrice.firstBuyPrice) / 2), 2);
    let gridRate = mathRound(optRate / minGridOptCount.value);
    if (gridRate < minGridRate) {
      gridRate = minGridRate;
    }
    // console.log(`gridRate : ${(gridRate * 100).toFixed(2)}%`);
    let todayOpenPrice = firstKline.openPrice;
    let lastOptPrice = todayOpenPrice;
    for (let i = 1; i < klineDatas.length; i++) {
      const kline = klineDatas[i];
      if (dateStr === kline.dateStr) {
        if (kline.highPrice > lastHighPrice) {
          lastHighPrice = kline.highPrice;
        }
        if (kline.lowPrice < lastLowPrice) {
          lastLowPrice = kline.lowPrice;
        }
        lastClosePrice = kline.closePrice;
      } else {
        console.log(`实际 : highPrice : ${lastHighPrice} , lowPrice : ${lastLowPrice} , closePrice : ${lastClosePrice}`);
        dateStr = kline.dateStr;
        console.log(`${dateStr} :`);
        todayOpenPrice = kline.openPrice;
        lastOptPrice = todayOpenPrice;
        klineNextPrice = calcNextPrice(lastClosePrice, lastHighPrice, lastLowPrice);
        console.log(`预测 : `, klineNextPrice);
        lastHighPrice = kline.highPrice;
        lastLowPrice = kline.lowPrice;
        optRate = mathRound((klineNextPrice.firstSalePrice - klineNextPrice.firstBuyPrice) / ((klineNextPrice.firstSalePrice + klineNextPrice.firstBuyPrice) / 2), 2);
        gridRate = mathRound(optRate / minGridOptCount.value);
        if (gridRate < minGridRate) {
          gridRate = minGridRate;
        }
        console.log(`网格幅度 : ${(gridRate * 100).toFixed(2)}%`);
      }
      if (holdCount.value < minHoldCount.value && kline.openPrice > klineNextPrice.firstBuyPrice && kline.openPrice < klineNextPrice.firstSalePrice) {
        const buyCount = minHoldCount.value - holdCount.value;
        const money = mathRound(buyCount * kline.openPrice, 2);
        lastOptPrice = kline.openPrice;
        holdCount.value = mathRound(holdCount.value + buyCount);
        totalMoney.value = mathRound(totalMoney.value - money);
        console.log(`${kline.dateStr} ${kline.timeStr}： 低于最小持仓，￥${kline.openPrice} 买入 ${buyCount} 股 , 支出 ￥${money} ， 持仓 ${holdCount.value} ， 余额 ￥${totalMoney.value} ， 市值 ￥${(kline.closePrice * holdCount.value + totalMoney.value).toFixed(2)}`);
      }
      const klineRate = (kline.openPrice / lastOptPrice) - 1;
      if (Math.abs(klineRate) > gridRate) {
        if (holdCount.value > 0 && kline.openPrice > klineNextPrice.highSalePrice) {
          const saleCount = holdCount.value;
          const money = mathRound(saleCount * kline.openPrice, 2);
          lastOptPrice = kline.openPrice;
          holdCount.value = mathRound(holdCount.value - saleCount);
          totalMoney.value = mathRound(totalMoney.value + money);
          console.log(`${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 止盈卖出 ${saleCount} 股 , 收入 ￥${money} ， 持仓 ${holdCount.value} ，  余额 ￥${totalMoney.value} ， 市值 ￥${(kline.openPrice * holdCount.value + totalMoney.value).toFixed(2)}`);
        }
        else if (holdCount.value > 0 && kline.openPrice < klineNextPrice.lowBuyPrice) {
          const saleCount = holdCount.value;
          const money = mathRound(saleCount * kline.openPrice, 2);
          lastOptPrice = kline.openPrice;
          holdCount.value = mathRound(holdCount.value - saleCount);
          totalMoney.value = mathRound(totalMoney.value + money);
          console.log(`${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 止损卖出 ${saleCount} 股 , 收入 ￥${money} ， 持仓 ${holdCount.value} ，  余额 ￥${totalMoney.value} ， 市值 ￥${(kline.openPrice * holdCount.value + totalMoney.value).toFixed(2)}`);
        }
        else if (klineRate > 0 && holdCount.value - gridCount.value >= minHoldCount.value) {
          const saleCount = gridCount.value;
          const money = mathRound(saleCount * kline.openPrice, 2);
          lastOptPrice = kline.openPrice;
          holdCount.value = mathRound(holdCount.value - saleCount);
          totalMoney.value = mathRound(totalMoney.value + money);
          console.log(`${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 网格卖出 ${saleCount} 股 , 收入 ￥${money} ， 持仓 ${holdCount.value} ，  余额 ￥${totalMoney.value} ， 市值￥ ${(kline.openPrice * holdCount.value + totalMoney.value).toFixed(2)}`);
        } else if (klineRate < 0 && kline.openPrice > klineNextPrice.lowBuyPrice) {
          const buyCount = gridCount.value;
          const money = mathRound(buyCount * kline.openPrice, 2);
          if (totalMoney.value < money) {
            console.log(`${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 余额 ￥${totalMoney.value} 不足以购买本次网格， 市值￥ ${(kline.openPrice * holdCount.value + totalMoney.value).toFixed(2)}`);
            continue;
          }
          lastOptPrice = kline.openPrice;
          holdCount.value = mathRound(holdCount.value + buyCount);
          totalMoney.value = mathRound(totalMoney.value - money);
          console.log(`${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 网格买入 ${buyCount} 股 , 支出 ￥${money} ， 持仓 ${holdCount.value} ，  余额 ￥${totalMoney.value} ， 市值￥ ${(kline.openPrice * holdCount.value + totalMoney.value).toFixed(2)}`);
        }
      }
    }
    console.log(`当前持仓 ${holdCount.value} ，  余额 ￥${totalMoney.value}，  市值 ￥${(klineDatas[klineDatas.length - 1].closePrice * holdCount.value + totalMoney.value).toFixed(2)}`);
    loadingInstance.close();
  } else {
    ElMessage.error('获取K线数据异常');
  }
}


const init = async () => {
  searchResultRows.value = getSearchHistory();
  const loadingInstance = ElLoading.service({ lock: true, fullscreen: true });
  await calcNext();
  loadingInstance.close();
}
init();
</script>

<template>
  <div class="container">
    <header class="header">
      <h1 class="flex-center">
        <span>网格交易策略</span>
        <a class="flex-center" href="https://github.com/adams549659584/grid-quant" target="_blank">
          <img
            class="github-link"
            src="./assets/images/github.png"
            alt="https://github.com/adams549659584/grid-quant"
          />
        </a>
      </h1>
    </header>
    <main class="main">
      <header class="search">
        <el-select
          size="large"
          v-model="searchKeyword"
          :clearable="true"
          filterable
          remote
          reserve-keyword
          placeholder="请选择股票/基金"
          :remote-method="query"
          :loading="loading"
          @change="calcNext"
        >
          <el-option
            v-for="item in searchResultRows"
            :key="`${item.MktNum}.${item.Code}_${item.Name}`"
            :label="`${item.Code} ${item.Name} ${item.SecurityTypeName}`"
            :value="`${item.MktNum}.${item.Code}_${item.Name}`"
          ></el-option>
        </el-select>
        <el-button class="btn-backtesting" size="large" type="danger" @click="backtesting">回测</el-button>
      </header>
      <main>
        <div v-if="nextPrice" class="flex-center next-price">
          <div class="flex-row flex-row-header">
            <div class="flex-column">下个交易日价格预测</div>
          </div>
          <div class="flex-row flex-row-header">
            <div class="flex-column">操作</div>
            <div class="flex-column">价格</div>
          </div>
          <div class="flex-row high-sale-price">
            <div class="flex-column">极限获利位</div>
            <div
              class="flex-column"
            >{{ nextPrice.highSalePrice.toFixed(3) }}(+{{ nextPrice.highSaleRate }}%)</div>
          </div>
          <div class="flex-row first-sale-price">
            <div class="flex-column">第一压力位</div>
            <div
              class="flex-column"
            >{{ nextPrice.firstSalePrice.toFixed(3) }}(+{{ nextPrice.firstSaleRate }}%)</div>
          </div>
          <div class="flex-row first-buy-price">
            <div class="flex-column">第一支撑位</div>
            <div
              class="flex-column"
            >{{ nextPrice.firstBuyPrice.toFixed(3) }}(-{{ nextPrice.firstBuyRate }}%)</div>
          </div>
          <div class="flex-row low-buy-price">
            <div class="flex-column">极限抄底位</div>
            <div
              class="flex-column"
            >{{ nextPrice.lowBuyPrice.toFixed(3) }}(-{{ nextPrice.lowBuyRate }}%)</div>
          </div>
          <div class="flex-row">
            <div class="flex-column">振幅</div>
            <div
              class="flex-column"
            >{{ (nextPrice.firstSaleRate + nextPrice.firstBuyRate).toFixed(2) }}% - {{ (nextPrice.highSaleRate + nextPrice.lowBuyRate).toFixed(2) }}%</div>
          </div>
        </div>
      </main>
    </main>
    <footer class="footer">
      <div>
        <p class="text">
          MIT Licensed | Copyright © 2022
          <a
            href="https://github.com/adams549659584"
            target="_blank"
          >adams549659584</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
@import "assets/css/reset.css";

.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 80rem;
  min-height: 100vh;
  margin: 0 auto;
  padding: 1rem;

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .flex-row {
    @extend .flex-center;
    border: 0.01rem solid #dcdfe6;
    width: 100%;
    &:not(:first-child) {
      border-top: none;
    }
    &.flex-row-header {
      font-size: 1.4rem;
      font-weight: bold;
    }
    .flex-column {
      border-left: 0.01rem solid #dcdfe6;
      flex: 1;
      padding: 0.8rem;
      &:first-child {
        border-left: none;
      }
    }
  }

  .text {
    margin: 0;
    text-align: center;
    line-height: 1.4;
    font-size: 0.9rem;
    color: var(--c-text-light);
  }
  .header {
    padding: 1rem;
    .github-link {
      width: 1.2rem;
      margin-left: 0.4rem;
    }
  }
  .main {
    padding-bottom: 2rem;
    .search {
      padding-bottom: 1rem;
      .btn-backtesting {
        margin-left: 1rem;
      }
    }

    .next-price {
      color: #000;
      font-size: 1.2rem;
      font-weight: 600;
      .flex-column {
        width: 50%;
      }
      .high-sale-price {
        background: rgb(239 118 118);
      }
      .first-sale-price {
        background: rgb(251 162 162);
      }
      .first-buy-price {
        background: rgb(100 246 225);
      }
      .low-buy-price {
        background: rgb(34 237 174);
      }
    }
  }
  .footer {
    padding-bottom: 1rem;
  }
}
</style>
