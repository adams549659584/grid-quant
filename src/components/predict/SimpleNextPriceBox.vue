<script setup lang="ts">
import useStockHistory from '../history/hooks/useStockHistory';
import BacktestingLog from '../backtesting/BacktestingLog.vue';

const { historyRows, historyFillRowCount } = useStockHistory();
</script>

<template>
  <div
    class="flex justify-around items-center flex-wrap text-gray-800"
    v-if="historyRows && historyRows.length > 0"
  >
    <div
      class="next-price-box relative rounded-md shadow-md shadow-gray-300"
      v-for="(row, index) in historyRows"
      :key="index"
    >
      <div class="absolute top-3 left-3 opacity-50 w-[4rem] h-[4rem]">
        <svg-icon
          v-if="row.nowPrice.closePrice <= row.nextPrice.firstBuyPrice"
          name="buy"
          color="#d81e06"
        />
        <svg-icon
          v-if="row.nowPrice.closePrice >= row.nextPrice.firstSalePrice"
          name="sale"
          color="#1afa29"
        />
      </div>
      <div class="row p-2 text-center truncate">{{ `${row.code} ${row.name}` }}</div>
      <div class="row cursor-pointer">
        <el-popover placement="top-start" trigger="hover">
          <template #reference>
            <span
              :class="{ 'close-price-red': row.nowPrice.closePrice >= (row.nextPrice.firstSalePrice + row.nextPrice.firstBuyPrice) / 2 }"
            >价格({{ row.nowPrice.closePrice.toFixed(3) }})</span>
          </template>
          <div>
            <p class="p-1">高：{{ row.nowPrice.highPrice.toFixed(3) }}</p>
            <p class="p-1">低：{{ row.nowPrice.lowPrice.toFixed(3) }}</p>
            <p class="p-1">开：{{ row.nowPrice.openPrice.toFixed(3) }}</p>
          </div>
        </el-popover>
      </div>
      <div
        class="row bg-red-400"
      >{{ row.nextPrice.highSalePrice.toFixed(3) }}(+{{ row.nextPrice.highSaleRate.toFixed(2) }}%)</div>
      <div
        class="row bg-red-300"
      >{{ row.nextPrice.firstSalePrice.toFixed(3) }}(+{{ row.nextPrice.firstSaleRate.toFixed(2) }}%)</div>
      <div
        class="row bg-green-300"
      >{{ row.nextPrice.firstBuyPrice.toFixed(3) }}(-{{ row.nextPrice.firstBuyRate.toFixed(2) }}%)</div>
      <div
        class="row bg-green-400"
      >{{ row.nextPrice.lowBuyPrice.toFixed(3) }}(-{{ row.nextPrice.lowBuyRate.toFixed(2) }}%)</div>
      <div
        class="row"
      >{{ (row.nextPrice.firstSaleRate + row.nextPrice.firstBuyRate).toFixed(2) }}% - {{ (row.nextPrice.highSaleRate + row.nextPrice.lowBuyRate).toFixed(2) }}%</div>
    </div>
    <div class="next-price-box invisible" v-for="i in historyFillRowCount" :key="i"></div>
    <backtesting-log />
  </div>
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
