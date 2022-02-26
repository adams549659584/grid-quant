import { IStockListResult } from '@/api/stock/model/IStockListResult';
import { getKLineD1, getStockListApi } from '@/api/stock/stock-api';
import useStockHistory from '@/components/history/hooks/useStockHistory';
import { formatNow } from '@/helpers/DateHelper';
import { calcNextPrice, mathRound } from '@/helpers/StockHelper';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';

const dateNowHM = Number(formatNow('Hmm'));
const isTradeTime = ref(dateNowHM >= 920 && dateNowHM < 1500);
const isShowNextSwitchChange = computed(() => !isTradeTime.value);

// 预测/回看当天
const nextSwitch = ref(true);
// 大卡片 小卡片 表格
// const nextPriceStyleList = ['Card', 'MiniCard', 'Table'] as const;
const nextPriceStyleList = ['Card', 'MiniCard'] as const;
const nextPriceStyle = ref<typeof nextPriceStyleList[number]>(nextPriceStyleList[0]);

/**
 * 计算涨跌幅 0.01
 * @param prevClosePrice 上一次收盘价
 * @param nowPrice 当前价格
 * @returns
 */
const calcRate = (prevClosePrice: number, nowPrice: number) => {
  return mathRound(nowPrice / prevClosePrice - 1, 4);
};

/**
 * 计算涨跌幅 1%
 * @param prevClosePrice 上一次收盘价
 * @param nowPrice 当前价格
 * @returns
 */
const calcPercentRate = (prevClosePrice: number, nowPrice: number) => {
  return (calcRate(prevClosePrice, nowPrice) * 100).toFixed(2) + '%';
};

const getLastTradeDate = async () => {
  const lastTradeDateCacheKey = 'last_trade_date';
  const cacheLastQueryTradeDate = localStorage.getItem(lastTradeDateCacheKey);
  const todayStr = formatNow('yyyy-MM-dd');
  if (cacheLastQueryTradeDate === todayStr) {
    return todayStr;
  }
  const kline = await getKLineD1('1.000001', 1);
  if (kline && kline.data && kline.data.klineDatas && kline.data.klineDatas.length === 1) {
    const tradeDateStr = kline.data.klineDatas[0].dateStr;
    localStorage.setItem(lastTradeDateCacheKey, tradeDateStr);
    return tradeDateStr;
  }
  return todayStr;
};

export default function usePredict() {
  const { updateHistory } = useStockHistory();
  // 下次价格预测
  const calcNext = async (secid: string, isMoveToFirst = false) => {
    const klineD1 = await getKLineD1(secid, 2);
    if (klineD1 && klineD1.data && klineD1.data.klineDatas && klineD1.data.klineDatas.length === 2) {
      const klineDatas = klineD1.data.klineDatas;
      const dateNowStr = formatNow('yyyy-MM-dd');
      // 当日收盘前
      const klineData = !nextSwitch.value || (klineDatas[1].dateStr === dateNowStr && new Date().getHours() < 15) ? klineDatas[0] : klineDatas[1];
      const nextPrice = calcNextPrice(klineData.closePrice, klineData.highPrice, klineData.lowPrice);
      updateHistory(
        {
          market: klineD1.data.market,
          code: klineD1.data.code,
          name: klineD1.data.name,
          prevPrice: klineDatas[0],
          nowPrice: klineDatas[1],
          nextPrice
        },
        isMoveToFirst
      );
    } else {
      ElMessage.error('获取K线数据异常');
    }
  };

  const changeHistoryRowNext = () => {
    const { historyRows, updateHistory } = useStockHistory();
    if (historyRows.value && historyRows.value.length > 0) {
      const dateNowStr = formatNow('yyyy-MM-dd');
      historyRows.value = historyRows.value.map((row) => {
        return {
          ...row,
          nextPrice: nextSwitch.value
            ? calcNextPrice(row.nowPrice.closePrice, row.nowPrice.highPrice, row.nowPrice.lowPrice)
            : calcNextPrice(row.prevPrice.closePrice, row.prevPrice.highPrice, row.prevPrice.lowPrice)
        };
      });
    }
  };

  const initStockEventSource = () => {
    const { historyRows, updateHistory } = useStockHistory();
    if (historyRows.value && historyRows.value.length > 0) {
      const stockListApi = getStockListApi(
        2000,
        historyRows.value.map((x) => `${x.market}.${x.code}`)
      );
      const stockEvtSource = new EventSource(stockListApi);
      stockEvtSource.onmessage = (ev: MessageEvent<string>) => {
        const stockListResult = JSON.parse(ev.data) as IStockListResult;
        if (stockListResult.data && stockListResult.data.diff) {
          Object.values(stockListResult.data.diff).forEach((x) => {
            const existRow = historyRows.value?.find((row) => row.market === x.f13 && row.code === x.f12);
            if (existRow) {
              existRow.nowPrice.closePrice = mathRound(x.f2 / 1000, 3);
              existRow.nowPrice.highPrice = mathRound(x.f15 / 1000, 3);
              existRow.nowPrice.lowPrice = mathRound(x.f16 / 1000, 3);
              existRow.nowPrice.openPrice = mathRound(x.f17 / 1000, 3);
              updateHistory(existRow);
            }
          });
        } else {
          isTradeTime.value = false;
          stockEvtSource.close();
        }
      };
      return stockEvtSource;
    }
    return;
  };
  return {
    isTradeTime,
    isShowNextSwitchChange,
    nextSwitch,
    nextPriceStyleList,
    nextPriceStyle,
    calcNext,
    calcRate,
    calcPercentRate,
    getLastTradeDate,
    initStockEventSource,
    changeHistoryRowNext
  };
}
