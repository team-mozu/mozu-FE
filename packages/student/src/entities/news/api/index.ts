import { instance } from "@mozu/util-config";
import { useQuery } from "@tanstack/react-query";
import type { ArticleListResponse } from "./type";

const router = "/lesson";

export const useGetArticleList = () => {
  return useQuery({
    queryKey: [
      "news",
      "list",
    ],
    queryFn: async () => {
      const { data } = await instance.get<ArticleListResponse>(`${router}/team/articles`);
      return data;
    },
    staleTime: 5000,
  });
};
