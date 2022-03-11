<script setup lang="ts">
import useStockHistory from '../history/hooks/useStockHistory';
import SvgIcon from '../icons/SvgIcon.vue';
import useStockDetail from './hooks/useStockDetail';

const { isShowStockDetail, isLoadingStockDetail, stockActiveInfo, showStockDetail } = useStockDetail();
const { filterHistoryRows } = useStockHistory();
const closeStockDetail = () => (isShowStockDetail.value = false);

const stockDetailLoaded = () => {
  isLoadingStockDetail.value = false;
};

const prevDetail = async () => {
  const nowIndex = filterHistoryRows.value.findIndex((x) => x.market === stockActiveInfo.value!.market && x.code === stockActiveInfo.value!.code);
  let prevIndex = nowIndex - 1;
  if (prevIndex < 0) {
    prevIndex = filterHistoryRows.value.length - 1;
  }
  showStockDetail(filterHistoryRows.value[prevIndex]);
  isLoadingStockDetail.value = false;
};
const nextDetail = async () => {
  const nowIndex = filterHistoryRows.value.findIndex((x) => x.market === stockActiveInfo.value!.market && x.code === stockActiveInfo.value!.code);
  let nextIndex = nowIndex + 1;
  if (nextIndex >= filterHistoryRows.value.length) {
    nextIndex = 0;
  }
  showStockDetail(filterHistoryRows.value[nextIndex]);
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
      <SvgIcon v-if="filterHistoryRows.length > 1" class="w-[2rem] h-[2rem] absolute top-1/2 left-[0.4rem] cursor-pointer z-3" name="prev" color="#999" @click="prevDetail" />
      <SvgIcon v-if="filterHistoryRows.length > 1" class="w-[2rem] h-[2rem] absolute top-1/2 right-[0.4rem] cursor-pointer z-3" name="next" color="#999" @click="nextDetail" />
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
