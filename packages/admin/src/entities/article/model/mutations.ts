import { Toast } from "@mozu/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createArticle, deleteArticle, updateArticle } from "../api";
import type { ArticleAddRequest, ArticleAddResponse, ArticleEditRequest, ArticleEditResponse } from "../api/type";

/**
 * 새로운 기사를 생성하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 생성된 기사 상세 페이지로 이동합니다.
 * @param {ArticleAddRequest} data - 생성할 기사 데이터
 * @returns {UseMutationResult} 기사 생성 mutation 객체
 */
export const useCreateArticle = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: ArticleAddRequest) => createArticle(data),
    onSuccess: (res: ArticleAddResponse) => {
      Toast("성공적으로 생성되었습니다.", {
        type: "success",
      });
      navigate(`/article-management/${res.id}`);
    },
  });
};

/**
 * 기사를 삭제하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 캐시를 무효화하여 목록을 새로고침합니다.
 * @param {string} id - 삭제할 기사의 ID (UUID)
 * @param {Function} [onSuccessCallback] - 삭제 성공 시 실행될 콜백 함수 (주로 모달 닫기)
 * @returns {UseMutationResult} 기사 삭제 mutation 객체
 */
export const useDeleteArticle = (id?: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteArticle(id!),
    onSuccess: () => {
      Toast("성공적으로 삭제되었습니다.", {
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getArticle",
        ],
      });
      if (onSuccessCallback) {
        onSuccessCallback(); // 모달 닫기 실행
      }
    },
    onError: () => {},
  });
};

/**
 * 기존 기사의 정보를 수정하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 캐시를 무효화한 후 상세 페이지로 이동합니다.
 * @param {string} id - 수정할 기사의 ID (UUID)
 * @param {ArticleEditRequest} data - 수정할 기사 데이터
 * @returns {UseMutationResult} 기사 수정 mutation 객체
 */
export const useArticleUpdate = (id?: string, data?: ArticleEditRequest) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("id가 없습니다."); // 안전하게 가드
      if (!data) throw new Error("data가 없습니다."); // 안전하게 가드
      return updateArticle(id, data);
    },
    onSuccess: (res: ArticleEditResponse) => {
      Toast("성공적으로 수정되었습니다.", {
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getArticle",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getArticle",
          id,
        ],
      });
      navigate(`/article-management/${res.id}`);
    },
  });
};
