<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import { computed, ref, onBeforeUnmount } from 'vue';
import { ISearchResultRow } from './api/stock/model/ISearchResult';
import { search, getKLineM5, getKLineD1 } from './api/stock/stock-api';
import { formatNow } from './helpers/DateHelper';
import { calcNextPrice, mathRound } from './helpers/StockHelper';
import { Delete, CaretRight, CircleClose } from '@element-plus/icons-vue';
import { IHistoryRow } from './api/stock/model/IHistoryRow';

const historySearchResultKey = 'history_search_results';
const nextSwitch = ref(true);
const isShowSearchResult = ref(false);
const searchKeyword = ref('');
const searchResultRows = ref<ISearchResultRow[]>();
const historyRows = ref<IHistoryRow[]>();
const loading = ref(false);
// 是否交易时间内
const dateNowHM = Number(formatNow('Hmm'));
const isTradeTime = dateNowHM >= 930 && dateNowHM <= 1500;
// const isShowNextSwitchChange = window.screen.width > 500 && !isTradeTime;
const isShowNextSwitchChange = !isTradeTime;

// 最小网格比例0.8%
const minGridRate = 0.008;
const minGridOptCount = ref(5);
// 最小持仓
const minHoldCount = ref(1000);
const gridCount = ref(400);
const holdCount = ref(0);
const totalMoney = ref(100000);
const nextPriceTimer = ref(0);
const secid = ref('');
const isShowBacktestingLog = ref(false);
const backtestingLogs = ref<string[]>([]);

const changeSearchResultShow = (isShow: boolean) => {
  if (isShow) {
    isShowSearchResult.value = isShow;
  } else {
    setTimeout(() => {
      isShowSearchResult.value = isShow;
    }, 300);
  }
};

const nextSwitchChange = async () => {
  initNextPriceList();
};

const query = async () => {
  if (searchKeyword.value) {
    loading.value = true;
    const searchResults = await search(searchKeyword.value);
    searchResultRows.value = searchResults.Data || [];
    loading.value = false;
  } else {
    searchResultRows.value = [];
  }
};
const getHistory = () => {
  const historyStr = localStorage.getItem(historySearchResultKey);
  if (!historyStr) {
    return [];
  }
  return JSON.parse(historyStr) as IHistoryRow[];
};
const updateHistory = (newHistory: IHistoryRow) => {
  let historys = getHistory();
  const existHistoryIndex = historys.findIndex((x) => newHistory.market === x.market && newHistory.code === x.code && newHistory.name === x.name);
  if (existHistoryIndex > -1) {
    historys[existHistoryIndex] = newHistory;
  } else {
    historys = [newHistory, ...historys];
  }
  historyRows.value = historys;
  localStorage.setItem(historySearchResultKey, JSON.stringify(historys));
};

const selectChange = async (val: string) => {
  backtestingLogs.value.push(`selectChange : `, val);
  secid.value = val;
  return calcNext(val);
};
// 下次价格预测
const calcNext = async (secid: string) => {
  const klineD1 = await getKLineD1(secid, 2);
  if (klineD1 && klineD1.data && klineD1.data.klineDatas && klineD1.data.klineDatas.length === 2) {
    const klineDatas = klineD1.data.klineDatas;
    const dateNowStr = formatNow('yyyy-MM-dd');
    // 当日收盘前
    const klineData = !nextSwitch.value || (klineDatas[1].dateStr === dateNowStr && new Date().getHours() < 15) ? klineDatas[0] : klineDatas[1];
    const nextPrice = calcNextPrice(klineData.closePrice, klineData.highPrice, klineData.lowPrice);
    const dayOptRate = mathRound((nextPrice.highSalePrice - nextPrice.lowBuyPrice) / ((nextPrice.highSalePrice + nextPrice.lowBuyPrice) / 2), 2);
    let gridRate = mathRound(dayOptRate / minGridOptCount.value);
    if (gridRate < minGridRate) {
      gridRate = minGridRate;
    }
    updateHistory({
      market: klineD1.data.market,
      code: klineD1.data.code,
      name: klineD1.data.name,
      nowPrice: klineDatas[1],
      nextPrice
    });
  } else {
    ElMessage.error('获取K线数据异常');
  }
};

