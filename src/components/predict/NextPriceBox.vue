<script setup lang="ts">
import useBacktesting from '../backtesting/hooks/useBacktesting';
import useStockHistory from '../history/hooks/useStockHistory';
import BacktestingLog from '../backtesting/BacktestingLog.vue';
import SvgIcon from '../icons/SvgIcon.vue';
import GridFundsCalc from '../grid/GridFundsCalc.vue';
import useGrid from '../grid/hooks/useGrid';

const { historyRows, historyFillRowCount, delHistory } = useStockHistory();
const { runBacktesting } = useBacktesting();
const { isShowPyramidCalc, showPyramidCalc } = useGrid();
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
      <div class="row p-2 space-x-1">
        <span class="flex-1 text-center truncate">{{ `${row.code} ${row.name}` }}</span>
        <!-- <SvgIcon class="w-[2rem] h-[2rem] cursor-pointer" name="kline" /> -->
        <SvgIcon
          class="w-[2rem] h-[2rem] cursor-pointer hidden md:block"
          name="pyramid"
          @click="showPyramidCalc({ market: row.market, code: row.code, name: row.name, firstBuyPrice: row.nowPrice.closePrice })"
        />
        <!-- <SvgIcon
          class="w-[2rem] h-[2rem] cursor-pointer"
          name="backtesting"
          color="#1296db"
          @click="runBacktesting(`${row.market}.${row.code}`)"
        />-->
        <SvgIcon class="w-[2rem] h-[2rem] cursor-pointer" name="delete" @click="delHistory(row)" />
      </div>
      <div class="row">
        <div class="column">操作</div>
        <div
          class="column close-price-green cursor-pointer"
          :class="{ 'close-price-red': row.nowPrice.closePrice >= (row.nextPrice.firstSalePrice + row.nextPrice.firstBuyPrice) / 2 }"
        >
          <el-popover placement="top-start" trigger="hover">
            <template #reference>价格({{ row.nowPrice.closePrice.toFixed(3) }})</template>
            <div>
              <p class="p-1">高：{{ row.nowPrice.highPrice.toFixed(3) }}</p>
              <p class="p-1">低：{{ row.nowPrice.lowPrice.toFixed(3) }}</p>
              <p class="p-1">开：{{ row.nowPrice.openPrice.toFixed(3) }}</p>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="row bg-red-400">
        <div class="column">极限获利位</div>
        <div
          class="column"
        >{{ row.nextPrice.highSalePrice.toFixed(3) }}(+{{ row.nextPrice.highSaleRate.toFixed(2) }}%)</div>
      </div>
      <div class="row bg-red-300">
        <div class="column">第一压力位</div>
        <div
          class="column"
        >{{ row.nextPrice.firstSalePrice.toFixed(3) }}(+{{ row.nextPrice.firstSaleRate.toFixed(2) }}%)</div>
      </div>
      <div class="row bg-green-300">
        <div class="column">第一支撑位</div>
        <div
          class="column"
        >{{ row.nextPrice.firstBuyPrice.toFixed(3) }}(-{{ row.nextPrice.firstBuyRate.toFixed(2) }}%)</div>
      </div>
      <div class="row bg-green-400">
        <div class="column">极限抄底位</div>
        <div
          class="column"
        >{{ row.nextPrice.lowBuyPrice.toFixed(3) }}(-{{ row.nextPrice.lowBuyRate.toFixed(2) }}%)</div>
      </div>
      <div class="row">
        <div class="column">振幅</div>
        <div
          class="column"
        >{{ (row.nextPrice.firstSaleRate + row.nextPrice.firstBuyRate).toFixed(2) }}% - {{ (row.nextPrice.highSaleRate + row.nextPrice.lowBuyRate).toFixed(2) }}%</div>
      </div>
    </div>
    <div class="next-price-box invisible" v-for="i in historyFillRowCount" :key="i"></div>
    <BacktestingLog />
    <GridFundsCalc v-if="isShowPyramidCalc" />
  </div>
</template>

<style lang="scss" scoped>
.next-price-box {
  @apply border outline-2 mt-4 w-[98%]
   md:w-[49%]
   lg:w-[32.3%]
   xl:w-[24%] 
   2xl:w-[19%];

  .row {
    @apply flex justify-center items-center flex-wrap border-b;

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
