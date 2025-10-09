// 공통 타입 정의
export interface BaseArticle {
  id: string;
  articleName: string;
  articleDesc: string;
  articleImg?: string | null;
  createdAt: string;
  isDeleted: boolean;
}

export interface BaseArticleRequest {
  articleName: string;
  articleDesc: string;
  articleImage?: string | null | File;
}

// --------------------
// GET RESPONSE
// --------------------
export type ArticleListResponse = BaseArticle;
export type ArticleDetailResponse = BaseArticle;

// --------------------
// CREATE REQUEST / RESPONSE
// --------------------
export type ArticleAddRequest = BaseArticleRequest;
export type ArticleAddResponse = BaseArticle;

// --------------------
// EDIT REQUEST / RESPONSE
// --------------------
export type ArticleEditRequest = BaseArticleRequest;
export type ArticleEditResponse = BaseArticle;
