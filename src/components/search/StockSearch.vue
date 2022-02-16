<script setup lang="ts">
import useStockSearch from './hooks/useStockSearch';

const {
  searchKeyword,
  searchResultRows,
  loading,
  query,
  selectChange
} = useStockSearch();
</script>

<template>
  <div v-if="true">
    <el-select v-model="searchKeyword" clearable filterable remote reserve-keyword placeholder="请输入股票/基金代码" :remote-method="query" :loading="loading" @change="selectChange">
      <el-option
        v-for="item in searchResultRows"
        :key="`${item.MktNum}.${item.Code}_${item.Name}`"
        :label="`${item.Code} ${item.Name} ${item.SecurityTypeName}`"
        :value="`${item.MktNum}.${item.Code}_${item.Name}`"
      >
      </el-option>
    </el-select>
  </div>
</template>

<style lang="scss" scoped></style>
