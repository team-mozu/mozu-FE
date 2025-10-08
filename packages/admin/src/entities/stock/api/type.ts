// 공통 타입 정의
export interface BaseStock {
  itemId: number;
  itemName: string;
  itemInfo: string;
  itemLogo?: string | null;
  money: number;
  debt: number;
  capital: number;
  profit: number;
  profitOg: number;
  profitBenefit: number;
  netProfit: number;
  isDeleted: boolean;
  createdAt: string;
}

export interface BaseStockRequest {
  itemName: string;
  itemInfo: string;
  itemLogo?: string | null | File;
  money: number;
  debt: number;
  capital: number;
  profit: number;
  profitOg: number;
  profitBenefit: number;
  netProfit: number;
}

// --------------------
// GET RESPONSE
// --------------------
export type ItemGetListResponse = Pick<BaseStock, "itemId" | "itemName" | "createdAt">;
export type ItemGetDetailResponse = BaseStock;

// --------------------
// CREATE REQUEST / RESPONSE
// --------------------
export type ItemCreateRequest = BaseStockRequest;
export type ItemCreateResponse = BaseStock;

// --------------------
// EDIT REQUEST / RESPONSE
// --------------------
export type ItemEditRequest = BaseStockRequest;
export type ItemEditResponse = BaseStock;
