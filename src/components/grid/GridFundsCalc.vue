<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { TitleComponent, TitleComponentOption, ToolboxComponent, ToolboxComponentOption, TooltipComponent, TooltipComponentOption } from 'echarts/components';
import { FunnelChart, FunnelSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([TitleComponent, ToolboxComponent, TooltipComponent, FunnelChart, CanvasRenderer]);
type EChartsOption = echarts.ComposeOption<TitleComponentOption | ToolboxComponentOption | TooltipComponentOption | FunnelSeriesOption>;

const chartsRef = ref<HTMLElement>();

onMounted(() => {
  if (chartsRef.value) {
    const myChart = echarts.init(chartsRef.value);
    let option: EChartsOption;

    option = {
      title: {
        text: '预计总投入：￥123.123',
        left: 'center',
        top: 'bottom'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },

      series: [
        {
          name: '倒金字塔出货',
          type: 'funnel',
          z: 3,
          width: '80%',
          height: '42%',
          left: 'center',
          top: '0',
          label: {
            position: 'left'
          },
          data: [
            { value: 10, name: '1.000' },
            { value: 9, name: '0.900' },
            { value: 8, name: '0.800' },
            { value: 7, name: '0.700' },
            { value: 6, name: '0.600' },
            { value: 5, name: '0.500' },
            { value: 4, name: '0.400' },
            { value: 3, name: '0.300' },
            { value: 2, name: '0.2000' },
            { value: 1, name: '0.100' }
          ]
        },
        {
          name: '对敲收益',
          type: 'funnel',
          width: '16%',
          height: '60%',
          left: 'center',
          top: '33%',
          label: {
            position: 'left'
          },
          data: [
            { value: 1, name: '对敲收益', itemStyle: { color: '#ee6666' } },
            {
              value: 1,
              name: '0.100',
              itemStyle: { opacity: 0, height: 0 },
              labelLine: { show: false }
            }
          ]
        },
        {
          name: '金字塔建仓',
          type: 'funnel',
          z: 3,
          width: '80%',
          height: '42%',
          left: 'center',
          top: '53%',
          sort: 'ascending',
          label: {
            position: 'left'
          },
          data: [
            { value: 10, name: '1.000' },
            { value: 9, name: '0.900' },
            { value: 8, name: '0.800' },
            { value: 7, name: '0.700' },
            { value: 6, name: '0.600' },
            { value: 5, name: '0.500' },
            { value: 4, name: '0.400' },
            { value: 3, name: '0.300' },
            { value: 2, name: '0.200' },
            { value: 1, name: '0.100' }
          ]
        }
      ]
    };

    option && myChart.setOption(option);
  }
});
</script>

<template>
  <div class="absolute w-full h-full px-1 md:px-6 py-40 z-10 box-border top-0 left-0 bg-black/70 cursor-not-allowed overflow-hidden" @touchmove.prevent @mousewheel.prevent>
    <div class="w-full md:w-[50rem] bg-white rounded-md mx-auto text-center leading-none z-20 relative">
      <h5 class="p-2">测试测试(1.000001)</h5>
      <div class="w-full h-96" ref="chartsRef"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
