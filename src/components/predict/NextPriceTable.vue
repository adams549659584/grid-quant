<script setup lang="ts">
import useStockHistory from '../history/hooks/useStockHistory';
import { IHistoryRow } from '@/api/stock/model/IHistoryRow';
import usePredict from './hooks/usePredict';

const { isMobileScreen, historyRows } = useStockHistory();
const { calcPercentRate } = usePredict();

/**
 * 价格排序
 */
const sortPrice = (a: IHistoryRow, b: IHistoryRow) => {
  return a.nowPrice.closePrice - b.nowPrice.closePrice;
};

/**
 * 涨跌幅
 */
const sortRate = (a: IHistoryRow, b: IHistoryRow) => {
  const rateA = a.nowPrice.closePrice / a.prevPrice.closePrice - 1;
  const rateB = b.nowPrice.closePrice / b.prevPrice.closePrice - 1;
  return rateA - rateB;
};

const filterOpt = (value: string, row: IHistoryRow) => {
  switch (value) {
    case '极限抄底':
      return row.nowPrice.closePrice <= row.nextPrice.lowBuyPrice;
    case '第一支撑':
      return row.nowPrice.closePrice <= row.nextPrice.firstBuyPrice && row.nowPrice.closePrice > row.nextPrice.lowBuyPrice;
    case '第一压力':
      return row.nowPrice.closePrice >= row.nextPrice.firstSalePrice && row.nowPrice.closePrice < row.nextPrice.highSalePrice;
    case '极限获利':
      return row.nowPrice.closePrice >= row.nextPrice.highSalePrice;
  }
  return true;
};
</script>

<template>
  <div v-if="historyRows && historyRows.length > 0" class="w-[98%] xl:w-4/5 mx-auto mt-4">
    <el-table :data="historyRows" stripe :border="true">
      <!-- <el-table-column type="expand">
        <template #default="props">
          <div>
            <p></p>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column prop="code" label="股票基金" sortable>
        <template #default="scope">
          <h1>{{ scope.row.market }}.{{ scope.row.code }} {{ scope.row.name }}</h1>
        </template>
      </el-table-column>
      <el-table-column label="现价" sortable :sort-method="sortPrice">
        <template #default="scope">
          <div
            :class="{
              'text-stocks-red': scope.row.nowPrice.closePrice > scope.row.prevPrice.closePrice,
              'text-stocks-green': scope.row.nowPrice.closePrice < scope.row.prevPrice.closePrice
            }"
          >
            {{ scope.row.nowPrice.closePrice.toFixed(3) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="涨跌幅" sortable :sort-method="sortRate">
        <template #default="scope">
          <div
            :class="{
              'text-stocks-red': scope.row.nowPrice.closePrice > scope.row.prevPrice.closePrice,
              'text-stocks-green': scope.row.nowPrice.closePrice < scope.row.prevPrice.closePrice
            }"
          >
            {{ calcPercentRate(scope.row.prevPrice.closePrice, scope.row.nowPrice.closePrice) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="!isMobileScreen" label="极限获利位">
        <template #default="scope">
          <div class="text-red-500">{{ scope.row.nextPrice.highSalePrice.toFixed(3) }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="!isMobileScreen" label="第一压力位">
        <template #default="scope">
          <div class="text-red-400">{{ scope.row.nextPrice.firstSalePrice.toFixed(3) }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="!isMobileScreen" label="第一支撑位">
        <template #default="scope">
          <div class="text-green-400">{{ scope.row.nextPrice.firstBuyPrice.toFixed(3) }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="!isMobileScreen" label="极限抄底位">
        <template #default="scope">
          <div class="text-green-500">{{ scope.row.nextPrice.lowBuyPrice.toFixed(3) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作建议"
        :filters="[
          { text: '极限抄底', value: '极限抄底' },
          { text: '第一支撑', value: '第一支撑' },
          { text: '第一压力', value: '第一压力' },
          { text: '极限获利', value: '极限获利' },
          { text: '无', value: '无' }
        ]"
        :filter-method="filterOpt"
      >
        <template #default="scope">
          <div>
            <span class="text-green-500" v-if="scope.row.nowPrice.closePrice <= scope.row.nextPrice.lowBuyPrice">极限抄底</span>
            <span
              class="text-green-400"
              v-else-if="scope.row.nowPrice.closePrice <= scope.row.nextPrice.firstBuyPrice && scope.row.nowPrice.closePrice > scope.row.nextPrice.lowBuyPrice"
              >第一支撑</span
            >
            <span
              class="text-red-400"
              v-else-if="scope.row.nowPrice.closePrice >= scope.row.nextPrice.firstSalePrice && scope.row.nowPrice.closePrice < scope.row.nextPrice.highSalePrice"
              >第一压力</span
            >
            <span class="text-red-500" v-else-if="scope.row.nowPrice.closePrice >= scope.row.nextPrice.highSalePrice">极限获利</span>
            <span v-else>无</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped></style>
