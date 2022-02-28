import { INextPrice } from '../../../helpers/StockHelper';
import { IKLineRow } from './IKLineResult';

export interface IHistoryRow {
  market: number;
  code: string;
  name: string;
  /**
   * 精度 2-分 3-厘
   */
  precision?: number;
  /**
   * 上次价格
   */
  prevPrice: IKLineRow;
  /**
   * 当前价格
   */
  nowPrice: IKLineRow;
  /**
   * 下次价格预测
   */
  nextPrice: INextPrice;
}
