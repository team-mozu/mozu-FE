export type StockAddRequest = {
  name: string;
  info: string;
  logo: File | string;
  money: number;
  debt: number;
  capital: number;
  profit: number;
  profitOG: number;
  profitBen: number;
  netProfit: number;
};

export type StockDetailResponse = {
  name: string;
  info: string;
  logo: string;
  money: number;
  debt: number;
  capital: number;
  profit: number;
  profitOG: number;
  profitBen: number;
  netProfit: number;
  stockId: number;
};

export type StockManagementEditRequest = {
  name: string;
  info: string;
  logo: File | string | null;
  money: number;
  debt: number;
  capital: number;
  profit: number;
  profitOG: number;
  profitBen: number;
  netProfit: number;
  stockId: number;
};

export type StockListResponse = {
  id: number;
  name: string;
};
