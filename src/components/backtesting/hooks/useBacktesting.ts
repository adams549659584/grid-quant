import { IKLineRow } from '@/api/stock/model/IKLineResult';
import { getKLineM5 } from '@/api/stock/stock-api';
import useGrid from '@/components/grid/hooks/useGrid';
import { calcNextPrice, mathRound } from '@/helpers/StockHelper';
import { ElLoading, ElMessage } from 'element-plus';
import { ref } from 'vue';

const isShowBacktestingLog = ref(false);
const backtestingLogs = ref<string[]>([]);
const holdCount = ref(0);
const totalMoney = ref(100000);

function useBacktesting() {
  const runBacktesting = async (secid: string) => {
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
      const { minGridOptCount, minGridRate, minHoldCount, gridCount } = useGrid();
      let gridRate = mathRound(optRate / minGridOptCount.value);
      if (gridRate < minGridRate.value) {
        gridRate = minGridRate.value;
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
          if (gridRate < minGridRate.value) {
            gridRate = minGridRate.value;
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

  return {
    isShowBacktestingLog,
    backtestingLogs,
    holdCount,
    totalMoney,
    runBacktesting,
    closeBacktesting
  };
}

export default useBacktesting;
