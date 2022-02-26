export interface IKLineResult {
  /**
   * 注释:0
   */
  rc: number;

  /**
   * 注释:17
   */
  rt: number;

  /**
   * 注释:181216957
   */
  svr: number;

  /**
   * 注释:1
   */
  lt: number;

  /**
   * 注释:0
   */
  full: number;

  /**
   * K线数据
   */
  data: IKLineResultData;
}

export interface IKLineResultData {
  /**
   * 股票基金编码
   */
  code: string;

  /**
   * 注释:0
   */
  market: number;

  /**
   * 股票基金名称
   */
  name: string;

  /**
   * 注释:2
   */
  decimal: number;

  /**
   * 注释:4956
   */
  dktotal: number;

  /**
   * 注释:22.88
   */
  preKPrice: number;

  /**
   * 注释:17.66
   */
  prePrice: number;

  /**
   * 注释:7
   */
  qtMiscType: number;

  /**
   * 日期,开盘价(元),收盘价(元),最高价(元),最低价(元),成交量(手),成交额(元),振幅(%),涨跌幅(%),涨跌额(元)(今天的收盘价，相对昨天收盘价，增加的股价，即 涨跌额=今天收盘价-昨天收盘价),涨跌额(元)  今天的收盘价，相对昨天收盘价，增加的股价，即 涨跌额=今天收盘价-昨天收盘价
   */
  klines: string[];

  /**
   * klines 转换后数据
   */
  klineDatas: IKLineRow[];
}

export interface IKLineRow {
  /**
   * 日期
   */
  dateStr: string;

  /**
   * 时分
   */
  timeStr: string;

  /**
   * 开盘价(元)
   */
  openPrice: number;

  /**
   * 最新价/收盘价(元)
   */
  closePrice: number;

  /**
   * 最高价(元)
   */
  highPrice: number;

  /**
   * 最低价(元)
   */
  lowPrice: number;
}
