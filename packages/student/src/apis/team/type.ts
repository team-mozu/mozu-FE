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

export type TeamEndProps = TeamEndData[];

export type TeamEndData = {
  itemId: number;
  itemName: string;
  itemMoney: number;
  orderCount: number;
  totalMoney: number;
  orderType: "BUY" | "SELL";
};

export type TeamOrdersResponse = TeamOrdersData[];

export type TeamOrdersData = {
  id: number;
  itemId: number;
  itemName: string;
  itemMoney: number;
  orderCount: number;
  totalMoney: number;
  orderType: "BUY" | "SELL";
  invDeg: number;
};

export type TeamResultResponse = {
  id: number;
  name: string;
  baseMoney: number;
  totalMoney: number;
  invDeg: number;
  valueProfit: number;
  profitNum: string;
  orderCount: number;
};

export type TeamRankResponse = TeamRank[];

export type TeamRank = {
  id: number;
  name: string;
  schoolName: string;
  totalMoney: number;
  isMyTeam: boolean;
};
