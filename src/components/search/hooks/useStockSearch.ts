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
  const query = async (queryStr: string, cb: (results: Array<ISearchResultRow & { Text: string }>) => void) => {
    if (queryStr) {
      loading.value = true;
      const searchResults = await search(queryStr);
      searchResultRows.value = searchResults.Data || [];
      loading.value = false;
    } else {
      searchResultRows.value = [];
    }

    cb(
      searchResultRows.value.map((x) => {
        return {
          ...x,
          Text: `${x.Code} ${x.Name} ${x.SecurityTypeName}`
        };
      })
    );
  };

  const selectChange = async (val: ISearchResultRow) => {
    if (!val) {
      return;
    }
    searchKeyword.value = '';
    secid.value = `${val.MktNum}.${val.Code}`;
    const { calcNext } = usePredict();
    return calcNext(secid.value, true).then((res) => {
      const { initNextPriceList } = usePredict();
      initNextPriceList();
    });
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
