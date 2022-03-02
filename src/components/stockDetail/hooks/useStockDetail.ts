import { IHistoryRow } from '@/api/stock/model/IHistoryRow';
import { ref } from 'vue';

const isShowStockDetail = ref(false);
// const klineTypes = ['分时', '15分', '日K', '周K', '月K', '年K', '持仓明细'] as const;
const klineTypes = ['分时', '15分', '日K', '周K', '月K', '年K'] as const;
const stockActiveTab = ref<typeof klineTypes[number]>('分时');
const stockActiveInfo = ref<IHistoryRow>();

const showStockDetail = (row: IHistoryRow) => {
  stockActiveInfo.value = row;
  // isShowStockDetail.value = true;
};

export default function useStockDetail() {
  return {
    isShowStockDetail,
    showStockDetail,
    stockActiveInfo,
    klineTypes,
    stockActiveTab
  };
}
