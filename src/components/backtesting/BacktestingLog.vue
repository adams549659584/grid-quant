<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue';
import useBacktesting from '../backtesting/hooks/useBacktesting';

const { isShowBacktestingLog, backtestingLogs, closeBacktesting } = useBacktesting();
</script>

<template>
  <div class="backtesting-log-bg" v-show="isShowBacktestingLog" @click.stop="closeBacktesting">
    <div class="backtesting-log-box" @click.stop>
      <div
        class="backtesting-log-item"
        v-for="(item, index) in backtestingLogs"
        :key="index"
        :class="{
          'log-buy': item.includes('网格买入'),
          'log-sale': item.includes('网格卖出'),
          'log-stop-profit': item.includes('止盈卖出'),
          'log-stop-loss': item.includes('止损卖出')
        }"
      >
        {{ item }}
      </div>
      <div class="flex justify-center items-center p-4">
        <el-button type="danger" :icon="CircleClose" @click.stop="closeBacktesting">看完了</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.backtesting-log-bg {
  @apply flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black/60;
  .backtesting-log-box {
    @apply relative bg-white border rounded-sm max-w-[90%] sm:max-w-[60%] max-h-[80vh] overflow-auto text-base text-black font-light;
    .backtesting-log-item {
      @apply w-full px-4 border-b leading-loose cursor-pointer hover:bg-gray-400;
      &.log-buy {
        @apply bg-red-300;
      }
      &.log-sale {
        @apply bg-green-300;
      }
      &.log-stop-profit {
        @apply bg-red-400;
      }
      &.log-stop-loss {
        @apply bg-green-400;
      }
    }
  }
}
</style>
