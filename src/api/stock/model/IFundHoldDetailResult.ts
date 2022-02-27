export interface IFundHoldDetailResult {
  Datas: IFundHoldDetailData;
  ErrCode: number;
  Success: boolean;
  ErrMsg?: any;
  Message?: any;
  ErrorCode: string;
  ErrorMessage?: any;
  ErrorMsgLst?: any;
  TotalCount: number;
  Expansion: string;
}

interface IFundHoldDetailData {
  fundStocks: IFundStock[];
  fundboods: any[];
  fundfofs: any[];
  ETFCODE?: any;
  ETFSHORTNAME?: any;
}

export interface IFundStock {
  GPDM: string;
  GPJC: string;
  JZBL: string;
  TEXCH: string;
  ISINVISBL: string;
  PCTNVCHGTYPE: string;
  PCTNVCHG: string;
  NEWTEXCH: string;
  INDEXCODE: string;
  INDEXNAME: string;
}
