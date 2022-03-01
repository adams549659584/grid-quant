<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { FunnelChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import SvgIcon from '../icons/SvgIcon.vue';
import useGrid from '@/components/grid/hooks/useGrid';

echarts.use([TitleComponent, ToolboxComponent, TooltipComponent, FunnelChart, CanvasRenderer]);

const chartsRef = ref<HTMLElement>();
const { initPyramidCalc, hidePyramidCalc, refreshPyramidCalc, pyramidConfig, savePyramidConfig } = useGrid();

const isShowPyramidConfig = ref(false);
const showPyramidConfig = () => (isShowPyramidConfig.value = true);
const saveConfig = () => {
  isShowPyramidConfig.value = false;
  refreshPyramidCalc();
  savePyramidConfig();
};

onMounted(() => {
  if (chartsRef.value) {
    initPyramidCalc(chartsRef.value);
  }
});
</script>

<template>
  <div
    class="fixed top-0 left-0 bg-black/70 w-full h-full flex justify-center items-center px-1 md:px-6 z-10 box-border cursor-not-allowed overflow-hidden"
    @touchmove.prevent
    @mousewheel.prevent
  >
    <div class="w-full p-[0.5rem] md:w-[50rem] bg-white rounded-md mx-auto text-center leading-none z-20 relative">
      <SvgIcon class="w-[2rem] h-[2rem] absolute top-[0.1rem] right-[0.4rem] cursor-pointer z-30" name="close" color="#999" @click="hidePyramidCalc" />
      <SvgIcon class="w-[2rem] h-[2rem] absolute top-[2.4rem] right-[0.4rem] cursor-pointer z-30" name="setting" color="#999" @click="showPyramidConfig" />
      <!-- <div class="text-lg text-gray-700 font-bold">预计：总涨幅20% ， 总产出￥88888.88</div> -->
      <div class="w-full h-[80vh]" ref="chartsRef"></div>
    </div>
  </div>
  <el-dialog v-model="isShowPyramidConfig" title="金字塔配置" width="19rem">
    <el-form label-width="6rem" label-position="right">
      <el-form-item label="金字塔层数">
        <el-input-number v-model="pyramidConfig.layerCount" :precision="0" :min="2" :max="Math.round(100 / pyramidConfig.percentRate)" :step="1" />
      </el-form-item>
      <el-form-item label="金字塔幅度">
        <el-input-number v-model="pyramidConfig.percentRate" :precision="2" :min="0.1" :max="Math.round((1 / pyramidConfig.layerCount) * 100)" :step="1" />
        <span class="ml-1">%</span>
      </el-form-item>
      <el-form-item label="单笔份额">
        <el-input-number v-model="pyramidConfig.initTradeCount" :precision="0" :min="100" :step="100" />
      </el-form-item>
      <el-form-item label="建仓价格">
        <el-input-number
          v-model="pyramidConfig.firstBuyPrice"
          :precision="pyramidConfig.precision"
          :min="1 / Math.pow(10, pyramidConfig.precision)"
          :step="1 / Math.pow(10, pyramidConfig.precision)"
        />
      </el-form-item>
      <el-form-item label="建仓金额">
        <el-input class="w-[90%]" disabled :model-value="(pyramidConfig.firstBuyPrice * pyramidConfig.initTradeCount).toFixed(2)" />
      </el-form-item>
      <el-form-item label="出货价格">
        <el-input-number
          v-model="pyramidConfig.firstSalePrice"
          :precision="pyramidConfig.precision"
          :min="1 / Math.pow(10, pyramidConfig.precision)"
          :step="1 / Math.pow(10, pyramidConfig.precision)"
        />
      </el-form-item>
      <el-form-item label="出货金额">
        <el-input class="w-[90%]" disabled :model-value="(pyramidConfig.firstSalePrice * pyramidConfig.initTradeCount).toFixed(2)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="saveConfig">重新计算</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>