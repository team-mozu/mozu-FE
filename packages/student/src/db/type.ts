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
}

export interface Item {
  id: number;
  itemId: number;
  itemName: string;
  itemCnt: number;
  buyMoney: number;
  totalMoney: number;
  nowMoney: number;
  valMoney: number;
  valProfit: number;
  profitNum: number;
}
