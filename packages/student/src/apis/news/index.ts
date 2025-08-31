import { instance } from "@mozu/util-config";
import { useQuery } from "@tanstack/react-query";
import type { ArticleListResponse } from "./type";

const router = "/class/team";

export const useGetArticleList = () => {
  return useQuery({
    queryKey: ["news", "list"],
    queryFn: async () => {
      const { data } = await instance.get<ArticleListResponse>(
        `${router}/classArticle`
      );
      return data;
    },
    staleTime: 5000,
  });
};
