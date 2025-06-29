export type TeamTradeStatus = {
  id: number;
  itemId: number;
  itemName: string;
  itemMoney: number;
  orderCount: number;
  totalMoney: number;
  orderType: 'BUY' | 'SELL';
  invDeg: number;
};

export type HoldItem = {
  id: number; // 거래 ID
  itemId: number; // 종목 ID
  itemName: string; // 종목 이름
  itemCnt: number; // 수량
  buyMoney: number; // 매입 단가
  totalMoney: number; // 총 매입 금액
  nowMoney: number; // 현재 가격
  valMoney: number; // 평가 금액
  valProfit: number; // 평가 손익
  profitNum: number; // 수익률 (단위: %, 소수)
};
