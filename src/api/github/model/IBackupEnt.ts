import { IHistoryRow } from '@/api/stock/model/IHistoryRow';
import { IPyramidConfig } from '@/components/grid/hooks/useGrid';

export interface IBackupEnt {
  historys: IHistoryRow[];
  pyramids: IPyramidConfig[];
}
