export interface IStockTrendsResult {
  rc: number;
  rt: number;
  svr: number;
  lt: number;
  full: number;
  data: {
    code: string;
    market: number;
    type: number;
    status: number;
    name: string;
    decimal: number;
    preSettlement: number;
    preClose: number;
    beticks: string;
    trendsTotal: number;
    time: number;
    kind: number;
    prePrice: number;
    trends: string[];
    trendArrays: string[][];
  };
}
