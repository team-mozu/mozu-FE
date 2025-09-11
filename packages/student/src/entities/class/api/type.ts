export type ClassResponse = {
  itemId: number;
  itemName: string;
  itemLogo: string;
  nowMoney: number;
  profitMoney: number;
  profitNum: string;
};

export type ClassDetailResponse = {
  id: number;
  name: string;
  maxInvDeg: number;
  curInvDeg: number | null;
  baseMoney: number;
  classNum: number | null;
  progressYN: boolean;
  starYN: boolean;
  createdAt: string;
  deleteYN: boolean;
  classArticles: ClassArticle[];
  classItems: ClassStock[];
};

export type ClassArticle = {
  invDeg: number;
  articles: Article[];
};

export type ClassStock = {
  itemId: number;
  itemName: string;
  money: number[];
};

export type Article = {
  id: number;
  title: string;
  description: string;
  image: string;
};
