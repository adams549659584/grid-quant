import { IStockListResult } from '@/api/stock/model/IStockListResult';
import { getKLineD1, getStockListApi } from '@/api/stock/stock-api';
import useStockHistory from '@/components/history/hooks/useStockHistory';
import { formatNow } from '@/helpers/DateHelper';
import { calcNextPrice, mathRound } from '@/helpers/StockHelper';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';

const defaultStocks = [
  '1.510050', // 上证50ETF
  // '0.159602', // 中国A50ETF
  '1.561990', // 沪深300增强ETF
  '1.510500', // 中证500ETF
  '1.512100', // 中证1000ETF
  // '1.516970', // 基建50ETF
  // '0.159928', // 消费ETF
  // '1.512670', // 国防ETF
  // '1.512660', // 军工ETF
  // '1.516110', // 汽车ETF
  // '1.512000', // 券商ETF
  // '1.512480', // 半导体ETF
  // '1.516160', // 新能源ETF
  // '1.515030', // 新能车ETF
  // '1.515790', // 光伏ETF
  // '0.159867', // 畜牧ETF
  // '0.159790', // 碳中和ETF
  // '1.512760', // 芯片ETF
  // '1.516100', // 互联网金融ETF
  // '0.159997', // 电子ETF
  // '0.159755', // 电池ETF
  // '1.512980', // 传媒ETF
  // '0.159828', // 医疗ETF
  // '1.512170', // 医疗ETF
  // '0.159883', // 医疗器械ETF
  // '1.513050', // 中概互联网ETF
  // '1.513330', // 恒生互联网ETF
  '0.159967' // 创成长ETF
  // '0.159745', // 建材ETF
  // '1.512200', // 房地产ETF
  // '0.159825', // 农业ETF
  // '0.159996', // 家电ETF
  // '0.159992', // 创新药ETF
  // '1.515250', // 智能汽车ETF
  // '1.516780', // 稀土ETF
  // '1.516150', // 稀土ETF基金
  // '1.511220', // 城投债ETF
  // '1.511260', // 十年国债ETF
  // '0.159905', // 深红利ETF
  // '1.511380', // 可转债ETF
  // '1.513500', // 标普500ETF
  // '0.161834', // 银华鑫锐LOF
  // '1.501022', // 银华鑫盛LOF
  // '0.159981', // 能源化工ETF
  // '1.512890', // 红利低波ETF
  // '1.512690', // 酒ETF
  // '1.513100', // 纳指ETF
  // '1.513300', // 纳斯达克ETF
  // '1.510650' // 金融地产ETF
];

const dateNowHM = Number(formatNow('Hmm'));
const isTradeTime = ref(dateNowHM >= 920 && dateNowHM < 1500);
const isShowNextSwitchChange = computed(() => !isTradeTime.value);
const stockEvtSource = ref<EventSource>();
const todayStr = formatNow('yyyy-MM-dd');
const lastTradeDate = ref(todayStr);
const isTradeDate = computed(() => lastTradeDate.value === todayStr);

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
  if (cacheLastQueryTradeDate === todayStr) {
    lastTradeDate.value = todayStr;
    return todayStr;
  }
  const kline = await getKLineD1('1.000001', 1);
  if (kline && kline.data && kline.data.klineDatas && kline.data.klineDatas.length === 1) {
    const tradeDateStr = kline.data.klineDatas[0].dateStr;
    localStorage.setItem(lastTradeDateCacheKey, tradeDateStr);
    lastTradeDate.value = tradeDateStr;
    return tradeDateStr;
  }
  lastTradeDate.value = todayStr;
  return todayStr;
};

