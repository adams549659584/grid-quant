import { ref } from 'vue';

// 最小网格比例0.8%
const minGridRate = 0.008;
const minGridOptCount = ref(5);
// 最小持仓
const minHoldCount = ref(1000);
const gridCount = ref(400);

function useGrid() {
  const setGridCount = (num: number) => {
    gridCount.value = num;
  };

  return {
    minGridRate,
    minGridOptCount,
    minHoldCount,
    gridCount,
    setGridCount
  };
}

export default useGrid;
