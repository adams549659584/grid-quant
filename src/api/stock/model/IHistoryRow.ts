import { INextPrice } from '../../../helpers/StockHelper';
import { IKLineRow } from './IKLineResult';

export interface IHistoryRow {
  market: number;
  code: string;
  name: string;
  nowPrice: IKLineRow;
  nextPrice: INextPrice;
}
