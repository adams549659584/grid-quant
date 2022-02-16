<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

const klineChartsRef = ref<HTMLElement>();

onMounted(() => {
  if (klineChartsRef.value) {
    const klineChart = echarts.init(klineChartsRef.value);
    klineChart.setOption({
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    });
  }
});
</script>

<template>
  <div class="absolute w-full h-full px-1 md:px-6 py-40 z-10 box-border top-0 left-0 bg-black/70">
    <div class="w-full md:w-[50rem] bg-white rounded-md px-4 mx-auto text-center leading-none">
      <h5 class="p-2">测试测试(1.000001)</h5>
      <div class="w-full h-96" ref="klineChartsRef"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
