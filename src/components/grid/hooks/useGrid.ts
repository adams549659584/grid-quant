import { ref, reactive } from 'vue';
import * as echarts from 'echarts/core';
import { TitleComponentOption, ToolboxComponentOption, TooltipComponentOption } from 'echarts/components';
import { FunnelSeriesOption } from 'echarts/charts';
import { mathRound } from '@/helpers/StockHelper';
import { ElMessage } from 'element-plus';
import useStockHistory from '@/components/history/hooks/useStockHistory';
import usePredict from '@/components/predict/hooks/usePredict';

const { isMobileScreen } = useStockHistory();
const { calcRate } = usePredict();

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
   * 精度
   */
  precision: number;
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
  // rate: number;
  /**
   * 金字塔比例（百分比）
   */
  percentRate: number;
  /**
   * 金字塔层数
   */
  layerCount: number;
  /**
   * 最小交易数量
   */
  mixTradeCount: number;
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
  precision: 3,
  firstBuyPrice: 0,
  firstBuyAmt: 2000,
  firstSalePrice: 0,
  firstSaleAmt: 2000,
  // rate: 0.02,
  percentRate: 5,
  layerCount: 10,
  mixTradeCount: 100,
  initTradeCount: 100
});
// 金字塔配置缓存
const pyramidConfigList = ref<IPyramidConfig[]>([]);

