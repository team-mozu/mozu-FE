export interface AuthResponse {
  accessToken: string;
}

export interface StudentLoginProps {
  lessonNum: number | null;
  schoolName: string;
  teamName: string;
}

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

export type TeamEndData = {
  id?: string;
  itemId: number;
  itemName: string;
  itemPrice: number;
  orderCount: number;
  totalMoney: number;
  orderType: "BUY" | "SELL";
  invCount: number;
};

export type TeamEndProps = TeamEndData[];

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
