export type TeamCurrentGetResponse = {
  id: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  orderCount: number;
  totalMoney: number;
  orderType: "BUY" | "SELL";
  invCount: number;
};

export type TeamHoldItemGetResponse = {
  id: string;
  itemId: string;
  itemName: string;
  avgPurchasePrice: number;
  quantity: number;
  totalMoney: number;
  nowMoney: number;
  valuationMoney: number;
  valProfit: number;
  profitNum: number;
};
