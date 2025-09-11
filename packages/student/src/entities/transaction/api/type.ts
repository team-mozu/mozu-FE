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
