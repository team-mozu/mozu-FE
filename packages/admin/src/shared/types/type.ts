export type Article = {
  id: string;
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

// API와 일치하는 수업 데이터 타입
export type ClassData = {
  lessonName: string;
  baseMoney: number;
  lessonRound: number;
  lessonItems: {
    itemId: number;
    money: number[];
  }[];
  lessonArticles: {
    investmentRound: number;
    articles: string[];
  }[];
};