const initPyramidCalc = (dom: HTMLElement) => {
  pyramidEchart.value = echarts.init(dom, undefined, { renderer: 'svg' });
  pyramidEchart.value.setOption(pyramidOption);
};
const showPyramidCalc = (config: Partial<IPyramidConfig>) => {
  if (pyramidConfigList.value.length === 0) {
    initPyramidConfig();
  }
  const cacheConfig = pyramidConfigList.value.find((x) => x.market === config.market && x.code === config.code);
  // console.log(`showPyramidCalc showPyramidCalc :`, cacheConfig);
  Object.assign(pyramidConfig, cacheConfig || config);
  pyramidConfig.mixTradeCount = pyramidConfig.name.endsWith('债') ? 10 : 100;
  // 首次显示
  if (!cacheConfig && !config.firstSalePrice && config.firstBuyPrice) {
    pyramidConfig.firstBuyPrice = mathRound(config.firstBuyPrice * (1 - pyramidConfig.percentRate / 100), pyramidConfig.precision || 3);
    pyramidConfig.firstSalePrice = mathRound(config.firstBuyPrice * (1 + pyramidConfig.percentRate / 100), pyramidConfig.precision || 3);
  }
  pyramidConfig.initTradeCount = Math.round(pyramidConfig.firstBuyAmt / pyramidConfig.firstBuyPrice / pyramidConfig.mixTradeCount) * pyramidConfig.mixTradeCount;
  handlePyramidConfig();
  // console.log(`echart option : `, JSON.stringify(pyramidOption));
  isShowPyramidCalc.value = true;
};
const handlePyramidConfig = () => {
  const { historyRows } = useStockHistory();
  if (pyramidConfig.initTradeCount === 0) {
    ElMessage.warning(`单手金额超出最低建仓金额￥${pyramidConfig.firstBuyAmt.toFixed()}，默认设为${pyramidConfig.mixTradeCount}股`);
    pyramidConfig.initTradeCount = pyramidConfig.mixTradeCount;
  }
  let totalBuyAmt = 0;
  let totalBuyCount = 0;
  let totalSaleAmt = 0;
  let totalSaleCount = 0;
  if (Array.isArray(pyramidOption.series)) {
    // 倒金字塔出货
    pyramidOption.series[0].width = isMobileScreen ? '40%' : '70%';
    pyramidOption.series[0].data = [];
    for (let i = 1; i <= pyramidConfig.layerCount; i++) {
      const nowPrice = mathRound(pyramidConfig.firstSalePrice * Math.pow(1 + pyramidConfig.percentRate / 100, i - 1), pyramidConfig.precision);
      const nowTradeCount = pyramidConfig.initTradeCount * i;
      const usedAmt = mathRound(nowPrice * nowTradeCount, 2);
      const nowTotalSaleAmt = (totalSaleAmt += usedAmt);
      const nowTotalSaleCount = (totalSaleCount += nowTradeCount);
      const data = {
        value: i,
        name: `${nowPrice.toFixed(pyramidConfig.precision)} × ${nowTradeCount}`,
        label: {
          color: 'red'
        },
        tooltip: {
          formatter: () => {
            return `
            <p class="text-left">${i}层出货：￥${usedAmt.toFixed(2)}</p>
            <p class="text-left">总涨幅：${(pyramidConfig.percentRate * i).toFixed(2)}%</p>
            <p class="text-left">总卖出份额：${nowTotalSaleCount}</p>
            <p class="text-left">总产出：￥${nowTotalSaleAmt.toFixed(2)}</p>
            `;
          }
        }
      };
      pyramidOption.series[0].data.push(data);
    }
    // 网格交易
    pyramidOption.series[1].width = isMobileScreen ? '12%' : '28%';
    (pyramidOption.series[1].data as any)[0].name = isMobileScreen ? `${pyramidConfig.code}` : `${pyramidConfig.code} ${pyramidConfig.name} 网格交易`;
    let gridSuggestion = '建立适合的网格比例，自动交易';
    const stockEnt = historyRows.value!.find((x) => x.market === pyramidConfig.market && x.code === pyramidConfig.code);
    if (stockEnt?.nextPrice) {
      let todayRate = calcRate(stockEnt.prevPrice.closePrice, stockEnt.nextPrice.firstSalePrice) - calcRate(stockEnt.prevPrice.closePrice, stockEnt.nextPrice.firstBuyPrice);
      let suggestGridRate = mathRound(todayRate / 3, 4);
      if (suggestGridRate <= minGridRate.value) {
        suggestGridRate = minGridRate.value;
      }
      gridSuggestion = `今日建议网格比例 ${(suggestGridRate * 100).toFixed(2)}% `;
    }
    pyramidOption.series[1].tooltip!.formatter = `建议底仓 ${pyramidConfig.initTradeCount * 2} 股，网格区间￥${pyramidConfig.firstBuyPrice} - ￥${
      pyramidConfig.firstSalePrice
    }，${gridSuggestion}`;
    // 金字塔建仓
    pyramidOption.series[2].width = isMobileScreen ? '40%' : '70%';
    pyramidOption.series[2].data = [];
    for (let i = 1; i <= pyramidConfig.layerCount; i++) {
      const nowPrice = mathRound(pyramidConfig.firstBuyPrice * Math.pow(1 - pyramidConfig.percentRate / 100, i - 1), pyramidConfig.precision);
      const nowTradeCount = pyramidConfig.initTradeCount * i;
      const usedAmt = mathRound(nowPrice * nowTradeCount, 2);
      const nowTotalBuyAmt = (totalBuyAmt += usedAmt);
      const nowTotalBuyCount = (totalBuyCount += nowTradeCount);
      const data = {
        value: i,
        name: `${nowPrice.toFixed(pyramidConfig.precision)} × ${nowTradeCount}`,
        label: {
          color: 'green'
        },
        tooltip: {
          formatter: () => {
            return `
            <p class="text-left">${i}层建仓：￥${usedAmt.toFixed(2)}</p>
            <p class="text-left">持仓成本：￥${mathRound(nowTotalBuyAmt / nowTotalBuyCount, pyramidConfig.precision).toFixed(pyramidConfig.precision)}</p>
            <p class="text-left">总跌幅：${(pyramidConfig.percentRate * i).toFixed(2)}%</p>
            <p class="text-left">总投入：￥${nowTotalBuyAmt.toFixed(2)}</p>
            `;
          }
        }
      };
      pyramidOption.series[2].data.push(data);
    }
  }
  // if (!Array.isArray(pyramidOption.title) && pyramidOption.title) {
  //   pyramidOption.title.text = `预计：总跌幅${pyramidConfig.percentRate * pyramidConfig.layerCount}% ， 总投入￥${totalUsedAmt.toFixed(
  //     2
  //   )} \n 总持仓${totalHoldCount} ， 成本￥${mathRound(totalUsedAmt / totalHoldCount, 3)}`;
  // }
  (pyramidOption.toolbox as any).feature.saveAsImage.name = `金字塔建仓模型_${pyramidConfig.code}_${pyramidConfig.name}`;
  if (pyramidEchart.value) {
    pyramidEchart.value.setOption(pyramidOption);
  }
};
const hidePyramidCalc = () => (isShowPyramidCalc.value = false);
const refreshPyramidCalc = () => {
  pyramidConfig.firstBuyAmt = mathRound(pyramidConfig.firstBuyPrice * pyramidConfig.initTradeCount, 2);
  pyramidConfig.firstSaleAmt = mathRound(pyramidConfig.firstSaleAmt * pyramidConfig.initTradeCount, 2);
  pyramidConfig && handlePyramidConfig();
};

const PyramidConfigCacheKey = 'pyramid_config';
const savePyramidConfig = () => {
  const existIndex = pyramidConfigList.value.findIndex((x) => x.market === pyramidConfig.market && x.code === pyramidConfig.code);
  if (existIndex > -1) {
    pyramidConfigList.value[existIndex] = { ...pyramidConfig };
  } else {
    pyramidConfigList.value = [...pyramidConfigList.value, { ...pyramidConfig }];
  }
  localStorage.setItem(PyramidConfigCacheKey, JSON.stringify(pyramidConfigList.value));
};
const initPyramidConfig = () => {
  const configStr = localStorage.getItem(PyramidConfigCacheKey);
  if (configStr) {
    const configList = JSON.parse(configStr);
    Object.assign(pyramidConfigList.value, configList);
    Object.assign(pyramidConfig, pyramidConfigList.value[pyramidConfigList.value.length - 1]);
    // console.log(`pyramidConfig : `, pyramidConfig);
  }
};

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
    pyramidConfig,
    pyramidConfigList
  };
}

export default useGrid;
