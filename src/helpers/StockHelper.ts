export interface INextPrice {
  /**
   * 极限获利位，短线仓位可兑现，收盘站上去就有大行情要启动
   */
  highSalePrice: number;

  /**
   * 极限涨幅
   */
  highSaleRate: number;

  /**
   * 近值-第一压力位附近可以小额减仓，能过就有大机会
   */
  firstSalePrice: number;

  /**
   * 压力位涨幅
   */
  firstSaleRate: number;

  /**
   * 近值-第一支撑位附近开始吸筹，撑不住就先別加仓了
   */
  firstBuyPrice: number;

  /**
   * 支撑位跌幅
   */
  firstBuyRate: number;

  /**
   * 极限抄底位，再砸就不会有行情了，看均线如果破位注意止损！
   */
  lowBuyPrice: number;

  /**
   * 极限跌幅
   */
  lowBuyRate: number;
}

/**
 * 将小数值按指定的小数位数舍入
 * @param num 要舍入的小数
 * @param decimals 返回值中的小数位数
 */
export function mathRound(num = 1, decimals = 3) {
  const pow = Math.pow(10, decimals);
  return Math.round(num * pow) / pow;
}

/**
 * 价格预测 开盘15分钟内直冲近值就不要急着交易，快去近值位置挂单，如果冲不过近值说明今日行情偏弱，可以任由网格机器人管理，如收盘时突破极值：明日大趋势依旧，放巨量时逆势公式会加大波动，在温和量能下逆势公式极为准确，这个公式是很多国外短线、期货、操盘手的标准模板，ETF股票都能参考
 * @param closePrice
 * @param lastHighPrice
 * @param lastLowPrice
 * @returns
 */
export function calcNextPrice(closePrice: number, lastHighPrice: number, lastLowPrice: number): INextPrice {
  // 昨日高低价差
  const closePriceGap = lastHighPrice - lastLowPrice;
  // 昨日价格均值
  const closePriceAVG = (closePrice * 2 + lastLowPrice + lastHighPrice) / 4;
  // 极限获利位，短线仓位可兑现，收盘站上去就有大行情要启动
  const highSalePrice = mathRound(closePriceGap + closePriceAVG);
  // 近值-第一压力位附近可以小额减仓，能过就有大机会
  const firstSalePrice = mathRound(closePriceAVG * 2 - lastLowPrice);
  // 近值-第一支撑位附近开始吸筹，撑不住就先別加仓了
  const firstBuyPrice = mathRound(closePriceAVG * 2 - lastHighPrice);
  // 极限抄底位，再砸就不会有行情了，看均线如果破位注意止损！
  const lowBuyPrice = mathRound(closePriceAVG - closePriceGap);
  return {
    highSalePrice,
    highSaleRate: mathRound((highSalePrice / closePrice - 1) * 100, 2),
    firstSalePrice,
    firstSaleRate: mathRound((firstSalePrice / closePrice - 1) * 100, 2),
    firstBuyPrice,
    firstBuyRate: mathRound((closePrice / firstBuyPrice - 1) * 100, 2),
    lowBuyPrice,
    lowBuyRate: mathRound((closePrice / lowBuyPrice - 1) * 100, 2)
  };
}
