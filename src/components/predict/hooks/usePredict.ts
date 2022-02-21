import { getKLineD1 } from '@/api/stock/stock-api';
import useStockHistory from '@/components/history/hooks/useStockHistory';
import { formatNow } from '@/helpers/DateHelper';
import { calcNextPrice, mathRound } from '@/helpers/StockHelper';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

const dateNowHM = Number(formatNow('Hmm'));
const isTradeTime = dateNowHM >= 920 && dateNowHM < 1457;
const isShowNextSwitchChange = !isTradeTime;

// 预测/回看当天
const nextSwitch = ref(true);
// 大卡片 小卡片 表格
const nextPriceStyleList = ['Card', 'MiniCard', 'Table'] as const;
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
          prevPrice: klineData,
          nowPrice: klineDatas[1],
          nextPrice
        },
        isMoveToFirst
      );
    } else {
      ElMessage.error('获取K线数据异常');
    }
  };
  return {
    isTradeTime,
    isShowNextSwitchChange,
    nextSwitch,
    nextPriceStyleList,
    nextPriceStyle,
    calcNext,
    calcRate,
    calcPercentRate
  };
}
