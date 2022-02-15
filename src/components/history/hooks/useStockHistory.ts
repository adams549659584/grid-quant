import { IHistoryRow } from '@/api/stock/model/IHistoryRow';
import { computed, ref } from 'vue';

const historySearchResultKey = 'history_search_results';
let historyRows = ref<IHistoryRow[]>();

// 填充保持观感
const historyFillRowCount = computed(() => {
  if (!historyRows.value || historyRows.value.length === 0) {
    return 0;
  }
  const nowCount = historyRows.value.length;
  const screenWidth = window.screen.width;
  if (screenWidth >= 1536) {
    return 5 - (nowCount % 5);
  } else if (screenWidth >= 1280) {
    return 4 - (nowCount % 4);
  } else if (screenWidth >= 1024) {
    return 3 - (nowCount % 3);
  } else if (screenWidth >= 768) {
    return 2 - (nowCount % 2);
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
    localStorage.setItem(historySearchResultKey, JSON.stringify(historys));
  };

  const delHistory = (row: IHistoryRow) => {
    let historys = getHistory();
    historys = historys.filter((x) => !(row.market === x.market && row.code === x.code && row.name === x.name));
    historyRows.value = historys;
    localStorage.setItem(historySearchResultKey, JSON.stringify(historys));
  };

  return {
    historyRows,
    historyFillRowCount,
    getHistory,
    updateHistory,
    delHistory
  };
}
