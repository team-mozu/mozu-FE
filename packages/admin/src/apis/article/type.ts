export type ArticleAddRequest = {
  title?: string,
  description?: string,
  image?: File,
}


export type ArticleDetailResponse = {
  title: string;
   description: string;
   image?: string;
}


export type ArticleManagementEditRequest = {
  title?: string,
  description?: string,
  image?: File,
  articleId: number
}

