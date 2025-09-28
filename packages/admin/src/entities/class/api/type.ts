// 공통 타입 정의
type BaseLessonItem = {
  itemId: number;
  itemName: string;
  money: number[];
};

type BaseArticle = {
  id: string;
  articleName: string;
  articleDesc: string;
  articleImg: string | null;
  createdAt: string;
  isDeleted: boolean;
};

// --------------------
// GET / LIST RESPONSE
// --------------------
export type LessonGetListResponse = {
  lessons: LessonSummary[];
};

type LessonSummary = {
  id: string;
  name: string;
  isStarred: boolean;
  date: string;
};

export type LessonGetDetailResponse = {
  id: string;
  name: string;
  maxInvRound: number;
  curInvRound: number | null;
  baseMoney: number;
  lessonNum: string;
  isInProgress: boolean;
  isStarred: boolean;
  isDeleted: boolean;
  createdAt: string;
  lessonItems: LessonItemDetail[];
  lessonArticles: LessonArticleDetail[];
};

type LessonItemDetail = BaseLessonItem;

type LessonArticleDetail = {
  investmentRound: number;
  articles: LessonArticles[];
};

type LessonArticles = {
  articleId: string;
  title: string;
};

// --------------------
// CREATE REQUEST / RESPONSE
// --------------------
export type LessonCreateRequest = {
  lessonName: string;
  baseMoney: number;
  lessonRound: number;
  lessonItems: LessonItemRequest[];
  lessonArticles: LessonArticleRequest[];
};

type LessonItemRequest = {
  itemId: number;
  money: number[];
};

type LessonArticleRequest = {
  investmentRound: number;
  articles: string[];
};

export type LessonCreateResponse = LessonGetDetailResponse;

// --------------------
// EDIT REQUEST
// --------------------
export type LessonEditDetailRequest = {
  lessonName: string;
  baseMoney: number;
  lessonRound: number;
  lessonItems: LessonItemRequest[];
  lessonArticles: LessonArticleRequest[];
};

export type LessonEditResponse = LessonGetDetailResponse;

// --------------------
// START RESPONSE
// --------------------
export type LessonStartResponse = {
  lessonCode: string;
};

// TODO: sse API..

// --------------------
// ITEM / ARTICLE LIST
// --------------------
export type LessonGetItemListResponse = BaseLessonItem;

export type LessonGetArticleListResponse = {
  investmentRound: number;
  articles: BaseArticle[];
};
