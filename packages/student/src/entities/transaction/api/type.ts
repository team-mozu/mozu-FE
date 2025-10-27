export type TeamCashType = {
  cashMoney: number;
  valueMoney: number;
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

export type TeamRankResponse = TeamRank[];

export type TeamRank = {
  id: string;
  teamName: string;
  schoolName: string;
  totalMoney: number;
  isMyTeam: boolean;
};
