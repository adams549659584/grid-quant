import { jsonp } from '../base/http';
import { IFundHoldDetail } from './model/IFundHoldDetailResult';
import { IKLineResult, IKLineRow } from './model/IKLineResult';
import { ISearchResult } from './model/ISearchResult';
import { IStockTrendsResult } from './model/IStockTrendsResult';

/**
 * 搜索股票基金
 * @param keyword 关键字
 * @param pageIndex 页码
 * @param pageSize 每页大小
 * @returns
 */
export function search(keyword: string, pageIndex = 1, pageSize = 10) {
  const url = `https://searchapi.eastmoney.com/api/Info/Search?appid=el1902262&type=14&token=CCSDCZSDCXYMYZYYSYYXSMDDSMDHHDJT&and14=MultiMatch/Name,Code,PinYin/${keyword}/true&returnfields14=Name,Code,PinYin,MarketType,JYS,MktNum,JYS4App,MktNum4App,ID,Classify,IsExactMatch,SecurityType,SecurityTypeName&pageIndex14=${pageIndex}&pageSize14=${pageSize}&isAssociation14=false1642753371132`;
  return jsonp<ISearchResult>(url);
}

/**
 * 处理K线数据
 * @param klines
 * @returns
 */
function handleKLineData(klineRes: IKLineResult) {
  if (klineRes && klineRes.data && klineRes.data.klines) {
    klineRes.data.klineDatas = klineRes.data.klines.map((klineStr) => {
      const klineArr = klineStr.split(',');
      const dateTimeStr = klineArr[0];
      let dateStr = dateTimeStr;
      let timeStr = '';
      if (dateTimeStr.includes(' ')) {
        [dateStr, timeStr] = dateTimeStr.split(' ');
      }
      const klineData: IKLineRow = {
        dateStr,
        timeStr,
        openPrice: parseFloat(klineArr[1]),
        closePrice: parseFloat(klineArr[2]),
        highPrice: parseFloat(klineArr[3]),
        lowPrice: parseFloat(klineArr[4])
      };
      return klineData;
    });
  }
  return klineRes;
}

/**
 * 获取5分钟K线
 * @param secid 股票基金编码
 * @returns
 */
export async function getKLineM5(secid: string) {
  const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b&rtntype=6&secid=${secid}&klt=5&fqt=1
  `;
  const klineRes = await jsonp<IKLineResult>(url);
  return handleKLineData(klineRes);
}

/**
 * 获取日K线
 * @param secid 股票基金编码
 * @returns
 */
export async function getKLineD1(secid: string, limitCount: number) {
  // 日期,开盘价(元),收盘价(元),最高价(元),最低价(元),成交量(手),成交额(元),振幅(%),涨跌幅(%),涨跌额(元)(今天的收盘价，相对昨天收盘价，增加的股价，即 涨跌额=今天收盘价-昨天收盘价),涨跌额(元)  今天的收盘价，相对昨天收盘价，增加的股价，即 涨跌额=今天收盘价-昨天收盘价
  const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&klt=101&fqt=0&end=20500101&lmt=${limitCount}&_=${Date.now()}`;
  const klineRes = await jsonp<IKLineResult>(url);
  return handleKLineData(klineRes);
}

const quotePath = () => {
  const rnd = Math.floor(Math.random() * (99 - 1)) + 1;
  return 'https://' + rnd + '.push2.eastmoney.com/';
};

/**
 * 获取股票信息API
 */
export function getStockListApi(refeshtime: 2000 | 5000 | 100000, secids: string[]) {
  const count = secids.length;
  const postr = '&po=1';
  const pxstr = '';
  const fields = ['f1', 'f2', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17'];
  return (
    quotePath() +
    'api/qt/ulist/sse?invt=3&pi=0&pz=' +
    count +
    '&mpi=' +
    refeshtime +
    '&secids=' +
    secids +
    '&ut=6d2ffaa6a585d612eda28417681d58fb&fields=' +
    fields.join(',') +
    postr +
    pxstr
  );
}

/**
 * 获取基金持仓明细
 * @param fundCode 基金代码
 */
export async function getFundHoldDetail(fundCode: string, topline: number = 10) {
  // https://blog.wangmao.me/nginx-create-cors-anywhere.html
  const url = `https://cors-anywhere.azm.workers.dev/${encodeURIComponent(
    `https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code=${fundCode}&topline=${topline}&year=&month=&rt=${Date.now()}`
  )}`;
  const resText = await fetch(url, {}).then((res) => res.text());
  const apidata: { arryear: number[]; content: string; curyear: number } = new Function(`${resText} return apidata;`)();
  const stockHtml = document.createElement('html');
  stockHtml.innerHTML = apidata.content;
  const secidMaps = stockHtml
    .querySelector<HTMLElement>('.box:nth-child(1) #gpdmList')
    ?.innerText.split(',')
    .reduce((prev, curr) => {
      if (curr) {
        const secidArr = curr.split('.');
        prev.set(secidArr[1], +secidArr[0]);
      }
      return prev;
    }, new Map<string, number>());
  const results: IFundHoldDetail[] = Array.from(stockHtml.querySelectorAll('.box:nth-child(1) tbody tr')).map((x) => {
    const code = (x.children[1] as HTMLElement).innerText;
    return {
      code,
      name: (x.children[2] as HTMLElement).innerText,
      market: (secidMaps && secidMaps.get(code)) || 0,
      holdPercentage: (x.children[6] as HTMLElement).innerText,
      holdCount: (x.children[7] as HTMLElement).innerText,
      holdAmt: (x.children[8] as HTMLElement).innerText
    };
  });
  return results;
}

/**
 * 获取股票基金行情
 * @param secid 股票基金编码
 * @returns
 */
export async function getTrends(secid: string) {
  const url = `https://push2.eastmoney.com/api/qt/stock/trends2/get?secid=${secid}&fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f53,f56,f58&iscr=0&iscca=0&ndays=1`;
  const result = await jsonp<IStockTrendsResult>(url);
  if (result && result.data && result.data.trends && result.data.trends.length > 0) {
    result.data.trendArrays = result.data.trends.map((x) => x.split(','));
  }
  return result;
}
