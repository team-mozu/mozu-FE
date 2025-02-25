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
  curInvDeg: null | number;
  baseMoney: string;
  classNum: null;
  starYN: boolean;
  createdAt: string;
  deleteYN: boolean;
  classArticles: ClassArticle[];
  classItems: ClassStock[];
};

export type ClassArticle = {
  invDeg: number;
  articles: number[];
};

export type ClassStock = {
  itemId: number;
  money: number[];
};

// class/create
export type ClassCreateRequest = {
  className: string;
  baseMoney: number;
  classDeg: number;
  classItems: ClassItemRequest[];
};

export type ClassItemRequest = {
  id: number;
  money: string;
};

export type ClassArticleRequest = {
  invDeg: number;
  article: number[];
};
