<script setup lang="ts">
import useStockHistory from '../history/hooks/useStockHistory';
import usePredict from './hooks/usePredict';

const { filterHistoryRows, historyFillRowCount } = useStockHistory();
const { isTradeDate, isTradeTime, calcPercentRate } = usePredict();
</script>

<template>
  <div class="flex justify-around items-center flex-wrap text-gray-800" v-if="filterHistoryRows && filterHistoryRows.length > 0">
    <div class="next-price-box relative rounded-md shadow-md shadow-gray-300" v-for="(row, index) in filterHistoryRows" :key="index">
      <div class="absolute top-3 left-3 opacity-50" v-if="row.nextPrice.firstSalePrice > row.nextPrice.firstBuyPrice">
        <svg-icon class="w-[4rem] h-[4rem]" v-if="row.nowPrice.closePrice <= row.nextPrice.firstBuyPrice" name="buy" color="#1afa29" />
        <svg-icon class="w-[4rem] h-[4rem]" v-if="row.nowPrice.closePrice >= row.nextPrice.firstSalePrice" name="sale" color="#d81e06" />
      </div>
      <div class="row p-2 text-center truncate">{{ `${row.code} ${row.name}` }}</div>
      <div class="row cursor-pointer">
        <el-popover placement="top-start" trigger="hover">
          <template #reference>
            <span :class="{ 'text-red-500': row.nowPrice.closePrice > row.nextPrice.closePrice, 'text-green-500': row.nowPrice.closePrice < row.nextPrice.closePrice }"
              >{{ row.nowPrice.closePrice.toFixed(row.precision || 3) }}({{ ((row.nowPrice.closePrice / row.nextPrice.closePrice - 1) * 100).toFixed(2) }}%)</span
            >
          </template>
          <div>
            <p class="p-1">高：{{ row.nowPrice.highPrice.toFixed(row.precision || 3) }}</p>
            <p class="p-1">低：{{ row.nowPrice.lowPrice.toFixed(row.precision || 3) }}</p>
            <p class="p-1">开：{{ row.nowPrice.openPrice.toFixed(row.precision || 3) }}</p>
          </div>
        </el-popover>
      </div>
      <div class="row bg-red-400">{{ row.nextPrice.highSalePrice.toFixed(row.precision || 3) }}({{ calcPercentRate(row.nextPrice.closePrice, row.nextPrice.highSalePrice) }})</div>
      <div class="row bg-red-300">
        {{ row.nextPrice.firstSalePrice.toFixed(row.precision || 3) }}({{ calcPercentRate(row.nextPrice.closePrice, row.nextPrice.firstSalePrice) }})
      </div>
      <div class="row bg-green-300">
        {{ row.nextPrice.firstBuyPrice.toFixed(row.precision || 3) }}({{ calcPercentRate(row.nextPrice.closePrice, row.nextPrice.firstBuyPrice) }})
      </div>
      <div class="row bg-green-400">{{ row.nextPrice.lowBuyPrice.toFixed(row.precision || 3) }}({{ calcPercentRate(row.nextPrice.closePrice, row.nextPrice.lowBuyPrice) }})</div>
    </div>
    <div class="next-price-box invisible" v-for="i in historyFillRowCount" :key="i"></div>
  </div>
  <div v-else class="text-center h-[30rem] leading-[30rem] text-lg text-gray-400">暂无数据</div>
</template>

<style lang="scss" scoped>
.next-price-box {
  @apply border outline-2 mt-4 w-[48%]
   md:w-[24%]
   lg:w-[16%]
   xl:w-[13.5%] 
   2xl:w-[12%];

  .row {
    @apply flex justify-center items-center flex-wrap border-b p-1;

    &:last-child {
      @apply border-b-0;
    }
  }
  .column {
    &:first-child {
      @apply border-r;
    }
    @apply text-center truncate w-1/2 p-2;
    &.close-price-green {
      @apply text-green-500;
    }
    &.close-price-red {
      @apply text-red-500;
    }
  }
}
</style>
