<script setup lang="ts">
import useStockSearch from './hooks/useStockSearch';
import { Search } from '@element-plus/icons-vue';

const { searchKeyword, query, selectChange } = useStockSearch();
</script>

<template>
  <div>
    <el-autocomplete
      v-model="searchKeyword"
      :fetch-suggestions="query"
      value-key="Text"
      highlight-first-item
      placeholder="请输入股票/基金代码"
      maxlength="10"
      :prefix-icon="Search"
      clearable
      @select="selectChange"
    />
  </div>
</template>

<style lang="scss" scoped></style>
