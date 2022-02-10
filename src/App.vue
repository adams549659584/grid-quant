<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import { computed, ref, onBeforeUnmount } from 'vue';
import { ISearchResultRow } from './api/stock/model/ISearchResult';
import { search, getKLineM5, getKLineD1 } from './api/stock/stock-api';
import { formatNow } from './helpers/DateHelper';
import { calcNextPrice, mathRound } from './helpers/StockHelper';
import { Delete, CaretRight, CircleClose } from '@element-plus/icons-vue';
import { IHistoryRow } from './api/stock/model/IHistoryRow';
import { IKLineRow } from './api/stock/model/IKLineResult';

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
// 填充保持观感
const historyFillRowCount = computed(() => {
  if (!historyRows.value || historyRows.value.length === 0) {
    return 0;
  }
  const nowCount = historyRows.value.length;
  const screenWidth = window.screen.width;
  if (screenWidth >= 1536) {
    return 5 - (nowCount % 5);
  } else if (screenWidth >= 1280) {
    return 4 - (nowCount % 4);
  } else if (screenWidth >= 1024) {
    return 3 - (nowCount % 3);
  } else if (screenWidth >= 768) {
    return 2 - (nowCount % 2);
  }
  return 0;
});

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
    // 网格幅度
    let gridRate = mathRound(optRate / minGridOptCount.value);
    if (gridRate < minGridRate) {
      gridRate = minGridRate;
    }
    // 每次委托数,每次2000元
    gridCount.value = Math.round(2000 / lastClosePrice / 100) * 100;
    // 至少100
    if (gridCount.value === 0) {
      gridCount.value = 100;
    }
    // 最低持仓2份
    minHoldCount.value = gridCount.value * 2;
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
          // 极限获利位止盈
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
          // 跌破极限抄底位2个点，止损
          if (kline.openPrice < klineNextPrice.lowBuyPrice * 0.98) {
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
          } else {
            // 极限抄底加倍
            const gridBuyResult = gridBuy(kline, gridCount.value * 2);
            if (gridBuyResult.isSuccess) {
              lastOptPrice = gridBuyResult.lastOptPrice;
            } else {
              continue;
            }
          }
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
          const gridBuyResult = gridBuy(kline, gridCount.value);
          if (gridBuyResult.isSuccess) {
            lastOptPrice = gridBuyResult.lastOptPrice;
          } else {
            continue;
          }
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

const gridBuy = (kline: IKLineRow, buyCount: number): { isSuccess: boolean; lastOptPrice: number } => {
  const money = mathRound(buyCount * kline.openPrice, 2);
  if (totalMoney.value < money) {
    backtestingLogs.value.push(
      `${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 余额 ￥${totalMoney.value} 不足以购买本次网格， 市值￥ ${(
        kline.openPrice * holdCount.value +
        totalMoney.value
      ).toFixed(2)}`
    );
    return { isSuccess: false, lastOptPrice: 0 };
  }
  holdCount.value = mathRound(holdCount.value + buyCount);
  totalMoney.value = mathRound(totalMoney.value - money);
  backtestingLogs.value.push(
    `${kline.dateStr} ${kline.timeStr}：￥${kline.openPrice} 网格买入 ${buyCount} 股 , 支出 ￥${money} ， 持仓 ${holdCount.value} ，  余额 ￥${totalMoney.value} ， 市值￥ ${(
      kline.openPrice * holdCount.value +
      totalMoney.value
    ).toFixed(2)}`
  );
  return { isSuccess: true, lastOptPrice: kline.openPrice };
};

const closeBacktesting = async () => {
  isShowBacktestingLog.value = false;
};

const initNextPriceList = async () => {
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
      '1.513300' // 纳斯达克ETF
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
  clearTimeout(nextPriceTimer.value);
});
</script>

