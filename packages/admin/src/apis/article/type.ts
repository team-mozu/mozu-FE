export type ArticleAddRequest = {
  title?: string;
  description?: string;
  image?: File | string;
};

export type ArticleDetailResponse = {
  id: number;
  title: string;
  description: string;
  image?: string;
  createDate: string;
  deleteYN: boolean;
};

export type ArticleManagementEditRequest = {
  title?: string;
  description?: string;
  image?: File;
  articleId: number;
};

export type ArticleListResponse = {
  id: number;
  title: string;
  date: string;
};
