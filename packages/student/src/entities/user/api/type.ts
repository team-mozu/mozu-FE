export interface AuthResponse {
  accessToken: string;
}

export interface StudentLoginProps {
  classNum: number | null;
  schoolName: string;
  teamName: string;
}

export type TeamDeatilResponse = {
  id: number;
  name: string;
  baseMoney: number;
  totalMoney: number;
  cashMoney: number;
  valueMoney: number;
  invDeg: number;
  maxInvDeg: number;
  valueProfit: number;
  profitNum: string;
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