const delHistory = (row: IHistoryRow) => {
  let historys = getHistory();
  historys = historys.filter((x) => !(row.market === x.market && row.code === x.code && row.name === x.name));
  historyRows.value = historys;
  localStorage.setItem(historySearchResultKey, JSON.stringify(historys));
};

// 回测
const backtesting = async (secid: string) => {
  const loadingInstance = ElLoading.service({ lock: true });
  const klineM5 = await getKLineM5(secid);
  loadingInstance.close();
  if (klineM5 && klineM5.data && klineM5.data.klineDatas && klineM5.data.klineDatas.length > 0) {
    isShowBacktestingLog.value = true;
    backtestingLogs.value = [];
    holdCount.value = 0;
    totalMoney.value = 100000;
    backtestingLogs.value.push(`初始持仓 ${holdCount.value} ，  余额 ￥${totalMoney.value}`);
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
    // backtestingLogs.value.push(`gridRate : ${(gridRate * 100).toFixed(2)}%`);
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
        // backtestingLogs.value.push(`实际 : highPrice : ${lastHighPrice} , lowPrice : ${lastLowPrice} , closePrice : ${lastClosePrice}`);
        dateStr = kline.dateStr;
        // backtestingLogs.value.push(`${dateStr} :`);
        todayOpenPrice = kline.openPrice;
        lastOptPrice = todayOpenPrice;
        klineNextPrice = calcNextPrice(lastClosePrice, lastHighPrice, lastLowPrice);
        // backtestingLogs.value.push(`预测 : ${JSON.stringify(klineNextPrice)}`);
        lastHighPrice = kline.highPrice;
        lastLowPrice = kline.lowPrice;
        optRate = mathRound((klineNextPrice.firstSalePrice - klineNextPrice.firstBuyPrice) / ((klineNextPrice.firstSalePrice + klineNextPrice.firstBuyPrice) / 2), 2);
        gridRate = mathRound(optRate / minGridOptCount.value);
        if (gridRate < minGridRate) {
          gridRate = minGridRate;
        }
        // backtestingLogs.value.push(`网格幅度 : ${(gridRate * 100).toFixed(2)}%`);
      }
      if (holdCount.value < minHoldCount.value && kline.openPrice > klineNextPrice.firstBuyPrice && kline.openPrice < klineNextPrice.firstSalePrice) {
        const buyCount = minHoldCount.value - holdCount.value;
        const money = mathRound(buyCount * kline.openPrice, 2);
        lastOptPrice = kline.openPrice;
        if (totalMoney.value < money) {
          backtestingLogs.value.push(
            `${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 余额 ￥${totalMoney.value} 不足以建仓${buyCount}， 市值￥ ${(
              kline.openPrice * holdCount.value +
              totalMoney.value
            ).toFixed(2)}`
          );
          continue;
        }
        holdCount.value = mathRound(holdCount.value + buyCount);
        totalMoney.value = mathRound(totalMoney.value - money);
        backtestingLogs.value.push(
          `${kline.dateStr} ${kline.timeStr}： 低于最小持仓，￥${kline.openPrice} 买入 ${buyCount} 股 , 支出 ￥${money} ， 持仓 ${holdCount.value} ， 余额 ￥${
            totalMoney.value
          } ， 市值 ￥${(kline.closePrice * holdCount.value + totalMoney.value).toFixed(2)}`
        );
      }
      const klineRate = kline.openPrice / lastOptPrice - 1;
      if (Math.abs(klineRate) > gridRate) {
        if (holdCount.value > 0 && kline.openPrice > klineNextPrice.highSalePrice) {
          const saleCount = holdCount.value;
          const money = mathRound(saleCount * kline.openPrice, 2);
          lastOptPrice = kline.openPrice;
          holdCount.value = mathRound(holdCount.value - saleCount);
          totalMoney.value = mathRound(totalMoney.value + money);
          backtestingLogs.value.push(
            `${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 止盈卖出 ${saleCount} 股 , 收入 ￥${money} ， 持仓 ${holdCount.value} ，  余额 ￥${
              totalMoney.value
            } ， 市值 ￥${(kline.openPrice * holdCount.value + totalMoney.value).toFixed(2)}`
          );
        } else if (holdCount.value > 0 && kline.openPrice < klineNextPrice.lowBuyPrice) {
          const saleCount = holdCount.value;
          const money = mathRound(saleCount * kline.openPrice, 2);
          lastOptPrice = kline.openPrice;
          holdCount.value = mathRound(holdCount.value - saleCount);
          totalMoney.value = mathRound(totalMoney.value + money);
          backtestingLogs.value.push(
            `${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 止损卖出 ${saleCount} 股 , 收入 ￥${money} ， 持仓 ${holdCount.value} ，  余额 ￥${
              totalMoney.value
            } ， 市值 ￥${(kline.openPrice * holdCount.value + totalMoney.value).toFixed(2)}`
          );
        } else if (klineRate > 0 && holdCount.value - gridCount.value >= minHoldCount.value) {
          const saleCount = gridCount.value;
          const money = mathRound(saleCount * kline.openPrice, 2);
          lastOptPrice = kline.openPrice;
          holdCount.value = mathRound(holdCount.value - saleCount);
          totalMoney.value = mathRound(totalMoney.value + money);
          backtestingLogs.value.push(
            `${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 网格卖出 ${saleCount} 股 , 收入 ￥${money} ， 持仓 ${holdCount.value} ，  余额 ￥${
              totalMoney.value
            } ， 市值￥ ${(kline.openPrice * holdCount.value + totalMoney.value).toFixed(2)}`
          );
        } else if (klineRate < 0 && kline.openPrice > klineNextPrice.lowBuyPrice) {
          const buyCount = gridCount.value;
          const money = mathRound(buyCount * kline.openPrice, 2);
          if (totalMoney.value < money) {
            backtestingLogs.value.push(
              `${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 余额 ￥${totalMoney.value} 不足以购买本次网格， 市值￥ ${(
                kline.openPrice * holdCount.value +
                totalMoney.value
              ).toFixed(2)}`
            );
            continue;
          }
          lastOptPrice = kline.openPrice;
          holdCount.value = mathRound(holdCount.value + buyCount);
          totalMoney.value = mathRound(totalMoney.value - money);
          backtestingLogs.value.push(
            `${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 网格买入 ${buyCount} 股 , 支出 ￥${money} ， 持仓 ${holdCount.value} ，  余额 ￥${
              totalMoney.value
            } ， 市值￥ ${(kline.openPrice * holdCount.value + totalMoney.value).toFixed(2)}`
          );
        }
      }
    }
    backtestingLogs.value.push(
      `当前持仓 ${holdCount.value} ，  余额 ￥${totalMoney.value}，  市值 ￥${(klineDatas[klineDatas.length - 1].closePrice * holdCount.value + totalMoney.value).toFixed(2)}`
    );
  } else {
    ElMessage.error('获取K线数据异常');
  }
};

