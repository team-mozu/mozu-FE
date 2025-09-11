export type HoldItemsResponse = ItemType[];

export type ItemType = {
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
};