export default function usePredict() {
  const { updateHistory } = useStockHistory();
  // 下次价格预测
  const calcNext = async (secid: string, isMoveToFirst = false) => {
    const klineD1 = await getKLineD1(secid, 2);
    if (klineD1 && klineD1.data && klineD1.data.klineDatas && klineD1.data.klineDatas.length === 2) {
      const klineDatas = klineD1.data.klineDatas;
      const nowHour = new Date().getHours();
      // 当日收盘前
      const klineData = nextSwitch.value && ((isTradeDate.value && nowHour >= 15) || !isTradeDate.value) ? klineDatas[1] : klineDatas[0];
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
    const { historyRows } = useStockHistory();
    if (historyRows.value && historyRows.value.length > 0) {
      const nowHour = new Date().getHours();
      historyRows.value = historyRows.value.map((row) => {
        return {
          ...row,
          nextPrice:
            nextSwitch.value && ((isTradeDate.value && nowHour >= 15) || !isTradeDate.value)
              ? calcNextPrice(row.nowPrice.closePrice, row.nowPrice.highPrice, row.nowPrice.lowPrice)
              : calcNextPrice(row.prevPrice.closePrice, row.prevPrice.highPrice, row.prevPrice.lowPrice)
        };
      });
    }
  };

  const initStockEventSource = (isLoadOnce = false) => {
    const { historyRows, updateHistory } = useStockHistory();
    if (historyRows.value && historyRows.value.length > 0) {
      const stockListApi = getStockListApi(
        2000,
        historyRows.value.map((x) => `${x.market}.${x.code}`)
      );
      stockEvtSource.value && stockEvtSource.value.close();
      stockEvtSource.value = new EventSource(stockListApi);
      stockEvtSource.value.onmessage = (ev: MessageEvent<string>) => {
        const stockListResult = JSON.parse(ev.data) as IStockListResult;
        if (stockListResult.data && stockListResult.data.diff) {
          const nowHour = new Date().getHours();
          Object.values(stockListResult.data.diff).forEach((x) => {
            const existRow = historyRows.value?.find((row) => row.market === x.f13 && row.code === x.f12);
            if (existRow) {
              existRow.precision = x.f1 || existRow.precision || 3;
              if (x.f2) {
                existRow.nowPrice.closePrice = mathRound(x.f2 / Math.pow(10, existRow.precision), existRow.precision);
              }
              if (x.f15) {
                existRow.nowPrice.highPrice = mathRound(x.f15 / Math.pow(10, existRow.precision), existRow.precision);
              }
              if (x.f16) {
                existRow.nowPrice.lowPrice = mathRound(x.f16 / Math.pow(10, existRow.precision), existRow.precision);
              }
              if (x.f17) {
                existRow.nowPrice.openPrice = mathRound(x.f17 / Math.pow(10, existRow.precision), existRow.precision);
              }
              // console.log(`nextSwitch.value : `, nextSwitch.value);
              // console.log(`isTradeDate : `, isTradeDate.value);
              // console.log(`isTradeTime : `, isTradeTime.value);
              existRow.nextPrice =
                nextSwitch.value && ((isTradeDate.value && nowHour >= 15) || !isTradeDate.value)
                  ? calcNextPrice(existRow.nowPrice.closePrice, existRow.nowPrice.highPrice, existRow.nowPrice.lowPrice)
                  : calcNextPrice(existRow.prevPrice.closePrice, existRow.prevPrice.highPrice, existRow.prevPrice.lowPrice);
              updateHistory(existRow);
            }
          });
        }
        if (isLoadOnce) {
          stockEvtSource.value && stockEvtSource.value.close();
        }
        // else {
        //   isTradeTime.value = false;
        //   stockEvtSource.value && stockEvtSource.value.close();
        // }
      };
    }
  };

  const initNextPriceList = async () => {
    const { historyRows } = useStockHistory();
    if (!historyRows.value || historyRows.value.length === 0) {
      await Promise.allSettled(defaultStocks.map((secid) => calcNext(secid)));
    }
    if (!historyRows.value || historyRows.value.length === 0) {
      return;
    }
    const lastTradeDate = await getLastTradeDate();
    const expiredRows = historyRows.value.filter((x) => x.nowPrice.dateStr !== lastTradeDate);
    if (expiredRows && expiredRows.length > 0) {
      await Promise.allSettled(expiredRows.map((row) => calcNext(`${row.market}.${row.code}`)));
    }
    if (historyRows.value.every((x) => x.nowPrice.dateStr === lastTradeDate) && isTradeTime.value) {
      initStockEventSource();
    } else {
      initStockEventSource(true);
    }
  };
  return {
    isTradeDate,
    isTradeTime,
    isShowNextSwitchChange,
    nextSwitch,
    nextPriceStyleList,
    nextPriceStyle,
    calcNext,
    calcRate,
    calcPercentRate,
    getLastTradeDate,
    stockEvtSource,
    initStockEventSource,
    initNextPriceList,
    changeHistoryRowNext
  };
}
