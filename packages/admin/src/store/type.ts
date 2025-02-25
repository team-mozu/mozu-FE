export type classArticle = {
  invDeg: number;
  articles: number[];
};

export type classItem = {
  itemId: number;
  money: number[];
};

export type classData = {
  id: number;
  name: string;
  maxInvDeg: number;
  curInvDeg: number | null;
  baseMoney: string;
  classNum: number | null;
  starYN: boolean;
  createdAt: string;
  deleteYN: boolean;
  classArticles: classArticle[];
  classItems: classItem[];
};

export type classStore = {
  classData: classData | null;
  setClassData: (data: classData) => void;
  resetClassData: () => void;
};
