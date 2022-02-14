<script setup lang="ts">
import useStockSearch from './hooks/useStockSearch';

const {
  isShowSearchResult,
  searchKeyword,
  searchResultRows,
  searchSelectedIndex,
  changeSearchResultShow,
  query,
  searchHotkeyUp,
  searchHotkeyDown,
  searchHotkeyEnter,
  selectChange
} = useStockSearch();
</script>

<template>
  <div>
    <input
      class="input-search"
      type="text"
      placeholder="请输入股票/基金代码"
      v-model="searchKeyword"
      @focus="changeSearchResultShow(true)"
      @blur="changeSearchResultShow(false)"
      @input="query"
      @keydown.up="searchHotkeyUp"
      @keydown.down="searchHotkeyDown"
      @keydown.enter="searchHotkeyEnter"
    />
    <div class="absolute" v-show="isShowSearchResult">
      <ul class="search-hotkey" v-if="searchResultRows && searchResultRows.length > 0">
        <li
          class="search-hotkey-items bg-"
          :class="{ 'bg-gray-100': index === searchSelectedIndex }"
          v-for="(item, index) in searchResultRows"
          :key="`${item.MktNum}.${item.Code}_${item.Name}`"
          @click="selectChange(`${item.MktNum}.${item.Code}`)"
        >
          {{ `${item.Code} ${item.Name} ${item.SecurityTypeName}` }}
        </li>
      </ul>
      <ul class="search-hotkey" v-else-if="searchKeyword.length > 0">
        <li class="search-hotkey-items">暂无相关股票/基金</li>
      </ul>
      <ul class="search-hotkey" v-else>
        <li class="search-hotkey-items">输入股票/基金 编码/简拼/全拼/中文</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-search {
  @apply border p-2 rounded-sm hover:border-blue-500 cursor-pointer focus:border-blue-500 
  focus:outline-none;
}

.up-arrow {
  @apply before:absolute before:block before:-top-[2rem] before:left-1/2 before:-translate-x-1/2 before:border-[1rem] before:border-transparent before:border-b-gray-100;
}

.search-hotkey {
  @apply relative bg-white top-4 left-0 border rounded-sm z-10;
  @extend .up-arrow;
}
.search-hotkey-items {
  @apply p-2 w-48 truncate rounded-sm cursor-pointer hover:bg-gray-100;
}
</style>
