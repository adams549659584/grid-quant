import { ref } from 'vue';

const isShowStockKLine = ref(false);

export default function useStockKLine(market: number, code: string) {
  return {
    isShowStockKLine
  };
}
