import { IFundHoldDetail } from '@/api/stock/model/IFundHoldDetailResult';
import { IHistoryRow } from '@/api/stock/model/IHistoryRow';
import useStockHistory from '@/components/history/hooks/useStockHistory';
import { ref } from 'vue';

const isShowStockDetail = ref(false);
// const klineTypes = ['分时', '15分', '日K', '周K', '月K', '年K', '持仓明细'] as const;
// const klineTypes = ['分时', '15分', '日K', '周K', '月K', '年K'] as const;
// const stockActiveTab = ref<typeof klineTypes[number]>('分时');
const stockActiveInfo = ref<IHistoryRow>();

// const lastStockActiveTab = ref(stockActiveTab.value);
// const fundHoldDetails = ref<IFundHoldDetail[]>();
// const isLoadingHoldDetails = ref(false);

const showStockDetail = async (row: IHistoryRow) => {
  const { isMobileScreen } = useStockHistory();
  if (!isMobileScreen) {
    stockActiveInfo.value = row;
    isShowStockDetail.value = true;
  }
};

export default function useStockDetail() {
  return {
    isShowStockDetail,
    showStockDetail,
    stockActiveInfo
  };
}
