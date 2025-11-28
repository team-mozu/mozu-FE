export interface AuthResponse {
  accessToken: string;
}

export interface StudentLoginProps {
  lessonNum: number | null;
  schoolName: string;
  teamName: string;
}

export type TeamDetailResponse = {
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
  investingMoney: number; // 투자중인 금액 (매입한 주식 총액)
  availableMoney: number; // 주문 가능 금액 (보유 현금)
};
