export interface IStockListResult {
  rc: number;
  rt: number;
  svr: number;
  lt: number;
  full: number;
  data?: {
    total: number;
    diff: {
      [key in string]: {
        /**
         * 精度
         */
        f1?: number;
        /**
         * 最新价
         */
        f2?: number;
        /**
         * 代码
         */
        f12: string;
        /**
         * market
         */
        f13: number;
        /**
         * 名称
         */
        f14: string;
        /**
         * 最高价
         */
        f15?: number;
        /**
         * 最低价
         */
        f16?: number;
        /**
         * 开盘价
         */
        f17?: number;
      };
    };
  };
}
