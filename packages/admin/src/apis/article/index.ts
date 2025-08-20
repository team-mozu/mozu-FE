import { instance } from "@mozu/util-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type {
  ArticleAddRequest,
  ArticleDetailResponse,
  ArticleListResponse,
  ArticleManagementEditRequest,
} from "./type";

const router = "/article";

export const useAddArticle = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (addData: ArticleAddRequest) => {
      return await instance.post(`${router}`, addData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: response => {
      const id = response.data.id;
      navigate(`/article-management/${id}`);
    },
    onError: () => {},
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: number) => {
      return await instance.delete(`${router}/${articleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "getArticle",
        ],
      });
    },
    onError: () => {},
  });
};

export const useGetArticleDetail = (articleId: number | null | undefined) => {
  return useQuery({
    queryKey: [
      "getArticle",
      articleId,
    ],
    queryFn: async () => {
      if (!articleId) throw new Error("err");
      const { data } = await instance.get<ArticleDetailResponse>(`${router}/${articleId}`);
      return data;
    },
    enabled: !!articleId,
  });
};

export const useGetArticleList = () => {
  return useQuery({
    queryKey: [
      "getArticle",
    ],
    queryFn: async () => {
      try {
        const { data } = await instance.get<{
          article: ArticleListResponse[];
        }>(router);
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const useEditArticle = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ArticleManagementEditRequest) => {
      const { articleId: _, ...datas } = data;

      return await instance.post(`${router}/${data.articleId}`, datas, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      navigate(-1);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    onError: () => {},
  });
};
