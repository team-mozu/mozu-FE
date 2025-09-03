// /class
export type ClassResponse = {
  classes: ClassItem[];
};

export type ClassItem = {
  id: number;
  name: string;
  starYN: boolean;
  date: string;
};

// /class/:id
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
};

// class/create
export type ClassCreateRequest = {
  className: string;
  baseMoney: number;
  classDeg: number;
  classItems: ClassItemRequest[];
  classArticles: ClassArticleRequest[];
};

export type ClassItemRequest = {
  id: number;
  money: number[];
};

export type ClassArticleRequest = {
  invDeg: number;
  articles: number[];
};

// class/edit

export type ClassData = {
  className: string;
  classDeg: number;
  baseMoney: number;
  classItems: {
    id: number;
    money: number[];
  }[];
  classArticles: {
    invDeg: number;
    articles: number[];
  }[];
};

export type TeamDealsResponse = {
  id: number;
  itemId: number;
  itemName: string;
  itemMoney: number;
  orderCount: number;
  totalMoney: number;
  orderType: string;
  invDeg: number;
};
