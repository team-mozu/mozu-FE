export type ArticleListResponse = ArticleDetail[];

export type ArticleDetail = {
  articleId: number;
  title: string;
  description: string;
  image: string;
};
