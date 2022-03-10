<script setup lang="ts">
import { ref } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import useStockDetail from './hooks/useStockDetail';

const { isShowStockDetail, isLoadingStockDetail, stockActiveInfo } = useStockDetail();
const closeStockDetail = () => (isShowStockDetail.value = false);

const stockDetailLoaded = () => {
  isLoadingStockDetail.value = false;
};
</script>

<template>
  <div
    class="fixed -top-[999rem] -left-[999rem] md:top-0 md:left-0 bg-black/70 w-full h-full flex justify-center items-center px-1 md:px-6 z-10 box-border cursor-not-allowed overflow-hidden"
    @touchmove.prevent
    @mousewheel.prevent
  >
    <div class="w-full md:max-w-7xl bg-white rounded-md mx-auto text-center leading-none z-20 relative">
      <SvgIcon class="w-[2rem] h-[2rem] absolute top-[0.1rem] right-[0.4rem] cursor-pointer z-3" name="close" color="#999" @click="closeStockDetail" />
      <div v-loading="isLoadingStockDetail" v-if="stockActiveInfo" class="w-full">
        <iframe
          :src="`//quote.eastmoney.com/basic/h5chart-iframe.html?code=${stockActiveInfo.code}&market=${stockActiveInfo.market}&type=r`"
          width="1280px"
          height="720px"
          frameborder="0"
          @load="stockDetailLoaded"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