const closeBacktesting = async () => {
  isShowBacktestingLog.value = false;
};

const initNextPriceList = async () => {
  historyRows.value = getHistory();
  if (historyRows.value.length > 0) {
    historyRows.value.forEach((row) => calcNext(`${row.market}.${row.code}`));
  } else {
    ['1.000001', '1.000300', '1.000905', '0.399006'].forEach((secid) => calcNext(secid));
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
  clearTimeout(nextPriceTimer.value);
});
</script>

<template>
  <div class="container">
    <header class="header">
      <h1 class="flex-center">
        <span>价格预测</span>
        <a class="flex-center"
           href="https://github.com/adams549659584/grid-quant"
           target="_blank">
          <img class="github-link"
               src="./assets/images/github.png"
               alt="https://github.com/adams549659584/grid-quant" />
        </a>
      </h1>
    </header>
    <main class="main">
      <header class="search">
        <el-switch v-if="isShowNextSwitchChange"
                   v-model="nextSwitch"
                   inline-prompt
                   active-text="预"
                   inactive-text="回"
                   @change="nextSwitchChange" />
        <div class="stock-search">
          <input class="stock-search-input"
                 type="text"
                 placeholder="请输入股票/基金代码"
                 v-model="searchKeyword"
                 @focus="changeSearchResultShow(true)"
                 @blur="changeSearchResultShow(false)"
                 @input="query">
          <div v-show="isShowSearchResult">
            <ul v-if="searchResultRows && searchResultRows.length > 0"
                class="stock-search-result">
              <li v-for="item in searchResultRows"
                  :key="`${item.MktNum}.${item.Code}_${item.Name}`"
                  @click="selectChange(`${item.MktNum}.${item.Code}`)">{{`${item.Code} ${item.Name} ${item.SecurityTypeName}`}}</li>
            </ul>
            <ul v-else-if="searchKeyword.length > 0"
                class="stock-search-result">
              <li>暂无相关股票/基金</li>
            </ul>
            <ul v-else
                class="stock-search-result">
              <li>输入股票/基金 编码/简拼/全拼/中文</li>
            </ul>
          </div>
        </div>
        <!-- <el-button class="btn-backtesting"
                   size="large"
                   type="danger"
                   @click="backtesting">回测</el-button> -->
      </header>
      <main>
        <div v-if="historyRows"
             class="next-price-box">
          <div v-for="(row, index) in historyRows"
               :key="index"
               class="cus-table next-price">
            <div class="cus-row cus-row-header">
              <div class="cus-column">
                <span class="stock-name">{{ `${row.code} ${row.name}` }}</span>
                <el-button class="btn-opt"
                           type="primary"
                           :icon="CaretRight"
                           circle
                           @click="backtesting(`${row.market}.${row.code}`)"></el-button>
                <el-button class="btn-opt"
                           type="danger"
                           :icon="Delete"
                           circle
                           @click="delHistory(row)"></el-button>
              </div>
            </div>
            <div class="cus-row cus-row-header">
              <div class="cus-column">操作</div>
              <div class="cus-column close-price"
                   :class="{'close-price-red':row.nowPrice.closePrice > (row.nextPrice.firstSalePrice + row.nextPrice.firstBuyPrice)/2}">价格({{ row.nowPrice.closePrice.toFixed(3) }})</div>
            </div>
            <div class="cus-row high-sale-price">
              <div class="cus-column">极限获利位</div>
              <div class="cus-column">{{ row.nextPrice.highSalePrice.toFixed(3) }}(+{{ row.nextPrice.highSaleRate }}%)</div>
            </div>
            <div class="cus-row first-sale-price">
              <div class="cus-column">第一压力位</div>
              <div class="cus-column">{{ row.nextPrice.firstSalePrice.toFixed(3) }}(+{{ row.nextPrice.firstSaleRate }}%)</div>
            </div>
            <div class="cus-row first-buy-price">
              <div class="cus-column">第一支撑位</div>
              <div class="cus-column">{{ row.nextPrice.firstBuyPrice.toFixed(3) }}(-{{ row.nextPrice.firstBuyRate }}%)</div>
            </div>
            <div class="cus-row low-buy-price">
              <div class="cus-column">极限抄底位</div>
              <div class="cus-column">{{ row.nextPrice.lowBuyPrice.toFixed(3) }}(-{{ row.nextPrice.lowBuyRate }}%)</div>
            </div>
            <div class="cus-row">
              <div class="cus-column">振幅</div>
              <div class="cus-column">
                {{ (row.nextPrice.firstSaleRate + row.nextPrice.firstBuyRate).toFixed(2) }}% - {{ (row.nextPrice.highSaleRate + row.nextPrice.lowBuyRate).toFixed(2) }}%
              </div>
            </div>
          </div>
          <div v-show="isShowBacktestingLog"
               class="backtesting-log-bg">
            <div class="backtesting-log-container">
              <div v-for="(item,index) in backtestingLogs"
                   :key="index"
                   class="backtesting-log-item">{{ item }}
              </div>
              <el-button type="danger"
                         :icon="CircleClose"
                         @click="closeBacktesting">看完了
              </el-button>
            </div>
          </div>
        </div>
      </main>
    </main>
    <footer class="footer">
      <div>
        <p class="text">
          MIT Licensed | Copyright © 2022
          <a href="https://github.com/adams549659584"
             target="_blank">adams549659584</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
