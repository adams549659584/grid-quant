import { ISearchResultRow } from '@/api/stock/model/ISearchResult';
import { search } from '@/api/stock/stock-api';
import usePredict from '@/components/predict/hooks/usePredict';
import { ref } from 'vue';

export default function useStockSearch() {
  const isShowSearchResult = ref(false);
  /**
   * 搜索关键字
   */
  const searchKeyword = ref('');

  /**
   * 搜索结果
   */
  const searchResultRows = ref<ISearchResultRow[]>();

  /**
   * 搜索索引
   */
  const searchSelectedIndex = ref(0);

  /**
   * 是否加载中
   */
  const loading = ref(false);

  const secid = ref('');

  /**
   * 是否显示搜索结果
   */
  const changeSearchResultShow = (isShow: boolean) => {
    if (isShow) {
      isShowSearchResult.value = isShow;
    } else {
      setTimeout(() => {
        isShowSearchResult.value = isShow;
      }, 300);
    }
  };

  /**
   * 查询
   */
  const query = async () => {
    searchSelectedIndex.value = 0;
    if (searchKeyword.value) {
      loading.value = true;
      const searchResults = await search(searchKeyword.value);
      searchResultRows.value = searchResults.Data || [];
      loading.value = false;
    } else {
      searchResultRows.value = [];
    }
  };

  const searchHotkeyUp = (payload: KeyboardEvent) => {
    if (searchResultRows.value && searchResultRows.value.length > 0) {
      searchSelectedIndex.value = searchSelectedIndex.value > 0 ? searchSelectedIndex.value - 1 : searchResultRows.value.length - 1;
    }
    return false;
  };
  const searchHotkeyDown = (payload: KeyboardEvent) => {
    if (searchResultRows.value && searchResultRows.value.length > 0) {
      searchSelectedIndex.value = searchSelectedIndex.value < searchResultRows.value.length - 1 ? searchSelectedIndex.value + 1 : 0;
    }
    return false;
  };
  const searchHotkeyEnter = () => {
    if (searchResultRows.value && searchResultRows.value.length > searchSelectedIndex.value) {
      const selectResult = searchResultRows.value[searchSelectedIndex.value];
      selectChange(`${selectResult.MktNum}.${selectResult.Code}`);
    }
  };

  const selectChange = async (val: string) => {
    secid.value = val;
    const { calcNext } = usePredict();
    return calcNext(val, true);
  };

  return {
    isShowSearchResult,
    searchKeyword,
    searchResultRows,
    searchSelectedIndex,
    secid,
    changeSearchResultShow,
    query,
    searchHotkeyUp,
    searchHotkeyDown,
    searchHotkeyEnter,
    selectChange
  };
}
