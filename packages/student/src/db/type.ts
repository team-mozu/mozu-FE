export interface Team {
  id?: number;
  cashMoney: number;
}

export interface TradeHistory {
  id?: number;
  itemId: number;
  itemName: string;
  itemMoney: number;
  orderCount: number;
  totalMoney: number;
  orderType: 'BUY' | 'SELL';
  invDeg: number;
  timestamp: Date;
  originalBuyMoney?: number; // 매수 단가
  originalValMoney?: number; // 평가 금액
  originalValProfit?: number; // 평가 수익
}

export interface Item {
  id?: number;
  itemId: number;
  itemName: string;
  itemCnt: number; // 기존 필드
  tradeCount?: number; // 새로 추가할 필드 (옵셔널)
  buyMoney: number;
  nowMoney: number;
  totalMoney: number;
  valMoney: number;
  valProfit: number;
  profitNum: number;
}

export interface ItemIndex {
  itemId: number; // Primary key
  tradeCount: number;
  createdAt: Date; // Add createdAt field
  updatedAt: Date;
}
