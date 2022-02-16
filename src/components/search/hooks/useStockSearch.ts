import { ISearchResultRow } from '@/api/stock/model/ISearchResult';
import { search } from '@/api/stock/stock-api';
import usePredict from '@/components/predict/hooks/usePredict';
import { ref } from 'vue';

/**
 * 搜索关键字
 */
const searchKeyword = ref('');

/**
 * 搜索结果
 */
const searchResultRows = ref<ISearchResultRow[]>();

/**
 * 是否加载中
 */
const loading = ref(false);

const secid = ref('');

export default function useStockSearch() {
  /**
   * 查询
   */
  const query = async (queryStr: string) => {
    console.log(`queryStr : `, queryStr);
    if (queryStr) {
      loading.value = true;
      const searchResults = await search(queryStr);
      searchResultRows.value = searchResults.Data || [];
      loading.value = false;
    } else {
      searchResultRows.value = [];
    }
  };

  const selectChange = async (val: string) => {
    if (!val) {
      return;
    }
    secid.value = val.split('_')[0];
    const { calcNext } = usePredict();
    return calcNext(secid.value, true);
  };

  return {
    searchKeyword,
    searchResultRows,
    secid,
    loading,
    query,
    selectChange
  };
}
