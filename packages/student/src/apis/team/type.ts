export type TeamDeatilResponse = {
  id: number;
  name: string;
  baseMoney: number;
  totalMoney: number;
  cashMoney: number;
  valueMoney: number;
  invDeg: number;
  valueProfit: number;
  profitNum: string;
};

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

export type TeamEndResponse = {
  itemId: number;
  itemName: string;
  itemMoney: number;
  orderCount: number;
  totalMoney: number;
  orderType: string;
};
