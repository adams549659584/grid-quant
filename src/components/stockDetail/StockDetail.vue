<script setup lang="ts">
import { computed, ref } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import useStockDetail from './hooks/useStockDetail';

const { isShowStockDetail } = useStockDetail();
const closeStockDetail = () => (isShowStockDetail.value = false);
</script>

<template>
  <div
    class="fixed -top-[999rem] -left-[999rem] md:top-0 md:left-0 bg-black/70 w-full h-full flex justify-center items-center px-1 md:px-6 z-10 box-border cursor-not-allowed overflow-hidden"
    @touchmove.prevent
    @mousewheel.prevent
  >
    <div class="w-full p-[0.5rem] md:w-[50rem] bg-white rounded-md mx-auto text-center leading-none z-20 relative">
      <SvgIcon class="w-[2rem] h-[2rem] absolute top-[0.1rem] right-[0.4rem] cursor-pointer z-3" name="close" color="#999" @click="closeStockDetail" />
      <div class="w-full h-[80vh]">
        <h1></h1>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
