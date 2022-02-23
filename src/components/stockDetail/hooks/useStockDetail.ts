import { IHistoryRow } from '@/api/stock/model/IHistoryRow';
import { ref } from 'vue';

const isShowStockDetail = ref(false);

const showStockDetail = (row: IHistoryRow) => {};

export default function useStockDetail() {
  return {
    isShowStockDetail
  };
}
