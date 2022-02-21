import { ref, reactive, onMounted } from 'vue';
import * as echarts from 'echarts/core';
import { TitleComponentOption, ToolboxComponentOption, TooltipComponentOption } from 'echarts/components';
import { FunnelSeriesOption } from 'echarts/charts';
import { IHistoryRow } from '@/api/stock/model/IHistoryRow';
import { mathRound } from '@/helpers/StockHelper';
import { ElMessage } from 'element-plus';

type EChartsOption = echarts.ComposeOption<TitleComponentOption | ToolboxComponentOption | TooltipComponentOption | FunnelSeriesOption>;

// 最小网格比例0.8%
const minGridRate = ref(0.008);
const minGridOptCount = ref(5);
// 最小持仓
const minHoldCount = ref(1000);
const gridCount = ref(400);
// 金字塔建仓及倒金字塔出货
// 金字塔echart
const pyramidEchart = ref<echarts.ECharts>();
const pyramidOption = reactive<EChartsOption>({
  title: {
    show: false
  },
  tooltip: {
    trigger: 'item'
  },
  toolbox: {
    bottom: '2',
    showTitle: false,
    feature: {
      saveAsImage: {
        title: '保存为图片'
      }
    }
  },
  series: [
    {
      name: '倒金字塔出货',
      type: 'funnel',
      z: 3,
      width: '70%',
      height: '42%',
      left: 'center',
      top: '0',
      label: {
        position: 'left'
      },
      data: [{ value: 10, name: '1.000' }]
    },
    {
      name: '对敲收益',
      type: 'funnel',
      width: '28%',
      height: '100%',
      left: 'center',
      top: '25%',
      label: {
        position: 'left'
      },
      tooltip: {
        formatter: '建立底仓，设置适合的比例，交给网格机器人自动交易'
      },
      data: [
        { value: 1, name: '网格交易对敲收益', itemStyle: { color: '#ffb84d' } },
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
      width: '70%',
      height: '42%',
      left: 'center',
      top: '58%',
      sort: 'ascending',
      label: {
        position: 'left'
      },
      data: [{ value: 10, name: '1.000' }]
    }
  ]
});

// 是否显示金字塔模型
const isShowPyramidCalc = ref(false);

export interface IPyramidConfig {
  /**
   * 沪深
   */
  market: number;
  /**
   * 股票编码
   */
  code: string;
  /**
   * 股票名称
   */
  name: string;
  /**
   * 金字塔出货价格
   */
  firstSalePrice: number;
  /**
   * 出货单笔金额
   */
  firstSaleAmt: number;
  /**
   * 金字塔建仓价格
   */
  firstBuyPrice: number;
  /**
   * 开仓单笔金额
   */
  firstBuyAmt: number;
  /**
   * 金字塔比例
   */
  rate: number;
  /**
   * 金字塔层数
   */
  layerCount: number;
  /**
   * 金字塔交易数量
   */
  initTradeCount: number;
}

/**
 * 金字塔配置
 */
const pyramidConfig = reactive<IPyramidConfig>({
  market: 1,
  code: '000001',
  name: '上证指数',
  firstBuyPrice: 0,
  firstBuyAmt: 2000,
  firstSalePrice: 0,
  firstSaleAmt: 2000,
  rate: 0.02,
  layerCount: 10,
  initTradeCount: 100
});

const initPyramidCalc = (dom: HTMLElement) => {
  pyramidEchart.value = echarts.init(dom);
  pyramidEchart.value.setOption(pyramidOption);
};
const showPyramidCalc = (config: Partial<IPyramidConfig>) => {
  Object.assign(pyramidConfig, config);
  if (!config.firstSalePrice && config.firstBuyPrice) {
    pyramidConfig.firstSalePrice = mathRound(config.firstBuyPrice * (1 + pyramidConfig.rate), 3);
  }
  pyramidConfig.initTradeCount = Math.round(pyramidConfig.firstBuyAmt / pyramidConfig.firstBuyPrice / 100) * 100;
  if (pyramidConfig.initTradeCount === 0) {
    ElMessage.warning(`单手金额超出最低建仓金额￥${pyramidConfig.firstBuyAmt.toFixed()}，默认设为1手`);
    pyramidConfig.initTradeCount = 100;
  }
  let totalBuyAmt = 0;
  let totalBuyCount = 0;
  let totalSaleAmt = 0;
  let totalSaleCount = 0;
  if (Array.isArray(pyramidOption.series)) {
    // 倒金字塔出货
    pyramidOption.series[0].data = [];
    for (let i = 1; i <= pyramidConfig.layerCount; i++) {
      const nowPrice = mathRound(pyramidConfig.firstSalePrice * (1 + pyramidConfig.rate * (i - 1)), 3);
      const nowTradeCount = pyramidConfig.initTradeCount * i;
      const usedAmt = mathRound(nowPrice * nowTradeCount, 2);
      const nowTotalSaleAmt = (totalSaleAmt += usedAmt);
      const nowTotalSaleCount = (totalSaleCount += nowTradeCount);
      const data = {
        value: i,
        name: `${nowPrice.toFixed(3)} × ${nowTradeCount}`,
        label: {
          color: 'red'
        },
        tooltip: {
          formatter: () => {
            return `
            <p class="text-left">${i}层出货：￥${usedAmt.toFixed(2)}</p>
            <p class="text-left">总涨幅：${(pyramidConfig.rate * i * 100).toFixed(0)}%</p>
            <p class="text-left">总卖出份额：${nowTotalSaleCount}</p>
            <p class="text-left">总产出：￥${nowTotalSaleAmt.toFixed(2)}</p>
            `;
          }
        }
      };
      pyramidOption.series[0].data.push(data);
    }
    // 网格交易
    (pyramidOption.series[1].data as any)[0].name = `${pyramidConfig.code} ${pyramidConfig.name} 网格交易`;
    // 金字塔建仓
    pyramidOption.series[2].data = [];
    for (let i = 1; i <= pyramidConfig.layerCount; i++) {
      const nowPrice = mathRound(pyramidConfig.firstBuyPrice * (1 - pyramidConfig.rate * (i - 1)), 3);
      const nowTradeCount = pyramidConfig.initTradeCount * i;
      const usedAmt = mathRound(nowPrice * nowTradeCount, 2);
      const nowTotalBuyAmt = (totalBuyAmt += usedAmt);
      const nowTotalBuyCount = (totalBuyCount += nowTradeCount);
      const data = {
        value: i,
        name: `${nowPrice.toFixed(3)} × ${nowTradeCount}`,
        label: {
          color: 'green'
        },
        tooltip: {
          formatter: () => {
            return `
            <p class="text-left">${i}层建仓：￥${usedAmt.toFixed(2)}</p>
            <p class="text-left">持仓成本：￥${mathRound(nowTotalBuyAmt / nowTotalBuyCount, 3).toFixed(3)}</p>
            <p class="text-left">总跌幅：${(pyramidConfig.rate * (i - 1) * 100).toFixed(0)}%</p>
            <p class="text-left">总投入：￥${nowTotalBuyAmt.toFixed(2)}</p>
            `;
          }
        }
      };
      pyramidOption.series[2].data.push(data);
    }
  }
  // if (!Array.isArray(pyramidOption.title) && pyramidOption.title) {
  //   pyramidOption.title.text = `预计：总跌幅${pyramidConfig.rate * 100 * pyramidConfig.layerCount}% ， 总投入￥${totalUsedAmt.toFixed(
  //     2
  //   )} \n 总持仓${totalHoldCount} ， 成本￥${mathRound(totalUsedAmt / totalHoldCount, 3)}`;
  // }
  (pyramidOption.toolbox as any).feature.saveAsImage.name = `金字塔建仓模型_${pyramidConfig.code}_${pyramidConfig.name}`;
  if (pyramidEchart.value) {
    pyramidEchart.value.setOption(pyramidOption);
  }
  // console.log(`echart option : `, JSON.stringify(pyramidOption));
  isShowPyramidCalc.value = true;
};
const hidePyramidCalc = () => (isShowPyramidCalc.value = false);
const refreshPyramidCalc = () => {
  pyramidConfig.firstBuyAmt = mathRound(pyramidConfig.firstBuyPrice * pyramidConfig.initTradeCount, 2);
  pyramidConfig.firstSaleAmt = mathRound(pyramidConfig.firstSaleAmt * pyramidConfig.initTradeCount, 2);
  pyramidConfig && showPyramidCalc(pyramidConfig);
};

const PyramidConfigCacheKey = 'PyramidConfigCache';
const savePyramidConfig = () => {
  localStorage.setItem(PyramidConfigCacheKey, JSON.stringify(pyramidConfig));
};
const initPyramidConfig = () => {
  const configStr = localStorage.getItem(PyramidConfigCacheKey);
  if (configStr) {
    const config = JSON.parse(configStr);
    Object.assign(pyramidConfig, config);
  }
};

onMounted(() => {
  initPyramidConfig();
});

function useGrid() {
  return {
    minGridRate,
    minGridOptCount,
    minHoldCount,
    gridCount,
    pyramidEchart,
    isShowPyramidCalc,
    initPyramidCalc,
    showPyramidCalc,
    hidePyramidCalc,
    refreshPyramidCalc,
    savePyramidConfig,
    pyramidConfig
  };
}

export default useGrid;
