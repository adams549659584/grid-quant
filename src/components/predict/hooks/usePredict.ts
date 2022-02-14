import { getKLineD1 } from '@/api/stock/stock-api';
import useStockHistory from '@/components/history/hooks/useStockHistory';
import { formatNow } from '@/helpers/DateHelper';
import { calcNextPrice } from '@/helpers/StockHelper';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

export default function usePredict() {
  const dateNowHM = Number(formatNow('Hmm'));
  const isTradeTime = dateNowHM >= 930 && dateNowHM <= 1500;
  const isShowNextSwitchChange = !isTradeTime;

  const nextSwitch = ref(true);

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
    calcNext
  };
}
