export type HoldItemsResponse = ItemType[];

export type ItemType = {
  id: string;
  itemId: number;
  itemName: string;
  avgPurchasePrice: number;
  quantity: number;
  totalMoney: number;
  nowMoney: number;
  valuationMoney: number;
  valProfit: number;
  profitNum: number;
};
