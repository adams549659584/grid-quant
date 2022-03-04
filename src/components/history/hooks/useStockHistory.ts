import { IHistoryRow } from '@/api/stock/model/IHistoryRow';
import usePredict from '@/components/predict/hooks/usePredict';
import { computed, ref } from 'vue';

const historySearchResultKey = 'history_search_results';
let historyRows = ref<IHistoryRow[]>();
const isMobileScreen = window.screen.width <= 768;

const rowFilters = ['无过滤', '极限抄底', '第一支撑', '第一压力', '极限获利'] as const;
const rowSelectedFilter = ref<typeof rowFilters[number]>(rowFilters[0]);
const rowSorts = ['无排序', '涨幅', '跌幅'] as const;
const rowSelectedSort = ref<typeof rowSorts[number]>(rowSorts[0]);

/**
 * 过滤及排序后的
 */
const filterHistoryRows = computed(() => {
  let filterRows: IHistoryRow[] = [];
  if (historyRows.value) {
    switch (rowSelectedFilter.value) {
      case '极限抄底':
        filterRows = historyRows.value.filter((row) => row.nowPrice.closePrice <= row.nextPrice.lowBuyPrice);
        break;
      case '第一支撑':
        filterRows = historyRows.value.filter((row) => row.nowPrice.closePrice <= row.nextPrice.firstBuyPrice && row.nowPrice.closePrice > row.nextPrice.lowBuyPrice);
        break;
      case '第一压力':
        filterRows = historyRows.value.filter((row) => row.nowPrice.closePrice >= row.nextPrice.firstSalePrice && row.nowPrice.closePrice < row.nextPrice.highSalePrice);
        break;
      case '极限获利':
        filterRows = historyRows.value.filter((row) => row.nowPrice.closePrice >= row.nextPrice.highSalePrice);
        break;
      default:
        filterRows = [...historyRows.value];
        break;
    }

    switch (rowSelectedSort.value) {
      case '涨幅':
        filterRows = filterRows.sort((a, b) => -sortRate(a, b));
        break;
      case '跌幅':
        filterRows = filterRows.sort((a, b) => sortRate(a, b));
        break;
    }
  }
  return filterRows;
});

const sortRate = (a: IHistoryRow, b: IHistoryRow) => {
  const rateA = a.nowPrice.closePrice / a.prevPrice.closePrice - 1;
  const rateB = b.nowPrice.closePrice / b.prevPrice.closePrice - 1;
  return rateA - rateB;
};

// 填充保持观感
const historyFillRowCount = computed(() => {
  if (!filterHistoryRows.value || filterHistoryRows.value.length === 0) {
    return 0;
  }
  const nowCount = filterHistoryRows.value.length;
  const screenWidth = window.screen.width;
  const { nextPriceStyle } = usePredict();
  if (nextPriceStyle.value === 'MiniCard') {
    if (screenWidth >= 1536) {
      return 8 - (nowCount % 8);
    } else if (screenWidth >= 1280) {
      return 7 - (nowCount % 7);
    } else if (screenWidth >= 1024) {
      return 6 - (nowCount % 6);
    } else if (screenWidth >= 768) {
      return 4 - (nowCount % 4);
    }
    return 2 - (nowCount % 2);
  } else {
    if (screenWidth >= 1536) {
      return 5 - (nowCount % 5);
    } else if (screenWidth >= 1280) {
      return 4 - (nowCount % 4);
    } else if (screenWidth >= 1024) {
      return 3 - (nowCount % 3);
    } else if (screenWidth >= 768) {
      return 2 - (nowCount % 2);
    }
  }
  return 0;
});

export default function useStockHistory() {
  const getHistory = () => {
    const historyStr = localStorage.getItem(historySearchResultKey);
    if (!historyStr) {
      return [];
    }
    return JSON.parse(historyStr) as IHistoryRow[];
  };
  const saveHistory = () => localStorage.setItem(historySearchResultKey, JSON.stringify(historyRows.value));

  const updateHistory = (newHistory: IHistoryRow, isMoveToFirst = false) => {
    let historys = getHistory();
    const isExistHistoryPredicate = (x: IHistoryRow) => newHistory.market === x.market && newHistory.code === x.code && newHistory.name === x.name;
    if (isMoveToFirst) {
      historys = historys.filter((x) => !isExistHistoryPredicate(x));
      historys = [newHistory, ...historys];
    } else {
      const existHistoryIndex = historys.findIndex(isExistHistoryPredicate);
      if (existHistoryIndex > -1) {
        historys[existHistoryIndex] = newHistory;
      } else {
        historys = [newHistory, ...historys];
      }
    }
    historyRows.value = historys;
    saveHistory();
  };

  const delHistory = (row: IHistoryRow) => {
    let historys = getHistory();
    historys = historys.filter((x) => !(row.market === x.market && row.code === x.code && row.name === x.name));
    historyRows.value = historys;
    saveHistory();
  };

  return {
    isMobileScreen,
    historyRows,
    filterHistoryRows,
    historyFillRowCount,
    getHistory,
    updateHistory,
    delHistory,
    saveHistory,
    rowFilters,
    rowSelectedFilter,
    rowSorts,
    rowSelectedSort
  };
}
