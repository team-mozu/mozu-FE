import { useQuery } from "@tanstack/react-query";
import { instance } from "@configs/util";
import { ArticleListResponse } from "./type";

const router = "/class/team";

export const useGetArticleList = () => {
  return useQuery({
    queryKey: ["getArticle"],
    queryFn: async () => {
      const { data } = await instance.get<ArticleListResponse>(
        `${router}/classArticle`
      );
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
