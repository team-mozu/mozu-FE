import { Toast } from "@mozu/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createItem, deleteItem, updateItem } from "../api";
import type { ItemCreateRequest, ItemCreateResponse, ItemEditRequest, ItemEditResponse } from "../api/type";

/**
 * 새로운 투자 종목을 생성하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 생성된 종목 상세 페이지로 이동합니다.
 * @param {ItemCreateRequest} data - 생성할 종목 데이터
 * @returns {UseMutationResult} 종목 생성 mutation 객체
 */
export const useCreateStock = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: ItemCreateRequest) => createItem(data),
    onSuccess: (res: ItemCreateResponse) => {
      Toast("성공적으로 생성되었습니다.", {
        type: "success",
      });
      navigate(`/stock-management/${res.itemId}`);
    },
  });
};

/**
 * 투자 종목을 삭제하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 캐시를 무효화하여 목록을 새로고침합니다.
 * @param {string} id - 삭제할 종목의 ID (UUID)
 * @param {Function} [onSuccessCallback] - 삭제 성공 시 실행될 콜백 함수 (주로 모달 닫기)
 * @returns {UseMutationResult} 종목 삭제 mutation 객체
 */
export const useDeleteStock = (id?: number, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteItem(id!),
    onSuccess: () => {
      Toast("성공적으로 삭제되었습니다.", {
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getStock",
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
 * 기존 투자 종목의 정보를 수정하는 React Query Mutation 훅입니다.
 * 성공 시 성공 토스트를 표시하고 캐시를 무효화한 후 상세 페이지로 이동합니다.
 * @param {string} id - 수정할 종목의 ID (UUID)
 * @param {ItemEditRequest} data - 수정할 종목 데이터
 * @returns {UseMutationResult} 종목 수정 mutation 객체
 */
export const useStockUpdate = (id?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ItemEditRequest) => updateItem(id!, data),
    onSuccess: (res: ItemEditResponse) => {
      Toast("성공적으로 수정되었습니다.", {
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getStock",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "getStock",
          id,
        ],
      });
      navigate(`/stock-management/${res.itemId}`);
    },
    onError: () => {},
  });
};
