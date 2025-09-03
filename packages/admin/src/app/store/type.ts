export type Article = {
  id: number;
  title: string;
  articleChecked?: boolean;
};

export type ClassStock = {
  itemId: number;
  itemName?: string;
  money?: number[];
  currentPrice?: number;
  level1?: number;
  level2?: number;
  level3?: number;
  level4?: number;
  level5?: number;
  stockChecked?: boolean;
};

export type ClassArticle = {
  invDeg: number;
  articles: Article[];
  articleGroupChecked?: boolean;
};

export type ClassData = {
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