@import 'assets/css/reset.css';

.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 117rem;
  min-height: 100vh;
  margin: 0 auto;

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .cus-table {
    .cus-row {
      @extend .flex-center;
      border: 0.01rem solid #dcdfe6;
      width: 100%;
      &:not(:first-child) {
        border-top: none;
      }
      &.cus-row-header {
        font-size: 1.4rem;
        font-weight: bold;
      }
      .cus-column {
        @extend .flex-center;
        border-left: 0.01rem solid #dcdfe6;
        flex: 1;
        padding: 0.8rem;
        &:first-child {
          border-left: none;
        }
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
  .text-over {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .clear {
    &::after {
      content: '';
      display: block;
      clear: both;
    }
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
      @extend .flex-center;
      .stock-search {
        position: relative;
        width: 15rem;
        margin-left: 1rem;
        .stock-search-input {
          height: 2.5rem;
          line-height: 2.5rem;
          border: 1px solid #c0c4cc;
          border-radius: 0.25rem;
          padding: 0 1rem;
          cursor: pointer;
          display: inline-flex;
          color: #606266;
          font-size: inherit;
          &:focus {
            border: none;
            outline: none;
            box-shadow: none;
            box-shadow: 0 0 0 1px #409eff;
          }
          &::placeholder {
            color: #c0c4cc;
          }
        }
        .stock-search-result {
          background: #fff;
          z-index: 2028;
          position: absolute;
          left: 0.4rem;
          top: 2.4rem;
          list-style: none;
          padding: 0.38rem 0;
          line-height: 1.7;
          border: 1px solid #c0c4cc;
          border-radius: 0.25rem;
          width: 14.2rem;
          &::after {
            content: '';
            position: absolute;
            left: 50%;
            top: -1rem;
            border-bottom: 1rem solid rgba(192, 196, 204, 0.4);
            border-left: solid transparent;
            border-right: solid transparent;
            border-width: 1rem;
            margin-left: -1rem;
          }
          li {
            @extend .text-over;
            color: #606266;
            font-size: 0.88rem;
            height: 2.12rem;
            line-height: 2.12rem;
            cursor: pointer;
            padding: 0 1rem;
            &:hover {
              background: #f5f7fa;
            }
          }
        }
      }
      .btn-backtesting {
        margin-left: 1rem;
      }
    }
    .next-price-box {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      margin: 1rem auto 0;
      .next-price {
        width: 24.4rem;
        margin: 0 0 0.6rem 0;
        color: #000;
        font-size: 1.2rem;
        font-weight: 600;
        .cus-column {
          @extend .text-over;
          .stock-name {
            flex: 1;
            @extend .text-over;
          }
          .btn-opt {
            margin-left: 1rem;
          }
        }
        .close-price {
          color: green;
          &.close-price-red {
            color: red;
          }
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
      .backtesting-log-bg {
        @extend .flex-center;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6);
        .backtesting-log-container {
          background-color: #fff;
          width: 88%;
          height: 80vh;
          overflow: scroll;
          padding: 0 0 0.8rem 0;
          .backtesting-log-item {
            line-height: 1.7;
            margin: 0.6rem 0;
            text-align: left;
            border-radius: 0.25rem;
            background: #ecf5ff;
            color: #409eff;
            padding: 0.3rem 0.6rem;
          }
        }
      }
    }
    @media only screen and (max-width: 98rem) {
      .next-price-box {
        .next-price {
          width: 32.4%;
        }
      }
    }
    @media only screen and (max-width: 73rem) {
      .next-price-box {
        .next-price {
          width: 48.4%;
        }
      }
    }
    @media only screen and (max-width: 49rem) {
      .next-price-box {
        .next-price {
          width: 100%;
        }
      }
    }
  }
  .footer {
    padding-bottom: 1rem;
  }
}
</style>
