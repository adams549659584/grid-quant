import { INextPrice } from '../../../helpers/StockHelper';

export interface ISearchResult {
  /**
   * 结果集
   */
  Data: ISearchResultRow[];

  /**
   * 状态
   */
  Status: number;

  /**
   * 状态描述
   */
  Message: string;

  /**
   * 总页数
   */
  TotalPage: number;

  /**
   * 总行数
   */
  TotalCount: number;

  /**
   * 当前页码
   */
  PageIndex: number;

  /**
   * 每页大小
   */
  PageSize: number;

  /**
   * 搜索关键字
   */
  Keyword: string;

  /**
   * 相关词？
   */
  RelatedWord: string;

  /**
   * 来源名称:QuotationCodeTable
   */
  SourceName: string;

  /**
   * 来源ID
   */
  SourceId: number;

  /**
   * 注释:
   */
  ScrollId: string;
}

export interface ISearchResultRow {
  /**
   * 名词:东方盛虹
   */
  Name: string;

  /**
   * 编码:000301
   */
  Code: string;

  /**
   * 拼音:DFSH
   */
  PinYin: string;

  /**
   * 市场类型:2
   */
  MarketType: string;

  /**
   * 注释:6
   */
  JYS: string;

  /**
   * 注释:0
   */
  MktNum: string;

  /**
   * 注释:
   */
  JYS4App: string;

  /**
   * 注释:
   */
  MktNum4App: string;

  /**
   * 注释:0003012
   */
  ID: string;

  /**
   * 注释:AStock
   */
  Classify: string;

  /**
   * 注释:true
   */
  IsExactMatch: string;

  /**
   * 注释:2
   */
  SecurityType: string;

  /**
   * 注释:深A
   */
  SecurityTypeName: string;
}
