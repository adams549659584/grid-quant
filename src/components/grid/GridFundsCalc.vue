<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { FunnelChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import SvgIcon from '../icons/SvgIcon.vue';
import useGrid from '@/components/grid/hooks/useGrid';
import useStockHistory from '../history/hooks/useStockHistory';
import { ElMessage, ElMessageBox } from 'element-plus';

echarts.use([TitleComponent, ToolboxComponent, TooltipComponent, FunnelChart, CanvasRenderer]);

const chartsRef = ref<HTMLElement>();
const { initPyramidCalc, showPyramidCalc, hidePyramidCalc, refreshPyramidCalc, pyramidConfig, pyramidConfigList, savePyramidConfig } = useGrid();
const { historyRows } = useStockHistory();

const isShowPyramidConfig = ref(false);
const showPyramidConfig = () => (isShowPyramidConfig.value = true);
const saveConfig = () => {
  isShowPyramidConfig.value = false;
  refreshPyramidCalc();
  savePyramidConfig();
};
const resetConfig = () => {
  pyramidConfigList.value = pyramidConfigList.value.filter((x) => !(x.market === pyramidConfig.market && x.code === pyramidConfig.code));
  const stockEnt = historyRows.value!.find((x) => x.market === pyramidConfig.market && x.code === pyramidConfig.code);
  if (!stockEnt) {
    return ElMessage.error('股票信息有误，请稍后重试');
  }
  ElMessageBox.prompt('请确认基准价，默认为当前最新价', '提示', {
    inputType: 'number',
    inputValue: stockEnt.nowPrice.closePrice.toFixed(stockEnt.precision || 3)
  })
    .then(({ value }) => {
      if (+value > 0) {
        showPyramidCalc({ market: stockEnt.market, code: stockEnt.code, name: stockEnt.name, precision: stockEnt.precision || 3, initPrice: +value });
      } else {
        ElMessage.error('基准价需为数值');
        return resetConfig();
      }
    })
    .catch(() => {
      ElMessage.info('取消重置');
    });
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
    <div
      class="w-full p-[0.5rem] md:w-[50rem] bg-white rounded-md mx-auto text-center leading-none z-20 relative"
    >
      <SvgIcon
        class="w-[2rem] h-[2rem] absolute top-[0.1rem] right-[0.4rem] cursor-pointer z-30"
        name="close"
        color="#999"
        @click="hidePyramidCalc"
      />
      <SvgIcon
        class="w-[2rem] h-[2rem] absolute top-[2.4rem] right-[0.4rem] cursor-pointer z-30"
        name="setting"
        color="#999"
        @click="showPyramidConfig"
      />
      <!-- <div class="text-lg text-gray-700 font-bold">预计：总涨幅20% ， 总产出￥88888.88</div> -->
      <div class="w-full h-[80vh]" ref="chartsRef"></div>
    </div>
  </div>
  <el-dialog v-model="isShowPyramidConfig" title="金字塔配置" width="19rem">
    <el-form label-width="6rem" label-position="right">
      <el-form-item label="金字塔层数">
        <el-input-number
          v-model="pyramidConfig.layerCount"
          :precision="0"
          :min="2"
          :max="Math.round(100 / pyramidConfig.percentRate)"
          :step="1"
        />
      </el-form-item>
      <el-form-item label="金字塔幅度">
        <el-input-number
          v-model="pyramidConfig.percentRate"
          :precision="2"
          :min="0.1"
          :max="Math.round((1 / pyramidConfig.layerCount) * 100)"
          :step="1"
        />
        <span class="ml-1">%</span>
      </el-form-item>
      <el-form-item label="初始份额">
        <el-input-number
          v-model="pyramidConfig.initTradeCount"
          :precision="0"
          :min="pyramidConfig.mixTradeCount"
          :step="pyramidConfig.mixTradeCount"
        />
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
        <el-input
          class="w-[90%]"
          disabled
          :model-value="(pyramidConfig.firstBuyPrice * pyramidConfig.initTradeCount).toFixed(2)"
        />
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
        <el-input
          class="w-[90%]"
          disabled
          :model-value="(pyramidConfig.firstSalePrice * pyramidConfig.initTradeCount).toFixed(2)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="danger" @click="resetConfig">重置基准价</el-button>
        <el-button type="primary" @click="saveConfig">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
