export type TeamDeatilResponse = {
  id: string;
  teamName: string;
  baseMoney: number;
  totalMoney: number;
  cashMoney: number;
  valuationMoney: number;
  curInvRound: number;
  valProfit: number;
  profitNum: string;
  maxInvRound: number;
};

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

export type TeamEndProps = TeamEndData[];

export type TeamCashType = {
  cashMoney: number;
  valueMoney: number;
};

export type TeamEndData = {
  itemId: number;
  itemName: string;
  itemPrice: number;
  orderCount: number;
  totalMoney: number;
  orderType: "BUY" | "SELL";
};

export type TeamOrdersResponse = TeamOrdersData[];

export type TeamOrdersData = {
  id: string;
  itemId: number;
  itemName: string;
  itemPrice: number;
  orderCount: number;
  totalMoney: number;
  orderType: "BUY" | "SELL";
  invCount: number;
};

export type TeamResultResponse = {
  id: string;
  teamName: string;
  baseMoney: number;
  totalMoney: number;
  invRound: number;
  valProfit: number;
  profitNum: string;
  orderCount: number;
};

export type TeamRankResponse = TeamRank[];

export type TeamRank = {
  id: string;
  teamName: string;
  schoolName: string;
  totalMoney: number;
  isMyTeam: boolean;
};
