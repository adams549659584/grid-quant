import { IFundHoldDetail } from '@/api/stock/model/IFundHoldDetailResult';
import { IHistoryRow } from '@/api/stock/model/IHistoryRow';
import { getFundHoldDetail } from '@/api/stock/stock-api';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

const isShowStockDetail = ref(false);
const klineTypes = ['分时', '15分', '日K', '周K', '月K', '年K', '持仓明细'] as const;
// const klineTypes = ['分时', '15分', '日K', '周K', '月K', '年K'] as const;
const stockActiveTab = ref<typeof klineTypes[number]>('分时');
const stockActiveInfo = ref<IHistoryRow>();

const lastStockActiveTab = ref(stockActiveTab.value);
const fundHoldDetails = ref<IFundHoldDetail[]>();
const isLoadingHoldDetails = ref(false);

const showStockDetail = async (row: IHistoryRow) => {
  stockActiveInfo.value = row;
  // isShowStockDetail.value = true;
  await tabChange();
};

const tabChange = async () => {
  if (!stockActiveInfo.value) {
    ElMessage.error('股票信息有误！');
    return;
  }
  if (stockActiveTab.value === '持仓明细') {
    isLoadingHoldDetails.value = true;
    // 缓存
    const cacheKey = `hold_detail_${stockActiveInfo.value.code}`;
    const cacheDetails = sessionStorage.getItem(cacheKey);
    if (cacheDetails) {
      fundHoldDetails.value = JSON.parse(cacheDetails) as IFundHoldDetail[];
    } else {
      const fundHoldDetailResults = await getFundHoldDetail(stockActiveInfo.value.code);
      sessionStorage.setItem(cacheKey, JSON.stringify(fundHoldDetailResults));
      fundHoldDetails.value = fundHoldDetailResults;
    }
    isLoadingHoldDetails.value = false;
  }
  if (stockActiveTab.value === lastStockActiveTab.value) {
    console.log(`已打开 : `, lastStockActiveTab.value);
  } else {
    lastStockActiveTab.value = stockActiveTab.value;
    console.log(`切换 ： `, stockActiveTab.value);
  }
};

export default function useStockDetail() {
  return {
    isShowStockDetail,
    showStockDetail,
    stockActiveInfo,
    klineTypes,
    stockActiveTab,
    lastStockActiveTab,
    tabChange,
    fundHoldDetails,
    isLoadingHoldDetails
  };
}