<template>
  <div>
    <header>
      <h1 class="flex-center">
        <span class="title">价格预测</span>
        <a class="cursor-pointer" href="https://github.com/adams549659584/grid-quant" target="_blank">
          <img src="./assets/images/github.png" alt="https://github.com/adams549659584/grid-quant" />
        </a>
      </h1>
    </header>
    <main>
      <header class="flex-center space-x-4">
        <el-switch v-if="isShowNextSwitchChange" v-model="nextSwitch" inline-prompt active-text="预" inactive-text="回" @change="nextSwitchChange" />
        <div>
          <input
            class="input-search"
            type="text"
            placeholder="请输入股票/基金代码"
            v-model="searchKeyword"
            @focus="changeSearchResultShow(true)"
            @blur="changeSearchResultShow(false)"
            @input="query"
          />
          <div class="absolute" v-show="isShowSearchResult">
            <ul class="search-hotkey" v-if="searchResultRows && searchResultRows.length > 0">
              <li
                class="search-hotkey-items"
                v-for="item in searchResultRows"
                :key="`${item.MktNum}.${item.Code}_${item.Name}`"
                @click="selectChange(`${item.MktNum}.${item.Code}`)"
              >
                {{ `${item.Code} ${item.Name} ${item.SecurityTypeName}` }}
              </li>
            </ul>
            <ul class="search-hotkey" v-else-if="searchKeyword.length > 0">
              <li class="search-hotkey-items">暂无相关股票/基金</li>
            </ul>
            <ul class="search-hotkey" v-else>
              <li class="search-hotkey-items">输入股票/基金 编码/简拼/全拼/中文</li>
            </ul>
          </div>
        </div>
        <!-- <el-button class="btn-backtesting"
                   size="large"
                   type="danger"
        @click="backtesting">回测</el-button>-->
      </header>
      <main>
        <div class="flex-center justify-around text-xl font-bold" v-if="historyRows">
          <div class="next-price-box" v-for="(row, index) in historyRows" :key="index">
            <div class="row p-2">
              <span class="flex-1 text-center truncate">{{ `${row.code} ${row.name}` }}</span>
              <el-button class="w-min" type="primary" :icon="CaretRight" circle @click="backtesting(`${row.market}.${row.code}`)"></el-button>
              <el-button class="w-min" type="danger" :icon="Delete" circle @click="delHistory(row)"></el-button>
            </div>
            <div class="row">
              <div class="column">操作</div>
              <div class="column close-price-green" :class="{ 'close-price-red': row.nowPrice.closePrice >= (row.nextPrice.firstSalePrice + row.nextPrice.firstBuyPrice) / 2 }">
                价格({{ row.nowPrice.closePrice.toFixed(3) }})
              </div>
            </div>
            <div class="row bg-red-400">
              <div class="column">极限获利位</div>
              <div class="column">{{ row.nextPrice.highSalePrice.toFixed(3) }}(+{{ row.nextPrice.highSaleRate.toFixed(2) }}%)</div>
            </div>
            <div class="row bg-red-300">
              <div class="column">第一压力位</div>
              <div class="column">{{ row.nextPrice.firstSalePrice.toFixed(3) }}(+{{ row.nextPrice.firstSaleRate.toFixed(2) }}%)</div>
            </div>
            <div class="row bg-green-300">
              <div class="column">第一支撑位</div>
              <div class="column">{{ row.nextPrice.firstBuyPrice.toFixed(3) }}(-{{ row.nextPrice.firstBuyRate.toFixed(2) }}%)</div>
            </div>
            <div class="row bg-green-400">
              <div class="column">极限抄底位</div>
              <div class="column">{{ row.nextPrice.lowBuyPrice.toFixed(3) }}(-{{ row.nextPrice.lowBuyRate.toFixed(2) }}%)</div>
            </div>
            <div class="row">
              <div class="column">振幅</div>
              <div class="column">
                {{ (row.nextPrice.firstSaleRate + row.nextPrice.firstBuyRate).toFixed(2) }}% - {{ (row.nextPrice.highSaleRate + row.nextPrice.lowBuyRate).toFixed(2) }}%
              </div>
            </div>
          </div>
          <div class="next-price-box invisible" v-for="i in historyFillRowCount" :key="i"></div>
          <div class="backtesting-log-bg" v-show="isShowBacktestingLog" @click.stop="closeBacktesting">
            <div class="backtesting-log-box" @click.stop>
              <div
                class="backtesting-log-item"
                v-for="(item, index) in backtestingLogs"
                :key="index"
                :class="{
                  'log-buy': item.includes('网格买入'),
                  'log-sale': item.includes('网格卖出'),
                  'log-stop-profit': item.includes('止盈卖出'),
                  'log-stop-loss': item.includes('止损卖出')
                }"
              >
                {{ item }}
              </div>
              <div class="flex-center p-4">
                <el-button type="danger" :icon="CircleClose" @click.stop="closeBacktesting">看完了</el-button>
              </div>
            </div>
          </div>
        </div>
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

<style lang="scss">
.flex-center {
  @apply flex justify-center items-center flex-wrap;
}

.title {
  @apply text-3xl font-bold p-4;
}

.input-search {
  @apply border p-2 rounded-sm hover:border-blue-500 cursor-pointer focus:border-blue-500 
  focus:outline-none;
}

.up-arrow {
  @apply before:absolute before:p-2 before:-top-2 before:left-1/2 before:-translate-x-1/2 before:rotate-45 
  before:border-t before:border-l before:bg-inherit before:z-0;
}

.search-hotkey {
  @apply relative bg-white top-4 left-0 border rounded-sm z-10;
  @extend .up-arrow;
}
.search-hotkey-items {
  @apply p-2 w-48 truncate rounded-sm cursor-pointer hover:bg-gray-100;
}

.next-price-box {
  @apply border outline-2 mt-4 w-[98%]
   md:w-[49%]
   lg:w-[32.3%]
   xl:w-[24%] 
   2xl:w-[19%];

  .row {
    @extend .flex-center;
    @apply border-b;

    &:last-child {
      @apply border-b-0;
    }
  }
  .column {
    &:first-child {
      @apply border-r;
    }
    @apply text-center truncate w-1/2 p-2;
    &.close-price-green {
      @apply text-green-500;
    }
    &.close-price-red {
      @apply text-red-500;
    }
  }
}

.backtesting-log-bg {
  @apply fixed top-0 left-0 w-full h-full bg-black/60;
  @extend .flex-center;
  .backtesting-log-box {
    @apply relative bg-white border rounded-sm max-w-[90%] sm:max-w-[60%] max-h-[80vh] overflow-auto text-base text-black font-light;
    .backtesting-log-item {
      @apply w-full px-4 border-b leading-loose cursor-pointer hover:bg-gray-400;
      &.log-buy {
        @apply bg-red-300;
      }
      &.log-sale {
        @apply bg-green-300;
      }
      &.log-stop-profit {
        @apply bg-red-400;
      }
      &.log-stop-loss {
        @apply bg-green-400;
      }
    }
  }
}
</style>
